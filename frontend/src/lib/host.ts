// =====================================================================
// Route detection — path-based zone detection.
// (Filename kept as `host.ts` for backward-compat with existing imports.)
//
// Zones:
//   marketing — landing + meta pages   (/, /onboarding, /providers, /pricing, ...)
//   admin     — tenant owner panel     (/admin, /admin/<slug>)
//   tenant    — public RSVP site       (/<slug>) — anything not reserved
//   unknown   — fallback / 404
//
// Examples:
//   rideup.integrity-web.com/                  → marketing
//   rideup.integrity-web.com/onboarding        → marketing (onboarding wizard)
//   rideup.integrity-web.com/admin/aviv-bar    → admin
//   rideup.integrity-web.com/aviv-bar          → tenant (public RSVP)
//   localhost:3000/aviv-bar                    → tenant (same as prod)
// =====================================================================

export type AppZone = 'marketing' | 'app' | 'tenant' | 'unknown';

// First-segment slugs reserved for the platform itself (never a tenant).
// Mirror this list in the DB `reserved_slugs` table and in PHP.
const RESERVED = new Set([
  // platform pages
  'admin', 'app', 'api', 'onboarding', 'providers',
  'login', 'signup', 'logout', 'auth',
  'pricing', 'about', 'contact', 'help', 'support',
  'blog', 'docs', 'faq', 'terms', 'privacy', 'cookies',
  // technical
  'www', 'mail', 'static', 'assets', 'public', 'cdn',
  // brand reservations
  'rideup', 'app-store', 'play-store',
  // env subdomains (still keep for safety)
  'dev', 'staging', 'test',
]);

export interface HostInfo {
  zone: AppZone;
  tenantSlug: string | null;
  /** First path segment — useful for debugging/logging. */
  pathSegment: string;
  /** The original hostname (informational). */
  hostname: string;
}

function isValidSlug(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/.test(s);
}

export function detectHost(): HostInfo {
  const hostname = window.location.hostname;
  const path = window.location.pathname;

  // Optional explicit overrides via query (kept for dev convenience).
  const params = new URLSearchParams(window.location.search);
  const overrideZone = params.get('zone') as AppZone | null;
  const overrideTenant = params.get('tenant');
  if (overrideZone) {
    return { zone: overrideZone, tenantSlug: overrideTenant, pathSegment: '', hostname };
  }

  // Extract the first path segment.
  const segments = path.split('/').filter(Boolean);
  const first = (segments[0] ?? '').toLowerCase();

  // Root → marketing.
  if (first === '') {
    return { zone: 'marketing', tenantSlug: null, pathSegment: '', hostname };
  }

  // /admin and /admin/<slug>
  if (first === 'admin') {
    const slug = (segments[1] ?? '').toLowerCase();
    return {
      zone: 'app',
      tenantSlug: slug && isValidSlug(slug) ? slug : null,
      pathSegment: first,
      hostname,
    };
  }

  // Reserved → stays in marketing zone (router handles which page).
  if (RESERVED.has(first)) {
    return { zone: 'marketing', tenantSlug: null, pathSegment: first, hostname };
  }

  // Anything else that looks like a slug → tenant zone.
  if (isValidSlug(first)) {
    return { zone: 'tenant', tenantSlug: first, pathSegment: first, hostname };
  }

  return { zone: 'unknown', tenantSlug: null, pathSegment: first, hostname };
}
