import type { UiLanguage } from '../types';
import { en } from './locales/en';
import { tr } from './locales/tr';
import type { UiLanguageOption, UiTranslations } from './types';

export type { UiLanguageOption, UiTranslations };
export { tr, en };

/**
 * Registry of all supported UI languages.
 * To add a new UI language (e.g. 'de'):
 * 1. Add the code to `UiLanguage` in `src/types/index.ts`.
 * 2. Create `src/i18n/locales/de.ts` satisfying `UiTranslations`.
 * 3. Register it in `UI_LANGUAGE_OPTIONS` and `TRANSLATIONS` below.
 */
export const UI_LANGUAGE_OPTIONS: readonly UiLanguageOption[] = [
  { code: 'tr', nativeLabel: 'Türkçe', shortLabel: 'TR', bcp47: 'tr-TR' },
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN', bcp47: 'en-US' },
] as const;

export const TRANSLATIONS: Record<UiLanguage, UiTranslations> = {
  tr,
  en,
};

export function getLocale(lang: UiLanguage): UiTranslations {
  return TRANSLATIONS[lang] ?? TRANSLATIONS.tr;
}

export function getBcp47Locale(lang: UiLanguage): string {
  return UI_LANGUAGE_OPTIONS.find((opt) => opt.code === lang)?.bcp47 ?? 'tr-TR';
}

export function formatMessage(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = params[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

/**
 * Picks a localized UI string from a strongly-typed language map with optional
 * `{{placeholder}}` interpolation. TypeScript enforces that every supported
 * `UiLanguage` is provided.
 */
export function pickLocalized(
  lang: UiLanguage,
  variants: Record<UiLanguage, string>,
  params?: Record<string, string | number>
): string {
  const raw = variants[lang] ?? variants.tr;
  return formatMessage(raw, params);
}

/**
 * Safely reads the persisted UI language outside React context (e.g., ErrorBoundary).
 */
export function getStoredUiLanguage(): UiLanguage {
  if (typeof window === 'undefined') return 'tr';
  try {
    const raw = window.localStorage.getItem('tk_stage1_prefs_v1');
    if (!raw) return 'tr';
    const parsed = JSON.parse(raw) as { uiLanguage?: unknown };
    if (parsed.uiLanguage === 'en') return 'en';
  } catch {
    // Ignore storage read errors
  }
  return 'tr';
}

export type LocaleDictionary = UiTranslations;
