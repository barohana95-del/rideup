import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'כמה זמן לוקח להקים אתר חדש?',
    a: 'בממוצע 5-7 דקות. ה-onboarding wizard מנחה אותך שלב-שלב — בחירת חבילה, עיצוב, פרטי אירוע, ערים, משמרות חזרה. בסוף יש לך אתר חי.',
  },
  {
    q: 'האם אני יכול לשנות את העיצוב אחרי שהקמתי?',
    a: 'בהחלט. בפאנל הניהול יש Tab "עיצוב" שם תוכל להחליף theme, לשנות צבעים, להחליף לוגו ופונט — בכל זמן.',
  },
  {
    q: 'מה קורה אחרי האירוע?',
    a: 'הנתונים שלך נשמרים לעד בארכיון. תוכל לגשת אליהם, לייצא Excel, ואפילו "להעתיק לאירוע חדש" כשתצטרך. האתר עצמו יורד לרוב 30 יום אחרי תאריך האירוע.',
  },
  {
    q: 'מה קורה אם אני רוצה לשנות את ה-slug (כתובת האתר)?',
    a: 'אפשר לשנות בכל עת מהפאנל, חינם. רק זכור שהקישור הישן יפסיק לעבוד — כך שתצטרך להפיץ את החדש.',
  },
  {
    q: 'האם אורחים צריכים להירשם / להתחבר כדי למלא?',
    a: 'לא. אורחים פשוט נכנסים לקישור, ממלאים שם וטלפון, ומאשרים. בלי חשבון, בלי סיסמה.',
  },
  {
    q: 'האם יש מגבלה על מספר האורחים?',
    a: 'תלוי בחבילה. Trial: 100. Basic: 50. Pro: 250. Premium: ללא הגבלה. אפשר לשדרג בכל עת.',
  },
  {
    q: 'איך זה עובד מבחינת תשלום?',
    a: 'תשלום חד-פעמי פר-אירוע. בלי מנויים חודשיים, בלי הפתעות. מחיר אחד, אתר אחד. תומכים בכל כרטיסי האשראי הגדולים.',
  },
  {
    q: 'האם זה רק לחתונות?',
    a: 'לא. RideUp מתאים לחתונות, בר/בת מצווה, ימי הולדת, אירועי חברה — כל אירוע שצריך הסעות. בחירת סוג האירוע היא חלק מה-onboarding.',
  },
  {
    q: 'איך אתם מתקשרים עם לקוחות לתמיכה?',
    a: 'WhatsApp ו-Email בעיקר. מענה תוך 24 שעות (לרוב מהר יותר). חבילת Premium כוללת תמיכת VIP עם עדיפות.',
  },
  {
    q: 'האם הנתונים שלי מאובטחים?',
    a: 'כן. כל התקשורת ב-HTTPS, סיסמאות ב-Hashing, גישה רק דרך Google OAuth. אנחנו לא שולחים את הנתונים שלך לצד שלישי.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 relative" style={{ background: '#EAF1FB' }}>
      {/* Divider */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(30,99,214,0.15), transparent)' }}
      />

      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
            style={{ background: 'rgba(30,99,214,0.1)', color: '#1E63D6', border: '1px solid rgba(30,99,214,0.2)' }}
          >
            שאלות נפוצות
          </span>
          <h2 className="display text-4xl md:text-6xl reveal-heading" style={{ color: '#0A1F44' }}>
            יש שאלה?{' '}
            <span style={{ color: '#1E63D6' }}>יש תשובה.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden transition-all duration-300"
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  border: isOpen ? '1px solid rgba(30,99,214,0.25)' : '1px solid rgba(30,99,214,0.08)',
                  boxShadow: isOpen ? '0 8px 32px -8px rgba(30,99,214,0.15)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-right"
                >
                  <span className="font-bold text-lg md:text-xl flex-1" style={{ color: '#0A1F44' }}>
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isOpen ? '#1E63D6' : 'rgba(30,99,214,0.1)',
                      color: isOpen ? '#fff' : '#1E63D6',
                    }}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 pt-1 leading-relaxed" style={{ color: '#6B7C95' }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-10" style={{ color: '#6B7C95' }}>
          לא מצאת?{' '}
          <a href="#" className="font-bold underline underline-offset-4" style={{ color: '#1E63D6' }}>
            שלח לנו ב-WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
