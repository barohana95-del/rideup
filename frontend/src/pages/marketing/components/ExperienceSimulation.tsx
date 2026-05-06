import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Palette, 
  Send, 
  LayoutDashboard, 
  Bus, 
  CheckCircle2, 
  Smartphone,
  Clock,
  Zap,
  CheckCircle,
  X
} from 'lucide-react';
import './ExperienceSimulation.css';

const steps = [
  {
    id: 'identity',
    title: 'בחירת זהות',
    description: 'הכל מתחיל בכתובת אתר מותאמת אישית. בחרו את השם שלכם וראו איך המותג נולד.',
    icon: Globe,
    color: 'var(--color-blue-light)'
  },
  {
    id: 'onboarding',
    title: 'הקמה מהירה',
    description: 'מגדירים את פרטי האירוע, בוחרים סגנון עיצובי ומשגרים את המערכת לאוויר ב-2 דקות.',
    icon: Palette,
    color: '#F97316'
  },
  {
    id: 'invitation',
    title: 'חווית האורח',
    description: 'האורחים מקבלים הזמנה מעוצבת ישירות ל-WhatsApp ונרשמים להסעה בקליק.',
    icon: Send,
    color: '#22C55E'
  },
  {
    id: 'dashboard',
    title: 'ניהול חכם',
    description: 'ראו את הנתונים זורמים בזמן אמת. המערכת מחשבת אוטומטית את צרכי התחבורה.',
    icon: LayoutDashboard,
    color: 'var(--color-blue)'
  }
];

export default function ExperienceSimulation() {
  const [activeStep, setActiveStep] = useState(0);
  const [slugInput, setSlugInput] = useState('');
  const [isSlugAvailable, setIsSlugAvailable] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [registrationCount, setRegistrationCount] = useState(148);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStep === 0) {
      setSlugInput('');
      setIsSlugAvailable(false);
      const sequence = async () => {
        await new Promise(r => setTimeout(r, 1000));
        const text = 'wedding-micha-maya';
        for (let i = 1; i <= text.length; i++) {
          setSlugInput(text.slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        await new Promise(r => setTimeout(r, 500));
        setIsSlugAvailable(true);
      };
      sequence();
    }
  }, [activeStep]);

  useEffect(() => {
    if (activeStep === 2) {
      setIsRegistered(false);
      setGuestName('');
      const sequence = async () => {
        await new Promise(r => setTimeout(r, 1500));
        const name = 'דניאל ישראלי';
        for (let i = 1; i <= name.length; i++) {
          setGuestName(name.slice(0, i));
          await new Promise(r => setTimeout(r, 100));
        }
        await new Promise(r => setTimeout(r, 1000));
        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
      };
      sequence();
    }
  }, [activeStep]);

  const activeStepData = steps[activeStep];

  return (
    <div className="exp-sim h-full overflow-hidden">
      <div className="h-full px-4 md:px-8">
        <div className="exp-sim__layout h-full">
          
          <div className="exp-sim__sidebar">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <button 
                  key={step.id}
                  className={`exp-sim__step-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="step-icon" style={{ backgroundColor: isActive ? step.color : 'rgba(255,255,255,0.05)' }}>
                    <Icon size={24} />
                  </div>
                  <div className="step-info">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {isActive && (
                    <motion.div 
                      className="step-progress" 
                      layoutId="stepProgress"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="exp-sim__stage">
            <div className="stage-frame">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeStep}
                  className="stage-view h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  {activeStep === 0 && <IdentityView slugInput={slugInput} isSlugAvailable={isSlugAvailable} />}
                  {activeStep === 1 && <OnboardingView />}
                  {activeStep === 2 && <InvitationView guestName={guestName} isRegistered={isRegistered} />}
                  {activeStep === 3 && <DashboardView registrationCount={registrationCount} />}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="stage-glow" style={{ backgroundColor: activeStepData.color }} />
          </div>

        </div>
      </div>
    </div>
  );
}

function IdentityView({ slugInput, isSlugAvailable }: any) {
  return (
    <div className="view-container flex-center">
      <div className="mock-browser">
        <div className="mock-browser__head">
          <div className="dots"><span /><span /><span /></div>
          <div className="address-bar">rideup.io/signup</div>
        </div>
        <div className="mock-browser__body p-12">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-2xl font-bold mb-8 text-navy">איך יקראו לאתר שלכם?</h4>
            <div className="relative">
              <div className="slug-input-wrap">
                <span className="prefix">rideup.co.il/</span>
                <span className="input-text">{slugInput}</span>
                <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="cursor" />
              </div>
              <AnimatePresence>
                {isSlugAvailable && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="slug-success">
                    <CheckCircle2 size={16} />
                    <span>כתובת פנויה!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className={`btn-mock mt-12 ${isSlugAvailable ? 'active' : ''}`}>המשך להקמה</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-onboarding flex-center h-full">
      <div className="mock-onboarding scale-90">
        <div className="on-card card-1">
          <div className="card-head text-[10px]">בחירת סגנון</div>
          <div className="themes-grid">
            <div className="theme-opt active" />
            <div className="theme-opt" />
            <div className="theme-opt" />
            <div className="theme-opt" />
          </div>
        </div>
        <div className="on-card card-2">
          <div className="card-head text-[10px]">פרטי אירוע</div>
          <div className="form-mock">
            <div className="f-line w-full" />
            <div className="f-line w-3/4" />
          </div>
        </div>
        <div className="on-card card-main">
          <div className="sparkle-icon"><Zap size={32} /></div>
          <h4 className="font-black mb-2">המערכת מוכנה!</h4>
          <div className="progress-bar-mock">
            <motion.div className="fill" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InvitationView({ guestName, isRegistered }: any) {
  return (
    <div className="view-container flex-center h-full">
      <div className="mock-phone scale-75 origin-center">
        <div className="phone-screen">
          <div className="phone-head">
            <Clock size={12} />
            <div className="notch" />
            <div className="icons"><Smartphone size={12} /></div>
          </div>
          <div className="whatsapp-chat p-4 h-full">
            <div className="wa-bubble">
              <p className="text-[10px]">היי דניאל! מוזמנים להירשם להסעה כאן:</p>
              <div className="wa-link text-[10px]">rideup.co.il/micha-maya</div>
            </div>
            <AnimatePresence>
              {guestName && (
                <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="rsvp-sheet">
                  <div className="rsvp-logo" />
                  <h5 className="font-bold text-center text-xs mb-3">אישור הגעה</h5>
                  <div className="rsvp-field">
                    <label className="text-[8px]">שם מלא</label>
                    <div className="field-input text-[10px]">{guestName}</div>
                  </div>
                  <button className={`rsvp-btn text-[10px] py-1 ${isRegistered ? 'success' : ''}`}>
                    {isRegistered ? 'נרשמת בהצלחה!' : 'אישור הגעה'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ registrationCount }: any) {
  return (
    <div className="view-container flex-center h-full">
      <div className="mock-dashboard scale-90 origin-center">
        <div className="dash-sidebar">
          <div className="s-logo" />
          <div className="s-item active"><LayoutDashboard size={18} /></div>
          <div className="s-item"><Bus size={18} /></div>
        </div>
        <div className="dash-main">
          <div className="dash-head"><h5 className="font-black text-xs">ניהול לוגיסטי בזמן אמת</h5></div>
          <div className="dash-stats">
            <div className="d-stat highlight">
              <span>אורחים</span>
              <motion.strong key={registrationCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>{registrationCount}</motion.strong>
            </div>
            <div className="d-stat">
              <span>אוטובוסים</span>
              <strong>3</strong>
            </div>
          </div>
          <div className="bus-card mt-4">
            <div className="bus-head">
              <Bus size={14} className="text-blue" />
              <span className="text-[10px]">קו 1 - תל אביב</span>
              <span className="badge-open text-[8px]">פתוח</span>
            </div>
            <div className="bus-progress">
              <div className="fill w-[85%]" />
            </div>
            <div className="flex justify-between mt-1 text-[8px] font-bold">
              <span className="text-gray-400">42/52</span>
              <span className="text-blue">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
