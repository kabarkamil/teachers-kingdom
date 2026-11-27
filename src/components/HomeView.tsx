import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { TOTAL_LISTENING_EXERCISES } from '../data/germanA1Listening';
import { TOTAL_READING_EXERCISES } from '../data/germanA1Reading';
import { TOTAL_SPEAKING_TASKS } from '../data/germanA1Speaking';
import { TOTAL_ACTIVITY_ITEMS } from '../data/germanA1Activities';
import { TOTAL_WRITING_TASKS } from '../data/germanA1Writing';
import { ALL_A1_WORDS, HERO_ACADEMY_IMAGE } from '../data/germanA1Vocab';
import { ALL_A2_WORDS, GERMAN_A2_TOPICS } from '../data/germanA2Vocab';
import { TOTAL_A2_LISTENING_EXERCISES } from '../data/germanA2Listening';
import { TOTAL_A2_READING_EXERCISES } from '../data/germanA2Reading';
import { TOTAL_A2_SPEAKING_TASKS } from '../data/germanA2Speaking';
import { TOTAL_A2_WRITING_TASKS } from '../data/germanA2Writing';
import {
  A2_ARENA_IDS,
  A2_CHARADE_IDS,
  A2_EXAM_IDS,
  A2_KARAOKE_IDS,
  A2_QUIZ_IDS,
  TOTAL_A2_ACTIVITY_ITEMS,
} from '../data/germanA2Activities';
import { CORE_LEARNING_PATH } from '../data/navigation';
import { getLocale } from '../i18n/tr';
import type { A2ActivityMode, ActivityMode, NavRouteId } from '../types';

interface HomeViewProps {
  onNavigate: (route: NavRouteId) => void;
}

interface ResumeTarget {
  route: NavRouteId;
  moduleTitleTr: string;
  contextLabelTr: string;
  progressTextTr: string;
}

const A1_MODE_TO_ROUTE: Partial<Record<ActivityMode, { route: NavRouteId; titleTr: string }>> = {
  flashcards: { route: 'kelime', titleTr: 'Kelime' },
  articles: { route: 'kelime', titleTr: 'Kelime' },
  quiz: { route: 'kelime', titleTr: 'Kelime' },
  memory: { route: 'kelime', titleTr: 'Kelime' },
  'horen-tf': { route: 'dinleme', titleTr: 'Dinleme' },
  'horen-cloze': { route: 'dinleme', titleTr: 'Dinleme' },
  'horen-mc': { route: 'dinleme', titleTr: 'Dinleme' },
  'lesen-tf': { route: 'okuma', titleTr: 'Okuma' },
  'lesen-cloze': { route: 'okuma', titleTr: 'Okuma' },
  'lesen-mc': { route: 'okuma', titleTr: 'Okuma' },
  'schreiben-form': { route: 'yazma', titleTr: 'Yazma' },
  'schreiben-message': { route: 'yazma', titleTr: 'Yazma' },
  'schreiben-controlled': { route: 'yazma', titleTr: 'Yazma' },
  'sprechen-repeat': { route: 'konusma', titleTr: 'Konuşma' },
  'sprechen-prompt': { route: 'konusma', titleTr: 'Konuşma' },
  'sprechen-roleplay': { route: 'konusma', titleTr: 'Konuşma' },
  'activity-karaoke': { route: 'karaoke', titleTr: 'Karaoke' },
  'activity-charades': { route: 'sessiz-sinema', titleTr: 'Sessiz Sinema' },
  'activity-arena': { route: 'arena', titleTr: 'Arena' },
  'activity-quiz': { route: 'quiz-merkezi', titleTr: 'Quiz Merkezi' },
  'activity-exam': { route: 'sinav-modu', titleTr: 'Sınav Modu' },
};

const A2_MODE_TO_ROUTE: Record<A2ActivityMode, { route: NavRouteId; titleTr: string }> = {
  'a2-flashcards': { route: 'kelime', titleTr: 'A2 Kelime' },
  'a2-articles-plural': { route: 'kelime', titleTr: 'A2 Kelime' },
  'a2-meaning': { route: 'kelime', titleTr: 'A2 Kelime' },
  'a2-context': { route: 'kelime', titleTr: 'A2 Kelime' },
  'a2-horen-tf': { route: 'dinleme', titleTr: 'A2 Dinleme' },
  'a2-horen-cloze': { route: 'dinleme', titleTr: 'A2 Dinleme' },
  'a2-horen-mc': { route: 'dinleme', titleTr: 'A2 Dinleme' },
  'a2-lesen-tf': { route: 'okuma', titleTr: 'A2 Okuma' },
  'a2-lesen-cloze': { route: 'okuma', titleTr: 'A2 Okuma' },
  'a2-lesen-mc': { route: 'okuma', titleTr: 'A2 Okuma' },
  'a2-schreiben-message': { route: 'yazma', titleTr: 'A2 Yazma' },
  'a2-schreiben-controlled': { route: 'yazma', titleTr: 'A2 Yazma' },
  'a2-sprechen-repeat': { route: 'konusma', titleTr: 'A2 Konuşma' },
  'a2-sprechen-prompt': { route: 'konusma', titleTr: 'A2 Konuşma' },
  'a2-sprechen-roleplay': { route: 'konusma', titleTr: 'A2 Konuşma' },
  'a2-activity-karaoke': { route: 'karaoke', titleTr: 'A2 Karaoke' },
  'a2-activity-charades': { route: 'sessiz-sinema', titleTr: 'A2 Sessiz Sinema' },
  'a2-activity-arena': { route: 'arena', titleTr: 'A2 Arena' },
  'a2-activity-quiz': { route: 'quiz-merkezi', titleTr: 'A2 Quiz Merkezi' },
  'a2-activity-exam': { route: 'sinav-modu', titleTr: 'A2 Sınav Modu' },
};

const ECOSYSTEM_HIGHLIGHTS: Array<{
  routeId: NavRouteId;
  categoryTr: string;
  titleTr: string;
  descTr: string;
}> = [
  {
    routeId: 'karaoke',
    categoryTr: 'Etkinlikler',
    titleTr: 'Karaoke & Sessiz Sinema',
    descTr: 'Ritmik satır tekrarı ve sınıf canlandırma kartları.',
  },
  {
    routeId: 'arena',
    categoryTr: 'Etkinlikler',
    titleTr: 'Arena, Quiz & Sınav Bankası',
    descTr: '60 sn hızlı tekrar, konu filtreli quiz ve 4 bölümlü deneme sınavı.',
  },
  {
    routeId: 'ogretmen-studyosu',
    categoryTr: 'Öğretim Araçları',
    titleTr: 'Sınıflarım, Ödevler & Stüdyo',
    descTr: 'Yerel sınıf grupları, modül ödevleri ve ders taslakları.',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const {
    rolePreview,
    activeCourse,
    setActiveCourse,
    uiLanguage,
    progress,
    a2Progress,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
  } = useAppState();
  const locale = getLocale(uiLanguage);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const isA2 = activeCourse === 'de-A2';

  // Per-skill real progress counters
  const skillMetrics: Record<
    'kelime' | 'dinleme' | 'okuma' | 'yazma' | 'konusma',
    { done: number; total: number; shortHintTr: string }
  > = isA2
    ? {
        kelime: {
          done: uniqueA2CompletedWordIds.length,
          total: ALL_A2_WORDS.length,
          shortHintTr: '30 A2 sözcük, artikel ve çoğul pratiği.',
        },
        dinleme: {
          done: a2Progress.listeningMasteredIds.length,
          total: TOTAL_A2_LISTENING_EXERCISES,
          shortHintTr: '4 A2 senaryosu, 0.8×/1.0× de-DE seslendirme.',
        },
        okuma: {
          done: a2Progress.readingMasteredIds.length,
          total: TOTAL_A2_READING_EXERCISES,
          shortHintTr: '4 A2 metni, Richtig/Falsch/Yok ve Lückentext.',
        },
        yazma: {
          done: a2Progress.writingMasteredIds.length,
          total: TOTAL_A2_WRITING_TASKS,
          shortHintTr: '4 A2 yazma görevi ve yerel kural kontrolü.',
        },
        konusma: {
          done: a2Progress.speakingMasteredIds.length,
          total: TOTAL_A2_SPEAKING_TASKS,
          shortHintTr: 'Kalıp tekrarı, kılavuzlu yanıt ve rol oyunları.',
        },
      }
    : {
        kelime: {
          done: uniqueCompletedWordIds.length,
          total: ALL_A1_WORDS.length,
          shortHintTr: 'Artikel odaklı kartlar, test ve eşleştirme.',
        },
        dinleme: {
          done: progress.listeningMasteredIds.length,
          total: TOTAL_LISTENING_EXERCISES,
          shortHintTr: 'Günlük A1 diyalogları ve gizli transkript.',
        },
        okuma: {
          done: progress.readingMasteredIds.length,
          total: TOTAL_READING_EXERCISES,
          shortHintTr: 'E-posta, menü ve duyurularla anlama pratiği.',
        },
        yazma: {
          done: progress.writingMasteredIds.length,
          total: TOTAL_WRITING_TASKS,
          shortHintTr: 'Form, kısa mesaj ve yerel kural kontrolü.',
        },
        konusma: {
          done: progress.speakingMasteredIds.length,
          total: TOTAL_SPEAKING_TASKS,
          shortHintTr: 'Telaffuz tekrarı, kısa yanıt ve rol oyunu.',
        },
      };

  const activityDone = isA2
    ? a2Progress.activityMasteredIds.length
    : progress.activityMasteredIds.length;
  const activityTotal = isA2 ? TOTAL_A2_ACTIVITY_ITEMS : TOTAL_ACTIVITY_ITEMS;
  const activeXp = isA2 ? a2Progress.xp : progress.xp;

  const totalCompletedItems =
    skillMetrics.kelime.done +
    skillMetrics.dinleme.done +
    skillMetrics.okuma.done +
    skillMetrics.yazma.done +
    skillMetrics.konusma.done +
    activityDone;
  const totalAvailableItems =
    skillMetrics.kelime.total +
    skillMetrics.dinleme.total +
    skillMetrics.okuma.total +
    skillMetrics.yazma.total +
    skillMetrics.konusma.total +
    activityTotal;
  const overallPercent =
    totalAvailableItems > 0 ? Math.round((totalCompletedItems / totalAvailableItems) * 100) : 0;

  // Resolve real "Kaldığın Yerden Devam Et" target from actual local progress
  const resolveResumeTarget = (): ResumeTarget => {
    const getProgressText = (route: NavRouteId): string => {
      if (
        route === 'kelime' ||
        route === 'dinleme' ||
        route === 'okuma' ||
        route === 'yazma' ||
        route === 'konusma'
      ) {
        const m = skillMetrics[route];
        return `${m.done} / ${m.total} tamamlandı`;
      }
      return `${activityDone} / ${activityTotal} etkinlik tamamlandı`;
    };

    if (isA2) {
      const latest = a2Progress.recentActivities[0];
      if (latest) {
        const mapped = A2_MODE_TO_ROUTE[latest.mode];
        return {
          route: mapped.route,
          moduleTitleTr: mapped.titleTr,
          contextLabelTr: 'Son çalışılan modül',
          progressTextTr: getProgressText(mapped.route),
        };
      }
    } else {
      const latestLearning = progress.recentActivities.find((entry) => A1_MODE_TO_ROUTE[entry.mode]);
      if (latestLearning) {
        const mapped = A1_MODE_TO_ROUTE[latestLearning.mode]!;
        return {
          route: mapped.route,
          moduleTitleTr: mapped.titleTr,
          contextLabelTr: 'Son çalışılan modül',
          progressTextTr: getProgressText(mapped.route),
        };
      }
    }

    const orderedSkills: Array<{
      route: 'kelime' | 'dinleme' | 'okuma' | 'yazma' | 'konusma';
      titleTr: string;
    }> = [
      { route: 'kelime', titleTr: isA2 ? 'A2 Kelime' : 'Kelime' },
      { route: 'dinleme', titleTr: isA2 ? 'A2 Dinleme' : 'Dinleme' },
      { route: 'okuma', titleTr: isA2 ? 'A2 Okuma' : 'Okuma' },
      { route: 'yazma', titleTr: isA2 ? 'A2 Yazma' : 'Yazma' },
      { route: 'konusma', titleTr: isA2 ? 'A2 Konuşma' : 'Konuşma' },
    ];

    const nextSkill = orderedSkills.find(
      (s) => skillMetrics[s.route].done < skillMetrics[s.route].total
    );

    if (nextSkill) {
      return {
        route: nextSkill.route,
        moduleTitleTr: nextSkill.titleTr,
        contextLabelTr: totalCompletedItems === 0 ? 'Önerilen başlangıç' : 'Sıradaki adım',
        progressTextTr: getProgressText(nextSkill.route),
      };
    }

    return {
      route: 'sinav-modu',
      moduleTitleTr: isA2 ? 'A2 Sınav Modu' : 'Sınav Modu',
      contextLabelTr: 'Sıradaki adım',
      progressTextTr: getProgressText('sinav-modu'),
    };
  };

  const resumeTarget = resolveResumeTarget();
  const heroImage = isA2
    ? GERMAN_A2_TOPICS[0]?.imageUrl ?? HERO_ACADEMY_IMAGE
    : HERO_ACADEMY_IMAGE;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* PRIMARY FOCUS HERO: Active Course Status + "Kaldığın Yerden Devam Et" */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-semibold text-[#7A1C24] dark:text-[#D4AF37]">
                  {isA2 ? 'CEFR A2' : 'CEFR A1'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{locale.brand.philosophy}</span>
                <span aria-hidden="true">·</span>
                <span className="rounded-full bg-[#7A1C24]/10 px-2 py-0.5 text-[11px] font-semibold text-[#7A1C24] dark:bg-[#7A1C24]/30 dark:text-[#F4C9CD]">
                  {locale.brand.mottoEn}
                </span>
              </div>
              <span className="font-mono font-semibold text-[#0D0D0D] dark:text-[#FFFFFF] tabular-nums">
                %{overallPercent} · {activeXp} XP
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl sm:text-3xl lg:text-[2.15rem] font-semibold leading-[1.18] tracking-tight text-[#0D0D0D] dark:text-[#FFFFFF] [text-wrap:balance]">
              {isA2 ? locale.home.titleA2 : locale.brand.slogan}
            </h1>

            {/* Focused Resume Card */}
            <div className="mt-5 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  {resumeTarget.contextLabelTr}:{' '}
                  <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {resumeTarget.moduleTitleTr}
                  </strong>
                </span>
                <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {resumeTarget.progressTextTr}
                </span>
              </div>
              <div
                className="mt-2.5 h-2 w-full overflow-hidden rounded-md bg-[#E5E5DF] dark:bg-[#24242C]"
                role="progressbar"
                aria-valuenow={overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={isA2 ? 'Almanca A2 genel ilerleme' : 'Almanca A1 genel ilerleme'}
              >
                <div
                  className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Single Dominant Primary CTA + Minimal Secondary Links */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate(resumeTarget.route)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7A1C24] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#62151C] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254] whitespace-nowrap shrink-0"
            >
              <span>{locale.home.resumeCta}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
            >
              <Compass className="h-4 w-4 text-[#7A1C24] dark:text-[#D4AF37]" />
              <span>{locale.home.progressCta}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCourse(isA2 ? 'de-A1' : 'de-A2')}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-medium text-[#52525B] transition-colors hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF] whitespace-nowrap shrink-0"
            >
              <Layers className="h-4 w-4 text-[#9A6B16] dark:text-[#D4AF37]" />
              <span>{isA2 ? locale.home.switchToA1 : locale.home.switchToA2}</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Panel */}
        <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[250px] overflow-hidden rounded-2xl border border-[#D9D9D3] bg-[#16161A] dark:border-[#282830]">
          {!heroImgFailed ? (
            <img
              src={heroImage}
              alt={
                isA2
                  ? 'Teachers Kingdom Almanca A2 çalışma ortamı'
                  : 'Teachers Kingdom Almanca A1 çalışma masası'
              }
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#16161A] via-[#2A141A] to-[#0D0D0D] p-8 text-center text-[#FFFFFF]">
              <BookOpen className="h-9 w-9 text-[#D4AF37]" />
              <p className="mt-3 font-display text-lg font-semibold">
                {isA2 ? 'Almanca CEFR A2' : locale.brand.name}
              </p>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/80 via-[#0B0B0D]/20 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="font-mono text-xs font-medium text-[#E5B34A]">
              {isA2 ? 'CEFR A2 · 5 Beceri & Sınav Bankası' : 'CEFR A1 · 5 Beceri & Sınav Bankası'}
            </p>
            <p className="mt-1 font-display text-base sm:text-lg font-medium leading-snug">
              Kelime, Dinleme, Okuma, Yazma ve Konuşma
            </p>
          </div>
        </div>
      </section>

      {/* 5-STEP CORE LEARNING PATH (Clean & Immediately Actionable) */}
      <section aria-labelledby="learning-path-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="learning-path-heading"
            className="font-display text-xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
          >
            {isA2 ? locale.home.skillsHeadingA2 : locale.home.skillsHeadingA1}
          </h2>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {totalCompletedItems} / {totalAvailableItems} öğe
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CORE_LEARNING_PATH.map((step) => {
            const key = step.routeId as 'kelime' | 'dinleme' | 'okuma' | 'yazma' | 'konusma';
            const metric = skillMetrics[key];
            const isResumeTarget = resumeTarget.route === step.routeId;

            return (
              <button
                key={step.routeId}
                type="button"
                onClick={() => onNavigate(step.routeId)}
                className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
                  isResumeTarget
                    ? 'border-[#7C1D2E] bg-[#FFFFFF] hover:bg-[#FDF2F4]/40 dark:border-[#D9A13B] dark:bg-[#16161A] dark:hover:bg-[#1E1E24]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#D9A13B]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                      {step.stepNumber}
                    </span>
                    <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                      {metric.done}/{metric.total}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-base font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                    {uiLanguage === 'en' ? step.titleEn : step.titleTr}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {metric.shortHintTr}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#7A1C24] dark:text-[#D4AF37]">
                  <span>{isResumeTarget ? locale.home.continueLabel : locale.home.openLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* COLLAPSIBLE SECONDARY OVERVIEW, ACTIVITIES & TEACHING TOOLS */}
      <section className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] dark:border-[#282830] dark:bg-[#16161A]">
        <button
          type="button"
          onClick={() => setShowOverview((prev) => !prev)}
          aria-expanded={showOverview}
          aria-controls="home-secondary-overview"
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#F6F6F4]/70 dark:hover:bg-[#1C1C22] rounded-2xl"
        >
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {isA2
                ? 'A2 Üniteleri, Etkinlikler ve Öğretim Araçları'
                : 'Etkinlikler, Sınav Bankası ve Öğretim Araçları'}
            </p>
            <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {isA2
                ? `3 kelime ünitesi · ${activityDone}/${activityTotal} etkinlik/sınav · 3 yerel öğretim aracı`
                : `${activityDone}/${activityTotal} etkinlik/sınav · Öğrenci & öğretmen araçları`}
            </p>
          </div>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] whitespace-nowrap shrink-0">
            <span>{showOverview ? 'Özeti Gizle' : 'Tümünü Göster'}</span>
            {showOverview ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </button>

        {showOverview && (
          <div
            id="home-secondary-overview"
            className="space-y-8 border-t border-[#ECECE8] px-5 py-6 sm:px-6 dark:border-[#24242C]"
          >
            {isA2 ? (
              <>
                {/* A2 3-UNIT PREVIEW */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      3 Tematik A2 Kelime Ünitesi
                    </h3>
                    <button
                      type="button"
                      onClick={() => onNavigate('kelime')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B] whitespace-nowrap"
                    >
                      <span>A2 Kelimeye Git</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {GERMAN_A2_TOPICS.map((topic, index) => {
                      const doneCount = topic.words.filter((w) =>
                        uniqueA2CompletedWordIds.includes(w.id)
                      ).length;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => onNavigate('kelime')}
                          className="group flex flex-col justify-between rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 text-left transition-colors hover:border-[#7C1D2E] dark:border-[#24242C] dark:bg-[#111113] dark:hover:border-[#D9A13B]"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                                Ünite 0{index + 1} · {topic.titleDe}
                              </span>
                              <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                                {doneCount}/{topic.words.length}
                              </span>
                            </div>
                            <h4 className="mt-2 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                              {topic.titleTr}
                            </h4>
                          </div>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                            <span>Üniteyi Çalış</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* A2 ACTIVITIES & EXAM BANK */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      A2 Etkinlikler ve Sınav Bankası
                    </h3>
                    <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {activityDone} / {activityTotal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {(
                      [
                        {
                          routeId: 'karaoke' as NavRouteId,
                          titleTr: 'A2 Karaoke',
                          metaTr: `${A2_KARAOKE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_KARAOKE_IDS.length}`,
                        },
                        {
                          routeId: 'sessiz-sinema' as NavRouteId,
                          titleTr: 'A2 Sessiz Sinema',
                          metaTr: `${A2_CHARADE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_CHARADE_IDS.length}`,
                        },
                        {
                          routeId: 'arena' as NavRouteId,
                          titleTr: 'A2 Arena',
                          metaTr: `${A2_ARENA_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_ARENA_IDS.length} · Seri ${a2Progress.a2ArenaBestStreak}`,
                        },
                        {
                          routeId: 'quiz-merkezi' as NavRouteId,
                          titleTr: 'A2 Quiz Merkezi',
                          metaTr: `${A2_QUIZ_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_QUIZ_IDS.length}`,
                        },
                        {
                          routeId: 'sinav-modu' as NavRouteId,
                          titleTr: 'A2 Sınav Modu',
                          metaTr:
                            a2Progress.a2ExamBestScorePercent === null
                              ? `0/${A2_EXAM_IDS.length}`
                              : `En iyi %${a2Progress.a2ExamBestScorePercent}`,
                        },
                      ] as const
                    ).map((card) => (
                      <button
                        key={card.routeId}
                        type="button"
                        onClick={() => onNavigate(card.routeId)}
                        className="group flex flex-col justify-between rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 text-left transition-colors hover:border-[#7C1D2E] dark:border-[#24242C] dark:bg-[#111113] dark:hover:border-[#D9A13B]"
                      >
                        <div>
                          <span className="font-mono text-[11px] text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                            {card.metaTr}
                          </span>
                          <h4 className="mt-1.5 font-display text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {card.titleTr}
                          </h4>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>Aç</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* A2 LOCAL TEACHING TOOLS */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      Sınıf, Ödev ve Öğretmen Araçları
                    </h3>
                    <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      Tarayıcı içi yerel kayıt
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {(
                      [
                        {
                          routeId: 'siniflarim' as NavRouteId,
                          titleTr: 'Sınıflarım',
                          descTr: 'A1/A2 şube kartları ve yerel oturum özeti.',
                        },
                        {
                          routeId: 'odevler' as NavRouteId,
                          titleTr: 'Ödevler',
                          descTr: 'Modüllere bağlı yerel görevlendirme ve takip.',
                        },
                        {
                          routeId: 'ogretmen-studyosu' as NavRouteId,
                          titleTr: 'Öğretmen Stüdyosu',
                          descTr: 'Tahta önizlemesi, taslaklar ve de-DE ses testi.',
                        },
                      ] as const
                    ).map((tool) => (
                      <button
                        key={tool.routeId}
                        type="button"
                        onClick={() => onNavigate(tool.routeId)}
                        className="group flex flex-col justify-between rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 text-left transition-colors hover:border-[#7C1D2E] dark:border-[#24242C] dark:bg-[#111113] dark:hover:border-[#D9A13B]"
                      >
                        <div>
                          <h4 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {tool.titleTr}
                          </h4>
                          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                            {tool.descTr}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>Aracı Aç</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* A1 ECOSYSTEM HIGHLIGHTS */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                      Etkinlikler, Sınav Bankası ve Öğretim Araçları
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {ECOSYSTEM_HIGHLIGHTS.map((item) => (
                      <button
                        key={item.routeId}
                        type="button"
                        onClick={() => onNavigate(item.routeId)}
                        className="group flex flex-col justify-between rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 text-left transition-colors hover:border-[#7C1D2E] dark:border-[#24242C] dark:bg-[#111113] dark:hover:border-[#D9A13B]"
                      >
                        <div>
                          <span className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                            {item.categoryTr}
                          </span>
                          <h4 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {item.titleTr}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                            {item.descTr}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>Modülü Aç</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* STUDENTS & TEACHERS QUICK LINKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`flex flex-col justify-between rounded-xl border p-5 ${
                      rolePreview === 'student'
                        ? 'border-[#111113] bg-[#F6F6F4] dark:border-[#D9A13B] dark:bg-[#111113]'
                        : 'border-[#ECECE8] bg-[#F6F6F4] dark:border-[#24242C] dark:bg-[#111113]'
                    }`}
                  >
                    <div>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#111113] dark:text-[#D9A13B]">
                        <Layers className="h-4 w-4" />
                        <span>Öğrenciler İçin</span>
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        Artikel odaklı kelime kartları, 0.8×/1.0× <span className="font-mono">de-DE</span> seslendirme ve gerçek ilerleme kaydı.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate('kelime')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                      >
                        <span>A1 Kelimeye Başla</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('sinav-modu')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        Sınav Modu
                      </button>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col justify-between rounded-xl border p-5 ${
                      rolePreview === 'teacher'
                        ? 'border-[#7C1D2E] bg-[#F6F6F4] dark:border-[#B8324B] dark:bg-[#111113]'
                        : 'border-[#ECECE8] bg-[#F6F6F4] dark:border-[#24242C] dark:bg-[#111113]'
                    }`}
                  >
                    <div>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C1D2E] dark:text-[#F4728A]">
                        <GraduationCap className="h-4 w-4" />
                        <span>Öğretmenler İçin</span>
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        Akıllı tahta önizlemesi, yerel sınıf/ödev yönetimi ve yazdırılabilir A1/A2 ders taslakları.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate('ogretmen-studyosu')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                      >
                        <span>Öğretmen Stüdyosu</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('odevler')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        Ödevler
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('siniflarim')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        Sınıflarım
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
