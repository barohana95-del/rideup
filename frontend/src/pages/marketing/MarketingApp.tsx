// Marketing site — דף נחיתה. Placeholder ל-MVP.
import { useEffect, useState } from 'react';
import { systemApi } from '../../lib/api';

export default function MarketingApp() {
  const [hello, setHello] = useState<string>('...');

  useEffect(() => {
    systemApi.hello().then((res) => {
      if (res.success && res.data) setHello(`✓ ${res.data.message}`);
      else setHello(`✗ ${res.error || 'no connection'}`);
    });
  }, []);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-pink-50 p-8">
      <h1 className="text-5xl font-bold text-indigo-900 mb-4">RideUp</h1>
      <p className="text-xl text-gray-700 mb-8">פלטפורמה לניהול הסעות לאירועים</p>
      <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-md shadow">
        Backend: {hello}
      </div>
      <p className="mt-12 text-gray-400 text-sm">דף נחיתה — בבנייה (שלב 6)</p>
    </div>
  );
}
