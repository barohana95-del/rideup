import { motion } from 'motion/react';
import { Check, ChevronLeft } from 'lucide-react';

const services = [
  {
    tag: '01 · אתר RSVP',
    title: 'אתר אירוע מקצועי',
    subtitle: 'Wedding · Bar Mitzvah · Corporate',
    bullets: [
      'עיצובים מוכנים לשימוש',
      'RTL מלא, מובייל-first',
      'דומיין מותאם משלך',
      'אנימציות ואפקטים',
    ],
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    accent: '#1E63D6',
  },
  {
    tag: '02 · ניהול הסעות',
    title: 'תכנון הסעות חכם',
    subtitle: 'Smart Transportation Management',
    bullets: [
      'תכנון אוטומטי לפי ערים',
      'אלגוריתם first-fit-decreasing',
      'ייצוא רשימה לנהג',
      'תזכורות SMS / WhatsApp',
    ],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    accent: '#1E63D6',
  },
];

export default function WhyRideUp() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            style={{
              background: 'rgba(30,99,214,0.1)',
              color: '#1E63D6',
              border: '1px solid rgba(30,99,214,0.2)',
            }}
          >
            מה אנחנו מציעים
          </span>
          <h2
            className="display text-4xl md:text-6xl mb-5 reveal-heading"
            style={{ color: '#0A1F44' }}
          >
            הכל שאתה צריך.{' '}
            <span style={{ color: '#1E63D6' }}>בכלי אחד.</span>
          </h2>
          <p className="text-lg mt-4 max-w-2xl mx-auto" style={{ color: '#6B7C95' }}>
            לא עוד גוגל פורם. לא עוד אקסל. RideUp נותן לך את שני הכלים החשובים ביותר — יחד.
          </p>
        </motion.div>

        {/* Services list */}
        <div className="space-y-12 md:space-y-16">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`grid lg:grid-cols-12 gap-8 md:gap-12 items-center ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              {/* Text side */}
              <div className="lg:col-span-5">
                <span
                  className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full"
                  style={{
                    background: i === 0 ? 'rgba(30,99,214,0.1)' : 'rgba(30,99,214,0.2)',
                    color: i === 0 ? '#1E63D6' : '#1E63D6',
                  }}
                >
                  {s.tag}
                </span>
                <h3 className="display text-3xl md:text-5xl mb-2" style={{ color: '#0A1F44' }}>
                  {s.title}
                </h3>
                <p className="text-sm font-medium mb-6" style={{ color: '#6B7C95' }}>
                  {s.subtitle}
                </p>

                <ul className="space-y-3 mb-8">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3" style={{ color: '#3D4F6B' }}>
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: i === 0 ? 'rgba(30,99,214,0.12)' : 'rgba(30,99,214,0.2)',
                        }}
                      >
                        <Check
                          className="w-3.5 h-3.5"
                          strokeWidth={3}
                          style={{ color: s.accent }}
                        />
                      </span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold transition-all group text-white"
                  style={{
                    background: s.accent === '#1E63D6' ? '#0A1F44' : '#0A1F44',
                    borderRadius: '100px',
                  }}
                >
                  קרא עוד
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Image side */}
              <div className="lg:col-span-7 relative">
                <div className="relative overflow-hidden shadow-2xl group zoom-tile">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-[280px] md:h-[420px] object-cover transition-transform duration-1000 group-hover:scale-105 parallax-img"
                    loading="lazy"
                    style={{ borderRadius: '24px' }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      borderRadius: '24px',
                      background: 'linear-gradient(to top, rgba(10,31,68,0.5) 0%, transparent 50%)',
                    }}
                  />

                  {/* Tag badge on image */}
                  <div
                    className="absolute top-5 right-5 px-4 py-2.5"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '100px',
                      boxShadow: '0 4px 16px -4px rgba(0,0,0,0.15)',
                    }}
                  >
                    <p
                      className="font-bold text-sm"
                      style={{ color: i === 0 ? '#1E63D6' : '#1E63D6' }}
                    >
                      {s.title.split(' ')[0]}
                    </p>
                  </div>
                </div>

                {/* Decorative accent blob */}
                <div
                  className="absolute -bottom-4 right-12 left-12 h-8 blur-2xl opacity-40"
                  style={{ background: s.accent, borderRadius: '50%' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
