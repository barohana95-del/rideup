import { Instagram, Facebook, MessageCircle, ChevronLeft, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{ background: '#061331', color: 'rgba(255,255,255,0.6)' }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top: 4 columns */}
        <div className="grid md:grid-cols-12 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Brand + email opt-in */}
          <div className="md:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 max-w-sm leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              פלטפורמה לניהול הסעות באירועים. אתר RSVP מקצועי, פאנל ניהול חכם,
              עיצובים מוכנים. הכל בעברית.
            </p>

            <form className="mt-6 flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 text-sm text-white placeholder-white/30 focus:outline-none transition-all px-4 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  color: 'rgba(255,255,255,0.85)',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1E63D6'; }}
                onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="button"
                className="btn-lime text-sm px-5 py-2.5 shrink-0"
              >
                הירשם
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </form>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              עדכונים על פיצ'רים חדשים. לא ספאם, לא הבטחות.
            </p>
          </div>

          <FooterCol
            title="המוצר"
            links={[
              { label: 'החבילות', href: '#pricing' },
              { label: 'איך זה עובד', href: '#how' },
              { label: 'עיצובים', href: '#themes' },
              { label: "פיצ'רים", href: '#features' },
              { label: 'שאלות נפוצות', href: '#faq' },
            ]}
          />

          <FooterCol
            title="חברה"
            links={[
              { label: 'על RideUp', href: '/about' },
              { label: 'בלוג', href: '/blog' },
              { label: 'יצירת קשר', href: '/contact' },
              { label: 'דרושים', href: '/careers' },
            ]}
          />

          <FooterCol
            title="משפטי"
            links={[
              { label: 'תקנון שימוש', href: '/terms' },
              { label: 'מדיניות פרטיות', href: '/privacy' },
              { label: 'Cookies', href: '/cookies' },
            ]}
          />
        </div>

        {/* Bottom: copyright + social */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <p className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 RideUp · נבנה{' '}
            <Heart className="w-3.5 h-3.5 fill-current" style={{ color: '#1E63D6' }} /> בישראל
          </p>

          <div className="flex items-center gap-3">
            <SocialIcon icon={Instagram} href="#" />
            <SocialIcon icon={Facebook} href="#" />
            <SocialIcon icon={MessageCircle} href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="font-bold text-base mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-sm transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#1E63D6'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon: Icon, href }: { icon: React.ElementType; href: string }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#1E63D6';
        (e.currentTarget as HTMLElement).style.color = '#fff';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
