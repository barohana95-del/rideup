import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect, useRef } from 'react';

const stats = [
  { value: 1247, suffix: '+', label: 'אירועים מאורגנים', sub: 'מאז ההשקה' },
  { value: 53800, suffix: '+', label: 'אורחים נרשמו', sub: 'דרך RideUp' },
  { value: 4.9, decimals: 1, suffix: '★', label: 'דירוג ממוצע', sub: 'מ-1,200 ביקורות' },
  { value: 200, suffix: '+', label: 'ספקי הסעות', sub: 'מאומתים' },
];

export default function Stats() {
  return (
    <section
      className="relative py-16 md:py-20"
      style={{ background: '#FFFFFF' }}
    >
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Pill container */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-0"
          style={{
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(30,99,214,0.1)',
            boxShadow: '0 8px 32px -8px rgba(10,31,68,0.1)',
            overflow: 'hidden',
          }}
        >
          {stats.map((s, i) => (
            <StatItem key={i} {...s} index={i} total={stats.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  sub,
  decimals = 0,
  index,
  total,
}: {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  decimals?: number;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    decimals ? latest.toFixed(decimals) : Math.floor(latest).toLocaleString('en-US')
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 2,
        ease: 'easeOut',
        delay: index * 0.1,
      });
      return controls.stop;
    }
  }, [inView, value, motionValue, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center py-10 px-6 relative"
      style={{
        borderLeft: index < total - 1 ? '1px solid rgba(30,99,214,0.08)' : 'none',
      }}
    >
      {/* Subtle lime top bar on hover */}
      <div
        className="display text-5xl md:text-6xl tabular flex items-baseline gap-1 mb-2"
        style={{ color: '#0A1F44' }}
      >
        <motion.span>{rounded}</motion.span>
        <span style={{ color: '#1E63D6' }}>{suffix}</span>
      </div>
      <p className="font-bold text-base md:text-lg" style={{ color: '#0A1F44' }}>{label}</p>
      <p className="text-xs md:text-sm mt-1" style={{ color: '#6B7C95' }}>{sub}</p>
    </motion.div>
  );
}
