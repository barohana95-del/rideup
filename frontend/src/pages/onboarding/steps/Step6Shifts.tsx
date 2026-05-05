import { motion } from 'motion/react';
import { Plus, X, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Step6Shifts({
  useShifts,
  shifts,
  onChange,
}: {
  useShifts: boolean;
  shifts: string[];
  onChange: (patch: Partial<{ useShifts: boolean; shifts: string[] }>) => void;
}) {
  const [custom, setCustom] = useState('');

  const addShift = () => {
    const s = custom.trim();
    if (!s || shifts.includes(s)) return;
    onChange({ shifts: [...shifts, s] });
    setCustom('');
  };

  const removeShift = (s: string) => {
    onChange({ shifts: shifts.filter((x) => x !== s) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Toggle: do you have return shifts? */}
      <div
        className="p-5 rounded-2xl mb-6"
        style={{ background: '#EAF1FB', border: '1px solid rgba(30,99,214,0.15)' }}
      >
        <p className="text-sm font-bold mb-3" style={{ color: '#0A1F44' }}>
          האם הכנסת ההסעות חזרה כוללת מספר משמרות?
        </p>
        <p className="text-xs mb-4" style={{ color: '#6B7C95' }}>
          לדוגמה: סבב מוקדם בחצות + סבב מאוחר ב-2:00. אם יש רק סבב אחד או שאין משמעות — בחר "לא".
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onChange({ useShifts: true })}
            className="flex-1 py-3 rounded-xl font-bold transition-all"
            style={{
              background: useShifts ? '#1E63D6' : '#fff',
              color: useShifts ? '#fff' : '#0A1F44',
              border: useShifts ? '2px solid #1E63D6' : '1px solid rgba(30,99,214,0.2)',
            }}
          >
            כן, יש משמרות
          </button>
          <button
            onClick={() => onChange({ useShifts: false, shifts: [] })}
            className="flex-1 py-3 rounded-xl font-bold transition-all"
            style={{
              background: !useShifts ? '#1E63D6' : '#fff',
              color: !useShifts ? '#fff' : '#0A1F44',
              border: !useShifts ? '2px solid #1E63D6' : '1px solid rgba(30,99,214,0.2)',
            }}
          >
            לא
          </button>
        </div>
      </div>

      {/* Shifts editor */}
      {useShifts && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="text-sm font-bold mb-3" style={{ color: '#0A1F44' }}>
            משמרות חזרה
          </p>

          {shifts.length > 0 && (
            <div className="space-y-2 mb-4">
              {shifts.map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                  style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.15)' }}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#1E63D6' }} />
                    <span className="font-semibold" style={{ color: '#0A1F44' }}>{s}</span>
                  </span>
                  <button
                    onClick={() => removeShift(s)}
                    className="p-1.5 rounded-full transition-colors hover:bg-red-50"
                    aria-label={`הסר ${s}`}
                  >
                    <X className="w-4 h-4" style={{ color: '#ef4444' }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addShift()}
              placeholder="לדוגמה: סבב א' - 00:00"
              className="flex-1 px-4 py-3 text-base focus:outline-none transition-all"
              style={{
                background: '#fff',
                border: '1.5px solid rgba(30,99,214,0.15)',
                borderRadius: '14px',
                color: '#0A1F44',
              }}
            />
            <button
              onClick={addShift}
              disabled={!custom.trim()}
              className="px-5 py-3 rounded-2xl font-bold transition-all disabled:opacity-40 inline-flex items-center gap-2"
              style={{ background: '#1E63D6', color: '#fff' }}
            >
              <Plus className="w-4 h-4" />
              הוסף
            </button>
          </div>

          <p className="mt-3 text-xs" style={{ color: '#6B7C95' }}>
            💡 פורמט מומלץ: "סבב א' - 00:00", "סבב ב' - 02:00"
          </p>
        </motion.div>
      )}

      {!useShifts && (
        <div className="text-center text-sm py-8" style={{ color: '#6B7C95' }}>
          האורחים לא יראו שאלת משמרת בטופס.
        </div>
      )}
    </motion.div>
  );
}
