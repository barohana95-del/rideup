// Tenant public site — אתר ציבורי של לקוח. שלב 4.
import { useEffect, useState } from 'react';
import { publicApi } from '../../lib/api';
import type { PublicTenantConfig } from '../../types';
import NotFound from './NotFound';

export default function TenantApp({ slug }: { slug: string }) {
  const [config, setConfig] = useState<PublicTenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicApi.getConfig().then((res) => {
      setLoading(false);
      if (res.success && res.data) setConfig(res.data);
      else setError(res.error || 'tenant not found');
    });
  }, [slug]);

  if (loading) return <div dir="rtl" className="p-8 text-center">טוען...</div>;
  if (error || !config) return <NotFound />;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-2">{config.eventTitle}</h1>
      <p className="text-center text-gray-600">slug: {slug} · theme: {config.theme}</p>
      <p className="text-center text-gray-400 mt-8">אתר אורח — בבנייה (שלב 4)</p>
    </div>
  );
}
