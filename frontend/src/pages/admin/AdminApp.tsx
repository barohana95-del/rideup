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
  Menu,
  X,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { getCurrentUser, logout as authLogout, type AuthUser } from '../../lib/auth';
import type { Tenant, Registration, DashboardStats } from '../../types';
import Logo from '../marketing/components/Logo';
import DashboardTab from './tabs/DashboardTab';
import RegistrationsTab from './tabs/RegistrationsTab';
import SettingsTab from './tabs/SettingsTab';
import EditorTab from './tabs/EditorTab';
import TripPlanningTab from './tabs/TripPlanningTab';

type TabKey = 'dashboard' | 'registrations' | 'design' | 'trip' | 'settings';

const tabs: { key: TabKey; label: string; icon: React.ElementType; comingSoon?: boolean }[] = [
  { key: 'dashboard',     label: 'דשבורד',      icon: LayoutDashboard },
  { key: 'registrations', label: 'רישומים',     icon: Users },
  { key: 'trip',          label: 'תכנון נסיעה', icon: Route },
  { key: 'design',        label: 'עיצוב',       icon: Palette },
  { key: 'settings',      label: 'הגדרות',      icon: SettingsIcon },
];

export default function AdminApp({ slug }: { slug: string }) {

  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-close sidebar on tab change (mobile)
  const onTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

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
    setErrorCode(null);

    const [tenantRes, statsRes, regRes] = await Promise.all([
      adminApi.getTenant(slug),
      adminApi.getStats(slug),
      adminApi.listRegistrations(slug),
    ]);

    if (!tenantRes.success) {
      setError(tenantRes.error ?? 'לא ניתן לטעון את האתר');
      setErrorCode((tenantRes as { code?: string }).code ?? null);
      setLoading(false);
      return;
    }
    const td = tenantRes.data as any;
    setTenant(td.tenant);
    setSettings(td.settings ?? {});
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
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7D39EB' }} />
      </FullPageMessage>
    );
  }
  if (error) {
    const isAccessIssue = errorCode === 'forbidden' || errorCode === 'not_found';
    if (isAccessIssue) {
      return <NoAccessPage slug={slug} user={user} reason={errorCode} />;
    }
    return <FullPageMessage>{error}</FullPageMessage>;
  }
  if (!tenant) return null;

  return (
    <div dir="rtl" className="min-h-screen lg:flex" style={{ background: '#F2EBFF' }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      {/* Sidebar (right in RTL) */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 w-64 shrink-0 flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#000000', color: '#fff', minHeight: '100vh' }}
      >
        {/* Logo + mobile close */}
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Logo size="sm" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            aria-label="סגור"
          >
            <X className="w-4 h-4" />
          </button>
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
                background: tenant.status === 'trial' ? 'rgba(251,191,36,0.2)' : 'rgba(125,57,235,0.25)',
                color: tenant.status === 'trial' ? '#FCD34D' : '#C4A1FF',
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
                    onClick={() => !disabled && onTabChange(tab.key)}
                    disabled={disabled}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-right"
                    style={{
                      background: active ? '#7D39EB' : 'transparent',
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
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)' }}
          >
            <ExternalLink className="w-4 h-4" />
            צפה באתר הציבורי
          </a>
          <button
            onClick={() => { authLogout(); window.location.href = '/'; }}
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
              style={{ background: '#7D39EB', color: '#fff' }}
            >
              {user.displayName?.[0] ?? user.email[0]}
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
          className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between border-b gap-3"
          style={{ background: '#fff', borderColor: 'rgba(125,57,235,0.1)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#F2EBFF', color: '#7D39EB' }}
            aria-label="פתח תפריט"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest truncate" style={{ color: '#7D39EB' }}>
              {tabs.find((t) => t.key === activeTab)?.label}
            </p>
            <h1 className="display text-xl sm:text-2xl mt-0.5 truncate" style={{ color: '#000000' }}>
              ברוך שובך, {(user.displayName ?? user.email).split(' ')[0]}
            </h1>
          </div>
          <a
            href="/onboarding"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shrink-0"
            style={{ background: '#F2EBFF', color: '#7D39EB' }}
          >
            <ArrowLeft className="w-4 h-4" />
            צור אתר נוסף
          </a>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-6 lg:p-8">
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
              {activeTab === 'trip' && (
                <TripPlanningTab slug={slug!} />
              )}
              {activeTab === 'design' && (
                <EditorTab
                  tenant={tenant}
                  settings={settings}
                  slug={slug!}
                  onSaved={(newSlug) => {
                    if (newSlug !== slug) {
                      // Slug changed → navigate to new admin URL
                      window.location.href = `/admin/${newSlug}`;
                    } else {
                      loadAll();
                    }
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
      style={{ background: '#F2EBFF', color: '#000000' }}
    >
      <div>{children}</div>
    </div>
  );
}

/**
 * Shown when the user is logged in but doesn't have access to this tenant
 * (403 forbidden, or 404 not_found — both treated as "no access" here
 * to avoid leaking which tenants exist).
 */
function NoAccessPage({ slug, user, reason }: {
  slug: string;
  user: AuthUser;
  reason: string | null;
}) {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 sm:px-6"
         style={{ background: '#000' }}>
      <div className="max-w-md w-full">
        <div className="rounded-3xl p-8 sm:p-10 text-center"
             style={{ background: '#fff', boxShadow: '0 20px 60px -16px rgba(0,0,0,0.5)' }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
               style={{ background: '#F2EBFF' }}>
            <Lock className="w-8 h-8" style={{ color: '#7D39EB' }} />
          </div>

          <h1 className="text-2xl font-black mb-2" style={{ color: '#000' }}>
            אין לך גישה לאתר הזה
          </h1>
          <p className="text-sm mb-1" style={{ color: '#6B7280' }}>
            {reason === 'not_found'
              ? 'האתר לא קיים, או שאינך משתף בגישה.'
              : 'רק הבעלים או מי שקיבל הזמנה יכולים לראות את הפאנל.'}
          </p>
          <p className="text-xs mt-4 p-3 rounded-xl"
             style={{ background: '#F2EBFF', color: '#000', fontFamily: 'monospace' }} dir="ltr">
            /{slug}
          </p>

          <div className="mt-6 text-right p-4 rounded-xl space-y-2 text-xs"
               style={{ background: '#FAFAFA', color: '#6B7280' }}>
            <p className="font-bold" style={{ color: '#000' }}>אתה מחובר כ:</p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate" dir="ltr">{user.email}</span>
            </p>
            <p>
              אם זה לא חשבון Google שאליו נשלחה הזמנה — בקש מהבעלים להזמין את האימייל הזה,
              או התחבר עם חשבון אחר.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <a href="/admin"
               className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all"
               style={{ background: '#7D39EB', color: '#fff' }}>
              <ArrowRight className="w-4 h-4" />
              לאתרים שלי
            </a>
            <button onClick={() => { authLogout(); window.location.href = '/'; }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all"
                    style={{ background: '#F2EBFF', color: '#7D39EB' }}>
              התחבר מחדש
            </button>
          </div>
        </div>

        <a href="/" className="block text-center mt-5 text-sm hover:underline"
           style={{ color: 'rgba(255,255,255,0.6)' }}>
          חזרה לעמוד הבית
        </a>
      </div>
    </div>
  );
}
