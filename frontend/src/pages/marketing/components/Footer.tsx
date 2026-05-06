import './Footer.css'
import { motion } from 'framer-motion'
import { Phone, Mail, Facebook, Linkedin, Instagram, Sparkles } from 'lucide-react'

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
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">תפריט תחתון ומידע ליצירת קשר</h2>
      
      {/* Marquee strip */}
      <div className="footer__marquee" aria-hidden="true">
        <motion.div 
          className="marquee-track"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="footer__marquee-item">
              <Sparkles className="footer__marquee-star" size={16} />
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
            <a href="#hero" className="footer__logo" aria-label="חזרה לראש העמוד">
              <img src="/images/logo.png" alt="RideUp - מערכת ניהול הסעות" className="h-8 mb-4" />
            </a>
            <h3 className="footer__col-title">שעות פעילות:</h3>
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
            <h3 className="footer__col-title">צרו קשר</h3>
            <address className="footer__address-block">
              <p className="footer__address">הברזל 1, תל אביב</p>
              <a href="tel:0501234567" className="footer__contact-link" aria-label="התקשרו אלינו למספר 050-123-4567">
                <span className="footer__icon-wrapper">
                  <Phone size={18} />
                </span>
                <div>
                  <span>טלפון:</span>
                  <strong>050-123-4567</strong>
                </div>
              </a>
              <a href="mailto:info@rideup.co.il" className="footer__contact-link" aria-label="שלחו לנו אימייל לכתובת info@rideup.co.il">
                <span className="footer__icon-wrapper">
                  <Mail size={18} />
                </span>
                <div>
                  <span>אימייל:</span>
                  <strong>info@rideup.co.il</strong>
                </div>
              </a>
            </address>
          </div>

          {/* Col 3: Newsletter */}
          <div className="footer__col">
            <h3 className="footer__col-title">הירשמו לעדכונים</h3>
            <p className="footer__newsletter-desc">קבלו טיפים לניהול לוגיסטי חכם ועדכונים על פיצ׳רים חדשים.</p>
            <form className="footer__form" onSubmit={e => e.preventDefault()} aria-label="הרשמה לניוזלטר">
              <label htmlFor="newsletter-email" className="sr-only">כתובת אימייל</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="כתובת אימייל*"
                className="footer__input"
                required
              />
              <button type="submit" className="footer__submit" aria-label="הרשמה">הרשמה</button>
            </form>
          </div>

          {/* Col 4: Navigation + Social */}
          <div className="footer__col">
            <h3 className="footer__col-title">עקבו אחרינו:</h3>
            <div className="footer__social" aria-label="רשתות חברתיות">
              <a href="#" className="footer__social-link" aria-label="עמוד הפייסבוק שלנו">
                <Facebook size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="עמוד הלינקדאין שלנו">
                <Linkedin size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="עמוד האינסטגרם שלנו">
                <Instagram size={18} />
              </a>
            </div>
            <nav className="footer__nav" aria-label="ניווט תחתון">
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
          <p>© {new Date().getFullYear()} כל הזכויות שמורות ל-RideUp.</p>
          <p>הפתרון החכם לניהול הסעות לאירועים</p>
        </div>
      </div>
    </footer>
  )
}

