// =====================================================================
// App router — splits into zones (marketing/app/tenant) by host,
// and within marketing also handles routes like /providers.
// =====================================================================
import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { detectHost } from './lib/host';
import MarketingApp from './pages/marketing/MarketingApp';
import OnboardingApp from './pages/onboarding/OnboardingApp';
import AdminApp from './pages/admin/AdminApp';
import TenantApp from './pages/public/TenantApp';
import ProvidersPage from './pages/providers/ProvidersPage';
import NotFound from './pages/public/NotFound';

export default function App() {
  const host = useMemo(() => detectHost(), []);

  return (
    <BrowserRouter>
      {host.zone === 'marketing' && (
        <Routes>
          <Route path="/" element={<MarketingApp />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/onboarding" element={<OnboardingApp />} />
          <Route path="/onboarding/*" element={<OnboardingApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
      {host.zone === 'app' && <AppShell />}
      {host.zone === 'tenant' && host.tenantSlug && <TenantApp slug={host.tenantSlug} />}
      {host.zone === 'unknown' && <NotFound />}
    </BrowserRouter>
  );
}

function AppShell() {
  const path = window.location.pathname;
  if (path.startsWith('/onboarding')) return <OnboardingApp />;
  return <AdminApp host={{ hostname: window.location.hostname }} />;
}
