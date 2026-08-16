import { APIClient } from './client';
import { AuthResponse, Complaint, User } from './types';

export class Endpoints {
  constructor(private client: APIClient) {}

  auth = {
    loginOfficer: (data: any) => this.client.post<AuthResponse>('/api/v1/auth/officer-login', data),
    loginCitizen: (data: any) => this.client.post<AuthResponse>('/api/v1/auth/login', data),
    registerCitizen: (data: any) => this.client.post<AuthResponse>('/api/v1/auth/register', data),
  };

  complaints = {
    list: (params?: any) => {
      const query = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : '';
      return this.client.get<any>(`/api/v1/complaints${query ? '?' + query : ''}`);
    },
    get: (id: string) => this.client.get<Complaint>(`/api/v1/complaints/${id}`),
    create: (data: any) => this.client.post<Complaint>('/api/v1/complaints', data),
    updateStatus: (id: string, status: string) => this.client.patch<Complaint>(`/api/v1/complaints/${id}/status`, { status }),
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
}
