import './Hero.css'
import { motion, Variants } from 'framer-motion'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.8065 5.82872C14.3962 5.82872 12.1995 3.54151 12.1995 1.02981V0L10.2223 0V1.02981C10.2223 2.85669 10.9914 4.57028 12.1985 5.82872L0 5.82872L0 7.88833L12.1985 7.88833C10.9914 9.14676 10.2223 10.8604 10.2223 12.6872V13.717H12.1995V12.6872C12.1995 10.1755 14.3962 7.88833 16.8065 7.88833H17.7951V5.82872H16.8065Z"/>
  </svg>
)

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

export default function Hero() {
  return (
    <section className="hero section--wrapped">
      {/* Dynamic Background Elements */}
      <div className="hero__grid" />
      
      <motion.div 
        className="bg-orb bg-orb--purple" 
        style={{ top: '-10%', right: '-10%' }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="bg-orb bg-orb--lime" 
        style={{ bottom: '-20%', left: '10%' }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container hero__container">
        <motion.div 
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={itemVariants} className="eyebrow eyebrow--white">
            ברוכים הבאים ל-RideUp
          </motion.span>
          
          <motion.h1 variants={itemVariants} className="hero__title">
            הופכים כל אירוע <br /> 
            <span style={{ color: 'var(--color-blue-light)' }}>לחוויה לוגיסטית מושלמת</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="hero__desc">
            ניהול הסעות חכם, אוטומטי ומעוצב. מהרשמה מהירה של אורחים ועד דוחות נהגים בזמן אמת - הכל במקום אחד.
          </motion.p>
          
          <motion.div variants={itemVariants} className="hero__actions">
            <a href="/onboarding" className="btn btn-primary">
              התחילו עכשיו חינם
              <ArrowSvg />
            </a>
            <a href="/experience" className="btn btn-outline-white">
              איך זה עובד?
            </a>
          </motion.div>
        </motion.div>

        <motion.img 
          src="/images/bus.png"
          alt="Bus"
          className="hero__bus"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </section>
  )
}
