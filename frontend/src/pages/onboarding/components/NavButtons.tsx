import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function NavButtons({
  onBack,
  onNext,
  canGoNext,
  isFirst,
  isLast,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t" style={{ borderColor: 'rgba(125,57,235,0.1)' }}>
      <button
        onClick={onBack}
        disabled={isFirst}
        className="inline-flex items-center gap-2 px-5 py-3 font-bold rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: '#6B7280' }}
      >
        <ChevronRight className="w-4 h-4" />
        חזור
      </button>

      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-full transition-all"
        style={{
          background: canGoNext ? '#7D39EB' : '#F2EBFF',
          color: canGoNext ? '#fff' : '#6B7280',
          boxShadow: canGoNext ? '0 6px 20px -6px rgba(125,57,235,0.5)' : 'none',
          cursor: canGoNext ? 'pointer' : 'not-allowed',
        }}
      >
        {nextLabel ?? (isLast ? 'סיים והקם אתר' : 'הבא')}
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
