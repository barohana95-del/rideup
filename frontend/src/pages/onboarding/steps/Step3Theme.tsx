import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import type { TenantTheme } from '../../../types';

const themes: { key: TenantTheme; name: string; vibe: string; bg: string; fg: string; accent: string }[] = [
  { key: 'classic',  name: 'קלאסי',  vibe: 'אלגנטי, נצחי, מינימליסטי',  bg: '#0a0a0a', fg: '#f5e6c8', accent: '#c9a557' },
  { key: 'modern',   name: 'מודרני', vibe: 'נקי, צבעוני, גיאומטרי',     bg: '#FFF1E0', fg: '#1A1814', accent: '#FB923C' },
  { key: 'rustic',   name: 'כפרי',   vibe: 'חמים, טבעי, אדמתי',          bg: '#E8DCC4', fg: '#3D2817', accent: '#74C69D' },
  { key: 'festive',  name: 'חגיגי',  vibe: 'זוהר, חם, עתיר ביטוי',       bg: '#2D1B0F', fg: '#FCD34D', accent: '#F9A8D4' },
];

export default function Step3Theme({
  value,
  onChange,
}: {
  value: TenantTheme | null;
  onChange: (t: TenantTheme) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {themes.map((theme, i) => {
        const selected = value === theme.key;
        return (
          <motion.button
            key={theme.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onChange(theme.key)}
            className="relative text-right rounded-3xl overflow-hidden transition-all"
            style={{
              border: selected ? '3px solid #1E63D6' : '2px solid rgba(30,99,214,0.1)',
              boxShadow: selected ? '0 16px 40px -12px rgba(30,99,214,0.4)' : '0 2px 12px -4px rgba(10,31,68,0.08)',
              background: '#fff',
            }}
          >
            {/* Theme preview */}
            <div
              className="aspect-[4/3] flex flex-col items-center justify-center text-center px-5"
              style={{ background: theme.bg, color: theme.fg }}
            >
              <p
                className="text-[10px] tracking-[0.3em] mb-2 opacity-70"
                style={{ color: theme.accent }}
              >
                17 · 09 · 2026
              </p>
              <p className="text-xl md:text-2xl font-bold mb-1">אביב & בר</p>
              <div
                className="w-8 h-px my-2"
                style={{ background: theme.accent }}
              />
              <p className="text-[10px] opacity-70">תל אביב</p>
              <button
                className="mt-3 px-4 py-1.5 rounded-full text-[10px] font-bold"
                style={{ background: theme.accent, color: theme.bg }}
              >
                אישור הגעה
              </button>
            </div>

            {/* Label */}
            <div className="p-4 bg-white">
              <p className="display text-lg" style={{ color: '#0A1F44' }}>
                {theme.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7C95' }}>
                {theme.vibe}
              </p>
            </div>

            {/* Selected check */}
            {selected && (
              <div
                className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#1E63D6' }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
