// =====================================================================
// RideUp — API Client
// =====================================================================
import type {
  ApiResponse,
  PublicTenantConfig,
  Registration,
  RegistrationInput,
  User,
  DashboardStats,
  Tenant,
} from '../types';
import { getMockUser } from './mockAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

const SESSION_KEY = 'rideup_jwt';

// --- low level ---
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem(SESSION_KEY);
  const mockUser = getMockUser();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (mockUser) headers['X-Mock-User-Id'] = String(mockUser.id);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    if (!res.ok) {
      try {
        const err = await res.json();
        return { success: false, error: err.error || `HTTP ${res.status}`, code: err.code };
      } catch {
        return { success: false, error: `HTTP ${res.status}` };
      }
    }
    return await res.json();
  } catch (e) {
    console.error('API error:', e);
    return { success: false, error: 'לא ניתן ליצור קשר עם השרת.' };
  }
}

// --- Public (האתר של ה-tenant) ---
// ה-host (subdomain) מזהה את ה-tenant; השרת מפענח אוטומטית.
export const publicApi = {
  getConfig: (slug: string) => request<PublicTenantConfig>(`/public/config.php?tenant=${encodeURIComponent(slug)}`),

  register: (slug: string, data: RegistrationInput) =>
    request<{ id: number }>(`/public/register.php?tenant=${encodeURIComponent(slug)}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- Auth ---
export const authApi = {
  loginWithGoogle: (idToken: string) =>
    request<{ user: User; token: string }>('/auth/google.php', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  me: () => request<User>('/auth/me.php'),

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(SESSION_KEY, token);
  },

  getToken: () => localStorage.getItem(SESSION_KEY),
};

// --- Onboarding ---
export const onboardingApi = {
  checkSlug: (slug: string) =>
    request<{ available: boolean }>(`/onboarding/check-slug.php?slug=${encodeURIComponent(slug)}`),

  finalize: (data: {
    plan: string;
    slug: string;
    theme: string;
    eventType: string;
    eventTitle: string;
    eventDate: string;
    eventTime?: string;
    eventLocation?: string;
    cities: string[];
    useShifts: boolean;
    shifts: string[];
    texts: { invitationText: string; instructionsText: string; thankYouText: string };
  }) =>
    request<Tenant>('/onboarding/finalize.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- Admin (פאנל ניהול לקוח) ---
export const adminApi = {
  myTenants: () => request<Tenant[]>('/admin/tenants.php'),

  getTenant: (slug: string) => request<Tenant>(`/admin/tenant.php?slug=${slug}`),

  listRegistrations: (slug: string) =>
    request<Registration[]>(`/admin/registrations.php?slug=${slug}`),

  updateRegistration: (slug: string, id: number, data: Partial<RegistrationInput>) =>
    request<Registration>(`/admin/registrations.php?slug=${slug}&id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteRegistration: (slug: string, id: number) =>
    request<{ deleted: boolean }>(`/admin/registrations.php?slug=${slug}&id=${id}`, {
      method: 'DELETE',
    }),

  getStats: (slug: string) =>
    request<DashboardStats>(`/admin/stats.php?slug=${slug}`),

  exportExcel: async (slug: string): Promise<Blob | null> => {
    const token = localStorage.getItem(SESSION_KEY);
    const res = await fetch(`${API_BASE_URL}/admin/export.php?slug=${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.blob() : null;
  },
};

// --- Hello (לבדיקת חיבור) ---
export const systemApi = {
  hello: () => request<{ message: string; timestamp: string; tenant: string | null }>('/hello.php'),
};
