// =====================================================================
// SettingsTab — tenant-level settings (collaborators, danger zone, ...).
// =====================================================================
import { Users } from 'lucide-react';
import CollaboratorsSection from '../components/CollaboratorsSection';
import { getCurrentUser } from '../../../lib/auth';
import type { Tenant } from '../../../types';

export default function SettingsTab({
  tenant,
  slug,
}: {
  tenant: Tenant;
  slug: string;
  onSaved?: () => void;
}) {
  const me = getCurrentUser();
  const isOwner = me?.id === tenant.ownerUserId;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Page heading */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#7D39EB' }}>
          הגדרות אתר
        </p>
        <h1 className="text-2xl font-black" style={{ color: '#000' }}>
          ניהול גישה והגדרות
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          כאן תוכל לנהל מי משתף איתך את הניהול של האתר.
        </p>
      </div>

      {/* Collaborators */}
      <CollaboratorsSection slug={slug} isOwner={isOwner} />

      {/* Placeholder for future settings */}
      <div
        className="rounded-2xl p-5 md:p-6"
        style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4" style={{ color: '#6B7280' }} />
          <h2 className="font-bold" style={{ color: '#000' }}>הגדרות נוספות</h2>
        </div>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          בקרוב: ייצוא נתונים מלא, מחיקת אתר, ניהול תקופת גישה.
          כרגע — שינוי שם, צבעים, ולוגו תמצא בטאב "עיצוב".
        </p>
      </div>
    </div>
  );
}
