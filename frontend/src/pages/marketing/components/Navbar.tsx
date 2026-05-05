import './Navbar.css'
import { useState, useEffect } from 'react'

const ArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M16.8065 5.82872C14.3962 5.82872 12.1995 3.54151 12.1995 1.02981V0L10.2223 0V1.02981C10.2223 2.85669 10.9914 4.57028 12.1985 5.82872L0 5.82872L0 7.88833L12.1985 7.88833C10.9914 9.14676 10.2223 10.8604 10.2223 12.6872V13.717H12.1995V12.6872C12.1995 10.1755 14.3962 7.88833 16.8065 7.88833H17.7951V5.82872H16.8065Z"/>
  </svg>
)

const navLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'איך זה עובד', href: '#services' },
  { label: 'פיצ׳רים', href: '#about' },
  { label: 'עיצובים', href: '#projects' },
  { label: 'מחירים', href: '#pricing' },
  { label: 'שאלות', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <a href="#hero" className="navbar__logo">
          <img src="/images/logo.png" alt="RideUp" className="h-8" />
        </a>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
          ))}
        </nav>

        {/* CTA */}
        <a href="/onboarding" className="btn btn-primary navbar__cta">
          התחברות / הרשמה
          <ArrowSvg />
        </a>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="תפריט"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="/onboarding" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
          התחברות <ArrowSvg />
        </a>
      </div>
    </header>
  )
}

