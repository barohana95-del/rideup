// =====================================================================
// MinimalTheme — pure white + slate, geometric, generous whitespace.
// =====================================================================
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import type { PublicTenantConfig } from '../../../types';
import { useRsvpForm, formatHebDate } from '../useRsvpForm';
import { THEMES } from '../../../lib/themes';

export default function MinimalTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const t = THEMES.minimal;
  const accent = config.primaryColor || t.palette.accent;
  const cover  = config.coverImageUrl || t.defaultCover;
  const f = useRsvpForm(slug, config);

  return (
    <div className="min-h-screen" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: image */}
        <div className="relative h-[50vh] lg:h-auto order-2 lg:order-1">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0))' }} />
          {config.logoUrl && (
            <img src={config.logoUrl} alt="logo" className="absolute top-8 right-8 h-10 object-contain mix-blend-multiply" />
          )}
          {/* Caption pinned to bottom */}
          <div className="absolute bottom-8 right-8 left-8 text-white">
            <p className="text-[10px] tracking-[0.4em] uppercase mb-2 opacity-90">Save the date</p>
            <p className="text-lg font-light tracking-wide">
              {formatHebDate(config.eventDate)} {config.eventTime ? `· ${config.eventTime.slice(0,5)}` : ''}
            </p>
          </div>
        </div>

        {/* Right: content */}
        <div className="order-1 lg:order-2 px-6 py-12 lg:px-16 lg:py-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Event header */}
            <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: t.palette.muted, fontFamily: t.fonts.display, fontWeight: 600 }}>
              אישור הגעה
            </p>
            <h1 className="text-4xl md:text-5xl mb-3 leading-tight"
                style={{ fontFamily: t.fonts.display, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {config.eventTitle}
            </h1>
            {config.eventLocation && (
              <p className="mb-8 text-sm" style={{ color: t.palette.muted }}>
                {config.eventLocation}
              </p>
            )}

            <div className="h-px mb-8" style={{ background: t.palette.divider }} />

            {f.isSuccess ? (
              <SuccessBlock t={t} accent={accent} text={config.texts.thankYouText} onReset={f.resetForAnotherGuest} />
            ) : (
              <>
                {config.texts.invitationText && (
                  <p className="text-base leading-relaxed mb-6" style={{ color: t.palette.text }}>
                    {config.texts.invitationText}
                  </p>
                )}
                {config.texts.instructionsText && (
                  <p className="text-sm leading-relaxed mb-8 p-4 border-r-2"
                     style={{ background: '#f5f5f5', borderColor: accent, color: t.palette.muted }}>
                    {config.texts.instructionsText}
                  </p>
                )}

                <form onSubmit={f.handleSubmit} className="space-y-6">
                  <MinField label="שם מלא" theme={t}>
                    <MinInput required value={f.formData.fullName}
                      onChange={(e) => f.setFormData({ ...f.formData, fullName: e.target.value })}
                      placeholder="שם ושם משפחה" theme={t} />
                  </MinField>

                  <MinField label="טלפון נייד" theme={t}>
                    <MinInput required type="tel" dir="ltr" className="text-right"
                      value={f.formData.phoneNumber}
                      onChange={(e) => f.setFormData({ ...f.formData, phoneNumber: e.target.value })}
                      placeholder="05X-XXXXXXX" theme={t} />
                  </MinField>

                  <div className="grid grid-cols-2 gap-6">
                    <MinField label="כמות מגיעים" theme={t}>
                      <MinSelect value={f.formData.numGuests}
                        onChange={(e) => f.setFormData({ ...f.formData, numGuests: Number(e.target.value) })}
                        theme={t}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </MinSelect>
                    </MinField>
                    {config.cities.length > 0 && (
                      <MinField label="עיר הסעה" theme={t}>
                        <MinSelect required value={f.formData.city}
                          onChange={(e) => f.setFormData({ ...f.formData, city: e.target.value })}
                          theme={t}>
                          <option value="" disabled>בחרו</option>
                          {config.cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </MinSelect>
                      </MinField>
                    )}
                  </div>

                  {config.useShifts && config.shifts.length > 0 && (
                    <MinField label="חזרה מועדפת" theme={t}>
                      <div className="grid grid-cols-2 gap-2">
                        {config.shifts.map(s => {
                          const sel = f.formData.returnShift === s;
                          return (
                            <button type="button" key={s}
                              onClick={() => f.setFormData({ ...f.formData, returnShift: s })}
                              className="px-3 py-2.5 text-sm rounded-md transition-all"
                              style={{
                                background: sel ? t.palette.accent : '#f5f5f5',
                                color: sel ? '#fff' : t.palette.text,
                                border: `1px solid ${sel ? t.palette.accent : t.palette.divider}`,
                              }}>{s}</button>
                          );
                        })}
                      </div>
                    </MinField>
                  )}

                  <MinField label="הערות" theme={t}>
                    <MinTextarea rows={2} value={f.formData.notes}
                      onChange={(e) => f.setFormData({ ...f.formData, notes: e.target.value })}
                      placeholder="אופציונלי" theme={t} />
                  </MinField>

                  {f.formError && <p className="text-sm" style={{ color: '#dc2626' }}>{f.formError}</p>}

                  <button type="submit" disabled={f.isSubmitting}
                    className="w-full py-4 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: accent, color: '#fff', letterSpacing: '0.05em' }}>
                    {f.isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> שולח...</> : <>אישור הגעה <ArrowLeft className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {config.showPoweredBy && (
        <div className="py-6 text-center text-[10px] tracking-[0.3em] uppercase" style={{ color: t.palette.muted }}>
          Powered by <a href="https://rideup.co.il" target="_blank" rel="noopener" className="hover:underline font-bold">RideUp</a>
        </div>
      )}
    </div>
  );
}

function MinField({ label, theme, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: theme.palette.muted }}>{label}</label>
      {children}
    </div>
  );
}
function MinInput({ theme, className = '', ...rest }: any) {
  return <input {...rest} className={`w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all text-base ${className}`}
    style={{ background: '#fafafa', border: `1px solid ${theme.palette.divider}`, color: theme.palette.text }} />;
}
function MinSelect({ theme, children, ...rest }: any) {
  return <select {...rest} className="w-full px-4 py-3 rounded-md focus:outline-none appearance-none text-base"
    style={{ background: '#fafafa', border: `1px solid ${theme.palette.divider}`, color: theme.palette.text }}>{children}</select>;
}
function MinTextarea({ theme, ...rest }: any) {
  return <textarea {...rest} className="w-full px-4 py-3 rounded-md focus:outline-none resize-none text-base"
    style={{ background: '#fafafa', border: `1px solid ${theme.palette.divider}`, color: theme.palette.text }} />;
}

function SuccessBlock({ t, accent, text, onReset }: any) {
  return (
    <div className="py-8">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
           style={{ background: accent, color: '#fff' }}>
        <CheckCircle2 className="w-7 h-7" />
      </div>
      <h2 className="text-3xl mb-3" style={{ fontFamily: t.fonts.display, fontWeight: 700, letterSpacing: '-0.02em' }}>תודה!</h2>
      <p className="text-base leading-relaxed whitespace-pre-wrap mb-8" style={{ color: t.palette.muted }}>
        {text || 'אישור ההגעה התקבל. נתראה!'}
      </p>
      <button onClick={onReset} className="text-sm font-bold underline-offset-4 hover:underline"
              style={{ color: accent }}>
        רישום אורח נוסף →
      </button>
    </div>
  );
}
