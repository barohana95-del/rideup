import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, MapPin } from 'lucide-react';

const DEFAULT_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה',
  'אשדוד', 'נתניה', 'בני ברק', 'חולון', 'רמת גן',
  'באר שבע', 'הרצליה', 'כפר סבא', 'רחובות', 'רעננה',
  'מודיעין', 'בית שמש', 'אשקלון', 'נצרת',
];

export default function Step5Cities({
  cities,
  onChange,
}: {
  cities: string[];
  onChange: (cs: string[]) => void;
}) {
  const [custom, setCustom] = useState('');

  const toggle = (c: string) => {
    if (cities.includes(c)) onChange(cities.filter((x) => x !== c));
    else onChange([...cities, c]);
  };

  const addCustom = () => {
    const c = custom.trim();
    if (!c || cities.includes(c)) return;
    onChange([...cities, c]);
    setCustom('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Selected count */}
      <div className="text-center mb-6">
        <p className="text-sm" style={{ color: '#6B7C95' }}>
          נבחרו <span className="font-bold" style={{ color: '#1E63D6' }}>{cities.length}</span> ערים
        </p>
      </div>

      {/* Selected cities */}
      {cities.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl" style={{ background: '#EAF1FB', border: '1px solid rgba(30,99,214,0.15)' }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#1E63D6' }}>
            נבחרו
          </p>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{ background: '#1E63D6', color: '#fff' }}
              >
                <MapPin className="w-3 h-3" />
                {c}
                <button
                  onClick={() => toggle(c)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  aria-label={`הסר ${c}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Default city pool */}
      <div className="mb-6">
        <p className="text-sm font-bold mb-3" style={{ color: '#0A1F44' }}>
          ערים פופולריות
        </p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_CITIES.map((c) => {
            const selected = cities.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggle(c)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: selected ? '#0A1F44' : '#fff',
                  color: selected ? '#fff' : '#3D4F6B',
                  border: selected ? '1px solid #0A1F44' : '1px solid rgba(30,99,214,0.15)',
                }}
              >
                {selected && '✓ '}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom city */}
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: '#0A1F44' }}>
          לא רואה את העיר שלך?
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="הוסף עיר ידנית..."
            className="flex-1 px-4 py-3 text-base focus:outline-none transition-all"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(30,99,214,0.15)',
              borderRadius: '14px',
              color: '#0A1F44',
            }}
          />
          <button
            onClick={addCustom}
            disabled={!custom.trim()}
            className="px-5 py-3 rounded-2xl font-bold transition-all disabled:opacity-40 inline-flex items-center gap-2"
            style={{ background: '#1E63D6', color: '#fff' }}
          >
            <Plus className="w-4 h-4" />
            הוסף
          </button>
        </div>
      </div>
    </motion.div>
  );
}
