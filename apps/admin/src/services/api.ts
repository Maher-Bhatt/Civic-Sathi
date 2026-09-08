import { APIClient } from '@civicsathi/api-client';
import type { MultiDeptAnalysisResult, CivicCase, ConnectedSystem, IntegrationEventIn, IntegrationEventOut, LiveTransitMessage, StateCommandData, PredictiveRiskResult, DepaConsent, MdmException } from './types';
export const API_BASE_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:8000';
export const client = new APIClient({ baseUrl: API_BASE_URL, getToken: () => typeof window !== 'undefined' ? window.localStorage.getItem('civicsathi_admin_token') || '' : '' });

// SIH26129 Macro Interoperability & Master Case Endpoints
// ---------------------------------------------------------------------------

export async function analyzeMultiDeptCase(payload: {
  title?: string;
  description: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  city?: string;
}): Promise<MultiDeptAnalysisResult> {
  return client.post<MultiDeptAnalysisResult>("/api/v1/ai/analyze-case", payload);
}

export async function createMasterCase(payload: {
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  ward?: string;
  address_text?: string;
  photo_url?: string;
  pre_analyzed_routing?: MultiDeptAnalysisResult;
}): Promise<CivicCase> {
  return client.post<CivicCase>("/api/v1/cases", payload);
}

export async function getCasePassport(caseIdOrNumber: string): Promise<CivicCase> {
  return client.get<CivicCase>(`/api/v1/cases/${encodeURIComponent(caseIdOrNumber)}`);
}

export async function simulateCompleteDepartment(
  caseId: string,
  deptId: string,
  notes?: string
): Promise<CivicCase> {
  const query = notes ? `?notes=${encodeURIComponent(notes)}` : "";
  return client.post<CivicCase>(
    `/api/v1/cases/${encodeURIComponent(caseId)}/departments/${encodeURIComponent(deptId)}/simulate-complete${query}`,
    {}
  );
}

export async function getMockSystemsOverview(): Promise<{
  title: string;
  architecture: string;
  systems: Array<{
    code: string;
    name: string;
    system_key: string;
    protocol: string;
    total_active_tickets: number;
    status: string;
  }>;
}> {
  return client.get("/api/v1/mock/overview");
}

// ---------------------------------------------------------------------------
// Phase 2: Interoperability Catalogue & Live Transit Stream
// ---------------------------------------------------------------------------

export async function getConnectedSystems(): Promise<ConnectedSystem[]> {
  return client.get<ConnectedSystem[]>("/api/v1/integrations/systems");
}

export async function pingConnectedSystem(systemKey: string): Promise<{
  system_key: string;
  name: string;
  status: string;
  latency_ms: number;
  timestamp: string;
  protocol: string;
  message: string;
}> {
  return client.post(`/api/v1/integrations/systems/${encodeURIComponent(systemKey)}/ping`, {});
}

export async function sendIntegrationEvent(payload: IntegrationEventIn): Promise<IntegrationEventOut> {
  return client.post<IntegrationEventOut>("/api/v1/integrations/events", payload);
}

export async function getRecentTransitEvents(limit: number = 20): Promise<LiveTransitMessage[]> {
  return client.get<LiveTransitMessage[]>(`/api/v1/integrations/events/recent?limit=${limit}`);
}

export async function simulateHandoffScenario(
  caseNumber?: string,
  speedFactor: number = 1.0
): Promise<{
  status: string;
  case_number: string;
  stages_executed: number;
  message: string;
}> {
  const cn = caseNumber ? encodeURIComponent(caseNumber) : "MH-MCGM-2026-080596";
  return client.post(`/api/v1/integrations/simulate-handoff?case_number=${cn}&speed_factor=${speedFactor}`, {});
}

export function subscribeToLiveStream(
  onEvent: (event: LiveTransitMessage) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === "undefined" || !window.EventSource) {
    return () => {};
  }
  const url = `${API_BASE_URL}/api/v1/integrations/stream`;
  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onEvent(parsed);
    } catch (err) {
      console.warn("Failed to parse SSE event:", err);
    }
  };

  es.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    es.close();
  };
}

// -------------------------------------------------------------------------
// Phase 3: State Command Center, Predictive Risk, DEPA, MDM (SIH26129)
// -------------------------------------------------------------------------

export async function getStateCommandCenter(): Promise<StateCommandData> {
  return client.get<StateCommandData>("/api/v1/analytics/state-command-center");
}

export async function getPredictiveRisk(params?: {
  title?: string;
  description?: string;
  severity?: string;
  priority?: string;
  departments?: string;
  lat?: number;
  lng?: number;
  ward_name?: string;
  city_name?: string;
}): Promise<PredictiveRiskResult> {
  const query = new URLSearchParams();
  if (params?.title) query.set("title", params.title);
  if (params?.description) query.set("description", params.description);
  if (params?.severity) query.set("severity", params.severity);
  if (params?.priority) query.set("priority", params.priority);
  if (params?.departments) query.set("departments", params.departments);
  if (params?.lat !== undefined) query.set("lat", String(params.lat));
  if (params?.lng !== undefined) query.set("lng", String(params.lng));
  if (params?.ward_name) query.set("ward_name", params.ward_name);
  if (params?.city_name) query.set("city_name", params.city_name);

  return client.get<PredictiveRiskResult>(`/api/v1/analytics/predict-systemic-risk?${query.toString()}`);
}

export async function getDepaConsents(): Promise<DepaConsent[]> {
  return client.get<DepaConsent[]>("/api/v1/integrations/consents");
}

export async function grantDepaConsent(consentId: string): Promise<{ status: string; message: string; consent: DepaConsent }> {
  return client.post(`/api/v1/integrations/consents/${encodeURIComponent(consentId)}/grant`, {});
}

export async function revokeDepaConsent(consentId: string): Promise<{ status: string; message: string; consent: DepaConsent }> {
  return client.post(`/api/v1/integrations/consents/${encodeURIComponent(consentId)}/revoke`, {});
}

export async function getMdmExceptions(): Promise<MdmException[]> {
  return client.get<MdmException[]>("/api/v1/integrations/exceptions");
}

export async function resolveMdmException(exceptionId: string): Promise<{ status: string; message: string; exception: MdmException }> {
  return client.post(`/api/v1/integrations/exceptions/${encodeURIComponent(exceptionId)}/resolve`, {});
}

export async function resetDemoState(): Promise<{ status: string; message: string; consents_reset: number; exceptions_reset: number }> {
  return client.post("/api/v1/integrations/reset-demo", {});
}



