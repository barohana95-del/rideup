// =====================================================================
// LuxeTheme — deep wine + champagne gold + filigree ornaments.
// =====================================================================
import { Calendar, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import type { PublicTenantConfig } from '../../../types';
import { useRsvpForm, formatHebDate } from '../useRsvpForm';
import { THEMES } from '../../../lib/themes';

export default function LuxeTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const t = THEMES.luxe;
  const accent = config.primaryColor || t.palette.accent;
  const accent2 = t.palette.accent2;
  const cover = config.coverImageUrl || t.defaultCover;
  const f = useRsvpForm(slug, config);

  return (
    <div className="min-h-screen relative" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <DamaskBg color={accent} />

      {/* Hero */}
      <header className="relative">
        <div className="absolute inset-0">
          <img src={cover} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0"
               style={{ background: `radial-gradient(circle at center, transparent 0%, ${t.palette.bg}cc 65%, ${t.palette.bg} 100%)` }} />
        </div>
        <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
          {config.logoUrl && <img src={config.logoUrl} alt="logo" className="h-16 mb-8 opacity-90" />}

          <FiligreeBar color={accent} />
          <p className="mt-6 text-xs tracking-[0.6em] uppercase font-bold" style={{ color: accent }}>
            ◇ AN INVITATION ◇
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl leading-tight"
              style={{ fontFamily: t.fonts.display, fontWeight: 600, color: t.palette.text, letterSpacing: '0.06em' }}>
            {config.eventTitle}
          </h1>
          <div className="mt-6 mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.2">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill={accent} fillOpacity="0.3" />
            </svg>
            <span className="h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
          </div>
          <FiligreeBar color={accent} />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {config.eventDate && <Stat icon={Calendar} label="התאריך" value={formatHebDate(config.eventDate)} accent={accent} muted={t.palette.muted} font={t.fonts.display} />}
            {config.eventTime && <Stat icon={Clock} label="השעה" value={config.eventTime.slice(0,5)} accent={accent} muted={t.palette.muted} font={t.fonts.display} />}
            {config.eventLocation && <Stat icon={MapPin} label="המיקום" value={config.eventLocation} accent={accent} muted={t.palette.muted} font={t.fonts.display} />}
          </div>
        </div>
      </header>

      {/* Form card */}
      <main className="relative z-10 px-4 pb-20 -mt-4">
        <div className="max-w-xl mx-auto p-7 md:p-11 relative"
             style={{
               background: `linear-gradient(180deg, ${t.palette.surface} 0%, ${t.palette.bg} 100%)`,
               border: `1px solid ${t.palette.divider}`,
               boxShadow: `0 30px 70px -20px rgba(0,0,0,0.6), inset 0 1px 0 ${accent}30`,
             }}>
          {/* Corner filigrees */}
          <Corner color={accent} pos="tl" />
          <Corner color={accent} pos="tr" />
          <Corner color={accent} pos="bl" />
          <Corner color={accent} pos="br" />

          {f.isSuccess ? (
            <ThanksLuxe accent={accent} accent2={accent2} font={t.fonts.display} muted={t.palette.muted}
                        text={config.texts.thankYouText} onReset={f.resetForAnotherGuest} />
          ) : (
            <>
              <h2 className="text-center text-3xl md:text-4xl mb-2"
                  style={{ fontFamily: t.fonts.display, fontWeight: 600, color: accent, letterSpacing: '0.08em' }}>
                R · S · V · P
              </h2>
              <p className="text-center text-xs tracking-[0.4em] uppercase" style={{ color: t.palette.muted }}>
                אישור הגעה
              </p>
              <FiligreeBar color={accent} compact />

              {config.texts.invitationText && (
                <p className="text-center text-lg leading-relaxed mt-6 mb-4 italic" style={{ color: t.palette.text, fontFamily: t.fonts.body }}>
                  {config.texts.invitationText}
                </p>
              )}
              {config.texts.instructionsText && (
                <p className="text-center text-sm mb-6" style={{ color: t.palette.muted }}>
                  {config.texts.instructionsText}
                </p>
              )}

              <form onSubmit={f.handleSubmit} className="space-y-5 mt-6">
                <LFlow>
                  <LField label="שם מלא *" theme={t}>
                    <LInput required value={f.formData.fullName}
                      onChange={(e) => f.setFormData({ ...f.formData, fullName: e.target.value })}
                      placeholder="שם ושם משפחה" theme={t} accent={accent} />
                  </LField>
                  <LField label="טלפון נייד *" theme={t}>
                    <LInput required type="tel" dir="ltr" className="text-right"
                      value={f.formData.phoneNumber}
                      onChange={(e) => f.setFormData({ ...f.formData, phoneNumber: e.target.value })}
                      placeholder="05X-XXXXXXX" theme={t} accent={accent} />
                  </LField>
                </LFlow>

                <LFlow>
                  <LField label="כמות מגיעים *" theme={t}>
                    <LSelect value={f.formData.numGuests}
                      onChange={(e) => f.setFormData({ ...f.formData, numGuests: Number(e.target.value) })}
                      theme={t} accent={accent}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'אורח' : 'אורחים'}</option>)}
                    </LSelect>
                  </LField>
                  {config.cities.length > 0 && (
                    <LField label="הסעה מאיזו עיר? *" theme={t}>
                      <LSelect required value={f.formData.city}
                        onChange={(e) => f.setFormData({ ...f.formData, city: e.target.value })}
                        theme={t} accent={accent}>
                        <option value="" disabled>בחרו עיר</option>
                        {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </LSelect>
                    </LField>
                  )}
                </LFlow>

                {config.useShifts && config.shifts.length > 0 && (
                  <LField label="חזרה מועדפת *" theme={t}>
                    <div className="grid grid-cols-2 gap-2.5">
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
                              fontFamily: t.fonts.display, letterSpacing: '0.08em',
                              boxShadow: sel ? `0 4px 16px -6px ${accent}80` : 'none',
                            }}>{s}</button>
                        );
                      })}
                    </div>
                  </LField>
                )}

                <LField label="הערות (אופציונלי)" theme={t}>
                  <LTextarea rows={2} value={f.formData.notes}
                    onChange={(e) => f.setFormData({ ...f.formData, notes: e.target.value })}
                    placeholder="בקשות מיוחדות" theme={t} accent={accent} />
                </LField>

                {f.formError && <p className="text-center text-sm" style={{ color: '#fca5a5' }}>{f.formError}</p>}

                <button type="submit" disabled={f.isSubmitting}
                  className="w-full py-4 text-sm transition-all hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 50%, ${accent} 100%)`,
                    color: t.palette.bg,
                    fontFamily: t.fonts.display,
                    letterSpacing: '0.3em',
                    fontWeight: 700,
                    boxShadow: `0 10px 30px -10px ${accent}80, inset 0 1px 0 ${accent2}`,
                  }}>
                  {f.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> שולח...</> : 'אישור הגעה'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {config.showPoweredBy && (
        <footer className="relative z-10 py-6 text-center text-[10px] tracking-[0.3em] uppercase" style={{ color: t.palette.muted }}>
          Crafted with <a href="https://rideup.co.il" target="_blank" rel="noopener" className="font-bold hover:underline" style={{ color: accent }}>RideUp</a>
        </footer>
      )}
    </div>
  );
}

function DamaskBg({ color }: { color: string }) {
  const id = 'damask-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" aria-hidden>
      <defs>
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="2" fill={color} />
          <path d="M30,10 Q40,30 30,50 Q20,30 30,10 Z" fill="none" stroke={color} strokeWidth="0.6" />
          <path d="M10,30 Q30,40 50,30 Q30,20 10,30 Z" fill="none" stroke={color} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function FiligreeBar({ color, compact }: { color: string; compact?: boolean }) {
  const w = compact ? 140 : 220;
  return (
    <svg width={w} height="20" viewBox="0 0 220 20" className="mx-auto" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="0.8">
        <line x1="0" y1="10" x2="80" y2="10" />
        <path d="M80,10 q5,-8 12,0 q5,8 12,0" />
        <circle cx="110" cy="10" r="3.5" fill={color} fillOpacity="0.3" />
        <path d="M116,10 q5,-8 12,0 q5,8 12,0" />
        <line x1="140" y1="10" x2="220" y2="10" />
      </g>
    </svg>
  );
}

function Corner({ color, pos }: { color: string; pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const positionClass = {
    tl: 'top-3 right-3',  // RTL: top-right corner visually
    tr: 'top-3 left-3',
    bl: 'bottom-3 right-3',
    br: 'bottom-3 left-3',
  }[pos];
  const rotate = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  return (
    <svg className={`absolute ${positionClass} w-7 h-7 pointer-events-none`} viewBox="0 0 30 30"
         style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="0.8" opacity="0.7">
        <path d="M0,0 L0,12 M0,0 L12,0" />
        <path d="M0,5 q3,-3 6,0 M5,0 q-3,3 0,6" />
        <circle cx="3" cy="3" r="1.2" fill={color} fillOpacity="0.4" />
      </g>
    </svg>
  );
}

function Stat({ icon: Icon, label, value, accent, muted, font }: any) {
  return (
    <div className="flex flex-col items-center">
      <Icon className="w-5 h-5 mb-2" style={{ color: accent }} />
      <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: muted }}>{label}</p>
      <p className="text-base" style={{ fontFamily: font, letterSpacing: '0.05em' }}>{value}</p>
    </div>
  );
}

function LFlow({ children }: any) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>; }
function LField({ label, theme, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: theme.palette.muted, fontFamily: theme.fonts.display }}>{label}</label>
      {children}
    </div>
  );
}
function LInput({ theme, accent, className = '', ...rest }: any) {
  return <input {...rest} className={`w-full bg-transparent px-0 py-2.5 focus:outline-none transition-all ${className}`}
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1.05rem' }}
    onFocus={(e) => (e.target.style.borderBottomColor = accent)}
    onBlur={(e) => (e.target.style.borderBottomColor = theme.palette.divider)} />;
}
function LSelect({ theme, accent, children, ...rest }: any) {
  return <select {...rest} className="w-full bg-transparent px-0 py-2.5 focus:outline-none appearance-none"
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1.05rem' }}
    onFocus={(e) => (e.target.style.borderBottomColor = accent)}
    onBlur={(e) => (e.target.style.borderBottomColor = theme.palette.divider)}>{children}</select>;
}
function LTextarea({ theme, ...rest }: any) {
  return <textarea {...rest} className="w-full bg-transparent px-0 py-2.5 focus:outline-none resize-none"
    style={{ borderBottom: `1px solid ${theme.palette.divider}`, color: theme.palette.text, fontFamily: theme.fonts.body, fontSize: '1rem' }} />;
}

function ThanksLuxe({ accent, accent2, font, muted, text, onReset }: any) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative"
           style={{ background: `radial-gradient(circle, ${accent} 0%, ${accent2}40 100%)` }}>
        <CheckCircle2 className="w-10 h-10" style={{ color: '#2a0a0a' }} />
      </div>
      <h2 className="text-4xl mb-3" style={{ fontFamily: font, color: accent, letterSpacing: '0.1em' }}>
        תודה
      </h2>
      <FiligreeBar color={accent} compact />
      <p className="mt-6 text-base whitespace-pre-wrap italic" style={{ color: muted }}>{text || 'אישור ההגעה התקבל.'}</p>
      <button onClick={onReset} className="mt-6 text-xs tracking-[0.3em] uppercase hover:underline"
              style={{ color: accent, fontFamily: font }}>
        רישום אורח נוסף
      </button>
    </div>
  );
}
