// =====================================================================
// Host detection — מזהה איזה "אזור" של האפליקציה אנחנו בו
// לפי ה-hostname הנוכחי של הדפדפן.
//
// אזורים:
//   marketing — דף הנחיתה הראשי. למשל rideup.co.il
//   app       — פאנל ניהול. למשל app.rideup.co.il
//   tenant    — אתר ציבורי של לקוח. למשל mihal.rideup.co.il
//   unknown   — לא תואם לכלום (404)
//
// dev: localhost נחשב marketing כברירת מחדל.
//      לבדיקת tenant בפיתוח: כתובת ?tenant=mihal יכפה על המצב.
// =====================================================================

export type AppZone = 'marketing' | 'app' | 'tenant' | 'unknown';

// Subdomains שלא נחשבים tenants (חופפים ל-reserved_slugs ב-DB).
const RESERVED = new Set([
  'www', 'app', 'api', 'admin', 'mail', 'blog', 'docs', 'help',
  'support', 'billing', 'checkout', 'login', 'signup', 'about',
  'pricing', 'terms', 'privacy', 'rideup', 'dev', 'staging', 'test',
]);

// הדומיין הבסיסי (ללא subdomain). מוגדר בסביבה.
// לדוג': 'rideup.co.il', 'dev.rideup.co.il', או 'localhost'.
const BASE_DOMAIN = (import.meta.env.VITE_BASE_DOMAIN || 'localhost') as string;

export interface HostInfo {
  zone: AppZone;
  tenantSlug: string | null;
  hostname: string;
}

export function detectHost(): HostInfo {
  const hostname = window.location.hostname;

  // dev override: ?tenant=foo
  const params = new URLSearchParams(window.location.search);
  const overrideTenant = params.get('tenant');
  if (overrideTenant) {
    return { zone: 'tenant', tenantSlug: overrideTenant, hostname };
  }
  const overrideZone = params.get('zone') as AppZone | null;
  if (overrideZone) {
    return { zone: overrideZone, tenantSlug: null, hostname };
  }

  // localhost / 127.0.0.1 → marketing (אלא אם override)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return { zone: 'marketing', tenantSlug: null, hostname };
  }

  // אם זה בדיוק ה-base domain → marketing
  if (hostname === BASE_DOMAIN) {
    return { zone: 'marketing', tenantSlug: null, hostname };
  }

  // אם זה xxx.{BASE_DOMAIN} → לבדוק את xxx
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    const sub = hostname.slice(0, -(`.${BASE_DOMAIN}`).length);
    // רק רמה אחת של subdomain (foo.rideup.co.il), לא foo.bar.rideup.co.il
    if (sub.includes('.')) return { zone: 'unknown', tenantSlug: null, hostname };

    if (sub === 'app') return { zone: 'app', tenantSlug: null, hostname };
    if (RESERVED.has(sub)) return { zone: 'marketing', tenantSlug: null, hostname };

    return { zone: 'tenant', tenantSlug: sub, hostname };
  }

  return { zone: 'unknown', tenantSlug: null, hostname };
}
