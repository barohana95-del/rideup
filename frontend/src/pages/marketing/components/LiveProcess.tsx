import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Phone, MapPin, Monitor, ArrowLeft } from 'lucide-react';
import { gsap } from '../../../lib/gsap';

export default function LiveProcess() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Draw the connecting line as user scrolls into view
    const path = ref.current.querySelector('.flow-path') as SVGPathElement | null;
    if (path) {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 60%',
          end: 'bottom 70%',
          scrub: 1,
        },
      });
    }

    // Stagger the cards
    const cards = ref.current.querySelectorAll('.flow-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  return (
    <section ref={ref} className="relative bg-ink text-cream py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 halo-emerald blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 halo-coral blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-emerald font-semibold text-sm tracking-[0.3em] uppercase mb-4">
            ─── Live · בזמן אמת ───
          </p>
          <h2 className="display text-4xl md:text-6xl text-cream reveal-heading">
            ברגע שהאורח לוחץ "אישור",
            <br />
            <span className="text-gradient-fresh">אתה כבר יודע.</span>
          </h2>
        </motion.div>

        {/* Three-step flow with connecting SVG path */}
        <div className="relative">
          {/* Connecting flow path (between the 3 cards) */}
          <svg
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-32 hidden md:block pointer-events-none"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              className="flow-path"
              d="M 1100 60 Q 900 20, 700 60 T 100 60"
              stroke="url(#flowGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
            <defs>
              <linearGradient id="flowGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FF6B47" />
                <stop offset="50%" stopColor="#FFD23F" />
                <stop offset="100%" stopColor="#00D27E" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid md:grid-cols-3 gap-6">
            <FlowCard
              step="01"
              icon={Phone}
              title="אורח נרשם"
              when="0:00"
              data="דנה כהן · 050-1234567 · תל אביב"
              color="bg-coral"
              accent="text-coral"
            />
            <FlowCard
              step="02"
              icon={MapPin}
              title="עיר מתעדכנת"
              when="0:01"
              data="תל אביב: 12 → 13 אורחים"
              color="bg-gold"
              accent="text-gold"
              counter
            />
            <FlowCard
              step="03"
              icon={Monitor}
              title="אתה רואה הכל"
              when="0:02"
              data="47 אורחים · 5 ערים · 2 משמרות"
              color="bg-emerald"
              accent="text-emerald"
              live
            />
          </div>
        </div>

        {/* Bottom proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-cream/60"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald pulse-ring" />
            ללא רענון
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald pulse-ring" />
            ללא דיווח ידני
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald pulse-ring" />
            עובד גם כשאתה ישן
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function FlowCard({
  step,
  icon: Icon,
  title,
  when,
  data,
  color,
  accent,
  counter,
  live,
}: {
  step: string;
  icon: React.ElementType;
  title: string;
  when: string;
  data: string;
  color: string;
  accent: string;
  counter?: boolean;
  live?: boolean;
}) {
  return (
    <div className="flow-card relative bg-ink-soft rounded-3xl p-7 border border-cream/10 hover:border-cream/20 transition-colors">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-ink" strokeWidth={2} />
        </div>
        <span className="display text-4xl text-cream/15">{step}</span>
      </div>

      <h3 className="display text-2xl text-cream mb-1">{title}</h3>
      <p className={`text-xs ${accent} font-mono mb-5`}>{when} • timestamp</p>

      <div className="bg-ink-deep border border-cream/10 rounded-xl px-4 py-3 font-mono text-xs text-cream/85 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${color} ${live ? 'pulse-ring' : ''}`} />
        {counter ? (
          <span>
            <span className="text-cream/50">תל אביב:</span> 12{' '}
            <ArrowLeft className="inline w-3 h-3" /> 13
          </span>
        ) : (
          data
        )}
        {live && (
          <span className="mr-auto text-emerald font-semibold uppercase tracking-wider text-[10px]">
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
