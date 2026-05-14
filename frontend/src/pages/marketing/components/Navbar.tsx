import './Navbar.css'
import './UserMenu.css'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { getCurrentUser, refreshUser, type AuthUser } from '../../../lib/auth'
import UserMenu from './UserMenu'

const navLinks = [
  { label: 'ראשי', href: '#hero' },
  { label: 'איך זה עובד', href: '#services' },
  { label: 'פיצ׳רים', href: '#features' },
  { label: 'ספקים', href: '/providers' },
  { label: 'המערכת בפעולה', href: '/experience' },
  { label: 'עיצובים', href: '#projects' },
  { label: 'מחירים', href: '#pricing' },
  { label: 'שאלות', href: '#faq' },
  { label: 'צרו קשר', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Re-verify the user lazily — keeps localStorage from going stale after
  // server-side flag changes (is_admin, etc.).
  useEffect(() => {
    if (getCurrentUser()) refreshUser().then(setUser);
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
          <a href="/" className="navbar__logo">
            <img src="/images/logo.png" alt="RideUp" />
          </a>

          {/* Left Side Links + CTA / UserMenu */}
          <div className="navbar__left-group">
            <nav className="navbar__nav navbar__nav--left">
              {leftLinks.map(l => (
                <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
              ))}
            </nav>

            {user ? (
              <UserMenu user={user} />
            ) : (
              <a href="/login" className="btn btn-primary navbar__cta">
                התחברות / הרשמה
              </a>
            )}
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
        <div className="navbar__mobile-divider" />
        {user ? (
          <>
            <a href="/account" onClick={() => setMenuOpen(false)}>אזור אישי</a>
            <a href="/admin" onClick={() => setMenuOpen(false)}>האתרים שלי</a>
            {user.isAdmin && <a href="/super-admin" onClick={() => setMenuOpen(false)}>פאנל פלטפורמה</a>}
          </>
        ) : (
          <a href="/login" onClick={() => setMenuOpen(false)}>התחברות / הרשמה</a>
        )}
      </div>
    </header>
  )
}
