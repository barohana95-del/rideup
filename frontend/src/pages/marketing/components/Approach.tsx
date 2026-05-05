import { motion } from 'motion/react';
import { useState } from 'react';
import { LogIn, Brush, Send, BarChart3, ChevronLeft } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'התחבר בגוגל',
    desc: 'בלי הרשמה ארוכה. בלי סיסמאות. לחיצה אחת ואתה בפנים.',
    icon: LogIn,
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=800&q=80',
    accent: '#1E63D6',
  },
  {
    n: '02',
    title: 'עצב את האתר',
    desc: 'בחר אחד מ-4 עיצובים. שנה צבעים, פונט, לוגו. תוצאה תוך דקות, בלי מתכנת.',
    icon: Brush,
    image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=800&q=80',
    accent: '#1E63D6',
  },
  {
    n: '03',
    title: 'הזמן אורחים',
    desc: 'לינק קצר ב-WhatsApp. אורחים נרשמים, ערים מתמלאות, אתה רואה הכל בזמן אמת.',
    icon: Send,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    accent: '#1E63D6',
  },
  {
    n: '04',
    title: 'נהל במקום אחד',
    desc: 'רשימה מסודרת, ייצוא Excel לנהג, תכנון אוטובוסים אוטומטי. הכל מנוהל מהדשבורד.',
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1551845041-63e8e76836ea?auto=format&fit=crop&w=800&q=80',
    accent: '#1E63D6',
  },
];

export default function Approach() {
  const [active, setActive] = useState(0);

  return (
    <section id="how" className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#EAF1FB' }}>
      {/* Subtle glows */}
      <div
        className="absolute top-20 right-10 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.08) 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-10 left-10 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.08) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 mb-16">
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
              איך זה עובד
            </span>
            <h2 className="display text-4xl md:text-6xl reveal-heading" style={{ color: '#0A1F44' }}>
              4 שלבים.{' '}
              <span style={{ color: '#1E63D6' }}>5 דקות.</span>
              <br />
              אתר <span
                className="inline-block px-2 rounded-lg"
                style={{ background: 'rgba(30,99,214,0.2)', color: '#1E63D6' }}
              >חי</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex items-end"
          >
            <p className="leading-relaxed" style={{ color: '#6B7C95' }}>
              אנחנו מאמינים שהקמת אתר RSVP צריכה להיות פשוטה כמו לכתוב הודעה ב-WhatsApp.
              ככה בנינו את התהליך — קצר, ויזואלי, ובלי אקסלים.
            </p>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-cards">
          {steps.map((step, i) => {
            const isActive = active === i;
            return (
              <motion.button
                key={step.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                className="group relative text-right overflow-hidden transition-all duration-500"
                style={{
                  minHeight: '340px',
                  borderRadius: '24px',
                  background: isActive ? '#0A1F44' : '#fff',
                  border: isActive
                    ? `2px solid ${step.accent}`
                    : '1px solid rgba(30,99,214,0.1)',
                  boxShadow: isActive
                    ? `0 20px 60px -16px ${step.accent}40`
                    : '0 4px 20px -8px rgba(10,31,68,0.08)',
                }}
              >
                {/* Image (revealed when active) */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: isActive ? 1 : 0, borderRadius: '22px', overflow: 'hidden' }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(37,47,56,0.95) 40%, rgba(37,47,56,0.6) 100%)' }}
                  />
                </div>

                {/* Content */}
                <div className="relative p-7 flex flex-col h-full justify-between" style={{ minHeight: '340px' }}>
                  <div>
                    <div
                      className="font-black text-6xl md:text-7xl leading-none mb-3 transition-colors"
                      style={{ color: isActive ? step.accent : 'rgba(30,99,214,0.2)' }}
                    >
                      {step.n}
                    </div>
                    <step.icon
                      className="w-7 h-7 mb-4 transition-colors"
                      strokeWidth={1.8}
                      style={{ color: isActive ? '#fff' : step.accent }}
                    />
                  </div>

                  <div>
                    <h3
                      className="font-bold text-xl mb-2 transition-colors"
                      style={{ color: isActive ? '#fff' : '#0A1F44' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed transition-colors"
                      style={{ color: isActive ? 'rgba(255,255,255,0.75)' : '#6B7C95' }}
                    >
                      {step.desc}
                    </p>

                    <div
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                      style={{ color: isActive ? step.accent : '#1E63D6' }}
                    >
                      <span>קרא עוד</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 relative overflow-hidden text-center"
          style={{
            background: '#1E63D6',
            borderRadius: '24px',
            padding: '48px 40px',
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative">
            <h3
              className="font-black text-white mb-3"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: '1', fontFamily: 'Heebo, system-ui' }}
            >
              START NOW
            </h3>
            <p className="text-white/75 text-xl md:text-2xl mb-8">
              היום. בחינם. בלי כרטיס אשראי.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <a
                href="#pricing"
                className="font-bold px-8 py-3.5 inline-flex items-center gap-2 transition-all"
                style={{ background: '#0A1F44', color: '#fff', borderRadius: '100px' }}
              >
                התחל עכשיו
                <ChevronLeft className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/972500000000"
                className="font-semibold underline underline-offset-4 transition-colors"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                דבר איתנו ב-WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


