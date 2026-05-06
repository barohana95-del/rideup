import './Simulation.css'
import { motion } from 'framer-motion'
import { Play, LayoutDashboard, Smartphone, Users } from 'lucide-react'

export default function Simulation() {
  return (
    <section id="simulation" className="simulation-teaser section--wrapped overflow-hidden">
      <div className="container">
        <div className="simulation-teaser__layout">
          <div className="simulation-teaser__content">
            <span className="eyebrow eyebrow--blue mb-4">המערכת בפעולה</span>
            <h2 className="section-title section-title--white mb-6">חווית ניהול <br />מחוץ למסך</h2>
            <p className="section-desc section-desc--white mb-8">
              אל תסתפקו במילים. צפו איך RideUp הופכת לוגיסטיקה מורכבת לתהליך פשוט, חכם ואוטומטי - מהקמת האירוע ועד לאישורי ההגעה.
            </p>
            
            <div className="teaser-steps mb-10">
              <div className="t-step">
                <div className="t-icon"><Smartphone size={20} /></div>
                <span>אישורי הגעה במובייל</span>
              </div>
              <div className="t-step">
                <div className="t-icon"><LayoutDashboard size={20} /></div>
                <span>דאשבורד ניהול חי</span>
              </div>
              <div className="t-step">
                <div className="t-icon"><Users size={20} /></div>
                <span>אוטומציה מלאה לאורחים</span>
              </div>
            </div>

            <a href="/experience" className="btn btn-primary btn-lg group">
              צפו בהדמיה המלאה
              <Play className="ml-2 group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
            </a>
          </div>

          <div className="simulation-teaser__visual">
            <motion.div 
              className="teaser-frame"
              initial={{ rotateY: 20, rotateX: 10, scale: 0.9 }}
              whileInView={{ rotateY: -10, rotateX: 5, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Preview" />
              <div className="overlay-glass" />
              <motion.div 
                className="floating-notification"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="dot" />
                <span>אישור הגעה חדש: דניאל כהן</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
