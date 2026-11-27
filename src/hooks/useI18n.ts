import { useCallback, useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';
import {
  formatMessage,
  getBcp47Locale,
  getLocale,
  pickLocalized,
  type UiTranslations,
} from '../i18n';
import type { UiLanguage } from '../types';

export interface UseI18nResult {
  lang: UiLanguage;
  isEn: boolean;
  bcp47: string;
  locale: UiTranslations;
  format: (template: string, params?: Record<string, string | number>) => string;
  tx: (variants: Record<UiLanguage, string>, params?: Record<string, string | number>) => string;
  formatDateTime: (iso: string | null) => string;
  formatClock: (iso: string | null) => string;
}

/**
 * Shared React hook for UI internationalization across all Teachers Kingdom modules.
 * Keeps shared dictionary lookups and strongly-typed inline `tx({ tr, en })` copy
 * unified under a single extensible `UiLanguage` contract.
 */
export function useI18n(): UseI18nResult {
  const { uiLanguage } = useAppState();
  const locale = useMemo(() => getLocale(uiLanguage), [uiLanguage]);
  const bcp47 = useMemo(() => getBcp47Locale(uiLanguage), [uiLanguage]);

  const tx = useCallback(
    (variants: Record<UiLanguage, string>, params?: Record<string, string | number>) =>
      pickLocalized(uiLanguage, variants, params),
    [uiLanguage]
  );

  const formatDateTime = useCallback(
    (iso: string | null) => {
      if (!iso) {
        return pickLocalized(uiLanguage, {
          tr: 'Henüz kayıt yok',
          en: 'Not saved yet',
        });
      }
      try {
        return new Intl.DateTimeFormat(bcp47, {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(iso));
      } catch {
        return iso;
      }
    },
    [bcp47, uiLanguage]
  );

  const formatClock = useCallback(
    (iso: string | null) => {
      if (!iso) {
        return pickLocalized(uiLanguage, {
          tr: 'Henüz bu oturumda yazılmadı',
          en: 'Not written in this session yet',
        });
      }
      try {
        return new Intl.DateTimeFormat(bcp47, {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date(iso));
      } catch {
        return iso;
      }
    },
    [bcp47, uiLanguage]
  );

  return {
    lang: uiLanguage,
    isEn: uiLanguage === 'en',
    bcp47,
    locale,
    format: formatMessage,
    tx,
    formatDateTime,
    formatClock,
  };
}
