import { useEffect, useState } from 'react';
import { publicApi } from '../../lib/api';
import type { PublicTenantConfig, RegistrationInput } from '../../types';
import NotFound from './NotFound';
import { MapPin, Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function TenantApp({ slug }: { slug: string }) {
  const [config, setConfig] = useState<PublicTenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi.getConfig(slug).then((res) => {
      setLoading(false);
      if (res.success && res.data) setConfig(res.data);
      else setError(res.error || 'tenant not found');
    });
  }, [slug]);

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (error || !config) return <NotFound />;

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 font-sans selection:bg-stone-200">
      <ClassicTheme config={config} slug={slug} />
    </div>
  );
}

function ClassicTheme({ config, slug }: { config: PublicTenantConfig; slug: string }) {
  const [formData, setFormData] = useState<RegistrationInput>({
    fullName: '',
    phoneNumber: '',
    numGuests: 1,
    city: config.cities[0] || '',
    returnShift: config.useShifts ? (config.shifts[0] || '') : undefined,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const primaryColor = config.primaryColor || '#44403c'; // stone-700
  const coverImage = config.coverImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      setFormError('נא למלא שם ומספר טלפון.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    const res = await publicApi.register(slug, formData);
    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
    } else {
      setFormError(res.error || 'אירעה שגיאה. נסו שוב.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md">
            {config.eventTitle}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base opacity-90 font-medium">
            {config.eventDate && (
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                {new Date(config.eventDate).toLocaleDateString('he-IL')}
              </div>
            )}
            {config.eventTime && (
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                {config.eventTime.slice(0, 5)}
              </div>
            )}
            {config.eventLocation && (
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <MapPin className="w-4 h-4" />
                {config.eventLocation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex justify-center px-4 py-12 -mt-8 relative z-20">
        <div className="bg-white max-w-xl w-full rounded-2xl shadow-xl shadow-stone-200/50 p-6 md:p-10 border border-stone-100">
          
          {isSuccess ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-3">אישור הגעה התקבל!</h2>
              <p className="text-stone-600 mb-8 whitespace-pre-wrap">{config.texts.thankYouText || 'תודה רבה, נתראה באירוע!'}</p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData(prev => ({...prev, fullName: '', phoneNumber: '', notes: ''}));
                }}
                className="text-stone-500 hover:text-stone-800 transition-colors underline underline-offset-4 text-sm"
              >
                רישום אורח נוסף
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-stone-800 mb-4">אישור הגעה</h2>
                {config.texts.invitationText && (
                  <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">
                    {config.texts.invitationText}
                  </p>
                )}
                {config.texts.instructionsText && (
                  <p className="text-stone-500 mt-4 text-sm whitespace-pre-wrap bg-stone-50 p-4 rounded-xl">
                    {config.texts.instructionsText}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">שם מלא *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
                      placeholder="שם ושם משפחה"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">טלפון נייד *</label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      className="text-right w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="05X-XXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">כמות מגיעים *</label>
                    <select
                      value={formData.numGuests}
                      onChange={e => setFormData({...formData, numGuests: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'אורח' : 'אורחים'}</option>
                      ))}
                    </select>
                  </div>

                  {config.cities.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-stone-700">הסעה מאיזו עיר? *</label>
                      <select
                        required
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all appearance-none"
                      >
                        <option value="" disabled>בחרו עיר</option>
                        {config.cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {config.useShifts && config.shifts.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-stone-700">חזרה מועדפת (משוער) *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {config.shifts.map(shift => (
                        <label
                          key={shift}
                          className={`
                            cursor-pointer border rounded-xl p-3 text-center transition-all
                            ${formData.returnShift === shift 
                              ? 'border-stone-800 bg-stone-800 text-white shadow-md' 
                              : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'}
                          `}
                        >
                          <input
                            type="radio"
                            name="returnShift"
                            value={shift}
                            checked={formData.returnShift === shift}
                            onChange={(e) => setFormData({...formData, returnShift: e.target.value})}
                            className="hidden"
                          />
                          <span className="text-sm font-medium">{shift}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-700">הערות נוספות (אופציונלי)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all resize-none"
                    placeholder="הערות לנהג / בקשות מיוחדות"
                  />
                </div>

                {formError && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg text-center">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: primaryColor }}
                  className="w-full text-white font-medium py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 mt-6 shadow-md"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> שולח...</>
                  ) : (
                    'אישור הגעה'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      {config.showPoweredBy && (
        <footer className="py-6 text-center text-stone-400 text-sm font-medium relative z-20">
          Powered by <a href="https://rideup.co.il" className="text-stone-500 hover:text-stone-700 transition-colors font-semibold" target="_blank" rel="noopener noreferrer">RideUp</a>
        </footer>
      )}
    </div>
  );
}
