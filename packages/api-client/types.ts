export type Role = 'citizen' | 'officer' | 'contractor' | 'admin' | 'municipality';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  ward?: string;
  department?: string;
}

export interface Complaint {
  id: string;
  public_id: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  ward?: number;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface APIError {
  detail: string;
}
