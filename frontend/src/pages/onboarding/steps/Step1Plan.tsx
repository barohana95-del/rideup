import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import type { TenantPlan } from '../../../types';

const plans: { key: TenantPlan; name: string; price: string; period: string; desc: string; features: string[]; popular?: boolean; comingSoon?: boolean }[] = [
  {
    key: 'trial',
    name: 'נסיון',
    price: 'חינם',
    period: '14 יום',
    desc: 'ללא כרטיס אשראי. בדוק לפני שאתה משלם.',
    features: ['עד 100 אורחים', 'כל 4 העיצובים', 'אימייל אישור'],
  },
  {
    key: 'basic',
    name: 'בסיסי',
    price: '₪149',
    period: 'חד-פעמי',
    desc: 'לאירועים קטנים, חברים ומשפחה.',
    features: ['עד 50 אורחים', 'עיצוב קלאסי', 'ייצוא Excel', '60 יום גישה'],
  },
  {
    key: 'pro',
    name: 'מקצועי',
    price: '₪349',
    period: 'חד-פעמי',
    desc: 'הבחירה של רוב הזוגות.',
    features: ['עד 250 אורחים', 'כל 4 העיצובים', 'תכנון נסיעה', 'תזכורת SMS'],
    popular: true,
    comingSoon: true,
  },
  {
    key: 'premium',
    name: 'פרימיום',
    price: '₪699',
    period: 'חד-פעמי',
    desc: 'אירועים גדולים, ללא פשרות.',
    features: ['ללא הגבלה', 'WhatsApp', 'ספקי הסעות', 'תמיכת VIP'],
    comingSoon: true,
  },
];

export default function Step1Plan({
  value,
  onChange,
}: {
  value: TenantPlan | null;
  onChange: (p: TenantPlan) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {plans.map((plan, i) => {
        const selected = value === plan.key;
        const disabled = plan.comingSoon;
        return (
          <motion.button
            key={plan.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !disabled && onChange(plan.key)}
            disabled={disabled}
            className="relative text-right rounded-3xl p-6 transition-all"
            style={{
              background: selected ? '#0A1F44' : '#fff',
              border: selected ? '2px solid #1E63D6' : '1px solid rgba(30,99,214,0.15)',
              boxShadow: selected ? '0 16px 40px -12px rgba(30,99,214,0.4)' : '0 2px 12px -4px rgba(10,31,68,0.06)',
              opacity: disabled ? 0.55 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {plan.popular && (
              <span
                className="absolute -top-3 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: '#1E63D6', color: '#fff' }}
              >
                <Sparkles className="w-3 h-3" />
                פופולרי
              </span>
            )}
            {disabled && (
              <span
                className="absolute top-4 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#EAF1FB', color: '#6B7C95' }}
              >
                בקרוב
              </span>
            )}

            <h3 className="display text-xl mb-1" style={{ color: selected ? '#fff' : '#0A1F44' }}>
              {plan.name}
            </h3>
            <p className="text-xs mb-4" style={{ color: selected ? 'rgba(255,255,255,0.65)' : '#6B7C95' }}>
              {plan.desc}
            </p>

            <div className="mb-5">
              <span className="display text-3xl" style={{ color: selected ? '#fff' : '#0A1F44' }}>
                {plan.price}
              </span>
              <span className="text-xs mr-1.5" style={{ color: selected ? 'rgba(255,255,255,0.6)' : '#6B7C95' }}>
                {plan.period}
              </span>
            </div>

            <ul className="space-y-2 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check
                    className="w-3.5 h-3.5 mt-0.5 shrink-0"
                    strokeWidth={3}
                    style={{ color: selected ? '#fff' : '#1E63D6' }}
                  />
                  <span style={{ color: selected ? 'rgba(255,255,255,0.9)' : '#3D4F6B' }}>{f}</span>
                </li>
              ))}
            </ul>

            {selected && (
              <div
                className="absolute bottom-4 left-4 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: '#1E63D6' }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
