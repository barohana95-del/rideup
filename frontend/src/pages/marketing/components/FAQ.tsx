import './FAQ.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.8065 5.82872C14.3962 5.82872 12.1995 3.54151 12.1995 1.02981V0L10.2223 0V1.02981C10.2223 2.85669 10.9914 4.57028 12.1985 5.82872L0 5.82872L0 7.88833L12.1985 7.88833C10.9914 9.14676 10.2223 10.8604 10.2223 12.6872V13.717H12.1995V12.6872C12.1995 10.1755 14.3962 7.88833 16.8065 7.88833H17.7951V5.82872H16.8065Z"/>
  </svg>
)

const faqs = [
  {
    q: 'איך מתחילים לעבוד עם המערכת?',
    a: 'פשוט לוחצים על "התחל עכשיו", ממלאים את פרטי האירוע (תאריך, מיקום), בוחרים את העיצוב המועדף עליכם והאתר שלכם באוויר תוך פחות מ-10 דקות.'
  },
  {
    q: 'האם האורחים צריכים להוריד אפליקציה?',
    a: 'ממש לא. האורחים מקבלים קישור לאתר ה-RSVP האישי שלכם שנפתח בקלות מכל דפדפן בטלפון הנייד, ללא צורך בהתקנה מוקדמת.'
  },
  {
    q: 'איך הנהג מקבל את רשימת הנוסעים?',
    a: 'ביום האירוע, המערכת מפיקה דוח PDF מסודר הכולל את כל שמות האורחים, תחנות האיסוף ומספרי הטלפון שלהם. הדוח נשלח אליכם ולנהג באופן אוטומטי.'
  },
  {
    q: 'האם המערכת תומכת בשליחת הודעות WhatsApp?',
    a: 'כן! המערכת כוללת אפשרות לשליחת הודעות אישור הרשמה ותזכורות אוטומטיות ביום האירוע ישירות ל-WhatsApp של האורחים שלכם.'
  },
  {
    q: 'האם ניתן לבטל את המנוי בכל עת?',
    a: 'בוודאי. המודל שלנו גמיש - ניתן לשלם על אירוע בודד או לבחור במנוי חודשי למפיקים שניתן להפסיק בכל שלב ללא התחייבות.'
  },
]

function AccordionItem({ q, a, open, onToggle }: any) {
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-item__trigger" onClick={onToggle}>
        <span className="faq-item__q">{q}</span>
        <span className="faq-item__icon">
          <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="faq-item__body"
          >
            <p style={{ paddingBottom: '1.25rem', paddingTop: '0.5rem' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="faq section section--wrapped">
      <div className="container faq__container">
        {/* Left */}
        <motion.div 
          className="faq__info"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="eyebrow">שאלות נפוצות</span>
          <h2 className="section-title">
            יש לכם שאלות? אנחנו כאן עם כל התשובות
          </h2>
          <p className="section-desc">
            ריכזנו עבורכם את כל המידע שצריך לדעת כדי להתחיל לנהל את הלוגיסטיקה של האירוע שלכם בצורה חכמה ומקצועית.
          </p>
          <div className="faq__contact-box">
            <div>
              <i className="fas fa-phone" style={{ color: 'var(--color-blue)' }} />
            </div>
            <div>
              <h4>צריכים עזרה אישית?</h4>
              <p>050-123-4567</p>
            </div>
          </div>
          <a href="/onboarding" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            התחילו עכשיו <ArrowSvg />
          </a>
        </motion.div>

        {/* Accordion */}
        <motion.div 
          className="faq__accordion"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              q={f.q}
              a={f.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

