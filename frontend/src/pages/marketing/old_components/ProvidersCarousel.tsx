import { motion } from 'motion/react';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

const providers = [
  { name: 'אגד תיירות', region: 'ארצי' },
  { name: 'דן הסעות', region: 'מרכז' },
  { name: 'אגדן הסעות', region: 'דרום' },
  { name: 'מטרופולין', region: 'מרכז' },
  { name: 'נטיב אקספרס', region: 'צפון' },
  { name: 'אקסטרה', region: 'ירושלים' },
  { name: 'גליל הסעות', region: 'צפון' },
  { name: 'נסיעות ישראל', region: 'ארצי' },
  { name: 'תור בוס', region: 'מרכז' },
  { name: 'מובי הסעות', region: 'דרום' },
];

export default function ProvidersCarousel() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: '#0A1F44' }}>
      {/* Glows */}
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.15) 0%, transparent 65%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.1) 0%, transparent 65%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 mb-12">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-5"
              style={{ background: 'rgba(30,99,214,0.12)', color: '#1E63D6', border: '1px solid rgba(30,99,214,0.2)' }}
            >
              ספקים שותפים
            </span>
            <h2 className="display text-4xl md:text-6xl text-white reveal-heading">
              עובדים עם{' '}
              <span style={{ color: '#1E63D6' }}>הטובים ביותר.</span>
            </h2>
            <p className="text-lg mt-4 max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              חברות הסעות מובילות בישראל. דירוגים, חוות דעת, מחירים — הכל שקוף ובמקום אחד.
            </p>
          </div>

          <div className="md:col-span-5 flex md:justify-end">
            <a
              href="/providers"
              className="inline-flex items-center gap-2 font-bold transition-all group px-6 py-3"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '100px',
                color: 'rgba(255,255,255,0.8)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1E63D6';
                (e.currentTarget as HTMLElement).style.color = '#fff';
                (e.currentTarget as HTMLElement).style.borderColor = '#1E63D6';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              ראה את כל הספקים
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div className="relative py-4 marquee-fast overflow-hidden">
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #0A1F44, transparent)' }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #0A1F44, transparent)' }}
        />
        <div className="marquee-track-rtl gap-5">
          {[...providers, ...providers].map((p, i) => (
            <ProviderCard key={`r1-${i}`} provider={p} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative py-4 marquee-slow overflow-hidden">
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #0A1F44, transparent)' }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #0A1F44, transparent)' }}
        />
        <div className="marquee-track gap-5">
          {[...providers.slice().reverse(), ...providers.slice().reverse()].map((p, i) => (
            <ProviderCard key={`r2-${i}`} provider={p} variant="alt" />
          ))}
        </div>
      </div>

      {/* Bottom badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-6 mt-12 text-center"
      >
        <div
          className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 text-sm"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: '#1E63D6' }} />
          <span>
            <span className="text-white font-bold">200+</span> ספקים מאומתים
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <span>
            <span className="text-white font-bold">15</span> אזורי שירות
          </span>
          <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <span>
            דירוג ממוצע <span className="font-bold" style={{ color: '#1E63D6' }}>4.7★</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
}

function ProviderCard({
  provider,
  variant,
}: {
  provider: (typeof providers)[number];
  variant?: 'alt';
}) {
  return (
    <div
      className="shrink-0 group relative flex items-center gap-4 transition-all hover:scale-105 cursor-default"
      style={{
        minWidth: '240px',
        padding: '20px 28px',
        borderRadius: '20px',
        background: variant === 'alt' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)',
        border: variant === 'alt' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30,99,214,0.2)',
      }}
    >
      {/* Logo monogram */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
        style={{
          background: variant === 'alt' ? '#1E63D6' : '#1E63D6',
          color: variant === 'alt' ? '#fff' : '#0A1F44',
        }}
      >
        {provider.name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-base whitespace-nowrap text-white">
          {provider.name}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {provider.region} · ★ 4.{Math.floor(Math.random() * 3) + 7}
        </p>
      </div>

      <span style={{ color: variant === 'alt' ? '#1E63D6' : '#1E63D6', fontSize: '1.25rem' }}>↗</span>
    </div>
  );
}
