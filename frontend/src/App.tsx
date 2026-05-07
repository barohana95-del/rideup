// =====================================================================
// App router — purely path-based.
//
// Routes:
//   /                  → MarketingApp
//   /onboarding        → OnboardingApp (wizard)
//   /providers         → ProvidersPage
//   /admin             → AdminApp (will list user's tenants — TODO)
//   /admin/:slug       → AdminApp for that tenant
//   /:slug             → TenantApp (public RSVP). Reserved slugs hit NotFound.
//   *                  → NotFound
// =====================================================================
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import MarketingApp from './pages/marketing/MarketingApp';
import OnboardingApp from './pages/onboarding/OnboardingApp';
import AdminApp from './pages/admin/AdminApp';
import MyTenants from './pages/admin/MyTenants';
import TenantApp from './pages/public/TenantApp';
import ProvidersPage from './pages/providers/ProvidersPage';
import ExperiencePage from './pages/marketing/ExperiencePage';
import SuperAdminApp from './pages/super-admin/SuperAdminApp';
import NotFound from './pages/public/NotFound';

// Slugs the platform reserves. Anything in this set under `/:slug` → 404
// instead of being interpreted as a tenant. Mirror in DB & PHP.
const RESERVED = new Set([
  'admin', 'app', 'api', 'onboarding', 'providers',
  'login', 'signup', 'logout', 'auth',
  'pricing', 'about', 'contact', 'help', 'support',
  'blog', 'docs', 'faq', 'terms', 'privacy', 'cookies',
  'www', 'mail', 'static', 'assets', 'public', 'cdn',
  'rideup', 'experience', 'super-admin', 'sa',
]);

function isValidSlug(s: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/.test(s);
}

/**
 * Wraps the public tenant site. Pulls slug from the URL param,
 * rejects reserved or malformed slugs.
 */
function TenantRoute() {
  const { slug = '' } = useParams<{ slug: string }>();
  const normalized = slug.toLowerCase();
  if (!isValidSlug(normalized) || RESERVED.has(normalized)) {
    return <NotFound />;
  }
  return <TenantApp slug={normalized} />;
}

/** /admin/:slug → admin app for that tenant. */
function AdminRoute() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <MyTenants />;
  return <AdminApp slug={slug.toLowerCase()} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing + meta */}
        <Route path="/" element={<MarketingApp />} />
        <Route path="/onboarding" element={<OnboardingApp />} />
        <Route path="/onboarding/*" element={<OnboardingApp />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/experience" element={<ExperiencePage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/:slug" element={<AdminRoute />} />
        <Route path="/admin/:slug/*" element={<AdminRoute />} />

        {/* Platform owner (you) — Super-Admin */}
        <Route path="/super-admin" element={<SuperAdminApp />} />
        <Route path="/super-admin/*" element={<SuperAdminApp />} />

        {/* Tenant public site (must be after specific routes) */}
        <Route path="/:slug" element={<TenantRoute />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
