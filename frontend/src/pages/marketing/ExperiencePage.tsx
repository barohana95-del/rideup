import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExperienceSimulation from './components/ExperienceSimulation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Users, 
  MessageSquare, 
  BarChart3,
  ChevronDown,
  Laptop,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutDashboard,
  CheckCircle,
  X
} from 'lucide-react';
import './ExperiencePage.css';

export default function ExperiencePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0.35, 0.45], [0.8, 1.3]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.3, 0.4], [100, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div dir="rtl" className="experience-page bg-white text-navy overflow-x-hidden">
      <Navbar />
      
      <main className="experience-main">
        {/* --- Hero Section --- */}
        <section className="exp-hero-wrap py-12 bg-white">
          <div className="container px-4">
            <div className="exp-hero relative overflow-hidden bg-navy text-white rounded-[40px] pt-32 pb-24 shadow-2xl">
              <div className="hero-bg-accent" />
              <div className="container relative z-10 px-8">
                <motion.div 
                  className="max-w-4xl mx-auto text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="eyebrow eyebrow--blue mb-6">Experience RideUp</span>
                  <h1 className="exp-hero__title mb-8">
                    מהפכה לוגיסטיקה <br /> 
                    <span className="text-blue-light">מתחת למכסה המנוע</span>
                  </h1>
                  <p className="exp-hero__desc text-gray-400 text-xl leading-relaxed mb-12">
                    אנחנו לא רק בונים אתרי RSVP. אנחנו בונים מערכת הפעלה שלמה לאירוע שלכם, 
                    המשלבת בינה מלאכותית, אוטומציה מלאה וחווית משתמש ללא פשרות.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-6">
                    <a href="#simulation-anchor" className="btn btn-primary btn-lg">
                      צפו בהדמיה חיה
                    </a>
                    <a href="#tech-specs" className="btn btn-outline-white btn-lg">
                      למפרט הטכני
                    </a>
                  </div>
                </motion.div>
              </div>
              
              <div className="scroll-indicator">
                <motion.div 
                  animate={{ y: [0, 10, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <ChevronDown size={32} />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 1: The Engine (AI & Logic) --- */}
        <section id="tech-specs" className="py-24 bg-white">
          <div className="container px-4">
            <div className="bg-gray-50 rounded-[40px] p-16 md:p-24 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue opacity-10" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <span className="text-blue font-bold uppercase tracking-widest text-sm mb-4 block">הטכנולוגיה שלנו</span>
                  <h2 className="text-5xl md:text-6xl font-black mt-2 mb-10 leading-tight">המוח הלוגיסטי <br />של האירוע</h2>
                  <p className="text-gray-500 text-lg mb-12 max-w-xl">
                    פיתחנו מנוע אופטימיזציה ייחודי שלא רק מסדר רשימות, אלא מקבל החלטות חכמות בזמן אמת כדי לחסוך לכם זמן, כסף וכאבי ראש.
                  </p>
                  <div className="space-y-10">
                    <FeatureItem 
                      icon={<Cpu />}
                      title="אלגוריתם First-Fit-Decreasing"
                      desc="המערכת מחשבת בכל רגע נתון את סידור הנוסעים האופטימלי ביותר, תוך צמצום מספר האוטובוסים ומקסימום תפוסה."
                    />
                    <FeatureItem 
                      icon={<Zap />}
                      title="עדכונים בזמן אמת"
                      desc="כל אישור הגעה חדש מעדכן מיידית את הדאשבורד הלוגיסטי ואת דוחות הנהגים בשידור חי."
                    />
                    <FeatureItem 
                      icon={<ShieldCheck />}
                      title="אבטחת מידע ופרטיות"
                      desc="בנינו תשתית Enterprise מאובטחת המבטיחה שפרטי האורחים והמארגנים מוגנים בסטנדרטים הגבוהים ביותר."
                    />
                  </div>
                </div>
                <div className="relative">
                  <div className="tech-visual-card scale-110">
                    <div className="visual-line" />
                    <div className="visual-line" />
                    <div className="visual-line" />
                    <div className="visual-node top-10 left-10" />
                    <div className="visual-node bottom-20 right-10" />
                    <div className="visual-content">
                      <div className="flex items-center gap-3 mb-4 text-blue-light border-b border-white/10 pb-3">
                        <LayoutDashboard size={18} />
                        <span className="text-xs font-mono uppercase tracking-widest">System Kernel v2.4</span>
                      </div>
                      <pre dir="ltr" className="text-xs text-blue-400 font-mono leading-relaxed">
                        {`{
  "optimization": {
    "engine": "RideUp-v2",
    "strategy": "MAX_CAPACITY",
    "buses_saved": 4,
    "efficiency": "98.4%"
  },
  "nodes": [
    { "id": "TLV_01", "guests": 52 },
    { "id": "JER_04", "guests": 31 }
  ],
  "status": "CALCULATING_OPTIMAL_PATH..."
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 2: The Core Experience (Simulation with Scroll Zoom) --- */}
        <section ref={containerRef} id="simulation-anchor" className="exp-simulation-wrap py-24 bg-white">
          <div className="container px-4">
            <div className="exp-simulation-trigger relative bg-navy text-white rounded-[40px] overflow-hidden shadow-2xl h-[300vh]">
              <div className="sticky-container sticky top-0 h-screen flex flex-col items-center justify-center">
                <motion.div 
                  className="text-center mb-12"
                  style={{ opacity }}
                >
                  <h2 className="text-4xl md:text-6xl font-black mb-6">המערכת בפעולה</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    חוויה לוגיסטית מקצה לקצה בתוך הממשק שלנו
                  </p>
                </motion.div>

                <motion.div 
                  className="laptop-mockup relative w-full max-w-[1000px] z-20"
                  style={{ scale, y }}
                >
                  <div className="laptop-mockup__screen bg-black rounded-[20px] p-2 border-[12px] border-[#222] shadow-2xl relative">
                    <div className="screen-inner bg-white h-[500px] rounded-[10px] overflow-hidden">
                      <ExperienceSimulation />
                    </div>
                  </div>
                  <div className="laptop-mockup__base h-4 bg-[#333] rounded-b-[20px] w-[105%] -ml-[2.5%] relative z-10 shadow-xl" />
                  <div className="laptop-mockup__trackpad w-1/3 h-1 bg-[#444] mx-auto rounded-b-xl" />
                </motion.div>

                {/* Background elements that react to scroll */}
                <motion.div 
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 0.2]) }}
                >
                  <div className="bg-orb bg-orb--purple top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150" />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 3: The Process --- */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">המסע שלכם עם RideUp</h2>
              <p className="text-gray-500">4 שלבים פשוטים לחופש לוגיסטי</p>
            </div>
            <div className="process-timeline">
              <ProcessStep 
                num="01"
                title="הקמה ואיפיון"
                desc="בוחרים שם לאתר, מגדירים את סוג האירוע והערים המשתתפות. המערכת מקימה את התשתית בשניות."
              />
              <ProcessStep 
                num="02"
                title="עיצוב ומיתוג"
                desc="מתאימים את האתר לשפה העיצובית של האירוע שלכם – צבעים, לוגו ותמונות אווירה."
              />
              <ProcessStep 
                num="03"
                title="הפצה ורישום"
                desc="שולחים לינק ייחודי לאורחים ב-WhatsApp. הם נרשמים, ואתם רואים את הנתונים זורמים."
              />
              <ProcessStep 
                num="04"
                title="ניהול וסידור"
                desc="המערכת מסדרת את האוטובוסים ומפיקה דוחות נהגים. אתם רק צריכים לאשר."
              />
            </div>
          </div>
        </section>

        {/* --- Section 4: Comparison --- */}
        <section className="py-24 bg-white">
          <div className="container px-4">
            <div className="bg-navy text-white rounded-[40px] p-12 md:p-24 relative overflow-hidden shadow-2xl">
              <div className="hero-bg-accent opacity-50" />
              <h2 className="text-5xl md:text-6xl font-black text-center mb-20 relative z-10 leading-tight">RideUp vs. הדרך הישנה</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                <div className="compare-card old p-12 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                  <h4 className="text-3xl font-bold mb-10 text-red-400 flex items-center gap-4">
                    <XCircle className="text-red-500 w-8 h-8" />
                    פעם (לפני RideUp)
                  </h4>
                  <ul className="space-y-8">
                    <li className="flex gap-4 text-white text-lg font-medium">
                      <X size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      <span>טבלאות אקסל מסורבלות שמתעדכנות ידנית</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-medium">
                      <X size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      <span>טלפונים והודעות אינסופיות לכל אורח</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-medium">
                      <X size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      <span>אי ודאות לגבי מספר האוטובוסים הנדרש</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-medium">
                      <X size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      <span>בלאגן ביום האירוע מול הנהגים</span>
                    </li>
                  </ul>
                </div>
                <div className="compare-card new p-12 rounded-[32px] bg-blue/20 border border-blue-light/30 relative overflow-hidden backdrop-blur-md shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-light" />
                  <h4 className="text-3xl font-bold mb-10 text-blue-light flex items-center gap-4">
                    <CheckCircle2 className="text-blue-light w-8 h-8" />
                    היום (עם RideUp)
                  </h4>
                  <ul className="space-y-8">
                    <li className="flex gap-4 text-white text-lg font-bold">
                      <CheckCircle size={24} className="text-blue-light flex-shrink-0 mt-1" />
                      <span>דאשבורד אוטומטי שמתעדכן בזמן אמת</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-bold">
                      <CheckCircle size={24} className="text-blue-light flex-shrink-0 mt-1" />
                      <span>הרשמה עצמית של האורחים בממשק מעוצב</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-bold">
                      <CheckCircle size={24} className="text-blue-light flex-shrink-0 mt-1" />
                      <span>אלגוריתם שחוסך לכם כסף על אוטובוסים</span>
                    </li>
                    <li className="flex gap-4 text-white text-lg font-bold">
                      <CheckCircle size={24} className="text-blue-light flex-shrink-0 mt-1" />
                      <span>דוחות נהגים מוכנים להפצה בלחיצת כפתור</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 5: Value Pillars --- */}
        <section className="py-24 bg-white">
          <div className="container px-4">
            <div className="bg-pale rounded-[40px] p-12 md:p-20 shadow-xl">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black mb-4">למה RideUp?</h2>
                <p className="text-gray-400 text-lg">4 עמודי התווך של החוויה שלנו</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ValueCard 
                  icon={<Users className="w-10 h-10" />}
                  title="ניהול אורחים"
                  desc="ממשק אינטואיטיבי המאפשר לאורחים להירשם בקלות, לשנות פרטים ולקבל עדכונים."
                />
                <ValueCard 
                  icon={<MessageSquare className="w-10 h-10" />}
                  title="תקשורת אוטומטית"
                  desc="שליחת לינקים ייעודיים, תזכורות ועדכוני לוגיסטיקה דרך ה-WhatsApp של האורח."
                />
                <ValueCard 
                  icon={<BarChart3 className="w-10 h-10" />}
                  title="דאשבורד בקרה"
                  desc="שליטה מלאה למארגן עם סטטיסטיקות, מפות איסוף וניהול ספקים במקום אחד."
                />
                <ValueCard 
                  icon={<Cpu className="w-10 h-10" />}
                  title="בינה לוגיסטית"
                  desc="חיסכון של עשרות אחוזים בעלויות התחבורה בזכות אלגוריתמיקה מתקדמת."
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 4: Call to Action --- */}
        <section className="py-32 bg-white relative">
          <div className="container">
            <div className="cta-box bg-navy text-white p-12 md:p-24 rounded-[40px] text-center relative overflow-hidden">
              <div className="cta-glow" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black mb-8">מתחילים עכשיו.</h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  הצטרפו למאות מארגני אירועים שכבר הפסיקו לדאוג מהלוגיסטיקה 
                  והתחילו ליהנות מהאירוע שלהם.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <a href="/onboarding" className="btn btn-primary btn-lg px-12">התחילו חינם</a>
                  <a href="/#pricing" className="btn btn-outline-white btn-lg px-12">צפו בחבילות</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-14 h-14 bg-blue/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue group-hover:bg-blue group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc }: any) {
  return (
    <div className="value-card p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="text-blue-light mb-8">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function ProcessStep({ num, title, desc }: any) {
  return (
    <div className="flex items-start gap-8 mb-12 last:mb-0 relative">
      <div className="text-6xl font-black text-gray-100 absolute -right-4 -top-6 z-0 select-none">{num}</div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 max-w-xl">{desc}</p>
      </div>
    </div>
  );
}
