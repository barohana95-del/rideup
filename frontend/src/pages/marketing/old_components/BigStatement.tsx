import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function BigStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const yBus = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const rotateBus = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-44 overflow-hidden"
      style={{ background: '#0A1F44' }}
    >
      {/* Cyan glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(30,99,214,0.12) 0%, transparent 65%)' }}
      />
      {/* Lime glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.08) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-10"
          style={{
            background: 'rgba(30,99,214,0.12)',
            color: '#1E63D6',
            border: '1px solid rgba(30,99,214,0.2)',
          }}
        >
          premium · בעברית · רלוונטי
        </motion.span>

        {/* Massive headline */}
        <div className="relative">
          {/* Ghost background word */}
          <h2
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-black pointer-events-none select-none"
            style={{
              fontSize: 'clamp(8rem, 16vw, 18rem)',
              color: 'rgba(255,255,255,0.03)',
              lineHeight: 1,
              fontFamily: 'Heebo, system-ui',
            }}
          >
            EVENT
          </h2>

          {/* Main text */}
          <h2
            className="relative font-black text-white reveal-heading"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              lineHeight: '0.95',
              fontFamily: 'Heebo, system-ui',
            }}
          >
            ההסעות שלך,
          </h2>

          {/* Bus image */}
          <div className="relative my-3 md:my-5">
            <motion.div
              style={{ y: yBus, rotate: rotateBus }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            >
              <BusIllustration />
            </motion.div>

            <h2
              className="relative font-black"
              style={{
                fontSize: 'clamp(3rem, 10vw, 9rem)',
                lineHeight: '0.95',
                fontFamily: 'Heebo, system-ui',
                color: '#1E63D6',
              }}
            >
              מסודרות.
            </h2>
          </div>

          <p
            className="font-medium text-2xl md:text-4xl mt-6 md:mt-10"
            style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}
          >
            "כי הוא מגיע. כי היא מגיעה. כי כולם מגיעים."
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mt-12"
        >
          <a href="/onboarding" className="btn-lime magnetic">
            התחל עכשיו
          </a>
          <a href="#themes" className="btn-secondary magnetic">
            צפה בעיצובים
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function BusIllustration() {
  return (
    <div className="relative">
      <svg
        width="380"
        height="200"
        viewBox="0 0 380 200"
        style={{ filter: 'drop-shadow(0 24px 48px rgba(30,99,214,0.4))' }}
      >
        <defs>
          <linearGradient id="busGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D6E3F4" />
          </linearGradient>
          <linearGradient id="winGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A82E0" />
            <stop offset="100%" stopColor="#1E63D6" />
          </linearGradient>
        </defs>

        {/* Body */}
        <rect x="20" y="40" width="320" height="110" rx="20" fill="url(#busGrad2)" />
        {/* Top stripe */}
        <rect x="20" y="40" width="320" height="14" rx="6" fill="#1E63D6" />
        {/* Bottom stripe */}
        <rect x="20" y="138" width="320" height="12" rx="6" fill="#061331" />
        {/* Windows */}
        <rect x="40" y="62" width="50" height="40" rx="6" fill="url(#winGrad2)" opacity="0.85" />
        <rect x="100" y="62" width="50" height="40" rx="6" fill="url(#winGrad2)" opacity="0.85" />
        <rect x="160" y="62" width="50" height="40" rx="6" fill="url(#winGrad2)" opacity="0.85" />
        <rect x="220" y="62" width="50" height="40" rx="6" fill="url(#winGrad2)" opacity="0.85" />
        <rect x="280" y="62" width="50" height="40" rx="6" fill="url(#winGrad2)" opacity="0.85" />

        {/* Door */}
        <rect x="40" y="105" width="36" height="40" rx="3" fill="#061331" opacity="0.25" />
        <line x1="58" y1="105" x2="58" y2="145" stroke="#0F1F1A" strokeWidth="1" opacity="0.3" />

        {/* Headlight */}
        <rect x="324" y="100" width="14" height="10" rx="3" fill="#1E63D6" />

        {/* Wheels */}
        <circle cx="80" cy="160" r="20" fill="#061331" />
        <circle cx="80" cy="160" r="10" fill="#1E63D6" />
        <circle cx="280" cy="160" r="20" fill="#061331" />
        <circle cx="280" cy="160" r="10" fill="#1E63D6" />

        {/* RideUp wordmark */}
        <text x="180" y="125" textAnchor="middle" fontSize="14" fontWeight="900" fill="#061331">
          RideUp ↗
        </text>
      </svg>
    </div>
  );
}
