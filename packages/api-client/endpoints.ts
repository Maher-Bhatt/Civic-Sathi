import { APIClient } from './client';
import { AuthResponse, Complaint, User } from './types';

function normaliseAuthResponse(raw: any): AuthResponse {
  // Backend sends { access_token, citizen: {...} } for citizen login
  // and { access_token, officer: {...} } for officer login.
  // Normalise both into { access_token, user: {...} } for consumers.
  const user: User | undefined = raw.user ?? raw.citizen ?? raw.officer ?? undefined;
  return { ...raw, user };
}

export class Endpoints {
  constructor(private client: APIClient) {}

  ai = {
    analyzeComplaint: (data: any) => this.client.post<any>('/api/v1/ai/analyze-complaint', data),
    analyzeImage: (data: any) => this.client.post<any>('/api/v1/ai/analyze-image', data),
  };

  auth = {
    loginOfficer: async (data: any): Promise<AuthResponse> => {
      const raw = await this.client.post<any>('/api/v1/auth/officer-login', data);
      return normaliseAuthResponse(raw);
    },
    loginCitizen: async (data: any): Promise<AuthResponse> => {
      const raw = await this.client.post<any>('/api/v1/auth/login', data);
      return normaliseAuthResponse(raw);
    },
    registerCitizen: async (data: any): Promise<AuthResponse> => {
      const raw = await this.client.post<any>('/api/v1/auth/register', data);
      return normaliseAuthResponse(raw);
    },
    me: async (): Promise<User> => {
      return this.client.get<any>('/api/v1/auth/me');
    },
    requestPasswordReset: (data: { identifier: string; channel?: 'auto' | 'email' | 'sms' }) =>
      this.client.post<{
        accepted: boolean;
        message: string;
        channel?: string | null;
        destination?: string | null;
      }>('/api/v1/auth/password-reset/request', data),
    confirmPasswordReset: (data: { identifier: string; otp: string; new_password: string }) =>
      this.client.post<{ success: boolean; message: string }>('/api/v1/auth/password-reset/confirm', data),
  };

  complaints = {
    list: (params?: any) => {
      const query = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : '';
      return this.client.get<any>(`/api/v1/complaints${query ? '?' + query : ''}`);
    },
    get: (id: string) => this.client.get<Complaint>(`/api/v1/complaints/${id}`),
    create: (data: any) => this.client.post<Complaint>('/api/v1/complaints', data),
    updateStatus: (id: string, status: string, notes?: string) => this.client.patch<Complaint>(`/api/v1/complaints/${id}/status`, { status, ...(notes ? { notes } : {}) }),
  };

  tenders = {
    list: (cityId: string) => this.client.get<any[]>(`/api/v1/procurement/tenders?city_id=${cityId}`),
    get: (id: string) => this.client.get<any>(`/api/v1/procurement/tenders/${id}`),
    create: (data: any) => this.client.post<any>('/api/v1/procurement/tenders', data),
    submitBid: (tenderId: string, data: any) => this.client.post<any>(`/api/v1/procurement/tenders/${tenderId}/bids`, data),
    listBids: (tenderId: string) => this.client.get<any[]>(`/api/v1/procurement/tenders/${tenderId}/bids`),
    awardBid: (tenderId: string, bidId: string) => this.client.post<any>(`/api/v1/procurement/tenders/${tenderId}/bids/${bidId}/award`, {}),
  };

  workOrders = {
    list: (cityId: string) => this.client.get<any[]>(`/api/v1/procurement/work-orders?city_id=${cityId}`),
    get: (id: string) => this.client.get<any>(`/api/v1/procurement/work-orders/${id}`),
    updateStatus: (id: string, status: string) => this.client.patch<any>(`/api/v1/procurement/work-orders/${id}/status`, { status }),
    submitEvidence: (id: string, data: any) => this.client.post<any>(`/api/v1/procurement/work-orders/${id}/evidence`, data),
    inspect: (id: string, data: any) => this.client.post<any>(`/api/v1/procurement/work-orders/${id}/inspections`, data),
  };

  cities = {
    list: () => this.client.get<Array<{ id: string; name: string; state_code: string }>>('/api/v1/cities'),
  };

  contractors = {
    list: () => this.client.get<any[]>('/api/v1/procurement/contractors'),
    get: (id: string) => this.client.get<any>(`/api/v1/procurement/contractors/${id}`),
    getRatings: (id: string) => this.client.get<any[]>(`/api/v1/procurement/contractors/${id}/ratings`),
    submitRating: (id: string, data: any) => this.client.post<any>(`/api/v1/procurement/contractors/${id}/ratings`, data),
  };
}
