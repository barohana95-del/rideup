// =====================================================================
// Onboarding Wizard — orchestrates all 7 steps.
// Uses mock auth until Stage 2 (real Google OAuth) replaces it.
// =====================================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { useOnboarding, clearDraft } from './store';
import { TOTAL_STEPS } from './types';
import { getMockUser, loginAsDemo } from '../../lib/mockAuth';
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

  // Auth gate (mock for now)
  const user = getMockUser();
  if (!user) return <AuthGate />;

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
        <div style={{ color: '#0A1F44' }}>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7C95' }}>
          <span className="hidden sm:inline">{user.displayName}</span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: '#1E63D6', color: '#fff' }}
          >
            {user.displayName[0]}
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
        <p className="text-center text-xs mt-6" style={{ color: '#6B7C95' }}>
          💾 ההתקדמות נשמרת אוטומטית. תוכל לחזור בכל זמן.
        </p>
      </main>
    </div>
  );
}

/* ===== Auth gate (mock) ===== */
function AuthGate() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    loginAsDemo();
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0A1F44', direction: 'rtl' }}
    >
      <div className="max-w-md w-full text-center">
        <div className="mb-8 inline-block">
          <Logo size="lg" />
        </div>

        <div
          className="rounded-3xl p-8 md:p-10"
          style={{ background: '#fff', boxShadow: '0 20px 60px -16px rgba(0,0,0,0.3)' }}
        >
          <h1 className="display text-3xl mb-2" style={{ color: '#0A1F44' }}>
            התחברות
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6B7C95' }}>
            התחבר כדי להמשיך לבניית האתר שלך
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all disabled:opacity-60"
            style={{ background: '#1E63D6', color: '#fff' }}
          >
            {loading ? (
              <>טוען...</>
            ) : (
              <>
                <GoogleIcon />
                המשך כ-Demo
              </>
            )}
          </button>

          <p className="text-xs mt-5" style={{ color: '#6B7C95' }}>
            🔒 בקרוב — Google OAuth אמיתי. בינתיים זה Demo mode.
          </p>
        </div>

        <a
          href="/"
          className="inline-block mt-6 text-sm hover:underline"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          ← חזרה לעמוד הבית
        </a>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#fff" d="M16.51 8.182c0-.563-.05-1.103-.146-1.622H8.65v3.07h4.42a3.78 3.78 0 0 1-1.638 2.485v2.066h2.65c1.55-1.428 2.443-3.532 2.443-6Z" />
      <path fill="#fff" d="M8.65 16.5c2.214 0 4.07-.733 5.428-1.99l-2.65-2.066c-.733.49-1.673.78-2.778.78-2.137 0-3.946-1.443-4.59-3.382H1.328v2.13A8.247 8.247 0 0 0 8.65 16.5Z" opacity=".7" />
      <path fill="#fff" d="M4.06 9.842A4.97 4.97 0 0 1 3.797 8.25c0-.553.094-1.09.263-1.592V4.528H1.328A8.247 8.247 0 0 0 .402 8.25c0 1.332.32 2.595.926 3.722l2.732-2.13Z" opacity=".5" />
      <path fill="#fff" d="M8.65 3.276c1.207 0 2.29.415 3.144 1.23l2.353-2.353C12.715 1.063 10.86.36 8.65.36A8.247 8.247 0 0 0 1.328 4.528l2.732 2.13C4.704 4.72 6.513 3.276 8.65 3.276Z" opacity=".4" />
    </svg>
  );
}

/* ===== Success screen ===== */
function SuccessScreen({ slug, onReset }: { slug: string; onReset: () => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0A1F44', direction: 'rtl' }}
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
          style={{ background: '#1E63D6' }}
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
          <code className="font-mono text-base font-bold" style={{ color: '#1E63D6' }}>
            {slug}.rideup.co.il
          </code>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://${slug}.rideup.co.il`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold transition-all"
            style={{ background: '#1E63D6', color: '#fff' }}
          >
            <ExternalLink className="w-4 h-4" />
            צפה באתר שלי
          </a>
          <a
            href={`/admin?slug=${slug}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold transition-all"
            style={{ background: '#fff', color: '#0A1F44' }}
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
