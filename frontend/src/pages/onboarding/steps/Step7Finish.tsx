import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Palette, Globe } from 'lucide-react';
import type { OnboardingDraft } from '../types';

const defaultsByEvent: Record<string, { invitation: string; instructions: string; thanks: string }> = {
  wedding: {
    invitation: 'בשמחה רבה אנו מזמינים אתכם לחתוננו',
    instructions: 'נא לאשר הגעה עד שבועיים לפני האירוע. הסעות יוצאות מערים שונות — בחרו את העיר שלכם.',
    thanks: 'תודה שאישרת הגעה! נשמח לראות אותך.',
  },
  bar_mitzvah: {
    invitation: 'אנו שמחים להזמין אתכם לבר-מצווה',
    instructions: 'נא לאשר הגעה. הסעות יוצאות בערב האירוע.',
    thanks: 'תודה על אישור ההגעה!',
  },
  bat_mitzvah: {
    invitation: 'אנו שמחים להזמין אתכם לבת-מצווה',
    instructions: 'נא לאשר הגעה. הסעות יוצאות בערב האירוע.',
    thanks: 'תודה על אישור ההגעה!',
  },
  birthday: {
    invitation: 'בואו לחגוג איתנו!',
    instructions: 'נא לאשר הגעה. הסעות יוצאות מהערים שתבחרו.',
    thanks: 'תודה שאישרת! נתראה.',
  },
  corporate: {
    invitation: 'אנו מזמינים אתכם לאירוע החברה',
    instructions: 'נא לאשר הגעה ולבחור עיר יציאה.',
    thanks: 'תודה. נתראה באירוע.',
  },
  other: {
    invitation: 'אנו שמחים להזמין אתכם לאירוע',
    instructions: 'נא לאשר הגעה ולבחור עיר יציאה.',
    thanks: 'תודה על אישור ההגעה!',
  },
};

export default function Step7Finish({
  draft,
  onChange,
}: {
  draft: OnboardingDraft;
  onChange: (patch: Partial<{ invitationText: string; instructionsText: string; thankYouText: string }>) => void;
}) {
  const defaults = defaultsByEvent[draft.eventType ?? 'other'] ?? defaultsByEvent.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Summary card */}
      <div
        className="rounded-3xl p-6 mb-8"
        style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.15)' }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: '#7D39EB' }}>
          <Sparkles className="w-4 h-4" />
          סיכום
        </p>

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <SummaryRow icon={Globe} label="כתובת">
            <span className="font-mono">{draft.slug}.rideup.co.il</span>
          </SummaryRow>
          <SummaryRow icon={Palette} label="עיצוב">
            {draft.theme ?? '—'}
          </SummaryRow>
          <SummaryRow icon={Calendar} label="תאריך">
            {draft.eventDate ? new Date(draft.eventDate).toLocaleDateString('he-IL') : '—'}
            {draft.eventTime && ` · ${draft.eventTime}`}
          </SummaryRow>
          <SummaryRow icon={MapPin} label="מיקום">
            {draft.eventLocation || '—'}
          </SummaryRow>
        </div>

        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 text-xs" style={{ borderColor: 'rgba(125,57,235,0.15)' }}>
          <span className="px-2.5 py-1 rounded-full" style={{ background: '#fff', color: '#000000' }}>
            {draft.cities.length} ערים
          </span>
          {draft.useShifts && (
            <span className="px-2.5 py-1 rounded-full" style={{ background: '#fff', color: '#000000' }}>
              {draft.shifts.length} משמרות
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full font-bold" style={{ background: '#7D39EB', color: '#fff' }}>
            חבילת {draft.plan}
          </span>
        </div>
      </div>

      {/* Texts editor */}
      <div className="space-y-5">
        <TextField
          label="טקסט פתיחה / הזמנה"
          hint="הטקסט הראשון שאורח רואה בכניסה לאתר"
          value={draft.invitationText}
          placeholder={defaults.invitation}
          onChange={(v) => onChange({ invitationText: v })}
          rows={2}
        />
        <TextField
          label="הוראות לאורח"
          hint="הסבר קצר על איך למלא את הטופס"
          value={draft.instructionsText}
          placeholder={defaults.instructions}
          onChange={(v) => onChange({ instructionsText: v })}
          rows={3}
        />
        <TextField
          label="הודעת תודה"
          hint="מה אורח רואה אחרי שאישר הגעה"
          value={draft.thankYouText}
          placeholder={defaults.thanks}
          onChange={(v) => onChange({ thankYouText: v })}
          rows={2}
        />
      </div>

      <p className="mt-6 text-xs text-center" style={{ color: '#6B7280' }}>
        💡 שדות ריקים? נשתמש בטקסט ברירת המחדל. תוכל לשנות הכל אחרי הקמה.
      </p>
    </motion.div>
  );
}

function SummaryRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#7D39EB' }} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6B7280' }}>{label}</p>
        <p className="font-semibold truncate" style={{ color: '#000000' }}>{children}</p>
      </div>
    </div>
  );
}

function TextField({
  label,
  hint,
  value,
  placeholder,
  onChange,
  rows = 2,
}: {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2" style={{ color: '#000000' }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 text-base focus:outline-none transition-all resize-none"
        style={{
          background: '#fff',
          border: '1.5px solid rgba(125,57,235,0.15)',
          borderRadius: '14px',
          color: '#000000',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#7D39EB'; }}
        onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'rgba(125,57,235,0.15)'; }}
      />
      {hint && <p className="mt-1.5 text-xs" style={{ color: '#6B7280' }}>{hint}</p>}
    </div>
  );
}
