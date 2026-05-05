import './Suppliers.css'
import { motion } from 'framer-motion'

const suppliers = [
  { name: 'BusCo Global', type: 'הסעות VIP', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-1.svg' },
  { name: 'MetroShuttle', type: 'שירותי מיניבוסים', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-2.svg' },
  { name: 'Royal Travel', type: 'אוטובוסים תיירותיים', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-3.svg' },
  { name: 'CityExpress', type: 'קווי איסוף', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-4.svg' },
  { name: 'LuxuryBus', type: 'הסעות פרמיום', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-5.svg' },
  { name: 'SwiftDrive', type: 'ניהול ציי רכב', logo: 'https://demo.awaikenthemes.com/renovex/wp-content/uploads/2025/11/company-logo-6.svg' },
]

export default function Suppliers() {
  return (
    <section className="suppliers section section--wrapped" style={{ background: 'var(--color-pale)' }}>
      <div className="container">
        <div className="suppliers__header">
          <span className="eyebrow">השותפים שלנו</span>
          <h2 className="section-title">חברות ההסעה המובילות כבר כאן</h2>
          <p className="section-desc">אנחנו עובדים עם הספקים הטובים ביותר בישראל כדי להבטיח לכם שירות ללא פשרות.</p>
        </div>

        <div className="suppliers__marquee">
          <motion.div 
            className="suppliers__track"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...suppliers, ...suppliers].map((s, idx) => (
              <div key={idx} className="supplier-card">
                <img src={s.logo} alt={s.name} />
                <div className="supplier-card__info">
                  <strong>{s.name}</strong>
                  <span>{s.type}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
