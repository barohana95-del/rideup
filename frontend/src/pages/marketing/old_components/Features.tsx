import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import {
  Bus,
  MapPin,
  Route,
  Download,
  Palette,
  Archive,
  MessageSquare,
  TrendingUp,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { gsap } from '../../../lib/gsap';

const heroFeatures = [
  {
    title: 'תכנון נסיעה אוטומטי',
    tag: 'Smart Routing',
    desc: 'אלגוריתם first-fit-decreasing מחלק אורחים לאוטובוסים אוטומטית. מקסימום תפוסה. אפס בלגן.',
    accent: '#1E63D6',
    accentBg: 'rgba(30,99,214,0.12)',
    points: ['חלוקה לפי עיר/משמרת', 'גודל אוטובוס אוטומטי', 'ייצוא רשימה לנהג'],
  },
  {
    title: 'עורך עיצוב חי',
    tag: 'Theme Studio',
    desc: 'שנה צבעים, החלף לוגו, בחר פונט — בלי קוד. שינויים בזמן אמת, אורחים רואים מיד.',
    accent: '#1E63D6',
    accentBg: 'rgba(30,99,214,0.15)',
    points: ['4 ערכות עיצוב', 'Color picker', 'העלאת לוגו'],
  },
];

const smallFeatures = [
  { icon: Bus, label: 'טופס RSVP', sub: 'RTL · מובייל-first', accent: '#1E63D6' },
  { icon: MapPin, label: 'ניהול ערים', sub: 'בזמן אמת', accent: '#1E63D6' },
  { icon: Route, label: 'ייצוא Excel/PDF', sub: 'רשימה לנהג', accent: '#1E63D6' },
  { icon: MessageSquare, label: 'SMS / WhatsApp', sub: "תזכורות אוטו'", accent: '#1E63D6' },
  { icon: Archive, label: 'ארכיון לעד', sub: 'גישה מתי שתרצה', accent: '#1E63D6' },
  { icon: TrendingUp, label: 'סטטיסטיקות', sub: 'גרפים ותחזיות', accent: '#1E63D6' },
  { icon: Sparkles, label: 'סקירה חינם', sub: 'מצוות RideUp', accent: '#1E63D6' },
  { icon: Download, label: 'API לפיתוח', sub: 'בקרוב', accent: '#1E63D6' },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.feature-card');
    const tween = gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#FFFFFF' }}
    >
      {/* Section divider */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(30,99,214,0.15), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 mb-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5"
              style={{ background: 'rgba(30,99,214,0.1)', color: '#1E63D6', border: '1px solid rgba(30,99,214,0.2)' }}
            >
              מה אתה מקבל
            </span>
            <h2 className="display text-4xl md:text-6xl reveal-heading" style={{ color: '#0A1F44' }}>
              לא רק <span style={{ textDecoration: 'line-through', color: '#B0BEC5' }}>טופס</span>.
              <br />
              <span style={{ color: '#1E63D6' }}>מערכת שלמה.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <p className="leading-relaxed text-lg" style={{ color: '#6B7C95' }}>
              הקמת אתר זה רק ההתחלה. הפיצ'רים האמיתיים נמצאים אחרי הקמה — בכלים שחוסכים שעות,
              באוטומציות שעובדות בשבילך.
            </p>
          </motion.div>
        </div>

        {/* Two big hero features */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {heroFeatures.map((f, i) => (
            <div
              key={f.title}
              className="feature-card relative overflow-hidden group"
              style={{
                background: '#0A1F44',
                borderRadius: '24px',
                padding: '40px',
              }}
            >
              {/* Accent glow */}
              <div
                className="absolute -top-16 -left-16 w-48 h-48 pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.6]"
                style={{
                  background: `radial-gradient(circle, ${f.accent}40 0%, transparent 70%)`,
                  opacity: 0.35,
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold"
                    style={{
                      background: f.accentBg,
                      color: f.accent === '#1E63D6' ? '#8aad00' : f.accent,
                      borderRadius: '100px',
                      border: `1px solid ${f.accent}30`,
                    }}
                  >
                    {f.tag}
                  </span>
                  <span
                    className="display text-3xl"
                    style={{ color: 'rgba(255,255,255,0.12)' }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <h3 className="display text-3xl md:text-4xl text-white mb-4">{f.title}</h3>
                <p className="leading-relaxed mb-6 text-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {f.desc}
                </p>

                <ul className="space-y-2 mb-8">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: f.accent }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <FeatureMockup index={i} accent={f.accent} />
              </div>
            </div>
          ))}
        </div>

        {/* 2×4 grid of smaller features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-cards">
          {smallFeatures.map((f) => (
            <div
              key={f.label}
              className="feature-card group relative cursor-default transition-all duration-300 spotlight"
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '24px 20px',
                border: '1px solid rgba(30,99,214,0.08)',
                boxShadow: '0 2px 16px -4px rgba(10,31,68,0.06)',
              }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px -8px ${f.accent}30`;
                (e.currentTarget as HTMLElement).style.borderColor = `${f.accent}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px -4px rgba(10,31,68,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,99,214,0.08)';
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.accent}15` }}
              >
                <f.icon className="w-5 h-5" strokeWidth={2} style={{ color: f.accent === '#1E63D6' ? '#7a9f00' : f.accent }} />
              </div>
              <p className="font-bold text-base" style={{ color: '#0A1F44' }}>{f.label}</p>
              <p className="text-xs mt-1" style={{ color: '#6B7C95' }}>{f.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-between gap-4 p-7 md:p-10"
          style={{
            background: '#0A1F44',
            borderRadius: '24px',
          }}
        >
          <div>
            <p className="display text-2xl text-white mb-1">רוצה לראות את כל הפיצ'רים?</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              14 יום ניסיון חינם, ללא כרטיס אשראי.
            </p>
          </div>
          <a href="#pricing" className="btn-lime">
            התחל ניסיון
            <ChevronLeft className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureMockup({ index, accent }: { index: number; accent: string }) {
  if (index === 0) {
    return (
      <div
        className="font-mono text-sm"
        style={{
          background: '#0A1F44',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="w-2 h-2 rounded-full" style={{ background: '#28C840' }} />
          <span className="text-xs mr-2" style={{ color: 'rgba(255,255,255,0.35)' }}>תכנון אוטומטי</span>
        </div>
        {[
          { city: 'תל אביב', count: 47, buses: '50+ × 1' },
          { city: 'רמת גן', count: 23, buses: '30+ × 1' },
          { city: 'הרצליה', count: 18, buses: '20+ × 1' },
        ].map((row) => (
          <div
            key={row.city}
            className="flex items-center justify-between py-2"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
              {row.city}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{row.count} אורחים</span>
            <span className="text-xs font-bold" style={{ color: '#1E63D6' }}>→ {row.buses}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        background: '#0A1F44',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-4 h-4" style={{ color: '#1E63D6' }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>עורך עיצוב</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>צבע ראשי</span>
          <div className="flex gap-1.5">
            {['#1E63D6', '#1E63D6', '#FF6B6B', '#9B59B6', '#F39C12'].map((c, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full"
                style={{
                  background: c,
                  outline: i === 0 ? '2px solid white' : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>פונט</span>
          <span className="text-sm font-bold text-white">Heebo</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>לוגו</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>aviv-bar.png ✓</span>
        </div>
      </div>
    </div>
  );
}


