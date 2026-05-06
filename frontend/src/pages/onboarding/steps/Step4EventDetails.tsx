import { motion } from 'framer-motion';
import { Heart, Cake, PartyPopper, Briefcase, Users, Star } from 'lucide-react';
import type { EventType } from '../../../types';

const eventTypes: { key: EventType; label: string; icon: React.ElementType }[] = [
  { key: 'wedding',     label: 'חתונה',         icon: Heart },
  { key: 'bar_mitzvah', label: 'בר מצווה',      icon: Star },
  { key: 'bat_mitzvah', label: 'בת מצווה',      icon: Star },
  { key: 'birthday',    label: 'יום הולדת',     icon: Cake },
  { key: 'corporate',   label: 'אירוע חברה',    icon: Briefcase },
  { key: 'other',       label: 'אחר',           icon: PartyPopper },
];

export default function Step4EventDetails({
  eventType,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  onChange,
}: {
  eventType: EventType | null;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  onChange: (patch: Partial<{ eventType: EventType; eventTitle: string; eventDate: string; eventTime: string; eventLocation: string }>) => void;
}) {
  const titlePlaceholder =
    eventType === 'wedding' ? 'אביב & בר' :
    eventType === 'bar_mitzvah' ? 'בר מצווה לאיתי' :
    eventType === 'bat_mitzvah' ? 'בת מצווה לנעמה' :
    eventType === 'birthday' ? 'יום הולדת 30' :
    eventType === 'corporate' ? 'אירוע חברה Q4' :
    'שם האירוע';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Event type — pill grid */}
      <div className="mb-8">
        <Label icon={Users}>סוג האירוע</Label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
          {eventTypes.map((t) => {
            const selected = eventType === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange({ eventType: t.key })}
                className="flex flex-col items-center gap-1.5 py-4 rounded-2xl transition-all"
                style={{
                  background: selected ? '#000000' : '#fff',
                  border: selected ? '2px solid #7D39EB' : '1px solid rgba(125,57,235,0.12)',
                  color: selected ? '#fff' : '#000000',
                }}
              >
                <t.icon className="w-5 h-5" strokeWidth={1.8} style={{ color: selected ? '#7D39EB' : '#7D39EB' }} />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <Label>שם האירוע</Label>
        <Input
          value={eventTitle}
          onChange={(v) => onChange({ eventTitle: v })}
          placeholder={titlePlaceholder}
          maxLength={80}
        />
        <Hint>זה הכותרת שתופיע באתר שלך</Hint>
      </div>

      {/* Date + Time */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>תאריך</Label>
          <Input
            type="date"
            value={eventDate}
            onChange={(v) => onChange({ eventDate: v })}
          />
        </div>
        <div>
          <Label>שעה <span className="font-normal" style={{ color: '#6B7280' }}>(אופציונלי)</span></Label>
          <Input
            type="time"
            value={eventTime}
            onChange={(v) => onChange({ eventTime: v })}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label>מקום</Label>
        <Input
          value={eventLocation}
          onChange={(v) => onChange({ eventLocation: v })}
          placeholder="גני התערוכה · תל אביב"
          maxLength={150}
        />
        <Hint>לאן האורחים מגיעים — שם האולם / כתובת</Hint>
      </div>
    </motion.div>
  );
}

function Label({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: '#000000' }}>
      {Icon && <Icon className="w-4 h-4" style={{ color: '#7D39EB' }} />}
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  maxLength,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-4 py-3 text-base focus:outline-none transition-all"
      style={{
        background: '#fff',
        border: '1.5px solid rgba(125,57,235,0.15)',
        borderRadius: '14px',
        color: '#000000',
      }}
      onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#7D39EB'; }}
      onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(125,57,235,0.15)'; }}
    />
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs" style={{ color: '#6B7280' }}>{children}</p>;
}
