// =====================================================================
// AdminApp — tenant admin panel.
// Layout: sidebar (right in RTL) + main content with tabs.
// =====================================================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  Palette,
  Route,
  LogOut,
  ExternalLink,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { getMockUser, logoutMock } from '../../lib/mockAuth';
import type { Tenant, Registration, DashboardStats } from '../../types';
import Logo from '../marketing/components/Logo';
import DashboardTab from './tabs/DashboardTab';
import RegistrationsTab from './tabs/RegistrationsTab';
import SettingsTab from './tabs/SettingsTab';

type TabKey = 'dashboard' | 'registrations' | 'settings' | 'design' | 'trip';

const tabs: { key: TabKey; label: string; icon: React.ElementType; comingSoon?: boolean }[] = [
  { key: 'dashboard',     label: 'דשבורד',      icon: LayoutDashboard },
  { key: 'registrations', label: 'רישומים',     icon: Users },
  { key: 'settings',      label: 'הגדרות',      icon: SettingsIcon },
  { key: 'design',        label: 'עיצוב',       icon: Palette,        comingSoon: true },
  { key: 'trip',          label: 'תכנון נסיעה', icon: Route,          comingSoon: true },
];

export default function AdminApp(_props: { host?: { hostname: string } }) {
  const [searchParams] = useSearchParams();
  const slugFromQuery = searchParams.get('slug');
  const slugFromPath = window.location.pathname.match(/^\/admin\/([a-z0-9-]+)/)?.[1] ?? null;
  const slug = slugFromPath ?? slugFromQuery;

  const user = getMockUser();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Slug חסר. הוסף ?slug=your-slug ל-URL.');
      setLoading(false);
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function loadAll() {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const [tenantRes, statsRes, regRes] = await Promise.all([
      adminApi.getTenant(slug),
      adminApi.getStats(slug),
      adminApi.listRegistrations(slug),
    ]);

    if (!tenantRes.success) {
      setError(tenantRes.error ?? 'לא ניתן לטעון את האתר');
      setLoading(false);
      return;
    }
    setTenant((tenantRes.data as any).tenant);
    if (statsRes.success) setStats(statsRes.data!);
    if (regRes.success) setRegistrations(regRes.data!);
    setLoading(false);
  }

  if (!user) {
    return (
      <FullPageMessage>
        <p className="mb-4">צריך להתחבר תחילה.</p>
        <a href="/onboarding" className="text-cyan font-bold underline">למסך התחברות</a>
      </FullPageMessage>
    );
  }
  if (loading) {
    return (
      <FullPageMessage>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1E63D6' }} />
      </FullPageMessage>
    );
  }
  if (error) {
    return <FullPageMessage>{error}</FullPageMessage>;
  }
  if (!tenant) return null;

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: '#EAF1FB' }}>
      {/* Sidebar (right in RTL) */}
      <aside
        className="w-64 shrink-0 flex flex-col"
        style={{ background: '#0A1F44', color: '#fff', minHeight: '100vh' }}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Logo size="sm" />
        </div>

        {/* Tenant info */}
        <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            האתר שלך
          </p>
          <p className="font-bold text-lg truncate" title={tenant.eventTitle ?? slug ?? ''}>
            {tenant.eventTitle || slug}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: tenant.status === 'trial' ? 'rgba(251,191,36,0.2)' : 'rgba(30,99,214,0.25)',
                color: tenant.status === 'trial' ? '#FCD34D' : '#7DB1FF',
              }}
            >
              {tenant.plan}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.2)', color: '#86EFAC' }}
            >
              {tenant.status === 'trial' ? 'נסיון' : tenant.status === 'active' ? 'פעיל' : tenant.status}
            </span>
          </div>
        </div>

        {/* Tabs nav */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              const disabled = tab.comingSoon;
              return (
                <li key={tab.key}>
                  <button
                    onClick={() => !disabled && setActiveTab(tab.key)}
                    disabled={disabled}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-right"
                    style={{
                      background: active ? '#1E63D6' : 'transparent',
                      color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span className="flex-1">{tab.label}</span>
                    {disabled && (
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        בקרוב
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom — view site + logout */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <a
            href={`/?tenant=${slug}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)' }}
          >
            <ExternalLink className="w-4 h-4" />
            צפה באתר הציבורי
          </a>
          <button
            onClick={() => { logoutMock(); window.location.href = '/'; }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <LogOut className="w-4 h-4" />
            התנתק
          </button>

          {/* User chip */}
          <div className="flex items-center gap-2 px-3 py-2 mt-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ background: '#1E63D6', color: '#fff' }}
            >
              {user.displayName[0]}
            </div>
            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {user.displayName}
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div
          className="px-8 py-5 flex items-center justify-between border-b"
          style={{ background: '#fff', borderColor: 'rgba(30,99,214,0.1)' }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1E63D6' }}>
              {tabs.find((t) => t.key === activeTab)?.label}
            </p>
            <h1 className="display text-2xl mt-0.5" style={{ color: '#0A1F44' }}>
              ברוך שובך, {user.displayName.split(' ')[0]}
            </h1>
          </div>
          <a
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: '#EAF1FB', color: '#1E63D6' }}
          >
            <ArrowLeft className="w-4 h-4" />
            צור אתר נוסף
          </a>
        </div>

        {/* Tab content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardTab
                  tenant={tenant}
                  stats={stats}
                  registrations={registrations}
                  slug={slug!}
                />
              )}
              {activeTab === 'registrations' && (
                <RegistrationsTab
                  slug={slug!}
                  registrations={registrations}
                  onChange={async () => {
                    const r = await adminApi.listRegistrations(slug!);
                    if (r.success) setRegistrations(r.data!);
                  }}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab tenant={tenant} slug={slug!} onSaved={loadAll} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function FullPageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center px-6 text-center"
      style={{ background: '#EAF1FB', color: '#0A1F44' }}
    >
      <div>{children}</div>
    </div>
  );
}
