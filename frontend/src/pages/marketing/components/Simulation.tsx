import './Simulation.css'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Bus, 
  MapPin, 
  CheckCircle2, 
  Navigation,
  MousePointer2
} from 'lucide-react'

export default function Simulation() {
  const [scenario, setScenario] = useState('idle')
  const [stats, setStats] = useState({ guests: 172, buses: 3, capacity: 78 })
  const [registrations, setRegistrations] = useState([
    { name: 'דנה לוי', time: '12:30' },
    { name: 'אבי כהן', time: '12:28' }
  ])

  // Virtual Cursor Controls
  const cursorControls = useAnimation()

  useEffect(() => {
    async function runScenario() {
      // 1. Start at Login
      setScenario('login')
      await new Promise(r => setTimeout(r, 1000))
      
      // Move cursor to Login Button
      await cursorControls.start({ x: 200, y: 300, opacity: 1 })
      await new Promise(r => setTimeout(r, 500))
      
      // Click & Enter Dashboard
      setScenario('dashboard')
      await cursorControls.start({ x: -100, y: 100 }) // Move to sidebar
      await new Promise(r => setTimeout(r, 1000))

      // 2. Simulate User Action: Add Registration
      await cursorControls.start({ x: 400, y: 400 }) // Move to center
      await new Promise(r => setTimeout(r, 1000))
      
      // New guest arrives
      setRegistrations(prev => [{ name: 'מיכל ישראלי', time: '12:32' }, ...prev])
      setStats(prev => ({ ...prev, guests: prev.guests + 1, capacity: prev.capacity + 2 }))
      
      await new Promise(r => setTimeout(r, 2000))

      // 3. Move to Map
      await cursorControls.start({ x: -300, y: 250 }) // Click Map Icon
      setScenario('map')
      
      await new Promise(r => setTimeout(r, 3000))
      
      // Restart
      runScenario()
    }

    runScenario()
  }, [cursorControls])

  return (
    <section className="simulation-v3 section--wrapped">
      <div className="container simulation-v3__container">
        <div className="simulation-v3__header">
          <span className="eyebrow eyebrow--white">המערכת בפעולה</span>
          <h2 className="section-title section-title--white">חווית ניהול קולנועית</h2>
          <p className="section-desc section-desc--white">צפו איך RideUp מנהלת עבורכם את כל הלוגיסטיקה בזמן אמת, מאחורי הקלעים.</p>
          
          <div className="simulation-v3__features">
            <div className={`sim-feature ${scenario === 'login' ? 'active' : ''}`}>
              <div className="dot" />
              <span>זיהוי חכם</span>
            </div>
            <div className={`sim-feature ${scenario === 'dashboard' ? 'active' : ''}`}>
              <div className="dot" />
              <span>אוטומציה בשידור חי</span>
            </div>
            <div className={`sim-feature ${scenario === 'map' ? 'active' : ''}`}>
              <div className="dot" />
              <span>מעקב לוגיסטי חכם</span>
            </div>
          </div>
        </div>

        <div className="simulation-v3__screen-wrap">
          <div className="premium-browser">
            {/* Header */}
            <div className="browser-head">
              <div className="controls"><span /><span /><span /></div>
              <div className="url-bar">app.rideup.io/event/wedding-2026</div>
            </div>

            {/* Virtual Cursor */}
            <motion.div 
              className="virtual-cursor"
              animate={cursorControls}
              initial={{ opacity: 0 }}
            >
              <MousePointer2 size={24} fill="var(--color-blue)" />
              <div className="cursor-click-wave" />
            </motion.div>

            <div className="browser-body">
              <AnimatePresence mode="wait">
                {scenario === 'login' && <LoginView />}
                {scenario === 'dashboard' && <DashboardView stats={stats} registrations={registrations} />}
                {scenario === 'map' && <MapView />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LoginView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="view-login"
    >
      <div className="login-box">
        <img src="/images/logo.png" alt="RideUp" className="mb-6 h-10 filter-invert" />
        <div className="mock-google-full">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" />
          התחברות עם Google
        </div>
      </div>
    </motion.div>
  )
}

function DashboardView({ stats, registrations }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="view-dashboard"
    >
      <aside className="view-sidebar">
        <div className="item active"><LayoutDashboard size={20} /></div>
        <div className="item"><Users size={20} /></div>
        <div className="item"><Bus size={20} /></div>
        <div className="item"><Navigation size={20} /></div>
      </aside>
      <main className="view-main">
        <div className="view-stats">
          <div className="v-stat">
            <span className="label">אורחים רשומים</span>
            <motion.strong key={stats.guests} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
              {stats.guests}
            </motion.strong>
          </div>
          <div className="v-stat">
            <span className="label">אוטובוסים</span>
            <strong>{stats.buses}</strong>
          </div>
          <div className="v-stat">
            <span className="label">תפוסה</span>
            <motion.strong key={stats.capacity} initial={{ color: '#C6FF33' }} animate={{ color: '#0A1F44' }}>
              {stats.capacity}%
            </motion.strong>
          </div>
        </div>
        <div className="view-list">
          <h5>עדכונים אחרונים</h5>
          <div className="list-container">
            {registrations.map((r: any, i: number) => (
              <motion.div 
                key={r.name + i} 
                initial={{ x: 20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                className="list-item"
              >
                <div className="avatar-small" />
                <div className="info">
                  <strong>{r.name}</strong>
                  <span>נרשם להסעה | {r.time}</span>
                </div>
                <CheckCircle2 size={16} color="#22C55E" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  )
}

function MapView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="view-map"
    >
      <div className="map-canvas">
        <div className="road-path" />
        <motion.div 
          className="moving-bus"
          animate={{ x: [0, 400], y: [0, 100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="bus-glow" />
          <i className="fas fa-bus" />
          <div className="bus-label">קו 1 - תל אביב</div>
        </motion.div>
        <div className="map-marker" style={{ top: '20%', left: '20%' }} />
        <div className="map-marker" style={{ top: '60%', left: '80%' }} />
      </div>
      <div className="map-info-panel">
        <div className="panel-row">
          <div className="indicator active" />
          <span>אוטובוס בדרך לתחנה הבאה</span>
        </div>
      </div>
    </motion.div>
  )
}
