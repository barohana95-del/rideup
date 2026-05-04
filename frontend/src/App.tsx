// =====================================================================
// RideUp — App Router
// בוחר אזור (marketing/app/tenant) לפי ה-host, ומפעיל את ה-router המתאים.
// =====================================================================
import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { detectHost } from './lib/host';
import MarketingApp from './pages/marketing/MarketingApp';
import OnboardingApp from './pages/onboarding/OnboardingApp';
import AdminApp from './pages/admin/AdminApp';
import TenantApp from './pages/public/TenantApp';
import NotFound from './pages/public/NotFound';

export default function App() {
  const host = useMemo(() => detectHost(), []);

  return (
    <BrowserRouter>
      {host.zone === 'marketing' && <MarketingApp />}
      {host.zone === 'app' && <AppShell host={host} />}
      {host.zone === 'tenant' && host.tenantSlug && <TenantApp slug={host.tenantSlug} />}
      {host.zone === 'unknown' && <NotFound />}
    </BrowserRouter>
  );
}

// AppShell משתף routing בין onboarding ו-admin (אותו subdomain `app.`).
function AppShell({ host }: { host: ReturnType<typeof detectHost> }) {
  const path = window.location.pathname;
  if (path.startsWith('/onboarding')) return <OnboardingApp />;
  return <AdminApp host={host} />;
}
