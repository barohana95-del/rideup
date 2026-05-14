// =====================================================================
// SuperAdminApp — platform-owner panel (you, the operator).
// Visible only to users with is_admin=1.
// Tabs: Overview, Tenants, Users.
// =====================================================================
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users as UsersIcon, Briefcase, Loader2, AlertCircle,
  Search, ExternalLink, Edit, Trash2, ShieldAlert,
  TrendingUp, Sparkles, Crown, Menu, X, Lock, Mail, ArrowRight,
} from 'lucide-react';
import { saApi } from '../../lib/api';
import { getCurrentUser, logout as authLogout, type AuthUser } from '../../lib/auth';
import Logo from '../marketing/components/Logo';

type TabKey = 'overview' | 'tenants' | 'users';

type OverviewData = NonNullable<Awaited<ReturnType<typeof saApi.overview>>['data']>;
type TenantRow    = NonNullable<Awaited<ReturnType<typeof saApi.listTenants>>['data']>[number];
type UserRow      = NonNullable<Awaited<ReturnType<typeof saApi.listUsers>>['data']>[number];

const PLAN_COLORS: Record<string, string> = {
  trial:   '#F59E0B',
  basic:   '#6B7280',
  pro:     '#7D39EB',
  premium: '#8B5CF6',
};
const STATUS_COLORS: Record<string, string> = {
  draft:     '#9CA3AF',
  trial:     '#F59E0B',
  active:    '#10B981',
  expired:   '#DC2626',
  archived:  '#6B7280',
  suspended: '#7F1D1D',
};

export default function SuperAdminApp() {
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onTabChange = (t: TabKey) => { setActiveTab(t); setSidebarOpen(false); };

  if (!user) {
    return (
      <FullPage>
        <p className="mb-4">צריך להתחבר תחילה.</p>
        <a href="/onboarding" className="font-bold underline" style={{ color: '#7D39EB' }}>
          למסך התחברות
        </a>
      </FullPage>
    );
  }
  if (!user.isAdmin) {
    return <NoAccessPage user={user} />;
  }

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'סקירה כללית', icon: LayoutDashboard },
    { key: 'tenants',  label: 'אתרי לקוחות', icon: Briefcase },
    { key: 'users',    label: 'משתמשים',     icon: UsersIcon },
  ];

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

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 w-64 shrink-0 flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#000000', color: '#fff', minHeight: '100vh' }}
      >
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

        <div className="px-6 py-5 border-b flex items-center gap-2"
             style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Crown className="w-4 h-4" style={{ color: '#FCD34D' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#FCD34D' }}>
              Super-Admin
            </p>
            <p className="font-bold text-sm">פאנל פלטפורמה</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <li key={tab.key}>
                  <button
                    onClick={() => onTabChange(tab.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-right"
                    style={{
                      background: active ? '#7D39EB' : 'transparent',
                      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
             style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)' }}>
            <ExternalLink className="w-4 h-4" />
            צא לאתר הראשי
          </a>
          <button onClick={() => { authLogout(); window.location.href = '/'; }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
            התנתק
          </button>
          <div className="flex items-center gap-2 px-3 py-2 mt-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                 style={{ background: '#FCD34D', color: '#000000' }}>
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
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between border-b gap-3"
             style={{ background: '#fff', borderColor: 'rgba(125,57,235,0.1)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: '#000', color: '#FCD34D' }}
            aria-label="פתח תפריט"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FCD34D' }}>
              <Crown className="w-3 h-3 inline mr-1" />
              SUPER-ADMIN
            </p>
            <h1 className="text-xl sm:text-2xl mt-0.5 font-black truncate" style={{ color: '#000000' }}>
              {tabs.find((t) => t.key === activeTab)?.label}
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2 }}>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'tenants'  && <TenantsTab />}
              {activeTab === 'users'    && <UsersTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ================================================================== */
/* TAB: Overview                                                       */
/* ================================================================== */
function OverviewTab() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saApi.overview().then((r) => {
      setLoading(false);
      if (r.success && r.data) setData(r.data);
      else setError(r.error ?? 'שגיאה בטעינה');
    });
  }, []);

  if (loading) return <CenteredLoader />;
  if (error || !data) return <ErrorBox message={error ?? 'שגיאה'} />;

  return (
    <div className="space-y-6">
      {/* Top totals */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigStat icon={Briefcase} label="אתרים פעילים"     value={data.totals.tenants}        color="#7D39EB" delta={`+${data.recent.newTenants} השבוע`} />
        <BigStat icon={UsersIcon} label="משתמשים רשומים"   value={data.totals.users}          color="#10B981" delta={`+${data.recent.newUsers} השבוע`} />
        <BigStat icon={TrendingUp} label="סך רישומי אורחים" value={data.totals.registrations}  color="#F59E0B" delta={`+${data.recent.newRegistrations} השבוע`} />
        <BigStat icon={Sparkles}  label="אורחים מאורגנים"  value={data.totals.guests}         color="#8B5CF6" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* By plan */}
        <Panel title="פילוח לפי חבילה">
          {Object.entries(data.byPlan).length === 0 ? (
            <Empty>אין עדיין אתרים</Empty>
          ) : (
            <ul className="space-y-3">
              {Object.entries(data.byPlan).map(([plan, n]) => (
                <li key={plan} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[plan] ?? '#999' }} />
                    <span className="font-bold capitalize" style={{ color: '#000000' }}>{plan}</span>
                  </span>
                  <span className="font-mono" style={{ color: '#6B7280' }}>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* By status */}
        <Panel title="פילוח לפי סטטוס">
          {Object.entries(data.byStatus).length === 0 ? (
            <Empty>אין עדיין אתרים</Empty>
          ) : (
            <ul className="space-y-3">
              {Object.entries(data.byStatus).map(([status, n]) => (
                <li key={status} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[status] ?? '#999' }} />
                    <span className="font-bold" style={{ color: '#000000' }}>{status}</span>
                  </span>
                  <span className="font-mono" style={{ color: '#6B7280' }}>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Latest tenants */}
      <Panel title="אתרים אחרונים שנוצרו">
        {data.latestTenants.length === 0 ? (
          <Empty>אין עדיין אתרים</Empty>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'rgba(125,57,235,0.08)' }}>
            {data.latestTenants.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate" style={{ color: '#000000' }}>
                    {t.eventTitle || t.slug}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#6B7280' }}>
                    {t.ownerEmail ?? '—'} · {t.slug}
                  </p>
                </div>
                <PlanBadge plan={t.plan} />
                <StatusBadge status={t.status} />
                <span className="text-xs font-mono shrink-0" style={{ color: '#6B7280' }}>
                  {new Date(t.createdAt).toLocaleDateString('he-IL')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ================================================================== */
/* TAB: Tenants                                                        */
/* ================================================================== */
function TenantsTab() {
  const [rows, setRows] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<TenantRow | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const r = await saApi.listTenants({ q, plan: planFilter, status: statusFilter });
    setLoading(false);
    if (r.success && r.data) setRows(r.data);
    else setError(r.error ?? 'שגיאה בטעינה');
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [q, planFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="rounded-2xl p-4 flex items-center gap-3 flex-wrap"
           style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי slug, שם אירוע, או אימייל..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#000000' }}
          />
        </div>
        <FilterSelect value={planFilter} onChange={setPlanFilter} options={[
          { v: '', l: 'כל החבילות' },
          { v: 'trial', l: 'נסיון' },
          { v: 'basic', l: 'בסיסי' },
          { v: 'pro', l: 'מקצועי' },
          { v: 'premium', l: 'פרימיום' },
        ]} />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[
          { v: '', l: 'כל הסטטוסים' },
          { v: 'trial', l: 'נסיון' },
          { v: 'active', l: 'פעיל' },
          { v: 'expired', l: 'פג' },
          { v: 'archived', l: 'בארכיון' },
          { v: 'suspended', l: 'מושעה' },
        ]} />
        <span className="text-sm" style={{ color: '#6B7280' }}>
          <span className="font-bold" style={{ color: '#000000' }}>{rows.length}</span> אתרים
        </span>
      </div>

      {error && <ErrorBox message={error} onDismiss={() => setError(null)} />}
      {loading ? <CenteredLoader /> : (
        rows.length === 0 ? <Empty>לא נמצאו אתרים</Empty> :
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#F2EBFF' }}>
                <tr>
                  <Th>אירוע</Th>
                  <Th>בעלים</Th>
                  <Th>חבילה</Th>
                  <Th>סטטוס</Th>
                  <Th align="center">אורחים</Th>
                  <Th>תאריך אירוע</Th>
                  <Th>נוצר</Th>
                  <Th align="center">פעולות</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: 'rgba(125,57,235,0.06)' }}>
                    <Td>
                      <p className="font-bold" style={{ color: '#000000' }}>
                        {r.eventTitle || r.slug}
                      </p>
                      <p className="text-[11px] font-mono" style={{ color: '#6B7280' }}>
                        /{r.slug}
                      </p>
                    </Td>
                    <Td>
                      <p className="text-xs" style={{ color: '#000000' }}>{r.ownerName ?? '—'}</p>
                      <p className="text-[11px]" style={{ color: '#6B7280' }}>{r.ownerEmail ?? '—'}</p>
                    </Td>
                    <Td><PlanBadge plan={r.plan} /></Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td align="center">
                      <span className="font-bold" style={{ color: '#000000' }}>{r.guests}</span>
                      <span className="text-[11px] mr-1" style={{ color: '#6B7280' }}>· {r.registrations}</span>
                    </Td>
                    <Td>
                      <span className="text-xs" style={{ color: r.eventDate ? '#000000' : '#6B7280' }}>
                        {r.eventDate ? new Date(r.eventDate).toLocaleDateString('he-IL') : '—'}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[11px] font-mono" style={{ color: '#6B7280' }}>
                        {new Date(r.createdAt).toLocaleDateString('he-IL')}
                      </span>
                    </Td>
                    <Td align="center">
                      <div className="inline-flex gap-1">
                        <a href={`/admin/${r.slug}`} target="_blank" rel="noreferrer"
                           className="w-7 h-7 rounded-md inline-flex items-center justify-center"
                           style={{ background: '#7D39EB15', color: '#7D39EB' }}
                           title="פתח פאנל ניהול של הלקוח">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button onClick={() => setSelected(r)}
                                className="w-7 h-7 rounded-md inline-flex items-center justify-center"
                                style={{ background: '#F59E0B15', color: '#F59E0B' }}
                                title="פעולות">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action drawer */}
      <AnimatePresence>
        {selected && (
          <TenantActionDrawer
            tenant={selected}
            onClose={() => setSelected(null)}
            onSaved={() => { setSelected(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TenantActionDrawer({ tenant, onClose, onSaved }: {
  tenant: TenantRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: string, value?: unknown) {
    setBusy(action);
    setError(null);
    const r = await saApi.tenantAction(tenant.id, action, value);
    setBusy(null);
    if (!r.success) { setError(r.error ?? 'שגיאה'); return; }
    onSaved();
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end"
                initial={{ background: 'rgba(0,0,0,0)' }}
                animate={{ background: 'rgba(0,0,0,0.5)' }}
                exit={{ background: 'rgba(0,0,0,0)' }}
                onClick={onClose}>
      <motion.div className="w-full max-w-md h-full overflow-y-auto p-6"
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.25 }}
                  style={{ background: '#fff' }}
                  onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>
              ניהול אתר
            </p>
            <h2 className="text-2xl font-black mt-1" style={{ color: '#000000' }}>
              {tenant.eventTitle || tenant.slug}
            </h2>
            <p className="text-sm font-mono mt-1" style={{ color: '#6B7280' }}>
              /{tenant.slug}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#F2EBFF', color: '#6B7280' }}>
            ×
          </button>
        </div>

        {error && <ErrorBox message={error} onDismiss={() => setError(null)} />}

        {/* Current state */}
        <div className="rounded-2xl p-4 mb-5 space-y-3"
             style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.15)' }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: '#6B7280' }}>חבילה נוכחית</span>
            <PlanBadge plan={tenant.plan} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: '#6B7280' }}>סטטוס</span>
            <StatusBadge status={tenant.status} />
          </div>
          {tenant.trialEndsAt && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#6B7280' }}>נסיון פג ב-</span>
              <span className="font-mono text-xs" style={{ color: '#000000' }}>
                {new Date(tenant.trialEndsAt).toLocaleDateString('he-IL')}
              </span>
            </div>
          )}
          {tenant.paidUntil && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#6B7280' }}>גישה עד</span>
              <span className="font-mono text-xs" style={{ color: '#000000' }}>
                {new Date(tenant.paidUntil).toLocaleDateString('he-IL')}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <Section title="שינוי חבילה">
          <div className="grid grid-cols-4 gap-2">
            {(['trial', 'basic', 'pro', 'premium'] as const).map((p) => (
              <button key={p}
                      onClick={() => run('change_plan', p)}
                      disabled={busy === 'change_plan' || tenant.plan === p}
                      className="px-3 py-2 text-xs font-bold rounded-lg disabled:opacity-40"
                      style={{
                        background: tenant.plan === p ? PLAN_COLORS[p] : '#F2EBFF',
                        color: tenant.plan === p ? '#fff' : '#000000',
                      }}>
                {p}
              </button>
            ))}
          </div>
        </Section>

        <Section title="שינוי סטטוס">
          <div className="grid grid-cols-3 gap-2">
            {(['trial', 'active', 'expired', 'archived', 'suspended'] as const).map((s) => (
              <button key={s}
                      onClick={() => run('change_status', s)}
                      disabled={busy === 'change_status' || tenant.status === s}
                      className="px-3 py-2 text-xs font-bold rounded-lg disabled:opacity-40"
                      style={{
                        background: tenant.status === s ? STATUS_COLORS[s] : '#F2EBFF',
                        color: tenant.status === s ? '#fff' : '#000000',
                      }}>
                {s}
              </button>
            ))}
          </div>
        </Section>

        <Section title="הארכת נסיון">
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button key={d}
                      onClick={() => run('extend_trial', d)}
                      disabled={busy === 'extend_trial'}
                      className="flex-1 px-3 py-2.5 text-sm font-bold rounded-lg"
                      style={{ background: '#F59E0B', color: '#fff' }}>
                +{d} ימים
              </button>
            ))}
          </div>
        </Section>

        <Section title="הארכת גישה (paid_until)">
          <div className="flex gap-2">
            {[30, 60, 180].map((d) => (
              <button key={d}
                      onClick={() => run('extend_access', d)}
                      disabled={busy === 'extend_access'}
                      className="flex-1 px-3 py-2.5 text-sm font-bold rounded-lg"
                      style={{ background: '#10B981', color: '#fff' }}>
                +{d} ימים
              </button>
            ))}
          </div>
        </Section>

        <Section title="פעולות מסוכנות" danger>
          <button onClick={() => {
                    if (!confirm(`למחוק את "${tenant.slug}"? (soft-delete — נשאר ב-DB עם status=deleted)`)) return;
                    run('delete');
                  }}
                  disabled={busy === 'delete'}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2"
                  style={{ background: '#DC2626', color: '#fff' }}>
            <Trash2 className="w-4 h-4" />
            מחק אתר (soft)
          </button>
        </Section>

        {busy && (
          <div className="text-center py-3 text-sm" style={{ color: '#6B7280' }}>
            <Loader2 className="w-4 h-4 animate-spin inline ml-2" />
            מבצע {busy}...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/* TAB: Users                                                          */
/* ================================================================== */
function UsersTab() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    const r = await saApi.listUsers(q || undefined);
    setLoading(false);
    if (r.success && r.data) setRows(r.data);
    else setError(r.error ?? 'שגיאה בטעינה');
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-4 flex items-center gap-3 flex-wrap"
           style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי אימייל או שם..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#000000' }}
          />
        </div>
        <span className="text-sm" style={{ color: '#6B7280' }}>
          <span className="font-bold" style={{ color: '#000000' }}>{rows.length}</span> משתמשים
        </span>
      </div>

      {error && <ErrorBox message={error} onDismiss={() => setError(null)} />}
      {loading ? <CenteredLoader /> :
        rows.length === 0 ? <Empty>לא נמצאו משתמשים</Empty> :
        <div className="rounded-2xl overflow-hidden"
             style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: '#F2EBFF' }}>
              <tr>
                <Th>שם</Th>
                <Th>אימייל</Th>
                <Th align="center">אתרים</Th>
                <Th align="center">תפקיד</Th>
                <Th>הצטרף</Th>
                <Th>כניסה אחרונה</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-t" style={{ borderColor: 'rgba(125,57,235,0.06)' }}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                           style={{ background: '#7D39EB', color: '#fff' }}>
                        {(u.displayName ?? u.email)[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold" style={{ color: '#000000' }}>
                        {u.displayName ?? '—'}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <a href={`mailto:${u.email}`} className="text-xs" style={{ color: '#7D39EB' }}>
                      {u.email}
                    </a>
                  </Td>
                  <Td align="center">
                    <span className="font-bold" style={{ color: '#000000' }}>{u.tenantsCount}</span>
                  </Td>
                  <Td align="center">
                    {u.isAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: '#FCD34D', color: '#000000' }}>
                        <Crown className="w-2.5 h-2.5" />
                        ADMIN
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: '#6B7280' }}>משתמש</span>
                    )}
                  </Td>
                  <Td>
                    <span className="text-[11px] font-mono" style={{ color: '#6B7280' }}>
                      {new Date(u.createdAt).toLocaleDateString('he-IL')}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[11px] font-mono" style={{ color: '#6B7280' }}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('he-IL') : '—'}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

/* ===== Shared little components ===== */

function FullPage({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-6 text-center"
         style={{ background: '#F2EBFF', color: '#000000' }}>
      <div>{children}</div>
    </div>
  );
}

function NoAccessPage({ user }: { user: AuthUser }) {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 sm:px-6"
         style={{ background: '#000' }}>
      <div className="max-w-md w-full">
        <div className="rounded-3xl p-8 sm:p-10 text-center"
             style={{ background: '#fff', boxShadow: '0 20px 60px -16px rgba(0,0,0,0.5)' }}>
          <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
               style={{ background: '#FEF3C7' }}>
            <Lock className="w-8 h-8" style={{ color: '#92400E' }} />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest mb-2 inline-flex items-center gap-1"
             style={{ color: '#92400E' }}>
            <Crown className="w-3 h-3" />
            Super-Admin
          </p>
          <h1 className="text-2xl font-black mb-2" style={{ color: '#000' }}>
            הפאנל הזה לבעלי הפלטפורמה בלבד
          </h1>
          <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
            רק משתמשים עם הרשאת Super-Admin יכולים לגשת. אם זה אמור להיות אתה —
            בקש מבעל הפלטפורמה להעניק לחשבון שלך את ההרשאה.
          </p>

          <div className="text-right p-4 rounded-xl space-y-2 text-xs"
               style={{ background: '#FAFAFA', color: '#6B7280' }}>
            <p className="font-bold" style={{ color: '#000' }}>אתה מחובר כ:</p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate" dir="ltr">{user.email}</span>
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

function CenteredLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7D39EB' }} />
    </div>
  );
}

function ErrorBox({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="p-4 rounded-2xl flex items-start gap-3"
         style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
      <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
      <p className="text-sm flex-1" style={{ color: '#991B1B' }}>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-xs px-2" style={{ color: '#7F1D1D' }}>×</button>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-10 text-center"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <p className="text-sm" style={{ color: '#6B7280' }}>{children}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <h3 className="font-bold mb-4" style={{ color: '#000000' }}>{title}</h3>
      {children}
    </div>
  );
}

function Section({ title, danger, children }: { title: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1"
         style={{ color: danger ? '#DC2626' : '#6B7280' }}>
        {danger && <ShieldAlert className="w-3 h-3" />}
        {title}
      </p>
      {children}
    </div>
  );
}

function BigStat({ icon: Icon, label, value, color, delta }: {
  icon: React.ElementType; label: string; value: number; color: string; delta?: string;
}) {
  return (
    <div className="p-5 rounded-2xl"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background: `${color}1A`, color }}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      <p className="text-3xl font-black" style={{ color: '#000000' }}>
        {value.toLocaleString('he-IL')}
      </p>
      <p className="text-xs font-bold mt-1" style={{ color: '#6B7280' }}>{label}</p>
      {delta && (
        <p className="text-[11px] mt-1" style={{ color }}>{delta}</p>
      )}
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const c = PLAN_COLORS[plan] ?? '#999';
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold"
          style={{ background: `${c}1A`, color: c }}>
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? '#999';
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
          style={{ background: `${c}1A`, color: c }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
      {status}
    </span>
  );
}

function FilterSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { v: string; l: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 text-sm focus:outline-none cursor-pointer"
            style={{ background: '#F2EBFF', borderRadius: '999px', color: '#000000', border: 'none' }}>
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'right' | 'center' | 'left' }) {
  return <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider"
             style={{ color: '#6B7280', textAlign: align }}>{children}</th>;
}
function Td({ children, align = 'right' }: { children: React.ReactNode; align?: 'right' | 'center' | 'left' }) {
  return <td className="px-4 py-3" style={{ color: '#3D4F6B', textAlign: align }}>{children}</td>;
}
