// =====================================================================
// TripPlanningTab — bus fleet manager + per-(city, shift) allocation.
// =====================================================================
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bus, MapPin, Clock, Plus, Trash2, Loader2, AlertCircle,
  RefreshCw, Users, TrendingUp, AlertTriangle, Download,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';

type Fleet = Awaited<ReturnType<typeof adminApi.listBuses>>['data'];
type Plan  = Awaited<ReturnType<typeof adminApi.getTripPlan>>['data'];

export default function TripPlanningTab({ slug }: { slug: string }) {
  const [fleet, setFleet] = useState<NonNullable<Fleet>>([]);
  const [plan, setPlan] = useState<NonNullable<Plan> | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add-bus form state
  const [newCap, setNewCap] = useState<string>('');
  const [newLabel, setNewLabel] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    setError(null);
    const ok = await adminApi.exportCsv(slug, 'trip-plan');
    setExporting(false);
    if (!ok) setError('הייצוא נכשל');
  }

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, [slug]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    const [busesRes, planRes] = await Promise.all([
      adminApi.listBuses(slug),
      adminApi.getTripPlan(slug),
    ]);
    setLoading(false);
    if (!busesRes.success) { setError(busesRes.error ?? 'שגיאה בטעינה'); return; }
    if (!planRes.success)  { setError(planRes.error ?? 'שגיאה בחישוב'); return; }
    setFleet(busesRes.data ?? []);
    setPlan(planRes.data ?? null);
  }

  async function refreshPlan() {
    setRecomputing(true);
    const res = await adminApi.getTripPlan(slug);
    setRecomputing(false);
    if (res.success && res.data) setPlan(res.data);
  }

  async function handleAddBus() {
    const cap = parseInt(newCap, 10);
    if (!cap || cap < 1 || cap > 200) {
      setError('הקיבולת חייבת להיות בין 1 ל-200');
      return;
    }
    setAdding(true);
    setError(null);
    const res = await adminApi.addBus(slug, cap, newLabel.trim() || undefined);
    setAdding(false);
    if (!res.success) { setError(res.error ?? 'שגיאה'); return; }
    setNewCap('');
    setNewLabel('');
    await loadAll();
  }

  async function handleDeleteBus(id: number) {
    if (!confirm('להסיר את סוג האוטובוס הזה?')) return;
    const res = await adminApi.deleteBus(slug, id);
    if (res.success) await loadAll();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7D39EB' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="p-4 rounded-2xl flex items-start gap-3"
          style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
          <div className="flex-1">
            <p className="text-sm" style={{ color: '#991B1B' }}>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-xs px-2" style={{ color: '#7F1D1D' }}>×</button>
        </div>
      )}

      <FleetSection
        fleet={fleet}
        newCap={newCap}
        newLabel={newLabel}
        adding={adding}
        onCapChange={setNewCap}
        onLabelChange={setNewLabel}
        onAdd={handleAddBus}
        onDelete={handleDeleteBus}
      />

      {plan && <SummaryStrip
        summary={plan.summary}
        fleet={fleet}
        onRefresh={refreshPlan}
        recomputing={recomputing}
        onExport={handleExport}
        exporting={exporting}
        canExport={plan.groups.length > 0 && fleet.length > 0}
      />}

      <PlanGrid plan={plan} fleet={fleet} />
    </div>
  );
}

/* ===== Fleet Section ===== */
function FleetSection({
  fleet, newCap, newLabel, adding, onCapChange, onLabelChange, onAdd, onDelete,
}: {
  fleet: NonNullable<Fleet>;
  newCap: string;
  newLabel: string;
  adding: boolean;
  onCapChange: (v: string) => void;
  onLabelChange: (v: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Bus className="w-4 h-4" style={{ color: '#7D39EB' }} />
        <h2 className="font-bold" style={{ color: '#000000' }}>צי האוטובוסים</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: '#6B7280' }}>
        הוסף את גודלי האוטובוסים שזמינים לאירוע. האלגוריתם יבחר את השילוב הטוב ביותר לכל עיר.
      </p>

      {/* Existing fleet */}
      {fleet.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-5">
          {fleet.map((bus) => (
            <div
              key={bus.id}
              className="group inline-flex items-center gap-2 pl-2 pr-3 py-2 rounded-full"
              style={{ background: '#F2EBFF', border: '1px solid rgba(125,57,235,0.2)' }}
            >
              <Bus className="w-3.5 h-3.5" style={{ color: '#7D39EB' }} />
              <span className="font-bold text-sm" style={{ color: '#000000' }}>
                {bus.capacity} מקומות
              </span>
              {bus.label && (
                <span className="text-xs" style={{ color: '#6B7280' }}>· {bus.label}</span>
              )}
              <button
                onClick={() => onDelete(bus.id)}
                className="ml-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-red-100"
                aria-label="הסר"
              >
                <Trash2 className="w-3 h-3" style={{ color: '#DC2626' }} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl p-4 mb-5 text-center text-sm"
          style={{ background: '#FFF7ED', border: '1px dashed #FDBA74', color: '#9A3412' }}
        >
          אין עדיין אוטובוסים בצי. הוסף לפחות אחד כדי שהאלגוריתם יוכל לתכנן.
        </div>
      )}

      {/* Add form */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs font-bold mb-1 block" style={{ color: '#000000' }}>
            קיבולת (מקומות)
          </label>
          <input
            type="number"
            value={newCap}
            onChange={(e) => onCapChange(e.target.value)}
            min={1}
            max={200}
            placeholder="50"
            className="w-full px-3 py-2.5 text-sm focus:outline-none transition-all"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(125,57,235,0.15)',
              borderRadius: '10px',
              color: '#000000',
            }}
          />
        </div>
        <div className="flex-[2] min-w-[180px]">
          <label className="text-xs font-bold mb-1 block" style={{ color: '#000000' }}>
            תיאור (אופציונלי)
          </label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="מיני / תיירים / וכו'"
            className="w-full px-3 py-2.5 text-sm focus:outline-none transition-all"
            style={{
              background: '#fff',
              border: '1.5px solid rgba(125,57,235,0.15)',
              borderRadius: '10px',
              color: '#000000',
            }}
            onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          />
        </div>
        <button
          onClick={onAdd}
          disabled={adding || !newCap}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-full transition-all disabled:opacity-40"
          style={{ background: '#7D39EB', color: '#fff' }}
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          הוסף אוטובוס
        </button>
      </div>
    </div>
  );
}

/* ===== Summary Strip ===== */
function SummaryStrip({
  summary, fleet, onRefresh, recomputing, onExport, exporting, canExport,
}: {
  summary: NonNullable<Plan>['summary'];
  fleet: NonNullable<Fleet>;
  onRefresh: () => void;
  recomputing: boolean;
  onExport: () => void;
  exporting: boolean;
  canExport: boolean;
}) {
  const utilization = summary.totalCapacity > 0
    ? Math.round(((summary.totalCapacity - summary.totalSpare) / summary.totalCapacity) * 100)
    : 0;
  const noFleet = !fleet || fleet.length === 0;

  return (
    <div
      className="rounded-2xl p-5 md:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
      style={{ background: '#000000', color: '#fff' }}
    >
      <SummaryItem icon={Users}    label="סך אורחים" value={summary.totalGuests.toLocaleString('he-IL')} />
      <SummaryItem icon={Bus}      label="אוטובוסים" value={summary.totalBuses.toString()} />
      <SummaryItem icon={TrendingUp} label="ניצולת" value={noFleet ? '—' : `${utilization}%`} accent={!noFleet && utilization >= 80 ? 'good' : 'mid'} />
      <div className="flex items-end justify-end col-span-2 sm:col-span-1 gap-2 flex-wrap">
        <button
          onClick={onExport}
          disabled={!canExport || exporting}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          ייצא
        </button>
        <button
          onClick={onRefresh}
          disabled={recomputing}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-50"
          style={{ background: '#7D39EB', color: '#fff' }}
        >
          {recomputing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          חישוב
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: 'good' | 'mid' }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </p>
      </div>
      <p
        className="text-2xl md:text-3xl font-black"
        style={{
          color: accent === 'good' ? '#86EFAC' : '#fff',
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ===== Per-group plan grid ===== */
function PlanGrid({ plan, fleet }: { plan: NonNullable<Plan> | null; fleet: NonNullable<Fleet> }) {
  if (!plan) return null;

  if (plan.groups.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}
      >
        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#6B7280' }} />
        <p className="font-bold mb-1" style={{ color: '#000000' }}>אין רישומים עדיין</p>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          ברגע שאורחים יתחילו להירשם — נציג כאן את התכנון לכל עיר.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plan.groups.map((group, i) => (
        <GroupCard key={`${group.city}-${group.shift}-${i}`} group={group} hasFleet={fleet.length > 0} />
      ))}
    </div>
  );
}

function GroupCard({ group, hasFleet }: { group: NonNullable<Plan>['groups'][number]; hasFleet: boolean }) {
  const occupancy = group.capacityProvided > 0
    ? Math.round(((group.capacityProvided - group.spareSeats) / group.capacityProvided) * 100)
    : 0;
  const showShift = group.shift !== '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid rgba(125,57,235,0.1)' }}
    >
      {/* Header */}
      <div
        className="p-5 border-b"
        style={{ borderColor: 'rgba(125,57,235,0.08)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: '#7D39EB' }} />
            <h3 className="font-bold truncate" style={{ color: '#000000' }}>
              {group.city}
            </h3>
          </div>
          <div
            className="font-black text-2xl tabular-nums shrink-0"
            style={{ color: '#7D39EB' }}
          >
            {group.totalGuests}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: '#6B7280' }}>
          {showShift && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {group.shift}
            </span>
          )}
          <span>{group.totalRegistrations} רישומים · {group.totalGuests} אורחים</span>
        </div>
      </div>

      {/* Plan */}
      <div className="p-5">
        {group.warning === 'no_fleet' || !hasFleet ? (
          <div
            className="rounded-xl p-3 flex items-start gap-2 text-sm"
            style={{ background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412' }}
          >
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>הוסף אוטובוסים לצי כדי לראות תכנון</span>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>
              תכנון מומלץ
            </p>
            <ul className="space-y-2 mb-4">
              {group.buses.map((bus, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                  style={{ background: '#F2EBFF' }}
                >
                  <Bus className="w-4 h-4 shrink-0" style={{ color: '#7D39EB' }} />
                  <span className="font-bold text-sm" style={{ color: '#000000' }}>
                    {bus.capacity} מקומות
                  </span>
                  {bus.label && (
                    <span className="text-xs mr-auto" style={{ color: '#6B7280' }}>{bus.label}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Capacity bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: '#6B7280' }}>ניצולת</span>
                <span className="font-bold" style={{ color: occupancy >= 80 ? '#10B981' : '#000000' }}>
                  {occupancy}% · {group.spareSeats} מקומות פנויים
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F2EBFF' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${occupancy}%`,
                    background: occupancy >= 80 ? '#10B981' : '#7D39EB',
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
