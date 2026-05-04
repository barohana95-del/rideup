import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bus, User, Phone, Users, MapPin, Clock, Send,
  MessageCircle, Minus, Plus, X, CheckCircle2,
  Edit2, ChevronLeft, Trash2, Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { Registration } from '../types';
import { cn } from '../lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rsvpActive, setRsvpActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState('18:30');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [verifyData, setVerifyData] = useState({ fullName: '', phone: '' });
  const [verifiedReg, setVerifiedReg] = useState<Registration | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditingInRsvp, setIsEditingInRsvp] = useState(false);
  const [rsvpSubMode, setRsvpSubMode] = useState<'confirm' | 'edit' | null>(null);

  const [formData, setFormData] = useState<Omit<Registration, 'id' | 'createdAt'>>({
    fullName: '',
    phone: '',
    numGuests: 1,
    city: '',
    returnShift: '',
    direction: 'round_trip',
    notes: ''
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await api.getSettings();
      setCities(settings.cities);
      setPickupTime(settings.pickupTime || '18:30');
      setRsvpActive(settings.rsvpActive == '1' || settings.rsvpActive === 1);

      if (settings.useShifts) {
        setShifts(settings.shifts);
      } else {
        setShifts([settings.singleReturnTime]);
      }

      setFormData(prev => ({
        ...prev,
        city: settings.cities[0] || '',
        returnShift: settings.useShifts ? (settings.shifts[0] || '') : (settings.singleReturnTime || '')
      }));
    };
    loadSettings();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const reg = await api.verifyRegistration(verifyData.fullName, verifyData.phone);
    if (reg) {
      setVerifiedReg(reg);
      setFormData({
        fullName: reg.fullName,
        phone: reg.phone,
        numGuests: reg.numGuests,
        city: reg.city,
        returnShift: reg.returnShift || '',
        direction: reg.direction || 'round_trip',
        notes: reg.notes || ''
      });
    } else {
      setError('לא נמצאה הרשמה התואמת לפרטים אלו');
    }
    setLoading(false);
  };

  const handleRSVP = async (status: 'confirmed' | 'pending' | 'cancelled') => {
    if (!verifiedReg) return;
    setLoading(true);
    const res = await api.confirmAttendance(verifiedReg.id, status as any);
    if (res.success) {
      if (status === 'confirmed') {
        const updated = { ...verifiedReg, status: 'confirmed' as const };
        setVerifiedReg(updated);
        localStorage.setItem('last_registration', JSON.stringify(updated));
        setSuccessMessage('תודה! הגעתכם אושרה בהצלחה. נתראה בשמחות! ✨');
      } else if (status === 'pending') {
        const updated = { ...verifiedReg, status: 'pending' as const };
        setVerifiedReg(updated);
        localStorage.setItem('last_registration', JSON.stringify(updated));
        setSuccessMessage('אישור ההגעה בוטל. הסטטוס חזר לממתין. 👍');
      } else {
        setSuccessMessage('ההרשמה בוטלה בהצלחה. 👍');
        setIsFormOpen(false);
        setVerifiedReg(null);
        api.resetRegistration();
        localStorage.removeItem('last_registration');
      }
    } else {
      setError('חלה שגיאה בעדכון הסטטוס');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      setError('אנא מלאו את כל שדות החובה');
      return;
    }

    const phoneRegex = /^05\d-?\d{7}$/;
    if (!phoneRegex.test(formData.phone.replace(/-/g, ''))) {
      setError('מספר טלפון לא תקין (צריך להיות 05X-XXXXXXX)');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    const dataToSend = { ...formData, phone: cleanPhone };

    try {
      setLoading(true);
      setError(null);

      if (formMode === 'edit' && verifiedReg) {
        await api.updateRegistration(verifiedReg.id, dataToSend);
        const updatedReg = { ...verifiedReg, ...dataToSend };
        setVerifiedReg(updatedReg);
        localStorage.setItem('last_registration', JSON.stringify(updatedReg));

        setSuccessMessage('הפרטים עודכנו בהצלחה! 👍');
        setIsEditingInRsvp(false);
        setLoading(false);
        return;
      }

      if (formMode === 'create') {
        const res = await api.registerShuttle(dataToSend);
        if (!res.success) {
          setError(res.error);
          setLoading(false);
          return;
        }

        api.markAsRegistered();
        localStorage.setItem('last_registration', JSON.stringify({ ...dataToSend, id: null }));

        if (rsvpActive) {
          setSuccessMessage('נרשמתם בהצלחה! ✨');
          const reg = await api.verifyRegistration(dataToSend.fullName, dataToSend.phone);
          if (reg) setVerifiedReg(reg);
          setLoading(false);
          return;
        }

        navigate('/thank-you');
      }
    } catch (err) {
      setError('אירעה שגיאה. אנא נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-primary relative overflow-hidden font-sans selection:bg-accent/20">
      {/* Success Message Overlay */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="glass bg-white/90 backdrop-blur-xl border border-green-100 p-4 rounded-2xl shadow-2xl shadow-green-200/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm text-green-800">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="p-2 hover:bg-green-50 rounded-lg transition-colors">
                <X className="w-4 h-4 text-green-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto px-6 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Card Container with Perspective */}
        <div className="w-full relative preserve-3d" style={{ perspective: '1200px' }}>
          <motion.div
            animate={{ rotateY: isFormOpen ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full relative"
          >
            {/* Front Side: Image & Buttons */}
            <div className="w-full backface-hidden">
              <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-white overflow-hidden space-y-4">
                <img
                  src="/save-the-date.jpeg"
                  alt="Save the Date"
                  className="w-full h-auto rounded-[2.5rem] shadow-sm mb-2"
                />

                {/* Action Buttons Inside Card */}
                <div className="space-y-3 px-1 pb-2">
                  <button
                    onClick={() => {
                      if (rsvpActive) {
                        setFormMode('edit');
                        setRsvpSubMode('confirm');
                      } else {
                        setFormMode('create');
                        setRsvpSubMode(null);
                      }
                      setIsFormOpen(true);
                    }}
                    className="w-full h-20 bg-primary/5 rounded-[1.5rem] flex items-center justify-between px-6 group transition-all duration-300 hover:bg-primary/10"
                  >
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-primary/20 uppercase tracking-widest mb-0.5">
                        {rsvpActive ? 'כבר נרשמת?' : 'חדש כאן?'}
                      </p>
                      <p className="text-xl font-black text-[#1A233A]">
                        {rsvpActive ? 'אישור הגעה' : 'רישום להסעה'}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#1A233A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {rsvpActive ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setFormMode('edit');
                      setRsvpSubMode('edit');
                      setIsFormOpen(true);
                    }}
                    className="w-full h-20 bg-primary/5 rounded-[1.5rem] flex items-center justify-between px-6 group transition-all duration-300 hover:bg-primary/10"
                  >
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-primary/20 uppercase tracking-widest mb-0.5">
                        {rsvpActive ? 'שינוי בתוכניות?' : 'כבר נרשמת?'}
                      </p>
                      <p className="text-xl font-black text-[#1A233A]">עריכת רשומה קיימת</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#C5A059] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                  </button>
                </div>
              </div>

              <footer className="mt-8 text-center px-4">
                <p className="text-[11px] font-black text-[#1A233A] leading-relaxed">
                  יש להגיע כ-10 דקות לפני שעת היציאה לנקודת האיסוף, <span className="text-[#C5A059]">נתראה ברחבה!</span>
                </p>
              </footer>
            </div>

            {/* Back Side: Form Only */}
            <div
              className="absolute top-0 left-0 w-full backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <motion.div
                className="glass bg-white rounded-[3rem] p-8 shadow-2xl border border-white relative min-h-[500px]"
              >
                <>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setVerifiedReg(null);
                      setIsEditingInRsvp(false);
                      setFormMode('create');
                      setError(null);
                    }}
                    className="absolute top-6 left-6 p-2 hover:bg-primary/5 rounded-full transition-colors z-20"
                  >
                    <X className="w-6 h-6 text-primary/20" />
                  </button>

                  <header className="mb-8 relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-accent/10 rounded-full text-[10px] font-black text-accent uppercase tracking-widest mb-4">
                      {formMode === 'create' ? 'הרשמה חדשה' : rsvpSubMode === 'edit' ? 'עדכון פרטים' : rsvpActive ? 'אישור הגעה' : 'עריכת פרטים'}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2">
                      {formMode === 'create' ? 'הצטרפו לנסיעה' : rsvpSubMode === 'edit' ? 'עדכון פרטים' : rsvpActive ? 'אישור הגעה' : 'עדכון פרטים'}
                    </h2>
                  </header>

                  {(formMode !== 'create' && !verifiedReg) ? (
                    /* --- 1. Verification Form --- */
                    <form onSubmit={handleVerify} className="space-y-4">
                      <p className="text-center text-xs text-primary/40 leading-relaxed px-4">אנא הזינו את הפרטים המדויקים איתם נרשמתם.</p>
                      <div className="space-y-3">
                        <div className="relative group">
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                          <input
                            type="text"
                            placeholder="שם מלא"
                            required
                            className="w-full h-14 pr-12 pl-6 rounded-2xl bg-primary/5 border border-transparent focus:border-accent/20 focus:bg-white outline-none transition-all font-bold text-sm"
                            value={verifyData.fullName}
                            onChange={(e) => setVerifyData({ ...verifyData, fullName: e.target.value })}
                          />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                          <input
                            type="tel"
                            placeholder="מספר טלפון"
                            required
                            className="w-full h-14 pr-12 pl-6 rounded-2xl bg-primary/5 border border-transparent focus:border-accent/20 focus:bg-white outline-none transition-all font-bold text-sm"
                            value={verifyData.phone}
                            onChange={(e) => setVerifyData({ ...verifyData, phone: e.target.value })}
                          />
                        </div>
                        {error && <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full h-14 bg-[#1A233A] text-white rounded-2xl font-bold shadow-xl shadow-[#1A233A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                          {loading ? 'בודק...' : 'מצא את ההרשמה שלי'}
                        </button>
                      </div>
                    </form>
                  ) : (rsvpActive && verifiedReg && rsvpSubMode === 'confirm') ? (
                    /* --- 2. RSVP Summary View (Confirm Path) --- */
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          {verifiedReg.status === 'confirmed' ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <Bus className="w-8 h-8 text-accent" />}
                        </div>
                        <p className="text-sm text-primary/40">היי {verifiedReg.fullName}, {verifiedReg.status === 'confirmed' ? 'תודה שאישרתם הגעה!' : 'האם תגיעו להסעה?'}</p>
                      </div>

                      <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-40 font-bold">כמות אורחים:</span>
                          <span className="font-bold">{verifiedReg.numGuests} איש</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="opacity-40 font-bold">נקודת איסוף:</span>
                          <span className="font-bold">{verifiedReg.city}</span>
                        </div>
                        {(formData.direction === 'round_trip' || formData.direction === 'outbound') && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="opacity-40 font-bold">שעת יציאה:</span>
                            <span className="font-bold">{pickupTime}</span>
                          </div>
                        )}
                        {(formData.direction === 'round_trip' || formData.direction === 'return') && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="opacity-40 font-bold">סבב חזרה:</span>
                            <span className="font-bold">{formData.returnShift || '01:30'}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={() => handleRSVP(verifiedReg.status === 'confirmed' ? 'pending' : 'confirmed')}
                          disabled={loading}
                          className={cn(
                            "w-full h-16 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2",
                            verifiedReg.status === 'confirmed'
                              ? "bg-red-50 text-red-500 border border-red-100 shadow-red-100"
                              : "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                          )}
                        >
                          {verifiedReg.status === 'confirmed' ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                          {verifiedReg.status === 'confirmed' ? 'ביטול אישור הגעה' : 'כן, אני מאשר הגעה'}
                        </button>

                        <div className="flex justify-center gap-6 pt-2">
                          <button
                            onClick={() => setRsvpSubMode('edit')}
                            className="text-[10px] font-bold text-primary/30 hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            עריכת פרטים
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-[10px] font-bold text-primary/30 hover:text-red-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            ביטול הרשמה
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- 3. Registration / Edit Form (Edit Path) --- */
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100">{error}</div>}

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest px-1">כיוון נסיעה</label>
                          <div className="flex p-1 bg-primary/5 rounded-2xl gap-1">
                            {[{ id: 'round_trip', label: 'הלוך חזור' }, { id: 'outbound', label: 'הלוך' }, { id: 'return', label: 'חזור' }].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, direction: opt.id as any })}
                                className={cn("flex-1 py-2 rounded-lg text-[10px] font-bold transition-all", formData.direction === opt.id ? "bg-white text-primary shadow-sm" : "text-primary/40")}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><User className="w-3 h-3" /> שם מלא</label>
                            <input type="text" required className="w-full h-10 px-4 rounded-xl bg-white border border-primary/5 outline-none focus:ring-2 focus:ring-accent/20 text-sm" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><Phone className="w-3 h-3" /> טלפון</label>
                            <input type="tel" required className="w-full h-10 px-4 rounded-xl bg-white border border-primary/5 outline-none focus:ring-2 focus:ring-accent/20 text-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><MapPin className="w-3 h-3" /> עיר</label>
                            <select className="w-full h-10 px-3 rounded-xl bg-white border border-primary/5 outline-none text-xs font-bold" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}>
                              <option value="">בחר עיר...</option>
                              {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><Users className="w-3 h-3" /> כמות אנשים</label>
                            <div className="flex items-center bg-white border border-primary/5 rounded-xl h-10 overflow-hidden">
                              <button type="button" onClick={() => setFormData({ ...formData, numGuests: Math.max(1, formData.numGuests - 1) })} className="w-10 h-full flex items-center justify-center hover:bg-primary/5 transition-colors"><Minus className="w-3 h-3" /></button>
                              <span className="flex-1 text-center font-bold text-sm">{formData.numGuests}</span>
                              <button type="button" onClick={() => setFormData({ ...formData, numGuests: Math.min(10, formData.numGuests + 1) })} className="w-10 h-full flex items-center justify-center hover:bg-primary/5 transition-colors"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>

                        {(formData.direction === 'round_trip' || formData.direction === 'outbound') && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><Clock className="w-3 h-3" /> שעת יציאה</label>
                            <div className="w-full h-10 px-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary">{pickupTime}</div>
                          </div>
                        )}

                        {(formData.direction === 'round_trip' || formData.direction === 'return') && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary/50 flex items-center gap-2 uppercase tracking-wider"><Clock className="w-3 h-3" /> שעת חזרה</label>
                            {shifts.length > 1 ? (
                              <select className="w-full h-10 px-3 rounded-xl bg-white border border-primary/5 outline-none text-xs font-bold" value={formData.returnShift} onChange={e => setFormData({ ...formData, returnShift: e.target.value })}>
                                {shifts.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            ) : (
                              <div className="w-full h-10 px-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary">{formData.returnShift || '01:30'}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <button type="submit" disabled={loading} className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                        {loading ? 'שומר...' : formMode === 'create' ? 'הרשמה להסעה' : 'שמור שינויים'}
                      </button>
                      
                      {formMode === 'edit' && (
                        <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-primary/5">
                          {rsvpSubMode === 'edit' && (
                            <button 
                              type="button" 
                              onClick={() => {
                                setIsFormOpen(false);
                                setVerifiedReg(null);
                                setRsvpSubMode(null);
                              }} 
                              className="text-xs text-primary/30 hover:text-primary transition-colors"
                            >
                              ביטול וחזרה
                            </button>
                          )}
                          <button 
                            type="button" 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            ביטול הרשמה ומחיקת פרטים
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* In-App Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black">ביטול הרשמה?</h3>
                  <p className="text-sm text-primary/40 leading-relaxed">האם אתם בטוחים שברצונכם לבטל את ההרשמה של <strong>{verifiedReg?.fullName}</strong>?</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 h-12 rounded-xl font-bold text-sm bg-primary/5 hover:bg-primary/10 transition-colors">לא, חזרה</button>
                  <button onClick={async () => {
                    setLoading(true);
                    await api.deleteRegistration(verifiedReg!.id);
                    setLoading(false);
                    setShowDeleteConfirm(false);
                    setVerifiedReg(null);
                    setIsFormOpen(false);
                    setSuccessMessage('ההרשמה בוטלה בהצלחה. 👍');
                  }} className="flex-1 h-12 rounded-xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-200">כן, בטל</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
