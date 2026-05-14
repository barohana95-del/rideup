// =====================================================================
// RideUp — Shared TypeScript Types
// אלה ה-types של ה-API (request/response). כל endpoint משתמש בהם.
// =====================================================================

// --- Tenant ---
export type TenantPlan = 'trial' | 'basic' | 'pro' | 'premium';
// Modern theme keys + legacy aliases (kept so older tenants don't break).
export type TenantTheme =
  | 'elegant' | 'minimal' | 'romantic' | 'bold' | 'luxe'
  | 'classic' | 'modern'  | 'rustic'   | 'festive';
export type TenantStatus = 'draft' | 'trial' | 'active' | 'expired' | 'archived' | 'suspended' | 'deleted';
export type EventType = 'wedding' | 'bar_mitzvah' | 'bat_mitzvah' | 'birthday' | 'corporate' | 'other';

export interface Tenant {
  id: number;
  slug: string;
  ownerUserId: number;
  status: TenantStatus;
  plan: TenantPlan;
  theme: TenantTheme;
  eventType: EventType;
  eventTitle: string | null;
  eventDate: string | null;        // YYYY-MM-DD
  eventTime: string | null;        // HH:MM
  eventLocation: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  showPoweredBy: boolean;
  trialEndsAt: string | null;
  paidUntil: string | null;
  createdAt: string;
}

// --- Public-facing tenant config (אורח רואה) ---
export interface PublicTenantConfig {
  slug: string;
  theme: TenantTheme;
  eventType: EventType;
  eventTitle: string;
  eventDate: string | null;
  eventTime: string | null;
  eventLocation: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  showPoweredBy: boolean;
  cities: string[];
  shifts: string[];
  useShifts: boolean;
  texts: TenantTexts;
  // עיצוב
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface TenantTexts {
  invitationText: string;
  instructionsText: string;
  thankYouText: string;
}

// --- Registration (אורח שנרשם) ---
export interface Registration {
  id: number;
  tenantId: number;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  numGuests: number;
  city: string | null;
  returnShift: string | null;
  notes: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  numGuests: number;
  city?: string;
  returnShift?: string;
  notes?: string;
}

// --- User (בעלי tenants) ---
export interface User {
  id: number;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  createdAt: string;
}

// --- API generic response wrapper ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// --- Dashboard stats ---
export interface DashboardStats {
  totalRegistrations: number;
  totalGuests: number;
  cityDistribution: { city: string; count: number; guests: number }[];
  shiftDistribution: { shift: string; count: number; guests: number }[];
}

// --- Bus planning (תכנון נסיעה) ---
export interface Bus {
  id: number;
  capacity: number;
  label: string;
}

export interface RoutePlan {
  city: string;
  shift: string | null;            // null = outbound
  totalGuests: number;
  buses: { capacity: number; label: string; assignedGuests: number }[];
  warning?: string;
}
