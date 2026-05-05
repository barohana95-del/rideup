import { Sparkle } from 'lucide-react';

const items = [
  'RideUp',
  'ניהול הסעות',
  'חתונות',
  'בר מצווה',
  'בת מצווה',
  'יום הולדת',
  'אירועי חברה',
  'בלי אקסלים',
  'מסודר. אסתטי. מהיר.',
];

interface Props {
  variant?: 'mint' | 'dark' | 'cream';
  skew?: 'none' | 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
}

export default function Marquee({
  variant = 'mint',
  skew = 'none',
  speed = 'normal',
}: Props) {
  const styles = {
    mint:  { bg: 'bg-mint-glow', fg: 'text-onyx', dot: 'fill-onyx' },
    dark:  { bg: 'bg-pine', fg: 'text-cream', dot: 'fill-mint' },
    cream: { bg: 'bg-cream', fg: 'text-pine', dot: 'fill-toffee' },
  }[variant];

  const skewClass = {
    none: '',
    left: 'skew-marquee',
    right: 'skew-marquee-rev',
  }[skew];

  const speedClass = {
    slow: 'marquee-slow',
    normal: '',
    fast: 'marquee-fast',
  }[speed];

  const doubled = [...items, ...items];

  return (
    <div className={`relative ${skewClass}`}>
      <div
        className={`${styles.bg} ${styles.fg} py-5 overflow-hidden border-y border-pine/30 ${speedClass}`}
      >
        <div className="marquee-track gap-8">
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="display text-2xl md:text-3xl whitespace-nowrap">{item}</span>
              <Sparkle className={`w-5 h-5 ${styles.dot}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
