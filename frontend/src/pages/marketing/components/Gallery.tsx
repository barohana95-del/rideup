import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Users } from 'lucide-react';

// Demo events gallery — like HappyHome's "Recent Projects"
const events = [
  {
    title: 'אביב & בר',
    type: 'חתונה',
    date: '17.09.2026',
    location: 'גני התערוכה',
    guests: 247,
    cities: 8,
    theme: 'קלאסי',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-toffee',
  },
  {
    title: 'בר מצווה לאיתי',
    type: 'בר מצווה',
    date: '12.06.2026',
    location: 'אולמי מאי',
    guests: 180,
    cities: 5,
    theme: 'מודרני',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-mint-glow',
  },
  {
    title: 'אירוע חברה — Q2',
    type: 'אירועי חברה',
    date: '03.07.2026',
    location: 'נמל תל אביב',
    guests: 320,
    cities: 12,
    theme: 'מודרני',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-coral',
  },
  {
    title: 'דנה ויוסי',
    type: 'חתונה',
    date: '22.06.2026',
    location: 'אחוזת בית',
    guests: 195,
    cities: 6,
    theme: 'כפרי',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-pink',
  },
  {
    title: 'בת מצווה לנעמה',
    type: 'בת מצווה',
    date: '08.10.2026',
    location: 'גן ורדים',
    guests: 140,
    cities: 4,
    theme: 'חגיגי',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-gold',
  },
  {
    title: 'יום הולדת 50',
    type: 'יום הולדת',
    date: '15.05.2026',
    location: 'בית פרטי',
    guests: 85,
    cities: 3,
    theme: 'חגיגי',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    accent: 'bg-mint',
  },
];

export default function Gallery() {
  return (
    <section className="relative bg-onyx text-cream py-24 md:py-32 overflow-hidden">
      {/* Halos */}
      <div className="absolute top-1/4 left-0 w-96 h-96 halo-mint blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 halo-coral blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <p className="text-mint font-semibold text-sm tracking-[0.3em] uppercase mb-4">
              ─── אירועים אחרונים ───
            </p>
            <h2 className="display text-4xl md:text-6xl text-cream">
              אירועים שעובדים{' '}
              <span className="serif italic font-medium text-toffee">איתנו.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 flex items-end justify-end gap-4"
          >
            <a href="#themes" className="btn-secondary text-sm">
              ראה הכל
              <ArrowLeft className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Grid - asymmetric: first card is large */}
        <div className="grid md:grid-cols-3 gap-5">
          {events.map((event, i) => (
            <motion.a
              href="#"
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6 }}
              className={`gallery-tile group relative ${
                i === 1 ? 'md:row-span-2 md:col-span-1' : ''
              }`}
              style={{ height: i === 1 ? '100%' : '320px', minHeight: '320px' }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Top tag */}
              <span
                className={`absolute top-4 right-4 ${event.accent} text-onyx text-xs font-bold px-3 py-1 rounded-full z-10`}
              >
                {event.type}
              </span>

              {/* Theme tag */}
              <span className="absolute top-4 left-4 glass-dark text-cream text-xs px-3 py-1 rounded-full z-10">
                עיצוב {event.theme}
              </span>

              {/* Bottom content */}
              <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                <p className="serif italic text-cream/80 text-sm mb-1">{event.date}</p>
                <h3 className="display text-2xl md:text-3xl text-cream mb-3">
                  {event.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-cream/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-cream/40" />
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.guests} אורחים
                  </span>
                  <span className="w-1 h-1 rounded-full bg-cream/40" />
                  <span>{event.cities} ערים</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-mint-glow text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all">
                  צפה באתר
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
