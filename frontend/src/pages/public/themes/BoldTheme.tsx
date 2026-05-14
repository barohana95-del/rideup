// =====================================================================
// BoldTheme — vibrant gradient + glassmorphism + party energy.
// =====================================================================
import { Sparkles, Calendar, MapPin, Clock, CheckCircle2, Loader2, PartyPopper } from 'lucide-react';
import type { PublicTenantConfig } from '../../../types';
import { useRsvpForm, formatHebDate } from '../useRsvpForm';
import { THEMES } from '../../../lib/themes';

export default function BoldTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const t = THEMES.bold;
  const accent = config.primaryColor || t.palette.accent;
  const accent2 = t.palette.accent2;
  const cover = config.coverImageUrl || t.defaultCover;
  const f = useRsvpForm(slug, config);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `radial-gradient(ellipse at top left, ${accent2}40 0%, transparent 50%), radial-gradient(ellipse at bottom right, ${accent}25 0%, transparent 50%), ${t.palette.bg}`,
      color: t.palette.text, fontFamily: t.fonts.body,
    }}>
      {/* Floating geometric shapes */}
      <Shapes accent={accent} accent2={accent2} />

      {/* Hero */}
      <header className="relative px-4 pt-12 pb-8 text-center z-10">
        {config.logoUrl && <img src={config.logoUrl} alt="logo" className="h-14 mx-auto mb-6" />}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 backdrop-blur-md"
             style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
          <span className="text-[11px] tracking-[0.3em] uppercase font-bold">You're Invited</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl mb-5 leading-[0.95]"
            style={{
              fontFamily: t.fonts.display,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
            {config.eventTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {config.eventDate && <Chip icon={Calendar}>{formatHebDate(config.eventDate)}</Chip>}
          {config.eventTime && <Chip icon={Clock}>{config.eventTime.slice(0,5)}</Chip>}
          {config.eventLocation && <Chip icon={MapPin}>{config.eventLocation}</Chip>}
        </div>
      </header>

      {/* Cover image */}
      <div className="max-w-3xl mx-auto px-4 mb-8 relative z-10">
        <div className="aspect-[16/8] rounded-3xl overflow-hidden relative ring-1"
             style={{ boxShadow: `0 30px 80px -20px ${accent}80`, borderColor: 'rgba(255,255,255,0.15)' }}>
          <img src={cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 60%, ${t.palette.bg})` }} />
        </div>
      </div>

      {/* Form card */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-xl mx-auto rounded-3xl p-7 md:p-9 backdrop-blur-2xl"
             style={{
               background: 'rgba(255,255,255,0.07)',
               border: '1px solid rgba(255,255,255,0.18)',
               boxShadow: `0 25px 60px -15px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
             }}>
          {f.isSuccess ? (
            <ThanksBold accent={accent} accent2={accent2} font={t.fonts.display}
                        text={config.texts.thankYouText} onReset={f.resetForAnotherGuest} />
          ) : (
            <>
              <h2 className="text-center text-3xl md:text-4xl mb-2 flex items-center justify-center gap-3"
                  style={{ fontFamily: t.fonts.display, fontWeight: 700 }}>
                <PartyPopper className="w-7 h-7" style={{ color: accent }} />
                אישור הגעה
              </h2>
              <p className="text-center text-sm mb-6" style={{ color: t.palette.muted }}>
                כי אנחנו רוצים אותך שם
              </p>

              {config.texts.invitationText && (
                <p className="text-center text-base leading-relaxed mb-6" style={{ color: t.palette.muted }}>
                  {config.texts.invitationText}
                </p>
              )}
              {config.texts.instructionsText && (
                <div className="rounded-2xl p-4 mb-6 text-sm leading-relaxed text-center backdrop-blur-md"
                     style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: t.palette.muted }}>
                  {config.texts.instructionsText}
                </div>
              )}

              <form onSubmit={f.handleSubmit} className="space-y-4">
                <BFlow>
                  <BField label="שם מלא *" theme={t}>
                    <BInput required value={f.formData.fullName}
                      onChange={(e) => f.setFormData({ ...f.formData, fullName: e.target.value })}
                      placeholder="שם ושם משפחה" theme={t} accent={accent} />
                  </BField>
                  <BField label="טלפון נייד *" theme={t}>
                    <BInput required type="tel" dir="ltr" className="text-right"
                      value={f.formData.phoneNumber}
                      onChange={(e) => f.setFormData({ ...f.formData, phoneNumber: e.target.value })}
                      placeholder="05X-XXXXXXX" theme={t} accent={accent} />
                  </BField>
                </BFlow>

                <BFlow>
                  <BField label="כמות מגיעים *" theme={t}>
                    <BSelect value={f.formData.numGuests}
                      onChange={(e) => f.setFormData({ ...f.formData, numGuests: Number(e.target.value) })}
                      theme={t} accent={accent}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} className="text-black">{n} {n === 1 ? 'אורח' : 'אורחים'}</option>)}
                    </BSelect>
                  </BField>
                  {config.cities.length > 0 && (
                    <BField label="עיר *" theme={t}>
                      <BSelect required value={f.formData.city}
                        onChange={(e) => f.setFormData({ ...f.formData, city: e.target.value })}
                        theme={t} accent={accent}>
                        <option value="" disabled className="text-black">בחרו</option>
                        {config.cities.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                      </BSelect>
                    </BField>
                  )}
                </BFlow>

                {config.useShifts && config.shifts.length > 0 && (
                  <BField label="חזרה מועדפת *" theme={t}>
                    <div className="grid grid-cols-2 gap-2.5">
                      {config.shifts.map(s => {
                        const sel = f.formData.returnShift === s;
                        return (
                          <button type="button" key={s}
                            onClick={() => f.setFormData({ ...f.formData, returnShift: s })}
                            className="px-3 py-3 text-sm rounded-2xl font-bold transition-all"
                            style={{
                              background: sel ? `linear-gradient(135deg, ${accent}, ${accent2})` : 'rgba(255,255,255,0.05)',
                              color: '#fff',
                              border: sel ? 'none' : '1px solid rgba(255,255,255,0.15)',
                              boxShadow: sel ? `0 8px 20px -6px ${accent}80` : 'none',
                            }}>{s}</button>
                        );
                      })}
                    </div>
                  </BField>
                )}

                <BField label="הערות (אופציונלי)" theme={t}>
                  <BTextarea rows={2} value={f.formData.notes}
                    onChange={(e) => f.setFormData({ ...f.formData, notes: e.target.value })}
                    placeholder="בקשות מיוחדות" theme={t} accent={accent} />
                </BField>

                {f.formError && <p className="text-center text-sm" style={{ color: '#fca5a5' }}>{f.formError}</p>}

                <button type="submit" disabled={f.isSubmitting}
                  className="w-full py-4 text-base font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`,
                    color: t.palette.bg,
                    boxShadow: `0 18px 40px -10px ${accent}80`,
                    letterSpacing: '0.04em',
                  }}>
                  {f.isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> שולח...</> : <><Sparkles className="w-5 h-5" /> אישור הגעה</>}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {config.showPoweredBy && (
        <footer className="relative z-10 py-6 text-center text-xs" style={{ color: t.palette.muted }}>
          Powered by <a href="https://rideup.co.il" target="_blank" rel="noopener" className="font-bold hover:underline" style={{ color: accent }}>RideUp</a>
        </footer>
      )}
    </div>
  );
}

function Shapes({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <>
      <div className="absolute top-10 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
           style={{ background: accent }} />
      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
           style={{ background: accent2 }} />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none"
           style={{ background: accent }} />
    </>
  );
}

function Chip({ icon: Icon, children }: any) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full backdrop-blur-md font-bold"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
      <Icon className="w-3.5 h-3.5" /> {children}
    </span>
  );
}

function BFlow({ children }: { children: React.ReactNode }) { return <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">{children}</div>; }
function BField({ label, theme, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold tracking-wider" style={{ color: theme.palette.muted }}>{label}</label>
      {children}
    </div>
  );
}
function BInput({ theme, accent, className = '', ...rest }: any) {
  return <input {...rest} className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${className}`}
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: theme.palette.text, '--tw-ring-color': accent } as any} />;
}
function BSelect({ theme, accent, children, ...rest }: any) {
  return <select {...rest} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 appearance-none"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: theme.palette.text, '--tw-ring-color': accent } as any}>{children}</select>;
}
function BTextarea({ theme, accent, ...rest }: any) {
  return <textarea {...rest} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 resize-none"
    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: theme.palette.text, '--tw-ring-color': accent } as any} />;
}

function ThanksBold({ accent, accent2, font, text, onReset }: any) {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
           style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})`, boxShadow: `0 18px 40px -10px ${accent}80` }}>
        <CheckCircle2 className="w-10 h-10" style={{ color: '#1a0033' }} />
      </div>
      <h2 className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: font, fontWeight: 700, background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        תודה!
      </h2>
      <p className="text-base leading-relaxed whitespace-pre-wrap mb-6 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {text || 'אישור ההגעה התקבל. מתרגשים לפגוש אותך!'}
      </p>
      <button onClick={onReset} className="text-sm font-bold hover:underline" style={{ color: accent }}>
        רישום אורח נוסף ›
      </button>
    </div>
  );
}
