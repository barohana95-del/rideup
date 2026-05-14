// =====================================================================
// AccountApp — Personal Area (visual continuity with the main site,
// NOT the admin panel chrome).
//
// Sections:
//   - Welcome (avatar + name + email)
//   - Subscription card (current plan + site usage / limit)
//   - Personal details (Google profile mirror — read-only for now)
//   - My sites quick view + "Build new site" CTA
// =====================================================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, ExternalLink, Loader2, Calendar, MapPin,
  Crown, Edit, Eye, Sparkles, AlertCircle, Mail, Globe,
  CheckCircle2, Settings as SettingsIcon, User as UserIcon,
  ChevronLeft, Clock,
} from 'lucide-react';
import { adminApi } from '../../lib/api';
import { getCurrentUser, refreshUser, type AuthUser } from '../../lib/auth';
import { PLANS, getPlan, isAtLimit } from '../../lib/plans';
import Navbar from '../marketing/components/Navbar';
import Footer from '../marketing/components/Footer';
import type { TenantPlan } from '../../types';

type AccountTenant = {
  id: number;
  slug: string;
  status: string;
  plan: TenantPlan;
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

const PLAN_RANK: Record<TenantPlan, number> = { trial: 0, basic: 1, pro: 2, premium: 3 };

export default function AccountApp() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [tenants, setTenants] = useState<AccountTenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always re-verify on mount
  useEffect(() => {
    refreshUser().then((u) => {
      setUser(u);
      if (!u) window.location.replace('/login?next=/account');
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoadingTenants(true);
    adminApi.myTenants().then((res) => {
      setLoadingTenants(false);
      if (res.success && res.data) setTenants(res.data as AccountTenant[]);
      else setError(res.error ?? 'שגיאה בטעינת האתרים');
    });
  }, [user]);

  if (!user) {
    return <FullPageLoader />;
  }

  // Owned tenants only (collaborators don't count against the quota).
  const owned = tenants.filter((t) => t.myRole === 'owner' && t.status !== 'archived' && t.status !== 'deleted');
  // "Effective" plan = highest plan among owned tenants (or trial if none).
  const effectivePlan: TenantPlan = owned.length === 0
    ? 'trial'
    : (owned.reduce<TenantPlan>((acc, t) => (PLAN_RANK[t.plan] > PLAN_RANK[acc] ? t.plan : acc), 'trial'));
  const planSpec = getPlan(effectivePlan);
  const atLimit = isAtLimit(effectivePlan, owned.length);

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden" style={{ background: '#F8F9FA' }}>
      <Navbar />

      <main className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Welcome hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-10 flex-wrap"
          >
            <Avatar user={user} size={64} />
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#7D39EB' }}>
                האזור האישי שלך
              </p>
              <h1 className="display text-3xl md:text-4xl" style={{ color: '#000' }}>
                {greet()}, {user.displayName?.split(' ')[0] || 'אורח'}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                כאן תוכל לראות את החבילה שלך, פרטים אישיים והאתרים שיצרת.
              </p>
            </div>
          </motion.div>

          {/* Subscription + CTA row */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <SubscriptionCard plan={planSpec} sitesOwned={owned.length} atLimit={atLimit} />
            <BuildSiteCard atLimit={atLimit} planLabel={planSpec.label} />
          </div>

          {/* Personal details */}
          <Section icon={UserIcon} title="פרטים אישיים" subtitle="הפרטים נמשכים אוטומטית מ-Google.">
            <ProfileRow label="שם מלא" value={user.displayName || '—'} />
            <ProfileRow label="אימייל" value={user.email} icon={Mail} dir="ltr" />
            <ProfileRow label="חשבון" value={user.isAdmin ? 'מנהל פלטפורמה' : 'משתמש'} />
            <p className="text-xs mt-4 px-4" style={{ color: '#9CA3AF' }}>
              שינויי שם / אימייל ייתבצעו דרך הגדרות חשבון Google שלך.
            </p>
          </Section>

          {/* My sites */}
          <Section icon={Globe} title="האתרים שלי"
                   subtitle={tenants.length === 0 ? 'עוד לא יצרת אתרים.' : `${tenants.length} אתר${tenants.length === 1 ? '' : 'ים'}`}>
            {loadingTenants ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#7D39EB' }} />
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl flex items-start gap-2 text-sm"
                   style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            ) : tenants.length === 0 ? (
              <EmptyState atLimit={atLimit} />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {tenants.map((t) => <TenantCard key={t.id} t={t} />)}
              </div>
            )}
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function greet(): string {
  const h = new Date().getHours();
  if (h < 6) return 'לילה טוב';
  if (h < 12) return 'בוקר טוב';
  if (h < 18) return 'צהריים טובים';
  return 'ערב טוב';
}

function Avatar({ user, size }: { user: AuthUser; size: number }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.displayName ?? user.email} className="rounded-full object-cover"
                style={{ width: size, height: size }} referrerPolicy="no-referrer" />;
  }
  const initial = (user.displayName?.[0] ?? user.email[0] ?? '?').toUpperCase();
  return (
    <div className="rounded-full flex items-center justify-center font-black text-white"
         style={{ width: size, height: size, background: '#7D39EB', fontSize: size * 0.42 }}>
      {initial}
    </div>
  );
}

function SubscriptionCard({ plan, sitesOwned, atLimit }: { plan: ReturnType<typeof getPlan>; sitesOwned: number; atLimit: boolean }) {
  const limitLabel = plan.siteLimit === null ? 'ללא הגבלה' : `${sitesOwned} מתוך ${plan.siteLimit}`;
  return (
    <div className="md:col-span-2 rounded-3xl p-6 md:p-8 relative overflow-hidden"
         style={{ background: '#000', color: '#fff' }}>
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl opacity-25"
           style={{ background: plan.color }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: plan.color }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: plan.color }}>
            החבילה הנוכחית
          </p>
        </div>
        <h2 className="display text-3xl md:text-4xl">{plan.label}</h2>
        <p className="text-sm mt-1 mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {plan.tagline}
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          <Stat label="אתרים פעילים" value={limitLabel} />
          <Stat label="מחיר חודשי" value={plan.priceMonthly === 'free' ? 'חינם' : plan.priceMonthly === 'custom' ? 'התאמה אישית' : `₪${plan.priceMonthly}`} />
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {plan.features.map((f) => (
            <li key={f} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: plan.color }} />
              {f}
            </li>
          ))}
        </ul>

        {atLimit && (
          <div className="mt-5 p-3 rounded-xl text-sm inline-flex items-start gap-2"
               style={{ background: 'rgba(252, 211, 77, 0.15)', border: '1px solid rgba(252, 211, 77, 0.4)', color: '#FCD34D' }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>הגעת למגבלת האתרים של החבילה. לשדרוג — פנה אלינו דרך התמיכה.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-3.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  );
}

function BuildSiteCard({ atLimit, planLabel }: { atLimit: boolean; planLabel: string }) {
  return (
    <a
      href={atLimit ? undefined : '/onboarding'}
      onClick={(e) => { if (atLimit) e.preventDefault(); }}
      className={`block rounded-3xl p-6 transition-all ${atLimit ? 'cursor-not-allowed opacity-60' : 'hover:-translate-y-0.5 active:scale-[0.99]'}`}
      style={{
        background: 'linear-gradient(135deg, #7D39EB 0%, #5B21B6 100%)',
        color: '#fff',
        boxShadow: atLimit ? 'none' : '0 18px 40px -16px rgba(125,57,235,0.55)',
      }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
           style={{ background: 'rgba(255,255,255,0.18)' }}>
        <Plus className="w-6 h-6" />
      </div>
      <h3 className="display text-2xl mb-1">אתר חדש</h3>
      <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {atLimit
          ? `הגעת למגבלה של חבילת ${planLabel}.`
          : 'הקם אתר RSVP חדש לאירוע הבא שלך. תהליך של 5 דקות.'}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-bold">
        התחל הקמה <ChevronLeft className="w-4 h-4" />
      </span>
    </a>
  );
}

function Section({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl p-6 md:p-8 mb-6"
             style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 24px -10px rgba(0,0,0,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color: '#7D39EB' }} />
        <h2 className="font-bold text-lg" style={{ color: '#000' }}>{title}</h2>
      </div>
      {subtitle && <p className="text-xs mb-5" style={{ color: '#6B7280' }}>{subtitle}</p>}
      {children}
    </section>
  );
}

function ProfileRow({ label, value, icon: Icon, dir }: { label: string; value: string; icon?: React.ElementType; dir?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: '#F3F4F6' }}>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6B7280' }}>{label}</span>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: '#000' }} dir={dir}>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: '#9CA3AF' }} />}
        {value}
      </span>
    </div>
  );
}

const ROLE_META = {
  owner:  { label: 'בעלים', icon: Crown, color: '#FCD34D' },
  editor: { label: 'עורך',  icon: Edit,  color: '#7D39EB' },
  viewer: { label: 'צופה',  icon: Eye,   color: '#6B7280' },
} as const;

function TenantCard({ t }: { t: AccountTenant }) {
  const roleMeta = ROLE_META[t.myRole];
  const planSpec = getPlan(t.plan);
  const archived = t.status === 'archived';
  return (
    <div className={`rounded-2xl p-4 transition-all hover:-translate-y-0.5 ${archived ? 'opacity-60' : ''}`}
         style={{ background: '#F8F9FA', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base truncate" style={{ color: '#000' }}>{t.eventTitle || '(ללא כותרת)'}</p>
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }} dir="ltr">/{t.slug}</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: `${roleMeta.color}1A`, color: roleMeta.color === '#FCD34D' ? '#92400E' : roleMeta.color }}>
          <roleMeta.icon className="w-3 h-3" />
          {roleMeta.label}
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs mb-3" style={{ color: '#6B7280' }}>
        {t.eventDate && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(t.eventDate).toLocaleDateString('he-IL')}</span>}
        {t.eventLocation && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{t.eventLocation}</span>}
        <span className="inline-flex items-center gap-1" style={{ color: planSpec.color }}>
          <Sparkles className="w-3 h-3" />{planSpec.label}
        </span>
        {archived && <span className="inline-flex items-center gap-1" style={{ color: '#9CA3AF' }}><Clock className="w-3 h-3" />בארכיון</span>}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span style={{ color: '#6B7280' }}>{t.registrations} רישומים · {t.guests} אורחים</span>
        <div className="flex items-center gap-2">
          <a href={`/${t.slug}`} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all hover:opacity-90"
             style={{ background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }}>
            <ExternalLink className="w-3 h-3" />
            צפה
          </a>
          <a href={`/admin/${t.slug}`}
             className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all"
             style={{ background: '#7D39EB', color: '#fff' }}>
            <SettingsIcon className="w-3 h-3" />
            נהל
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ atLimit }: { atLimit: boolean }) {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
           style={{ background: '#F2EBFF' }}>
        <Globe className="w-7 h-7" style={{ color: '#7D39EB' }} />
      </div>
      <p className="font-bold mb-1" style={{ color: '#000' }}>עוד אין אתרים בחשבון שלך</p>
      <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
        {atLimit ? 'הגעת למגבלת החבילה. שדרג כדי ליצור אתרים נוספים.' : 'הקם את האתר הראשון שלך — 5 דקות וזה באוויר.'}
      </p>
      {!atLimit && (
        <a href="/onboarding"
           className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-sm transition-all"
           style={{ background: '#7D39EB', color: '#fff' }}>
          <Plus className="w-4 h-4" />
          הקם אתר ראשון
        </a>
      )}
    </div>
  );
}

function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7D39EB' }} />
    </div>
  );
}

// Silence unused-import on PLANS (used through getPlan); keep for tree-shaking hint
export const _plansRef = PLANS;
