// =====================================================================
// Mock auth — placeholder until real Google OAuth (Stage 2).
// Stores a fake user in localStorage. Real auth will replace this.
// =====================================================================

const MOCK_USER_KEY = 'rideup_mock_user';

export interface MockUser {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

const DEMO_USER: MockUser = {
  id: 1,
  email: 'demo@rideup.co.il',
  displayName: 'משתמש דמו',
  avatarUrl: null,
};

export function getMockUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function loginAsDemo(): MockUser {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(DEMO_USER));
  }
  return DEMO_USER;
}

export function logoutMock(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOCK_USER_KEY);
}

export function isMockAuthenticated(): boolean {
  return getMockUser() !== null;
}
