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
import {
  DEMO_ADMIN_USER,
  SEED_CONTRACTORS,
  SEED_CONTRACTOR_DOCUMENTS,
  SEED_WORK_PACKAGES,
  SEED_WORK_ORDERS,
  SEED_WORK_ORDER_EVENTS,
  SEED_FIELD_PROGRESS,
  SEED_INSPECTIONS,
  SEED_MEASUREMENTS,
  SEED_BILLS,
  SEED_AUDIT_LOGS,
  SEED_SLA_RULES,
} from "./mockData";

export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "https://janmind-backend.onrender.com";

// ---------------------------------------------------------------- Utilities

async function fetchStore<T>(collection: string, method = "GET", body?: unknown): Promise<T> {
  const store: Record<string, any> = {
    contractors: SEED_CONTRACTORS,
    contractorDocuments: SEED_CONTRACTOR_DOCUMENTS,
    workPackages: SEED_WORK_PACKAGES,
    workOrders: SEED_WORK_ORDERS,
    workOrderEvents: SEED_WORK_ORDER_EVENTS,
    fieldProgress: SEED_FIELD_PROGRESS,
    inspections: SEED_INSPECTIONS,
    measurements: SEED_MEASUREMENTS,
    bills: SEED_BILLS,
    auditLogs: SEED_AUDIT_LOGS,
    slaRules: SEED_SLA_RULES,
    evidence: []
  };

  const storageKey = `janmind_admin_${collection}`;
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
  const storageKey = `janmind_admin_${collection}`;
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
  await fetchStore("auditLogs", "POST", entry);
}

// ================================================================ Contractors

export async function getContractors(): Promise<Contractor[]> {
  return fetchStore("contractors");
}

export async function getContractor(id: string): Promise<Contractor | null> {
  const list = await fetchStore<Contractor[]>("contractors");
  return list.find((c) => c.id === id) ?? null;
}

export async function createContractor(input: Omit<Contractor, "id" | "createdAt" | "updatedAt">): Promise<Contractor> {
  const contractor = await fetchStore<Contractor>("contractors", "POST", {
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await appendAudit("system", "System", "admin", "WORK_ORDER_CREATED", "contractor", contractor.id, contractor.companyName);
  return contractor;
}

export async function updateContractor(id: string, patch: Partial<Contractor>): Promise<Contractor> {
  return fetchStorePatch<Contractor>("contractors", id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function verifyContractor(id: string, actorId: string, actorName: string): Promise<Contractor> {
  const updated = await updateContractor(id, { status: "VERIFIED", verificationStatus: "VERIFIED" });
  await appendAudit(actorId, actorName, "admin", "CONTRACTOR_VERIFIED", "contractor", id, updated.companyName);
  return updated;
}

export async function suspendContractor(id: string, actorId: string, actorName: string, reason: string): Promise<Contractor> {
  const updated = await updateContractor(id, { status: "SUSPENDED" });
  await appendAudit(actorId, actorName, "admin", "CONTRACTOR_SUSPENDED", "contractor", id, updated.companyName, { reason });
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
  await appendAudit(actorId, actorName, "officer", "WORK_PACKAGE_CREATED", "work_package", wp.id, wp.title);
  return wp;
}

export async function updateWorkPackage(id: string, patch: Partial<WorkPackage>): Promise<WorkPackage> {
  return fetchStorePatch<WorkPackage>("workPackages", id, { ...patch, updatedAt: new Date().toISOString() });
}

// ================================================================ Work Orders

export async function getWorkOrders(filters?: {
  contractorId?: string;
  cityId?: string;
  status?: WorkOrderStatus;
}): Promise<WorkOrder[]> {
  let list = await fetchStore<WorkOrder[]>("workOrders");
  if (filters?.contractorId) list = list.filter((w) => w.contractorId === filters.contractorId);
  if (filters?.cityId) list = list.filter((w) => w.cityId === filters.cityId);
  if (filters?.status) list = list.filter((w) => w.status === filters.status);
  return list;
}

export async function getWorkOrder(id: string): Promise<WorkOrder | null> {
  const list = await fetchStore<WorkOrder[]>("workOrders");
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

  await appendAudit(actorId, actorName, "officer", "WORK_ORDER_CREATED", "work_order", wo.id, wo.title, { newValue: wo.contractorName });
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

  await appendAudit(actorId, actorName, actorRole, "WORK_ORDER_STATUS_CHANGED", "work_order", id, current.title, {
    previousValue: previousStatus,
    newValue: newStatus,
    ...(reason ? { reason } : {}),
  });

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
  return evts.filter((e) => e.workOrderId === workOrderId).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export async function getAllEvidence(): Promise<any[]> {
  return fetchStore<any[]>("evidence");
}

// ================================================================ Field Progress

export async function submitFieldProgress(input: Omit<FieldProgress, "id">): Promise<FieldProgress> {
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
  return evts.filter((fp) => fp.workOrderId === workOrderId).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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
    description: inspection.result === "PASSED" ? inspection.notes : `Failed: ${inspection.failureReasons?.join(", ")}. ${inspection.notes}`,
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

export async function submitMeasurement(input: Omit<Measurement, "id">, actorId: string, actorName: string): Promise<Measurement> {
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

export async function submitBill(input: Omit<Bill, "id" | "submittedAt">, actorId: string, actorName: string): Promise<Bill> {
  const bill = await fetchStore<Bill>("bills", "POST", { ...input, submittedAt: new Date().toISOString(), status: "SUBMITTED" });
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

export async function approveBill(billId: string, workOrderId: string, actorId: string, actorName: string, approvedAmount: number): Promise<Bill> {
  return updateBill(billId, { status: "APPROVED", approvedAmount, approvedBy: actorName, approvedAt: new Date().toISOString() });
}

// ================================================================ Audit Logs

export async function getAuditLogs(filters?: { entityType?: AuditLog["entityType"]; actorRole?: SystemRole; limit?: number; }): Promise<AuditLog[]> {
  let logs = await fetchStore<AuditLog[]>("auditLogs");
  if (filters?.entityType) logs = logs.filter((l) => l.entityType === filters.entityType);
  if (filters?.actorRole) logs = logs.filter((l) => l.actorRole === filters.actorRole);
  return filters?.limit ? logs.slice(0, filters.limit) : logs;
}

// ================================================================ SLA Rules

export async function getSLARules(): Promise<SLARule[]> {
  return fetchStore<SLARule[]>("slaRules");
}

export async function updateSLARule(id: string, patch: Partial<SLARule>, actorId: string, actorName: string): Promise<SLARule> {
  const r = await fetchStorePatch<SLARule>("slaRules", id, patch);
  await appendAudit(actorId, actorName, "admin", "SLA_RULE_CHANGED", "sla", id, `${r.category} / ${r.severity}`);
  return r;
}

// ================================================================ Admin Auth

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const raw = localStorage.getItem("janmind.admin_user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ---------------------------------------------------------------- Admin auth
// The admin portal is intentionally localStorage-backed for the MVP.
// It uses seeded mock data and does NOT call the backend API.
// This is by design: admin-level operations (contractor registry, SLA config,
// audit logs) are managed locally until a dedicated admin API is built.
export async function adminLogin(email: string, _password: string): Promise<AdminUser> {
  if (!email.trim()) throw new Error("Email is required");
  const admin: AdminUser = { ...DEMO_ADMIN_USER, email };
  localStorage.setItem("janmind.admin_user", JSON.stringify(admin));
  return admin;
}

export async function adminLogout(): Promise<void> {
  localStorage.removeItem("janmind.admin_user");
}
