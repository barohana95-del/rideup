// =====================================================================
// UserMenu — avatar + name dropdown rendered in the Navbar when the
// user is signed in. Replaces the "התחברות / הרשמה" CTA in that case.
// =====================================================================
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, User as UserIcon, LayoutGrid, LogOut, Shield } from 'lucide-react';
import { logout as authLogout, type AuthUser } from '../../../lib/auth';

export default function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside-click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function handleLogout() {
    await authLogout();
    window.location.href = '/';
  }

  const firstName = user.displayName?.split(' ')[0] || user.email.split('@')[0];

  return (
    <div className="user-menu" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="user-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserAvatar user={user} size={32} />
        <span className="user-menu__name">{firstName}</span>
        <ChevronDown className="user-menu__chevron" size={14}
                     style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="user-menu__dropdown"
            role="menu"
          >
            {/* Header */}
            <div className="user-menu__header">
              <UserAvatar user={user} size={40} />
              <div className="user-menu__header-text">
                <p className="user-menu__header-name">{user.displayName || firstName}</p>
                <p className="user-menu__header-email" dir="ltr">{user.email}</p>
              </div>
            </div>

            <div className="user-menu__divider" />

            <a href="/account" className="user-menu__item">
              <UserIcon size={16} />
              <span>אזור אישי</span>
            </a>
            <a href="/admin" className="user-menu__item">
              <LayoutGrid size={16} />
              <span>האתרים שלי</span>
            </a>
            {user.isAdmin && (
              <a href="/super-admin" className="user-menu__item">
                <Shield size={16} />
                <span>פאנל פלטפורמה</span>
              </a>
            )}

            <div className="user-menu__divider" />

            <button onClick={handleLogout} className="user-menu__item user-menu__item--danger">
              <LogOut size={16} />
              <span>התנתקות</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserAvatar({ user, size }: { user: AuthUser; size: number }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.displayName ?? user.email}
                className="user-menu__avatar"
                style={{ width: size, height: size }}
                referrerPolicy="no-referrer" />;
  }
  const initial = (user.displayName?.[0] ?? user.email[0] ?? '?').toUpperCase();
  return (
    <div className="user-menu__avatar user-menu__avatar--initial"
         style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {initial}
    </div>
  );
}
