import type {
  AdminUser,
  AuditLog,
  AuditAction,
  Bill,
  Contractor,
  ContractorDocument,
  FieldProgress,
  Inspection,
  Measurement,
  SLARule,
  SystemRole,
  WorkOrder,
  WorkOrderEvent,
  WorkOrderStatus,
  WorkPackage,
} from "./types";

export function getApiBaseUrl(): string {
  const envUrl = ((import.meta.env as any)?.VITE_API_BASE_URL as string | undefined)?.trim();
  if (
    !envUrl ||
    envUrl.includes("civicsathi-backend.onrender.com") ||
    envUrl.includes("civicsathi.onrender.com") ||
    envUrl.includes("janmind.onrender.com") ||
    (typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      envUrl.startsWith("http://"))
  ) {
    return "https://civic-sathi-f7ml.onrender.com";
  }
  return envUrl;
}

export const API_BASE_URL = getApiBaseUrl();

// ---------------------------------------------------------------- Utilities

async function fetchStore<T>(collection: string, method = "GET", body?: unknown): Promise<T> {
  const store: Record<string, any> = {};

  const storageKey = `civicsathi_admin_${collection}`;
  let data = store[collection] || [];
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) data = JSON.parse(cached);
    else localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {}

  if (method === "GET") return data as T;

  if (method === "POST") {
    const newItem = { id: Date.now().toString(), ...(body as any) };
    data = [...data, newItem];
    localStorage.setItem(storageKey, JSON.stringify(data));
    return newItem as T;
  }

  return data as T;
}

async function fetchStorePatch<T>(collection: string, id: string, body: any): Promise<T> {
  const storageKey = `civicsathi_admin_${collection}`;
  let data: any[] = [];
  try {
    const cached = localStorage.getItem(storageKey);
    if (cached) data = JSON.parse(cached);
  } catch {}

  const idx = data.findIndex((item) => item.id === id);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...body };
    localStorage.setItem(storageKey, JSON.stringify(data));
    return data[idx] as T;
  }
  return { id, ...body } as T;
}

// ---------------------------------------------------------------- Audit helper

async function appendAudit(
  actorId: string,
  actorName: string,
  actorRole: SystemRole,
  action: AuditAction,
  entityType: AuditLog["entityType"],
  entityId: string,
  entityLabel: string,
  opts?: { previousValue?: string; newValue?: string; reason?: string },
) {
  const entry: Partial<AuditLog> = {
    actorId,
    actorName,
    actorRole,
    action,
    entityType,
    entityId,
    entityLabel,
    ...(opts?.previousValue ? { previousValue: opts.previousValue } : {}),
    ...(opts?.newValue ? { newValue: opts.newValue } : {}),
    ...(opts?.reason ? { reason: opts.reason } : {}),
    at: new Date().toISOString(),
  };
  try {
    await adminApiFetch("/api/v1/admin/audit-logs", {
      method: "POST",
      body: JSON.stringify({
        actor_id: entry.actorId,
        actor_name: entry.actorName,
        actor_role: entry.actorRole,
        action: entry.action,
        entity_type: entry.entityType,
        entity_id: entry.entityId,
        entity_label: entry.entityLabel,
        previous_value: entry.previousValue,
        new_value: entry.newValue,
        reason: entry.reason,
      }),
    });
  } catch (error) {
    console.warn("Audit log could not be persisted", error);
  }
}

// ================================================================ Contractors

function normalizeRealContractor(raw: any): Contractor {
  const registrations = Array.isArray(raw?.registrations) ? raw.registrations : [];
  const first = registrations[0] ?? {};
  const hasApproved = registrations.some((r: any) => r?.status === "APPROVED");
  const hasPending = registrations.some((r: any) => r?.status === "PENDING");
  const status: Contractor["status"] = hasApproved
    ? "VERIFIED"
    : hasPending
      ? "PENDING_VERIFICATION"
      : "SUSPENDED";
  const categories = registrations.flatMap((r: any) => Array.isArray(r?.approved_categories) ? r.approved_categories : []);
  const serviceAreas = registrations.map((r: any) => r?.city_name).filter(Boolean);
  return {
    id: String(raw?.id ?? ""),
    companyName: raw?.company_name ?? raw?.companyName ?? "Unnamed contractor",
    registrationNumber: first?.registration_number ?? "Not registered",
    contactPerson: raw?.contact_person ?? raw?.contactPerson ?? "",
    email: raw?.email ?? "",
    phone: raw?.phone ?? "",
    address: "",
    gstin: "",
    pan: "",
    status,
    verificationStatus: hasApproved ? "VERIFIED" : hasPending ? "PENDING" : "REJECTED",
    registrationDate: raw?.created_at ?? "",
    expiryDate: "",
    specializationCategories: Array.from(new Set(categories)) as Contractor["specializationCategories"],
    serviceAreas: Array.from(new Set(serviceAreas)),
    performanceScore: Number(raw?.performance_score ?? 0),
    slaScore: Number(raw?.sla_score ?? 0),
    inspectionPassRate: Number(raw?.inspection_pass_rate ?? 0),
    onTimeCompletionRate: Number(raw?.on_time_completion_rate ?? 0),
    reworkRate: Number(raw?.rework_rate ?? 0),
    rating: Number(raw?.public_rating ?? 0),
    activeWorkCount: Number(raw?.active_work_count ?? 0),
    totalCompleted: Number(raw?.total_completed ?? 0),
    createdAt: raw?.created_at ?? "",
    updatedAt: raw?.updated_at ?? raw?.created_at ?? "",
  };
}

export async function getContractors(): Promise<Contractor[]> {
  const raw = await listRealContractors();
  return raw.map(normalizeRealContractor);
}

export async function getContractor(id: string): Promise<Contractor | null> {
  const list = await getContractors();
  return list.find((c) => c.id === id) ?? null;
}

export async function createContractor(
  input: Omit<Contractor, "id" | "createdAt" | "updatedAt">,
): Promise<Contractor> {
  const contractor = await fetchStore<Contractor>("contractors", "POST", {
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await appendAudit(
    "system",
    "System",
    "admin",
    "WORK_ORDER_CREATED",
    "contractor",
    contractor.id,
    contractor.companyName,
  );
  return contractor;
}

export async function updateContractor(
  id: string,
  patch: Partial<Contractor>,
): Promise<Contractor> {
  return fetchStorePatch<Contractor>("contractors", id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export async function verifyContractor(
  id: string,
  actorId: string,
  actorName: string,
): Promise<Contractor> {
  const raw = (await listRealContractors()).find((c: any) => String(c?.id) === id);
  const registration = raw?.registrations?.[0];
  if (!registration?.id) throw new Error("This contractor has no city registration to verify");
  await updateContractorRegistration(id, registration.id, "APPROVED", registration.approved_categories ?? []);
  const updated = normalizeRealContractor({ ...raw, registrations: raw.registrations.map((r: any) => r.id === registration.id ? { ...r, status: "APPROVED" } : r) });
  await appendAudit(
    actorId,
    actorName,
    "admin",
    "CONTRACTOR_VERIFIED",
    "contractor",
    id,
    updated.companyName,
  );
  return updated;
}

export async function suspendContractor(
  id: string,
  actorId: string,
  actorName: string,
  reason: string,
): Promise<Contractor> {
  const raw = (await listRealContractors()).find((c: any) => String(c?.id) === id);
  const registration = raw?.registrations?.[0];
  if (!registration?.id) throw new Error("This contractor has no city registration to suspend");
  await updateContractorRegistration(id, registration.id, "REVOKED", registration.approved_categories ?? []);
  const updated = normalizeRealContractor({ ...raw, registrations: raw.registrations.map((r: any) => r.id === registration.id ? { ...r, status: "REVOKED" } : r) });
  await appendAudit(
    actorId,
    actorName,
    "admin",
    "CONTRACTOR_SUSPENDED",
    "contractor",
    id,
    updated.companyName,
    { reason },
  );
  return updated;
}

// ================================================================ Contractor Documents

export async function getContractorDocuments(contractorId: string): Promise<ContractorDocument[]> {
  const docs = await fetchStore<ContractorDocument[]>("contractorDocuments");
  return docs.filter((d) => d.contractorId === contractorId);
}

// ================================================================ Work Packages

export async function getWorkPackages(cityId?: string): Promise<WorkPackage[]> {
  const packages = await fetchStore<WorkPackage[]>("workPackages");
  return cityId ? packages.filter((p) => p.cityId === cityId) : packages;
}

export async function getWorkPackage(id: string): Promise<WorkPackage | null> {
  const packages = await fetchStore<WorkPackage[]>("workPackages");
  return packages.find((p) => p.id === id) ?? null;
}

export async function createWorkPackage(
  input: Omit<WorkPackage, "id" | "createdAt" | "updatedAt">,
  actorId: string,
  actorName: string,
): Promise<WorkPackage> {
  const wp = await fetchStore<WorkPackage>("workPackages", "POST", {
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await appendAudit(
    actorId,
    actorName,
    "officer",
    "WORK_PACKAGE_CREATED",
    "work_package",
    wp.id,
    wp.title,
  );
  return wp;
}

export async function updateWorkPackage(
  id: string,
  patch: Partial<WorkPackage>,
): Promise<WorkPackage> {
  return fetchStorePatch<WorkPackage>("workPackages", id, {
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

// ================================================================ Work Orders

function normalizeRealWorkOrder(raw: any): WorkOrder {
  return {
    id: String(raw?.id ?? ""),
    workPackageId: String(raw?.tender_id ?? ""),
    contractorId: String(raw?.contractor_id ?? ""),
    contractorName: raw?.contractor_name ?? "Unassigned",
    departmentId: String(raw?.department_id ?? ""),
    department: (raw?.department ?? "General") as WorkOrder["department"],
    title: raw?.title ?? "Untitled work order",
    description: raw?.description ?? "",
    cityId: raw?.city ?? raw?.city_id ?? "",
    ward: raw?.ward ?? "",
    area: raw?.area ?? "",
    lat: Number(raw?.lat ?? 0),
    lng: Number(raw?.lng ?? 0),
    priority: "Moderate",
    estimatedCost: Number(raw?.award_value ?? raw?.estimated_budget ?? 0),
    approvedAmount: Number(raw?.award_value ?? 0),
    startDate: raw?.created_at ?? "",
    expectedCompletionDate: raw?.target_completion_date ?? "",
    slaDeadline: raw?.target_completion_date ?? raw?.created_at ?? "",
    status: String(raw?.status ?? "ISSUED") as WorkOrderStatus,
    boqItems: [],
    createdBy: "backend",
    createdAt: raw?.created_at ?? "",
    updatedAt: raw?.updated_at ?? raw?.created_at ?? "",
  };
}

export async function getWorkOrders(filters?: {
  contractorId?: string;
  cityId?: string;
  status?: WorkOrderStatus;
}): Promise<WorkOrder[]> {
  let list = (await listRealWorkOrders()).map(normalizeRealWorkOrder);
  if (filters?.contractorId) list = list.filter((w) => w.contractorId === filters.contractorId);
  if (filters?.cityId) list = list.filter((w) => w.cityId === filters.cityId);
  if (filters?.status) list = list.filter((w) => w.status === filters.status);
  return list;
}

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  const list = await getWorkOrders();
  return list.find((w) => w.id === id) ?? null;
}

export async function createWorkOrder(
  input: Omit<WorkOrder, "id" | "createdAt" | "updatedAt">,
  actorId: string,
  actorName: string,
): Promise<WorkOrder> {
  const slaDeadline = new Date();
  slaDeadline.setHours(slaDeadline.getHours() + 48); // Simple 48hr SLA for mock

  const wo = await fetchStore<WorkOrder>("workOrders", "POST", {
    ...input,
    slaDeadline: slaDeadline.toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  if (wo.workPackageId) {
    await updateWorkPackage(wo.workPackageId, { workOrderId: wo.id, status: "CONTRACTED" });
  }

  await appendWorkOrderEvent(wo.id, {
    eventType: "STATUS_CHANGE",
    toStatus: "DRAFT",
    title: "Work Order Created",
    description: `Work order created and assigned to ${wo.contractorName}.`,
    actorId,
    actorName,
    actorRole: "officer",
  });

  await appendAudit(
    actorId,
    actorName,
    "officer",
    "WORK_ORDER_CREATED",
    "work_order",
    wo.id,
    wo.title,
    { newValue: wo.contractorName },
  );
  return wo;
}

export async function updateWorkOrderStatus(
  id: string,
  newStatus: WorkOrderStatus,
  actorId: string,
  actorName: string,
  actorRole: SystemRole,
  reason?: string,
): Promise<WorkOrder> {
  const current = await getWorkOrder(id);
  if (!current) throw new Error("Work order not found");
  const previousStatus = current.status;

  const patch: Partial<WorkOrder> = {
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(reason ? { rejectionReason: reason } : {}),
  };
  if (newStatus === "IN_PROGRESS" && current.status !== "IN_PROGRESS") {
    patch.actualStartDate = new Date().toISOString();
  }
  if (newStatus === "COMPLETED" || newStatus === "CLOSED") {
    patch.actualCompletionDate = current.actualCompletionDate || new Date().toISOString();
  }

  const updatedWo = await fetchStorePatch<WorkOrder>("workOrders", id, patch);

  await appendWorkOrderEvent(id, {
    eventType: "STATUS_CHANGE",
    fromStatus: previousStatus,
    toStatus: newStatus,
    title: `Status changed to ${newStatus.replace(/_/g, " ")}`,
    description: reason ?? `Status updated by ${actorName}.`,
    actorId,
    actorName,
    actorRole,
  });

  await appendAudit(
    actorId,
    actorName,
    actorRole,
    "WORK_ORDER_STATUS_CHANGED",
    "work_order",
    id,
    current.title,
    {
      previousValue: previousStatus,
      newValue: newStatus,
      ...(reason ? { reason } : {}),
    },
  );

  return updatedWo;
}

// ================================================================ Work Order Events

export async function appendWorkOrderEvent(
  workOrderId: string,
  event: Omit<WorkOrderEvent, "id" | "workOrderId" | "at">,
) {
  return fetchStore<WorkOrderEvent>("workOrderEvents", "POST", {
    ...event,
    workOrderId,
    at: new Date().toISOString(),
  });
}

export async function getWorkOrderEvents(workOrderId: string): Promise<WorkOrderEvent[]> {
  const evts = await fetchStore<WorkOrderEvent[]>("workOrderEvents");
  return evts
    .filter((e) => e.workOrderId === workOrderId)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export async function getAllEvidence(): Promise<any[]> {
  return fetchStore<any[]>("evidence");
}

// ================================================================ Field Progress

export async function submitFieldProgress(
  input: Omit<FieldProgress, "id">,
): Promise<FieldProgress> {
  const fp = await fetchStore<FieldProgress>("fieldProgress", "POST", input);
  await appendWorkOrderEvent(fp.workOrderId, {
    eventType: "PROGRESS_UPDATE",
    title: `Progress update: ${fp.percentComplete}% complete`,
    description: fp.description,
    actorId: fp.submittedBy,
    actorName: fp.submittedBy,
    actorRole: "contractor",
    ...(fp.photoUrls?.length ? { photoUrls: fp.photoUrls } : {}),
    metadata: { percentComplete: fp.percentComplete },
  });
  return fp;
}

export async function getFieldProgress(workOrderId: string): Promise<FieldProgress[]> {
  const evts = await fetchStore<FieldProgress[]>("fieldProgress");
  return evts
    .filter((fp) => fp.workOrderId === workOrderId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

// ================================================================ Inspections

export async function recordInspection(
  input: Omit<Inspection, "id">,
  actorId: string,
  actorName: string,
): Promise<Inspection> {
  const inspection = await fetchStore<Inspection>("inspections", "POST", input);
  await appendWorkOrderEvent(inspection.workOrderId, {
    eventType: "INSPECTION",
    title: `Inspection ${inspection.result === "PASSED" ? "Passed" : "Failed"}`,
    description:
      inspection.result === "PASSED"
        ? inspection.notes
        : `Failed: ${inspection.failureReasons?.join(", ")}. ${inspection.notes}`,
    actorId,
    actorName,
    actorRole: "officer",
    ...(inspection.photoUrls?.length ? { photoUrls: inspection.photoUrls } : {}),
    metadata: { result: inspection.result },
  });
  return inspection;
}

export async function getInspections(workOrderId: string): Promise<Inspection[]> {
  const evts = await fetchStore<Inspection[]>("inspections");
  return evts.filter((i) => i.workOrderId === workOrderId);
}

// ================================================================ Measurements

export async function submitMeasurement(
  input: Omit<Measurement, "id">,
  actorId: string,
  actorName: string,
): Promise<Measurement> {
  const measurement = await fetchStore<Measurement>("measurements", "POST", input);
  await appendWorkOrderEvent(measurement.workOrderId, {
    eventType: "MEASUREMENT",
    title: "Measurement submitted",
    description: `Total measured amount: ₹${measurement.totalAmount.toLocaleString("en-IN")}`,
    actorId,
    actorName,
    actorRole: "contractor",
  });
  return measurement;
}

export async function getMeasurement(workOrderId: string): Promise<Measurement | null> {
  const evts = await fetchStore<Measurement[]>("measurements");
  return evts.find((m) => m.workOrderId === workOrderId) ?? null;
}

// ================================================================ Bills

export async function submitBill(
  input: Omit<Bill, "id" | "submittedAt">,
  actorId: string,
  actorName: string,
): Promise<Bill> {
  const bill = await fetchStore<Bill>("bills", "POST", {
    ...input,
    submittedAt: new Date().toISOString(),
    status: "SUBMITTED",
  });
  await appendWorkOrderEvent(bill.workOrderId, {
    eventType: "BILL",
    title: "Bill submitted",
    description: `Bill submitted for ₹${bill.submittedAmount.toLocaleString("en-IN")}`,
    actorId,
    actorName,
    actorRole: "contractor",
    metadata: { amount: bill.submittedAmount },
  });
  return bill;
}

export async function updateBill(id: string, patch: Partial<Bill>): Promise<Bill> {
  return fetchStorePatch<Bill>("bills", id, patch);
}

export async function getBill(workOrderId: string): Promise<Bill | null> {
  const bills = await fetchStore<Bill[]>("bills");
  return bills.find((b) => b.workOrderId === workOrderId) ?? null;
}

export async function approveBill(
  billId: string,
  workOrderId: string,
  actorId: string,
  actorName: string,
  approvedAmount: number,
): Promise<Bill> {
  return updateBill(billId, {
    status: "APPROVED",
    approvedAmount,
    approvedBy: actorName,
    approvedAt: new Date().toISOString(),
  });
}

// ================================================================ Audit Logs

export async function getAuditLogs(filters?: {
  entityType?: AuditLog["entityType"];
  actorRole?: SystemRole;
  limit?: number;
}): Promise<AuditLog[]> {
  const params = new URLSearchParams();
  if (filters?.entityType) params.set("entity_type", filters.entityType);
  if (filters?.actorRole) params.set("actor_role", filters.actorRole);
  params.set("limit", String(filters?.limit ?? 200));
  const raw = await adminApiFetch<any[]>(`/api/v1/admin/audit-logs?${params.toString()}`);
  return (Array.isArray(raw) ? raw : []).map((entry) => ({
    id: String(entry.id),
    actorId: String(entry.actor_id ?? entry.actorId ?? ""),
    actorName: String(entry.actor_name ?? entry.actorName ?? ""),
    actorRole: entry.actor_role ?? entry.actorRole ?? "admin",
    action: entry.action,
    entityType: entry.entity_type ?? entry.entityType,
    entityId: String(entry.entity_id ?? entry.entityId ?? ""),
    entityLabel: entry.entity_label ?? entry.entityLabel,
    previousValue: entry.previous_value ?? entry.previousValue,
    newValue: entry.new_value ?? entry.newValue,
    reason: entry.reason,
    at: entry.at ?? entry.created_at ?? new Date().toISOString(),
  })) as AuditLog[];
}

// ================================================================ SLA Rules

function normalizeSLARule(raw: any): SLARule {
  return {
    id: String(raw?.id ?? ""),
    category: raw?.category ?? "General",
    severity: raw?.severity ?? "LOW",
    responseHours: Number(raw?.response_hours ?? raw?.responseHours ?? 0),
    resolutionHours: Number(raw?.resolution_hours ?? raw?.resolutionHours ?? 0),
    escalationHours: Number(raw?.escalation_hours ?? raw?.escalationHours ?? 0),
    active: Boolean(raw?.is_active ?? raw?.active ?? true),
  } as SLARule;
}

export async function getSLARules(): Promise<SLARule[]> {
  const response = await adminApiFetch<any[]>("/api/v1/admin/sla-rules");
  return Array.isArray(response) ? response.map(normalizeSLARule) : [];
}

export async function updateSLARule(
  id: string,
  patch: Partial<SLARule>,
  actorId: string,
  actorName: string,
): Promise<SLARule> {
  const response = await adminApiFetch<any>(`/api/v1/admin/sla-rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      response_hours: patch.responseHours,
      resolution_hours: patch.resolutionHours,
      escalation_hours: patch.escalationHours,
      is_active: patch.active,
    }),
  });
  const rule = normalizeSLARule(response);
  await appendAudit(
    actorId,
    actorName,
    "admin",
    "SLA_RULE_CHANGED",
    "sla",
    id,
    `${rule.category} / ${rule.severity}`,
  );
  return rule;
}

// ================================================================ Admin Auth — Real JWT backend

const LS_TOKEN = "civicsathi.admin_token";
const LS_USER = "civicsathi.admin_user";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(LS_TOKEN);
  } catch {
    return null;
  }
}

function normalizeAdminUser(userData: any, fallbackEmail = ""): AdminUser {
  const role = String(userData?.role ?? "admin").toLowerCase();
  return {
    id: String(userData?.id ?? "admin"),
    name: userData?.name ?? fallbackEmail,
    email: userData?.email ?? fallbackEmail,
    role,
    department: userData?.department ?? "Administration",
    city: userData?.city || undefined,
    isSuperAdmin: Boolean(userData?.is_super_admin ?? userData?.isSuperAdmin),
    lastActive: new Date().toISOString(),
    permissions: ["ALL"],
  };
}

async function adminApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  // Add 6-second timeout to prevent UI hanging on slow/sleeping backends
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
        if (!window.location.pathname.endsWith("/login")) {
          window.location.href = "/login";
        }
      }
      throw new Error((err as any).detail ?? res.statusText);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export function getCachedPlatformStats(): any {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("civicsathi_admin_stats");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    total_users: 0,
    total_citizens: 0,
    total_officers: 0,
    total_contractors: 0,
    total_admins: 0,
    total_complaints: 0,
    open_complaints: 0,
    resolved_complaints: 0,
    total_issues: 0,
    open_issues: 0,
    total_tenders: 0,
    active_work_orders: 0,
    total_cities: 0,
  };
}

export function getCachedWorkOrders(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("civicsathi_admin_work_orders");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;

  // Return cached user immediately so auth gate never bounces on slow network.
  try {
    const raw = localStorage.getItem(LS_USER);
    if (raw) {
      const cached = JSON.parse(raw) as AdminUser;
      if (cached.isSuperAdmin === true) {
        // Background refresh — don't await
        adminApiFetch<any>("/api/v1/auth/me")
          .then((me) => {
            if (me) {
              const updated: AdminUser = {
                ...cached,
                name: me.name,
                email: me.email,
                isSuperAdmin: Boolean(me.is_super_admin ?? cached.isSuperAdmin),
                lastActive: new Date().toISOString(),
              };
              localStorage.setItem(LS_USER, JSON.stringify(updated));
            }
          })
          .catch(() => {
            /* ignore */
          });
        return cached;
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const me = await adminApiFetch<any>("/api/v1/auth/me");
    const recovered = normalizeAdminUser(me, me?.email || "admin");
    localStorage.setItem(LS_USER, JSON.stringify(recovered));
    return recovered;
  } catch {
    return null;
  }
}

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  if (!email.trim()) throw new Error("Email is required");
  if (!password.trim()) throw new Error("Password is required");

  const res = await adminApiFetch<{
    access_token: string;
    token_type: string;
    officer?: any;
    user?: any;
  }>("/api/v1/auth/officer-login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });

  // Backend returns { officer: {...} } — normalise
  const userData = res.officer || res.user;
  if (!userData) throw new Error("Login failed: no user data returned");

  const allowedRoles = ["admin"];
  const role = (userData.role ?? "").toLowerCase();
    if (!allowedRoles.includes(role)) {
      throw new Error("Access denied — admin or officer role required");
    }
    // Note: is_super_admin check removed — backend already validates admin role via officer-login

    localStorage.setItem(LS_TOKEN, res.access_token);

  const admin = normalizeAdminUser(userData, email);

  localStorage.setItem(LS_USER, JSON.stringify(admin));
  return admin;
}

export async function requestAdminPasswordReset(input: { identifier: string; channel?: "auto" | "email" | "sms" }) {
  return adminApiFetch<{ accepted: boolean; message: string; channel?: string | null; destination?: string | null }>("/api/v1/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmAdminPasswordReset(input: { identifier: string; otp: string; new_password: string }) {
  return adminApiFetch<{ success: boolean; message: string }>("/api/v1/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ── Real backend admin API helpers ────────────────────────────────────────

/** List all users from the real backend. */
export async function listAllUsers(filters?: {
  role?: string;
  city?: string;
  limit?: number;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.role) params.set("role", filters.role);
  if (filters?.city) params.set("city", filters.city);
  if (filters?.limit) params.set("limit", String(filters.limit));
  try {
    const res = await adminApiFetch<any[]>(`/api/v1/admin/users?${params.toString()}`);
    if (res && Array.isArray(res) && typeof window !== "undefined") {
      localStorage.setItem("civicsathi_admin_users", JSON.stringify(res));
    }
    return res;
  } catch (e) {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("civicsathi_admin_users");
      if (cached) return JSON.parse(cached);
    }
    throw e;
  }
}

/** Create any user (officer, municipality, contractor login, admin). */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  city?: string;
  department?: string;
  phone: string;
}): Promise<any> {
  return adminApiFetch<any>("/api/v1/admin/users", { method: "POST", body: JSON.stringify(data) });
}

/** Update a user's details. */
export async function updateUser(
  userId: string,
  patch: {
    name?: string;
    email?: string;
    role?: string;
    city?: string;
    department?: string;
    phone?: string;
    password?: string;
  },
): Promise<any> {
  return adminApiFetch<any>(`/api/v1/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** Delete a user. */
export async function deleteUser(userId: string): Promise<void> {
  return adminApiFetch<void>(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
}

/** Get platform-wide stats with immediate local caching. */
export async function getPlatformStats(): Promise<any> {
  try {
    const stats = await adminApiFetch<any>("/api/v1/admin/stats");
    if (stats && typeof window !== "undefined") {
      localStorage.setItem("civicsathi_admin_stats", JSON.stringify(stats));
    }
    return stats;
  } catch (e) {
    const fallback = getCachedPlatformStats();
    if (fallback) return fallback;
    throw e;
  }
}

/** List all contractors with their city registrations. */
const RETIRED_DEMO_CONTRACTOR_NAMES = new Set([
  "vadodara infra (demo)",
  "bbmp infra (demo)",
]);

function removeRetiredDemoContractors<T extends { company_name?: string; companyName?: string }>(items: T[]): T[] {
  return items.filter((item) => {
    const name = String(item.company_name ?? item.companyName ?? "").trim().toLowerCase();
    return !RETIRED_DEMO_CONTRACTOR_NAMES.has(name);
  });
}

export async function listRealContractors(): Promise<any[]> {
  try {
    const res = await adminApiFetch<any[]>("/api/v1/admin/contractors");
    const live = removeRetiredDemoContractors(Array.isArray(res) ? res : []);
    if (typeof window !== "undefined") {
      localStorage.setItem("civicsathi_admin_contractors", JSON.stringify(live));
    }
    return live;
  } catch (e) {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("civicsathi_admin_contractors");
      if (cached) {
        try {
          return removeRetiredDemoContractors(JSON.parse(cached));
        } catch {
          localStorage.removeItem("civicsathi_admin_contractors");
        }
      }
    }
    return [];
  }
}

/** Create a contractor with an optional login user. */
export async function createRealContractor(data: {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  login_email?: string;
  login_password?: string;
}): Promise<any> {
  return adminApiFetch<any>("/api/v1/admin/contractors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Approve / reject / revoke a contractor's city registration. */
export async function updateContractorRegistration(
  contractorId: string,
  regId: string,
  status: "APPROVED" | "REJECTED" | "REVOKED" | "PENDING",
  categories?: string[],
): Promise<any> {
  return adminApiFetch<any>(`/api/v1/admin/contractors/${contractorId}/registrations/${regId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, approved_categories: categories }),
  });
}

/** List all work orders across all cities (admin view). */
export async function listRealWorkOrders(): Promise<any[]> {
  try {
    const wos = await adminApiFetch<any[]>("/api/v1/admin/work-orders");
    if (wos && typeof window !== "undefined") {
      localStorage.setItem("civicsathi_admin_work_orders", JSON.stringify(wos));
    }
    return wos;
  } catch (e) {
    return getCachedWorkOrders();
  }
}

/** Fetch the bounded live super-admin command-center snapshot. */
export async function getCommandCenterSnapshot(): Promise<any> {
  return adminApiFetch<any>("/api/v1/admin/command-center");
}

/** List all cities (admin). */
export async function listAdminCities(): Promise<any[]> {
  return adminApiFetch<any[]>("/api/v1/admin/cities");
}

/** Create a new city. */
export async function createCity(name: string, stateCode: string): Promise<any> {
  return adminApiFetch<any>("/api/v1/admin/cities", {
    method: "POST",
    body: JSON.stringify({ name, state_code: stateCode }),
  });
}
export async function adminLogout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
  }
}


/** Fetch server-authoritative reputation health for the private command center. */
export async function getReputationSummary(): Promise<{
  profiles: number;
  xp_granted_last_24h: number;
  impact_events_last_24h: number;
  open_review_flags: number;
  generated_at: string;
}> {
  return adminApiFetch<any>("/api/v1/admin/reputation/summary");
}
