import { motion } from 'motion/react';
import { useState } from 'react';
import {
  Star,
  MapPin,
  Bus,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react';
import Nav from '../marketing/components/Nav';
import Footer from '../marketing/components/Footer';

// Mock providers — realistic Israeli companies with fake data
const providers = [
  {
    id: 1,
    name: 'אגד תיירות',
    region: 'ארצי',
    rating: 4.9,
    reviews: 287,
    fleet: '120+ אוטובוסים',
    range: '20-60 מקומות',
    priceFrom: 1500,
    description: 'אחת מחברות ההסעות הגדולות בישראל, ניסיון של עשרות שנים באירועים גדולים.',
    badges: ['מאומת', 'פרימיום', 'ביטוח מורחב'],
    accent: 'bg-coral',
    topReviews: [
      { author: 'מירב כ.', date: '14.04.26', rating: 5, text: 'נהג מקצועי, רכב נקי, בזמן מדויק. ממליצה בחום.' },
      { author: 'יוסי ל.', date: '02.03.26', rating: 5, text: 'שירות אדיב, מחיר הוגן. עבדנו איתם בחתונה — מושלם.' },
    ],
  },
  {
    id: 2,
    name: 'דן הסעות',
    region: 'מרכז',
    rating: 4.7,
    reviews: 156,
    fleet: '45 אוטובוסים',
    range: '15-50 מקומות',
    priceFrom: 1200,
    description: 'מתמחים בהסעות לאירועים פרטיים. שירות אישי וזמינות גבוהה.',
    badges: ['מאומת', 'מהיר תגובה'],
    accent: 'bg-emerald',
    topReviews: [
      { author: 'תמר ב.', date: '20.04.26', rating: 5, text: 'קיבלתי הצעה תוך שעה. הנהג היה אדיב מאוד.' },
      { author: 'דניאל ה.', date: '15.03.26', rating: 4, text: 'טוב, אבל הרכב היה ישן יחסית. עזר עם כל בקשה.' },
    ],
  },
  {
    id: 3,
    name: 'מטרופולין',
    region: 'מרכז',
    rating: 4.8,
    reviews: 412,
    fleet: '230+ אוטובוסים',
    range: '20-65 מקומות',
    priceFrom: 1400,
    description: 'מובילי תחבורה בישראל, אוטובוסים חדשים וצוות מקצועי.',
    badges: ['מאומת', 'פרימיום', 'אוטובוסים חדשים'],
    accent: 'bg-gold',
    topReviews: [
      { author: 'אביגיל ר.', date: '05.05.26', rating: 5, text: 'אוטובוס חדש לגמרי, נוחות מלאה. שירות 5 כוכבים.' },
    ],
  },
  {
    id: 4,
    name: 'נטיב אקספרס',
    region: 'צפון',
    rating: 4.6,
    reviews: 92,
    fleet: '35 אוטובוסים',
    range: '15-50 מקומות',
    priceFrom: 1300,
    description: 'מתמחים באזור הצפון. ניסיון רב באירועי חתונה ובר-מצווה.',
    badges: ['מאומת', 'מקומי'],
    accent: 'bg-pink',
    topReviews: [
      { author: 'רן מ.', date: '28.04.26', rating: 5, text: 'הם מכירים את האזור מצוין. שירות מעולה.' },
    ],
  },
  {
    id: 5,
    name: 'גליל הסעות',
    region: 'צפון',
    rating: 4.5,
    reviews: 71,
    fleet: '20 אוטובוסים',
    range: '15-40 מקומות',
    priceFrom: 1100,
    description: 'חברה משפחתית באזור הגליל. שירות אישי וגישה חמה.',
    badges: ['מאומת', 'משפחתי'],
    accent: 'bg-emerald',
    topReviews: [],
  },
  {
    id: 6,
    name: 'נסיעות ישראל',
    region: 'ארצי',
    rating: 4.7,
    reviews: 198,
    fleet: '85 אוטובוסים',
    range: '20-60 מקומות',
    priceFrom: 1350,
    description: 'פריסה ארצית, מחירים תחרותיים, זמינות גבוהה.',
    badges: ['מאומת', 'מחיר טוב'],
    accent: 'bg-coral',
    topReviews: [],
  },
];

const regions = ['הכל', 'ארצי', 'מרכז', 'צפון', 'דרום', 'ירושלים'];

export default function ProvidersPage() {
  const [region, setRegion] = useState('הכל');
  const [query, setQuery] = useState('');

  const filtered = providers.filter(
    (p) =>
      (region === 'הכל' || p.region === region) &&
      (query === '' || p.name.includes(query))
  );

  return (
    <div dir="rtl" className="bg-cream text-ink min-h-screen">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative pt-24 px-3 md:px-5 pb-5">
          <div className="relative bg-ink text-cream rounded-[2rem] md:rounded-[3rem] overflow-hidden py-16 md:py-24 px-6 md:px-12">
            <div className="absolute top-0 right-1/3 w-96 h-96 halo-coral blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 halo-emerald blur-3xl" />

            <div className="relative max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald/15 text-emerald text-sm font-semibold border border-emerald/30 mb-6"
              >
                <ShieldCheck className="w-4 h-4" />
                ספקים מאומתים בלבד
              </motion.div>

              <h1 className="display-tight text-5xl md:text-7xl text-cream mb-5">
                ספקי הסעות
                <br />
                <span className="text-gradient-warm">בישראל.</span>
              </h1>
              <p className="text-cream/65 text-lg max-w-2xl mx-auto mb-10">
                כל חברות ההסעות המובילות במקום אחד. דירוג, חוות דעת, מחיר ממוצע.
                בחר. השווה. הזמן.
              </p>

              {/* Search + filter bar */}
              <div className="bg-cream rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl mx-auto text-ink shadow-2xl shadow-coral/20">
                <div className="flex items-center gap-2 px-4 flex-1">
                  <Search className="w-5 h-5 text-ink/40 shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="חפש ספק לפי שם..."
                    className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 border-r border-ink/10">
                  <Filter className="w-4 h-4 text-ink/40" />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="bg-transparent py-3 text-sm focus:outline-none cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary py-3 px-5 text-sm shrink-0">חפש</button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-cream/60">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  <span className="text-cream font-semibold">200+</span> ספקים מאומתים
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  דירוג ממוצע <span className="text-cream font-semibold">4.7</span>
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-coral" />
                  <span className="text-cream font-semibold">5,000+</span> הזמנות
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <p className="text-ink/65 text-sm">
                מציג <span className="text-ink font-bold">{filtered.length}</span> מתוך {providers.length}
              </p>
              <select className="bg-white border border-ink/10 rounded-full px-5 py-2 text-sm focus:outline-none cursor-pointer">
                <option>סדר לפי: דירוג גבוה</option>
                <option>סדר לפי: מחיר נמוך</option>
                <option>סדר לפי: כמות חוות דעת</option>
              </select>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {filtered.map((p, i) => (
                <ProviderCard key={p.id} provider={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ProviderCard({ provider, index }: { provider: typeof providers[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 4) * 0.1 }}
      className="bg-white rounded-3xl border border-ink/8 hover:border-coral/40 hover:shadow-2xl transition-all p-6 md:p-7"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-16 h-16 rounded-2xl ${provider.accent} flex items-center justify-center display text-2xl text-ink shrink-0`}>
          {provider.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="display text-2xl text-ink">{provider.name}</h3>
              <p className="text-sm text-ink/55 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {provider.region}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="display text-lg">{provider.rating}</span>
              </div>
              <p className="text-xs text-ink/50">{provider.reviews} ביקורות</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-ink/70 text-sm mb-4 leading-relaxed">{provider.description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {provider.badges.map((b) => (
          <span key={b} className="px-3 py-1 rounded-full bg-emerald/10 text-emerald-deep text-xs font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {b}
          </span>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-ink/8">
        <div>
          <p className="text-[10px] text-ink/50 uppercase tracking-wider mb-1">צי</p>
          <p className="text-sm font-semibold text-ink">{provider.fleet}</p>
        </div>
        <div>
          <p className="text-[10px] text-ink/50 uppercase tracking-wider mb-1">מקומות</p>
          <p className="text-sm font-semibold text-ink">{provider.range}</p>
        </div>
        <div>
          <p className="text-[10px] text-ink/50 uppercase tracking-wider mb-1">מחיר מ-</p>
          <p className="text-sm font-semibold text-coral">₪{provider.priceFrom}</p>
        </div>
      </div>

      {/* Top review */}
      {provider.topReviews[0] && (
        <div className="bg-cream-soft rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="display text-sm">{provider.topReviews[0].author}</span>
              <div className="flex">
                {Array.from({ length: provider.topReviews[0].rating }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                ))}
              </div>
            </div>
            <span className="text-[10px] text-ink/50">{provider.topReviews[0].date}</span>
          </div>
          <p className="serif italic text-sm text-ink/75">"{provider.topReviews[0].text}"</p>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3">
        <button className="btn-primary flex-1 justify-center">
          <Phone className="w-4 h-4" />
          בקש הצעת מחיר
        </button>
        <button className="btn-dark px-5">
          <Bus className="w-4 h-4" />
          פרטים
        </button>
      </div>
    </motion.div>
  );
}
