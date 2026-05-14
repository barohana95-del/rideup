// =====================================================================
// SettingsTab — tenant-level settings.
// Sections:
//   1. Plan & subscription info  (read-only)
//   2. Collaborators              (invite by email, manage roles)
//   3. Event details              (quick-edit title/date/time/location)
//   4. Danger zone                (archive tenant — owner only)
// =====================================================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, CreditCard, CalendarDays, MapPin, Clock, AlertTriangle,
  Archive, Loader2, Check, AlertCircle, Save, RotateCcw, Info,
} from 'lucide-react';
import CollaboratorsSection from '../components/CollaboratorsSection';
import { adminApi } from '../../../lib/api';
import { getCurrentUser } from '../../../lib/auth';
import type { Tenant } from '../../../types';

// ──────────────────────────────────────────────────────────────────
const PURPLE = '#7D39EB';
const PALE   = '#F2EBFF';
const GRAY   = '#6B7280';

const PLAN_LABELS: Record<string, string> = {
  trial: 'תקופת ניסיון',
  basic: 'חבילה בסיסית',
  pro: 'חבילה מקצועית',
  premium: 'חבילה פרימיום',
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  trial:    { label: 'ניסיון',  color: '#92400E', bg: '#FEF3C7' },
  active:   { label: 'פעיל',    color: '#065F46', bg: '#ECFDF5' },
  paused:   { label: 'מושהה',   color: '#1F2937', bg: '#E5E7EB' },
  archived: { label: 'בארכיון', color: '#6B7280', bg: '#F3F4F6' },
  deleted:  { label: 'נמחק',    color: '#991B1B', bg: '#FEE2E2' },
};

function fmtDate(s: string | null): string {
  if (!s) return '—';
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return s; }
}

function daysUntil(s: string | null): number | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// ──────────────────────────────────────────────────────────────────
export default function SettingsTab({
  tenant,
  slug,
  onSaved,
}: {
  tenant: Tenant;
  slug: string;
  onSaved?: () => void;
}) {
  const me = getCurrentUser();
  const isOwner = me?.id === tenant.ownerUserId;
  const isArchived = tenant.status === 'archived';

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Page heading */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: PURPLE }}>
          הגדרות אתר
        </p>
        <h1 className="text-2xl font-black" style={{ color: '#000' }}>
          ניהול גישה, אירוע וחבילה
        </h1>
        <p className="text-sm mt-1" style={{ color: GRAY }}>
          כאן תוכל לנהל מי משתף איתך את האתר, לעדכן פרטי אירוע ולראות את מצב החבילה.
        </p>
      </div>

      {isArchived && (
        <div className="rounded-2xl p-4 flex items-start gap-3"
             style={{ background: '#F3F4F6', border: '1px solid #D1D5DB' }}>
          <Archive className="w-5 h-5 mt-0.5 shrink-0" style={{ color: GRAY }} />
          <div className="text-sm" style={{ color: '#374151' }}>
            <p className="font-bold mb-0.5">האתר נמצא בארכיון</p>
            <p className="text-xs">
              דף ה-RSVP הציבורי במצב קריאה בלבד. רוב הפעולות מושבתות. ניתן לפנות לתמיכה לשחזור.
            </p>
          </div>
        </div>
      )}

      {/* 1. Plan / Subscription */}
      <PlanCard tenant={tenant} />

      {/* 2. Collaborators */}
      <CollaboratorsSection slug={slug} isOwner={isOwner} />

      {/* 3. Event details quick-edit */}
      <EventDetailsCard
        tenant={tenant}
        slug={slug}
        canEdit={!isArchived}
        onSaved={onSaved}
      />

      {/* 4. Danger zone */}
      {isOwner && !isArchived && (
        <DangerZone slug={slug} tenant={tenant} onArchived={onSaved} />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. Plan card
// ══════════════════════════════════════════════════════════════════
function PlanCard({ tenant }: { tenant: Tenant }) {
  const statusMeta = STATUS_META[tenant.status] ?? STATUS_META.active;
  const planLabel = PLAN_LABELS[tenant.plan] ?? tenant.plan;
  const trialDays = daysUntil(tenant.trialEndsAt);
  const paidDays  = daysUntil(tenant.paidUntil);

  const expiresSoon =
    (tenant.plan === 'trial' && trialDays !== null && trialDays <= 7) ||
    (tenant.plan !== 'trial' && paidDays !== null && paidDays <= 14);

  return (
    <div className="rounded-2xl p-5 md:p-6"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="w-4 h-4" style={{ color: PURPLE }} />
        <h2 className="font-bold" style={{ color: '#000' }}>פרטי החבילה</h2>
      </div>
      <p className="text-xs mb-4" style={{ color: GRAY }}>
        סטטוס המנוי שלך ומידע על תקופת השימוש.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <InfoBox label="חבילה" icon={Crown}>
          <span className="font-bold" style={{ color: '#000' }}>{planLabel}</span>
        </InfoBox>

        <InfoBox label="סטטוס">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: statusMeta.bg, color: statusMeta.color }}>
            {statusMeta.label}
          </span>
        </InfoBox>

        {tenant.plan === 'trial' ? (
          <InfoBox label="סיום תקופת ניסיון" icon={Clock} highlight={expiresSoon}>
            <div>
              <p className="font-bold text-sm" style={{ color: '#000' }}>{fmtDate(tenant.trialEndsAt)}</p>
              {trialDays !== null && (
                <p className="text-[11px]" style={{ color: trialDays <= 3 ? '#DC2626' : GRAY }}>
                  {trialDays > 0 ? `נותרו ${trialDays} ימים` : 'הסתיים'}
                </p>
              )}
            </div>
          </InfoBox>
        ) : (
          <InfoBox label="תוקף עד" icon={Clock} highlight={expiresSoon}>
            <div>
              <p className="font-bold text-sm" style={{ color: '#000' }}>{fmtDate(tenant.paidUntil)}</p>
              {paidDays !== null && (
                <p className="text-[11px]" style={{ color: paidDays <= 7 ? '#DC2626' : GRAY }}>
                  {paidDays > 0 ? `נותרו ${paidDays} ימים` : 'הסתיים'}
                </p>
              )}
            </div>
          </InfoBox>
        )}

        <InfoBox label="האתר נוצר ב">
          <span className="font-bold text-sm" style={{ color: '#000' }}>{fmtDate(tenant.createdAt)}</span>
        </InfoBox>
      </div>

      <div className="mt-4 p-3 rounded-xl flex items-start gap-2 text-xs"
           style={{ background: PALE, color: '#374151' }}>
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: PURPLE }} />
        <p>
          רוצה לשדרג, להאריך או לשנות חבילה? פנה אלינו בצ׳אט התמיכה ונחזור אליך תוך 24 שעות.
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  label, icon: Icon, highlight, children,
}: {
  label: string;
  icon?: React.ElementType;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-xl"
         style={{
           background: highlight ? '#FFFBEB' : PALE,
           border: highlight ? '1px solid #FCD34D' : '1px solid rgba(125,57,235,0.1)',
         }}>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="w-3 h-3" style={{ color: highlight ? '#92400E' : GRAY }} />}
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: highlight ? '#92400E' : GRAY }}>
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. Event details quick-edit
// ══════════════════════════════════════════════════════════════════
function EventDetailsCard({
  tenant, slug, canEdit, onSaved,
}: {
  tenant: Tenant;
  slug: string;
  canEdit: boolean;
  onSaved?: () => void;
}) {
  const initial = {
    eventTitle:    tenant.eventTitle ?? '',
    eventDate:     tenant.eventDate ?? '',
    eventTime:     tenant.eventTime ?? '',
    eventLocation: tenant.eventLocation ?? '',
  };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Re-sync when parent reloads tenant.
  useEffect(() => {
    setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant.eventTitle, tenant.eventDate, tenant.eventTime, tenant.eventLocation]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    const patch: Record<string, unknown> = {};
    if (form.eventTitle !== initial.eventTitle)       patch.eventTitle = form.eventTitle.trim();
    if (form.eventDate !== initial.eventDate)         patch.eventDate = form.eventDate || null;
    if (form.eventTime !== initial.eventTime)         patch.eventTime = form.eventTime || null;
    if (form.eventLocation !== initial.eventLocation) patch.eventLocation = form.eventLocation.trim() || null;

    const res = await adminApi.updateTenant(slug, patch);
    setSaving(false);
    if (!res.success || !res.data) {
      setError(res.error ?? 'שגיאה בשמירה');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2200);
    onSaved?.();
  }

  return (
    <div className="rounded-2xl p-5 md:p-6"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays className="w-4 h-4" style={{ color: PURPLE }} />
        <h2 className="font-bold" style={{ color: '#000' }}>פרטי האירוע</h2>
      </div>
      <p className="text-xs mb-4" style={{ color: GRAY }}>
        עריכה מהירה של פרטי האירוע המוצגים בעמוד ה-RSVP. עיצוב וצבעים — בטאב "עיצוב".
      </p>

      {error && (
        <div className="mb-3 p-3 rounded-xl flex items-start gap-2 text-sm"
             style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="px-1">×</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label>שם האירוע</Label>
          <input
            type="text"
            value={form.eventTitle}
            onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
            disabled={!canEdit || saving}
            placeholder="לדוגמה: החתונה של דנה ויואב"
            className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all disabled:opacity-60"
            style={{ background: '#fff', border: '1.5px solid rgba(125,57,235,0.2)', borderRadius: '10px', color: '#000' }}
          />
        </div>

        <div>
          <Label icon={CalendarDays}>תאריך</Label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            disabled={!canEdit || saving}
            className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all disabled:opacity-60"
            style={{ background: '#fff', border: '1.5px solid rgba(125,57,235,0.2)', borderRadius: '10px', color: '#000' }}
          />
        </div>

        <div>
          <Label icon={Clock}>שעה</Label>
          <input
            type="time"
            value={form.eventTime}
            onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
            disabled={!canEdit || saving}
            className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all disabled:opacity-60"
            style={{ background: '#fff', border: '1.5px solid rgba(125,57,235,0.2)', borderRadius: '10px', color: '#000' }}
          />
        </div>

        <div className="sm:col-span-2">
          <Label icon={MapPin}>מיקום האירוע</Label>
          <input
            type="text"
            value={form.eventLocation}
            onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
            disabled={!canEdit || saving}
            placeholder="לדוגמה: גני האחוזה, ראשון לציון"
            className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all disabled:opacity-60"
            style={{ background: '#fff', border: '1.5px solid rgba(125,57,235,0.2)', borderRadius: '10px', color: '#000' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <button
          onClick={handleSave}
          disabled={!canEdit || !isDirty || saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-40"
          style={{ background: PURPLE, color: '#fff' }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          שמור שינויים
        </button>
        {isDirty && !saving && (
          <button
            onClick={() => setForm(initial)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-full transition-all"
            style={{ background: '#fff', color: GRAY, border: '1px solid #E5E7EB' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            בטל
          </button>
        )}
        <AnimatePresence>
          {success && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: '#059669' }}
            >
              <Check className="w-3.5 h-3.5" />
              נשמר בהצלחה
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold mb-1.5 flex items-center gap-1.5" style={{ color: '#000' }}>
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: PURPLE }} />}
      {children}
    </label>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. Danger zone
// ══════════════════════════════════════════════════════════════════
function DangerZone({
  slug, tenant, onArchived,
}: {
  slug: string;
  tenant: Tenant;
  onArchived?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedConfirm = tenant.slug;
  const canConfirm = typed.trim().toLowerCase() === expectedConfirm.toLowerCase();

  async function handleArchive() {
    setWorking(true);
    setError(null);
    const res = await adminApi.archiveTenant(slug);
    setWorking(false);
    if (!res.success) { setError(res.error ?? 'שגיאה'); return; }
    setConfirming(false);
    setTyped('');
    onArchived?.();
  }

  return (
    <div className="rounded-2xl p-5 md:p-6"
         style={{ background: '#fff', border: '1.5px solid #FCA5A5' }}>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4" style={{ color: '#DC2626' }} />
        <h2 className="font-bold" style={{ color: '#991B1B' }}>אזור מסוכן</h2>
      </div>
      <p className="text-xs mb-4" style={{ color: GRAY }}>
        פעולות מהאזור הזה משפיעות על האתר באופן משמעותי. רק הבעלים יכול לבצען.
      </p>

      <div className="rounded-xl p-4 flex items-start gap-3 flex-wrap"
           style={{ background: '#FEF2F2', border: '1px solid #FEE2E2' }}>
        <Archive className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
        <div className="flex-1 min-w-[200px]">
          <p className="font-bold text-sm" style={{ color: '#991B1B' }}>העברה לארכיון</p>
          <p className="text-xs mt-0.5" style={{ color: '#7F1D1D' }}>
            דף ה-RSVP יעבור למצב קריאה בלבד. הרישומים נשמרים — אך אורחים חדשים לא יוכלו להירשם.
            ניתן לפנות לתמיכה לשחזור.
          </p>
        </div>
        {!confirming && (
          <button
            onClick={() => { setConfirming(true); setError(null); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-all"
            style={{ background: '#DC2626', color: '#fff' }}
          >
            <Archive className="w-3.5 h-3.5" />
            העבר לארכיון
          </button>
        )}
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl"
                 style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#991B1B' }}>
                כדי לאשר, הקלד את כתובת האתר:
              </p>
              <p className="text-xs mb-3" style={{ color: '#7F1D1D' }}>
                הקלד <span className="font-mono font-bold">{expectedConfirm}</span> כדי לאשר.
              </p>
              <input
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                dir="ltr"
                placeholder={expectedConfirm}
                disabled={working}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all font-mono"
                style={{ background: '#fff', border: '1.5px solid #FCA5A5', borderRadius: '10px', color: '#000' }}
              />
              {error && (
                <p className="mt-2 text-xs font-bold" style={{ color: '#991B1B' }}>{error}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleArchive}
                  disabled={!canConfirm || working}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-40"
                  style={{ background: '#DC2626', color: '#fff' }}
                >
                  {working ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                  אשר העברה לארכיון
                </button>
                <button
                  onClick={() => { setConfirming(false); setTyped(''); setError(null); }}
                  disabled={working}
                  className="px-3 py-2 text-sm font-bold rounded-full transition-all"
                  style={{ background: '#fff', color: GRAY, border: '1px solid #E5E7EB' }}
                >
                  בטל
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
