import type { NavGroupId, NavRouteId } from '../types';

export interface NavItemConfig {
  id: NavRouteId;
  labelTr: string;
  labelEn: string;
  group: NavGroupId;
}

export interface NavGroupConfig {
  id: NavGroupId;
  titleTr: string;
  titleEn: string;
  items: NavItemConfig[];
}

export const NAVIGATION_GROUPS: NavGroupConfig[] = [
  {
    id: 'learning',
    titleTr: 'Öğrenme Alanı',
    titleEn: 'Learning Hub',
    items: [
      { id: 'kelime', labelTr: 'Kelime', labelEn: 'Vocabulary', group: 'learning' },
      { id: 'dinleme', labelTr: 'Dinleme', labelEn: 'Listening', group: 'learning' },
      { id: 'okuma', labelTr: 'Okuma', labelEn: 'Reading', group: 'learning' },
      { id: 'yazma', labelTr: 'Yazma', labelEn: 'Writing', group: 'learning' },
      { id: 'konusma', labelTr: 'Konuşma', labelEn: 'Speaking', group: 'learning' },
    ],
  },
  {
    id: 'activities',
    titleTr: 'Etkinlikler',
    titleEn: 'Activities',
    items: [
      { id: 'karaoke', labelTr: 'Karaoke Stüdyosu', labelEn: 'Karaoke Studio', group: 'activities' },
      { id: 'sessiz-sinema', labelTr: 'Sessiz Sinema', labelEn: 'Charades', group: 'activities' },
      { id: 'arena', labelTr: 'Arena', labelEn: 'Arena', group: 'activities' },
      { id: 'quiz-merkezi', labelTr: 'Quiz Merkezi', labelEn: 'Quiz Center', group: 'activities' },
      {
        id: 'sinav-modu',
        labelTr: 'Sınav Modu / Sınav Bankası',
        labelEn: 'Exam Mode / Exam Bank',
        group: 'activities',
      },
    ],
  },
  {
    id: 'teaching',
    titleTr: 'Öğretim ve Yönetim',
    titleEn: 'Teaching & Management',
    items: [
      { id: 'siniflarim', labelTr: 'Sınıflarım', labelEn: 'My Classes', group: 'teaching' },
      { id: 'odevler', labelTr: 'Ödevler', labelEn: 'Assignments', group: 'teaching' },
      {
        id: 'ogretmen-studyosu',
        labelTr: 'Öğretmen Stüdyosu',
        labelEn: 'Teacher Studio',
        group: 'teaching',
      },
    ],
  },
  {
    id: 'personal',
    titleTr: 'Kişisel Alan',
    titleEn: 'Personal',
    items: [
      {
        id: 'ogrenme-yolum',
        labelTr: 'Öğrenme Yolum / İlerlemem',
        labelEn: 'Learning Path / Progress',
        group: 'personal',
      },
      { id: 'profil', labelTr: 'Profil', labelEn: 'Profile', group: 'personal' },
      { id: 'ayarlar', labelTr: 'Ayarlar', labelEn: 'Settings', group: 'personal' },
    ],
  },
];

export const CORE_LEARNING_PATH: Array<{
  stepNumber: string;
  routeId: NavRouteId;
  titleTr: string;
  titleEn: string;
  titleDe: string;
}> = [
  { stepNumber: '01', routeId: 'kelime', titleTr: 'Kelime', titleEn: 'Vocabulary', titleDe: 'Wortschatz' },
  { stepNumber: '02', routeId: 'dinleme', titleTr: 'Dinleme', titleEn: 'Listening', titleDe: 'Hören' },
  { stepNumber: '03', routeId: 'okuma', titleTr: 'Okuma', titleEn: 'Reading', titleDe: 'Lesen' },
  { stepNumber: '04', routeId: 'yazma', titleTr: 'Yazma', titleEn: 'Writing', titleDe: 'Schreiben' },
  { stepNumber: '05', routeId: 'konusma', titleTr: 'Konuşma', titleEn: 'Speaking', titleDe: 'Sprechen' },
];
