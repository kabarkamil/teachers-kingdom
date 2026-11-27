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
import type { A2ActivityMode, ActivityMode, NavRouteId } from '../types';

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

const A2_MODE_LABELS: Record<A2ActivityMode, string> = {
  'a2-flashcards': 'A2 · Kartlarla Öğren',
  'a2-articles-plural': 'A2 · Artikel & Çoğul Avı',
  'a2-meaning': 'A2 · Anlam Eşleştirme',
  'a2-context': 'A2 · Cümle İçi Kullanım',
  'a2-horen-tf': 'A2 Dinleme · Richtig / Falsch',
  'a2-horen-cloze': 'A2 Dinleme · Lückentext',
  'a2-horen-mc': 'A2 Dinleme · Anlama Testi',
  'a2-lesen-tf': 'A2 Okuma · Richtig / Falsch / Yok',
  'a2-lesen-cloze': 'A2 Okuma · Lückentext',
  'a2-lesen-mc': 'A2 Okuma · Anlama & Çıkarım',
  'a2-schreiben-message': 'A2 Yazma · Kılavuzlu E-Posta / Mesaj',
  'a2-schreiben-controlled': 'A2 Yazma · Satzbau & Lückentext',
  'a2-sprechen-repeat': 'A2 Konuşma · Telaffuz & Kalıp Tekrarı',
  'a2-sprechen-prompt': 'A2 Konuşma · Kılavuzlu Yanıt & Deneyim',
  'a2-sprechen-roleplay': 'A2 Konuşma · Çok Turlu Rol Oyunu',
  'a2-activity-karaoke': 'A2 Etkinlik · Karaoke Stüdyosu',
  'a2-activity-charades': 'A2 Etkinlik · Sessiz Sinema',
  'a2-activity-arena': 'A2 Etkinlik · Arena',
  'a2-activity-quiz': 'A2 Etkinlik · Quiz Merkezi',
  'a2-activity-exam': 'A2 Etkinlik · A2 Sınav Modu',
};

const MODE_LABELS: Record<ActivityMode, string> = {
  flashcards: 'Kelime Kartları',
  articles: 'Artikel Seçme',
  quiz: 'Doğru Anlamı Bulma',
  memory: 'Hafıza Eşleştirme',
  'horen-tf': 'Dinleme · Richtig / Falsch',
  'horen-cloze': 'Dinleme · Lückentext',
  'horen-mc': 'Dinleme · Anlama Testi',
  'lesen-tf': 'Okuma · Richtig / Falsch',
  'lesen-cloze': 'Okuma · Lückentext',
  'lesen-mc': 'Okuma · Anlama Testi',
  'schreiben-form': 'Yazma · Formular ausfüllen',
  'schreiben-message': 'Yazma · Kısa Mesaj / Not',
  'schreiben-controlled': 'Yazma · Satzbau & Lückentext',
  'sprechen-repeat': 'Konuşma · Nachsprechen',
  'sprechen-prompt': 'Konuşma · Leitfragen',
  'sprechen-roleplay': 'Konuşma · Dialog / Rollenspiel',
  'activity-karaoke': 'Etkinlik · Karaoke Stüdyosu',
  'activity-charades': 'Etkinlik · Sessiz Sinema',
  'activity-arena': 'Etkinlik · Arena',
  'activity-quiz': 'Etkinlik · Quiz Merkezi',
  'activity-exam': 'Etkinlik · A1 Sınav Modu',
  'teaching-class': 'Sınıflarım · Yerel Grup',
  'teaching-assignment': 'Ödevler · A1 Görev',
  'teaching-studio': 'Öğretmen Stüdyosu · Taslak',
};

function formatTimeTr(iso: string): string {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

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

  const [backupNotice, setBackupNotice] = useState<string | null>(null);
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
    setBackupNotice(`JSON yedeği (A1 + A2) indirildi: ${filename}`);
    window.setTimeout(() => setBackupNotice(null), 4000);
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
              Kişisel Alan · Almanca CEFR A2 · İzole Yerel Kayıt (
              <span className="font-mono">{STORAGE_KEY_A2_STATE}</span>)
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Almanca A2 — Öğrenme Yolum ve İlerlemem
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openA2Unit(GERMAN_A2_TOPICS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <span>A2 Kelime</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => openA2Scenario(GERMAN_A2_LISTENING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <Headphones className="h-4 w-4" />
              <span>A2 Dinleme</span>
            </button>
            <button
              type="button"
              onClick={() => openA2ReadingScenario(GERMAN_A2_READING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <BookText className="h-4 w-4" />
              <span>A2 Okuma</span>
            </button>
            <button
              type="button"
              onClick={() => openA2WritingScenario(GERMAN_A2_WRITING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <PenTool className="h-4 w-4" />
              <span>A2 Yazma</span>
            </button>
            <button
              type="button"
              onClick={() => openA2SpeakingScenario(GERMAN_A2_SPEAKING_SCENARIOS[0].id)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <MessageSquare className="h-4 w-4" />
              <span>A2 Konuşma</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenActivityRoute('sinav-modu')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3.5 text-xs sm:text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B] dark:hover:bg-[#27272F] whitespace-nowrap"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>A2 Sınav Modu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCourse('de-A1')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <span>A1 İlerlemesi ({progress.xp} XP)</span>
            </button>
          </div>
        </div>

        {/* A2 Real KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam A2 XP</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp} XP
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              Aşama 1–6 · Tekil XP
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Kelime</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2Count} / {totalA2Words}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2WordPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Dinleme</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ListeningCount} / {TOTAL_A2_LISTENING_EXERCISES}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2ListeningPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Okuma</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ReadingCount} / {TOTAL_A2_READING_EXERCISES}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2ReadingPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Yazma</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2WritingCount} / {TOTAL_A2_WRITING_TASKS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2WritingPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Konuşma</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2SpeakingCount} / {TOTAL_A2_SPEAKING_TASKS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2SpeakingPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Etkinlik &amp; Sınav</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedA2ActivityCount} / {TOTAL_A2_ACTIVITY_ITEMS}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Tamamlanma: %{a2ActivityPct}
            </p>
          </div>

          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Doğruluk</p>
            <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {a2OverallAccuracyPercent === null ? '—' : `%${a2OverallAccuracyPercent}`}
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {totalA2GradedAttempts} puanlı yanıt
            </p>
          </div>
        </div>

        {/* Honest Empty State */}
        {!hasAnyA2Activity && (
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-7 text-center dark:border-[#282830] dark:bg-[#16161A]">
            <BookOpen className="mx-auto h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <h2 className="mt-3 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Henüz Almanca A2 çalışma kaydınız yok
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
              A2 Kelime, Dinleme, Okuma, Yazma, Konuşma veya A2 Etkinlikler / Sınav Modu çalışmalarını başlattığınızda gerçek A2 XP, doğruluk ve ilerlemeniz burada anlık güncellenir.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openA2Unit(GERMAN_A2_TOPICS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <span>A2 Kelime Çalışmasını Başlat</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openA2Scenario(GERMAN_A2_LISTENING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <Headphones className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>A2 Dinleme (Hören) Başlat</span>
              </button>
              <button
                type="button"
                onClick={() => openA2ReadingScenario(GERMAN_A2_READING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <BookText className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>A2 Okuma (Lesen) Başlat</span>
              </button>
              <button
                type="button"
                onClick={() => openA2WritingScenario(GERMAN_A2_WRITING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <PenTool className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>A2 Yazma (Schreiben) Başlat</span>
              </button>
              <button
                type="button"
                onClick={() => openA2SpeakingScenario(GERMAN_A2_SPEAKING_SCENARIOS[0].id)}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <MessageSquare className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>A2 Konuşma (Sprechen) Başlat</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('sinav-modu')}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>A2 Sınav Modunu Aç</span>
              </button>
            </div>
          </div>
        )}

        {/* A2 Topic-by-Topic Progress */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              01. Almanca A2 Kelime (Wortschatz) — Ünite İlerlemesi
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2Count} / {totalA2Words} kelime
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2Unit(topic.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInTopic > 0 ? 'Çalışmaya Devam Et' : 'Üniteyi Başlat'}
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
              02. Almanca A2 Dinleme (Hören) — Senaryo İlerlemesi
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2ListeningCount} / {TOTAL_A2_LISTENING_EXERCISES} alıştırma
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2Scenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0 ? 'Dinlemeye Devam Et' : 'Senaryoyu Başlat'}
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
              03. Almanca A2 Okuma (Lesen) — Metin İlerlemesi
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2ReadingCount} / {TOTAL_A2_READING_EXERCISES} alıştırma
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2ReadingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0 ? 'Okumaya Devam Et' : 'Metni Başlat'}
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
              04. Almanca A2 Yazma (Schreiben) — Senaryo İlerlemesi
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2WritingCount} / {TOTAL_A2_WRITING_TASKS} görev
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2WritingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0 ? 'Yazmaya Devam Et' : 'Görevi Başlat'}
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
              05. Almanca A2 Konuşma (Sprechen) — Senaryo İlerlemesi
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2SpeakingCount} / {TOTAL_A2_SPEAKING_TASKS} pratik
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => openA2SpeakingScenario(scenario.id)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      {doneInScenario > 0 ? 'Konuşmaya Devam Et' : 'Senaryoyu Başlat'}
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
              06. Almanca A2 Etkinlikler ve Sınav Bankası
            </h2>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {completedA2ActivityCount} / {TOTAL_A2_ACTIVITY_ITEMS} öğe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(
              [
                {
                  routeId: 'karaoke' as NavRouteId,
                  titleTr: 'Karaoke Stüdyosu',
                  ids: A2_KARAOKE_IDS,
                  extraTr: 'Ritmik tekrar (+15 XP)',
                },
                {
                  routeId: 'sessiz-sinema' as NavRouteId,
                  titleTr: 'Sessiz Sinema',
                  ids: A2_CHARADE_IDS,
                  extraTr: 'Bireysel + 45 sn sınıf',
                },
                {
                  routeId: 'arena' as NavRouteId,
                  titleTr: 'Arena (A2)',
                  ids: A2_ARENA_IDS,
                  extraTr: `En İyi Seri: ${a2Progress.a2ArenaBestStreak}`,
                },
                {
                  routeId: 'quiz-merkezi' as NavRouteId,
                  titleTr: 'Quiz Merkezi',
                  ids: A2_QUIZ_IDS,
                  extraTr: '4 A2 konu filtresi',
                },
                {
                  routeId: 'sinav-modu' as NavRouteId,
                  titleTr: 'Sınav Modu',
                  ids: A2_EXAM_IDS,
                  extraTr:
                    a2Progress.a2ExamBestScorePercent === null
                      ? `${a2Progress.a2ExamCompletedCount} deneme`
                      : `En İyi: %${a2Progress.a2ExamBestScorePercent} (${a2Progress.a2ExamCompletedCount} deneme)`,
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
                      {mod.titleTr}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {mod.extraTr}
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
                      %{pct}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenActivityRoute(mod.routeId)}
                      className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                    >
                      Modülü Aç
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
              A2 Mod Bazlı Özet
            </h2>
            <dl className="mt-4 divide-y divide-[#ECECE8] text-sm dark:divide-[#24242C]">
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Kartlarla Öğren</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.studiedFlashcards.length} / {totalA2Words}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Artikel &amp; Çoğul Avı</dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {articlePluralAcc === null
                    ? '—'
                    : `%${articlePluralAcc} (${a2Progress.articlePluralCorrect}/${a2Progress.articlePluralAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Anlam Eşleştirme</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {meaningAcc === null
                    ? '—'
                    : `%${meaningAcc} (${a2Progress.meaningCorrect}/${a2Progress.meaningAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Cümle İçi Kullanım</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {contextAcc === null
                    ? '—'
                    : `%${contextAcc} (${a2Progress.contextCorrect}/${a2Progress.contextAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 Dinleme (Hören)</dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ListeningAccuracyPercent === null
                    ? '—'
                    : `%${a2ListeningAccuracyPercent} (${a2Progress.listeningCorrect}/${a2Progress.listeningAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 Okuma (Lesen)</dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ReadingAccuracyPercent === null
                    ? '—'
                    : `%${a2ReadingAccuracyPercent} (${a2Progress.readingCorrect}/${a2Progress.readingAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 Yazma (Schreiben)</dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2WritingAccuracyPercent === null
                    ? '—'
                    : `%${a2WritingAccuracyPercent} (${a2Progress.writingCorrect}/${a2Progress.writingAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 Konuşma (Sprechen)</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {completedA2SpeakingCount} / {TOTAL_A2_SPEAKING_TASKS} · öz-değerlendirme
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 Etkinlikler &amp; Sınav</dt>
                <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2ActivityAccuracyPercent === null
                    ? '—'
                    : `%${a2ActivityAccuracyPercent} (${a2Progress.activityCorrect}/${a2Progress.activityAttempts})`}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">A2 En Yüksek Sınav / Seri</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.a2ExamBestScorePercent === null
                    ? '—'
                    : `%${a2Progress.a2ExamBestScorePercent}`}{' '}
                  · Seri {a2Progress.a2ArenaBestStreak}
                </dd>
              </div>
            </dl>
          </section>

          <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
            <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Son A2 Çalışma Kayıtları
            </h2>

            {a2Progress.recentActivities.length === 0 ? (
              <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                Henüz kayıtlı bir A2 beceri, etkinlik veya deneme sınavı hareketi bulunmuyor.
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
                          {A2_MODE_LABELS[entry.mode] ?? entry.mode} ·{' '}
                          {formatTimeTr(entry.timestamp)}
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
                  A2 Yerel Veri Bütünlüğü ve JSON Yedekleme
                </h2>
                <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {a2Integrity.isHealthy
                    ? `A2 kaydı tutarlı (${a2Integrity.totalUniqueMasteredWords} benzersiz A2 kelimesi · ${a2Integrity.totalUniqueListeningItems} A2 dinleme · ${a2Integrity.totalUniqueReadingItems} A2 okuma · ${a2Integrity.totalUniqueWritingTasks} A2 yazma · ${a2Integrity.totalUniqueSpeakingTasks} A2 konuşma · ${a2Integrity.totalUniqueActivityItems} A2 etkinlik/sınav · ${formatBytesTr(storageDiag.a2ProgressBytes)} A2 depolama alanı).`
                    : a2Integrity.issuesTr.join(' ')}{' '}
                  JSON yedek dosyası hem Almanca A1 hem de Almanca A2 ilerlemenizi birlikte korur.
                </p>
                {backupNotice && (
                  <p className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                    {backupNotice}
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
                <span>JSON Yedeği İndir</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('ayarlar')}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#282830] whitespace-nowrap"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>İçe Aktar / Sıfırla</span>
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
    titleTr: string;
    subtitleDe: string;
    ids: string[];
    actionLabel: string;
  }> = [
    {
      routeId: 'karaoke',
      titleTr: 'Karaoke Stüdyosu',
      subtitleDe: 'Ritmik A1 Satır Takibi',
      ids: KARAOKE_IDS,
      actionLabel: 'Karaokeyi Aç',
    },
    {
      routeId: 'sessiz-sinema',
      titleTr: 'Sessiz Sinema',
      subtitleDe: 'Scharade · İpucu Kartları',
      ids: CHARADE_IDS,
      actionLabel: 'Kartları Aç',
    },
    {
      routeId: 'arena',
      titleTr: 'Arena',
      subtitleDe: `En iyi seri: ${progress.arenaBestStreak}`,
      ids: ARENA_IDS,
      actionLabel: 'Arenaya Gir',
    },
    {
      routeId: 'quiz-merkezi',
      titleTr: 'Quiz Merkezi',
      subtitleDe: 'Karma A1 Tarama',
      ids: QUIZ_IDS,
      actionLabel: 'Quiz Çöz',
    },
    {
      routeId: 'sinav-modu',
      titleTr: 'Sınav Modu',
      subtitleDe:
        progress.examBestScorePercent === null
          ? '15 Soruluk Deneme'
          : `En iyi skor: %${progress.examBestScorePercent}`,
      ids: EXAM_IDS,
      actionLabel: 'Sınavı Aç',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-[#D9D9D3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#282830]">
        <div>
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            Kişisel Alan · Almanca A1 · Yerel Oturum Verisi
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Öğrenme Yolum ve İlerlemem
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenTopic(GERMAN_A1_TOPICS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-3.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
          >
            <span>A1 Kelime</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpenListeningScenario(GERMAN_A1_LISTENING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <Headphones className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>Dinleme</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenReadingScenario(GERMAN_A1_READING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <BookText className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>Okuma</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenWritingScenario(GERMAN_A1_WRITING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <PenTool className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>Yazma</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenSpeakingScenario(GERMAN_A1_SPEAKING_SCENARIOS[0].id)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <MessageSquare className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>Konuşma</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenActivityRoute('sinav-modu')}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <ClipboardCheck className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
            <span>Etkinlik &amp; Sınav</span>
          </button>
        </div>
      </div>

      {/* Real KPI Summary Strip (starts strictly at 0) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam XP</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
            {progress.xp} XP
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            Tüm Aktif Modüller
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Kelime</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedWordCount} / {totalWords}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Tamamlanma: %{wordCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Dinleme (Hören)</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedListeningCount} / {TOTAL_LISTENING_EXERCISES}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Tamamlanma: %{listeningCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Okuma (Lesen)</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedReadingCount} / {TOTAL_READING_EXERCISES}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Tamamlanma: %{readingCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Yazma (Schreiben)</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedWritingCount} / {TOTAL_WRITING_TASKS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Tamamlanma: %{writingCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Konuşma (Sprechen)</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedSpeakingCount} / {TOTAL_SPEAKING_TASKS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Öz-Değerlendirme: %{speakingCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Etkinlikler &amp; Sınav</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {completedActivityCount} / {TOTAL_ACTIVITY_ITEMS}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Tamamlanma: %{activityCompletionPct}
          </p>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Genel Doğruluk</p>
          <p className="mt-2 font-mono text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {overallAccuracyPercent === null ? '—' : `%${overallAccuracyPercent}`}
          </p>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {totalGradedAttempts} puanlı yanıt
          </p>
        </div>
      </div>

      {/* Honest Empty State Prompt when no actions yet */}
      {!hasAnyActivity && (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-7 text-center dark:border-[#282830] dark:bg-[#16161A]">
          <BookOpen className="mx-auto h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <h2 className="mt-3 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Henüz tamamlanmış bir çalışma kaydınız yok
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
            Almanca A1 Kelime, Dinleme (Hören), Okuma (Lesen), Yazma (Schreiben) veya Konuşma (Sprechen) modüllerinde pratik yaptığınızda gerçek XP ve ilerlemeniz burada anlık olarak güncellenir.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenTopic(GERMAN_A1_TOPICS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <span>Kelime Çalışmasını Başlat</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenListeningScenario(GERMAN_A1_LISTENING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>Dinleme</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenReadingScenario(GERMAN_A1_READING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>Okuma</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenWritingScenario(GERMAN_A1_WRITING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>Yazma</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenSpeakingScenario(GERMAN_A1_SPEAKING_SCENARIOS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>Konuşma</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 1: Vocabulary Topic-by-Topic Progress */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            01. Almanca A1 Kelime — Ünite İlerlemesi
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedWordCount} / {totalWords} kelime
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
                    %{pct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenTopic(topic.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInTopic > 0 ? 'Çalışmaya Devam Et' : 'Üniteyi Başlat'}
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
            02. Almanca A1 Dinleme (Hören) — Senaryo İlerlemesi
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedListeningCount} / {TOTAL_LISTENING_EXERCISES} soru
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
                    %{pct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenListeningScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0 ? 'Devam Et' : 'Dinlemeye Başla'}
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
            03. Almanca A1 Okuma (Lesen) — Metin İlerlemesi
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedReadingCount} / {TOTAL_READING_EXERCISES} soru
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
                    %{pct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenReadingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0 ? 'Devam Et' : 'Okumaya Başla'}
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
            04. Almanca A1 Yazma (Schreiben) — Bağlam İlerlemesi
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedWritingCount} / {TOTAL_WRITING_TASKS} görev
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
                    %{pct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenWritingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0 ? 'Devam Et' : 'Yazmaya Başla'}
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
            05. Almanca A1 Konuşma (Sprechen) — Senaryo İlerlemesi
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedSpeakingCount} / {TOTAL_SPEAKING_TASKS} pratik
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
                    %{pct}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenSpeakingScenario(scenario.id)}
                    className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                  >
                    {doneInScenario > 0 ? 'Devam Et' : 'Konuşmaya Başla'}
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
            06. Almanca A1 Etkinlikler ve Sınav Bankası
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedActivityCount} / {TOTAL_ACTIVITY_ITEMS} kazanım
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
                    <span className="truncate">{card.subtitleDe}</span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums shrink-0">
                      {done} / {card.ids.length}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {card.titleTr}
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
                    %{pct}
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
            07. Öğretim, Sınıflarım ve Ödev Takibi (Yerel)
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {completedAssignmentsCount} / {totalAssignmentsCount} ödev tamamlandı
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>Yerel A1 Grupları</span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.teachingClasses.length} sınıf
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Sınıflarım
              </h3>
              <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {totalRosterNotesCount > 0
                  ? `${totalRosterNotesCount} manuel katılımcı notu kayıtlı (yalnızca bu tarayıcıda).`
                  : 'Yerel A1 sınıf gruplarınızı ve manuel yoklama notlarınızı yönetin.'}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-[#52525B] dark:text-[#A1A1AA]">Yerel Depolama</span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('siniflarim')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                Sınıfları Aç
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>Modüllere Bağlı A1 Görevler</span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {completedAssignmentsCount} / {totalAssignmentsCount}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Ödevler
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
                %{assignmentsCompletionPct}
              </span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('odevler')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                Ödevleri Aç
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <span>Ders &amp; Quiz Taslakları</span>
                <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.studioDrafts.length} taslak
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Öğretmen Stüdyosu
              </h3>
              <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Tahta önizlemesi, kopyalanabilir/yazdırılabilir A1 kontrol listeleri ve de-DE ses testi.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-[#52525B] dark:text-[#A1A1AA]">Yerel Stüdyo</span>
              <button
                type="button"
                onClick={() => onOpenActivityRoute('ogretmen-studyosu')}
                className="font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
              >
                Stüdyoyu Aç
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
            Beceri ve Mod Bazlı Özet
          </h2>
          <dl className="mt-4 divide-y divide-[#ECECE8] text-sm dark:divide-[#24242C]">
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Kelime Kartları (Öğrenilen)</dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.studiedFlashcards.length} / {totalWords}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Artikel Seçme Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {articleAcc === null
                  ? '—'
                  : `%${articleAcc} (${progress.articleCorrect}/${progress.articleAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Anlam Testi Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {quizAcc === null
                  ? '—'
                  : `%${quizAcc} (${progress.quizCorrect}/${progress.quizAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Hafıza Eşleştirme</dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.memoryGamesCompleted} tur
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Dinleme (Hören) Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {listeningAccuracyPercent === null
                  ? '—'
                  : `%${listeningAccuracyPercent} (${progress.listeningCorrect}/${progress.listeningAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Okuma (Lesen) Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {readingAccuracyPercent === null
                  ? '—'
                  : `%${readingAccuracyPercent} (${progress.readingCorrect}/${progress.readingAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Yazma (Schreiben) Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {writingAccuracyPercent === null
                  ? '—'
                  : `%${writingAccuracyPercent} (${progress.writingCorrect}/${progress.writingAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                Konuşma (Sprechen) Öz-Değerlendirme
              </dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {completedSpeakingCount} / {TOTAL_SPEAKING_TASKS} (%{speakingCompletionPct})
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">Etkinlikler Doğruluğu</dt>
              <dd className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {activityAccuracyPercent === null
                  ? '—'
                  : `%${activityAccuracyPercent} (${progress.activityCorrect}/${progress.activityAttempts})`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                A1 Sınav Bankası En İyi Skor
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.examBestScorePercent === null
                  ? '—'
                  : `%${progress.examBestScorePercent} (${progress.examCompletedCount} deneme)`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                Tamamlanan A1 Ödevleri (Yerel)
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {completedAssignmentsCount} / {totalAssignmentsCount}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                Yerel Sınıf / Stüdyo Taslağı
              </dt>
              <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.teachingClasses.length} sınıf · {progress.studioDrafts.length} taslak
              </dd>
            </div>
          </dl>
        </section>

        {/* Recent Real Activity Log */}
        <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
          <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Son Gerçek Çalışma Kayıtları
          </h2>

          {progress.recentActivities.length === 0 ? (
            <p className="mt-4 text-sm text-[#52525B] dark:text-[#A1A1AA]">
              Henüz kayıtlı bir alıştırma hareketi bulunmuyor.
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
                        {MODE_LABELS[entry.mode] ?? entry.mode} · {formatTimeTr(entry.timestamp)}
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
                Yerel Veri Bütünlüğü ve JSON Yedekleme
              </h2>
              <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                {integrity.isHealthy
                  ? `Kayıt yapısı tutarlı (${integrity.totalUniqueMasteredItems} benzersiz tamamlanan kazanım · ${formatBytesTr(storageDiag.totalBytes)} yerel tarayıcı alanı).`
                  : `Kayıt kontrolünde ${integrity.issuesTr.length} uyarı algılandı; içe aktarma veya sıfırlama için Ayarlar ekranını kullanabilirsiniz.`}{' '}
                Verileriniz yalnızca bu tarayıcıda tutulur; bulut senkronizasyonu bağlı değildir.
              </p>
              {backupNotice && (
                <p className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                  {backupNotice}
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
              <span>JSON Yedeği İndir</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenActivityRoute('ayarlar')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#282830] whitespace-nowrap"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>İçe Aktar / Sıfırla</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
