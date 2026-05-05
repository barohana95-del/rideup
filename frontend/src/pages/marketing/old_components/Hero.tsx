import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronLeft, Play, Calendar, MapPin, Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from '../../../lib/gsap';

export default function Hero() {
  const cardRef   = useRef<HTMLDivElement>(null);
  const hlRef     = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start start', 'end start'] });

  const yMockup   = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const fadeOut   = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (!hlRef.current) return;
    gsap.fromTo(
      hlRef.current.querySelectorAll('.hl'),
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.15 }
    );
  }, []);

  return (
    /* section: edge-to-edge with tiny side padding */
    <section
      id="hero"
      style={{
        background: '#EAF1FB',
        paddingTop: 84,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 0,
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━ CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={cardRef}
        style={{
          borderRadius: 26,
          minHeight: '72vh',
          background: '#1B2830',
          overflow: 'hidden',
          isolation: 'isolate',
          position: 'relative',
        }}
      >
        {/* ── DIAGONAL COLORED ZONE (right side in RTL = visual left for mockup) */}
        {/*    In RTL layout, the mockup column is on the visual right            */}
        {/*    clip-path in CSS is NOT affected by RTL — it's always geometric    */}
        {/*    So: right portion = polygon(58% 0, 100% 0, 100% 100%, 68% 100%)  */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 68% 100%)',
            background: 'linear-gradient(160deg, #0A3344 0%, #082839 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── BRIGHT DIAGONAL CUT LINE */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            clipPath: 'polygon(57.3% 0, 59% 0, 69% 100%, 67.3% 100%)',
            background: 'linear-gradient(to bottom, rgba(30,99,214,0.65) 0%, rgba(30,99,214,0.15) 60%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── LARGE ORB behind mockup zone (right side geometric center) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%', right: '21%',
            transform: 'translate(50%, -50%)',
            width: 500, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,99,214,0.22) 0%, rgba(30,99,214,0.05) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── LIME ACCENT (top-left = behind headline) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -80, left: -80,
            width: 380, height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,99,214,0.1) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── DOT GRID — left text zone only */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            clipPath: 'polygon(0 0, 57% 0, 67% 100%, 0 100%)',
            backgroundImage: [
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />

        {/* ── WATERMARK */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -8,
            left: 32,
            fontSize: 'clamp(5rem, 10vw, 10rem)',
            fontWeight: 900,
            fontFamily: 'Heebo, system-ui',
            letterSpacing: '-0.06em',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.028)',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          RSVP
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CONTENT ROW  (dir ltr to control column order precisely)
            Left col  = text (58%)
            Right col = mockup (42%)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          dir="ltr"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            minHeight: '72vh',
            position: 'relative',
          }}
        >
          {/* ── TEXT COLUMN (left in ltr = right visually for RTL readers) */}
          <motion.div
            dir="rtl"
            className="flex flex-col justify-center"
            style={{
              opacity: fadeOut,
              width: '58%',
              flexShrink: 0,
              paddingLeft: 56,
              paddingRight: 64,
              paddingTop: 52,
              paddingBottom: 80,
              position: 'relative',
              zIndex: 5,
            }}
          >
            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="inline-flex items-center gap-2 mb-6 self-start"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100,
                padding: '7px 14px',
              }}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-bold text-sm">5.0</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>· 1,247 ביקורות</span>
            </motion.div>

            {/* Headline */}
            <div ref={hlRef} className="overflow-hidden mb-7">
              <h1>
                <span
                  className="hl block text-white font-black"
                  style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4.8rem)', lineHeight: 1.04, fontFamily: 'Heebo, system-ui' }}
                >
                  הסעות לאירועים
                </span>
                <span
                  className="hl block font-black"
                  style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4.8rem)', lineHeight: 1.04, fontFamily: 'Heebo, system-ui' }}
                >
                  <span className="text-white">שנעשה </span>
                  <span style={{ color: '#1E63D6' }}>אוטומטי.</span>
                </span>
                <span
                  className="hl flex items-baseline gap-4 font-black"
                  style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4.8rem)', lineHeight: 1.04, fontFamily: 'Heebo, system-ui', marginTop: 3 }}
                >
                  <span style={{ color: '#1E63D6' }}>חכם.</span>
                  <span className="text-white">פשוט.</span>
                </span>
              </h1>
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.7 }}
              className="text-lg leading-relaxed mb-9"
              style={{ color: 'rgba(255,255,255,0.52)', maxWidth: 420 }}
            >
              אתר RSVP מקצועי + פאנל ניהול חכם.{' '}
              <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                בנו אתר אירוע בדקות.
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.86 }}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              <a href="/onboarding" className="btn-lime text-base group magnetic">
                התחל בחינם
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </a>
              <a href="#themes" className="btn-secondary text-base flex items-center gap-3 group magnetic">
                <span
                  className="w-8 h-8 flex items-center justify-center pulse-ring shrink-0"
                  style={{ background: '#1E63D6', borderRadius: '50%' }}
                >
                  <Play className="w-3 h-3 fill-white text-white" />
                </span>
                <span>צפה בדמו</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap items-center gap-8"
            >
              <Stat n="1,200+" label="אירועים" sub="מאורגנים" />
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
              <Stat n="50K+" label="אורחים" sub="נרשמו" />
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />
              <Stat n="4.9★" label="דירוג" sub="ממוצע" />
            </motion.div>
          </motion.div>

          {/* ── MOCKUP COLUMN (right in ltr) */}
          <div
            className="flex-1 hidden lg:flex items-end justify-center"
            style={{ paddingBottom: 0, paddingTop: 32, position: 'relative', zIndex: 10 }}
          >
            <div style={{ marginBottom: -115 }}>
              <motion.div
                style={{ y: yMockup }}
                initial={{ opacity: 0, scale: 0.8, y: 60, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.45, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <InvitationMockup />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM WAVE */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 52, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M0,26 Q240,52 480,18 Q720,-8 960,26 Q1200,54 1440,26 L1440,52 L0,52 Z" fill="#EAF1FB" />
          </svg>
        </div>
      </div>

      {/* Mobile mockup */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="lg:hidden flex justify-center py-10"
        style={{ background: '#EAF1FB' }}
      >
        <InvitationMockup />
      </motion.div>

      {/* Desktop spacer */}
      <div className="hidden lg:block" style={{ height: 136, background: '#EAF1FB' }} />
    </section>
  );
}

/* ─── helpers ────────────────────────────────────────────────────── */
function Stat({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div>
      <p
        className="font-black tabular text-white"
        style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.4rem)', lineHeight: 1, fontFamily: 'Heebo, system-ui' }}
      >
        {n}
      </p>
      <p style={{ fontSize: 11, marginTop: 4, color: 'rgba(255,255,255,0.42)' }}>
        <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>{label}</span> {sub}
      </p>
    </div>
  );
}

function InvitationMockup() {
  return (
    <div className="relative">
      {/* Cyan halo */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: -52,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,99,214,0.3) 0%, transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card */}
      <div
        className="float-slow"
        style={{
          width: 316,
          borderRadius: 26,
          background: '#fff',
          boxShadow: '0 48px 120px -20px rgba(0,0,0,0.52), 0 0 0 1px rgba(255,255,255,0.05)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top bar */}
        <div style={{ background: '#1B2830', padding: '11px 0', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Save The Date
          </p>
        </div>

        {/* Image zone */}
        <div
          style={{
            height: 152,
            background: 'linear-gradient(135deg, #D5F2FC 0%, #EEF9D6 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <svg viewBox="0 0 316 152" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <circle cx="52"  cy="112" r="26" fill="#1E63D6" opacity="0.2"  />
            <circle cx="265" cy="44"  r="34" fill="#1E63D6" opacity="0.28" />
            <circle cx="158" cy="128" r="17" fill="#1E63D6" opacity="0.35" />
            <circle cx="98"  cy="30"  r="13" fill="#1E63D6" opacity="0.42" />
            <circle cx="204" cy="118" r="9"  fill="#1E63D6" opacity="0.28" />
          </svg>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '5.5rem', color: '#1B2830', opacity: 0.09, lineHeight: 1, userSelect: 'none' }}>
            &
          </span>
        </div>

        {/* Details */}
        <div dir="rtl" style={{ padding: '18px 24px 8px', textAlign: 'center', color: '#0A1F44' }}>
          <p
            style={{ color: '#1E63D6', fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Calendar style={{ width: 12, height: 12 }} />
            17 · ספטמבר · 2026
          </p>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>אביב & בר</h3>
          <div style={{ width: 32, height: 2, background: '#1E63D6', margin: '10px auto' }} />
          <p style={{ color: '#8A9BAA', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <MapPin style={{ width: 12, height: 12 }} />
            גני התערוכה · תל אביב
          </p>
        </div>

        {/* Form */}
        <div dir="rtl" style={{ padding: '8px 16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Field label="שם מלא"     value="דנה כהן"        filled />
          <Field label="טלפון"      value="050-1234567"    filled />
          <Field label="עיר יציאה"  value="תל אביב"        />
          <Field label="משמרת חזרה" value="סבב א׳ · 00:00" />
          <button style={{ width: '100%', background: '#1E63D6', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 0', borderRadius: 14, marginTop: 8, cursor: 'pointer', border: 'none' }}>
            אישור הגעה ←
          </button>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#B0BEC5', paddingTop: 4 }}>
            Powered by <span style={{ fontWeight: 700, color: '#1E63D6' }}>RideUp ↗</span>
          </p>
        </div>
      </div>

      {/* Badge signups */}
      <motion.div
        initial={{ opacity: 0, y: -16, x: -16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.2, ease: 'easeOut' }}
        className="float-med"
        style={{
          position: 'absolute', top: -18, left: -52,
          background: '#fff', borderRadius: 18,
          padding: '10px 15px',
          boxShadow: '0 20px 56px -10px rgba(0,0,0,0.28)',
          transform: 'rotate(6deg)',
          zIndex: 10,
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A9BAA', marginBottom: 2 }}>
          נרשמו ב-24 שעות
        </p>
        <p style={{ fontSize: 26, fontWeight: 900, color: '#1B2830', display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1 }}>
          47 <span style={{ fontSize: 14, color: '#1E63D6' }}>↗</span>
        </p>
      </motion.div>

      {/* Badge city */}
      <motion.div
        initial={{ opacity: 0, y: 16, x: 16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.38, ease: 'easeOut' }}
        className="float-slow"
        style={{
          position: 'absolute', bottom: -22, right: -52,
          background: '#0A3344', borderRadius: 18,
          padding: '10px 15px',
          boxShadow: '0 20px 56px -10px rgba(0,0,0,0.45)',
          transform: 'rotate(-4deg)',
          zIndex: 10,
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', marginBottom: 2 }}>
          תל אביב
        </p>
        <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1 }}>
          <span className="pulse-ring" style={{ width: 10, height: 10, borderRadius: '50%', background: '#1E63D6', display: 'inline-block', flexShrink: 0 }} />
          32 אורחים
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, value, filled }: { label: string; value: string; filled?: boolean }) {
  return (
    <div style={{
      borderRadius: 12, padding: '7px 12px',
      background: filled ? 'rgba(30,99,214,0.09)' : '#F4F6F8',
      border:     filled ? '1px solid rgba(30,99,214,0.22)' : '1px solid transparent',
    }}>
      <p style={{ fontSize: 9, fontWeight: 600, color: '#C0CAD2', lineHeight: 1, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: filled ? '#1E63D6' : '#C0CAD2' }}>{value}</p>
    </div>
  );
}
