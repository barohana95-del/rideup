import './Services.css'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Smartphone, MapPin, Truck, Bell } from 'lucide-react'

const steps = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'הרשמה קלה לאורחים',
    desc: 'האורחים נרשמים לאתר ה-RSVP האישי שלכם, בוחרים תחנת איסוף ומקבלים אישור מיידי.',
    color: '#7D39EB'
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'ניהול תחנות חכם',
    desc: 'מערכת ה-AI שלנו מחשבת את המסלול האופטימלי ומשבצת אוטובוסים לפי כמות הנרשמים.',
    color: '#C6FF33'
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'דוחות נהג בזמן אמת',
    desc: 'ביום האירוע, כל נהג מקבל קישור דינמי עם רשימת הנוסעים המדויקת שלו לכל תחנה.',
    color: '#7D39EB'
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: 'עדכוני WhatsApp',
    desc: 'האורחים מקבלים תזכורות אוטומטיות עם מיקום האוטובוס בזמן אמת ביום האירוע.',
    color: '#C6FF33'
  }
]

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.8, 1]))
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <section id="services" className="services-v2 section--wrapped" ref={containerRef}>
      {/* Ambient Orbs */}
      <motion.div 
        className="bg-orb bg-orb--purple"
        style={{ top: '-10%', left: '-10%' }}
        animate={{ y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="bg-orb bg-orb--lime"
        style={{ bottom: '-10%', right: '-10%' }}
        animate={{ y: [0, -50, 0], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="container">
        <motion.div style={{ opacity, scale }} className="services-v2__header">
          <span className="eyebrow eyebrow--white">איך זה עובד?</span>
          <h2 className="section-title section-title--white">התהליך שחוסך לכם שעות של עבודה</h2>
          <p className="section-desc section-desc--white">מערכת הניהול שלנו מלווה אתכם ואת האורחים שלכם מהשלב הראשון ועד שהאחרון חוזר הביתה.</p>
        </motion.div>

        <div className="services-v2__steps">
          {steps.map((step, idx) => (
            <StepItem key={idx} step={step} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepItem({ step, index }: { step: any, index: number }) {
  return (
    <motion.div 
      className="step-card"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="step-card__visual" style={{ borderColor: step.color }}>
        <motion.div 
          className="step-card__icon"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {step.icon}
        </motion.div>
        <div className="step-card__number">{index + 1}</div>
      </div>
      <div className="step-card__content">
        <h3 className="step-card__title">{step.title}</h3>
        <p className="step-card__desc">{step.desc}</p>
      </div>
    </motion.div>
  )
}
