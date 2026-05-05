import './StatsBar.css'
import { motion } from 'framer-motion'

const stats = [
  { num: '100%', label: 'אוטומציה מלאה', icon: '⚡' },
  { num: '24/7', label: 'זמינות מערכת', icon: '🕒' },
  { num: '500+', label: 'אירועים מנוהלים', icon: '🎉' },
  { num: '99.9%', label: 'אמינות מובטחת', icon: '🛡️' },
]

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <motion.div 
        className="container stats-bar__inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {stats.map(s => (
          <motion.div 
            key={s.label} 
            className="stats-bar__item"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
            }}
          >
            <span className="stats-bar__icon">{s.icon}</span>
            <div>
              <div className="stats-bar__num">{s.num}</div>
              <div className="stats-bar__label">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

