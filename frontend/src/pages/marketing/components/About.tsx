import './About.css'
import { motion } from 'framer-motion'
import { Lightbulb, Zap, Shield, CheckCircle2 } from 'lucide-react'

const features = [
  {
    icon: <Lightbulb className="w-6 h-6 text-[#7D39EB]" />,
    title: 'ממשק חכם ופשוט',
    desc: 'ניהול אינטואיטיבי של כל שלבי הרישום והלוגיסטיקה, ללא צורך בידע קודם.'
  },
  {
    icon: <Zap className="w-6 h-6 text-[#C6FF33]" />,
    title: 'אוטומציה מלאה',
    desc: 'המערכת עושה את העבודה הקשה בשבילך, מהרשמה מהירה ועד הפקת דוח נסיעה לנהג.'
  },
  {
    icon: <Shield className="w-6 h-6 text-[#7D39EB]" />,
    title: 'אבטחה ושקט נפשי',
    desc: 'המידע של האורחים שלכם מאובטח ברמה הגבוהה ביותר, עם גיבויים בזמן אמת.'
  }
]

export default function About() {
  return (
    <section id="about" className="about-v2 section">
      <div className="container about-v2__grid">
        {/* Left: Content */}
        <div className="about-v2__content">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="eyebrow"
          >
            למה RideUp?
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            מהפכה בניהול הסעות לאירועים — <br />
            <span className="text-gradient">כל האוטומציה במקום אחד</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-desc"
          >
            אנחנו משלבים עיצוב חכם, הנדסה מתקדמת וחווית משתמש ללא פשרות כדי להפוך את ניהול הלוגיסטיקה של האירוע שלך לפשוט ונעים.
          </motion.p>

          <div className="about-v2__features">
            {features.map((f, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="about-v2__feature"
              >
                <div className="about-v2__icon-wrap">
                  {f.icon}
                </div>
                <div>
                  <h4 className="about-v2__feature-title">{f.title}</h4>
                  <p className="about-v2__feature-desc">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="about-v2__checklist"
          >
            <div className="check-item"><CheckCircle2 size={18} /> חיסכון של 80% בזמן הניהול</div>
            <div className="check-item"><CheckCircle2 size={18} /> מניעת טעויות אנוש ב-100%</div>
            <div className="check-item"><CheckCircle2 size={18} /> חווית אורח יוקרתית</div>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="about-v2__visual-raw"
        >
          <img src="/images/HeroMockup.png" alt="RideUp Platform Mockup" />
        </motion.div>
      </div>
    </section>
  )
}
