// =====================================================================
// RomanticTheme — blush, cream, sage. Script title + floral accents.
// =====================================================================
import { Heart, Calendar, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import type { PublicTenantConfig } from '../../../types';
import { useRsvpForm, formatHebDate } from '../useRsvpForm';
import { THEMES } from '../../../lib/themes';

export default function RomanticTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const t = THEMES.romantic;
  const accent = config.primaryColor || t.palette.accent;
  const accent2 = t.palette.accent2;
  const cover = config.coverImageUrl || t.defaultCover;
  const f = useRsvpForm(slug, config);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      {/* Floral corners */}
      <FloralCorner pos="tr" color={accent2} />
      <FloralCorner pos="bl" color={accent} />

      {/* Hero */}
      <header className="relative pt-12 pb-8 px-4 text-center z-10">
        {config.logoUrl && <img src={config.logoUrl} alt="logo" className="h-14 mx-auto mb-6 opacity-90" />}
        <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: accent }}>
          ◆ הזמנה ◆
        </p>
        <h1 className="text-6xl md:text-8xl leading-none mb-3" style={{ fontFamily: t.fonts.display, color: accent }}>
          {config.eventTitle}
        </h1>
        <div className="flex items-center justify-center gap-3 my-5">
          <span className="h-px w-12" style={{ background: accent }} />
          <Heart className="w-4 h-4" style={{ color: accent2, fill: accent2 }} />
          <span className="h-px w-12" style={{ background: accent }} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm" style={{ color: t.palette.muted }}>
          {config.eventDate && <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatHebDate(config.eventDate)}</span>}
          {config.eventTime && <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{config.eventTime.slice(0,5)}</span>}
          {config.eventLocation && <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{config.eventLocation}</span>}
        </div>
      </header>

      {/* Cover image with soft frame */}
      <div className="max-w-3xl mx-auto px-4 mb-8 relative z-10">
        <div className="aspect-[16/7] rounded-[40px] overflow-hidden shadow-xl"
             style={{ boxShadow: `0 20px 50px -15px ${accent}50` }}>
          <img src={cover} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Form card */}
      <main className="relative z-10 px-4 pb-20">
        <div className="max-w-xl mx-auto rounded-[36px] p-7 md:p-10 relative"
             style={{ background: t.palette.surface, border: `1px solid ${t.palette.divider}`, boxShadow: `0 12px 40px -16px ${accent}30` }}>
          {f.isSuccess ? (
            <ThanksRomantic accent={accent} accent2={accent2} font={t.fonts.display} muted={t.palette.muted}
                            text={config.texts.thankYouText} onReset={f.resetForAnotherGuest} />
          ) : (
            <>
              <p className="text-center text-xs tracking-[0.3em] uppercase mb-2" style={{ color: accent2 }}>
                Save Our Date
              </p>
              <h2 className="text-center text-5xl mb-6" style={{ fontFamily: t.fonts.display, color: accent }}>
                אישור הגעה
              </h2>

              {config.texts.invitationText && (
                <p className="text-center text-lg leading-relaxed mb-6" style={{ color: t.palette.text }}>
                  {config.texts.invitationText}
                </p>
              )}
              {config.texts.instructionsText && (
                <div className="rounded-2xl p-4 mb-6 text-center text-sm leading-relaxed"
                     style={{ background: `${accent}10`, color: t.palette.muted, border: `1px solid ${t.palette.divider}` }}>
                  {config.texts.instructionsText}
                </div>
              )}

              <form onSubmit={f.handleSubmit} className="space-y-4">
                <RFlow>
                  <RField label="שם מלא *" theme={t}>
                    <RInput required value={f.formData.fullName}
                      onChange={(e) => f.setFormData({ ...f.formData, fullName: e.target.value })}
                      placeholder="שם ושם משפחה" theme={t} accent={accent} />
                  </RField>
                  <RField label="טלפון נייד *" theme={t}>
                    <RInput required type="tel" dir="ltr" className="text-right"
                      value={f.formData.phoneNumber}
                      onChange={(e) => f.setFormData({ ...f.formData, phoneNumber: e.target.value })}
                      placeholder="05X-XXXXXXX" theme={t} accent={accent} />
                  </RField>
                </RFlow>

                <RFlow>
                  <RField label="כמות מגיעים *" theme={t}>
                    <RSelect value={f.formData.numGuests}
                      onChange={(e) => f.setFormData({ ...f.formData, numGuests: Number(e.target.value) })}
                      theme={t} accent={accent}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'אורח' : 'אורחים'}</option>)}
                    </RSelect>
                  </RField>
                  {config.cities.length > 0 && (
                    <RField label="הסעה מאיזו עיר? *" theme={t}>
                      <RSelect required value={f.formData.city}
                        onChange={(e) => f.setFormData({ ...f.formData, city: e.target.value })}
                        theme={t} accent={accent}>
                        <option value="" disabled>בחרו עיר</option>
                        {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </RSelect>
                    </RField>
                  )}
                </RFlow>

                {config.useShifts && config.shifts.length > 0 && (
                  <RField label="חזרה מועדפת *" theme={t}>
                    <div className="grid grid-cols-2 gap-2.5">
                      {config.shifts.map(s => {
                        const sel = f.formData.returnShift === s;
                        return (
                          <button type="button" key={s}
                            onClick={() => f.setFormData({ ...f.formData, returnShift: s })}
                            className="px-3 py-2.5 text-sm rounded-full transition-all"
                            style={{
                              background: sel ? accent : '#fff',
                              color: sel ? '#fff' : t.palette.text,
                              border: `1.5px solid ${sel ? accent : t.palette.divider}`,
                            }}>{s}</button>
                        );
                      })}
                    </div>
                  </RField>
                )}

                <RField label="הערות (אופציונלי)" theme={t}>
                  <RTextarea rows={2} value={f.formData.notes}
                    onChange={(e) => f.setFormData({ ...f.formData, notes: e.target.value })}
                    placeholder="בקשות מיוחדות" theme={t} accent={accent} />
                </RField>

                {f.formError && <p className="text-center text-sm" style={{ color: '#dc2626' }}>{f.formError}</p>}

                <button type="submit" disabled={f.isSubmitting}
                  className="w-full py-3.5 text-base font-bold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, color: '#fff', boxShadow: `0 8px 20px -8px ${accent}` }}>
                  {f.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> שולח...</> : <><Heart className="w-4 h-4" /> אישור הגעה</>}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {config.showPoweredBy && (
        <footer className="py-6 text-center text-xs" style={{ color: t.palette.muted }}>
          באהבה מ-<a href="https://rideup.co.il" target="_blank" rel="noopener" className="font-bold hover:underline" style={{ color: accent }}>RideUp</a>
        </footer>
      )}
    </div>
  );
}

function FloralCorner({ pos, color }: { pos: 'tr' | 'bl'; color: string }) {
  const positionClass = pos === 'tr' ? 'top-0 right-0' : 'bottom-0 left-0';
  const rotate = pos === 'tr' ? '0' : '180';
  return (
    <svg className={`absolute ${positionClass} w-64 h-64 opacity-30 pointer-events-none`}
         viewBox="0 0 200 200" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
        <path d="M0,40 Q40,30 60,60 T120,80" />
        <path d="M0,80 Q50,70 80,100" />
        <circle cx="60" cy="60" r="6" fill={color} opacity="0.4" />
        <circle cx="120" cy="80" r="4" fill={color} opacity="0.4" />
        <circle cx="80" cy="100" r="3" fill={color} opacity="0.4" />
        <path d="M50,50 q-5,-10 5,-15 q10,5 5,15 z" fill={color} opacity="0.3" />
        <path d="M110,75 q-5,-8 5,-12 q8,4 5,12 z" fill={color} opacity="0.3" />
      </g>
    </svg>
  );
}

function RFlow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">{children}</div>;
}
function RField({ label, theme, children }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-wider" style={{ color: theme.palette.muted }}>{label}</label>
      {children}
    </div>
  );
}
function RInput({ theme, accent, className = '', ...rest }: any) {
  return <input {...rest} className={`w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 transition-all ${className}`}
    style={{ background: '#fff', border: `1.5px solid ${theme.palette.divider}`, color: theme.palette.text, '--tw-ring-color': accent + '40' } as any} />;
}
function RSelect({ theme, accent, children, ...rest }: any) {
  return <select {...rest} className="w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 appearance-none"
    style={{ background: '#fff', border: `1.5px solid ${theme.palette.divider}`, color: theme.palette.text, '--tw-ring-color': accent + '40' } as any}>{children}</select>;
}
function RTextarea({ theme, accent, ...rest }: any) {
  return <textarea {...rest} className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 resize-none"
    style={{ background: '#fff', border: `1.5px solid ${theme.palette.divider}`, color: theme.palette.text, '--tw-ring-color': accent + '40' } as any} />;
}

function ThanksRomantic({ accent, accent2, font, muted, text, onReset }: any) {
  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
           style={{ background: `${accent}15` }}>
        <CheckCircle2 className="w-9 h-9" style={{ color: accent }} />
      </div>
      <h2 className="text-5xl mb-3" style={{ fontFamily: font, color: accent }}>תודה רבה</h2>
      <div className="flex items-center justify-center gap-2 my-3">
        <span className="h-px w-8" style={{ background: accent2 }} />
        <Heart className="w-3 h-3" style={{ color: accent2, fill: accent2 }} />
        <span className="h-px w-8" style={{ background: accent2 }} />
      </div>
      <p className="mt-4 text-base whitespace-pre-wrap" style={{ color: muted }}>{text || 'אישור ההגעה התקבל. נתראה!'}</p>
      <button onClick={onReset} className="mt-6 text-sm font-bold hover:underline" style={{ color: accent }}>
        רישום אורח נוסף ›
      </button>
    </div>
  );
}
