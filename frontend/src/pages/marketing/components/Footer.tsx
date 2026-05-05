import './Footer.css'
import { motion } from 'framer-motion'

const marqueeItems = [
  'ניהול הסעות חכם',
  'אתרי RSVP מעוצבים',
  'אוטומציה מלאה',
  'דוחות בזמן אמת',
  'תמיכה ב-WhatsApp',
]

const footerLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'פיצ׳רים', href: '#about' },
  { label: 'עיצובים', href: '#projects' },
  { label: 'מחירים', href: '#pricing' },
  { label: 'שאלות נפוצות', href: '#faq' },
]

export default function Footer() {
  return (
    <footer className="footer">
      {/* Marquee strip */}
      <div className="footer__marquee">
        <motion.div 
          className="marquee-track"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="footer__marquee-item">
              <span className="footer__marquee-star">✦</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        <div className="container footer__grid">
          {/* Col 1: Logo + hours */}
          <div className="footer__col">
            <div className="footer__logo">
              <img src="/images/logo.png" alt="RideUp" className="h-8 mb-4" />
            </div>
            <h4 className="footer__col-title">שעות פעילות:</h4>
            <div className="footer__hours">
              <div>
                <span>ראשון - חמישי:</span>
                <span>09:00 - 18:00</span>
              </div>
              <div>
                <span>שישי:</span>
                <span>09:00 - 13:00</span>
              </div>
            </div>
          </div>

          {/* Col 2: Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">צרו קשר</h4>
            <p className="footer__address">הברזל 1, תל אביב</p>
            <a href="tel:0501234567" className="footer__contact-link">
              <i className="fas fa-phone" />
              <div>
                <span>טלפון:</span>
                <strong>050-123-4567</strong>
              </div>
            </a>
            <a href="mailto:info@rideup.co.il" className="footer__contact-link">
              <i className="fas fa-envelope" />
              <div>
                <span>אימייל:</span>
                <strong>info@rideup.co.il</strong>
              </div>
            </a>
          </div>

          {/* Col 3: Newsletter */}
          <div className="footer__col">
            <h4 className="footer__col-title">הירשמו לעדכונים</h4>
            <p className="footer__newsletter-desc">קבלו טיפים לניהול לוגיסטי חכם ועדכונים על פיצ׳רים חדשים.</p>
            <form className="footer__form" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="כתובת אימייל*"
                className="footer__input"
              />
              <button type="submit" className="footer__submit">הרשמה</button>
            </form>
          </div>

          {/* Col 4: Navigation + Social */}
          <div className="footer__col">
            <h4 className="footer__col-title">עקבו אחרינו:</h4>
            <div className="footer__social">
              {['fab fa-facebook-f', 'fab fa-linkedin-in', 'fab fa-instagram'].map(ic => (
                <a key={ic} href="#" className="footer__social-link" aria-label={ic}>
                  <i className={ic} />
                </a>
              ))}
            </div>
            <nav className="footer__nav">
              {footerLinks.map(l => (
                <a key={l.label} href={l.href} className="footer__nav-link">{l.label}</a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2026 כל הזכויות שמורות ל-RideUp.</p>
          <p>הפתרון החכם לניהול הסעות לאירועים</p>
        </div>
      </div>
    </footer>
  )
}

