// =====================================================================
// auth.ts — frontend auth state + Google Identity Services integration.
//
// Stores the current user in localStorage (for fast hydration on next
// page load), but the source of truth is the JWT in an httpOnly cookie
// set by the backend. Calls to /api/auth/me.php verify against the
// cookie if we ever lose state.
// =====================================================================
import { authApi } from './api';

const USER_KEY = 'rideup_user_v2';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}

export function setCurrentUser(u: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

export async function refreshUser(): Promise<AuthUser | null> {
  const res = await authApi.me();
  if (res.success && res.data) {
    const u = res.data as unknown as AuthUser;
    setCurrentUser(u);
    return u;
  }
  setCurrentUser(null);
  return null;
}

export async function logout(): Promise<void> {
  try { await fetch('/api/auth/logout.php', { method: 'POST', credentials: 'include' }); } catch {}
  setCurrentUser(null);
  // Also clear any legacy mock state
  try { localStorage.removeItem('rideup_mock_user'); } catch {}
  try { localStorage.removeItem('rideup_jwt'); } catch {}
}

/**
 * Initializes the Google Sign-In button into the given container.
 * Calls onSuccess(user) once login completes.
 */
export function renderGoogleButton(
  container: HTMLElement,
  onSuccess: (user: AuthUser) => void,
  onError: (msg: string) => void,
): void {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId) {
    onError('VITE_GOOGLE_CLIENT_ID לא מוגדר ב-.env.local');
    return;
  }

  function ready() {
    return typeof window !== 'undefined' && window.google?.accounts?.id;
  }

  function init() {
    if (!ready()) {
      setTimeout(init, 200);
      return;
    }
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (resp: { credential: string }) => {
        try {
          const res = await fetch('/api/auth/google.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken: resp.credential }),
          });
          const json = await res.json();
          if (!json.success) {
            onError(json.error ?? 'Google login failed');
            return;
          }
          const user = json.data.user as AuthUser;
          setCurrentUser(user);
          onSuccess(user);
        } catch (e: any) {
          onError(e?.message ?? 'Network error');
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      logo_alignment: 'left',
      width: container.offsetWidth || 320,
      locale: 'he',
    });
  }

  init();
}
