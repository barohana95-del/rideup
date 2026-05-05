import './MarqueeBanner.css'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const phrases = [
  'תמיכה ב-WhatsApp',
  'דוחות בזמן אמת',
  'אוטומציה מלאה',
  'אתרי RSVP מעוצבים',
  'ניהול הסעות חכם',
  'דוחות נהג אוטומטיים',
  'חווית משתמש פרימיום'
]

export default function MarqueeBanner() {
  return (
    <section className="marquee-banner">
      <div className="marquee-banner__container">
        <motion.div 
          className="marquee-track"
          animate={{ x: [0, -1200] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[...phrases, ...phrases, ...phrases].map((text, idx) => (
            <div key={idx} className="marquee-item marquee-item--small">
              <Sparkles size={12} className="diamond" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
