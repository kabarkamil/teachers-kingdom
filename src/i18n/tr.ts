import type { UiLanguage } from '../types';

/**
 * Bilingual UI copy dictionary (TR / EN) for shell, navigation, and shared UI labels.
 */
export const tr = {
  brand: {
    name: 'Teachers Kingdom',
    slogan: 'Teachers Kingdom ile dil öğrenmek artık daha eğlenceli!',
    philosophy: 'Öğren. Öğret. Üret.',
    mottoEn: 'You can do it',
    domain: 'teacherskingdom.net',
  },
  course: {
    language: 'Almanca',
    level: 'A1',
    levelFull: 'CEFR A1 · Başlangıç',
    a1Label: 'Almanca A1',
    a2Label: 'Almanca A2',
  },
  roles: {
    student: 'Öğrenci',
    teacher: 'Öğretmen',
    previewLabel: 'Görünüm Rolü',
  },
  topBar: {
    authAction: 'Giriş Yap / Kayıt Ol',
    authShort: 'Giriş',
    themeToDark: 'Koyu temaya geç',
    themeToLight: 'Açık temaya geç',
    openMenu: 'Gezinme menüsünü aç',
    toggleSidebar: 'Kenar çubuğunu daralt veya genişlet',
    switchLangLabel: 'Arayüz dilini değiştir',
  },
  navGroups: {
    learning: 'Öğrenme Alanı',
    activities: 'Etkinlikler',
    teaching: 'Öğretim ve Yönetim',
    personal: 'Kişisel Alan',
  },
  home: {
    titleA2: 'Almanca A2 Çalışma Alanı',
    resumeCta: 'Kaldığın Yerden Devam Et',
    progressCta: 'İlerlemem',
    switchToA1: 'Almanca A1’e Geç',
    switchToA2: 'Almanca A2’ye Geç',
    skillsHeadingA1: '5 Temel A1 Becerisi',
    skillsHeadingA2: '5 Temel A2 Becerisi',
    continueLabel: 'Devam Et',
    openLabel: 'Aç',
    showAll: 'Tümünü Göster',
    hideOverview: 'Özeti Gizle',
    navHome: 'Ana Sayfa',
    skipToContent: 'Ana içeriğe geç',
    footerStatus: 'Almanca CEFR A1 & A2 · Yerel Depolama ve JSON Yedekleme',
  },
  common: {
    stage1Active: 'Aktif',
    stage2Upcoming: 'Yakında',
    startLearning: 'Öğrenmeye Başla',
    viewProgress: 'İlerlememi Gör',
    backToHome: 'Ana Sayfaya Dön',
    openVocabModule: 'Almanca A1 Kelime Modülünü Aç',
    browserTtsNotice: 'Tarayıcı Seslendirmesi (Web Speech API · de-DE)',
    ttsUnavailable:
      'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor. Kelimeleri yazılı telaffuz ve örnek cümlelerle çalışmaya devam edebilirsiniz.',
    speedNormal: 'Normal',
    speedSlow: 'Yavaş (A1)',
    listenWord: 'Kelimeyi dinle',
    listenSentence: 'Örnek cümleyi dinle',
  },
} as const;

export const en = {
  brand: {
    name: 'Teachers Kingdom',
    slogan: 'Learning languages is now more enjoyable with Teachers Kingdom!',
    philosophy: 'Learn. Teach. Create.',
    mottoEn: 'You can do it',
    domain: 'teacherskingdom.net',
  },
  course: {
    language: 'German',
    level: 'A1',
    levelFull: 'CEFR A1 · Beginner',
    a1Label: 'German A1',
    a2Label: 'German A2',
  },
  roles: {
    student: 'Student',
    teacher: 'Teacher',
    previewLabel: 'View Role',
  },
  topBar: {
    authAction: 'Sign In / Profile',
    authShort: 'Sign In',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    openMenu: 'Open navigation menu',
    toggleSidebar: 'Collapse or expand sidebar',
    switchLangLabel: 'Switch interface language',
  },
  navGroups: {
    learning: 'Learning Hub',
    activities: 'Activities',
    teaching: 'Teaching & Management',
    personal: 'Personal',
  },
  home: {
    titleA2: 'German A2 Workspace',
    resumeCta: 'Continue Where You Left Off',
    progressCta: 'My Progress',
    switchToA1: 'Switch to German A1',
    switchToA2: 'Switch to German A2',
    skillsHeadingA1: '5 Core A1 Skills',
    skillsHeadingA2: '5 Core A2 Skills',
    continueLabel: 'Continue',
    openLabel: 'Open',
    showAll: 'Show All',
    hideOverview: 'Hide Overview',
    navHome: 'Home',
    skipToContent: 'Skip to main content',
    footerStatus: 'German CEFR A1 & A2 · Local Storage & JSON Portability',
  },
  common: {
    stage1Active: 'Active',
    stage2Upcoming: 'Upcoming',
    startLearning: 'Start Learning',
    viewProgress: 'View Progress',
    backToHome: 'Back to Home',
    openVocabModule: 'Open German A1 Vocabulary Module',
    browserTtsNotice: 'Browser Speech Synthesis (Web Speech API · de-DE)',
    ttsUnavailable:
      'Web Speech API synthesis is not supported in this browser. You can continue studying with written pronunciation cues and examples.',
    speedNormal: 'Normal',
    speedSlow: 'Slow (A1)',
    listenWord: 'Listen to word',
    listenSentence: 'Listen to example sentence',
  },
} as const;

export function getLocale(lang: UiLanguage) {
  return lang === 'en' ? en : tr;
}

export type LocaleDictionary = typeof tr;
