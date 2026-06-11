import { globalToast } from './toast-context';
import { authService } from './auth-service';

export function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL || 'https://portal.raiyan.cc/api';
  return url.replace(/\/$/, '');
}

export const BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors: any[] | Record<string, string[]>;
}

interface RequestOptions extends RequestInit {
  skipGlobalToast?: boolean;
  skipSuccessToast?: boolean;
}

function isAdminApiPath(path: string) {
  return path.startsWith('/admin') || path.startsWith('admin');
}

function handleUnauthorized(path: string) {
  if (typeof window === 'undefined') return;

  if (isAdminApiPath(path)) {
    authService.clearAdminSession();
    if (!window.location.pathname.startsWith('/')) {
      window.location.replace('/');
    } else {
      window.location.replace('/');
    }
    return;
  }

  authService.clearUserSession();
  window.location.replace('/');
}

class ApiService {
  private getHeaders(isFormattedData: boolean, path: string): HeadersInit {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (!isFormattedData) {
      headers['Content-Type'] = 'application/json';
    }

    // Determine token to use based on the path
    const tokenKey = isAdminApiPath(path) ? 'admin_token' : 'user_token';
    const token = typeof window !== 'undefined' ? localStorage.getItem(tokenKey) : null;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T = any>(
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${getApiBaseUrl()}/${path.replace(/^\//, '')}`;
    const isFormData = body instanceof FormData;
    const headers = this.getHeaders(isFormData, path);

    const { skipGlobalToast, headers: optionHeaders, ...fetchOptions } = options ?? {};
    const config: RequestInit = {
      ...fetchOptions,
      method,
      headers: {
        ...headers,
        ...(optionHeaders || {}),
      },
    };

    if (body) {
      if (isFormData) {
        config.body = body;
      } else {
        config.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, config);
      const data = (await response.json()) as ApiResponse<T>;

      if (response.status === 401) {
        handleUnauthorized(path);
      }

      if (data && data.status === false && !skipGlobalToast) {
        let errorMsg = data.message || 'An error occurred.';
        if (data.errors && typeof data.errors === 'object') {
          const errList = Object.values(data.errors).flat();
          if (errList.length > 0) {
            errorMsg = errList.join(' ');
          }
        }
        globalToast.error(errorMsg);
      } else if (method !== 'GET' && !fetchOptions.skipSuccessToast) {
        const successMsg = data?.message || 'Saved successfully.';
        globalToast.success(successMsg);
      }

      return data;
    } catch (error: any) {
      console.error(`API Error on ${method} ${path}:`, error);
      const errorMsg = error.message || 'Network error occurred.';
      if (!skipGlobalToast) {
        globalToast.error(errorMsg);
      }
      return {
        status: false,
        message: errorMsg,
        data: null as any,
        errors: [errorMsg],
      };
    }
  }

  async get<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, 'GET', undefined, options);
  }

  async post<T = any>(path: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, 'POST', body, options);
  }

  async delete<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, 'DELETE', undefined, options);
  }
}


export const apiService = new ApiService();
export default apiService;
