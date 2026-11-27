import type { UiLanguage } from '../types';

export interface UiLanguageOption {
  code: UiLanguage;
  nativeLabel: string;
  shortLabel: string;
  bcp47: string;
}

/**
 * Strongly typed UI translation schema.
 * Adding a new UI language (e.g. 'de' or 'es') requires implementing this exact
 * interface, so TypeScript immediately guarantees 100% key parity across locales.
 */
export interface UiTranslations {
  brand: {
    name: string;
    slogan: string;
    philosophy: string;
    mottoEn: string;
    domain: string;
    emblemAlt: string;
  };
  course: {
    language: string;
    level: string;
    levelFull: string;
    a1Label: string;
    a2Label: string;
    levelSwitcherAria: string;
  };
  roles: {
    student: string;
    teacher: string;
    previewLabel: string;
    guestUser: string;
  };
  topBar: {
    authAction: string;
    authShort: string;
    themeToDark: string;
    themeToLight: string;
    openMenu: string;
    toggleSidebar: string;
    expandMenuTitle: string;
    collapseMenuTitle: string;
    switchLangLabel: string;
  };
  navGroups: {
    learning: string;
    activities: string;
    teaching: string;
    personal: string;
  };
  home: {
    titleA2: string;
    resumeCta: string;
    progressCta: string;
    switchToA1: string;
    switchToA2: string;
    skillsHeadingA1: string;
    skillsHeadingA2: string;
    continueLabel: string;
    openLabel: string;
    showAll: string;
    hideOverview: string;
    navHome: string;
    skipToContent: string;
    footerStatus: string;
  };
  common: {
    stage1Active: string;
    stage2Upcoming: string;
    startLearning: string;
    viewProgress: string;
    backToHome: string;
    openVocabModule: string;
    browserTtsNotice: string;
    ttsUnavailable: string;
    speedNormal: string;
    speedSlow: string;
    listenWord: string;
    listenSentence: string;
    loadingModule: string;
    close: string;
    cancel: string;
    save: string;
    saved: string;
    delete: string;
    reset: string;
    retry: string;
    next: string;
    previous: string;
    finish: string;
    check: string;
    showHint: string;
    hideHint: string;
    showTurkish: string;
    hideTurkish: string;
    showTranscript: string;
    hideTranscript: string;
    completed: string;
    inProgress: string;
    notStarted: string;
    totalXp: string;
    accuracy: string;
    attempts: string;
    correct: string;
    incorrect: string;
    score: string;
    streak: string;
    bestStreak: string;
    openSettingsBackup: string;
    dismissStorageWarning: string;
    repeatPracticeNoXp: string;
    classroomDisplayReady: string;
  };
  audio: {
    play: string;
    pause: string;
    stop: string;
    restart: string;
    playing: string;
    starting: string;
    speedLabel: string;
    ttsUnsupported: string;
    ttsTimeout: string;
    ttsError: string;
    micStart: string;
    micStop: string;
    micListening: string;
    micUnsupported: string;
    micPermissionDenied: string;
    micError: string;
  };
  errors: {
    boundaryBadge: string;
    boundaryTitle: string;
    boundaryBody: string;
    boundaryRetry: string;
    boundaryReload: string;
    boundaryDetails: string;
  };
}
