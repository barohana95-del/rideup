import './Testimonials.css'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote: '"ריד-אפ הצילה לנו את החתונה! תוך 10 דקות הקמנו אתר והאורחים פשוט נרשמו. הכל עבד חלק."',
    author: 'מיכל ורועי',
    role: 'זוג נשוי טרי',
  },
  {
    id: 2,
    quote: '"בתור מפיקת אירועים, זה הכלי שחיכיתי לו. שקט נפשי מלא בכל מה שקשור להסעות."',
    author: 'ליאת כהן',
    role: 'מפיקת אירועי יוקרה',
  },
  {
    id: 3,
    quote: '"המערכת הכי נוחה שיצא לי לעבוד איתה. הכל אוטומטי, האורחים קיבלו תזכורות ב-WhatsApp."',
    author: 'דניאל לוי',
    role: 'מארגן כנסים',
  },
  {
    id: 4,
    quote: '"דיוק של 100% בנתונים. לא היה אורח אחד שפספס את ההסעה. פשוט גאוני."',
    author: 'יוסי חדד',
    role: 'מנהל לוגיסטיקה',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-v2 section--wrapped">
      <div className="container">
        <div className="testimonials-v2__header">
          <span className="eyebrow eyebrow--white">מה לקוחות אומרים</span>
          <h2 className="section-title section-title--white">מפיקים וזוגות שכבר עברו ל-RideUp</h2>
        </div>
      </div>

      <div className="testimonials-v2__marquee">
        <motion.div 
          className="testimonials-v2__track"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testi-pill">
              <div className="testi-pill__stars">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="#C6FF33" stroke="#C6FF33" />)}
              </div>
              <p className="testi-pill__quote">{t.quote}</p>
              <div className="testi-pill__author">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
