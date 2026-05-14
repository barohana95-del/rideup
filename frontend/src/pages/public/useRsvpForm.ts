// =====================================================================
// useRsvpForm — shared RSVP form state + submit handler.
// Each public theme renders its own UI but consumes the same form logic
// from this hook so we don't duplicate validation/submit code per theme.
// =====================================================================
import { useState } from 'react';
import { publicApi } from '../../lib/api';
import type { PublicTenantConfig, RegistrationInput } from '../../types';

export interface RsvpFormApi {
  formData: RegistrationInput;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationInput>>;
  isSubmitting: boolean;
  isSuccess: boolean;
  formError: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForAnotherGuest: () => void;
}

export function useRsvpForm(slug: string, config: PublicTenantConfig): RsvpFormApi {
  const [formData, setFormData] = useState<RegistrationInput>({
    fullName: '',
    phoneNumber: '',
    numGuests: 1,
    city: config.cities[0] || '',
    returnShift: config.useShifts ? (config.shifts[0] || '') : undefined,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      setFormError('נא למלא שם ומספר טלפון.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    const res = await publicApi.register(slug, formData);
    setIsSubmitting(false);
    if (res.success) setIsSuccess(true);
    else setFormError(res.error || 'אירעה שגיאה. נסו שוב.');
  }

  function resetForAnotherGuest() {
    setIsSuccess(false);
    setFormData((prev) => ({ ...prev, fullName: '', phoneNumber: '', notes: '' }));
  }

  return { formData, setFormData, isSubmitting, isSuccess, formError, handleSubmit, resetForAnotherGuest };
}

export function formatHebDate(s: string | null | undefined): string {
  if (!s) return '';
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return s; }
}
