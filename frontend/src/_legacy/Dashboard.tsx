import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, MapPin, Settings, Search, 
  Download, Plus, X, Clock, Lock, CheckCircle2,
  AlertTriangle, Bus, Trash2, LogOut, List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Registration, DashboardStats } from '../types';
import { cn } from '../lib/utils';

import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

export default function Dashboard() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const showSuccess = (msg: string) => setSuccessMessage(msg);

  return (
    <DashboardLayout>
      {/* Success Overlay */}
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

      <div className="w-full">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/list" element={<List onSuccess={showSuccess} />} />
            <Route path="/rsvp" element={<RSVPStats onSuccess={showSuccess} />} />
            <Route path="/distribution" element={<Distribution />} />
            <Route path="/settings" element={<SettingsComponent onSuccess={showSuccess} />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function Distribution() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <LoadingPulse />;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-extrabold tracking-tight text-primary">התפלגות ערים</h2>
        <p className="text-primary/50 font-medium">פירוט נרשמים לפי אזור גיאוגרפי</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.cityDistribution.sort((a, b) => b.count - a.count).map((item) => {
          const isApproved = parseInt(item.count) >= 10;
          return (
            <div key={item.name} className="glass rounded-[2rem] p-6 flex flex-col gap-6 group hover:scale-[1.02] transition-all relative overflow-hidden">
              {/* Status Ribbon */}
              <div className={cn(
                "absolute top-0 left-0 w-1 h-full",
                isApproved ? "bg-green-500" : "bg-red-400"
              )} />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                    isApproved ? "bg-green-50" : "bg-red-50"
                  )}>
                    <MapPin className={cn("w-6 h-6", isApproved ? "text-green-600" : "text-red-500")} />
                  </div>
                  <div>
                    <h4 className="font-black text-primary text-lg">{item.name}</h4>
                    <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">נקודת איסוף</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-black text-primary tracking-tighter">{item.count}</span>
                  <p className="text-[10px] font-bold text-primary/20">אורחים</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                  isApproved 
                    ? "bg-green-500/10 text-green-600" 
                    : "bg-red-500/10 text-red-500"
                )}>
                  {isApproved ? 'מאושר להסעה' : 'מתחת לסף להסעה'}
                </span>
                {!isApproved && (
                  <span className="text-[10px] font-bold text-red-400/60 italic">
                    חסרים עוד {10 - parseInt(item.count)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-accent/20 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  return (
    <div className="glass rounded-3xl p-6 relative overflow-hidden group">
      <div className={cn(
        "absolute top-0 left-0 w-2 h-full",
        color === 'accent' ? "bg-accent" : "bg-primary"
      )} />
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-1">{label}</p>
          <h4 className="text-4xl font-bold tracking-tighter group-hover:scale-105 transition-transform origin-right">
            {value}
          </h4>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
          color === 'accent' ? "bg-accent/10" : "bg-primary/5"
        )}>
          <Icon className={cn("w-6 h-6", color === 'accent' ? "text-accent" : "text-primary/40")} />
        </div>
      </div>
      <p className="text-xs font-bold text-primary/30 italic">{trend}</p>
    </div>
  );
}

function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
  }, []);

  const handleExport = async () => {
    const blob = await api.exportToExcel();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding_shuttle_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  if (!stats) return <LoadingPulse />;

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="text-right">
          <h2 className="text-3xl font-extrabold tracking-tight">סקירה כללית</h2>
          <p className="text-primary/50 font-medium">ברוך הבא לפאנל הניהול של ההסעות</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-[#1A233A] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto text-sm"
        >
          <Download className="w-4 h-4" />
          ייצוא רשימה (CSV)
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="סה״כ נרשמים (רשומות)" value={stats.totalRegistrations} icon={Users} trend="רשומות במערכת" color="primary" />
        <StatCard label="נרשמו ברזל (אנשים)" value={stats.totalGuests} icon={CheckCircle2} trend="ממתינים לאוטובוסים" color="accent" />
        <StatCard label="ערים פעילות" value={stats.cityDistribution.length} icon={MapPin} trend="מכל רחבי הארץ" color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Cities Under Watch */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            ערים במעקב (מתחת ל-10 איש)
          </h3>
          <div className="space-y-4">
            {stats.cityDistribution.filter((item: any) => parseInt(item.count) < 10).map((item: any) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">{item.count} נרשמים</span>
              </div>
            ))}
            {stats.cityDistribution.every((item: any) => parseInt(item.count) >= 10) && (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <CheckCircle2 className="w-12 h-12 mb-2 text-green-500" />
                <p className="text-sm font-medium">כל המסלולים יעילים כרגע</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Distributions */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass rounded-[2.5rem] p-8 flex flex-col min-h-[300px]">
            <h3 className="text-lg font-bold mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                התפלגות לפי שעת חזרה
              </div>
              <span className="text-xs font-black text-primary/20">{stats.totalGuests} אורחים סה"כ</span>
            </h3>
            <div className="flex-1 flex items-end gap-4 sm:gap-8 justify-center pt-4 pb-4 px-2">
              {stats.shiftDistribution.map((item: any) => {
                const count = parseInt(item.count);
                const height = (count / (stats.totalGuests || 1)) * 100;
                return (
                  <div key={item.shift} className="relative group flex flex-col items-center w-full max-w-[80px]">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 15)}%` }}
                      className="w-full bg-primary/10 rounded-t-2xl group-hover:bg-primary/20 transition-all relative border-x border-t border-primary/5 shadow-inner"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 font-black text-lg text-primary">{count}</div>
                    </motion.div>
                    <div className="text-xs font-black text-primary/40 mt-4 text-center whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-sm border border-primary/5">
                      {item.shift || 'לא נבחר'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-[2.5rem] p-8">
             <div className="bg-primary/5 rounded-[1.5rem] p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Bus className="w-4 h-4 text-accent" />
                    פילוח לפי כיוון
                  </h4>
                  <span className="text-[10px] font-bold text-primary/30">פירוט עומסי נסיעה</span>
                </div>
                
                <div className="space-y-4">
                  {stats.directionDistribution.map((dir: any) => {
                    const label = dir.direction === 'round_trip' ? 'הלוך חזור' : dir.direction === 'outbound' ? 'הלוך בלבד' : 'חזור בלבד';
                    const percentage = (dir.count / (stats.totalGuests || 1)) * 100;
                    return (
                      <div key={dir.direction} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{label}</span>
                          <span className="text-primary/40">{dir.count} איש</span>
                        </div>
                        <div className="h-2 bg-white rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-[#10B981]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function List({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);

  const loadData = async () => {
    const [regs, s] = await Promise.all([
      api.getDetailedRegistrations(),
      api.getSettings()
    ]);
    setRegistrations(regs);
    setSettings(s);
    setLoading(false);
  };

  const handleConfirm = async (id: string) => {
    await api.confirmAttendance(id, 'confirmed');
    onSuccess('אישור הגעה בוצע בהצלחה! ✅');
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    await api.deleteRegistration(id);
    onSuccess('הרשומה נמחקה בהצלחה');
    loadData();
    setConfirmDelete(null);
  };

  const handleExport = async () => {
    const blob = await api.exportToExcel();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding_shuttle_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const filtered = registrations.filter(r => 
    r.fullName.toLowerCase().includes(search.toLowerCase()) || 
    r.phone.includes(search) ||
    r.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingPulse />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title on the Right */}
        <div className="text-right">
          <h2 className="text-3xl font-extrabold tracking-tight">רשימת נרשמים</h2>
          <p className="text-primary/40 font-bold text-xs mt-1 uppercase tracking-wider">
            {filtered.length} נרשמים נמצאו
          </p>
        </div>
        
        {/* Tools on the Left */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="w-12 h-12 shrink-0 bg-white border border-primary/5 rounded-xl flex items-center justify-center text-primary/40 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
            title="ייצוא רשימה"
          >
            <Download className="w-5 h-5" />
          </button>
          <div className="relative flex-1 md:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20" />
            <input
              type="text"
              placeholder="חיפוש לפי שם או עיר..."
              className="w-full h-12 pr-11 pl-4 rounded-xl bg-white border border-primary/5 outline-none focus:ring-2 focus:ring-primary/5 font-bold text-sm shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-4 sm:p-8 overflow-hidden">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
          <table className="w-full text-right border-separate border-spacing-y-3 min-w-[900px]">
            <thead>
              <tr className="text-primary/30 uppercase tracking-[0.2em] text-[10px] font-black">
                <th className="px-6 py-2">שם מלא</th>
                <th className="px-6 py-2">טלפון</th>
                <th className="px-6 py-2">כיוון</th>
                <th className="px-6 py-2">עיר</th>
                <th className="px-6 py-2">חזרה</th>
                <th className="px-6 py-2 text-center">כמות</th>
                <th className="px-6 py-2 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => (
                <tr key={reg.id} className="group">
                  <td className="py-4 px-6 bg-white/50 first:rounded-r-2xl font-bold text-sm whitespace-nowrap border-y border-r border-primary/5">
                    {reg.fullName}
                  </td>
                  <td className="py-4 px-6 bg-white/50 text-sm font-medium text-primary/40 whitespace-nowrap border-y border-primary/5">
                    {reg.phone}
                  </td>
                  <td className="py-4 px-6 bg-white/50 border-y border-primary/5">
                    <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap">
                      {reg.direction === 'round_trip' ? 'הלוך חזור' : reg.direction === 'outbound' ? 'הלוך בלבד' : 'חזור בלבד'}
                    </span>
                  </td>
                  <td className="py-4 px-6 bg-white/50 text-sm font-bold border-y border-primary/5">
                    {reg.city}
                  </td>
                  <td className="py-4 px-6 bg-white/50 border-y border-primary/5">
                    <span className="bg-white border border-primary/10 px-3 py-1 rounded-lg text-xs font-black shadow-sm">
                      {reg.returnShift || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6 bg-white/50 text-center border-y border-primary/5">
                    <span className="w-8 h-8 inline-flex items-center justify-center bg-accent text-white rounded-full text-xs font-black shadow-lg shadow-accent/20">
                      {reg.numGuests}
                    </span>
                  </td>
                  <td className="py-4 px-6 bg-white/50 last:rounded-l-2xl text-left border-y border-l border-primary/5">
                    <div className="flex items-center gap-1 justify-end">
                      {settings?.rsvpActive && reg.status === 'pending' && (
                        <button 
                          onClick={() => handleConfirm(reg.id)}
                          className="p-2.5 text-green-500 hover:bg-green-500/10 rounded-xl transition-all active:scale-90"
                          title="אישור הגעה"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => setEditingRegistration(reg)}
                        className="p-2.5 text-accent hover:bg-accent/10 rounded-xl transition-all active:scale-90"
                        title="עריכה"
                      >
                        <Settings className="w-4.5 h-4.5" />
                      </button>
                      {!settings?.rsvpActive && (
                        <button 
                          onClick={() => setConfirmDelete(reg.id)}
                          className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                          title="מחיקה"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">מחיקת רשומה?</h3>
                <p className="text-sm text-primary/40 leading-relaxed">האם אתם בטוחים שברצונכם למחוק לצמיתות רשומה זו?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 h-12 rounded-xl font-bold text-sm bg-primary/5 hover:bg-primary/10">ביטול</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 h-12 rounded-xl font-bold text-sm bg-red-500 text-white shadow-lg shadow-red-200">כן, מחק</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingRegistration && (
          <EditRegistrationModal 
            registration={editingRegistration} 
            onClose={() => setEditingRegistration(null)} 
            onSuccess={() => {
              setEditingRegistration(null);
              onSuccess('הרשומה עודכנה בהצלחה');
              loadData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RSVPStats({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [confirmedList, setConfirmedList] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmUndo, setConfirmUndo] = useState<string | null>(null);

  const loadData = async () => {
    const s = await api.getDashboardStats();
    setStats(s);
    const list = await api.getDetailedRegistrations();
    setConfirmedList(list.filter(r => r.status === 'confirmed'));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUndoConfirmation = async (id: string) => {
    await api.confirmAttendance(id, 'pending' as any);
    onSuccess('אישור ההגעה בוטל והאורח הוחזר למצב ממתין');
    loadData();
    setConfirmUndo(null);
  };

  if (loading || !stats) return <LoadingPulse />;

  const confirmedRate = (stats.totalConfirmed / (stats.totalGuests || 1)) * 100;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-extrabold tracking-tight">אישורי הגעה</h2>
        <p className="text-primary/50 font-medium">ניתוח מאושרים מול נרשמים בפועל</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="נרשמו ברזל" value={stats.totalGuests} icon={Users} trend="סך הכל נרשמו" color="primary" />
        <StatCard label="אישרו הגעה" value={stats.totalConfirmed} icon={CheckCircle2} trend={`${confirmedRate.toFixed(1)}% אישור`} color="accent" />
        <StatCard label="ביטלו" value={stats.totalCancelled} icon={X} trend="אורחים שלא יגיעו" color="primary" />
        <StatCard label="טרם אישרו" value={stats.totalPending} icon={Clock} trend="ממתינים לתגובה" color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] p-8 space-y-8">
          <h3 className="font-bold text-lg">מצב אישורים נוכחי</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>אישרו הגעה</span>
                <span>{stats.totalConfirmed} / {stats.totalGuests}</span>
              </div>
              <div className="h-4 bg-primary/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${confirmedRate}%` }} className="h-full bg-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            התפלגות מאושרים לפי ערים
          </h3>
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
            {stats.cityDistribution.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between group">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-primary/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent opacity-50" style={{ width: `${(item.count / (stats.totalGuests || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold w-8 text-left">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            רשימת מאשרי הגעה סופית
          </h3>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black">
            {confirmedList.length} רשומות מאושרות
          </span>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
          <table className="w-full text-right border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-primary/5">
                <th className="py-4 px-4 text-xs font-black text-primary/30 uppercase tracking-widest">שם האורח</th>
                <th className="py-4 px-4 text-xs font-black text-primary/30 uppercase tracking-widest">טלפון</th>
                <th className="py-4 px-4 text-xs font-black text-primary/30 uppercase tracking-widest text-center">כמות</th>
                <th className="py-4 px-4 text-xs font-black text-primary/30 uppercase tracking-widest">עיר</th>
                <th className="py-4 px-4 text-xs font-black text-primary/30 uppercase tracking-widest text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {confirmedList.map((reg) => (
                <tr key={reg.id} className="group hover:bg-primary/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-sm whitespace-nowrap">{reg.fullName}</td>
                  <td className="py-4 px-4 text-sm opacity-50 whitespace-nowrap">{reg.phone}</td>
                  <td className="py-4 px-4 text-center font-black text-accent text-sm">{reg.numGuests}</td>
                  <td className="py-4 px-4 text-sm font-medium whitespace-nowrap">{reg.city}</td>
                  <td className="py-4 px-4 text-left">
                    <button 
                      onClick={() => setConfirmUndo(reg.id)}
                      className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-tighter transition-colors whitespace-nowrap"
                    >
                      ביטול אישור
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {confirmUndo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black">ביטול אישור הגעה?</h3>
                <p className="text-sm text-primary/40 leading-relaxed">האם להחזיר את האורח למצב ממתין?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmUndo(null)} className="flex-1 h-12 rounded-xl font-bold text-sm bg-primary/5 hover:bg-primary/10">ביטול</button>
                <button onClick={() => handleUndoConfirmation(confirmUndo)} className="flex-1 h-12 rounded-xl font-bold text-sm bg-accent text-white shadow-lg shadow-accent/20">כן, בצע</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsComponent({ onSuccess }: { onSuccess: (msg: string) => void }) {
  const [settings, setSettings] = useState<any>(null);
  const [newCity, setNewCity] = useState('');
  const [newShiftVal, setNewShiftVal] = useState('00:00');
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await api.updateSettings(settings);
    setSaving(false);
    onSuccess('ההגדרות נשמרו בהצלחה! ⚙️');
  };

  const handlePasswordChange = async () => {
    if (!newPassword) return;
    setPasswordSaving(true);
    const res = await api.changePassword(newPassword);
    setPasswordSaving(false);
    if (res.success) {
      onSuccess('הסיסמה שונתה בהצלחה! 🔐');
      setNewPassword('');
    }
  };

  if (!settings) return <LoadingPulse />;

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-extrabold tracking-tight">הגדרות מערכת</h2>
        <p className="text-primary/50 font-medium">ניהול פרמטרים של האירוע וגישה</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">ניהול אירוע</h3>
          </div>

          <div className="space-y-4">
            {/* Shifts Toggle */}
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] hover:bg-primary/[0.07] transition-colors">
              <div className="text-right">
                <p className="font-black text-primary text-sm">הפעלת סבבי חזרה</p>
                <p className="text-[10px] font-bold text-primary/30 uppercase">בחירה בין שעות שונות</p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, useShifts: !settings.useShifts })}
                className={cn(
                  "w-14 h-8 rounded-full transition-all relative shrink-0",
                  settings.useShifts ? "bg-accent" : "bg-[#CBD5E0]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md",
                  settings.useShifts ? "right-7" : "right-1"
                )} />
              </button>
            </div>

            {/* Pickup Time */}
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] hover:bg-primary/[0.07] transition-colors">
              <div className="text-right">
                <p className="font-black text-primary text-sm">שעת איסוף (הלוך)</p>
                <p className="text-[10px] font-bold text-primary/30 uppercase">זמן קבוע ליציאת האוטובוס</p>
              </div>
              <input 
                type="text" 
                value={settings.pickupTime}
                onChange={(e) => setSettings({ ...settings, pickupTime: e.target.value })}
                className="w-28 h-12 px-4 rounded-xl bg-white border-none outline-none font-black text-center shadow-sm"
              />
            </div>

            {/* RSVP Toggle */}
            <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] hover:bg-primary/[0.07] transition-colors">
              <div className="text-right">
                <p className="font-black text-primary text-sm">מצב אישורי הגעה (RSVP)</p>
                <p className="text-[10px] font-bold text-primary/30 uppercase">הפעלת שלב האישור הסופי</p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, rsvpActive: !settings.rsvpActive })}
                className={cn(
                  "w-14 h-8 rounded-full transition-all relative shrink-0",
                  settings.rsvpActive ? "bg-accent" : "bg-[#CBD5E0]"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md",
                  settings.rsvpActive ? "right-7" : "right-1"
                )} />
              </button>
            </div>

            {/* Dynamic Return Section */}
            {settings.useShifts ? (
              <div className="p-6 bg-[#FDFCFB] border border-accent/10 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="font-black text-accent text-sm">ניהול סבבי חזרה</p>
                    <p className="text-[10px] font-bold text-accent/40 uppercase">הוסף שעות לסבבים השונים</p>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="00:00"
                      className="w-20 h-10 px-3 rounded-xl bg-white border border-accent/10 outline-none font-bold text-center text-sm"
                      value={newShiftVal}
                      onChange={(e) => setNewShiftVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newShiftVal) {
                          const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
                          const nextLetter = letters[(settings.shifts || []).length] || '?';
                          const fullLabel = `סבב ${nextLetter}' - ${newShiftVal}`;
                          setSettings({ ...settings, shifts: [...(settings.shifts || []), fullLabel] });
                          setNewShiftVal('00:00');
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newShiftVal) {
                          const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
                          const nextLetter = letters[(settings.shifts || []).length] || '?';
                          const fullLabel = `סבב ${nextLetter}' - ${newShiftVal}`;
                          setSettings({ ...settings, shifts: [...(settings.shifts || []), fullLabel] });
                          setNewShiftVal('00:00');
                        }
                      }}
                      className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-110 active:scale-95 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-start">
                  {(settings.shifts || []).map((shift: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white border border-accent/5 px-4 py-2 rounded-xl group hover:border-red-200 transition-all shadow-sm">
                      <button 
                        onClick={() => setSettings({ ...settings, shifts: settings.shifts.filter((_: any, i: number) => i !== index) })}
                        className="text-primary/10 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-black text-primary">{shift}</span>
                    </div>
                  ))}
                  {(settings.shifts || []).length === 0 && (
                    <p className="text-xs text-primary/30 italic py-2">טרם נוספו סבבים...</p>
                  )}
                </div>
              </div>
            ) : (
              /* Fixed Return Time (If shifts disabled) */
              <div className="p-6 bg-[#FDFCFB] border border-accent/10 rounded-[2.5rem] space-y-4">
                <label className="block text-right text-[10px] font-black text-accent uppercase tracking-wider">שעת חזרה קבועה (סבב יחיד):</label>
                <input 
                  type="text" 
                  value={settings.singleReturnTime || ''}
                  onChange={(e) => setSettings({ ...settings, singleReturnTime: e.target.value })}
                  className="w-full h-16 px-6 rounded-2xl bg-white border border-accent/5 outline-none font-black text-center text-xl shadow-inner focus:ring-2 focus:ring-accent/10 transition-all"
                  placeholder="01:00"
                />
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 space-y-8 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">נקודות איסוף (ערים)</h3>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="הוסף עיר..."
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl bg-primary/5 border-none outline-none font-bold text-sm"
              />
              <button 
                onClick={() => {
                  if (newCity) {
                    setSettings({ ...settings, cities: [...settings.cities, newCity] });
                    setNewCity('');
                  }
                }}
                className="bg-primary text-white px-6 rounded-xl font-bold text-sm shrink-0 shadow-lg shadow-primary/10"
              >
                הוסף
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] custom-scrollbar p-1">
            {settings.cities.map((city: string, index: number) => (
              <div key={index} className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl group hover:bg-red-50 transition-colors">
                <span className="text-sm font-bold group-hover:text-red-500">{city}</span>
                <button 
                  onClick={() => setSettings({ ...settings, cities: settings.cities.filter((_: any, i: number) => i !== index) })}
                  className="text-primary/20 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">אבטחה וגישה</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] px-1">סיסמה חדשה לפאנל</label>
            <div className="flex gap-3">
              <input 
                type="password" 
                placeholder="הזן סיסמה חדשה..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 h-12 px-6 rounded-xl bg-primary/5 border-none outline-none focus:ring-2 focus:ring-primary/10 font-bold text-lg"
              />
              <button 
                onClick={handlePasswordChange}
                disabled={passwordSaving || !newPassword}
                className="bg-primary text-white px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-30 whitespace-nowrap"
              >
                עדכן סיסמה
              </button>
            </div>
          </div>
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/5">
            <p className="text-[10px] font-bold text-primary/40 uppercase leading-relaxed">
              שים לב: שינוי הסיסמה ינתק אותך מהמערכת ותצטרך להתחבר מחדש עם הסיסמה החדשה. מומלץ להשתמש בסיסמה חזקה.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-50"
        >
          {saving ? 'שומר שינויים...' : 'שמור את כל ההגדרות'}
        </button>
      </div>
    </div>
  );
}

function EditRegistrationModal({ registration, onClose, onSuccess }: { registration: Registration, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({ ...registration });
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await api.updateRegistration(formData.id, formData);
    setSaving(false);
    if (res.success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-primary/40 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-primary/5 flex items-center justify-between bg-primary/5">
          <div className="text-right">
            <h3 className="text-2xl font-black text-primary">עריכת נרשם</h3>
            <p className="text-xs font-bold text-primary/30 uppercase tracking-widest mt-1">עדכון פרטי הסעה וקשר</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary/30 uppercase px-2">שם מלא</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-14 px-6 rounded-2xl bg-primary/5 border-none outline-none font-bold focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-primary/30 uppercase px-2">טלפון</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-14 px-6 rounded-2xl bg-primary/5 border-none outline-none font-bold focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/30 uppercase px-2">עיר איסוף</label>
                <select 
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-14 px-6 rounded-2xl bg-primary/5 border-none outline-none font-bold focus:ring-2 focus:ring-accent/20 appearance-none"
                >
                  {settings?.cities.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/30 uppercase px-2">כמות אורחים</label>
                <input 
                  type="number" 
                  value={formData.numGuests}
                  onChange={(e) => setFormData({ ...formData, numGuests: parseInt(e.target.value) })}
                  className="w-full h-14 px-6 rounded-2xl bg-primary/5 border-none outline-none font-bold focus:ring-2 focus:ring-accent/20"
                />
              </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-primary/30 uppercase px-2 block">כיוון נסיעה</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'round_trip', label: 'הלוך חזור' },
                { id: 'outbound', label: 'הלוך בלבד' },
                { id: 'return', label: 'חזור בלבד' }
              ].map((dir) => (
                <button
                  key={dir.id}
                  onClick={() => setFormData({ ...formData, direction: dir.id as any })}
                  className={cn(
                    "h-14 rounded-2xl font-bold text-xs transition-all border-2",
                    formData.direction === dir.id 
                      ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                      : "bg-white border-primary/5 text-primary/40 hover:border-primary/10"
                  )}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {settings?.useShifts && formData.direction !== 'outbound' && (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary/30 uppercase px-2 block">סבב חזרה</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {settings.shifts.map((shift: string) => (
                  <button
                    key={shift}
                    onClick={() => setFormData({ ...formData, returnShift: shift })}
                    className={cn(
                      "h-12 rounded-xl font-bold text-[10px] transition-all border-2",
                      formData.returnShift === shift 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/10" 
                        : "bg-white border-primary/5 text-primary/40 hover:border-primary/10"
                    )}
                  >
                    {shift}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-primary/5 border-t border-primary/5 flex gap-4">
          <button 
            onClick={() => {
              if (window.confirm('האם אתה בטוח שברצונך למחוק רשומה זו לצמיתות?')) {
                api.deleteRegistration(formData.id).then(() => {
                  onSuccess();
                });
              }
            }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            title="מחיקת רשומה"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          <button 
            onClick={onClose}
            className="flex-1 h-16 rounded-2xl font-bold text-primary/40 hover:bg-primary/5 transition-all"
          >
            ביטול
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] h-16 rounded-2xl bg-accent text-white font-black shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? 'שומר שינויים...' : 'עדכן פרטי נרשם'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
