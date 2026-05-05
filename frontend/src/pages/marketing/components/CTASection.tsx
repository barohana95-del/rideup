import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden text-center"
          style={{
            background: 'linear-gradient(145deg, #0A1F44 0%, #061331 100%)',
            borderRadius: '32px',
            padding: '64px 40px',
          }}
        >
          {/* Decorative glows */}
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.2) 0%, transparent 65%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(30,99,214,0.15) 0%, transparent 65%)' }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative">
            {/* Trial badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8"
              style={{ background: 'rgba(30,99,214,0.15)', color: '#1E63D6', border: '1px solid rgba(30,99,214,0.25)' }}
            >
              ✦ 14 יום ניסיון. ללא כרטיס אשראי.
            </div>

            <h2 className="display text-4xl md:text-7xl text-white mb-6 reveal-heading" style={{ lineHeight: '1.05' }}>
              מוכן לעבור{' '}
              <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.3)' }}>מאקסל</span>
              <br className="md:hidden" />
              {' '}ל-
              <span style={{ color: '#1E63D6' }}>RideUp</span>?
            </h2>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              ההסעה שלך מתחילה כאן. בחר חבילה, צור אתר, שלח לאורחים.
              כל זה — בפחות זמן ממה שלקח לך לקרוא את המשפט הזה.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="btn-lime text-lg md:text-xl px-10 py-5 inline-flex items-center gap-3 magnetic"
              >
                התחל עכשיו — בחינם
                <ChevronLeft className="w-5 h-5" />
              </a>
              <a
                href="#themes"
                className="text-sm font-medium underline underline-offset-4 transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >
                או צפה בדוגמאות קודם
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <TrustItem emoji="🔒" text="תשלום מאובטח" />
              <TrustItem emoji="⚡" text="הגדרה ב-5 דקות" />
              <TrustItem emoji="💬" text="תמיכה בעברית" />
              <TrustItem emoji="↩️" text="ביטול בכל עת" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{emoji}</span>
      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
    </div>
  );
}
