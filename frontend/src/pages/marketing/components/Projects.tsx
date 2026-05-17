import './Projects.css'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { THEMES, THEME_KEYS, type ThemeKey } from '../../../lib/themes'

// =====================================================================
// Marketing "designs" section — renders the 5 live themes as mini
// previews so visitors see the actual look (not stock photos).
// Each card mimics the hero region of the theme's public RSVP page in
// miniature: hero title, accent ornament, date row, and CTA button —
// using the same fonts and palette as the production renderer.
// =====================================================================

export default function Projects() {
  // Duplicate the list so the marquee loop is seamless.
  const loop: ThemeKey[] = [...THEME_KEYS, ...THEME_KEYS, ...THEME_KEYS];

  return (
    <section id="projects" className="projects-v2 section">
      <div className="container">
        <div className="projects-v2__header">
          <div className="projects-v2__header-left">
            <span className="eyebrow">העיצובים שלנו</span>
            <h2 className="section-title">5 תבניות פרימיום — מוכנות לאירוע שלכם</h2>
          </div>
          <p className="projects-v2__header-desc">
            כל תבנית בנויה במלואה — טיפוגרפיה, פלטה ופרטי עיצוב מותאמים אישית.
            התצוגה למטה משקפת אחד-לאחד את המראה האמיתי של האתר.
          </p>
        </div>
      </div>

      <div className="projects-v2__slider">
        <motion.div
          className="projects-v2__track"
          animate={{ x: [0, -1700] }}
          transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        >
          {loop.map((key, i) => (
            <ThemeCard key={`${key}-${i}`} themeKey={key} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────── */

function ThemeCard({ themeKey }: { themeKey: ThemeKey }) {
  const t = THEMES[themeKey]
  const a = t.palette.accent
  return (
    <a href="/onboarding" className="design-card theme-card" aria-label={`תבנית ${t.label}`}>
      <ThemeMiniPreview themeKey={themeKey} />

      {/* Hover overlay with label + CTA */}
      <div className="theme-card__overlay">
        <div>
          <div className="theme-card__badge" style={{ background: a, color: t.palette.bg }}>
            <Check size={12} />
            <span>{t.vibe}</span>
          </div>
          <h3 className="theme-card__title">{t.label}</h3>
          <p className="theme-card__desc">{t.description}</p>
        </div>
        <span className="theme-card__cta" style={{ color: a }}>
          נסו עכשיו <ArrowRight size={16} />
        </span>
      </div>
    </a>
  )
}

/* Mini-preview per theme — each has its own personality. */
function ThemeMiniPreview({ themeKey }: { themeKey: ThemeKey }) {
  switch (themeKey) {
    case 'elegant':  return <ElegantMini />
    case 'minimal':  return <MinimalMini />
    case 'romantic': return <RomanticMini />
    case 'bold':     return <BoldMini />
    case 'luxe':     return <LuxeMini />
  }
}

/* ── 1. Elegant — black + champagne gold, classic serif ────────────── */
function ElegantMini() {
  const t = THEMES.elegant
  return (
    <div className="mini" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <div className="mini__center">
        <Ornament color={t.palette.accent} />
        <p className="mini__eyebrow" style={{ color: t.palette.accent, fontFamily: t.fonts.display }}>SAVE THE DATE</p>
        <p className="mini__title" style={{ fontFamily: t.fonts.display, color: t.palette.text }}>
          אביב &amp; בר
        </p>
        <Ornament color={t.palette.accent} />
        <p className="mini__meta" style={{ color: t.palette.muted }}>17.09.2026 · תל אביב</p>
        <button className="mini__btn"
                style={{ background: t.palette.accent, color: t.palette.bg, borderRadius: 0, letterSpacing: '0.25em', fontFamily: t.fonts.display }}>
          אישור הגעה
        </button>
      </div>
    </div>
  )
}

/* ── 2. Minimal — white, geometric, split-screen feel ─────────────── */
function MinimalMini() {
  const t = THEMES.minimal
  return (
    <div className="mini mini--split" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <div className="mini__split-img"
           style={{ backgroundImage: `url(${t.defaultCover})` }}>
        <span className="mini__split-imgcaption">17.09.2026</span>
      </div>
      <div className="mini__split-content">
        <p className="mini__eyebrow" style={{ color: t.palette.muted, fontFamily: t.fonts.display, fontWeight: 700 }}>
          RSVP
        </p>
        <p className="mini__title-min" style={{ fontFamily: t.fonts.display }}>אביב &amp; בר</p>
        <p className="mini__meta-min" style={{ color: t.palette.muted }}>תל אביב</p>
        <div className="mini__divider" style={{ background: t.palette.divider }} />
        <button className="mini__btn"
                style={{ background: t.palette.accent, color: '#fff', borderRadius: 6 }}>
          אישור הגעה →
        </button>
      </div>
    </div>
  )
}

/* ── 3. Romantic — blush + sage, script title, floral corners ─────── */
function RomanticMini() {
  const t = THEMES.romantic
  return (
    <div className="mini mini--romantic" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <FloralCorner color={t.palette.accent2} pos="tr" />
      <FloralCorner color={t.palette.accent} pos="bl" />
      <div className="mini__center">
        <p className="mini__eyebrow" style={{ color: t.palette.accent, letterSpacing: '0.25em' }}>◆ הזמנה ◆</p>
        <p className="mini__title-romantic" style={{ fontFamily: t.fonts.display, color: t.palette.accent }}>
          אביב &amp; בר
        </p>
        <div className="mini__heart-row">
          <span className="mini__hairline" style={{ background: t.palette.accent }} />
          <svg width="10" height="10" viewBox="0 0 24 24" fill={t.palette.accent2}>
            <path d="M12 21s-7-4.5-9.5-9.4C.5 7.3 3 3 7 3c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.3 4.5 8.6C19 16.5 12 21 12 21z" />
          </svg>
          <span className="mini__hairline" style={{ background: t.palette.accent }} />
        </div>
        <p className="mini__meta" style={{ color: t.palette.muted }}>17.09.2026 · תל אביב</p>
        <button className="mini__btn"
                style={{
                  background: `linear-gradient(135deg, ${t.palette.accent} 0%, ${t.palette.accent}dd 100%)`,
                  color: '#fff', borderRadius: 999,
                }}>
          אישור הגעה
        </button>
      </div>
    </div>
  )
}

/* ── 4. Bold — vibrant gradient + gradient text + glassmorphism ───── */
function BoldMini() {
  const t = THEMES.bold
  return (
    <div className="mini mini--bold"
         style={{
           background: `radial-gradient(ellipse at top left, ${t.palette.accent2}50 0%, transparent 50%),
                        radial-gradient(ellipse at bottom right, ${t.palette.accent}40 0%, transparent 55%),
                        ${t.palette.bg}`,
           color: t.palette.text, fontFamily: t.fonts.body,
         }}>
      <div className="mini__center">
        <span className="mini__chip"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
          ✨ You're Invited
        </span>
        <p className="mini__title"
           style={{
             fontFamily: t.fonts.display, fontWeight: 700, letterSpacing: '-0.02em',
             background: `linear-gradient(135deg, ${t.palette.accent}, ${t.palette.accent2})`,
             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
           }}>
          אביב &amp; בר
        </p>
        <p className="mini__meta" style={{ color: t.palette.muted }}>17.09.2026 · תל אביב</p>
        <button className="mini__btn"
                style={{
                  background: `linear-gradient(135deg, ${t.palette.accent} 0%, ${t.palette.accent2} 100%)`,
                  color: t.palette.bg, borderRadius: 14, boxShadow: `0 10px 30px -8px ${t.palette.accent}80`,
                }}>
          ✨ אישור הגעה
        </button>
      </div>
    </div>
  )
}

/* ── 5. Luxe — deep wine + filigree + gold ────────────────────────── */
function LuxeMini() {
  const t = THEMES.luxe
  return (
    <div className="mini mini--luxe" style={{ background: t.palette.bg, color: t.palette.text, fontFamily: t.fonts.body }}>
      <DamaskBg color={t.palette.accent} />
      <Corner color={t.palette.accent} pos="tl" />
      <Corner color={t.palette.accent} pos="tr" />
      <Corner color={t.palette.accent} pos="bl" />
      <Corner color={t.palette.accent} pos="br" />
      <div className="mini__center">
        <FiligreeBar color={t.palette.accent} />
        <p className="mini__eyebrow" style={{ color: t.palette.accent, letterSpacing: '0.5em', fontFamily: t.fonts.display }}>
          ◇ INVITATION ◇
        </p>
        <p className="mini__title-luxe" style={{ fontFamily: t.fonts.display, color: t.palette.text }}>
          אביב &amp; בר
        </p>
        <FiligreeBar color={t.palette.accent} />
        <p className="mini__meta" style={{ color: t.palette.muted, fontFamily: t.fonts.display, letterSpacing: '0.1em' }}>
          17 · 09 · 2026 · תל אביב
        </p>
        <button className="mini__btn"
                style={{
                  background: `linear-gradient(135deg, ${t.palette.accent} 0%, ${t.palette.accent2} 50%, ${t.palette.accent} 100%)`,
                  color: t.palette.bg, borderRadius: 0, letterSpacing: '0.3em', fontFamily: t.fonts.display,
                  boxShadow: `0 8px 24px -8px ${t.palette.accent}80`,
                }}>
          R · S · V · P
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────── */
/* Reusable decorations                                                */
/* ─────────────────────────────────────────────────────────────────── */

function Ornament({ color }: { color: string }) {
  return (
    <svg width="100" height="12" viewBox="0 0 100 12" className="mini__ornament" aria-hidden>
      <line x1="0"  y1="6" x2="38" y2="6" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="6" r="2.5" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="50" cy="6" r="0.8" fill={color} />
      <line x1="62" y1="6" x2="100" y2="6" stroke={color} strokeWidth="0.6" />
    </svg>
  )
}

function FloralCorner({ pos, color }: { pos: 'tr' | 'bl'; color: string }) {
  const className = pos === 'tr' ? 'mini__floral mini__floral--tr' : 'mini__floral mini__floral--bl'
  const rotate = pos === 'tr' ? 0 : 180
  return (
    <svg className={className} viewBox="0 0 200 200"
         style={{ transform: `rotate(${rotate}deg)` }} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <path d="M0,40 Q40,30 60,60 T120,80" />
        <path d="M0,80 Q50,70 80,100" />
        <circle cx="60" cy="60" r="6" fill={color} opacity="0.4" />
        <circle cx="120" cy="80" r="4" fill={color} opacity="0.4" />
        <circle cx="80" cy="100" r="3" fill={color} opacity="0.4" />
      </g>
    </svg>
  )
}

function FiligreeBar({ color }: { color: string }) {
  return (
    <svg width="180" height="14" viewBox="0 0 180 14" className="mini__filigree" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="0.7">
        <line x1="0" y1="7" x2="60" y2="7" />
        <path d="M60,7 q5,-6 10,0 q5,6 10,0" />
        <circle cx="90" cy="7" r="3" fill={color} fillOpacity="0.3" />
        <path d="M95,7 q5,-6 10,0 q5,6 10,0" />
        <line x1="120" y1="7" x2="180" y2="7" />
      </g>
    </svg>
  )
}

function Corner({ color, pos }: { color: string; pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[pos]
  return (
    <svg className={`mini__corner mini__corner--${pos}`} viewBox="0 0 30 30"
         style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <g fill="none" stroke={color} strokeWidth="0.9" opacity="0.7">
        <path d="M0,0 L0,14 M0,0 L14,0" />
        <path d="M0,6 q3,-3 7,0 M6,0 q-3,3 0,7" />
        <circle cx="3" cy="3" r="1.3" fill={color} fillOpacity="0.45" />
      </g>
    </svg>
  )
}

function DamaskBg({ color }: { color: string }) {
  const id = 'damaskmini'
  return (
    <svg className="mini__damask" aria-hidden>
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.6" fill={color} />
          <path d="M20,6 Q28,20 20,34 Q12,20 20,6 Z" fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
