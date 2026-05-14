// =====================================================================
// ElegantTheme — black + champagne gold, classic serif typography.
// =====================================================================
import { Calendar, Clock, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import type { PublicTenantConfig } from '../../../types';
import { useRsvpForm, formatHebDate } from '../useRsvpForm';
import { THEMES } from '../../../lib/themes';

export default function ElegantTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const t = THEMES.elegant;
  const accent = config.primaryColor || t.palette.accent;
  const cover  = config.coverImageUrl || t.defaultCover;
  const f = useRsvpForm(slug, config);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      {/* Hero */}
      <header className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: `url(${cover})`, filter: 'grayscale(80%) brightness(0.45)' }} />
          <div className="absolute inset-0"
               style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, ${t.palette.bg} 100%)` }} />
        </div>
        <div className="relative z-10 min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-20">
          {config.logoUrl && (
            <img src={config.logoUrl} alt="logo" className="h-16 mb-8 opacity-90" />
          )}
          <Ornament color={accent} />
          <p className="mt-6 mb-4 text-xs tracking-[0.4em] uppercase" style={{ color: accent, fontFamily: t.fonts.display }}>
            Save the Date
          </p>
          <h1 className="text-5xl md:text-7xl mb-6 leading-tight"
              style={{ fontFamily: t.fonts.display, fontWeight: 600, letterSpacing: '0.02em' }}>
            {config.eventTitle}
          </h1>
          <Ornament color={accent} />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base"
               style={{ color: t.palette.muted }}>
            {config.eventDate && <Pill icon={Calendar}>{formatHebDate(config.eventDate)}</Pill>}
            {config.eventTime && <Pill icon={Clock}>{config.eventTime.slice(0, 5)}</Pill>}
            {config.eventLocation && <Pill icon={MapPin}>{config.eventLocation}</Pill>}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-4 pb-16 -mt-8">
        <div className="max-w-xl mx-auto rounded-sm p-6 md:p-10"
             style={{ background: t.palette.surface, border: `1px solid ${t.palette.divider}` }}>
          {f.isSuccess ? (
            <Thanks accent={accent} font={t.fonts.display} muted={t.palette.muted}
                    text={config.texts.thankYouText} onReset={f.resetForAnotherGuest} />
          ) : (
            <>
              <h2 className="text-center text-3xl mb-3" style={{ fontFamily: t.fonts.display, color: accent }}>
                אישור הגעה
              </h2>
              <Ornament color={accent} small />
              {config.texts.invitationText && (
                <p className="text-center mt-6 mb-4 leading-relaxed text-lg" style={{ color: t.palette.text }}>
                  {config.texts.invitationText}
                </p>
              )}
              {config.texts.instructionsText && (
                <p className="text-center mb-6 text-sm italic" style={{ color: t.palette.muted }}>
                  {config.texts.instructionsText}
                </p>
              )}

              <form onSubmit={f.handleSubmit} className="space-y-5 mt-6">
                <Row>
                  <DarkField label="שם מלא *" theme={t}>
                    <DarkInput required value={f.formData.fullName}
                      onChange={(e) => f.setFormData({ ...f.formData, fullName: e.target.value })}
                      placeholder="שם ושם משפחה" theme={t} />
                  </DarkField>
                  <DarkField label="טלפון נייד *" theme={t}>
                    <DarkInput required type="tel" dir="ltr" className="text-right"
                      value={f.formData.phoneNumber}
                      onChange={(e) => f.setFormData({ ...f.formData, phoneNumber: e.target.value })}
                      placeholder="05X-XXXXXXX" theme={t} />
                  </DarkField>
                </Row>

                <Row>
                  <DarkField label="כמות מגיעים *" theme={t}>
                    <DarkSelect value={f.formData.numGuests}
                      onChange={(e) => f.setFormData({ ...f.formData, numGuests: Number(e.target.value) })}
                      theme={t}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'אורח' : 'אורחים'}</option>)}
                    </DarkSelect>
                  </DarkField>
                  {config.cities.length > 0 && (
                    <DarkField label="הסעה מאיזו עיר? *" theme={t}>
                      <DarkSelect required value={f.formData.city}
                        onChange={(e) => f.setFormData({ ...f.formData, city: e.target.value })}
                        theme={t}>
                        <option value="" disabled>בחרו עיר</option>
                        {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </DarkSelect>
                    </DarkField>
                  )}
                </Row>

                {config.useShifts && config.shifts.length > 0 && (
                  <DarkField label="חזרה מועדפת *" theme={t}>
                    <div className="grid grid-cols-2 gap-2">
                      {config.shifts.map(s => {
                        const sel = f.formData.returnShift === s;
                        return (
                          <button type="button" key={s}
                            onClick={() => f.setFormData({ ...f.formData, returnShift: s })}
                            className="px-3 py-2.5 text-sm transition-all"
                            style={{
                              background: sel ? accent : 'transparent',
                              color: sel ? t.palette.bg : t.palette.text,
                              border: `1px solid ${sel ? accent : t.palette.divider}`,
                              fontFamily: t.fonts.body, letterSpacing: '0.05em',
                            }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </DarkField>
                )}

                <DarkField label="הערות נוספות" theme={t}>
                  <DarkTextarea rows={2} value={f.formData.notes}
                    onChange={(e) => f.setFormData({ ...f.formData, notes: e.target.value })}
                    placeholder="הערות לנהג / בקשות מיוחדות" theme={t} />
                </DarkField>

                {f.formError && <p className="text-center text-sm" style={{ color: '#fca5a5' }}>{f.formError}</p>}

                <button type="submit" disabled={f.isSubmitting}
                  className="w-full py-3.5 text-base font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: accent, color: t.palette.bg,
                    fontFamily: t.fonts.display, letterSpacing: '0.25em',
                  }}>
                  {f.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> שולח...</> : 'אישור הגעה'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {config.showPoweredBy && (
        <footer className="py-6 text-center text-xs tracking-widest" style={{ color: t.palette.muted, fontFamily: t.fonts.display }}>
          POWERED BY <a href="https://rideup.co.il" target="_blank" rel="noopener" className="hover:underline" style={{ color: accent }}>RIDEUP</a>
        </footer>
      )}
    </div>
  );
}

function Ornament({ color, small }: { color: string; small?: boolean }) {
  const w = small ? 60 : 120;
  return (
    <svg width={w} height="14" viewBox="0 0 120 14" className="mx-auto" aria-hidden>
      <line x1="0" y1="7" x2="46" y2="7" stroke={color} strokeWidth="0.7" />
      <circle cx="60" cy="7" r="3" fill="none" stroke={color} strokeWidth="0.7" />
      <circle cx="60" cy="7" r="0.9" fill={color} />
      <line x1="74" y1="7" x2="120" y2="7" stroke={color} strokeWidth="0.7" />
    </svg>
  );
}

function Pill({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm tracking-wider">
      <Icon className="w-3.5 h-3.5" /> {children}
    </span>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function DarkField({ label, theme, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-[0.2em] uppercase" style={{ color: theme.palette.muted, fontFamily: theme.fonts.display }}>{label}</label>
      {children}
    </div>
  );
}
function DarkInput({ theme, className = '', ...rest }: any) {
  return <input {...rest} className={`w-full bg-transparent px-0 py-2 focus:outline-none transition-all ${className}`}
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1.05rem' }} />;
}
function DarkSelect({ theme, children, ...rest }: any) {
  return <select {...rest} className="w-full bg-transparent px-0 py-2 focus:outline-none appearance-none"
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1.05rem' }}>
    {children}
  </select>;
}
function DarkTextarea({ theme, ...rest }: any) {
  return <textarea {...rest} className="w-full bg-transparent px-0 py-2 focus:outline-none resize-none"
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1rem' }} />;
}

function Thanks({ accent, font, muted, text, onReset }: any) {
  return (
    <div className="text-center py-8">
      <CheckCircle2 className="w-12 h-12 mx-auto mb-5" style={{ color: accent }} />
      <h2 className="text-3xl mb-3" style={{ fontFamily: font, color: accent }}>תודה רבה</h2>
      <Ornament color={accent} small />
      <p className="mt-6 text-base whitespace-pre-wrap" style={{ color: muted }}>{text || 'אישור ההגעה התקבל. נתראה!'}</p>
      <button onClick={onReset} className="mt-6 text-xs tracking-[0.25em] hover:opacity-70"
              style={{ color: accent, fontFamily: font }}>
        רישום אורח נוסף ›
      </button>
    </div>
  );
}
