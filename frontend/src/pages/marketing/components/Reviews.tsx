import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'מירב כ.',
    role: 'התחתנה ב-08.05.26',
    rating: 5,
    quote: 'תוך 3 שעות מההרשמה היה לי אתר RSVP מקצועי. רוב האורחים מילאו תוך יומיים. חוסך אינסוף שעות.',
    initials: 'מ',
    color: '#1E63D6',
  },
  {
    name: 'יוסי ל.',
    role: 'מארגן בר מצווה',
    rating: 5,
    quote: 'הדבר הכי טוב — הייצוא ל-Excel. לקחתי את הרשימה, שלחתי לחברת ההסעות, וכולם הגיעו. אפס בלגן.',
    initials: 'י',
    color: '#1E63D6',
  },
  {
    name: 'נועה ש.',
    role: 'מתחתנת בעוד 4 חודשים',
    rating: 5,
    quote: 'העיצוב הכפרי מושלם לסגנון של החתונה שלנו. החברים שאלו אותי איזה מתכנת בנה לי את זה.',
    initials: 'נ',
    color: '#1E63D6',
  },
  {
    name: 'תמר ב.',
    role: 'מארגנת אירועי חברה',
    rating: 5,
    quote: 'משתמשים פעם בחודש. הdashboard נותן לי שליטה מלאה. בלי אקסלים, בלי טעויות.',
    initials: 'ת',
    color: '#1E63D6',
  },
  {
    name: 'דניאל ה.',
    role: 'התחתן ב-12.04.26',
    rating: 5,
    quote: 'התמיכה של RideUp מטורפת. כתבתי בWhatsApp, ענו לי תוך 10 דקות בליל שישי.',
    initials: 'ד',
    color: '#1E63D6',
  },
  {
    name: 'אביגיל ר.',
    role: 'מארגנת בת מצווה',
    rating: 5,
    quote: 'התכנון האוטומטי של האוטובוסים — חכם בטירוף. חישב בדיוק כמה אוטובוסים לכל עיר.',
    initials: 'א',
    color: '#1E63D6',
  },
  {
    name: 'רן מ.',
    role: 'מתחתן בקיץ',
    rating: 5,
    quote: 'אנחנו בני 30, מצופה מאיתנו אתר נראה טוב. RideUp נתן לנו את זה תוך דקות.',
    initials: 'ר',
    color: '#1E63D6',
  },
];

export default function Reviews() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Divider */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(30,99,214,0.15), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            style={{ background: 'rgba(30,99,214,0.1)', color: '#1E63D6', border: '1px solid rgba(30,99,214,0.2)' }}
          >
            ביקורות
          </span>
          <h2 className="display text-4xl md:text-6xl mb-5 reveal-heading" style={{ color: '#0A1F44' }}>
            <span
              className="inline-block px-3 py-1 rounded-xl"
              style={{ background: 'rgba(30,99,214,0.12)', color: '#1E63D6' }}
            >
              1,247
            </span>{' '}
            אנשים אוהבים
            <br />
            <span style={{ color: '#1E63D6' }}>RideUp.</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="display text-3xl" style={{ color: '#0A1F44' }}>4.9</span>
            <span className="text-sm" style={{ color: '#6B7C95' }}>/ 5</span>
          </div>
        </motion.div>
      </div>

      {/* Row 1 */}
      <div className="relative py-3 mb-4 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #FFFFFF, transparent)' }} />
        <div className="marquee-track gap-5">
          {[...reviews, ...reviews].map((r, i) => (
            <ReviewCard key={`r1-${i}`} review={r} />
          ))}
        </div>
      </div>

      {/* Row 2 — reversed */}
      <div className="relative py-3 marquee-slow overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #FFFFFF, transparent)' }} />
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #FFFFFF, transparent)' }} />
        <div className="marquee-track-rtl gap-5">
          {[...reviews.slice().reverse(), ...reviews.slice().reverse()].map((r, i) => (
            <ReviewCard key={`r2-${i}`} review={r} dark />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, dark }: { review: typeof reviews[number]; dark?: boolean }) {
  return (
    <div
      className="shrink-0 transition-all duration-300"
      style={{
        width: '360px',
        background: dark ? '#0A1F44' : '#fff',
        borderRadius: '20px',
        padding: '24px',
        border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(30,99,214,0.1)',
        boxShadow: dark ? 'none' : '0 4px 20px -8px rgba(10,31,68,0.08)',
      }}
    >
      {/* Quote icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
        style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(30,99,214,0.1)' }}
      >
        <Quote className="w-4 h-4" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#1E63D6' }} />
      </div>

      <p
        className="leading-relaxed mb-5 text-sm"
        style={{ color: dark ? 'rgba(255,255,255,0.8)' : '#3D4F6B' }}
      >
        "{review.quote}"
      </p>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
          style={{ background: review.color, color: review.color === '#1E63D6' ? '#0A1F44' : '#fff' }}
        >
          {review.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base" style={{ color: dark ? '#fff' : '#0A1F44' }}>
            {review.name}
          </p>
          <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.45)' : '#6B7C95' }}>
            {review.role}
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, k) => (
            <Star key={k} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
