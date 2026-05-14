// =====================================================================
// CollaboratorsSection — manage who else can access this tenant.
// Owner can invite by email, change roles (editor/viewer), or remove.
// Editors/viewers see the list but can't mutate.
// =====================================================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, Crown, Edit, Eye, Trash2, Loader2, AlertCircle,
  Check, X, Mail, Clock, Users as UsersIcon, Copy, CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

type Role = 'owner' | 'editor' | 'viewer';
type Collaborator = {
  userId: number;
  role: Role;
  createdAt: string;
  acceptedAt: string | null;
  invitedEmail: string | null;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

const ROLE_META: Record<Role, { label: string; icon: React.ElementType; color: string; desc: string }> = {
  owner:  { label: 'בעלים', icon: Crown, color: '#FCD34D', desc: 'גישה מלאה — כולל ניהול שיתוף ומחיקה' },
  editor: { label: 'עורך',  icon: Edit,  color: '#7D39EB', desc: 'יכול לערוך תוכן, רישומים ועיצוב' },
  viewer: { label: 'צופה',  icon: Eye,   color: '#6B7280', desc: 'גישה לקריאה בלבד' },
};

export default function CollaboratorsSection({
  slug,
  isOwner,
}: {
  slug: string;
  isOwner: boolean;
}) {
  const [rows, setRows] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [inviting, setInviting] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [lastInvitedEmail, setLastInvitedEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await adminApi.listCollaborators(slug);
    setLoading(false);
    if (res.success && res.data) setRows(res.data);
    else setError(res.error ?? 'שגיאה בטעינה');
  }

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('כתובת אימייל לא תקינה');
      return;
    }
    setInviting(true);
    setError(null);
    const res = await adminApi.inviteCollaborator(slug, email, inviteRole);
    setInviting(false);
    if (!res.success) { setError(res.error ?? 'שגיאה בהזמנה'); return; }
    setLastInvitedEmail(email);
    setCopied(false);
    setInviteEmail('');
    await load();
  }

  async function copyInviteLink() {
    const link = `${window.location.origin}/login?invited=${encodeURIComponent(lastInvitedEmail ?? '')}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('לא ניתן להעתיק — העתק ידנית: ' + link);
    }
  }

  async function handleChangeRole(userId: number, newRole: 'editor' | 'viewer') {
    setBusy(userId);
    setError(null);
    const res = await adminApi.changeCollaboratorRole(slug, userId, newRole);
    setBusy(null);
    if (!res.success) { setError(res.error ?? 'שגיאה'); return; }
    await load();
  }

  async function handleRemove(userId: number, name: string) {
    if (!confirm(`להסיר את ${name} מגישה לאתר?`)) return;
    setBusy(userId);
    setError(null);
    const res = await adminApi.removeCollaborator(slug, userId);
    setBusy(null);
    if (!res.success) { setError(res.error ?? 'שגיאה'); return; }
    await load();
  }

  return (
    <div className="rounded-2xl p-5 md:p-6"
         style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" style={{ color: '#7D39EB' }} />
          <h2 className="font-bold" style={{ color: '#000' }}>שיתוף גישה</h2>
        </div>
        {isOwner && (
          <button
            onClick={() => { setShowInvite(!showInvite); setError(null); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all"
            style={{ background: showInvite ? '#F2EBFF' : '#7D39EB', color: showInvite ? '#7D39EB' : '#fff' }}
          >
            {showInvite ? <><X className="w-4 h-4" /> בטל</> : <><UserPlus className="w-4 h-4" /> הזמן מישהו</>}
          </button>
        )}
      </div>
      <p className="text-xs mb-5" style={{ color: '#6B7280' }}>
        אנשים נוספים שיכולים לעזור בניהול האתר. רק הבעלים יכול להזמין/להסיר.
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl flex items-start gap-2 text-sm"
             style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="px-1">×</button>
        </div>
      )}

      {/* Success: invitation sent */}
      <AnimatePresence>
        {lastInvitedEmail && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-3.5 rounded-xl"
            style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}
          >
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#059669' }} />
              <div className="flex-1 text-sm" style={{ color: '#065F46' }}>
                <p className="font-bold mb-0.5">ההזמנה נוצרה</p>
                <p className="text-xs">
                  שלח/י את הקישור הבא ל-<span dir="ltr" className="font-mono">{lastInvitedEmail}</span> כדי שיוכל/תוכל להתחבר ולקבל גישה.
                </p>
              </div>
              <button onClick={() => setLastInvitedEmail(null)} className="px-1 text-sm" style={{ color: '#065F46' }}>×</button>
            </div>
            <button
              onClick={copyInviteLink}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-full transition-all"
              style={{ background: copied ? '#059669' : '#fff', color: copied ? '#fff' : '#059669', border: '1.5px solid #059669' }}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> הקישור הועתק!</> : <><Copy className="w-3.5 h-3.5" /> העתק קישור הזמנה</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite form */}
      <AnimatePresence>
        {showInvite && isOwner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="p-4 rounded-2xl space-y-3"
                 style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.2)' }}>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: '#000' }}>
                  אימייל של מי שתרצה להזמין
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  placeholder="someone@example.com"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
                  style={{ background: '#fff', border: '1.5px solid rgba(125,57,235,0.2)', borderRadius: '10px', color: '#000' }}
                />
              </div>

              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: '#000' }}>
                  תפקיד
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['editor', 'viewer'] as const).map((r) => {
                    const meta = ROLE_META[r];
                    const selected = inviteRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setInviteRole(r)}
                        className="text-right px-3 py-2.5 rounded-xl transition-all"
                        style={{
                          background: selected ? '#000' : '#fff',
                          color: selected ? '#fff' : '#000',
                          border: selected ? '2px solid #7D39EB' : '1px solid rgba(125,57,235,0.15)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <meta.icon className="w-3.5 h-3.5" style={{ color: selected ? '#FCD34D' : meta.color }} />
                          <span className="font-bold text-sm">{meta.label}</span>
                        </div>
                        <p className="text-[10px] opacity-70 leading-tight">{meta.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail.trim()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-full transition-all disabled:opacity-40"
                style={{ background: '#7D39EB', color: '#fff' }}
              >
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                שלח הזמנה
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#7D39EB' }} />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-8 text-sm" style={{ color: '#6B7280' }}>
          אין עדיין משתפי פעולה
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((c) => (
            <CollaboratorRow
              key={c.userId}
              collab={c}
              isOwner={isOwner}
              busy={busy === c.userId}
              onChangeRole={handleChangeRole}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CollaboratorRow({
  collab, isOwner, busy, onChangeRole, onRemove,
}: {
  collab: Collaborator;
  isOwner: boolean;
  busy: boolean;
  onChangeRole: (userId: number, role: 'editor' | 'viewer') => void;
  onRemove: (userId: number, name: string) => void;
}) {
  const meta = ROLE_META[collab.role];
  const isPending = !collab.acceptedAt;
  const displayName = collab.displayName || collab.email || collab.invitedEmail || 'משתמש';
  const canMutate = isOwner && collab.role !== 'owner';

  return (
    <li className="flex items-center gap-3 p-3 rounded-xl flex-wrap sm:flex-nowrap"
        style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.1)' }}>
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden"
           style={{ background: collab.role === 'owner' ? '#FCD34D' : '#7D39EB', color: collab.role === 'owner' ? '#000' : '#fff' }}>
        {collab.avatarUrl ? (
          <img src={collab.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          (displayName[0] ?? '?').toUpperCase()
        )}
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate flex items-center gap-2" style={{ color: '#000' }}>
          {displayName}
          {isPending && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#FEF3C7', color: '#92400E' }}>
              <Clock className="w-2.5 h-2.5" />
              ממתין
            </span>
          )}
        </p>
        <p className="text-xs truncate" style={{ color: '#6B7280' }}>
          {collab.email || collab.invitedEmail || '—'}
        </p>
      </div>

      {/* Role badge / selector */}
      <div className="flex items-center gap-2 shrink-0">
        {canMutate ? (
          <select
            value={collab.role}
            onChange={(e) => onChangeRole(collab.userId, e.target.value as 'editor' | 'viewer')}
            disabled={busy}
            className="text-xs font-bold px-2.5 py-1 rounded-full focus:outline-none"
            style={{ background: `${meta.color}1A`, color: meta.color === '#FCD34D' ? '#92400E' : meta.color, border: 'none' }}
          >
            <option value="editor">עורך</option>
            <option value="viewer">צופה</option>
          </select>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{ background: `${meta.color}1A`, color: meta.color === '#FCD34D' ? '#92400E' : meta.color }}>
            <meta.icon className="w-3 h-3" />
            {meta.label}
          </span>
        )}

        {canMutate && (
          <button
            onClick={() => onRemove(collab.userId, displayName)}
            disabled={busy}
            className="w-8 h-8 rounded-md inline-flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: '#FEE2E2', color: '#DC2626' }}
            aria-label="הסר"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </li>
  );
}
