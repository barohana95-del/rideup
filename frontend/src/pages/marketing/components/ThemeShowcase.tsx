import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, BarChart3, Settings, FileText } from 'lucide-react';

type ThemeKey = 'classic' | 'modern' | 'rustic' | 'festive';

const themes: { key: ThemeKey; label: string; tag: string; tagline: string; popular?: boolean }[] = [
  { key: 'classic', label: 'קלאסי', tag: 'Timeless · Elegant', tagline: 'אלגנטיות נצחית. שחור-זהב, סריף, דרמה.' },
  { key: 'modern', label: 'מודרני', tag: 'Clean · Bold', tagline: 'מינימליזם נועז. צבעים, גריד, פנאי.', popular: true },
  { key: 'rustic', label: 'כפרי', tag: 'Warm · Natural', tagline: 'חמימות אדמתית. ירוק זית, פרחים מיובשים.' },
  { key: 'festive', label: 'חגיגי', tag: 'Joyful · Loud', tagline: 'חגיגה רועשת. זהב, ורוד, קונפטי.' },
];

export default function ThemeShowcase() {
  const [active, setActive] = useState<ThemeKey>('modern');
  const [activeIdx, setActiveIdx] = useState(1);

  const theme = themes.find((t) => t.key === active)!;

  const goPrev = () => {
    const newIdx = (activeIdx - 1 + themes.length) % themes.length;
    setActiveIdx(newIdx);
    setActive(themes[newIdx].key);
  };
  const goNext = () => {
    const newIdx = (activeIdx + 1) % themes.length;
    setActiveIdx(newIdx);
    setActive(themes[newIdx].key);
  };

  return (
    <section id="themes" className="relative bg-cream-soft text-ink py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 halo-coral blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 halo-emerald blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <p className="text-coral font-semibold text-sm tracking-[0.3em] uppercase mb-4">
              ─── 4 עיצובים מוכנים ───
            </p>
            <h2 className="display text-4xl md:text-6xl text-ink reveal-heading">
              ה-DNA של{' '}
              <span className="serif italic font-medium text-coral">האירוע שלך.</span>
            </h2>
          </motion.div>

          {/* Carousel arrows + label */}
          <div className="md:col-span-5 flex items-center justify-end gap-3">
            <button
              onClick={goPrev}
              className="w-12 h-12 rounded-full bg-ink text-cream hover:bg-coral transition-colors flex items-center justify-center"
              aria-label="קודם"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="w-12 h-12 rounded-full bg-ink text-cream hover:bg-coral transition-colors flex items-center justify-center"
              aria-label="הבא"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {themes.map((t, i) => (
            <button
              key={t.key}
              onClick={() => {
                setActive(t.key);
                setActiveIdx(i);
              }}
              className={`relative px-5 py-3 rounded-full font-semibold transition-all border-2 ${
                active === t.key
                  ? 'bg-ink text-cream border-ink shadow-lg'
                  : 'bg-white text-ink border-ink/10 hover:border-ink/30'
              }`}
            >
              <span className="display">{t.label}</span>
              <span className="text-[10px] mr-2 opacity-60 hidden sm:inline">{t.tag}</span>
              {t.popular && (
                <span className="absolute -top-2 -left-2 bg-coral text-cream text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  פופולרי
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Browser frame with theme preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ink/20 ring-1 ring-ink/10">
            {/* Browser chrome */}
            <div className="bg-ink-soft px-4 py-3 flex items-center gap-2 border-b border-ink/30">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-coral/70" />
                <span className="w-3 h-3 rounded-full bg-gold/70" />
                <span className="w-3 h-3 rounded-full bg-emerald/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-cream/60 text-xs font-mono">
                  aviv-bar.rideup.co.il
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={theme.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                {theme.key === 'classic' && <ClassicTheme />}
                {theme.key === 'modern' && <ModernTheme />}
                {theme.key === 'rustic' && <RusticTheme />}
                {theme.key === 'festive' && <FestiveTheme />}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-ink/60 mt-5 italic font-serif text-lg">
            "{theme.tagline}"
          </p>
        </div>

        {/* === Process illustration === */}
        <ProcessIllustration />

        {/* === Admin panel illustration === */}
        <AdminIllustration />
      </div>
    </section>
  );
}

/* ===== THEMES — each is a designed, distinct wedding/event preview ===== */

function ClassicTheme() {
  return (
    <div className="aspect-[16/10] bg-[#0a0a0a] text-[#f5e6c8] relative overflow-hidden serif">
      {/* Gold border */}
      <div className="absolute inset-6 border border-[#c9a557]/30" />

      {/* Decorative top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-[#c9a557]" />
          <span className="tracking-[0.4em] text-xs">SAVE THE DATE</span>
          <div className="w-12 h-px bg-[#c9a557]" />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="tracking-[0.2em] text-xs text-[#c9a557] mb-3">17 · ספטמבר · 2026</p>
        <h3 className="text-7xl font-bold mb-2">אביב</h3>
        <p className="text-3xl my-2 text-[#c9a557] italic">&</p>
        <h3 className="text-7xl font-bold mb-6">בר</h3>

        {/* Ornament */}
        <svg width="100" height="20" viewBox="0 0 100 20" className="text-[#c9a557] mb-4">
          <path d="M 0 10 L 40 10 M 60 10 L 100 10 M 50 5 L 55 10 L 50 15 L 45 10 Z" stroke="currentColor" fill="currentColor" strokeWidth="1" />
        </svg>

        <p className="text-sm">גני התערוכה · תל אביב</p>

        <button className="mt-7 px-8 py-2.5 border border-[#c9a557] text-[#c9a557] tracking-[0.3em] text-xs hover:bg-[#c9a557] hover:text-[#0a0a0a] transition-colors">
          RSVP
        </button>
      </div>
    </div>
  );
}

function ModernTheme() {
  return (
    <div className="aspect-[16/10] bg-[#FFF1E0] text-[#1A1814] relative overflow-hidden">
      {/* Geometric background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF6B47]" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#00D27E]" />
      <div className="absolute top-1/4 left-12 w-20 h-20 rounded-full border-4 border-[#1A1814]" />
      <div className="absolute bottom-1/4 right-1/3 w-12 h-12 rounded-full bg-[#FFD23F]" />

      <div className="absolute inset-0 grid grid-cols-2 px-12 py-10">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold tracking-[0.4em] mb-4 text-[#1A1814]/60">17.09.2026</p>
          <h3 className="text-7xl font-black leading-[0.9] mb-3 tracking-tight">
            אביב<br />
            <span className="text-[#FF6B47]">&</span><br />
            בר
          </h3>
          <div className="w-16 h-1 bg-[#1A1814] my-3" />
          <p className="text-sm font-medium">גני התערוכה · תל אביב</p>
        </div>

        <div className="flex flex-col justify-center items-end pr-6">
          <div className="bg-[#1A1814] text-[#FFF1E0] rounded-2xl p-6 max-w-xs">
            <p className="text-[10px] text-[#FFD23F] font-bold tracking-wider mb-1">CELEBRATION</p>
            <p className="display text-2xl mb-3 leading-tight">בואו לחגוג איתנו.</p>
            <button className="bg-[#FFD23F] text-[#1A1814] px-5 py-2 rounded-full text-sm font-bold w-full">
              אישור הגעה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RusticTheme() {
  return (
    <div className="aspect-[16/10] bg-gradient-to-br from-[#E8DCC4] via-[#DEC9A6] to-[#C9B59B] text-[#3D2817] relative overflow-hidden serif">
      {/* Botanical decorations */}
      <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full opacity-30">
        <g stroke="#5A6B3F" fill="none" strokeWidth="1.5">
          <path d="M 50 80 Q 80 120, 70 180 Q 60 240, 80 290" />
          <path d="M 55 110 Q 35 105, 25 95" />
          <path d="M 70 150 Q 95 145, 110 130" />
          <path d="M 65 200 Q 40 200, 25 215" />
          <path d="M 75 240 Q 100 245, 115 235" />
        </g>
        <g stroke="#5A6B3F" fill="none" strokeWidth="1.5">
          <path d="M 740 50 Q 770 100, 760 160 Q 750 220, 770 280" />
          <path d="M 745 80 Q 770 75, 785 65" />
          <path d="M 760 120 Q 735 115, 720 100" />
          <path d="M 755 170 Q 780 170, 795 185" />
        </g>
        {/* Small leaves scattered */}
        <ellipse cx="200" cy="450" rx="20" ry="6" fill="#5A6B3F" opacity="0.4" transform="rotate(-30 200 450)" />
        <ellipse cx="580" cy="430" rx="22" ry="7" fill="#5A6B3F" opacity="0.4" transform="rotate(20 580 430)" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p className="text-xs italic mb-2 text-[#5A6B3F]">— with love —</p>
        <p className="tracking-[0.2em] text-[10px] mb-3">17 · 09 · 2026</p>

        <h3 className="text-6xl font-medium mb-1">Aviv</h3>
        <p className="serif italic text-3xl my-1 text-[#A8804C]">&</p>
        <h3 className="text-6xl font-medium mb-5">Bar</h3>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[#A8804C] text-xl">✿</span>
          <p className="text-sm tracking-wider">גני התערוכה · תל אביב</p>
          <span className="text-[#A8804C] text-xl">✿</span>
        </div>

        <button className="px-8 py-3 bg-[#5A6B3F] text-[#E8DCC4] rounded-full text-xs tracking-[0.3em] hover:bg-[#3D4A2A] transition-colors">
          אישור הגעה
        </button>
      </div>
    </div>
  );
}

function FestiveTheme() {
  return (
    <div className="aspect-[16/10] bg-gradient-to-br from-[#FF5BAB] via-[#FF6B47] to-[#FFD23F] text-[#1A0A14] relative overflow-hidden">
      {/* Confetti elements */}
      <span className="absolute top-10 left-20 text-3xl">✦</span>
      <span className="absolute top-20 right-32 text-2xl">✦</span>
      <span className="absolute bottom-32 left-32 text-4xl rotate-12 inline-block">✦</span>
      <span className="absolute bottom-20 right-20 text-3xl">★</span>
      <span className="absolute top-1/2 left-1/4 text-2xl">●</span>
      <span className="absolute top-1/3 right-1/3 text-3xl rotate-45 inline-block">▲</span>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <span className="inline-block bg-[#1A0A14] text-[#FFD23F] px-4 py-1 rounded-full text-xs font-black tracking-[0.4em] mb-5 -rotate-3">
          NIGHT TO REMEMBER
        </span>

        <h3 className="display-tight text-8xl text-[#1A0A14] mb-2 leading-none">
          AVIV
        </h3>
        <span className="display text-5xl text-white my-1">+</span>
        <h3 className="display-tight text-8xl text-[#1A0A14] mb-6 leading-none">
          BAR
        </h3>

        <div className="bg-[#1A0A14] text-[#FFD23F] px-6 py-3 rounded-full inline-flex items-center gap-3 mb-5">
          <span className="display text-lg">17.09.2026</span>
          <span>•</span>
          <span className="text-sm">תל אביב</span>
        </div>

        <button className="px-8 py-3 bg-[#1A0A14] text-[#FFD23F] rounded-full font-bold hover:scale-105 transition-transform">
          🎉 בואו לחגוג!
        </button>
      </div>
    </div>
  );
}

/* ===== PROCESS ILLUSTRATION ===== */
function ProcessIllustration() {
  return (
    <div className="mt-24 md:mt-32">
      <div className="text-center mb-10">
        <p className="text-emerald font-semibold text-sm tracking-[0.3em] uppercase mb-3">
          ─── איך זה נבנה ───
        </p>
        <h3 className="display text-3xl md:text-5xl text-ink">
          התהליך — <span className="highlight-emerald">7 שלבים. דקות בודדות.</span>
        </h3>
      </div>

      <div className="bg-ink rounded-3xl p-6 md:p-10 shadow-2xl shadow-ink/20 relative overflow-hidden">
        {/* Decorative halo */}
        <div className="absolute top-0 left-0 w-96 h-96 halo-emerald blur-3xl opacity-30" />

        <div className="relative grid lg:grid-cols-12 gap-8 items-center">
          {/* Right: Wizard mockup */}
          <div className="lg:col-span-7">
            <div className="bg-cream rounded-2xl p-6 shadow-xl">
              {/* Progress bar */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((n, i) => (
                  <div
                    key={n}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < 4 ? 'bg-coral' : i === 4 ? 'bg-coral/50' : 'bg-ink/10'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-ink/50 mb-1">שלב 5 מתוך 7</p>
              <h4 className="display text-2xl text-ink mb-5">בחר ערים שמהן יוצאות הסעות</h4>

              {/* City chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                {['תל אביב', 'רמת גן', 'הרצליה', 'פתח תקווה', 'נתניה', 'רחובות'].map((c, i) => (
                  <span
                    key={c}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      i < 4
                        ? 'bg-emerald text-ink'
                        : 'bg-ink/5 text-ink/60'
                    }`}
                  >
                    {i < 4 && '✓ '}
                    {c}
                  </span>
                ))}
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-ink/5 text-ink/40 border border-dashed border-ink/30">
                  + הוסף עיר
                </span>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-ink/10">
                <button className="text-ink/60 text-sm font-semibold">← חזור</button>
                <button className="bg-ink text-cream px-6 py-2.5 rounded-full text-sm font-semibold">
                  הבא ←
                </button>
              </div>
            </div>
          </div>

          {/* Left: Steps list */}
          <div className="lg:col-span-5 text-cream">
            <p className="text-emerald text-xs font-semibold tracking-widest mb-3 uppercase">
              The Wizard
            </p>
            <h3 className="display text-3xl text-cream mb-5">
              שלבי <br />
              <span className="text-gradient-fresh">בניית האתר</span>
            </h3>
            <ol className="space-y-2">
              {[
                'התחברות בגוגל',
                'בחירת חבילה',
                'בחירת כתובת (slug)',
                'בחירת עיצוב',
                'פרטי אירוע + ערים',
                'משמרות חזרה',
                'שמירה — אתר חי',
              ].map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i < 4 ? 'bg-emerald text-ink' : i === 4 ? 'bg-coral text-cream' : 'bg-cream/10 text-cream/50'
                    }`}
                  >
                    {i < 4 ? '✓' : i + 1}
                  </span>
                  <span className={i === 4 ? 'text-cream font-semibold' : 'text-cream/70'}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== ADMIN PANEL ILLUSTRATION ===== */
function AdminIllustration() {
  return (
    <div className="mt-24 md:mt-32">
      <div className="text-center mb-10">
        <p className="text-coral font-semibold text-sm tracking-[0.3em] uppercase mb-3">
          ─── הפאנל ניהול ───
        </p>
        <h3 className="display text-3xl md:text-5xl text-ink">
          כל הפרטים. <span className="highlight-coral">במסך אחד.</span>
        </h3>
      </div>

      <div className="bg-paper rounded-3xl p-3 shadow-2xl shadow-ink/15 ring-1 ring-ink/10 overflow-hidden">
        <div className="bg-ink-soft px-4 py-2.5 rounded-t-2xl flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-coral/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald/70" />
          </div>
          <span className="text-cream/60 text-xs font-mono mr-auto">app.rideup.co.il/aviv-bar</span>
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Sidebar */}
          <div className="col-span-3 lg:col-span-2 bg-ink rounded-2xl p-4 text-cream">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-cream/10">
              <div className="w-8 h-8 rounded-lg bg-coral flex items-center justify-center display text-xs">A</div>
              <div className="hidden lg:block">
                <p className="text-xs display">אביב & בר</p>
                <p className="text-[10px] text-cream/50">Pro · פעיל</p>
              </div>
            </div>

            <ul className="space-y-1">
              {[
                { i: BarChart3, l: 'סטטיסטיקות', active: false },
                { i: Users, l: 'רישומים', active: true, badge: '47' },
                { i: MapPin, l: 'תכנון נסיעה', active: false },
                { i: Settings, l: 'עיצוב', active: false },
                { i: FileText, l: 'הגדרות', active: false },
              ].map((item) => (
                <li
                  key={item.l}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    item.active ? 'bg-coral text-cream' : 'text-cream/70 hover:bg-cream/5'
                  }`}
                >
                  <item.i className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span className="hidden lg:block flex-1 truncate">{item.l}</span>
                  {item.badge && (
                    <span className={`hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-full ${
                      item.active ? 'bg-cream text-coral' : 'bg-coral/30 text-coral'
                    }`}>{item.badge}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Main content */}
          <div className="col-span-9 lg:col-span-10 space-y-3">
            {/* Top stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'סך אורחים', val: '247', delta: '+12', color: 'coral' },
                { label: 'ערים', val: '8', delta: '+1', color: 'emerald' },
                { label: 'אישרו', val: '189', delta: '+8', color: 'gold' },
                { label: 'יומיים', val: '92%', delta: 'מלא', color: 'pink' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-ink/8">
                  <p className="text-[10px] text-ink/55 mb-1">{s.label}</p>
                  <p className="display text-2xl text-ink">{s.val}</p>
                  <p className={`text-[10px] mt-0.5 text-${s.color}`}>↑ {s.delta}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-ink/8 overflow-hidden">
              <div className="px-4 py-3 border-b border-ink/8 flex items-center justify-between">
                <p className="display text-sm text-ink">רישומים אחרונים</p>
                <span className="text-[10px] text-ink/50">מציג 5 מתוך 47</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-cream-soft text-ink/60">
                  <tr>
                    <th className="text-right py-2 px-3 font-semibold">שם</th>
                    <th className="text-right py-2 px-3 font-semibold">טלפון</th>
                    <th className="text-right py-2 px-3 font-semibold">עיר</th>
                    <th className="text-right py-2 px-3 font-semibold">משמרת</th>
                    <th className="text-right py-2 px-3 font-semibold">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['דנה כהן', '050-1234567', 'תל אביב', 'סבב א\'', 'אישר', 'emerald'],
                    ['יוסי לוי', '054-9876543', 'רמת גן', 'סבב ב\'', 'אישר', 'emerald'],
                    ['מירב ברק', '052-1122334', 'הרצליה', 'סבב א\'', 'ממתין', 'gold'],
                    ['רן שמיר', '050-5544332', 'תל אביב', 'סבב א\'', 'אישר', 'emerald'],
                    ['נועה עזרא', '054-7788990', 'פתח תקווה', 'סבב ב\'', 'אישר', 'emerald'],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-ink/5 hover:bg-cream-soft/50">
                      <td className="py-2 px-3 text-ink display">{row[0]}</td>
                      <td className="py-2 px-3 text-ink/70 font-mono text-[10px]">{row[1]}</td>
                      <td className="py-2 px-3 text-ink/70">{row[2]}</td>
                      <td className="py-2 px-3 text-ink/70">{row[3]}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-${row[5]}/15 text-${row[5]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-${row[5]}`} />
                          {row[4]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
