import './ScrollBus.css'
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollBus() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const scrollVelocity = useVelocity(scrollYProgress)

  // Smooth scroll progress for the bus movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  })

  // Dynamic tilt based on scroll velocity (leaning into the speed)
  const tilt = useTransform(scrollVelocity, [-1, 1], [-15, 15])
  const skew = useTransform(scrollVelocity, [-1, 1], [-5, 5])

  return (
    <div className="scroll-bus-container" ref={containerRef}>
      {/* Architectural Winding Path */}
      <svg className="scroll-path-svg" viewBox="0 0 100 1000" preserveAspectRatio="none">
        <motion.path
          d="M 80 0 Q 95 150 80 300 T 80 600 Q 65 800 80 1000"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0" />
            <stop offset="5%" stopColor="var(--color-blue)" stopOpacity="0.3" />
            <stop offset="95%" stopColor="var(--color-blue)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* High-Fidelity Bus Entity */}
      <BusEntity progress={smoothProgress} tilt={tilt} skew={skew} />
    </div>
  )
}

function BusEntity({ progress, tilt, skew }: { progress: any, tilt: any, skew: any }) {
  // Map progress to path percentage (0-100)
  // We use CSS offset-path for the actual movement
  const pathOffset = useTransform(progress, [0, 1], ["0%", "100%"])

  return (
    <motion.div 
      className="bus-entity"
      style={{ 
        offsetPath: `path("M 80 0 Q 95 150 80 300 T 80 600 Q 65 800 80 1000")`,
        offsetDistance: pathOffset,
        rotate: tilt,
        skewX: skew
      }}
    >
      <div className="bus-visual">
        {/* SVG Bus with High Detail */}
        <svg viewBox="0 0 120 60" className="bus-svg">
          {/* Main Body */}
          <rect x="5" y="10" width="110" height="40" rx="12" className="bus-body" />
          {/* Windows */}
          <rect x="15" y="15" width="20" height="15" rx="4" className="bus-window" />
          <rect x="40" y="15" width="20" height="15" rx="4" className="bus-window" />
          <rect x="65" y="15" width="20" height="15" rx="4" className="bus-window" />
          <rect x="90" y="15" width="15" height="15" rx="4" className="bus-window" />
          {/* Lights */}
          <circle cx="112" cy="40" r="4" className="bus-light-front" />
          <rect x="5" y="35" width="4" height="10" rx="1" className="bus-light-back" />
          {/* Branding */}
          <text x="60" y="42" textAnchor="middle" className="bus-branding">RIDEUP</text>
        </svg>

        {/* Dynamic Effects */}
        <div className="bus-shadow" />
        <div className="bus-engine-glow" />
        <motion.div 
          className="bus-headlight-beam" 
          style={{ opacity: useTransform(progress, [0, 0.1], [0, 1]) }}
        />
      </div>
    </motion.div>
  )
}
