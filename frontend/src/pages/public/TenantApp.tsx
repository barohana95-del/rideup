// =====================================================================
// TenantApp — the public RSVP site for a tenant.
// Loads /api/public/config.php and dispatches to one of 5 themed
// renderers based on tenant.theme (with legacy key aliasing).
// =====================================================================
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import { normalizeThemeKey } from '../../lib/themes';
import type { PublicTenantConfig } from '../../types';
import NotFound from './NotFound';

import ElegantTheme  from './themes/ElegantTheme';
import MinimalTheme  from './themes/MinimalTheme';
import RomanticTheme from './themes/RomanticTheme';
import BoldTheme     from './themes/BoldTheme';
import LuxeTheme     from './themes/LuxeTheme';

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

  const theme = normalizeThemeKey(config.theme);
  const Themed =
    theme === 'minimal'  ? MinimalTheme :
    theme === 'romantic' ? RomanticTheme :
    theme === 'bold'     ? BoldTheme :
    theme === 'luxe'     ? LuxeTheme :
                           ElegantTheme;

  return (
    <div dir="rtl" className="selection:bg-black/10">
      <Themed config={config} slug={slug} />
    </div>
  );
}
