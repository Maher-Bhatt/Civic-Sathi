import { APIError } from './types';

export class APIClientError extends Error {
  public status: number;
  public details: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'APIClientError';
    this.status = status;
    this.details = details;
  }
}

export interface ClientConfig {
  baseUrl: string;
  getToken: () => string | null | Promise<string | null>;
  onUnauthorized?: () => void;
}

export class APIClient {
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const rawBase = (this.config.baseUrl || "https://janmind.onrender.com").trim();
    const cleanBase = rawBase.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBase}${cleanEndpoint}`;
    const token = await this.config.getToken();
    
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (fetchErr: any) {
      console.error(`[APIClient] Network error fetching ${url}:`, fetchErr);
      throw new APIClientError(
        `Failed to reach backend server (${url}). Please check your internet connection or backend status.`,
        0,
        fetchErr
      );
    }

    if (response.status === 401 && this.config.onUnauthorized) {
      this.config.onUnauthorized();
    }

    if (!response.ok) {
      let errorDetail = 'API Request Failed';
      try {
        const errorData = await response.json();
        // FastAPI can return detail as a string or as a Pydantic validation array
        if (typeof errorData.detail === 'string') {
          errorDetail = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Pydantic 422: pick the first human-readable message
          errorDetail = errorData.detail.map((e: any) => e.msg || e.message).join('; ');
        } else {
          errorDetail = errorData.message || errorDetail;
        }
      } catch (e) {
        // Failed to parse JSON error
      }
      throw new APIClientError(errorDetail, response.status);
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: Omit<RequestInit, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: any, options?: Omit<RequestInit, 'method' | 'body'>) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: Omit<RequestInit, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
