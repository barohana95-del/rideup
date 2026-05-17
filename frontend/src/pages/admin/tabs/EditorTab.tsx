// =====================================================================
// EditorTab — visual editor for the tenant.
// Sections:
//   1. Identity: slug change, logo URL, cover URL
//   2. Theme: 4 themes, primary + secondary color, font
//   3. Live preview of the public site
//   Save button persists everything via /api/admin/update-tenant.php.
// =====================================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2, Globe, Palette, Image as ImageIcon, Type, Save,
  Eye, AlertCircle, Check, Link2, RefreshCw,
} from 'lucide-react';
import { adminApi, onboardingApi } from '../../../lib/api';
import type { Tenant, TenantTheme } from '../../../types';
import { THEMES as REGISTRY, THEME_KEYS, normalizeThemeKey, type ThemeKey } from '../../../lib/themes';

// Flatten the registry into the shape the existing UI expects.
const THEMES: { key: ThemeKey; label: string; vibe: string; bg: string; fg: string; accent: string }[] =
  THEME_KEYS.map((k) => ({
    key:    k,
    label:  REGISTRY[k].label,
    vibe:   REGISTRY[k].vibe,
    bg:     REGISTRY[k].palette.bg,
    fg:     REGISTRY[k].palette.text,
    accent: REGISTRY[k].palette.accent,
  }));

const FONTS = ['Heebo', 'Shikma', 'Frank Ruhl Libre', 'Assistant'] as const;

interface FormState {
  slug: string;
  theme: TenantTheme;
  logoUrl: string;
  coverImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export default function EditorTab({
  tenant,
  settings,
  slug,
  onSaved,
}: {
  tenant: Tenant;
  settings: Record<string, string>;
  slug: string;
  onSaved: (newSlug: string) => void;
}) {
  const initial: FormState = useMemo(() => ({
    slug: tenant.slug,
    theme: tenant.theme,
    logoUrl: tenant.logoUrl ?? '',
    coverImageUrl: tenant.coverImageUrl ?? '',
    primaryColor: settings.primaryColor ?? '#7D39EB',
    secondaryColor: settings.secondaryColor ?? '',
    fontFamily: settings.fontFamily ?? 'Heebo',
  }), [tenant, settings]);

  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Slug availability check (for changes)
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (form.slug === tenant.slug) {
      setSlugStatus('idle');
      return;
    }
    if (!/^[a-z0-9][a-z0-9-]{1,58}[a-z0-9]$/.test(form.slug)) {
      setSlugStatus('invalid');
      return;
    }
    setSlugStatus('checking');
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    slugCheckTimer.current = setTimeout(async () => {
      const res = await onboardingApi.checkSlug(form.slug);
      setSlugStatus(res.success && res.data?.available ? 'available' : 'taken');
    }, 500);
    return () => {
      if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    };
  }, [form.slug, tenant.slug]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const slugBlocksSave = form.slug !== tenant.slug && slugStatus !== 'available';
  const canSave = isDirty && !saving && !slugBlocksSave;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const patch: Record<string, unknown> = {};
    if (form.slug !== tenant.slug)                    patch.slug = form.slug;
    if (form.theme !== tenant.theme)                  patch.theme = form.theme;
    if (form.logoUrl !== (tenant.logoUrl ?? ''))      patch.logoUrl = form.logoUrl || null;
    if (form.coverImageUrl !== (tenant.coverImageUrl ?? '')) patch.coverImageUrl = form.coverImageUrl || null;
    if (form.primaryColor !== (settings.primaryColor ?? '#7D39EB'))
      patch.primaryColor = form.primaryColor;
    if (form.secondaryColor !== (settings.secondaryColor ?? ''))
      patch.secondaryColor = form.secondaryColor || null;
    if (form.fontFamily !== (settings.fontFamily ?? 'Heebo'))
      patch.fontFamily = form.fontFamily;

    const res = await adminApi.updateTenant(slug, patch);
    setSaving(false);

    if (!res.success || !res.data) {
      setError(res.error ?? 'שגיאה בשמירה');
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    onSaved(res.data.newSlug);
  };

  const handleReset = () => setForm(initial);

  // Quick-save a single field without requiring the Save button (used for
  // theme tiles — clicking should "just work"). Logs every step to the
  // console with a recognizable prefix so we can debug invisible failures.
  async function quickSave(patch: Record<string, unknown>) {
    console.log('[RideUp.EditorTab] quickSave →', patch);
    setSaving(true);
    setError(null);
    setSuccess(false);
    const res = await adminApi.updateTenant(slug, patch);
    setSaving(false);
    console.log('[RideUp.EditorTab] quickSave response', res);
    if (!res.success || !res.data) {
      setError(res.error ?? 'שגיאה בשמירה');
      console.error('[RideUp.EditorTab] save FAILED:', res.error, res.code);
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
    onSaved(res.data.newSlug);
  }

  function pickTheme(key: TenantTheme) {
    const current = normalizeThemeKey(form.theme);
    console.log('[RideUp.EditorTab] pickTheme', { clicked: key, current, formTheme: form.theme });
    if (current === key) {
      console.log('[RideUp.EditorTab] same theme — skipping save');
      return;
    }
    setForm({ ...form, theme: key });
    quickSave({ theme: key });
  }

  return (
    <>
    {/* Global save status banner — impossible to miss. */}
    {(saving || success || error) && (
      <div className="sticky top-0 z-30 mb-4 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2"
           style={{
             background: error ? '#FEE2E2' : success ? '#ECFDF5' : '#F2EBFF',
             border: `1.5px solid ${error ? '#FCA5A5' : success ? '#6EE7B7' : 'rgba(125,57,235,0.25)'}`,
             color: error ? '#991B1B' : success ? '#065F46' : '#7D39EB',
           }}>
        {saving && <><Loader2 className="w-4 h-4 animate-spin" /> שומר שינוי...</>}
        {success && !saving && <><Check className="w-4 h-4" /> נשמר בהצלחה</>}
        {error && !saving && <><AlertCircle className="w-4 h-4" /> {error}</>}
      </div>
    )}
    <div className="grid lg:grid-cols-12 gap-6">
      {/* ── LEFT: form ─────────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-5">
        {/* Identity */}
        <Section icon={Globe} title="זהות האתר" subtitle="הכתובת והמיתוג של האתר שלך">
          <Field label="כתובת האתר (slug)" hint="הקישור שאורחים יקבלו">
            <SlugInput
              value={form.slug}
              status={slugStatus}
              originalSlug={tenant.slug}
              onChange={(v) => setForm({ ...form, slug: v })}
            />
          </Field>

          <Field label="קישור ללוגו" icon={ImageIcon} hint="URL ציבורי של תמונת הלוגו (PNG/SVG)">
            <Input
              value={form.logoUrl}
              onChange={(v) => setForm({ ...form, logoUrl: v })}
              placeholder="https://..."
              dir="ltr"
            />
          </Field>

          <Field label="קישור לתמונת רקע" icon={ImageIcon} hint="תמונה גדולה לראש האתר (URL)">
            <Input
              value={form.coverImageUrl}
              onChange={(v) => setForm({ ...form, coverImageUrl: v })}
              placeholder="https://..."
              dir="ltr"
            />
          </Field>
        </Section>

        {/* Theme */}
        <Section icon={Palette} title="עיצוב" subtitle="ערכת הצבעים והאופי הוויזואלי">
          <Field label="ערכת עיצוב" hint="בחירה נשמרת מיד">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map((t) => {
                const selected = normalizeThemeKey(form.theme) === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => pickTheme(t.key)}
                    disabled={saving}
                    className="relative rounded-xl overflow-hidden transition-all text-right disabled:opacity-60"
                    style={{
                      border: selected ? '2px solid #7D39EB' : '1px solid rgba(125,57,235,0.15)',
                      boxShadow: selected ? '0 6px 20px -4px rgba(125,57,235,0.35)' : 'none',
                    }}
                  >
                    <div
                      className="h-16 flex items-center justify-center text-xs font-bold"
                      style={{ background: t.bg, color: t.fg, borderBottom: `2px solid ${t.accent}` }}
                    >
                      Aa
                    </div>
                    <div className="px-2.5 py-1.5 bg-white">
                      <p className="font-bold text-xs" style={{ color: '#000000' }}>{t.label}</p>
                      <p className="text-[10px]" style={{ color: '#6B7280' }}>{t.vibe}</p>
                    </div>
                    {selected && (
                      <span
                        className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#7D39EB' }}
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </span>
                    )}
                    {saving && (
                      <span className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.55)' }}>
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#7D39EB' }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="צבע ראשי">
              <ColorPicker
                value={form.primaryColor}
                onChange={(v) => setForm({ ...form, primaryColor: v })}
              />
            </Field>
            <Field label="צבע משני (אופציונלי)">
              <ColorPicker
                value={form.secondaryColor}
                onChange={(v) => setForm({ ...form, secondaryColor: v })}
                allowEmpty
              />
            </Field>
          </div>

          <Field label="פונט" icon={Type}>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map((font) => {
                const selected = form.fontFamily === font;
                return (
                  <button
                    key={font}
                    onClick={() => setForm({ ...form, fontFamily: font })}
                    className="px-4 py-3 rounded-xl text-right transition-all"
                    style={{
                      background: selected ? '#000000' : '#fff',
                      color: selected ? '#fff' : '#000000',
                      border: selected ? '2px solid #7D39EB' : '1px solid rgba(125,57,235,0.15)',
                      fontFamily: font,
                      fontWeight: 700,
                    }}
                  >
                    <span className="text-xs opacity-70 block mb-1">{font}</span>
                    <span className="text-base">אביב & בר</span>
                  </button>
                );
              })}
            </div>
          </Field>
        </Section>

        {/* Save bar */}
        <div
          className="sticky bottom-3 flex items-center justify-between gap-3 p-4 rounded-2xl shadow-lg"
          style={{
            background: '#000000',
            color: '#fff',
            border: '1px solid rgba(125,57,235,0.3)',
          }}
        >
          <div className="flex-1 min-w-0">
            {error ? (
              <p className="flex items-center gap-2 text-sm" style={{ color: '#FCA5A5' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{error}</span>
              </p>
            ) : success ? (
              <p className="flex items-center gap-2 text-sm font-bold" style={{ color: '#86EFAC' }}>
                <Check className="w-4 h-4" />
                נשמר בהצלחה
              </p>
            ) : isDirty ? (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                יש לך שינויים לא שמורים
              </p>
            ) : (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                שינויים יוצגו פה
              </p>
            )}
          </div>

          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-colors disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            איפוס
          </button>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 font-bold rounded-full transition-all disabled:opacity-40"
            style={{
              background: canSave ? '#7D39EB' : 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> שומר...</>
            ) : (
              <><Save className="w-4 h-4" /> שמור שינויים</>
            )}
          </button>
        </div>
      </div>

      {/* ── RIGHT: live preview ───────────────────────────────────── */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-6">
          <h3 className="font-bold flex items-center gap-2 mb-3" style={{ color: '#000000' }}>
            <Eye className="w-4 h-4" style={{ color: '#7D39EB' }} />
            תצוגה מקדימה
          </h3>

          <ThemePreview form={form} eventTitle={tenant.eventTitle ?? slug} eventDate={tenant.eventDate} eventLocation={tenant.eventLocation} />

          <a
            href={`/${form.slug !== tenant.slug && slugStatus === 'available' ? form.slug : tenant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            style={{ color: '#7D39EB' }}
          >
            <Link2 className="w-3.5 h-3.5" />
            פתח אתר אמיתי בחלון חדש
          </a>
        </div>
      </div>
    </div>
    </>
  );
}

/* ===== Subcomponents ===== */

function Section({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 md:p-6 space-y-5"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4" style={{ color: '#7D39EB' }} />
          <h2 className="font-bold" style={{ color: '#000000' }}>{title}</h2>
        </div>
        {subtitle && <p className="text-xs" style={{ color: '#6B7280' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, hint, children }: { label: string; icon?: React.ElementType; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#000000' }}>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: '#7D39EB' }} />}
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px]" style={{ color: '#6B7280' }}>{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, dir }: { value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir={dir}
      className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
      style={{
        background: '#fff',
        border: '1.5px solid rgba(125,57,235,0.15)',
        borderRadius: '10px',
        color: '#000000',
      }}
      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#7D39EB'; }}
      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(125,57,235,0.15)'; }}
    />
  );
}

function SlugInput({ value, status, originalSlug, onChange }: {
  value: string;
  status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
  originalSlug: string;
  onChange: (v: string) => void;
}) {
  const borderColor =
    status === 'available' ? '#10B981' :
    status === 'taken' || status === 'invalid' ? '#EF4444' :
    'rgba(125,57,235,0.15)';

  return (
    <div>
      <div className="flex items-stretch rounded-lg overflow-hidden"
           style={{ border: `1.5px solid ${borderColor}` }}>
        <span className="px-3 flex items-center text-xs"
              style={{ background: '#F2EBFF', color: '#6B7280' }} dir="ltr">
          rideup.../
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().trim())}
          dir="ltr"
          className="flex-1 px-3 py-2.5 text-sm font-mono focus:outline-none"
          style={{ background: '#fff', color: '#000000' }}
        />
        <span className="px-3 flex items-center min-w-[80px] justify-center">
          {status === 'checking' && <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#6B7280' }} />}
          {status === 'available' && <Check className="w-4 h-4" style={{ color: '#10B981' }} />}
          {status === 'taken' && <span className="text-[10px] font-bold" style={{ color: '#EF4444' }}>תפוס</span>}
          {status === 'invalid' && <span className="text-[10px] font-bold" style={{ color: '#EF4444' }}>פסול</span>}
          {status === 'idle' && value === originalSlug && <span className="text-[10px]" style={{ color: '#6B7280' }}>נוכחי</span>}
        </span>
      </div>
      {value !== originalSlug && status === 'available' && (
        <p className="mt-1 text-[11px] flex items-center gap-1" style={{ color: '#D97706' }}>
          ⚠ שינוי כתובת — הקישור הישן יפסיק לעבוד אחרי השמירה.
        </p>
      )}
    </div>
  );
}

function ColorPicker({ value, onChange, allowEmpty }: { value: string; onChange: (v: string) => void; allowEmpty?: boolean }) {
  const safeValue = value || '#7D39EB';
  return (
    <div className="flex items-center gap-2">
      <label className="relative cursor-pointer rounded-lg overflow-hidden shrink-0"
             style={{ width: 40, height: 40, border: '1.5px solid rgba(125,57,235,0.15)' }}>
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <span className="absolute inset-0" style={{ background: safeValue }} />
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        placeholder="#7D39EB"
        className="flex-1 px-3 py-2.5 text-sm font-mono focus:outline-none transition-all"
        style={{
          background: '#fff',
          border: '1.5px solid rgba(125,57,235,0.15)',
          borderRadius: '10px',
          color: '#000000',
        }}
      />
      {allowEmpty && value && (
        <button
          onClick={() => onChange('')}
          className="text-xs px-2 py-1 rounded-md"
          style={{ color: '#6B7280' }}
        >
          נקה
        </button>
      )}
    </div>
  );
}

function ThemePreview({
  form, eventTitle, eventDate, eventLocation,
}: {
  form: FormState;
  eventTitle: string;
  eventDate: string | null;
  eventLocation: string | null;
}) {
  // Normalize legacy keys ('classic' → 'elegant' etc.) and fall back to the
  // first theme if normalization somehow returned an unknown key — never crash.
  const themeMeta =
    THEMES.find((t) => t.key === normalizeThemeKey(form.theme)) ?? THEMES[0];
  const primary = form.primaryColor || themeMeta.accent;

  return (
    <div className="rounded-2xl overflow-hidden ring-1"
         style={{ borderColor: 'rgba(125,57,235,0.1)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }}>
      {/* Browser chrome */}
      <div className="px-3 py-2 flex items-center gap-1.5"
           style={{ background: '#1A2A28' }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F56' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#27C93F' }} />
        <span className="text-[10px] font-mono mr-2 truncate" style={{ color: 'rgba(255,255,255,0.5)' }} dir="ltr">
          rideup.../{form.slug}
        </span>
      </div>

      {/* Cover */}
      <div className="relative h-32 overflow-hidden"
           style={{
             background: form.coverImageUrl
               ? `url(${form.coverImageUrl}) center/cover`
               : `linear-gradient(135deg, ${primary} 0%, ${themeMeta.accent} 100%)`,
           }}>
        {form.logoUrl && (
          <img src={form.logoUrl} alt="logo" className="absolute top-3 right-3 h-10 object-contain" />
        )}
        <div className="absolute inset-0 flex items-end p-4"
             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
          <p className="text-white text-xs font-bold tracking-widest" dir="rtl">
            {eventDate ? new Date(eventDate).toLocaleDateString('he-IL') : '—'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 text-center" style={{ background: themeMeta.bg, color: themeMeta.fg, fontFamily: form.fontFamily }}>
        <p className="text-xs opacity-60 mb-2 tracking-widest">SAVE THE DATE</p>
        <h3 className="font-bold text-2xl mb-1">{eventTitle}</h3>
        <div className="w-10 h-px mx-auto my-2" style={{ background: primary }} />
        <p className="text-xs opacity-70">{eventLocation ?? '—'}</p>
        <button
          className="mt-4 px-5 py-2 rounded-full text-xs font-bold"
          style={{ background: primary, color: themeMeta.bg }}
        >
          אישור הגעה
        </button>
      </div>
    </div>
  );
}
