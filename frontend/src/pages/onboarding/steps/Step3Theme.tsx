// =====================================================================
// Step3Theme — onboarding theme picker.
// Renders 5 high-fidelity preview cards from the central THEMES registry.
// =====================================================================
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { TenantTheme } from '../../../types';
import { THEMES, THEME_KEYS } from '../../../lib/themes';

export default function Step3Theme({
  value,
  onChange,
}: {
  value: TenantTheme | null;
  onChange: (t: TenantTheme) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {THEME_KEYS.map((key, i) => {
        const theme = THEMES[key];
        const selected = value === key;
        return (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onChange(key)}
            className="relative text-right rounded-3xl overflow-hidden transition-all"
            style={{
              border: selected ? '3px solid #7D39EB' : '2px solid rgba(125,57,235,0.1)',
              boxShadow: selected
                ? '0 16px 40px -12px rgba(125,57,235,0.4)'
                : '0 2px 12px -4px rgba(0,0,0,0.08)',
              background: '#fff',
            }}
          >
            {/* Mini-preview that mimics the real theme */}
            <MiniPreview theme={theme} />

            {/* Label */}
            <div className="p-4 bg-white">
              <p className="font-bold text-lg" style={{ color: '#000' }}>
                {theme.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                {theme.vibe}
              </p>
              <p className="text-[11px] mt-2 leading-relaxed" style={{ color: '#9CA3AF' }}>
                {theme.description}
              </p>
            </div>

            {selected && (
              <div className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center"
                   style={{ background: '#7D39EB' }}>
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function MiniPreview({ theme }: { theme: typeof THEMES[keyof typeof THEMES] }) {
  const isBold = theme.key === 'bold';
  const isRomantic = theme.key === 'romantic';
  return (
    <div className="aspect-[4/3] flex flex-col items-center justify-center text-center px-5 relative overflow-hidden"
         style={{
           background: isBold
             ? `radial-gradient(circle at 30% 20%, ${theme.palette.accent2}50, transparent 60%), radial-gradient(circle at 70% 80%, ${theme.palette.accent}30, transparent 60%), ${theme.palette.bg}`
             : theme.palette.bg,
           color: theme.palette.text,
         }}>
      {/* Subtle decoration per theme */}
      {theme.key === 'luxe' && (
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden>
          <pattern id="lp" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill={theme.palette.accent} />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lp)" />
        </svg>
      )}

      <p className="text-[9px] tracking-[0.4em] mb-2" style={{ color: theme.palette.accent, fontFamily: theme.fonts.display }}>
        SAVE THE DATE
      </p>
      <p className="text-2xl mb-2"
         style={{
           fontFamily: theme.fonts.display,
           fontWeight: isRomantic ? 400 : 600,
           letterSpacing: theme.key === 'luxe' ? '0.05em' : '0',
           ...(isBold && {
             background: `linear-gradient(135deg, ${theme.palette.accent}, ${theme.palette.accent2})`,
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
           }),
         }}>
        אביב & בר
      </p>
      <div className="h-px w-10 my-1.5" style={{ background: theme.palette.accent }} />
      <p className="text-[10px] opacity-70" style={{ fontFamily: theme.fonts.body }}>
        17.09.2026 · תל אביב
      </p>
      <button className="mt-3 px-4 py-1.5 text-[10px] font-bold"
              style={{
                background: theme.palette.accent,
                color: theme.palette.bg,
                borderRadius: theme.key === 'minimal' ? '6px' : theme.key === 'elegant' ? '0' : '999px',
                letterSpacing: theme.key === 'luxe' ? '0.2em' : 'normal',
              }}>
        אישור הגעה
      </button>
    </div>
  );
}
