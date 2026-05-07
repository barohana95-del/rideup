// =====================================================================
// MyTenants — landing page when owner/collaborator hits /admin (no slug).
// Lists every tenant the user owns or has been granted access to.
// =====================================================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, ExternalLink, Loader2, Users, Calendar, MapPin,
  Crown, Edit, Eye, ArrowLeft, LogOut, Shield,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { getCurrentUser, logout as authLogout } from '../../lib/auth';
import Logo from '../marketing/components/Logo';

type Tenant = {
  id: number;
  slug: string;
  status: string;
  plan: string;
  theme: string;
  eventType: string | null;
  eventTitle: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  trialEndsAt: string | null;
  paidUntil: string | null;
  createdAt: string;
  myRole: 'owner' | 'editor' | 'viewer';
  registrations: number;
  guests: number;
};

const ROLE_LABEL: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  owner:  { label: 'בעלים',  icon: Crown, color: '#FCD34D' },
  editor: { label: 'עורך',   icon: Edit,  color: '#7D39EB' },
  viewer: { label: 'צופה',   icon: Eye,   color: '#6B7280' },
};

const PLAN_COLORS: Record<string, string> = {
  trial: '#F59E0B', basic: '#6B7280', pro: '#7D39EB', premium: '#8B5CF6',
};
const STATUS_COLORS: Record<string, string> = {
  draft: '#9CA3AF', trial: '#F59E0B', active: '#10B981',
  expired: '#DC2626', archived: '#6B7280', suspended: '#7F1D1D',
};

export default function MyTenants() {
  const user = getCurrentUser();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.myTenants().then((r) => {
      setLoading(false);
      if (r.success && r.data) setTenants(r.data as unknown as Tenant[]);
      else setError(r.error ?? 'שגיאה בטעינה');
    });
  }, []);

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

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#F2EBFF' }}>
      {/* Top bar */}
      <header
        className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-3"
        style={{ background: '#000', color: '#fff' }}
      >
        <a href="/" className="shrink-0">
          <Logo size="sm" />
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{ background: '#7D39EB', color: '#fff' }}
          >
            <Plus className="w-4 h-4" />
            צור אתר חדש
          </a>
          <a
            href="/onboarding"
            className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#7D39EB', color: '#fff' }}
            aria-label="צור אתר חדש"
          >
            <Plus className="w-5 h-5" />
          </a>
          <button
            onClick={() => { authLogout(); window.location.href = '/'; }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            aria-label="התנתק"
          >
            <LogOut className="w-4 h-4" />
          </button>
          {user.isAdmin && (
            <a
              href="/super-admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold"
              style={{ background: '#FCD34D', color: '#000' }}
            >
              <Crown className="w-3 h-3" />
              SUPER ADMIN
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#7D39EB' }}>
          האתרים שלי
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ color: '#000' }}>
          שלום {(user.displayName ?? user.email).split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          {tenants.length === 0 ? 'אין לך עדיין אתרים. בוא ניצור את הראשון!' : `יש לך ${tenants.length} אתרים פעילים.`}
        </p>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7D39EB' }} />
            </div>
          ) : error ? (
            <div className="rounded-2xl p-6 text-sm"
                 style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
              {error}
            </div>
          ) : tenants.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {tenants.map((t, i) => <TenantCard key={t.id} tenant={t} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TenantCard({ tenant, index }: { tenant: Tenant; index: number }) {
  const role = ROLE_LABEL[tenant.myRole];
  const planColor = PLAN_COLORS[tenant.plan] ?? '#999';
  const statusColor = STATUS_COLORS[tenant.status] ?? '#999';

  return (
    <motion.a
      href={`/admin/${tenant.slug}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-black text-lg leading-tight truncate" style={{ color: '#000' }}>
            {tenant.eventTitle || tenant.slug}
          </p>
          <p className="text-xs font-mono mt-0.5" style={{ color: '#6B7280' }}>
            /{tenant.slug}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
          style={{ background: `${role.color}1A`, color: role.color === '#FCD34D' ? '#92400E' : role.color }}
        >
          <role.icon className="w-3 h-3" />
          {role.label}
        </span>
      </div>

      {/* Date + Location */}
      <div className="space-y-1.5 text-xs mb-4" style={{ color: '#6B7280' }}>
        {tenant.eventDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(tenant.eventDate).toLocaleDateString('he-IL')}</span>
          </div>
        )}
        {tenant.eventLocation && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{tenant.eventLocation}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(125,57,235,0.08)' }}>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" style={{ color: '#7D39EB' }} />
          <div>
            <p className="font-black text-base leading-none" style={{ color: '#000' }}>{tenant.guests}</p>
            <p className="text-[10px]" style={{ color: '#6B7280' }}>אורחים</p>
          </div>
        </div>
        <div className="text-[10px]" style={{ color: '#6B7280' }}>
          {tenant.registrations} רישומים
        </div>
      </div>

      {/* Plan + Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${planColor}1A`, color: planColor }}>
            {tenant.plan}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                style={{ background: `${statusColor}1A`, color: statusColor }}>
            <span className="w-1 h-1 rounded-full" style={{ background: statusColor }} />
            {tenant.status}
          </span>
        </div>
        <ArrowLeft className="w-4 h-4" style={{ color: '#7D39EB' }} />
      </div>

      {/* Public site quick-link */}
      <a
        href={`/${tenant.slug}`}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold"
        style={{ color: '#6B7280' }}
      >
        <ExternalLink className="w-3 h-3" />
        צפה באתר הציבורי
      </a>
    </motion.a>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl p-10 sm:p-16 text-center"
         style={{ background: '#fff', border: '1px dashed rgba(125,57,235,0.3)' }}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
           style={{ background: '#F2EBFF' }}>
        <Plus className="w-8 h-8" style={{ color: '#7D39EB' }} />
      </div>
      <h2 className="text-xl font-black mb-2" style={{ color: '#000' }}>בוא נתחיל</h2>
      <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#6B7280' }}>
        ה-onboarding wizard יבנה לך אתר RSVP מקצועי תוך דקות. שתי לחיצות ואתה בפנים.
      </p>
      <a href="/onboarding"
         className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all"
         style={{ background: '#7D39EB', color: '#fff' }}>
        <Plus className="w-4 h-4" />
        צור אתר חדש
      </a>
    </div>
  );
}

function FullPage({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-6 text-center"
         style={{ background: '#F2EBFF', color: '#000' }}>
      <div>{children}</div>
    </div>
  );
}
