import { Users, MapPin, Clock, Sparkles } from 'lucide-react';
import type { Tenant, DashboardStats, Registration } from '../../../types';

export default function DashboardTab({
  tenant,
  stats,
  registrations,
  slug,
}: {
  tenant: Tenant;
  stats: DashboardStats | null;
  registrations: Registration[];
  slug: string;
}) {
  const recent = registrations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="סך אורחים"
          value={stats?.totalGuests ?? 0}
          sub={`${stats?.totalRegistrations ?? 0} רישומים`}
          color="#1E63D6"
        />
        <StatCard
          icon={MapPin}
          label="ערים"
          value={stats?.cityDistribution.length ?? 0}
          sub="פעילות"
          color="#10B981"
        />
        <StatCard
          icon={Clock}
          label="משמרות"
          value={stats?.shiftDistribution.length ?? 0}
          sub="חזרה"
          color="#F59E0B"
        />
        <StatCard
          icon={Sparkles}
          label="חבילה"
          value={tenant.plan}
          sub={tenant.status}
          color="#8B5CF6"
          isText
        />
      </div>

      {/* Quick share link */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B7C95' }}>
            הקישור לשיתוף
          </p>
          <code className="font-mono text-base font-bold" style={{ color: '#0A1F44' }}>
            {slug}.rideup.co.il
          </code>
        </div>
        <button
          onClick={() => {
            const url = `https://${slug}.rideup.co.il`;
            navigator.clipboard?.writeText(url);
          }}
          className="px-5 py-2.5 rounded-full font-bold text-sm transition-all"
          style={{ background: '#1E63D6', color: '#fff' }}
        >
          העתק קישור
        </button>
      </div>

      {/* Two columns: distribution + recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* City distribution */}
        <Panel title="פילוח לפי עיר" icon={MapPin}>
          {stats && stats.cityDistribution.length > 0 ? (
            <ul className="space-y-3">
              {stats.cityDistribution.slice(0, 8).map((c) => {
                const max = stats.cityDistribution[0].guests || 1;
                const pct = (c.guests / max) * 100;
                return (
                  <li key={c.city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#0A1F44', fontWeight: 600 }}>{c.city}</span>
                      <span style={{ color: '#6B7C95' }}>
                        {c.guests} אורחים <span className="opacity-60">· {c.count} רישומים</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EAF1FB' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: '#1E63D6' }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty>אין רישומים עדיין</Empty>
          )}
        </Panel>

        {/* Recent registrations */}
        <Panel title="רישומים אחרונים" icon={Users}>
          {recent.length > 0 ? (
            <ul className="space-y-2">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl"
                  style={{ background: '#EAF1FB' }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: '#1E63D6', color: '#fff' }}
                  >
                    {r.fullName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#0A1F44' }}>
                      {r.fullName}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7C95' }}>
                      {r.city ?? '—'} · {r.numGuests} אורחים
                    </p>
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#6B7C95' }}>
                    {new Date(r.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>אין רישומים עדיין</Empty>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  isText,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  isText?: boolean;
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}1A`, color }}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
      <p
        className={isText ? 'display text-xl' : 'display text-3xl'}
        style={{ color: '#0A1F44' }}
      >
        {value}
      </p>
      <p className="text-xs font-bold mt-1" style={{ color: '#6B7C95' }}>
        {label}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: '#6B7C95', opacity: 0.7 }}>
        {sub}
      </p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" style={{ color: '#1E63D6' }} />
        <h2 className="font-bold" style={{ color: '#0A1F44' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-center py-10 text-sm" style={{ color: '#6B7C95' }}>{children}</p>;
}
