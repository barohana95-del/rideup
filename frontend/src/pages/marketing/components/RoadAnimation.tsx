import { motion, useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';

// =====================================================================
// RoadAnimation — האוטובוס נע מימין לשמאל לאורך כביש מתעקל,
// נקודות אורות נדלקות לפי הסדר, ובסוף קונפטי מתפרץ.
// loop: 8 שניות.
// =====================================================================

const STOPS = [0.18, 0.36, 0.54, 0.72, 0.9]; // אחוזי-אורך מסלול לנקודות-אורחים
const DURATION = 8; // שניות לכל cycle

export default function RoadAnimation() {
  const [, setCycle] = useState(0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), DURATION * 1000);
    return () => clearInterval(id);
  }, []);

  // טריגר קונפטי בסוף כל cycle
  useEffect(() => {
    const burst = () => {
      animate(
        '.confetti-piece',
        { opacity: [1, 0], y: [0, -60], x: [0, (Math.random() - 0.5) * 120] },
        { duration: 1.2, ease: 'easeOut' }
      );
    };
    const id = setInterval(burst, DURATION * 1000);
    return () => clearInterval(id);
  }, [animate]);

  return (
    <div ref={scope} className="relative w-full h-32 md:h-40 select-none">
      <svg
        viewBox="0 0 1000 120"
        className="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Glow path - softer, behind */}
        <path
          d="M 1000 80 Q 850 30, 700 70 T 400 60 T 100 80 L 0 80"
          stroke="#4ADE80"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
          filter="blur(4px)"
        />
        {/* Main road */}
        <path
          id="road"
          d="M 1000 80 Q 850 30, 700 70 T 400 60 T 100 80 L 0 80"
          stroke="#74C69D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 8"
        />

        {/* Lit-up dots that glow when bus passes */}
        {STOPS.map((t, i) => (
          <DotLight key={i} t={t} index={i} />
        ))}

        {/* Bus, animated along path */}
        <g>
          <motion.g
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{
              duration: DURATION,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            style={{
              offsetPath: "path('M 1000 80 Q 850 30, 700 70 T 400 60 T 100 80 L 0 80')",
              offsetRotate: 'auto',
            }}
          >
            <BusIcon />
          </motion.g>
        </g>

        {/* Finish line celebration anchor (left side) */}
        <g transform="translate(20, 80)">
          <text x="0" y="0" fontSize="32" textAnchor="middle">🎉</text>
        </g>
      </svg>

      {/* Confetti at finish (left side) */}
      <div className="absolute right-auto left-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece absolute block w-2 h-2 rounded-sm"
            style={{
              backgroundColor: ['#FB923C', '#F9A8D4', '#FCD34D', '#86EFAC'][i % 4],
              left: 0,
              top: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DotLight({ t, index }: { t: number; index: number }) {
  // נקודה זוהרת בנקודות הקבועות; הילה דועכת ב-loop.
  return (
    <motion.circle
      cx={1000 - t * 1000}
      cy={t < 0.5 ? 60 : 75}
      r="6"
      fill="#86EFAC"
      initial={{ opacity: 0.3 }}
      animate={{
        opacity: [0.3, 1, 0.3],
        r: [4, 8, 4],
      }}
      transition={{
        duration: DURATION,
        delay: index * (DURATION / STOPS.length / 1.5),
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function BusIcon() {
  // סמל אוטובוס מינימלי SVG.
  return (
    <g transform="translate(-18, -10)">
      <rect x="0" y="0" width="36" height="20" rx="4" fill="#FBF7EE" />
      <rect x="3" y="3" width="8" height="6" rx="1" fill="#0F1F1A" />
      <rect x="14" y="3" width="8" height="6" rx="1" fill="#0F1F1A" />
      <rect x="25" y="3" width="8" height="6" rx="1" fill="#0F1F1A" />
      <circle cx="8" cy="22" r="3" fill="#1F3A2F" />
      <circle cx="28" cy="22" r="3" fill="#1F3A2F" />
      <rect x="32" y="8" width="4" height="3" rx="1" fill="#FCD34D" />
    </g>
  );
}
