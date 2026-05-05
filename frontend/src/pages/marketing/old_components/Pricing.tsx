import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    key: 'trial',
    name: 'נסיון',
    price: 'חינם',
    period: '14 יום',
    desc: "ללא כרטיס אשראי. כל הפיצ'רים פתוחים.",
    features: [
      'עד 100 אורחים',
      'כל 4 העיצובים',
      'אימייל אישור',
      '"Powered by RideUp" בfooter',
    ],
    cta: 'התחל בחינם',
    highlight: false,
  },
  {
    key: 'basic',
    name: 'בסיסי',
    price: '₪149',
    period: 'חד-פעמי',
    desc: 'לאירועים קטנים, חברים ומשפחה.',
    features: [
      'עד 50 אורחים',
      'עיצוב קלאסי בלבד',
      'ייצוא Excel',
      'גישה 60 יום לפני + 14 אחרי',
    ],
    cta: 'בחר חבילה',
    highlight: false,
  },
  {
    key: 'pro',
    name: 'מקצועי',
    price: '₪349',
    period: 'חד-פעמי',
    desc: 'הבחירה של רוב הזוגות.',
    features: [
      'עד 250 אורחים',
      'כל 4 העיצובים',
      'עורך עיצוב (צבעים, לוגו, פונט)',
      'תכנון נסיעה אוטומטי',
      'תזכורת SMS אחת',
      'ייצוא Excel + רשימת נהג',
      'גישה 90 יום לפני + 30 אחרי',
    ],
    cta: 'בחר Pro',
    highlight: true,
    badge: 'הכי פופולרי',
  },
  {
    key: 'premium',
    name: 'פרימיום',
    price: '₪699',
    period: 'חד-פעמי',
    desc: 'אירועים גדולים, ללא פשרות.',
    features: [
      'אורחים ללא הגבלה',
      'כל 4 העיצובים + מותאם',
      'תזכורות SMS + WhatsApp',
      'גישה לספקי הסעות',
      'ייצוא PDF לנהג',
      'תמיכת VIP',
      'גישה 180 יום לפני + 60 אחרי',
    ],
    cta: 'בחר Premium',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#0A1F44' }}>
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.12) 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.1) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            החבילות
          </span>
          <h2 className="display text-4xl md:text-6xl text-white mb-4 reveal-heading">
            בחר חבילה. שלם פעם אחת.{' '}
            <span style={{ color: '#1E63D6' }}>סע.</span>
          </h2>
          <p className="text-lg mt-2 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            תשלום פר-אירוע. בלי מנוי חודשי. הוגן ופשוט.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-cards">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="relative transition-all duration-300"
              style={{
                background: plan.highlight ? '#1E63D6' : 'rgba(255,255,255,0.06)',
                borderRadius: '24px',
                padding: '32px 28px',
                border: plan.highlight
                  ? '2px solid transparent'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: plan.highlight ? '0 20px 60px -16px rgba(30,99,214,0.5)' : 'none',
                transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 right-1/2 translate-x-1/2 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1"
                  style={{ background: '#1E63D6', color: '#0A1F44' }}
                >
                  <Sparkles className="w-3 h-3" />
                  {plan.badge}
                </div>
              )}

              <h3
                className="display text-2xl mb-1"
                style={{ color: plan.highlight ? '#fff' : 'rgba(255,255,255,0.9)' }}
              >
                {plan.name}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: plan.highlight ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)' }}
              >
                {plan.desc}
              </p>

              <div className="mb-7">
                <span
                  className="display text-5xl"
                  style={{ color: plan.highlight ? '#fff' : 'rgba(255,255,255,0.95)' }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-sm mr-2"
                  style={{ color: plan.highlight ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)' }}
                >
                  {plan.period}
                </span>
              </div>

              <button
                className="w-full mb-7 py-3.5 font-bold transition-all"
                style={{
                  borderRadius: '100px',
                  background: plan.highlight ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: plan.highlight ? '#1E63D6' : 'rgba(255,255,255,0.9)',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.2)',
                }}
                onMouseEnter={(e) => {
                  if (plan.highlight) {
                    (e.currentTarget as HTMLElement).style.background = '#EAF1FB';
                  } else {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = plan.highlight ? '#fff' : 'rgba(255,255,255,0.1)';
                }}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: plan.highlight ? '#fff' : '#1E63D6' }}
                    />
                    <span style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)' }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
