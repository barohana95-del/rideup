// =====================================================================
// LoginPage — public login page using Google Sign-In.
// After successful login, redirects to /account (Personal Area).
// Honors ?next=/foo to support arbitrary post-login redirects.
// =====================================================================
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { getCurrentUser, renderGoogleButton, refreshUser } from '../../lib/auth';
import { loginAsDemo } from '../../lib/mockAuth';
import Logo from '../marketing/components/Logo';
import Footer from '../marketing/components/Footer';

export default function LoginPage() {
  const btnRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const hasGoogleId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // If already logged in, bounce straight to the destination.
  const next = new URLSearchParams(window.location.search).get('next') || '/account';
  useEffect(() => {
    if (getCurrentUser()) window.location.replace(next);
  }, [next]);

  useEffect(() => {
    if (!btnRef.current || !hasGoogleId) return;
    renderGoogleButton(
      btnRef.current,
      async () => {
        await refreshUser();
        window.location.replace(next);
      },
      (msg) => setError(msg),
    );
  }, [hasGoogleId, next]);

  const handleDemoLogin = async () => {
    loginAsDemo();
    window.location.replace(next);
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Top bar with logo */}
      <header className="px-6 pt-6">
        <a href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </a>
      </header>

      {/* Login card */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Side info bubble */}
          <div className="hidden md:block">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                 style={{ background: '#F2EBFF', color: '#7D39EB' }}>
              <Sparkles className="w-3.5 h-3.5" />
              ברוכים הבאים ל-RideUp
            </div>
          </div>

          <h1 className="display text-3xl md:text-4xl mb-2" style={{ color: '#000' }}>
            התחברות לחשבון
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
            התחבר באמצעות חשבון Google שלך — הרשמה אוטומטית לחשבונות חדשים.
          </p>

          {/* Card */}
          <div className="rounded-3xl p-7 md:p-9"
               style={{ background: '#fff', boxShadow: '0 20px 50px -16px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {hasGoogleId ? (
              <div ref={btnRef} className="flex justify-center" />
            ) : (
              <div className="p-4 rounded-xl text-sm flex items-start gap-2"
                   style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Google Sign-In לא מוגדר</p>
                  <p className="text-xs">הוסף <code className="bg-white/50 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> ל-<code className="bg-white/50 px-1 rounded">.env.local</code>.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl text-sm flex items-start gap-2"
                   style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Dev fallback */}
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

          {/* Disclaimer */}
          <p className="text-center text-xs mt-6" style={{ color: '#9CA3AF' }}>
            על-ידי התחברות, אתה מסכים ל<a href="/terms" className="underline">תנאי השימוש</a> ול<a href="/privacy" className="underline">מדיניות הפרטיות</a>.
          </p>

          <div className="text-center mt-8">
            <a href="/" className="inline-flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: '#7D39EB' }}>
              <ArrowRight className="w-4 h-4" />
              חזרה לעמוד הבית
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
