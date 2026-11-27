import type { TeachingAssignment } from '../types';

/**
 * Lightweight curriculum metadata used by the shell, HomeView, AppStateContext,
 * and data portability utilities so startup does not eagerly bundle the full
 * A1 & A2 exercise datasets (~450 KB).
 *
 * Parity with the full datasets is verified continuously by tests/infrastructure.regression.ts.
 */

export const A1_CURRICULUM_TOTALS = {
  words: 30,
  listening: 24,
  reading: 24,
  writing: 20,
  speaking: 20,
  activities: 51,
} as const;

export const A2_CURRICULUM_TOTALS = {
  words: 30,
  listening: 32,
  reading: 32,
  writing: 16,
  speaking: 20,
  activities: 51,
} as const;

export const A1_KARAOKE_IDS: readonly string[] = [
  'act-karaoke-kleiner-schritt',
  'act-karaoke-berlin',
  'act-karaoke-cafe',
  'act-karaoke-woche',
];

export const A2_KARAOKE_IDS_META: readonly string[] = [
  'a2-act-karaoke-alltag',
  'a2-act-karaoke-perfekt',
  'a2-act-karaoke-reise',
];

export const A2_CHARADE_IDS_META: readonly string[] = [
  'a2-act-char-1',
  'a2-act-char-2',
  'a2-act-char-3',
  'a2-act-char-4',
  'a2-act-char-5',
  'a2-act-char-6',
  'a2-act-char-7',
  'a2-act-char-8',
];

export const A2_ARENA_IDS_META: readonly string[] = [
  'a2-act-arena-1',
  'a2-act-arena-2',
  'a2-act-arena-3',
  'a2-act-arena-4',
  'a2-act-arena-5',
  'a2-act-arena-6',
  'a2-act-arena-7',
  'a2-act-arena-8',
  'a2-act-arena-9',
  'a2-act-arena-10',
  'a2-act-arena-11',
  'a2-act-arena-12',
];

export const A2_QUIZ_IDS_META: readonly string[] = [
  'a2-act-quiz-1',
  'a2-act-quiz-2',
  'a2-act-quiz-3',
  'a2-act-quiz-4',
  'a2-act-quiz-5',
  'a2-act-quiz-6',
  'a2-act-quiz-7',
  'a2-act-quiz-8',
  'a2-act-quiz-9',
  'a2-act-quiz-10',
  'a2-act-quiz-11',
  'a2-act-quiz-12',
];

export const A2_EXAM_IDS_META: readonly string[] = [
  'a2-act-exam-1',
  'a2-act-exam-2',
  'a2-act-exam-3',
  'a2-act-exam-4',
  'a2-act-exam-5',
  'a2-act-exam-6',
  'a2-act-exam-7',
  'a2-act-exam-8',
  'a2-act-exam-9',
  'a2-act-exam-10',
  'a2-act-exam-11',
  'a2-act-exam-12',
  'a2-act-exam-13',
  'a2-act-exam-14',
  'a2-act-exam-15',
  'a2-act-exam-16',
];

export interface A2TopicSummaryMeta {
  id: string;
  titleDe: string;
  titleTr: string;
  wordIds: readonly string[];
}

export const A2_TOPIC_SUMMARIES: readonly A2TopicSummaryMeta[] = [
  {
    id: 'a2-arbeit-alltag',
    titleDe: 'Arbeit, Beruf & Alltag',
    titleTr: 'İş Hayatı, Kariyer ve Planlama',
    wordIds: [
      'a2-arb-1',
      'a2-arb-2',
      'a2-arb-3',
      'a2-arb-4',
      'a2-arb-5',
      'a2-arb-6',
      'a2-arb-7',
      'a2-arb-8',
      'a2-arb-9',
      'a2-arb-10',
    ],
  },
  {
    id: 'a2-gesundheit-wohnen',
    titleDe: 'Gesundheit, Körper & Wohnen',
    titleTr: 'Sağlık, Beden ve Konut Yaşamı',
    wordIds: [
      'a2-ges-1',
      'a2-ges-2',
      'a2-ges-3',
      'a2-ges-4',
      'a2-ges-5',
      'a2-ges-6',
      'a2-ges-7',
      'a2-ges-8',
      'a2-ges-9',
      'a2-ges-10',
    ],
  },
  {
    id: 'a2-reisen-medien',
    titleDe: 'Reisen, Stadt & Medien',
    titleTr: 'Seyahat, Şehir ve Dijital İletişim',
    wordIds: [
      'a2-rei-1',
      'a2-rei-2',
      'a2-rei-3',
      'a2-rei-4',
      'a2-rei-5',
      'a2-rei-6',
      'a2-rei-7',
      'a2-rei-8',
      'a2-rei-9',
      'a2-rei-10',
    ],
  },
];

/**
 * Curated starter A1 assignments (all start strictly as 'assigned' with 0 XP earned)
 * so learners and teachers have immediate, realistic CEFR A1 tasks tied to real modules.
 */
export const STARTER_A1_ASSIGNMENTS: TeachingAssignment[] = [
  {
    id: 'assign-starter-selamlasma',
    titleTr: 'Ünite 1: Tanışma Kelimeleri ve Artikel Tekrarı',
    moduleRoute: 'kelime',
    targetId: 'selamlasma-tanisma',
    targetLabelTr: 'Selamlaşma ve Tanışma',
    dueDateLabel: 'Hafta 1 Önerilen Görev',
    instructionsTr:
      'Selamlaşma ve Tanışma ünitesindeki 10 A1 sözcüğünü kartlardan dinleyin ve Artikel Seçme alıştırmasını tamamlayın.',
    status: 'assigned',
    createdAt: '2026-01-01T09:00:00.000Z',
    isStarter: true,
  },
  {
    id: 'assign-starter-horen',
    titleTr: 'Hören Görevi: Tanışma Diyaloğu (Kulak Öncelikli)',
    moduleRoute: 'dinleme',
    targetId: 'horen-begrussung',
    targetLabelTr: 'Tanışma ve Selamlaşma',
    dueDateLabel: 'Hafta 2 Önerilen Görev',
    instructionsTr:
      'Önce metni gizli tutarak diyaloğu dinleyin; ardından Richtig/Falsch ve Lückentext sorularını çözün.',
    status: 'assigned',
    createdAt: '2026-01-01T09:05:00.000Z',
    isStarter: true,
  },
  {
    id: 'assign-starter-schreiben',
    titleTr: 'Schreiben Görevi: Kişisel Kayıt Formu ve Kısa Tanışma Notu',
    moduleRoute: 'yazma',
    targetId: 'schreiben-alltag',
    targetLabelTr: 'Kendini Tanıtma ve Kurs Kaydı',
    dueDateLabel: 'Hafta 3 Önerilen Görev',
    instructionsTr:
      'Kurs kayıt formunu doldurun, Leitpunkte ölçütlerini karşılayan kısa A1 mesajınızı yerel kural denetleyicisiyle kontrol edin.',
    status: 'assigned',
    createdAt: '2026-01-01T09:10:00.000Z',
    isStarter: true,
  },
];
