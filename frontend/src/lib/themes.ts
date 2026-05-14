// =====================================================================
// RideUp — Theme Registry
//
// Single source of truth for the visual themes available on a tenant's
// public RSVP page. Consumed by:
//   - frontend/src/pages/public/TenantApp.tsx (renders the right theme)
//   - frontend/src/pages/onboarding/steps/Step3Theme.tsx (theme picker)
//   - frontend/src/pages/admin/tabs/EditorTab.tsx (theme picker + preview)
//
// Each theme defines its own palette, fonts, default cover image and
// "personality" hints (vibe, descriptor) used in the picker UI.
// =====================================================================

export type ThemeKey = 'elegant' | 'minimal' | 'romantic' | 'bold' | 'luxe';

// Legacy theme keys (from before we redesigned the system). Public
// renderer maps them to their modern equivalents so existing tenants
// don't break.
export const LEGACY_THEME_MAP: Record<string, ThemeKey> = {
  classic: 'elegant',
  modern:  'minimal',
  rustic:  'romantic',
  festive: 'bold',
};

export function normalizeThemeKey(raw: string | null | undefined): ThemeKey {
  if (!raw) return 'elegant';
  if ((['elegant', 'minimal', 'romantic', 'bold', 'luxe'] as const).includes(raw as ThemeKey)) {
    return raw as ThemeKey;
  }
  return LEGACY_THEME_MAP[raw] ?? 'elegant';
}

export interface ThemeSpec {
  key: ThemeKey;
  /** Display name (Hebrew) shown in the picker. */
  label: string;
  /** Short vibe descriptor shown under the label. */
  vibe: string;
  /** Longer description for the onboarding screen. */
  description: string;
  /** Hex colors used throughout the theme + previews. */
  palette: {
    /** Page background. */
    bg: string;
    /** Card / surface inside the page. */
    surface: string;
    /** Primary text color. */
    text: string;
    /** Muted text color. */
    muted: string;
    /** Accent (CTA color). */
    accent: string;
    /** Secondary accent (subtle highlights). */
    accent2: string;
    /** Divider / hairline color. */
    divider: string;
  };
  fonts: {
    /** Display / headline font. */
    display: string;
    /** Body text font. */
    body: string;
  };
  /** A safe default cover image (used when the tenant didn't upload one). */
  defaultCover: string;
}

export const THEMES: Record<ThemeKey, ThemeSpec> = {
  elegant: {
    key: 'elegant',
    label: 'אלגנט',
    vibe: 'שחור-זהב • טיפוגרפיה קלאסית',
    description: 'מינימליסטי וטקסי. שחור עמוק עם זהב שמפניה ופונט קלאסי — מתאים לחתונה אלגנטית או אירוע חברה ברמה גבוהה.',
    palette: {
      bg:      '#0a0a0a',
      surface: '#151515',
      text:    '#f5e6c8',
      muted:   '#a99a82',
      accent:  '#c9a557',
      accent2: '#7a6235',
      divider: 'rgba(201, 165, 87, 0.2)',
    },
    fonts: {
      display: '"Playfair Display", "Frank Ruhl Libre", serif',
      body:    '"Cormorant Garamond", "Frank Ruhl Libre", serif',
    },
    defaultCover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2000&q=80',
  },

  minimal: {
    key: 'minimal',
    label: 'מינימל',
    vibe: 'לבן נקי • מודרני וזורם',
    description: 'גליל קליל ונקי, הרבה מרחב לבן, טיפוגרפיה גיאומטרית. הבחירה למי שאוהב שהעין נחה והפוקוס נשאר על האירוע.',
    palette: {
      bg:      '#fafafa',
      surface: '#ffffff',
      text:    '#171717',
      muted:   '#737373',
      accent:  '#171717',
      accent2: '#e5e5e5',
      divider: '#e5e5e5',
    },
    fonts: {
      display: '"Inter", "Heebo", sans-serif',
      body:    '"Inter", "Heebo", sans-serif',
    },
    defaultCover: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80',
  },

  romantic: {
    key: 'romantic',
    label: 'רומנטי',
    vibe: 'ורוד ושמנת • סקריפט עדין',
    description: 'גוונים פסטליים עדינים, פרחים בעדינות בפינות, ופונט סקריפט בכותרת. רוך וחמימות — אידיאלי לחתונה רומנטית או בת מצווה.',
    palette: {
      bg:      '#fdf2f0',
      surface: '#ffffff',
      text:    '#5b4538',
      muted:   '#a08679',
      accent:  '#c98474',
      accent2: '#a8c4a2',
      divider: 'rgba(201, 132, 116, 0.18)',
    },
    fonts: {
      display: '"Great Vibes", "Frank Ruhl Libre", cursive',
      body:    '"Cormorant Garamond", "Heebo", serif',
    },
    defaultCover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80',
  },

  bold: {
    key: 'bold',
    label: 'נועז',
    vibe: 'גרדיאנט תוסס • שמח וחגיגי',
    description: 'גרדיאנט חי של מג׳נטה לעמבר, צבעים תוססים, צורות גיאומטריות גדולות. אנרגיה של מסיבה — מתאים לבר/בת מצווה, יום הולדת או אירוע צעיר.',
    palette: {
      bg:      '#1a0033',
      surface: 'rgba(255,255,255,0.08)',
      text:    '#ffffff',
      muted:   'rgba(255,255,255,0.7)',
      accent:  '#fbbf24',
      accent2: '#ec4899',
      divider: 'rgba(255,255,255,0.15)',
    },
    fonts: {
      display: '"Space Grotesk", "Heebo", sans-serif',
      body:    '"Heebo", "Space Grotesk", sans-serif',
    },
    defaultCover: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=2000&q=80',
  },

  luxe: {
    key: 'luxe',
    label: 'יוקרה',
    vibe: 'בורדו • זהב אמיתי',
    description: 'בורדו עמוק עם זהב מלכותי, טיפוגרפיה מעוטרת ופילגרים זהב בפינות. הצהרה של פאר — לחתונה יוקרתית, השקה או אירוע VIP.',
    palette: {
      bg:      '#2a0a0a',
      surface: '#3a1414',
      text:    '#f5d8a8',
      muted:   '#c9a874',
      accent:  '#d4af37',
      accent2: '#f8e9c4',
      divider: 'rgba(212, 175, 55, 0.25)',
    },
    fonts: {
      display: '"Cinzel", "Frank Ruhl Libre", serif',
      body:    '"Cormorant Garamond", "Heebo", serif',
    },
    defaultCover: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80',
  },
};

export const THEME_KEYS: ThemeKey[] = ['elegant', 'minimal', 'romantic', 'bold', 'luxe'];

export function getTheme(raw: string | null | undefined): ThemeSpec {
  return THEMES[normalizeThemeKey(raw)];
}
