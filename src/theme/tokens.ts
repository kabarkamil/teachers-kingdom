import type { GermanArticle } from '../types';

export interface ArticleThemeToken {
  article: GermanArticle;
  genderLabelTr: string;
  genderLabelDe: string;
  textClass: string;
  surfaceClass: string;
  borderClass: string;
  buttonActiveClass: string;
}

/**
 * Institutional high-contrast article color tokens.
 * Color is always paired with explicit article + gender text labels (WCAG AA compliant).
 */
export const ARTICLE_TOKENS: Record<GermanArticle, ArticleThemeToken> = {
  der: {
    article: 'der',
    genderLabelTr: 'Eril',
    genderLabelDe: 'Maskulin',
    textClass: 'text-[#1D4ED8] dark:text-[#60A5FA]',
    surfaceClass: 'bg-[#EFF6FF] dark:bg-[#172554]/45',
    borderClass: 'border-[#BFDBFE] dark:border-[#1E40AF]/60',
    buttonActiveClass:
      'bg-[#1D4ED8] text-white border-[#1D4ED8] dark:bg-[#2563EB] dark:text-white dark:border-[#3B82F6]',
  },
  die: {
    article: 'die',
    genderLabelTr: 'Dişil',
    genderLabelDe: 'Feminin',
    textClass: 'text-[#7A1C24] dark:text-[#F4728A]',
    surfaceClass: 'bg-[#FDF2F4] dark:bg-[#4C0D1B]/50',
    borderClass: 'border-[#F5C2CC] dark:border-[#881337]/60',
    buttonActiveClass:
      'bg-[#7A1C24] text-white border-[#7A1C24] dark:bg-[#9F253D] dark:text-white dark:border-[#BE3450]',
  },
  das: {
    article: 'das',
    genderLabelTr: 'Nötr',
    genderLabelDe: 'Neutrum',
    textClass: 'text-[#925E0E] dark:text-[#D4AF37]',
    surfaceClass: 'bg-[#FEF9EB] dark:bg-[#422B06]/50',
    borderClass: 'border-[#F3D89B] dark:border-[#855A10]/60',
    buttonActiveClass:
      'bg-[#925E0E] text-white border-[#925E0E] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:border-[#D4AF37]',
  },
};
