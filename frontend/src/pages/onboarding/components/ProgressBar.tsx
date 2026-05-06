import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TOTAL_STEPS, stepTitles } from '../types';

export default function ProgressBar({ step, onStepClick }: { step: number; onStepClick?: (n: number) => void }) {
  const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-8">
      {/* Track */}
      <div className="relative h-1 bg-light-soft rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 right-0 bg-cyan rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ background: '#7D39EB' }}
        />
      </div>

      {/* Steps row */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <button
              key={n}
              onClick={() => done && onStepClick?.(n)}
              disabled={!done}
              className={`flex flex-col items-center gap-1 transition-all ${
                done ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? '#7D39EB' : active ? '#fff' : '#F2EBFF',
                  color: done ? '#fff' : active ? '#7D39EB' : '#6B7280',
                  border: active ? '2px solid #7D39EB' : 'none',
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : n}
              </span>
              <span
                className="text-[10px] hidden md:block transition-colors"
                style={{ color: active ? '#000000' : done ? '#7D39EB' : '#6B7280' }}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Label for current step */}
      <div className="mt-6 text-center">
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#7D39EB' }}>
          שלב {step} מתוך {TOTAL_STEPS}
        </p>
        <h1 className="display text-3xl md:text-5xl mt-2" style={{ color: '#000000' }}>
          {stepTitles[step].title}
        </h1>
        <p className="mt-2 text-sm md:text-base" style={{ color: '#6B7280' }}>
          {stepTitles[step].subtitle}
        </p>
      </div>
    </div>
  );
}
