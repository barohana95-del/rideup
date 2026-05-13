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

  updateTenant: (slug: string, patch: Record<string, unknown>) =>
    request<{
      tenant: Tenant;
      cities: { id: number; name: string; display_order: number }[];
      shifts: { id: number; time_label: string; display_order: number }[];
      settings: Record<string, string>;
      newSlug: string;
    }>(`/admin/update-tenant.php?slug=${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  // ── Bus fleet ───────────────────────────────────────────────────
  listBuses: (slug: string) =>
    request<{ id: number; capacity: number; label: string | null; display_order: number }[]>(
      `/admin/buses.php?slug=${slug}`
    ),

  addBus: (slug: string, capacity: number, label?: string) =>
    request<{ id: number; capacity: number; label: string | null }>(
      `/admin/buses.php?slug=${slug}`,
      { method: 'POST', body: JSON.stringify({ capacity, label }) }
    ),

  updateBus: (slug: string, id: number, patch: { capacity?: number; label?: string }) =>
    request<{ id: number }>(
      `/admin/buses.php?slug=${slug}&id=${id}`,
      { method: 'PATCH', body: JSON.stringify(patch) }
    ),

  deleteBus: (slug: string, id: number) =>
    request<{ deleted: boolean }>(
      `/admin/buses.php?slug=${slug}&id=${id}`,
      { method: 'DELETE' }
    ),

  // ── Trip planning ───────────────────────────────────────────────
  getTripPlan: (slug: string) =>
    request<{
      fleet: { id: number; capacity: number; label: string | null }[];
      groups: {
        city: string;
        shift: string;
        totalGuests: number;
        totalRegistrations: number;
        buses: { capacity: number; label: string | null }[];
        capacityProvided: number;
        spareSeats: number;
        warning: string | null;
      }[];
      summary: {
        totalGuests: number;
        totalBuses: number;
        totalCapacity: number;
        totalSpare: number;
      };
    }>(`/admin/trip-plan.php?slug=${slug}`),

  /**
   * Triggers a CSV download. Type can be 'registrations' or 'trip-plan'.
   * Returns true on success.
   */
  exportCsv: async (slug: string, type: 'registrations' | 'trip-plan'): Promise<boolean> => {
    const mockUser = getMockUser();
    const headers: Record<string, string> = {};
    const token = localStorage.getItem(SESSION_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (mockUser) headers['X-Mock-User-Id'] = String(mockUser.id);

    const res = await fetch(`${API_BASE_URL}/admin/export.php?slug=${slug}&type=${type}`, { headers });
    if (!res.ok) return false;

    const blob = await res.blob();
    const filename = `${slug}_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  },

  // ── Collaborators ───────────────────────────────────────────────
  listCollaborators: (slug: string) =>
    request<Array<{
      userId: number;
      role: 'owner' | 'editor' | 'viewer';
      createdAt: string;
      acceptedAt: string | null;
      invitedEmail: string | null;
      email: string | null;
      displayName: string | null;
      avatarUrl: string | null;
    }>>(`/admin/collaborators.php?slug=${slug}`),

  inviteCollaborator: (slug: string, email: string, role: 'editor' | 'viewer') =>
    request<{ ok: boolean }>(`/admin/collaborators.php?slug=${slug}`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    }),

  changeCollaboratorRole: (slug: string, userId: number, role: 'editor' | 'viewer') =>
    request<{ ok: boolean }>(`/admin/collaborators.php?slug=${slug}`, {
      method: 'PATCH',
      body: JSON.stringify({ userId, role }),
    }),

  removeCollaborator: (slug: string, userId: number) =>
    request<{ ok: boolean }>(`/admin/collaborators.php?slug=${slug}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    }),
};

// --- Super-Admin (platform owner only — requires is_admin=1) ---
// Note: PHP returns snake_case from the DB but Response::ok() auto-converts
// keys to camelCase, so the types here use camelCase.
export const saApi = {
  overview: () => request<{
    totals: { tenants: number; users: number; registrations: number; guests: number };
    byStatus: Record<string, number>;
    byPlan: Record<string, number>;
    recent: { newTenants: number; newUsers: number; newRegistrations: number };
    latestTenants: Array<{
      id: number; slug: string; status: string; plan: string;
      eventTitle: string | null; eventDate: string | null; createdAt: string;
      ownerEmail: string | null; ownerName: string | null;
    }>;
  }>('/sa/overview.php'),

  listTenants: (filters?: { q?: string; plan?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (filters?.q) qs.set('q', filters.q);
    if (filters?.plan) qs.set('plan', filters.plan);
    if (filters?.status) qs.set('status', filters.status);
    const tail = qs.toString();
    return request<Array<{
      id: number; slug: string; status: string; plan: string; theme: string;
      eventType: string; eventTitle: string | null; eventDate: string | null;
      eventLocation: string | null; trialEndsAt: string | null;
      paidUntil: string | null; createdAt: string; updatedAt: string;
      ownerId: number | null; ownerEmail: string | null; ownerName: string | null;
      registrations: number; guests: number;
    }>>(`/sa/tenants.php${tail ? '?' + tail : ''}`);
  },

  listUsers: (q?: string) =>
    request<Array<{
      id: number; email: string; displayName: string | null;
      avatarUrl: string | null; isAdmin: number;
      createdAt: string; lastLoginAt: string | null;
      tenantsCount: number;
    }>>(`/sa/users.php${q ? '?q=' + encodeURIComponent(q) : ''}`),

  tenantAction: (tenantId: number, action: string, value?: unknown) =>
    request<unknown>('/sa/tenant-action.php', {
      method: 'POST',
      body: JSON.stringify({ tenantId, action, value }),
    }),
};

// --- Hello (לבדיקת חיבור) ---
export const systemApi = {
  hello: () => request<{ message: string; timestamp: string; tenant: string | null }>('/hello.php'),
};
