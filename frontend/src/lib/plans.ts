// =====================================================================
// RideUp — Subscription plans registry
// One place to define what each plan allows. Consumed by:
//   - /account Personal Area (shows limit + usage)
//   - "Build new site" gate (blocks if over limit)
//   - Marketing/pricing page (consistency with what the user actually gets)
// =====================================================================
import type { TenantPlan } from '../types';

export interface PlanSpec {
  key: TenantPlan;
  label: string;
  /** Hebrew tag — short marketing line. */
  tagline: string;
  /** Sites the user can have on this plan. null = unlimited. */
  siteLimit: number | null;
  /** Hex accent for cards / badges. */
  color: string;
  /** Brief feature highlights. */
  features: string[];
  /** Monthly price in ILS (for display only — billing is offline). */
  priceMonthly: number | 'free' | 'custom';
}

export const PLANS: Record<TenantPlan, PlanSpec> = {
  trial: {
    key: 'trial',
    label: 'תקופת ניסיון',
    tagline: '14 ימים חינם, אתר אחד.',
    siteLimit: 1,
    color: '#FCD34D',
    features: ['אתר אחד', 'עד 500 רישומים', 'תמיכה בסיסית', '14 ימים חינם'],
    priceMonthly: 'free',
  },
  basic: {
    key: 'basic',
    label: 'בסיסי',
    tagline: 'אידיאלי לאירוע יחיד.',
    siteLimit: 2,
    color: '#60A5FA',
    features: ['עד 2 אתרים', 'עד 1,000 רישומים לאתר', 'ניהול הסעות', 'תמיכה במייל'],
    priceMonthly: 49,
  },
  pro: {
    key: 'pro',
    label: 'מקצועי',
    tagline: 'למתכננים פעילים.',
    siteLimit: 5,
    color: '#7D39EB',
    features: ['עד 5 אתרים פעילים', 'רישומים ללא הגבלה', 'שותפים עם הרשאות', 'תמיכה מועדפת'],
    priceMonthly: 149,
  },
  premium: {
    key: 'premium',
    label: 'פרימיום',
    tagline: 'לחברות אירועים.',
    siteLimit: null,
    color: '#000000',
    features: ['אתרים ללא הגבלה', 'רישומים ללא הגבלה', 'תיעדוף בתמיכה', 'API ויצוא'],
    priceMonthly: 'custom',
  },
};

export function getPlan(key: string | null | undefined): PlanSpec {
  if (key && key in PLANS) return PLANS[key as TenantPlan];
  return PLANS.trial;
}

/** Returns true if the user is at/over their site limit. */
export function isAtLimit(plan: TenantPlan, sitesOwned: number): boolean {
  const limit = PLANS[plan].siteLimit;
  if (limit === null) return false;
  return sitesOwned >= limit;
}
