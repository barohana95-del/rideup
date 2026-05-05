import './Pricing.css'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Zap, Trophy, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'אירוע בודד',
    price: '199',
    icon: <Zap size={24} className="text-[#7D39EB]" />,
    period: '₪',
    popular: false,
    features: [
      'אתר RSVP אישי ומעוצב',
      'ניהול הסעות מלא',
      'דוח נהג PDF מסודר',
      'תמיכה במייל 24/5',
    ]
  },
  {
    name: 'מפיק אירועים',
    price: '499',
    icon: <Trophy size={24} className="text-[#C6FF33]" />,
    period: '₪',
    popular: true,
    features: [
      'עד 10 אירועים בחודש',
      'ממשק מפיקים ייעודי',
      'תזכורות WhatsApp אוטומטיות',
      'תמיכה טלפונית עדיפה',
      'ניהול ספקים מובנה',
    ]
  },
  {
    name: 'ארגוני / חברות',
    price: '999',
    icon: <Building2 size={24} className="text-[#7D39EB]" />,
    period: '₪',
    popular: false,
    features: [
      'אירועים ללא הגבלה',
      'מיתוג לבן מלא (White Label)',
      'חיבור למערכות פנים ארגוניות',
      'מנהל חשבון אישי צמוד',
    ]
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="pricing-v2 section section--wrapped" style={{ background: 'var(--color-pale)' }}>
      <div className="container">
        <div className="pricing-v2__header">
          <span className="eyebrow">המחירים שלנו</span>
          <h2 className="section-title">פתרונות לוגיסטיים חכמים לכל תקציב</h2>
          <p className="section-desc">הצטרפו למהפכה הדיגיטלית בעולם האירועים ובחרו את המסלול המתאים לכם.</p>
        </div>

        <div className="pricing-v2__grid">
          {plans.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`pricing-card-v2 ${p.popular ? 'popular' : ''}`}
            >
              {p.popular && <div className="popular-badge">הבחירה של המפיקים</div>}
              
              <div className="pricing-card-v2__header">
                <div className="plan-icon">{p.icon}</div>
                <h3 className="plan-name">{p.name}</h3>
                <div className="plan-price">
                  <span className="currency">{p.period}</span>
                  <span className="amount">{p.price}</span>
                </div>
              </div>

              <ul className="plan-features">
                {p.features.map((f, idx) => (
                  <li key={idx}>
                    <Check size={16} className="text-blue" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a href="/onboarding" className={`plan-btn ${p.popular ? 'btn-primary' : 'btn-outline'}`}>
                התחילו עכשיו <ArrowRight size={18} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
