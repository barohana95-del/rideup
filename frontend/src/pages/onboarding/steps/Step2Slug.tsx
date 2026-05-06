import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2, Globe } from 'lucide-react';
import { onboardingApi } from '../../../lib/api';

const RESERVED = new Set([
  'www', 'app', 'api', 'admin', 'mail', 'blog', 'docs', 'help',
  'support', 'billing', 'checkout', 'login', 'signup', 'about',
  'pricing', 'terms', 'privacy', 'rideup', 'dev', 'staging', 'test',
]);

function validateSlug(s: string): string | null {
  if (s.length < 3) return 'לפחות 3 תווים';
  if (s.length > 60) return 'מקסימום 60 תווים';
  if (!/^[a-z0-9-]+$/.test(s)) return 'אותיות אנגליות, מספרים ומקפים בלבד';
  if (s.startsWith('-') || s.endsWith('-')) return 'לא להתחיל או לסיים במקף';
  if (RESERVED.has(s)) return 'שם שמור — בחר שם אחר';
  return null;
}

export default function Step2Slug({
  value,
  onChange,
  onAvailabilityChange,
}: {
  value: string;
  onChange: (s: string) => void;
  onAvailabilityChange: (avail: boolean | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [avail, setAvail] = useState<boolean | null>(null);

  // Stable ref to the callback — avoids re-running the effect on every parent render.
  const cbRef = useRef(onAvailabilityChange);
  useEffect(() => {
    cbRef.current = onAvailabilityChange;
  }, [onAvailabilityChange]);

  useEffect(() => {
    setAvail(null);
    cbRef.current(null);

    if (!value) {
      setError(null);
      setChecking(false);
      return;
    }
    const err = validateSlug(value);
    setError(err);
    if (err) {
      setChecking(false);
      return;
    }

    // Real API check — debounced 500ms
    setChecking(true);
    const t = setTimeout(async () => {
      const res = await onboardingApi.checkSlug(value);
      if (res.success && res.data) {
        setAvail(res.data.available);
        cbRef.current(res.data.available);
      } else {
        setAvail(null);
        cbRef.current(null);
        setError(res.error ?? 'שגיאה בבדיקה');
      }
      setChecking(false);
    }, 500);
    return () => clearTimeout(t);
  }, [value]);

  const suggestions = ['mihal-and-yossi', 'aviv-bar-2026', 'dana-yossi-wedding', 'noaomer'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Live preview */}
      <div
        className="mb-6 p-5 rounded-2xl flex items-center gap-3"
        style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.15)' }}
      >
        <Globe className="w-5 h-5 shrink-0" style={{ color: '#7D39EB' }} />
        <p className="text-base font-mono flex items-center gap-1 truncate" style={{ color: '#000000' }}>
          <span style={{ color: '#6B7280' }}>https://</span>
          <span className="font-bold" style={{ color: avail ? '#7D39EB' : '#000000' }}>
            {value || 'your-event'}
          </span>
          <span style={{ color: '#6B7280' }}>.rideup.co.il</span>
        </p>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().trim())}
          placeholder="לדוגמה: aviv-bar-2026"
          dir="ltr"
          className="w-full px-5 py-4 text-lg font-mono focus:outline-none transition-all"
          style={{
            background: '#fff',
            border: error ? '2px solid #ef4444' : avail ? '2px solid #7D39EB' : '2px solid rgba(125,57,235,0.15)',
            borderRadius: '16px',
            color: '#000000',
          }}
          maxLength={60}
        />

        {/* Status icon */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          {checking && <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#6B7280' }} />}
          {!checking && avail === true && (
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#7D39EB' }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
          )}
          {!checking && avail === false && (
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#ef4444' }}
            >
              <X className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>

      {/* Status message */}
      <div className="mt-3 min-h-[24px] text-sm">
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {!error && checking && <p style={{ color: '#6B7280' }}>בודק זמינות...</p>}
        {!error && avail === true && (
          <p className="font-semibold" style={{ color: '#7D39EB' }}>
            ✓ זמין! הכתובת שלך תהיה {value}.rideup.co.il
          </p>
        )}
        {!error && avail === false && (
          <p style={{ color: '#ef4444' }}>הכתובת תפוסה — בחר שם אחר</p>
        )}
      </div>

      {/* Suggestions */}
      {!value && (
        <div className="mt-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#6B7280' }}>
            רעיונות
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onChange(s)}
                className="px-4 py-2 rounded-full text-sm font-mono transition-all"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(125,57,235,0.15)',
                  color: '#7D39EB',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-center" style={{ color: '#6B7280' }}>
        💡 תוכל לשנות את הכתובת בכל זמן מהפאנל ניהול
      </p>
    </motion.div>
  );
}
