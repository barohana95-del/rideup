// =====================================================================
// Onboarding Wizard — orchestrates all 7 steps.
// Uses mock auth until Stage 2 (real Google OAuth) replaces it.
// =====================================================================
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { useOnboarding, clearDraft } from './store';
import { TOTAL_STEPS } from './types';
import { getCurrentUser, renderGoogleButton, refreshUser } from '../../lib/auth';
import { loginAsDemo } from '../../lib/mockAuth';
import { onboardingApi } from '../../lib/api';
import ProgressBar from './components/ProgressBar';
import NavButtons from './components/NavButtons';
import Step1Plan from './steps/Step1Plan';
import Step2Slug from './steps/Step2Slug';
import Step3Theme from './steps/Step3Theme';
import Step4EventDetails from './steps/Step4EventDetails';
import Step5Cities from './steps/Step5Cities';
import Step6Shifts from './steps/Step6Shifts';
import Step7Finish from './steps/Step7Finish';
import Logo from '../marketing/components/Logo';

export default function OnboardingApp() {
  const { draft, update, updateMany, next, back, goTo, reset } = useOnboarding();
  const [submitting, setSubmitting] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auth gate — send guests to the standalone /login page so the design
  // stays consistent with the marketing site. After login they're sent
  // back here via ?next=/onboarding.
  const user = getCurrentUser();
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.replace('/login?next=/onboarding');
    }
    return <AuthGate />;
  }

  // Determine if user can advance from current step
  const canGoNext =
    (draft.step === 1 && draft.plan !== null) ||
    (draft.step === 2 && draft.slugAvailable === true) ||
    (draft.step === 3 && draft.theme !== null) ||
    (draft.step === 4 && !!draft.eventTitle && !!draft.eventDate && !!draft.eventType) ||
    (draft.step === 5 && draft.cities.length >= 1) ||
    (draft.step === 6 && (!draft.useShifts || draft.shifts.length >= 1)) ||
    draft.step === 7;

  const isLast = draft.step === TOTAL_STEPS;

  const handleNext = async () => {
    if (!isLast) {
      next();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const res = await onboardingApi.finalize({
      plan: draft.plan!,
      slug: draft.slug,
      theme: draft.theme!,
      eventType: draft.eventType!,
      eventTitle: draft.eventTitle,
      eventDate: draft.eventDate,
      eventTime: draft.eventTime || undefined,
      eventLocation: draft.eventLocation || undefined,
      cities: draft.cities,
      useShifts: draft.useShifts,
      shifts: draft.shifts,
      texts: {
        invitationText: draft.invitationText,
        instructionsText: draft.instructionsText,
        thankYouText: draft.thankYouText,
      },
    });

    setSubmitting(false);

    if (res.success && res.data) {
      setCreatedSlug(draft.slug);
      clearDraft();
    } else {
      setSubmitError(res.error ?? 'שגיאה לא צפויה. נסה שוב.');
    }
  };

  if (createdSlug) return <SuccessScreen slug={createdSlug} onReset={reset} />;

  return (
    <div className="min-h-screen pb-12" style={{ background: '#FFFFFF', direction: 'rtl' }}>
      {/* Top mini header */}
      <header className="px-6 pt-6 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/" className="opacity-90 hover:opacity-100 transition-opacity">
          <div style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
            {/* Hack: Logo is dark-bg-tuned. For light header we tweak via filter. */}
          </div>
        </a>
        <div style={{ color: '#000000' }}>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
          <span className="hidden sm:inline">{user.displayName}</span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: '#7D39EB', color: '#fff' }}
          >
            {user.displayName?.[0] ?? user.email[0]}
          </div>
        </div>
      </header>

      {/* Progress */}
      <ProgressBar step={draft.step} onStepClick={goTo} />

      {/* Step content */}
      <main className="max-w-6xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={draft.step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {draft.step === 1 && (
              <Step1Plan
                value={draft.plan}
                onChange={(p) => update('plan', p)}
              />
            )}
            {draft.step === 2 && (
              <Step2Slug
                value={draft.slug}
                onChange={(s) => update('slug', s)}
                onAvailabilityChange={(a) => update('slugAvailable', a)}
              />
            )}
            {draft.step === 3 && (
              <Step3Theme
                value={draft.theme}
                onChange={(t) => update('theme', t)}
              />
            )}
            {draft.step === 4 && (
              <Step4EventDetails
                eventType={draft.eventType}
                eventTitle={draft.eventTitle}
                eventDate={draft.eventDate}
                eventTime={draft.eventTime}
                eventLocation={draft.eventLocation}
                onChange={updateMany}
              />
            )}
            {draft.step === 5 && (
              <Step5Cities
                cities={draft.cities}
                onChange={(cs) => update('cities', cs)}
              />
            )}
            {draft.step === 6 && (
              <Step6Shifts
                useShifts={draft.useShifts}
                shifts={draft.shifts}
                onChange={updateMany}
              />
            )}
            {draft.step === 7 && (
              <Step7Finish draft={draft} onChange={updateMany} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="max-w-3xl mx-auto">
          <NavButtons
            onBack={back}
            onNext={handleNext}
            canGoNext={canGoNext && !submitting}
            isFirst={draft.step === 1}
            isLast={isLast}
            nextLabel={submitting ? 'יוצר אתר...' : isLast ? 'סיים והקם אתר' : 'הבא'}
          />
        </div>

        {/* Submit error banner */}
        {submitError && (
          <div
            className="max-w-3xl mx-auto mt-4 p-4 rounded-2xl flex items-start gap-3"
            style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
            <div className="flex-1">
              <p className="font-bold" style={{ color: '#7F1D1D' }}>שגיאה ביצירת האתר</p>
              <p className="text-sm mt-1" style={{ color: '#991B1B' }}>{submitError}</p>
            </div>
          </div>
        )}

        {/* Helper bar */}
        <p className="text-center text-xs mt-6" style={{ color: '#6B7280' }}>
          💾 ההתקדמות נשמרת אוטומטית. תוכל לחזור בכל זמן.
        </p>
      </main>
    </div>
  );
}

/* ===== Auth gate (real Google + dev mock fallback) ===== */
function AuthGate() {
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const hasGoogleId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!btnRef.current || !hasGoogleId) return;
    renderGoogleButton(
      btnRef.current,
      async () => {
        await refreshUser();
        window.location.reload();
      },
      (msg) => setError(msg),
    );
  }, [hasGoogleId]);

  const handleDemoLogin = async () => {
    loginAsDemo();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#000000', direction: 'rtl' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-block">
          <Logo size="lg" />
        </div>

        <div className="rounded-3xl p-8 md:p-10" style={{ background: '#fff', boxShadow: '0 20px 60px -16px rgba(0,0,0,0.3)' }}>
          <h1 className="display text-3xl mb-2" style={{ color: '#000000' }}>התחברות</h1>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
            התחבר כדי להמשיך לבניית האתר שלך
          </p>

          {hasGoogleId ? (
            <div ref={btnRef} className="flex justify-center" />
          ) : (
            <div className="p-4 rounded-xl text-sm" style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
              ⚠️ <code>VITE_GOOGLE_CLIENT_ID</code> לא מוגדר. הוסף ל-<code>.env.local</code> כדי להפעיל Google Sign-In.
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
              {error}
            </div>
          )}

          {/* Dev-only fallback: demo login */}
          {import.meta.env.DEV && (
            <>
              <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
                <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
                Dev only
                <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
              </div>
              <button
                onClick={handleDemoLogin}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#F2EBFF', color: '#7D39EB', border: '1px dashed #7D39EB' }}
              >
                המשך כ-Demo (mock)
              </button>
            </>
          )}
        </div>

        <a href="/" className="inline-block mt-6 text-sm hover:underline" style={{ color: 'rgba(255,255,255,0.7)' }}>
          ← חזרה לעמוד הבית
        </a>
      </div>
    </div>
  );
}

/* ===== Success screen ===== */
function SuccessScreen({ slug, onReset }: { slug: string; onReset: () => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#000000', direction: 'rtl' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: '#7D39EB' }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
        </motion.div>

        <h1 className="display text-4xl md:text-5xl text-white mb-4">
          האתר שלך מוכן! 🎉
        </h1>

        <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
          הכנו לך אתר RSVP מקצועי תוך דקות. עכשיו רק להפיץ את הקישור.
        </p>

        <div
          className="rounded-2xl p-5 mb-8 inline-flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>הקישור שלך:</span>
          <code className="font-mono text-base font-bold" style={{ color: '#7D39EB' }}>
            {window.location.host}/{slug}
          </code>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold transition-all"
            style={{ background: '#7D39EB', color: '#fff' }}
          >
            <ExternalLink className="w-4 h-4" />
            צפה באתר שלי
          </a>
          <a
            href={`/admin/${slug}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold transition-all"
            style={{ background: '#fff', color: '#000000' }}
          >
            לפאנל ניהול
          </a>
        </div>

        <button
          onClick={onReset}
          className="block mx-auto mt-10 text-sm hover:underline"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          התחל אתר נוסף
        </button>
      </motion.div>
    </div>
  );
}
