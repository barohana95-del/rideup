// =====================================================================
// RegistrationsTab — view, edit, delete, and export tenant registrations.
// =====================================================================
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Trash2, Pencil, Check, X, Loader2,
  Phone, MapPin, Clock, Users, AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../../lib/api';
import type { Registration } from '../../../types';

export default function RegistrationsTab({
  slug,
  registrations,
  onChange,
}: {
  slug: string;
  registrations: Registration[];
  onChange: () => Promise<void> | void;
}) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Registration>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter((r) =>
      r.fullName.toLowerCase().includes(q) ||
      r.phoneNumber.toLowerCase().includes(q) ||
      (r.city ?? '').toLowerCase().includes(q)
    );
  }, [registrations, query]);

  const totalGuests = registrations.reduce((sum, r) => sum + r.numGuests, 0);

  const startEdit = (r: Registration) => {
    setEditing(r.id);
    setEditForm({
      fullName: r.fullName,
      phoneNumber: r.phoneNumber,
      numGuests: r.numGuests,
      city: r.city ?? '',
      returnShift: r.returnShift ?? '',
      notes: r.notes ?? '',
    });
  };

  const cancelEdit = () => { setEditing(null); setEditForm({}); };

  const saveEdit = async (id: number) => {
    setSavingId(id);
    setError(null);
    const res = await adminApi.updateRegistration(slug, id, editForm as never);
    setSavingId(null);
    if (!res.success) { setError(res.error ?? 'שגיאה בעדכון'); return; }
    cancelEdit();
    await onChange();
  };

  const remove = async (id: number) => {
    if (!confirm('למחוק את הרישום?')) return;
    const res = await adminApi.deleteRegistration(slug, id);
    if (res.success) await onChange();
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    const ok = await adminApi.exportCsv(slug, 'registrations');
    setExporting(false);
    if (!ok) setError('הייצוא נכשל');
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-4 rounded-2xl flex items-start gap-3"
             style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />
          <p className="text-sm flex-1" style={{ color: '#991B1B' }}>{error}</p>
          <button onClick={() => setError(null)} className="text-xs px-2" style={{ color: '#7F1D1D' }}>×</button>
        </div>
      )}

      {/* Top bar */}
      <div className="rounded-2xl p-4 flex items-center gap-3 flex-wrap"
           style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}>
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4" style={{ color: '#6B7C95' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם, טלפון, או עיר..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ color: '#0A1F44' }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7C95' }}>
          <span><span className="font-bold" style={{ color: '#0A1F44' }}>{filtered.length}</span> רישומים</span>
          <span className="opacity-50">·</span>
          <span><span className="font-bold" style={{ color: '#0A1F44' }}>{totalGuests}</span> אורחים</span>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || registrations.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full transition-all disabled:opacity-40"
          style={{ background: '#1E63D6', color: '#fff' }}>
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          ייצא ל-Excel
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-10 text-center"
             style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}>
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#6B7C95' }} />
          <p className="font-bold mb-1" style={{ color: '#0A1F44' }}>
            {registrations.length === 0 ? 'אין עדיין רישומים' : 'לא נמצאו תוצאות'}
          </p>
          <p className="text-sm" style={{ color: '#6B7C95' }}>
            {registrations.length === 0 ? 'שתף את הקישור לאתר ותתחיל לקבל אישורי הגעה.' : 'נסה חיפוש אחר.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden"
             style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.1)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#EAF1FB' }}>
                <tr>
                  <Th>שם</Th>
                  <Th>טלפון</Th>
                  <Th align="center">אורחים</Th>
                  <Th>עיר</Th>
                  <Th>משמרת</Th>
                  <Th>הערות</Th>
                  <Th>נרשם</Th>
                  <Th align="center">פעולות</Th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((r) => {
                    const isEditing = editing === r.id;
                    const isSaving = savingId === r.id;
                    return (
                      <motion.tr key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                 className="border-t"
                                 style={{ borderColor: 'rgba(30,99,214,0.06)', background: isEditing ? '#FFFBEB' : '#fff' }}>
                        {isEditing ? (
                          <>
                            <Td><CellInput value={editForm.fullName ?? ''} onChange={(v) => setEditForm({ ...editForm, fullName: v })} /></Td>
                            <Td><CellInput value={editForm.phoneNumber ?? ''} onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })} dir="ltr" /></Td>
                            <Td align="center"><CellInput type="number" value={String(editForm.numGuests ?? 1)} onChange={(v) => setEditForm({ ...editForm, numGuests: parseInt(v, 10) || 1 })} width={60} /></Td>
                            <Td><CellInput value={editForm.city ?? ''} onChange={(v) => setEditForm({ ...editForm, city: v })} /></Td>
                            <Td><CellInput value={editForm.returnShift ?? ''} onChange={(v) => setEditForm({ ...editForm, returnShift: v })} /></Td>
                            <Td><CellInput value={editForm.notes ?? ''} onChange={(v) => setEditForm({ ...editForm, notes: v })} /></Td>
                            <Td><span style={{ color: '#6B7C95', fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString('he-IL')}</span></Td>
                            <Td align="center">
                              <div className="inline-flex gap-1">
                                <IconBtn onClick={() => saveEdit(r.id)} color="#10B981" disabled={isSaving}>
                                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                </IconBtn>
                                <IconBtn onClick={cancelEdit} color="#6B7C95"><X className="w-3.5 h-3.5" /></IconBtn>
                              </div>
                            </Td>
                          </>
                        ) : (
                          <>
                            <Td><span className="font-bold" style={{ color: '#0A1F44' }}>{r.fullName}</span></Td>
                            <Td>
                              <a href={`tel:${r.phoneNumber}`} className="inline-flex items-center gap-1" style={{ color: '#1E63D6' }} dir="ltr">
                                <Phone className="w-3 h-3" />
                                <span className="font-mono text-xs">{r.phoneNumber}</span>
                              </a>
                            </Td>
                            <Td align="center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs"
                                    style={{ background: '#EAF1FB', color: '#1E63D6' }}>{r.numGuests}</span>
                            </Td>
                            <Td>
                              {r.city ? (
                                <span className="inline-flex items-center gap-1 text-xs">
                                  <MapPin className="w-3 h-3" style={{ color: '#6B7C95' }} />{r.city}
                                </span>
                              ) : <Muted>—</Muted>}
                            </Td>
                            <Td>
                              {r.returnShift ? (
                                <span className="inline-flex items-center gap-1 text-xs">
                                  <Clock className="w-3 h-3" style={{ color: '#6B7C95' }} />{r.returnShift}
                                </span>
                              ) : <Muted>—</Muted>}
                            </Td>
                            <Td>{r.notes ? <span className="text-xs truncate max-w-[160px] inline-block" title={r.notes}>{r.notes}</span> : <Muted>—</Muted>}</Td>
                            <Td><span className="font-mono text-xs" style={{ color: '#6B7C95' }}>{new Date(r.createdAt).toLocaleDateString('he-IL')}</span></Td>
                            <Td align="center">
                              <div className="inline-flex gap-1">
                                <IconBtn onClick={() => startEdit(r)} color="#1E63D6"><Pencil className="w-3.5 h-3.5" /></IconBtn>
                                <IconBtn onClick={() => remove(r.id)} color="#DC2626"><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                              </div>
                            </Td>
                          </>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'right' | 'center' | 'left' }) {
  return <th className="px-4 py-3 font-bold text-xs uppercase tracking-wider" style={{ color: '#6B7C95', textAlign: align }}>{children}</th>;
}
function Td({ children, align = 'right' }: { children: React.ReactNode; align?: 'right' | 'center' | 'left' }) {
  return <td className="px-4 py-3" style={{ color: '#3D4F6B', textAlign: align }}>{children}</td>;
}
function Muted({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#9AA5B6' }}>{children}</span>;
}
function IconBtn({ children, onClick, color, disabled }: { children: React.ReactNode; onClick: () => void; color: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
            className="w-7 h-7 rounded-md inline-flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: `${color}15`, color }}>
      {children}
    </button>
  );
}
function CellInput({ value, onChange, dir, type = 'text', width }: { value: string; onChange: (v: string) => void; dir?: string; type?: string; width?: number }) {
  return (
    <input type={type} value={value} dir={dir} onChange={(e) => onChange(e.target.value)}
           className="px-2 py-1 text-xs focus:outline-none transition-all"
           style={{ background: '#fff', border: '1px solid rgba(30,99,214,0.25)', borderRadius: '6px', color: '#0A1F44', width: width ?? '100%' }} />
  );
}
