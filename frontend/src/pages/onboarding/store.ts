// =====================================================================
// Onboarding store — useState + localStorage persistence.
// Single hook used by all wizard steps.
// =====================================================================
import { useEffect, useState, useCallback } from 'react';
import { initialDraft, TOTAL_STEPS } from './types';
import type { OnboardingDraft } from './types';

const STORAGE_KEY = 'rideup_onboarding_draft_v1';

function loadDraft(): OnboardingDraft {
  if (typeof window === 'undefined') return initialDraft;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDraft;
    const parsed = JSON.parse(raw);
    return { ...initialDraft, ...parsed };
  } catch {
    return initialDraft;
  }
}

function saveDraft(d: OnboardingDraft) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    /* ignore quota */
  }
}

export function clearDraft() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useOnboarding() {
  const [draft, setDraft] = useState<OnboardingDraft>(loadDraft);

  // Persist on every change (debounced via microtask)
  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const update = useCallback(
    <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => {
      setDraft((d) => ({ ...d, [key]: value }));
    },
    []
  );

  const updateMany = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const next = useCallback(() => {
    setDraft((d) => ({ ...d, step: Math.min(d.step + 1, TOTAL_STEPS) }));
  }, []);

  const back = useCallback(() => {
    setDraft((d) => ({ ...d, step: Math.max(d.step - 1, 1) }));
  }, []);

  const goTo = useCallback((step: number) => {
    setDraft((d) => ({ ...d, step: Math.max(1, Math.min(step, TOTAL_STEPS)) }));
  }, []);

  const reset = useCallback(() => {
    clearDraft();
    setDraft(initialDraft);
  }, []);

  return { draft, update, updateMany, next, back, goTo, reset };
}
