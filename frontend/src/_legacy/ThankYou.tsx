import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MessageSquare, CheckCircle2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Registration } from '../types';

export default function ThankYou() {
  const navigate = useNavigate();
  const [reg, setReg] = useState<Registration | null>(null);
  const [pickupTime, setPickupTime] = useState('18:30');

  useEffect(() => {
    const data = api.getStoredRegistration();
    if (data) setReg(data);
    
    api.getSettings().then(settings => {
      setPickupTime(settings.pickupTime || '18:30');
    });
  }, []);

  const handleWhatsApp = () => {
    if (!reg) return;
    const directionLabel = (!reg.direction || reg.direction === 'round_trip') ? 'הלוך וחזור' : 
                          reg.direction === 'outbound' ? 'רק הלוך' : 'רק חזור';
    
    const text = `היי! נרשמתי להסעה לחתונה של אביב ובר 🎉\nשם: ${reg.fullName}\nכיוון: ${directionLabel}\nעיר: ${reg.city}\nכמות: ${reg.numGuests} אורחים`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCalendar = () => {
    const title = encodeURIComponent('חתונה של אביב ובר 🥂');
    const details = encodeURIComponent('מחכים לראות אתכם! ההסעה תצא מנקודת האיסוף שבחרתם.');
    const location = encodeURIComponent('אגדתא, ישראל');
    const dates = '20260917T163000Z/20260917T230000Z'; // 17.09.2026
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(url, '_blank');
  };

  if (!reg) {
    return (
      <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6">
        <button onClick={() => navigate('/')} className="text-primary font-bold flex items-center gap-2">
          <ArrowRight className="w-5 h-5" /> חזרה לדף הבית
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6 font-heebo" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
        
        <div className="mb-8">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-primary mb-2">נרשמת בהצלחה!</h1>
        <p className="text-primary/60 mb-8 px-4">
          פרטי ההרשמה נשמרו במערכת. נתראה בשמחות!
        </p>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/5 rounded-2xl p-6 mb-8 text-right space-y-4"
        >
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-primary/40 text-[10px] uppercase font-bold">כיוון נסיעה</div>
              <div className="font-bold">
                {(!reg.direction || reg.direction === 'round_trip') ? 'הלוך וחזור' : 
                 reg.direction === 'outbound' ? 'הלוך בלבד' : 'חזור בלבד'}
              </div>
            </div>
          </div>

          {(reg.direction === 'round_trip' || reg.direction === 'outbound') && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-primary/40 text-[10px] uppercase font-bold">שעת איסוף (הלוך)</div>
                <div className="font-bold">{pickupTime}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-primary/40 text-[10px] uppercase font-bold">נקודת איסוף</div>
              <div className="font-bold">{reg.city}</div>
            </div>
          </div>
          
          {(reg.direction === 'round_trip' || reg.direction === 'return') && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="text-primary/40 text-[10px] uppercase font-bold">שעת חזרה</div>
                <div className="font-bold">{reg.returnShift || '01:30'}</div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="h-14 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all text-xs"
            >
              <MessageSquare className="w-4 h-4" />
              עדכון בוואטסאפ
            </button>
            <button
              onClick={handleCalendar}
              className="h-14 rounded-xl bg-white border border-primary/10 text-primary font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
            >
              <Calendar className="w-4 h-4 text-accent" />
              הוספה ליומן
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                localStorage.removeItem('is_registered');
                navigate('/');
              }}
              className="h-12 rounded-xl bg-primary/5 text-primary font-bold text-xs hover:bg-primary/10 transition-all"
            >
              רישום אורח נוסף
            </button>
            <button 
              onClick={() => navigate('/')}
              className="h-12 rounded-xl bg-white border border-primary/10 text-primary/40 font-bold text-xs hover:text-primary transition-all"
            >
              חזרה לדף הבית
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
