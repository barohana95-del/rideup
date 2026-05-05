// =====================================================================
// Shared decorative components — defines the visual language of RideUp.
// Use these consistently across sections to maintain unified DNA.
// =====================================================================

/**
 * Scalloped/wavy divider — used as the bottom edge of hero card and
 * matching tops of subsequent sections. The SVG is absolutely positioned.
 *
 * @param fill — color matching the OTHER side (the "cream below" color)
 * @param flip — true means the wave inverts (used for matching the section above)
 */
export function WavyDivider({
  fill = 'var(--color-cream)',
  flip = false,
  position = 'bottom',
  height = 60,
  className = '',
}: {
  fill?: string;
  flip?: boolean;
  position?: 'bottom' | 'top';
  height?: number;
  className?: string;
}) {
  // Path describes a row of soft "bumps" going down from a flat top.
  // 6 bumps across the full width of 1200, smooth.
  // When flipped, the bumps go up.
  const bumps = (
    <path
      d="
        M 0 0
        L 0 30
        C 50 30, 80 60, 130 60
        C 180 60, 200 20, 250 20
        C 300 20, 330 55, 380 55
        C 430 55, 460 25, 510 25
        C 560 25, 590 60, 640 60
        C 690 60, 710 20, 760 20
        C 810 20, 840 55, 890 55
        C 940 55, 970 22, 1020 22
        C 1070 22, 1100 60, 1150 60
        L 1200 30
        L 1200 0
        Z
      "
      fill={fill}
    />
  );

  const transform = flip ? 'scale(1, -1)' : undefined;
  const positionClass =
    position === 'bottom'
      ? 'absolute bottom-0 inset-x-0'
      : 'absolute top-0 inset-x-0';

  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`${positionClass} w-full ${className}`}
      style={{ height: `${height}px`, transform }}
      aria-hidden
    >
      {bumps}
    </svg>
  );
}

/**
 * Sparkle star — decorative element used throughout.
 * Auto-animated with the .sparkle class.
 */
export function SparkleIcon({
  size = 16,
  color = 'currentColor',
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ color }}
      aria-hidden
    >
      <path
        d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Curved corner brackets — frame a card with 4 L-shaped accents.
 * Adds a "designed" feel without being heavy.
 */
export function CornerBrackets({
  color = 'var(--color-emerald)',
  size = 18,
  thickness = 1.5,
  inset = 8,
}: {
  color?: string;
  size?: number;
  thickness?: number;
  inset?: number;
}) {
  const lineStyle = {
    stroke: color,
    strokeWidth: thickness,
    fill: 'none',
    strokeLinecap: 'round' as const,
  };
  return (
    <>
      {/* Top-right (in RTL: top-right is the "first" corner) */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: inset, right: inset }}
        width={size}
        height={size}
        viewBox="0 0 20 20"
      >
        <path d="M 20 0 L 4 0 Q 0 0, 0 4 L 0 20" {...lineStyle} />
      </svg>
      {/* Top-left */}
      <svg
        className="absolute pointer-events-none"
        style={{ top: inset, left: inset }}
        width={size}
        height={size}
        viewBox="0 0 20 20"
      >
        <path d="M 0 0 L 16 0 Q 20 0, 20 4 L 20 20" {...lineStyle} />
      </svg>
      {/* Bottom-right */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: inset, right: inset }}
        width={size}
        height={size}
        viewBox="0 0 20 20"
      >
        <path d="M 20 20 L 4 20 Q 0 20, 0 16 L 0 0" {...lineStyle} />
      </svg>
      {/* Bottom-left */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: inset, left: inset }}
        width={size}
        height={size}
        viewBox="0 0 20 20"
      >
        <path d="M 0 20 L 16 20 Q 20 20, 20 16 L 20 0" {...lineStyle} />
      </svg>
    </>
  );
}

/**
 * Sparkle cluster — multiple ✦ scattered with random positions.
 * Used as decorative background ornament throughout sections.
 */
export function SparkleCluster({ density = 6, color = 'var(--color-gold)' }: { density?: number; color?: string }) {
  const items = Array.from({ length: density }).map((_, i) => ({
    top: `${(i * 17 + 13) % 90}%`,
    left: `${(i * 23 + 7) % 95}%`,
    size: i % 3 === 0 ? 16 : i % 3 === 1 ? 12 : 8,
    delay: `${(i * 0.4) % 3}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {items.map((s, i) => (
        <span
          key={i}
          className="absolute sparkle"
          style={{
            top: s.top,
            left: s.left,
            color,
            animationDelay: s.delay,
          }}
        >
          <SparkleIcon size={s.size} />
        </span>
      ))}
    </div>
  );
}

/**
 * Tag — small label used above section headings ("─── About ───" style).
 * Consistent across the site.
 */
export function SectionTag({ children, color = 'text-coral' }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`${color} font-semibold text-sm tracking-[0.3em] uppercase mb-4 inline-flex items-center gap-3`}>
      <span className="w-8 h-px bg-current opacity-50" />
      {children}
      <span className="w-8 h-px bg-current opacity-50" />
    </p>
  );
}
