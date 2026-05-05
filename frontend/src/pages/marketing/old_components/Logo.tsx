// Logo wordmark — text + arrow.
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-1 ${sizes[size]} font-black`} dir="ltr" style={{ fontFamily: 'Heebo, system-ui, sans-serif' }}>
      <span style={{ color: '#fff' }}>Ride</span>
      <span style={{ color: '#1E63D6' }}>Up</span>
      <span
        className="text-[0.55em] inline-block -mt-2 -mr-0.5 font-black"
        style={{ color: '#1E63D6' }}
      >
        ↗
      </span>
    </div>
  );
}
