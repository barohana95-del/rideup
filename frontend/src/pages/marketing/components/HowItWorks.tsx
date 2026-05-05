import { motion } from 'motion/react';
import { LogIn, Palette, Send, BarChart3 } from 'lucide-react';

const steps = [
  {
    n: '01',
    title: 'התחבר בגוגל',
    desc: 'בלי הרשמה ארוכה, בלי סיסמאות. התחברת — אתה בפנים.',
    icon: LogIn,
    accent: 'text-coral',
  },
  {
    n: '02',
    title: 'עצב את האתר',
    desc: 'בחר אחד מ-4 עיצובים, התאם צבעים, העלה לוגו. תוצאה תוך דקות.',
    icon: Palette,
    accent: 'text-pink',
  },
  {
    n: '03',
    title: 'הזמן אורחים',
    desc: 'לינק קצר ב-WhatsApp. אורחים נרשמים, ערים מתמלאות.',
    icon: Send,
    accent: 'text-gold',
  },
  {
    n: '04',
    title: 'נהל במקום אחד',
    desc: 'רשימה מסודרת, ייצוא Excel לנהג, תכנון אוטובוסים אוטומטי.',
    icon: BarChart3,
    accent: 'text-mint-glow',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-32 bg-sand text-charcoal relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-toffee/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pine/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <p className="text-toffee font-semibold text-sm tracking-wider uppercase mb-3">
            ─── איך זה עובד? ───
          </p>
          <h2 className="display text-4xl md:text-6xl text-pine">
            4 שלבים. <span className="font-serif italic font-medium text-toffee">5 דקות.</span>
            <br />
            אתר מוכן.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative bg-cream rounded-3xl p-7 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-pine/10 border border-toffee/10"
            >
              {/* Number */}
              <div className="display text-7xl md:text-8xl text-toffee/20 leading-none mb-2 group-hover:text-toffee/40 transition-colors">
                {step.n}
              </div>

              {/* Icon */}
              <div className="mb-4">
                <step.icon className={`w-8 h-8 ${step.accent}`} strokeWidth={1.8} />
              </div>

              {/* Title */}
              <h3 className="display text-2xl text-pine mb-3">{step.title}</h3>
              {/* Description */}
              <p className="text-charcoal/70 leading-relaxed">{step.desc}</p>

              {/* Arrow on hover */}
              <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-pine text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                ←
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
