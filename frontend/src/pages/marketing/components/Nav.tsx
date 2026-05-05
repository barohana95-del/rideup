import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronLeft } from 'lucide-react';
import Logo from './Logo';

const links = [
  { label: 'איך זה עובד', href: '#how' },
  { label: 'עיצובים', href: '#themes' },
  { label: 'החבילות', href: '#pricing' },
  { label: 'ספקי הסעות', href: '/providers' },
  { label: 'שאלות', href: '#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-4 inset-x-4 md:inset-x-8 z-50 transition-all duration-500 ${scrolled ? 'top-3' : ''}`}
      >
        <nav
          className={`mx-auto max-w-5xl flex items-center gap-2 px-3 py-2.5 transition-all duration-500 ${
            scrolled
              ? 'bg-slate/95 backdrop-blur-xl shadow-2xl shadow-slate/30'
              : 'bg-slate/90 backdrop-blur-md'
          }`}
          style={{ borderRadius: '100px' }}
        >
          {/* Logo pill */}
          <a
            href="#hero"
            className="shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-white/8 transition-colors"
          >
            <Logo size="sm" />
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-0.5 mr-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right CTAs */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="hidden sm:inline-block px-4 py-2 text-sm text-white/70 hover:text-white transition-colors font-medium"
            >
              התחברות
            </a>
            <a
              href="#pricing"
              className="hidden sm:inline-flex items-center gap-1.5 text-slate font-bold text-sm px-5 py-2.5 transition-all hover:shadow-lg group"
              style={{
                background: '#1E63D6',
                borderRadius: '100px',
                boxShadow: '0 4px 16px -4px rgba(30,99,214,0.5)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1851B0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1E63D6';
              }}
            >
              התחל בחינם
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2.5 hover:bg-white/10 text-white transition-colors"
              style={{ borderRadius: '100px' }}
              aria-label="תפריט"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(37, 47, 56, 0.98)', backdropFilter: 'blur(20px)' }}
            onClick={() => setMobileOpen(false)}
          >
            {/* Logo top */}
            <div className="flex items-center justify-between px-8 pt-6 pb-8">
              <Logo size="md" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ul className="flex flex-col items-center gap-1 px-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="w-full"
                >
                  <a
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center px-6 py-4 text-2xl font-bold text-white/80 hover:text-white hover:bg-white/6 rounded-2xl transition-all"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-8 w-full max-w-xs flex flex-col gap-3">
                <a
                  href="#pricing"
                  className="btn-lime justify-center text-base"
                >
                  התחל בחינם
                  <ChevronLeft className="w-4 h-4" />
                </a>
                <a href="/login" className="btn-secondary justify-center text-base">
                  התחברות
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
