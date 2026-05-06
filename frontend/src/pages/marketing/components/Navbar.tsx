import './Navbar.css'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'

const navLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'איך זה עובד', href: '#services' },
  { label: 'פיצ׳רים', href: '#features' },
  { label: 'ספקים', href: '/providers' },
  { label: 'עיצובים', href: '#projects' },
  { label: 'מחירים', href: '#pricing' },
  { label: 'שאלות', href: '#faq' },
  { label: 'צרו קשר', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const rightLinks = navLinks.slice(0, 4) 
  const leftLinks = navLinks.slice(4) 

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__glass">
        <div className="navbar__inner">
          {/* Right Side Links (RTL) */}
          <nav className="navbar__nav navbar__nav--right">
            {rightLinks.map(l => (
              <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
            ))}
          </nav>

          {/* Centered Logo */}
          <a href="#hero" className="navbar__logo">
            <img src="/images/logo.png" alt="RideUp" />
          </a>

          {/* Left Side Links + CTA */}
          <div className="navbar__left-group">
            <nav className="navbar__nav navbar__nav--left">
              {leftLinks.map(l => (
                <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
              ))}
            </nav>
            
            <a href="/onboarding" className="btn btn-primary navbar__cta">
              התחברות / הרשמה
            </a>
          </div>

          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`}>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
      </div>
    </header>
  )
}
