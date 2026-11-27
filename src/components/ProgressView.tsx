import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BookText,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  Headphones,
  MessageSquare,
  PenTool,
  ShieldCheck,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import {
  evaluateProgressIntegrity,
  formatBytesTr,
  getLocalStorageDiagnostics,
  triggerJsonBackupDownload,
} from '../utils/dataPortability';
import {
  ARENA_IDS,
  CHARADE_IDS,
  EXAM_IDS,
  KARAOKE_IDS,
  QUIZ_IDS,
  TOTAL_ACTIVITY_ITEMS,
} from '../data/germanA1Activities';
import {
  GERMAN_A1_LISTENING_SCENARIOS,
  TOTAL_LISTENING_EXERCISES,
  getScenarioExerciseIds,
} from '../data/germanA1Listening';
import {
  GERMAN_A1_READING_SCENARIOS,
  TOTAL_READING_EXERCISES,
  getReadingScenarioExerciseIds,
} from '../data/germanA1Reading';
import {
  GERMAN_A1_SPEAKING_SCENARIOS,
  TOTAL_SPEAKING_TASKS,
  getSpeakingScenarioExerciseIds,
} from '../data/germanA1Speaking';
import {
  GERMAN_A1_WRITING_SCENARIOS,
  TOTAL_WRITING_TASKS,
  getWritingScenarioExerciseIds,
} from '../data/germanA1Writing';
import { ALL_A1_WORDS, GERMAN_A1_TOPICS } from '../data/germanA1Vocab';
import {
  GERMAN_A2_LISTENING_SCENARIOS,
  TOTAL_A2_LISTENING_EXERCISES,
  getA2ListeningExerciseIds,
} from '../data/germanA2Listening';
import {
  GERMAN_A2_READING_SCENARIOS,
  TOTAL_A2_READING_EXERCISES,
  getA2ReadingExerciseIds,
} from '../data/germanA2Reading';
import {
  GERMAN_A2_SPEAKING_SCENARIOS,
  TOTAL_A2_SPEAKING_TASKS,
  getA2SpeakingScenarioTaskIds,
} from '../data/germanA2Speaking';
import {
  GERMAN_A2_WRITING_SCENARIOS,
  TOTAL_A2_WRITING_TASKS,
  getA2WritingScenarioTaskIds,
} from '../data/germanA2Writing';
import {
  A2_ARENA_IDS,
  A2_CHARADE_IDS,
  A2_EXAM_IDS,
  A2_KARAOKE_IDS,
  A2_QUIZ_IDS,
  TOTAL_A2_ACTIVITY_ITEMS,
} from '../data/germanA2Activities';
import { ALL_A2_WORDS, GERMAN_A2_TOPICS } from '../data/germanA2Vocab';
import {
  STORAGE_KEY_A2_STATE,
  evaluateA2ProgressIntegrity,
} from '../utils/a2DataPortability';
import { useI18n } from '../hooks/useI18n';
import type { A2ActivityMode, ActivityMode, NavRouteId, UiLanguage } from '../types';

interface ProgressViewProps {
  onOpenTopic: (topicId: string) => void;
  onOpenA2Topic?: (topicId: string) => void;
  onOpenA2ListeningScenario?: (scenarioId: string) => void;
  onOpenA2ReadingScenario?: (scenarioId: string) => void;
  onOpenA2WritingScenario?: (scenarioId: string) => void;
  onOpenA2SpeakingScenario?: (scenarioId: string) => void;
  onOpenListeningScenario: (scenarioId: string) => void;
  onOpenReadingScenario: (scenarioId: string) => void;
  onOpenWritingScenario: (scenarioId: string) => void;
  onOpenSpeakingScenario: (scenarioId: string) => void;
  onOpenActivityRoute: (route: NavRouteId) => void;
}

const A2_MODE_LABELS: Record<A2ActivityMode, Record<UiLanguage, string>> = {
  'a2-flashcards': {
    tr: 'A2 · Kartlarla Öğren',
    en: 'A2 · Learn with Flashcards',
  },
  'a2-articles-plural': {
    tr: 'A2 · Artikel & Çoğul Avı',
    en: 'A2 · Article & Plural Hunt',
  },
  'a2-meaning': {
    tr: 'A2 · Anlam Eşleştirme',
    en: 'A2 · Meaning Match',
  },
  'a2-context': {
    tr: 'A2 · Cümle İçi Kullanım',
    en: 'A2 · In-Context Usage',
  },
  'a2-horen-tf': {
    tr: 'A2 Dinleme · Richtig / Falsch',
    en: 'A2 Listening · Richtig / Falsch',
  },
  'a2-horen-cloze': {
    tr: 'A2 Dinleme · Lückentext',
    en: 'A2 Listening · Lückentext',
  },
  'a2-horen-mc': {
    tr: 'A2 Dinleme · Anlama Testi',
    en: 'A2 Listening · Comprehension Quiz',
  },
  'a2-lesen-tf': {
    tr: 'A2 Okuma · Richtig / Falsch / Yok',
    en: 'A2 Reading · Richtig / Falsch / Not Mentioned',
  },
  'a2-lesen-cloze': {
    tr: 'A2 Okuma · Lückentext',
    en: 'A2 Reading · Lückentext',
  },
  'a2-lesen-mc': {
    tr: 'A2 Okuma · Anlama & Çıkarım',
    en: 'A2 Reading · Comprehension & Inference',
  },
  'a2-schreiben-message': {
    tr: 'A2 Yazma · Kılavuzlu E-Posta / Mesaj',
    en: 'A2 Writing · Guided Email / Message',
  },
  'a2-schreiben-controlled': {
    tr: 'A2 Yazma · Satzbau & Lückentext',
    en: 'A2 Writing · Satzbau & Lückentext',
  },
  'a2-sprechen-repeat': {
    tr: 'A2 Konuşma · Telaffuz & Kalıp Tekrarı',
    en: 'A2 Speaking · Pronunciation & Pattern Repeat',
  },
  'a2-sprechen-prompt': {
    tr: 'A2 Konuşma · Kılavuzlu Yanıt & Deneyim',
    en: 'A2 Speaking · Guided Response & Experience',
  },
  'a2-sprechen-roleplay': {
    tr: 'A2 Konuşma · Çok Turlu Rol Oyunu',
    en: 'A2 Speaking · Multi-Turn Roleplay',
  },
  'a2-activity-karaoke': {
    tr: 'A2 Etkinlik · Karaoke Stüdyosu',
    en: 'A2 Activity · Karaoke Studio',
  },
  'a2-activity-charades': {
    tr: 'A2 Etkinlik · Sessiz Sinema',
    en: 'A2 Activity · Charades',
  },
  'a2-activity-arena': {
    tr: 'A2 Etkinlik · Arena',
    en: 'A2 Activity · Arena',
  },
  'a2-activity-quiz': {
    tr: 'A2 Etkinlik · Quiz Merkezi',
    en: 'A2 Activity · Quiz Center',
  },
  'a2-activity-exam': {
    tr: 'A2 Etkinlik · A2 Sınav Modu',
    en: 'A2 Activity · A2 Exam Mode',
  },
};

const MODE_LABELS: Record<ActivityMode, Record<UiLanguage, string>> = {
  flashcards: {
    tr: 'Kelime Kartları',
    en: 'Flashcards',
  },
  articles: {
    tr: 'Artikel Seçme',
    en: 'Article Selection',
  },
  quiz: {
    tr: 'Doğru Anlamı Bulma',
    en: 'Meaning Quiz',
  },
  memory: {
    tr: 'Hafıza Eşleştirme',
    en: 'Memory Match',
  },
  'horen-tf': {
    tr: 'Dinleme · Richtig / Falsch',
    en: 'Listening · Richtig / Falsch',
  },
  'horen-cloze': {
    tr: 'Dinleme · Lückentext',
    en: 'Listening · Lückentext',
  },
  'horen-mc': {
    tr: 'Dinleme · Anlama Testi',
    en: 'Listening · Comprehension Quiz',
  },
  'lesen-tf': {
    tr: 'Okuma · Richtig / Falsch',
    en: 'Reading · Richtig / Falsch',
  },
  'lesen-cloze': {
    tr: 'Okuma · Lückentext',
    en: 'Reading · Lückentext',
  },
  'lesen-mc': {
    tr: 'Okuma · Anlama Testi',
    en: 'Reading · Comprehension Quiz',
  },
  'schreiben-form': {
    tr: 'Yazma · Formular ausfüllen',
    en: 'Writing · Formular ausfüllen',
  },
  'schreiben-message': {
    tr: 'Yazma · Kısa Mesaj / Not',
    en: 'Writing · Short Message / Note',
  },
  'schreiben-controlled': {
    tr: 'Yazma · Satzbau & Lückentext',
    en: 'Writing · Satzbau & Lückentext',
  },
  'sprechen-repeat': {
    tr: 'Konuşma · Nachsprechen',
    en: 'Speaking · Nachsprechen',
  },
  'sprechen-prompt': {
    tr: 'Konuşma · Leitfragen',
    en: 'Speaking · Leitfragen',
  },
  'sprechen-roleplay': {
    tr: 'Konuşma · Dialog / Rollenspiel',
    en: 'Speaking · Dialog / Rollenspiel',
  },
  'activity-karaoke': {
    tr: 'Etkinlik · Karaoke Stüdyosu',
    en: 'Activity · Karaoke Studio',
  },
  'activity-charades': {
    tr: 'Etkinlik · Sessiz Sinema',
    en: 'Activity · Charades',
  },
  'activity-arena': {
    tr: 'Etkinlik · Arena',
    en: 'Activity · Arena',
  },
  'activity-quiz': {
    tr: 'Etkinlik · Quiz Merkezi',
    en: 'Activity · Quiz Center',
  },
  'activity-exam': {
    tr: 'Etkinlik · A1 Sınav Modu',
    en: 'Activity · A1 Exam Mode',
  },
  'teaching-class': {
    tr: 'Sınıflarım · Yerel Grup',
    en: 'My Classes · Local Group',
  },
  'teaching-assignment': {
    tr: 'Ödevler · A1 Görev',
    en: 'Assignments · A1 Task',
  },
  'teaching-studio': {
    tr: 'Öğretmen Stüdyosu · Taslak',
    en: 'Teacher Studio · Draft',
  },
};

export const ProgressView: React.FC<ProgressViewProps> = ({
  onOpenTopic,
  onOpenA2Topic,
  onOpenA2ListeningScenario,
  onOpenA2ReadingScenario,
  onOpenA2WritingScenario,
  onOpenA2SpeakingScenario,
  onOpenListeningScenario,
  onOpenReadingScenario,
  onOpenWritingScenario,
  onOpenSpeakingScenario,
  onOpenActivityRoute,
}) => {
  const { locale, tx, formatDateTime } = useI18n();
  const fmtPct = (value: number) =>
    tx({ tr: '%{{value}}', en: '{{value}}%' }, { value });
  const {
    theme,
    rolePreview,
    speechSpeed,
    activeCourse,
    setActiveCourse,
    displayName,
    progress,
    a2Progress,
    lastSavedAt,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
    overallAccuracyPercent,
    a2ListeningAccuracyPercent,
    a2ReadingAccuracyPercent,
    a2WritingAccuracyPercent,
    a2ActivityAccuracyPercent,
    a2OverallAccuracyPercent,
    listeningAccuracyPercent,
    readingAccuracyPercent,
    writingAccuracyPercent,
    activityAccuracyPercent,
  } = useAppState();

  const [backupFilename, setBackupFilename] = useState<string | null>(null);
  const integrity = useMemo(() => evaluateProgressIntegrity(progress), [progress]);
  const a2Integrity = useMemo(() => evaluateA2ProgressIntegrity(a2Progress), [a2Progress]);
  const storageDiag = useMemo(
    () => getLocalStorageDiagnostics(),
    [progress, a2Progress, lastSavedAt]
  );

  const handleQuickBackupDownload = () => {
    const { filename } = triggerJsonBackupDownload(
      progress,
      {
        displayName,
        rolePreview,
        speechSpeed,
        theme,
        activeCourse,
      },
      a2Progress
    );
    setBackupFilename(filename);
    window.setTimeout(() => setBackupFilename(null), 4000);
  };

  if (activeCourse === 'de-A2') {
    const totalA2Words = ALL_A2_WORDS.length;
    const completedA2Count = uniqueA2CompletedWordIds.length;
    const a2WordPct =
      totalA2Words > 0 ? Math.round((completedA2Count / totalA2Words) * 100) : 0;

    const completedA2ListeningCount = a2Progress.listeningMasteredIds.length;
    const a2ListeningPct =
      TOTAL_A2_LISTENING_EXERCISES > 0
        ? Math.round((completedA2ListeningCount / TOTAL_A2_LISTENING_EXERCISES) * 100)
        : 0;

    const completedA2ReadingCount = a2Progress.readingMasteredIds.length;
    const a2ReadingPct =
      TOTAL_A2_READING_EXERCISES > 0
        ? Math.round((completedA2ReadingCount / TOTAL_A2_READING_EXERCISES) * 100)
        : 0;

    const completedA2WritingCount = a2Progress.writingMasteredIds.length;
    const a2WritingPct =
      TOTAL_A2_WRITING_TASKS > 0
        ? Math.round((completedA2WritingCount / TOTAL_A2_WRITING_TASKS) * 100)
        : 0;

    const completedA2SpeakingCount = a2Progress.speakingMasteredIds.length;
    const a2SpeakingPct =
      TOTAL_A2_SPEAKING_TASKS > 0
        ? Math.round((completedA2SpeakingCount / TOTAL_A2_SPEAKING_TASKS) * 100)
        : 0;

    const completedA2ActivityCount = a2Progress.activityMasteredIds.length;
    const a2ActivityPct =
      TOTAL_A2_ACTIVITY_ITEMS > 0
        ? Math.round((completedA2ActivityCount / TOTAL_A2_ACTIVITY_ITEMS) * 100)
        : 0;

    const totalA2GradedAttempts =
      a2Progress.articlePluralAttempts +
      a2Progress.meaningAttempts +
      a2Progress.contextAttempts +
      a2Progress.listeningAttempts +
      a2Progress.readingAttempts +
      a2Progress.writingAttempts +
      a2Progress.activityAttempts;
    const hasAnyA2Activity =
      a2Progress.xp > 0 ||
      a2Progress.studiedFlashcards.length > 0 ||
      a2Progress.speakingAttempts > 0 ||
      a2Progress.activityMasteredIds.length > 0 ||
      a2Progress.a2ExamCompletedCount > 0 ||
      totalA2GradedAttempts > 0;

    const articlePluralAcc =
      a2Progress.articlePluralAttempts > 0
        ? Math.round(
            (a2Progress.articlePluralCorrect / a2Progress.articlePluralAttempts) * 100
          )
        : null;
    const meaningAcc =
      a2Progress.meaningAttempts > 0
        ? Math.round((a2Progress.meaningCorrect / a2Progress.meaningAttempts) * 100)
        : null;
    const contextAcc =
      a2Progress.contextAttempts > 0
        ? Math.round((a2Progress.contextCorrect / a2Progress.contextAttempts) * 100)
        : null;

    const openA2Unit = (topicId: string) => {
      if (onOpenA2Topic) {
        onOpenA2Topic(topicId);
      } else {
        onOpenActivityRoute('kelime');
      }
    };

    const openA2Scenario = (scenarioId: string) => {
      if (onOpenA2ListeningScenario) {
        onOpenA2ListeningScenario(scenarioId);
      } else {
        onOpenActivityRoute('dinleme');
      }
    };

    const openA2ReadingScenario = (scenarioId: string) => {
      if (onOpenA2ReadingScenario) {
        onOpenA2ReadingScenario(scenarioId);
      } else {
        onOpenActivityRoute('okuma');
      }
    };

    const openA2WritingScenario = (scenarioId: string) => {
      if (onOpenA2WritingScenario) {
        onOpenA2WritingScenario(scenarioId);
      } else {
        onOpenActivityRoute('yazma');
      }
    };

    const openA2SpeakingScenario = (scenarioId: string) => {
      if (onOpenA2SpeakingScenario) {
        onOpenA2SpeakingScenario(scenarioId);
      } else {
        onOpenActivityRoute('konusma');
      }
    };

    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-8">
        {/* A2 Progress Header */}
        <div className="flex flex-col gap-3 border-b border-[#D9D9D3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#282830]">
          <div>
            <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              {locale.navGroups.personal} ·{' '}
              {tx({
                tr: 'Almanca CEFR A2 · İzole Yerel Kayıt',
                en: 'German CEFR A2 · Isolated Local Storage',
              })}{' '}
              (<span className="font-mono">{STORAGE_KEY_A2_STATE}</span>)
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: 'Almanca A2 — Öğrenme Yolum ve İlerlemem',
                en: 'German A2 — Learning Path & Progress',
              })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openA2Unit(GERMAN_A2_TOPICS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <span>{tx({ tr: 'A2 Kelime', en: 'A2 Vocabulary' })}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openA2Scenario(GERMAN_A2_LISTENING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <Headphones className="h-4 w-4" />
              <span>{tx({ tr: 'A2 Dinleme', en: 'A2 Listening' })}</span>
            </button>
            <button
              type="button"
              onClick={() => openA2ReadingScenario(GERMAN_A2_READING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <BookText className="h-4 w-4" />
              <span>{tx({ tr: 'A2 Okuma', en: 'A2 Reading' })}</span>
            </button>
            <button
              type="button"
              onClick={() => openA2WritingScenario(GERMAN_A2_WRITING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <PenTool className="h-4 w-4" />
              <span>{tx({ tr: 'A2 Yazma', en: 'A2 Writing' })}</span>
            </button>
            <button
              type="button"
              onClick={() => openA2SpeakingScenario(GERMAN_A2_SPEAKING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{tx({ tr: 'A2 Konuşma', en: 'A2 Speaking' })}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenActivityRoute('sinav-modu')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{tx({ tr: 'A2 Sınav Modu', en: 'A2 Exam Mode' })}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCourse('de-A1')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <span>
                {tx(
                  { tr: 'A1 İlerlemesi ({{xp}} XP)', en: 'A1 Progress ({{xp}} XP)' },
                  { xp: progress.xp }
                )}
              </span>
            </button>
          </div>
        </div>

        {/* A2 Real KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Toplam A2 XP', en: 'Total A2 XP' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp} XP
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Aşama 1–6 · Tekil XP', en: 'Stages 1–6 · Unique XP' })}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Kelime', en: 'A2 Vocabulary' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2Count} / {totalA2Words}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2WordPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Dinleme', en: 'A2 Listening' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ListeningCount} / {TOTAL_A2_LISTENING_EXERCISES}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2ListeningPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Okuma', en: 'A2 Reading' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ReadingCount} / {TOTAL_A2_READING_EXERCISES}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2ReadingPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Yazma', en: 'A2 Writing' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2WritingCount} / {TOTAL_A2_WRITING_TASKS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2WritingPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Konuşma', en: 'A2 Speaking' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2SpeakingCount} / {TOTAL_A2_SPEAKING_TASKS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2SpeakingPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Etkinlik & Sınav', en: 'A2 Activities & Exam' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ActivityCount} / {TOTAL_A2_ACTIVITY_ITEMS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
                { pct: fmtPct(a2ActivityPct) }
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Doğruluk', en: 'A2 Accuracy' })}
            </p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {a2OverallAccuracyPercent === null ? '—' : fmtPct(a2OverallAccuracyPercent)}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{count}} puanlı yanıt', en: '{{count}} graded responses' },
                { count: totalA2GradedAttempts }
              )}
            </p>
          </div>
        </div>

        {/* Honest Empty State */}
        {!hasAnyA2Activity && (
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-7 text-center dark:border-[#282830] dark:bg-[#16161A]">
            <BookOpen className="mx-auto h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <h2 className="mt-3 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: 'Henüz Almanca A2 çalışma kaydınız yok',
                en: 'No German A2 study activity yet',
              })}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'A2 Kelime, Dinleme, Okuma, Yazma, Konuşma veya A2 Etkinlikler / Sınav Modu çalışmalarını başlattığınızda gerçek A2 XP, doğruluk ve ilerlemeniz burada anlık güncellenir.',
                en: 'Once you start A2 Vocabulary, Listening, Reading, Writing, Speaking, or A2 Activities / Exam Mode, your real A2 XP, accuracy, and progress update live here.',
              })}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openA2Unit(GERMAN_A2_TOPICS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <span>
                  {tx({
                    tr: 'A2 Kelime Çalışmasını Başlat',
                    en: 'Start A2 Vocabulary Practice',
                  })}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openA2Scenario(GERMAN_A2_LISTENING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <Headphones className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'A2 Dinleme (Hören) Başlat',
                    en: 'Start A2 Listening (Hören)',
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => openA2ReadingScenario(GERMAN_A2_READING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <BookText className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'A2 Okuma (Lesen) Başlat',
                    en: 'Start A2 Reading (Lesen)',
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => openA2WritingScenario(GERMAN_A2_WRITING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <PenTool className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'A2 Yazma (Schreiben) Başlat',
                    en: 'Start A2 Writing (Schreiben)',
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => openA2SpeakingScenario(GERMAN_A2_SPEAKING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <MessageSquare className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'A2 Konuşma (Sprechen) Başlat',
                    en: 'Start A2 Speaking (Sprechen)',
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('sinav-modu')}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({ tr: 'A2 Sınav Modunu Aç', en: 'Open A2 Exam Mode' })}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* A2 Topic-by-Topic Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '01. Almanca A2 Kelime (Wortschatz) — Ünite İlerlemesi',
                en: '01. German A2 Vocabulary (Wortschatz) — Unit Progress',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} kelime', en: '{{done}} / {{total}} words' },
                { done: completedA2Count, total: totalA2Words }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GERMAN_A2_TOPICS.map((topic) => {
              const doneInTopic = topic.words.filter((w) =>
                uniqueA2CompletedWordIds.includes(w.id)
              ).length;
              const pct = Math.round((doneInTopic / topic.words.length) * 100);
              return (
                <div
                  key={topic.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span>{topic.titleDe}</span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                        {doneInTopic} / {topic.words.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {topic.titleTr}
                    </h3>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2Unit(topic.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInTopic > 0
                        ? tx({ tr: 'Çalışmaya Devam Et', en: 'Continue Studying' })
                        : tx({ tr: 'Üniteyi Başlat', en: 'Start Unit' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Listening Scenario Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '02. Almanca A2 Dinleme (Hören) — Senaryo İlerlemesi',
                en: '02. German A2 Listening (Hören) — Scenario Progress',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} alıştırma', en: '{{done}} / {{total}} exercises' },
                { done: completedA2ListeningCount, total: TOTAL_A2_LISTENING_EXERCISES }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GERMAN_A2_LISTENING_SCENARIOS.map((scenario) => {
              const ids = getA2ListeningExerciseIds(scenario);
              const doneInScenario = ids.filter((id) =>
                a2Progress.listeningMasteredIds.includes(id)
              ).length;
              const pct = ids.length > 0 ? Math.round((doneInScenario / ids.length) * 100) : 0;

              return (
                <div
                  key={scenario.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="truncate">{scenario.contextLabelTr}</span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                        {doneInScenario} / {ids.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {scenario.titleDe}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.titleTr}
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2Scenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0
                        ? tx({ tr: 'Dinlemeye Devam Et', en: 'Continue Listening' })
                        : tx({ tr: 'Senaryoyu Başlat', en: 'Start Scenario' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Reading Scenario Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '03. Almanca A2 Okuma (Lesen) — Metin İlerlemesi',
                en: '03. German A2 Reading (Lesen) — Text Progress',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} alıştırma', en: '{{done}} / {{total}} exercises' },
                { done: completedA2ReadingCount, total: TOTAL_A2_READING_EXERCISES }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GERMAN_A2_READING_SCENARIOS.map((scenario) => {
              const ids = getA2ReadingExerciseIds(scenario);
              const doneInScenario = ids.filter((id) =>
                a2Progress.readingMasteredIds.includes(id)
              ).length;
              const pct = ids.length > 0 ? Math.round((doneInScenario / ids.length) * 100) : 0;

              return (
                <div
                  key={scenario.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="truncate">{scenario.contextLabelTr}</span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                        {doneInScenario} / {ids.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {scenario.titleDe}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.titleTr}
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2ReadingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0
                        ? tx({ tr: 'Okumaya Devam Et', en: 'Continue Reading' })
                        : tx({ tr: 'Metni Başlat', en: 'Start Text' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Writing Scenario Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '04. Almanca A2 Yazma (Schreiben) — Senaryo İlerlemesi',
                en: '04. German A2 Writing (Schreiben) — Scenario Progress',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} görev', en: '{{done}} / {{total}} tasks' },
                { done: completedA2WritingCount, total: TOTAL_A2_WRITING_TASKS }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GERMAN_A2_WRITING_SCENARIOS.map((scenario) => {
              const ids = getA2WritingScenarioTaskIds(scenario);
              const doneInScenario = ids.filter((id) =>
                a2Progress.writingMasteredIds.includes(id)
              ).length;
              const pct = ids.length > 0 ? Math.round((doneInScenario / ids.length) * 100) : 0;

              return (
                <div
                  key={scenario.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="truncate">{scenario.contextLabelTr}</span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                        {doneInScenario} / {ids.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {scenario.titleDe}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.titleTr}
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2WritingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0
                        ? tx({ tr: 'Yazmaya Devam Et', en: 'Continue Writing' })
                        : tx({ tr: 'Görevi Başlat', en: 'Start Task' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Speaking Scenario Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '05. Almanca A2 Konuşma (Sprechen) — Senaryo İlerlemesi',
                en: '05. German A2 Speaking (Sprechen) — Scenario Progress',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} pratik', en: '{{done}} / {{total}} practices' },
                { done: completedA2SpeakingCount, total: TOTAL_A2_SPEAKING_TASKS }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GERMAN_A2_SPEAKING_SCENARIOS.map((scenario) => {
              const ids = getA2SpeakingScenarioTaskIds(scenario);
              const doneInScenario = ids.filter((id) =>
                a2Progress.speakingMasteredIds.includes(id)
              ).length;
              const pct = ids.length > 0 ? Math.round((doneInScenario / ids.length) * 100) : 0;

              return (
                <div
                  key={scenario.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="truncate">{scenario.contextLabelTr}</span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                        {doneInScenario} / {ids.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {scenario.titleDe}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.titleTr}
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2SpeakingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0
                        ? tx({ tr: 'Konuşmaya Devam Et', en: 'Continue Speaking' })
                        : tx({ tr: 'Senaryoyu Başlat', en: 'Start Scenario' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Activities & Exam Bank Progress (Stage 6) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: '06. Almanca A2 Etkinlikler ve Sınav Bankası',
                en: '06. German A2 Activities & Exam Bank',
              })}
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{{done}} / {{total}} öğe', en: '{{done}} / {{total}} items' },
                { done: completedA2ActivityCount, total: TOTAL_A2_ACTIVITY_ITEMS }
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(
              [
                {
                  routeId: 'karaoke' as NavRouteId,
                  titleLabel: tx({ tr: 'Karaoke Stüdyosu', en: 'Karaoke Studio' }),
                  ids: A2_KARAOKE_IDS,
                  extraLabel: tx({
                    tr: 'Ritmik tekrar (+15 XP)',
                    en: 'Rhythmic drill (+15 XP)',
                  }),
                },
                {
                  routeId: 'sessiz-sinema' as NavRouteId,
                  titleLabel: tx({ tr: 'Sessiz Sinema', en: 'Charades' }),
                  ids: A2_CHARADE_IDS,
                  extraLabel: tx({
                    tr: 'Bireysel + 45 sn sınıf',
                    en: 'Solo + 45s classroom',
                  }),
                },
                {
                  routeId: 'arena' as NavRouteId,
                  titleLabel: 'Arena (A2)',
                  ids: A2_ARENA_IDS,
                  extraLabel: `${locale.common.bestStreak}: ${a2Progress.a2ArenaBestStreak}`,
                },
                {
                  routeId: 'quiz-merkezi' as NavRouteId,
                  titleLabel: tx({ tr: 'Quiz Merkezi', en: 'Quiz Center' }),
                  ids: A2_QUIZ_IDS,
                  extraLabel: tx({
                    tr: '4 A2 konu filtresi',
                    en: '4 A2 topic filters',
                  }),
                },
                {
                  routeId: 'sinav-modu' as NavRouteId,
                  titleLabel: tx({ tr: 'Sınav Modu', en: 'Exam Mode' }),
                  ids: A2_EXAM_IDS,
                  extraLabel:
                    a2Progress.a2ExamBestScorePercent === null
                      ? tx(
                          { tr: '{{count}} deneme', en: '{{count}} attempts' },
                          { count: a2Progress.a2ExamCompletedCount }
                        )
                      : tx(
                          {
                            tr: 'En İyi: {{pct}} ({{count}} deneme)',
                            en: 'Best: {{pct}} ({{count}} attempts)',
                          },
                          {
                            pct: fmtPct(a2Progress.a2ExamBestScorePercent),
                            count: a2Progress.a2ExamCompletedCount,
                          }
                        ),
                },
              ] as const
            ).map((mod) => {
              const done = mod.ids.filter((id) =>
                a2Progress.activityMasteredIds.includes(id)
              ).length;
              const pct = mod.ids.length > 0 ? Math.round((done / mod.ids.length) * 100) : 0;
              return (
                <div
                  key={mod.routeId}
                  className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                        A2
                      </span>
                      <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                        {done} / {mod.ids.length}
                      </span>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {mod.titleLabel}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {mod.extraLabel}
                    </p>
                    <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {fmtPct(pct)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenActivityRoute(mod.routeId)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {tx({ tr: 'Modülü Aç', en: 'Open Module' })}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* A2 Mode Breakdown & Recent Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
            <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({ tr: 'A2 Mod Bazlı Özet', en: 'A2 Mode Breakdown' })}
            </h2>
            <dl className="mt-4 divide-y divide-[#ECECE8] text-sm dark:divide-[#24242C]">
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Kartlarla Öğren', en: 'Learn with Flashcards' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.studiedFlashcards.length} / {totalA2Words}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Artikel & Çoğul Avı', en: 'Article & Plural Hunt' })}
                </dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {articlePluralAcc === null
                    ? '—'
                    : `${fmtPct(articlePluralAcc)} (${a2Progress.articlePluralCorrect}/${a2Progress.articlePluralAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Anlam Eşleştirme', en: 'Meaning Match' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {meaningAcc === null
                    ? '—'
                    : `${fmtPct(meaningAcc)} (${a2Progress.meaningCorrect}/${a2Progress.meaningAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Cümle İçi Kullanım', en: 'In-Context Usage' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {contextAcc === null
                    ? '—'
                    : `${fmtPct(contextAcc)} (${a2Progress.contextCorrect}/${a2Progress.contextAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Dinleme (Hören)', en: 'A2 Listening (Hören)' })}
                </dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ListeningAccuracyPercent === null
                    ? '—'
                    : `${fmtPct(a2ListeningAccuracyPercent)} (${a2Progress.listeningCorrect}/${a2Progress.listeningAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Okuma (Lesen)', en: 'A2 Reading (Lesen)' })}
                </dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ReadingAccuracyPercent === null
                    ? '—'
                    : `${fmtPct(a2ReadingAccuracyPercent)} (${a2Progress.readingCorrect}/${a2Progress.readingAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Yazma (Schreiben)', en: 'A2 Writing (Schreiben)' })}
                </dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2WritingAccuracyPercent === null
                    ? '—'
                    : `${fmtPct(a2WritingAccuracyPercent)} (${a2Progress.writingCorrect}/${a2Progress.writingAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Konuşma (Sprechen)', en: 'A2 Speaking (Sprechen)' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {completedA2SpeakingCount} / {TOTAL_A2_SPEAKING_TASKS} ·{' '}
                  {tx({ tr: 'öz-değerlendirme', en: 'self-check' })}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Etkinlikler & Sınav', en: 'A2 Activities & Exam' })}
                </dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ActivityAccuracyPercent === null
                    ? '—'
                    : `${fmtPct(a2ActivityAccuracyPercent)} (${a2Progress.activityCorrect}/${a2Progress.activityAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 En Yüksek Sınav / Seri', en: 'A2 Best Exam / Streak' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.a2ExamBestScorePercent === null
                    ? '—'
                    : fmtPct(a2Progress.a2ExamBestScorePercent)}{' '}
                  · {locale.common.streak} {a2Progress.a2ArenaBestStreak}
                </dd>
              </div>
            </dl>
          </section>

          <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
            <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({ tr: 'Son A2 Çalışma Kayıtları', en: 'Recent A2 Study Activity' })}
            </h2>

            {a2Progress.recentActivities.length === 0 ? (
              <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Henüz kayıtlı bir A2 beceri, etkinlik veya deneme sınavı hareketi bulunmuyor.',
                  en: 'No A2 skill, activity, or practice exam activity recorded yet.',
                })}
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[#ECECE8] dark:divide-[#24242C]">
                {a2Progress.recentActivities.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between gap-3 py-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {entry.isCorrect === false ? (
                        <XCircle className="mt-0.5 h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate">
                          {entry.summaryTr}
                        </p>
                        <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                          {A2_MODE_LABELS[entry.mode]
                            ? tx(A2_MODE_LABELS[entry.mode])
                            : entry.mode}{' '}
                          · {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B] tabular-nums shrink-0">
                      {entry.xpEarned > 0 ? `+${entry.xpEarned} XP` : '0 XP'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* A2 Local Integrity & Backup Strip */}
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  a2Integrity.isHealthy
                    ? 'text-[#15803D] dark:text-[#4ADE80]'
                    : 'text-[#9A6B16] dark:text-[#D9A13B]'
                }`}
              />
              <div className="space-y-1">
                <h2 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({
                    tr: 'A2 Yerel Veri Bütünlüğü ve JSON Yedekleme',
                    en: 'A2 Local Data Integrity & JSON Backup',
                  })}
                </h2>
                <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {a2Integrity.isHealthy
                    ? tx(
                        {
                          tr: 'A2 kaydı tutarlı ({{words}} benzersiz A2 kelimesi · {{listening}} A2 dinleme · {{reading}} A2 okuma · {{writing}} A2 yazma · {{speaking}} A2 konuşma · {{activities}} A2 etkinlik/sınav · {{bytes}} A2 depolama alanı).',
                          en: 'A2 record is consistent ({{words}} unique A2 words · {{listening}} A2 listening · {{reading}} A2 reading · {{writing}} A2 writing · {{speaking}} A2 speaking · {{activities}} A2 activities/exam · {{bytes}} A2 storage).',
                        },
                        {
                          words: a2Integrity.totalUniqueMasteredWords,
                          listening: a2Integrity.totalUniqueListeningItems,
                          reading: a2Integrity.totalUniqueReadingItems,
                          writing: a2Integrity.totalUniqueWritingTasks,
                          speaking: a2Integrity.totalUniqueSpeakingTasks,
                          activities: a2Integrity.totalUniqueActivityItems,
                          bytes: formatBytesTr(storageDiag.a2ProgressBytes),
                        }
                      )
                    : tx(
                        {
                          tr: a2Integrity.issuesTr.join(' '),
                          en: '{{count}} integrity warning(s) detected in local A2 progress; use Settings to import or reset.',
                        },
                        { count: a2Integrity.issuesTr.length }
                      )}{' '}
                  {tx({
                    tr: 'JSON yedek dosyası hem Almanca A1 hem de Almanca A2 ilerlemenizi birlikte korur.',
                    en: 'The JSON backup file preserves both your German A1 and German A2 progress together.',
                  })}
                </p>
                {backupFilename && (
                  <p className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                    {tx(
                      {
                        tr: 'JSON yedeği (A1 + A2) indirildi: {{filename}}',
                        en: 'JSON backup (A1 + A2) downloaded: {{filename}}',
                      },
                      { filename: backupFilename }
                    )}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleQuickBackupDownload}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs font-medium text-white transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'JSON Yedeği İndir', en: 'Download JSON Backup' })}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('ayarlar')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#282830] whitespace-nowrap"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'İçe Aktar / Sıfırla', en: 'Import / Reset' })}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalWords = ALL_A1_WORDS.length;
  const completedWordCount = uniqueCompletedWordIds.length;
  const wordCompletionPct =
    totalWords > 0 ? Math.round((completedWordCount / totalWords) * 100) : 0;

  const completedListeningCount = progress.listeningMasteredIds.length;
  const listeningCompletionPct =
    TOTAL_LISTENING_EXERCISES > 0
      ? Math.round((completedListeningCount / TOTAL_LISTENING_EXERCISES) * 100)
      : 0;

  const completedReadingCount = progress.readingMasteredIds.length;
  const readingCompletionPct =
    TOTAL_READING_EXERCISES > 0
      ? Math.round((completedReadingCount / TOTAL_READING_EXERCISES) * 100)
      : 0;

  const completedWritingCount = progress.writingMasteredIds.length;
  const writingCompletionPct =
    TOTAL_WRITING_TASKS > 0
      ? Math.round((completedWritingCount / TOTAL_WRITING_TASKS) * 100)
      : 0;

  const completedSpeakingCount = progress.speakingMasteredIds.length;
  const speakingCompletionPct =
    TOTAL_SPEAKING_TASKS > 0
      ? Math.round((completedSpeakingCount / TOTAL_SPEAKING_TASKS) * 100)
      : 0;

  const completedActivityCount = progress.activityMasteredIds.length;
  const activityCompletionPct =
    TOTAL_ACTIVITY_ITEMS > 0
      ? Math.round((completedActivityCount / TOTAL_ACTIVITY_ITEMS) * 100)
      : 0;

  const completedAssignmentsCount = progress.teachingAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'reviewed'
  ).length;
  const totalAssignmentsCount = progress.teachingAssignments.length;
  const assignmentsCompletionPct =
    totalAssignmentsCount > 0
      ? Math.round((completedAssignmentsCount / totalAssignmentsCount) * 100)
      : 0;
  const totalRosterNotesCount = progress.teachingClasses.reduce(
    (sum, cls) => sum + cls.roster.length,
    0
  );

  const hasAnyActivity =
    progress.xp > 0 ||
    progress.articleAttempts > 0 ||
    progress.quizAttempts > 0 ||
    progress.memoryGamesCompleted > 0 ||
    progress.studiedFlashcards.length > 0 ||
    progress.listeningAttempts > 0 ||
    progress.readingAttempts > 0 ||
    progress.writingAttempts > 0 ||
    progress.speakingAttempts > 0 ||
    progress.activityAttempts > 0 ||
    progress.activityMasteredIds.length > 0 ||
    completedAssignmentsCount > 0 ||
    progress.teachingClasses.length > 0 ||
    progress.studioDrafts.length > 0;

  const articleAcc =
    progress.articleAttempts > 0
      ? Math.round((progress.articleCorrect / progress.articleAttempts) * 100)
      : null;

  const quizAcc =
    progress.quizAttempts > 0
      ? Math.round((progress.quizCorrect / progress.quizAttempts) * 100)
      : null;

  const totalGradedAttempts =
    progress.articleAttempts +
    progress.quizAttempts +
    progress.listeningAttempts +
    progress.readingAttempts +
    progress.writingAttempts +
    progress.activityAttempts;

  const masteredActivitySet = new Set(progress.activityMasteredIds);
  const activityBreakdownCards: Array<{
    routeId: NavRouteId;
    titleLabel: string;
    subtitleLabel: string;
    ids: string[];
    actionLabel: string;
  }> = [
    {
      routeId: 'karaoke',
      titleLabel: tx({ tr: 'Karaoke Stüdyosu', en: 'Karaoke Studio' }),
      subtitleLabel: tx({
        tr: 'Ritmik A1 Satır Takibi',
        en: 'Rhythmic A1 Line Follow',
      }),
      ids: KARAOKE_IDS,
      actionLabel: tx({ tr: 'Karaokeyi Aç', en: 'Open Karaoke' }),
    },
    {
      routeId: 'sessiz-sinema',
      titleLabel: tx({ tr: 'Sessiz Sinema', en: 'Charades' }),
      subtitleLabel: tx({
        tr: 'Scharade · İpucu Kartları',
        en: 'Scharade · Cue Cards',
      }),
      ids: CHARADE_IDS,
      actionLabel: tx({ tr: 'Kartları Aç', en: 'Open Cards' }),
    },
    {
      routeId: 'arena',
      titleLabel: 'Arena',
      subtitleLabel: tx(
        { tr: 'En iyi seri: {{streak}}', en: 'Best streak: {{streak}}' },
        { streak: progress.arenaBestStreak }
      ),
      ids: ARENA_IDS,
      actionLabel: tx({ tr: 'Arenaya Gir', en: 'Enter Arena' }),
    },
    {
      routeId: 'quiz-merkezi',
      titleLabel: tx({ tr: 'Quiz Merkezi', en: 'Quiz Center' }),
      subtitleLabel: tx({ tr: 'Karma A1 Tarama', en: 'Mixed A1 Review' }),
      ids: QUIZ_IDS,
      actionLabel: tx({ tr: 'Quiz Çöz', en: 'Take Quiz' }),
    },
    {
      routeId: 'sinav-modu',
      titleLabel: tx({ tr: 'Sınav Modu', en: 'Exam Mode' }),
      subtitleLabel:
        progress.examBestScorePercent === null
          ? tx({ tr: '15 Soruluk Deneme', en: '15-Question Practice' })
          : tx(
              { tr: 'En iyi skor: {{pct}}', en: 'Best score: {{pct}}' },
              { pct: fmtPct(progress.examBestScorePercent) }
            ),
      ids: EXAM_IDS,
      actionLabel: tx({ tr: 'Sınavı Aç', en: 'Open Exam' }),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-[#D9D9D3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#282830]">
        <div>
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            {locale.navGroups.personal} · {locale.course.a1Label} ·{' '}
            {tx({ tr: 'Yerel Oturum Verisi', en: 'Local Session Data' })}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Öğrenme Yolum ve İlerlemem',
              en: 'My Learning Path & Progress',
            })}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenTopic(GERMAN_A1_TOPICS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-3.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
          >
            <span>{tx({ tr: 'A1 Kelime', en: 'A1 Vocabulary' })}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpenListeningScenario(GERMAN_A1_LISTENING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <Headphones className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>{tx({ tr: 'Dinleme', en: 'Listening' })}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenReadingScenario(GERMAN_A1_READING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <BookText className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>{tx({ tr: 'Okuma', en: 'Reading' })}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenWritingScenario(GERMAN_A1_WRITING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <PenTool className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>{tx({ tr: 'Yazma', en: 'Writing' })}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenSpeakingScenario(GERMAN_A1_SPEAKING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <MessageSquare className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>{tx({ tr: 'Konuşma', en: 'Speaking' })}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenActivityRoute('sinav-modu')}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <ClipboardCheck className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>{tx({ tr: 'Etkinlik & Sınav', en: 'Activities & Exam' })}</span>
          </button>
        </div>
      </div>

      {/* Real KPI Summary Strip (starts strictly at 0) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {locale.common.totalXp}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
            {progress.xp} XP
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Tüm Aktif Modüller', en: 'All Active Modules' })}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'A1 Kelime', en: 'A1 Vocabulary' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedWordCount} / {totalWords}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
              { pct: fmtPct(wordCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Dinleme (Hören)', en: 'Listening (Hören)' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedListeningCount} / {TOTAL_LISTENING_EXERCISES}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
              { pct: fmtPct(listeningCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Okuma (Lesen)', en: 'Reading (Lesen)' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedReadingCount} / {TOTAL_READING_EXERCISES}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
              { pct: fmtPct(readingCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Yazma (Schreiben)', en: 'Writing (Schreiben)' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedWritingCount} / {TOTAL_WRITING_TASKS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
              { pct: fmtPct(writingCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Konuşma (Sprechen)', en: 'Speaking (Sprechen)' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedSpeakingCount} / {TOTAL_SPEAKING_TASKS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Öz-Değerlendirme: {{pct}}', en: 'Self-Check: {{pct}}' },
              { pct: fmtPct(speakingCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Etkinlikler & Sınav', en: 'Activities & Exam' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedActivityCount} / {TOTAL_ACTIVITY_ITEMS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Tamamlanma: {{pct}}', en: 'Completion: {{pct}}' },
              { pct: fmtPct(activityCompletionPct) }
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Genel Doğruluk', en: 'Overall Accuracy' })}
          </p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {overallAccuracyPercent === null ? '—' : fmtPct(overallAccuracyPercent)}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{count}} puanlı yanıt', en: '{{count}} graded responses' },
              { count: totalGradedAttempts }
            )}
          </p>
        </div>
      </div>

      {/* Honest Empty State Prompt when no actions yet */}
      {!hasAnyActivity && (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-7 text-center dark:border-[#282830] dark:bg-[#16161A]">
          <BookOpen className="mx-auto h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <h2 className="mt-3 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Henüz tamamlanmış bir çalışma kaydınız yok',
              en: 'No completed study activity yet',
            })}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Almanca A1 Kelime, Dinleme (Hören), Okuma (Lesen), Yazma (Schreiben) veya Konuşma (Sprechen) modüllerinde pratik yaptığınızda gerçek XP ve ilerlemeniz burada anlık olarak güncellenir.',
              en: 'Once you practice in German A1 Vocabulary, Listening (Hören), Reading (Lesen), Writing (Schreiben), or Speaking (Sprechen), your real XP and progress update live here.',
            })}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenTopic(GERMAN_A1_TOPICS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <span>
                {tx({
                  tr: 'Kelime Çalışmasını Başlat',
                  en: 'Start Vocabulary Practice',
                })}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenListeningScenario(GERMAN_A1_LISTENING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'Dinleme', en: 'Listening' })}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenReadingScenario(GERMAN_A1_READING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'Okuma', en: 'Reading' })}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenWritingScenario(GERMAN_A1_WRITING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'Yazma', en: 'Writing' })}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenSpeakingScenario(GERMAN_A1_SPEAKING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'Konuşma', en: 'Speaking' })}</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 1: Vocabulary Topic-by-Topic Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '01. Almanca A1 Kelime — Ünite İlerlemesi',
              en: '01. German A1 Vocabulary — Unit Progress',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} kelime', en: '{{done}} / {{total}} words' },
              { done: completedWordCount, total: totalWords }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GERMAN_A1_TOPICS.map((topic) => {
            const doneInTopic = topic.words.filter((w) =>
              uniqueCompletedWordIds.includes(w.id)
            ).length;
            const pct = Math.round((doneInTopic / topic.words.length) * 100);
            return (
              <div
                key={topic.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span>{topic.titleDe}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                      {doneInTopic} / {topic.words.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {topic.titleTr}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(topic.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInTopic > 0
                      ? tx({ tr: 'Çalışmaya Devam Et', en: 'Continue Studying' })
                      : tx({ tr: 'Üniteyi Başlat', en: 'Start Unit' })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 2: Listening (Hören) Scenario-by-Scenario Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '02. Almanca A1 Dinleme (Hören) — Senaryo İlerlemesi',
              en: '02. German A1 Listening (Hören) — Scenario Progress',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} soru', en: '{{done}} / {{total}} questions' },
              { done: completedListeningCount, total: TOTAL_LISTENING_EXERCISES }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_LISTENING_SCENARIOS.map((scenario) => {
            const ids = getScenarioExerciseIds(scenario);
            const doneInScenario = ids.filter((id) =>
              progress.listeningMasteredIds.includes(id)
            ).length;
            const pct = Math.round((doneInScenario / ids.length) * 100);

            return (
              <div
                key={scenario.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="truncate">{scenario.titleDe}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {doneInScenario} / {ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {scenario.titleTr}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenListeningScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0
                      ? locale.home.continueLabel
                      : tx({ tr: 'Dinlemeye Başla', en: 'Start Listening' })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 3: Reading (Lesen) Scenario-by-Scenario Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '03. Almanca A1 Okuma (Lesen) — Metin İlerlemesi',
              en: '03. German A1 Reading (Lesen) — Text Progress',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} soru', en: '{{done}} / {{total}} questions' },
              { done: completedReadingCount, total: TOTAL_READING_EXERCISES }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_READING_SCENARIOS.map((scenario) => {
            const ids = getReadingScenarioExerciseIds(scenario);
            const doneInScenario = ids.filter((id) =>
              progress.readingMasteredIds.includes(id)
            ).length;
            const pct = Math.round((doneInScenario / ids.length) * 100);

            return (
              <div
                key={scenario.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="truncate">{scenario.document.formatLabelTr}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {doneInScenario} / {ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {scenario.titleTr}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenReadingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0
                      ? locale.home.continueLabel
                      : tx({ tr: 'Okumaya Başla', en: 'Start Reading' })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 4: Writing (Schreiben) Scenario-by-Scenario Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '04. Almanca A1 Yazma (Schreiben) — Bağlam İlerlemesi',
              en: '04. German A1 Writing (Schreiben) — Context Progress',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} görev', en: '{{done}} / {{total}} tasks' },
              { done: completedWritingCount, total: TOTAL_WRITING_TASKS }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_WRITING_SCENARIOS.map((scenario) => {
            const ids = getWritingScenarioExerciseIds(scenario);
            const doneInScenario = ids.filter((id) =>
              progress.writingMasteredIds.includes(id)
            ).length;
            const pct = Math.round((doneInScenario / ids.length) * 100);

            return (
              <div
                key={scenario.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="truncate">{scenario.titleDe}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {doneInScenario} / {ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {scenario.titleTr}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenWritingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0
                      ? locale.home.continueLabel
                      : tx({ tr: 'Yazmaya Başla', en: 'Start Writing' })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 5: Speaking (Sprechen) Scenario-by-Scenario Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '05. Almanca A1 Konuşma (Sprechen) — Senaryo İlerlemesi',
              en: '05. German A1 Speaking (Sprechen) — Scenario Progress',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} pratik', en: '{{done}} / {{total}} practices' },
              { done: completedSpeakingCount, total: TOTAL_SPEAKING_TASKS }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_SPEAKING_SCENARIOS.map((scenario) => {
            const ids = getSpeakingScenarioExerciseIds(scenario);
            const doneInScenario = ids.filter((id) =>
              progress.speakingMasteredIds.includes(id)
            ).length;
            const pct = Math.round((doneInScenario / ids.length) * 100);

            return (
              <div
                key={scenario.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="truncate">{scenario.titleDe}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {doneInScenario} / {ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {scenario.titleTr}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenSpeakingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0
                      ? locale.home.continueLabel
                      : tx({ tr: 'Konuşmaya Başla', en: 'Start Speaking' })}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 6: Activities & Exam Bank Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '06. Almanca A1 Etkinlikler ve Sınav Bankası',
              en: '06. German A1 Activities & Exam Bank',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: '{{done}} / {{total}} kazanım', en: '{{done}} / {{total}} items' },
              { done: completedActivityCount, total: TOTAL_ACTIVITY_ITEMS }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {activityBreakdownCards.map((card) => {
            const done = card.ids.filter((id) => masteredActivitySet.has(id)).length;
            const pct = Math.round((done / card.ids.length) * 100);
            return (
              <div
                key={card.routeId}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 sm:p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="truncate">{card.subtitleLabel}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {done} / {card.ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {card.titleLabel}
                  </h3>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                    <div
                      className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {fmtPct(pct)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenActivityRoute(card.routeId)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {card.actionLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 7: Teaching, Classes & Assignments (Local) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '07. Öğretim, Sınıflarım ve Ödev Takibi (Yerel)',
              en: '07. Teaching, My Classes & Assignment Tracking (Local)',
            })}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              {
                tr: '{{done}} / {{total}} ödev tamamlandı',
                en: '{{done}} / {{total}} assignments completed',
              },
              { done: completedAssignmentsCount, total: totalAssignmentsCount }
            )}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>{tx({ tr: 'Yerel A1 Grupları', en: 'Local A1 Groups' })}</span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {tx(
                    { tr: '{{count}} sınıf', en: '{{count}} classes' },
                    { count: progress.teachingClasses.length }
                  )}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({ tr: 'Sınıflarım', en: 'My Classes' })}
              </h3>
              <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {totalRosterNotesCount > 0
                  ? tx(
                      {
                        tr: '{{count}} manuel katılımcı notu kayıtlı (yalnızca bu tarayıcıda).',
                        en: '{{count}} manual roster notes saved (in this browser only).',
                      },
                      { count: totalRosterNotesCount }
                    )
                  : tx({
                      tr: 'Yerel A1 sınıf gruplarınızı ve manuel yoklama notlarınızı yönetin.',
                      en: 'Manage your local A1 class groups and manual attendance notes.',
                    })}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Yerel Depolama', en: 'Local Storage' })}
              </span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('siniflarim')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                {tx({ tr: 'Sınıfları Aç', en: 'Open Classes' })}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>
                  {tx({
                    tr: 'Modüllere Bağlı A1 Görevler',
                    en: 'Module-Linked A1 Tasks',
                  })}
                </span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {completedAssignmentsCount} / {totalAssignmentsCount}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({ tr: 'Ödevler', en: 'Assignments' })}
              </h3>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                <div
                  className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                  style={{ width: `${assignmentsCompletionPct}%` }}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                {fmtPct(assignmentsCompletionPct)}
              </span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('odevler')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                {tx({ tr: 'Ödevleri Aç', en: 'Open Assignments' })}
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>
                  {tx({
                    tr: 'Ders & Quiz Taslakları',
                    en: 'Lesson & Quiz Drafts',
                  })}
                </span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {tx(
                    { tr: '{{count}} taslak', en: '{{count}} drafts' },
                    { count: progress.studioDrafts.length }
                  )}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({ tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' })}
              </h3>
              <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Tahta önizlemesi, kopyalanabilir/yazdırılabilir A1 kontrol listeleri ve de-DE ses testi.',
                  en: 'Board preview, copyable/printable A1 checklists, and de-DE speech test.',
                })}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Yerel Stüdyo', en: 'Local Studio' })}
              </span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('ogretmen-studyosu')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                {tx({ tr: 'Stüdyoyu Aç', en: 'Open Studio' })}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mode Breakdown */}
        <section className="lg:col-span-5 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
          <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({ tr: 'Beceri ve Mod Bazlı Özet', en: 'Skill & Mode Breakdown' })}
          </h2>
          <dl className="mt-4 divide-y divide-[#ECECE8] text-sm dark:divide-[#24242C]">
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Kelime Kartları (Öğrenilen)', en: 'Flashcards (Studied)' })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.studiedFlashcards.length} / {totalWords}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Artikel Seçme Doğruluğu', en: 'Article Selection Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {articleAcc === null
                  ? '—'
                  : `${fmtPct(articleAcc)} (${progress.articleCorrect}/${progress.articleAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Anlam Testi Doğruluğu', en: 'Meaning Quiz Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {quizAcc === null
                  ? '—'
                  : `${fmtPct(quizAcc)} (${progress.quizCorrect}/${progress.quizAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Hafıza Eşleştirme', en: 'Memory Match' })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {tx(
                  { tr: '{{count}} tur', en: '{{count}} rounds' },
                  { count: progress.memoryGamesCompleted }
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Dinleme (Hören) Doğruluğu', en: 'Listening (Hören) Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {listeningAccuracyPercent === null
                  ? '—'
                  : `${fmtPct(listeningAccuracyPercent)} (${progress.listeningCorrect}/${progress.listeningAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Okuma (Lesen) Doğruluğu', en: 'Reading (Lesen) Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {readingAccuracyPercent === null
                  ? '—'
                  : `${fmtPct(readingAccuracyPercent)} (${progress.readingCorrect}/${progress.readingAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Yazma (Schreiben) Doğruluğu', en: 'Writing (Schreiben) Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {writingAccuracyPercent === null
                  ? '—'
                  : `${fmtPct(writingAccuracyPercent)} (${progress.writingCorrect}/${progress.writingAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Konuşma (Sprechen) Öz-Değerlendirme',
                  en: 'Speaking (Sprechen) Self-Check',
                })}
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {completedSpeakingCount} / {TOTAL_SPEAKING_TASKS} ({fmtPct(speakingCompletionPct)})
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Etkinlikler Doğruluğu', en: 'Activities Accuracy' })}
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {activityAccuracyPercent === null
                  ? '—'
                  : `${fmtPct(activityAccuracyPercent)} (${progress.activityCorrect}/${progress.activityAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'A1 Sınav Bankası En İyi Skor',
                  en: 'A1 Exam Bank Best Score',
                })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.examBestScorePercent === null
                  ? '—'
                  : tx(
                      {
                        tr: '{{pct}} ({{count}} deneme)',
                        en: '{{pct}} ({{count}} attempts)',
                      },
                      {
                        pct: fmtPct(progress.examBestScorePercent),
                        count: progress.examCompletedCount,
                      }
                    )}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Tamamlanan A1 Ödevleri (Yerel)',
                  en: 'Completed A1 Assignments (Local)',
                })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {completedAssignmentsCount} / {totalAssignmentsCount}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Yerel Sınıf / Stüdyo Taslağı',
                  en: 'Local Classes / Studio Drafts',
                })}
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {tx(
                  {
                    tr: '{{classes}} sınıf · {{drafts}} taslak',
                    en: '{{classes}} classes · {{drafts}} drafts',
                  },
                  {
                    classes: progress.teachingClasses.length,
                    drafts: progress.studioDrafts.length,
                  }
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Recent Real Activity Log */}
        <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
          <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Son Gerçek Çalışma Kayıtları',
              en: 'Recent Real Study Activity',
            })}
          </h2>

          {progress.recentActivities.length === 0 ? (
            <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Henüz kayıtlı bir alıştırma hareketi bulunmuyor.',
                en: 'No practice activity recorded yet.',
              })}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#ECECE8] dark:divide-[#24242C]">
              {progress.recentActivities.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 py-3 text-xs sm:text-sm"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {entry.isCorrect === false ? (
                      <XCircle className="mt-0.5 h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate">
                        {entry.summaryTr}
                      </p>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        {MODE_LABELS[entry.mode] ? tx(MODE_LABELS[entry.mode]) : entry.mode} ·{' '}
                        {formatDateTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B] tabular-nums shrink-0">
                    {entry.xpEarned > 0 ? `+${entry.xpEarned} XP` : '0 XP'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Stage 8: Local Data Integrity & Portability Strip */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                integrity.isHealthy
                  ? 'text-[#15803D] dark:text-[#4ADE80]'
                  : 'text-[#9A6B16] dark:text-[#D9A13B]'
              }`}
            />
            <div className="space-y-1">
              <h2 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'Yerel Veri Bütünlüğü ve JSON Yedekleme',
                  en: 'Local Data Integrity & JSON Backup',
                })}
              </h2>
              <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                {integrity.isHealthy
                  ? tx(
                      {
                        tr: 'Kayıt yapısı tutarlı ({{items}} benzersiz tamamlanan kazanım · {{bytes}} yerel tarayıcı alanı).',
                        en: 'Record structure is consistent ({{items}} unique completed items · {{bytes}} local browser storage).',
                      },
                      {
                        items: integrity.totalUniqueMasteredItems,
                        bytes: formatBytesTr(storageDiag.totalBytes),
                      }
                    )
                  : tx(
                      {
                        tr: 'Kayıt kontrolünde {{count}} uyarı algılandı; içe aktarma veya sıfırlama için Ayarlar ekranını kullanabilirsiniz.',
                        en: '{{count}} warning(s) detected during integrity check; you can use the Settings screen to import or reset.',
                      },
                      { count: integrity.issuesTr.length }
                    )}{' '}
                {tx({
                  tr: 'Verileriniz yalnızca bu tarayıcıda tutulur; bulut senkronizasyonu bağlı değildir.',
                  en: 'Your data is stored only in this browser; no cloud sync is connected.',
                })}
              </p>
              {backupFilename && (
                <p className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                  {tx(
                    {
                      tr: 'JSON yedeği (A1 + A2) indirildi: {{filename}}',
                      en: 'JSON backup (A1 + A2) downloaded: {{filename}}',
                    },
                    { filename: backupFilename }
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleQuickBackupDownload}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs font-medium text-white transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'JSON Yedeği İndir', en: 'Download JSON Backup' })}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenActivityRoute('ayarlar')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#282830] whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'İçe Aktar / Sıfırla', en: 'Import / Reset' })}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
