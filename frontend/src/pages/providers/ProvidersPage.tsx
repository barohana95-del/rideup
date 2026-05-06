import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Star,
  MapPin,
  Bus,
  Phone,
  ShieldCheck,
  Filter,
  Search,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Navbar from '../marketing/components/Navbar';
import Footer from '../marketing/components/Footer';
import './ProvidersPage.css';

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
    color: '#7D39EB',
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
    color: '#C6FF33',
    topReviews: [
      { author: 'תמר ב.', date: '20.04.26', rating: 5, text: 'קיבלתי הצעה תוך שעה. הנהג היה אדיב מאוד.' },
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
    color: '#7D39EB',
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
    color: '#C6FF33',
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
    <div dir="rtl" className="providers-page">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="providers-hero section--wrapped">
          {/* Ambient Orbs */}
          <div className="bg-orb bg-orb--purple" style={{ top: '-10%', right: '-10%' }} />
          <div className="bg-orb bg-orb--lime" style={{ bottom: '-10%', left: '-10%' }} />
          
          <div className="container relative z-10">
            <div className="providers-hero__content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="eyebrow eyebrow--white"
              >
                ספקים מאומתים בלבד
              </motion.div>

              <h1 className="providers-hero__title">
                מצאו את הספק <br />
                <span className="text-gradient">המושלם לאירוע שלכם</span>
              </h1>
              
              <p className="providers-hero__desc">
                כל חברות ההסעות המובילות בישראל במקום אחד. דירוג, חוות דעת בזמן אמת, והצעות מחיר בלחיצת כפתור.
              </p>

              {/* Search Bar */}
              <div className="providers-search">
                <div className="search-field">
                  <Search size={20} className="icon" />
                  <input 
                    type="text" 
                    placeholder="חפשו חברה..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="filter-field">
                  <Filter size={18} className="icon" />
                  <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary">חיפוש</button>
              </div>

              <div className="providers-stats">
                <div className="stat-item">
                  <ShieldCheck size={18} />
                  <span><strong>200+</strong> ספקים</span>
                </div>
                <div className="stat-item">
                  <Star size={18} fill="var(--color-blue-light)" />
                  <span>דירוג ממוצע <strong>4.8</strong></span>
                </div>
                <div className="stat-item">
                  <TrendingUp size={18} />
                  <span><strong>5,000+</strong> הזמנות</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="providers-list py-20">
          <div className="container">
            <div className="list-header">
              <h3>נמצאו {filtered.length} ספקים מובילים</h3>
              <div className="sort-by">
                <span>סדר לפי:</span>
                <select>
                  <option>דירוג גבוה</option>
                  <option>הכי הרבה ביקורות</option>
                  <option>מחיר נמוך</option>
                </select>
              </div>
            </div>

            <div className="providers-grid">
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

function ProviderCard({ provider, index }: { provider: any, index: number }) {
  return (
    <motion.div 
      className="provider-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="provider-card__header">
        <div className="provider-brand" style={{ background: provider.color }}>
          {provider.name[0]}
        </div>
        <div className="provider-info">
          <div className="name-wrap">
            <h4>{provider.name}</h4>
            <div className="rating">
              <Star size={14} fill="var(--color-blue-light)" color="var(--color-blue-light)" />
              <strong>{provider.rating}</strong>
              <span>({provider.reviews})</span>
            </div>
          </div>
          <div className="location">
            <MapPin size={14} />
            <span>{provider.region}</span>
          </div>
        </div>
      </div>

      <p className="provider-desc">{provider.description}</p>

      <div className="provider-badges">
        {provider.badges.map((b: string) => (
          <span key={b} className="badge">
            <ShieldCheck size={12} />
            {b}
          </span>
        ))}
      </div>

      <div className="provider-features">
        <div className="p-feat">
          <span className="label">צי רכבים</span>
          <span className="val">{provider.fleet}</span>
        </div>
        <div className="p-feat">
          <span className="label">מקומות</span>
          <span className="val">{provider.range}</span>
        </div>
        <div className="p-feat">
          <span className="label">החל מ-</span>
          <span className="val highlight">₪{provider.priceFrom}</span>
        </div>
      </div>

      {provider.topReviews.length > 0 && (
        <div className="provider-review">
          <div className="review-meta">
            <strong>{provider.topReviews[0].author}</strong>
            <span>{provider.topReviews[0].date}</span>
          </div>
          <p>"{provider.topReviews[0].text}"</p>
        </div>
      )}

      <div className="provider-actions">
        <button className="btn btn-primary w-full">
          בקש הצעת מחיר
          <Phone size={18} />
        </button>
        <button className="btn btn-outline w-full">
          פרטים נוספים
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
