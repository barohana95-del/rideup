import './CTA.css'
import { motion } from 'framer-motion'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path d="M11 1L17 7M17 7L11 13M17 7H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function CTA() {
  return (
    <section id="contact" className="cta section--wrapped dark-section">
      <div className="cta__bg">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Luxury transportation"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000')}
        />
      </div>
      <div className="cta__overlay" />
      <div className="container cta__container">
        <motion.div 
          className="cta__content"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow eyebrow--white">דברו איתנו</span>
          <h2 className="section-title section-title--white">דברו איתנו עוד היום</h2>
          <p className="section-desc section-desc--white">
            הצטרפו למהפכת ההיסעים החכמה. השאירו פרטים ונתחיל לתכנן את האירוע הבא שלכם.
          </p>
          
          <div className="cta__info">
            <div className="cta__info-item">
              <strong>שיחת ייעוץ חינם</strong>
              <span>נציג שלנו יחזור אליכם תוך פחות מ-24 שעות</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="cta__form-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="contact-form">
            <h3 className="form-title">השאירו פרטים ונחזור אליכם</h3>
            <form className="form-grid">
              <div className="form-group">
                <label>שם מלא</label>
                <input type="text" placeholder="ישראל ישראלי" />
              </div>
              <div className="form-group">
                <label>טלפון</label>
                <input type="tel" placeholder="050-0000000" />
              </div>
              <div className="form-group full">
                <label>אימייל</label>
                <input type="email" placeholder="name@example.com" />
              </div>
              <div className="form-group full">
                <label>סוג האירוע / הודעה</label>
                <textarea placeholder="ספרו לנו קצת על האירוע שלכם..." rows={3}></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full form-submit">
                שליחת פנייה
                <ArrowSvg />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
