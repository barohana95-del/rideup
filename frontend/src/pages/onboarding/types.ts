// =====================================================================
// Onboarding wizard — types for the draft state.
// =====================================================================
import type { TenantPlan, TenantTheme, EventType } from '../../types';

export interface OnboardingDraft {
  step: number;                 // 1..7

  // Step 1
  plan: TenantPlan | null;

  // Step 2
  slug: string;
  slugAvailable: boolean | null;  // null = not checked yet

  // Step 3
  theme: TenantTheme | null;

  // Step 4
  eventType: EventType | null;
  eventTitle: string;
  eventDate: string;            // YYYY-MM-DD
  eventTime: string;            // HH:MM
  eventLocation: string;

  // Step 5
  cities: string[];

  // Step 6
  useShifts: boolean;
  shifts: string[];

  // Step 7
  invitationText: string;
  instructionsText: string;
  thankYouText: string;
}

export const initialDraft: OnboardingDraft = {
  step: 1,
  plan: null,
  slug: '',
  slugAvailable: null,
  theme: null,
  eventType: null,
  eventTitle: '',
  eventDate: '',
  eventTime: '',
  eventLocation: '',
  cities: [],
  useShifts: true,
  shifts: ["סבב א' - 00:00", "סבב ב' - 02:00"],
  invitationText: '',
  instructionsText: '',
  thankYouText: '',
};

export const TOTAL_STEPS = 7;

export const stepTitles: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'בחר חבילה', subtitle: 'תוכל לשדרג בכל זמן' },
  2: { title: 'בחר כתובת', subtitle: 'הקישור של האתר שלך' },
  3: { title: 'בחר עיצוב', subtitle: 'תוכל להחליף בכל זמן' },
  4: { title: 'פרטי האירוע', subtitle: 'הפרטים שאורחים יראו' },
  5: { title: 'ערים', subtitle: 'מאיפה יוצאות ההסעות' },
  6: { title: 'משמרות חזרה', subtitle: 'מתי האורחים חוזרים הביתה' },
  7: { title: 'טקסטים אחרונים', subtitle: 'ההזמנה והוראות' },
};
