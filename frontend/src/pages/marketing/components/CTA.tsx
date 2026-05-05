import './CTA.css'
import { motion } from 'framer-motion'
import { MessageSquare, Handshake } from 'lucide-react'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.8065 5.82872C14.3962 5.82872 12.1995 3.54151 12.1995 1.02981V0L10.2223 0V1.02981C10.2223 2.85669 10.9914 4.57028 12.1985 5.82872L0 5.82872L0 7.88833L12.1985 7.88833C10.9914 9.14676 10.2223 10.8604 10.2223 12.6872V13.717H12.1995V12.6872C12.1995 10.1755 14.3962 7.88833 16.8065 7.88833H17.7951V5.82872H16.8065Z"/>
  </svg>
)

export default function CTA() {
  return (
    <section id="contact" className="cta section dark-section section--wrapped">
      <div className="container cta__container">
        <motion.div 
          className="cta__content"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="eyebrow eyebrow--white">דברו איתנו עוד היום</span>
          <h2 className="section-title section-title--white">
            מוכנים להפוך את ניהול האירוע שלכם לקל ופשוט?
          </h2>
          <p className="section-desc section-desc--white">
            הצטרפו למאות מפיקים וזוגות שכבר חסכו זמן וכסף עם RideUp. המערכת שלנו תדאג לכל הלוגיסטיקה, כדי שאתם תוכלו פשוט לחגוג.
          </p>
          <div className="cta__features">
            <div className="cta__feature">
              <div className="cta__feature-icon">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <MessageSquare size={24} color="var(--color-blue)" />
                </motion.div>
              </div>
              <div>
                <h4>תמיכה מהירה ומקצועית לכל שאלה</h4>
              </div>
            </div>
            <div className="cta__feature">
              <div className="cta__feature-icon">
                <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Handshake size={24} color="var(--color-blue)" />
                </motion.div>
              </div>
              <div>
                <h4>מערכת מאובטחת ואמינה ב-100%</h4>
              </div>
            </div>
          </div>
          <div className="cta__actions">
            <a href="/onboarding" className="btn btn-primary">
              התחילו עכשיו בחינם
              <ArrowSvg />
            </a>
          </div>
        </motion.div>
        <motion.div 
          className="cta__image"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring" }}
        >
          <img
            src="/images/cta-image.png"
            alt="RideUp Experience"
          />
        </motion.div>
      </div>
    </section>
  )
}

