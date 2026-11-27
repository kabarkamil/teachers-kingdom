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
import heroAcademyImage from '../assets/images/hero_language_academy_1795362307909.jpg';
import a2HeroImage from '../assets/images/a2_unit_arbeit_alltag_1795436305476.jpg';
import { useAppState } from '../context/AppStateContext';
import {
  A1_CURRICULUM_TOTALS,
  A2_ARENA_IDS_META as A2_ARENA_IDS,
  A2_CHARADE_IDS_META as A2_CHARADE_IDS,
  A2_CURRICULUM_TOTALS,
  A2_EXAM_IDS_META as A2_EXAM_IDS,
  A2_KARAOKE_IDS_META as A2_KARAOKE_IDS,
  A2_QUIZ_IDS_META as A2_QUIZ_IDS,
  A2_TOPIC_SUMMARIES,
} from '../data/curriculumMeta';
import { CORE_LEARNING_PATH } from '../data/navigation';
import { useI18n } from '../hooks/useI18n';
import type { A2ActivityMode, ActivityMode, NavRouteId, UiLanguage } from '../types';

interface HomeViewProps {
  onNavigate: (route: NavRouteId) => void;
}

interface ResumeTarget {
  route: NavRouteId;
  moduleTitle: string;
  contextLabel: string;
  progressText: string;
}

const A1_MODE_TO_ROUTE: Partial<
  Record<ActivityMode, { route: NavRouteId; title: Record<UiLanguage, string> }>
> = {
  flashcards: { route: 'kelime', title: { tr: 'Kelime', en: 'Vocabulary' } },
  articles: { route: 'kelime', title: { tr: 'Kelime', en: 'Vocabulary' } },
  quiz: { route: 'kelime', title: { tr: 'Kelime', en: 'Vocabulary' } },
  memory: { route: 'kelime', title: { tr: 'Kelime', en: 'Vocabulary' } },
  'horen-tf': { route: 'dinleme', title: { tr: 'Dinleme', en: 'Listening' } },
  'horen-cloze': { route: 'dinleme', title: { tr: 'Dinleme', en: 'Listening' } },
  'horen-mc': { route: 'dinleme', title: { tr: 'Dinleme', en: 'Listening' } },
  'lesen-tf': { route: 'okuma', title: { tr: 'Okuma', en: 'Reading' } },
  'lesen-cloze': { route: 'okuma', title: { tr: 'Okuma', en: 'Reading' } },
  'lesen-mc': { route: 'okuma', title: { tr: 'Okuma', en: 'Reading' } },
  'schreiben-form': { route: 'yazma', title: { tr: 'Yazma', en: 'Writing' } },
  'schreiben-message': { route: 'yazma', title: { tr: 'Yazma', en: 'Writing' } },
  'schreiben-controlled': { route: 'yazma', title: { tr: 'Yazma', en: 'Writing' } },
  'sprechen-repeat': { route: 'konusma', title: { tr: 'Konuşma', en: 'Speaking' } },
  'sprechen-prompt': { route: 'konusma', title: { tr: 'Konuşma', en: 'Speaking' } },
  'sprechen-roleplay': { route: 'konusma', title: { tr: 'Konuşma', en: 'Speaking' } },
  'activity-karaoke': { route: 'karaoke', title: { tr: 'Karaoke', en: 'Karaoke' } },
  'activity-charades': { route: 'sessiz-sinema', title: { tr: 'Sessiz Sinema', en: 'Charades' } },
  'activity-arena': { route: 'arena', title: { tr: 'Arena', en: 'Arena' } },
  'activity-quiz': { route: 'quiz-merkezi', title: { tr: 'Quiz Merkezi', en: 'Quiz Center' } },
  'activity-exam': { route: 'sinav-modu', title: { tr: 'Sınav Modu', en: 'Exam Mode' } },
};

const A2_MODE_TO_ROUTE: Record<
  A2ActivityMode,
  { route: NavRouteId; title: Record<UiLanguage, string> }
> = {
  'a2-flashcards': { route: 'kelime', title: { tr: 'A2 Kelime', en: 'A2 Vocabulary' } },
  'a2-articles-plural': { route: 'kelime', title: { tr: 'A2 Kelime', en: 'A2 Vocabulary' } },
  'a2-meaning': { route: 'kelime', title: { tr: 'A2 Kelime', en: 'A2 Vocabulary' } },
  'a2-context': { route: 'kelime', title: { tr: 'A2 Kelime', en: 'A2 Vocabulary' } },
  'a2-horen-tf': { route: 'dinleme', title: { tr: 'A2 Dinleme', en: 'A2 Listening' } },
  'a2-horen-cloze': { route: 'dinleme', title: { tr: 'A2 Dinleme', en: 'A2 Listening' } },
  'a2-horen-mc': { route: 'dinleme', title: { tr: 'A2 Dinleme', en: 'A2 Listening' } },
  'a2-lesen-tf': { route: 'okuma', title: { tr: 'A2 Okuma', en: 'A2 Reading' } },
  'a2-lesen-cloze': { route: 'okuma', title: { tr: 'A2 Okuma', en: 'A2 Reading' } },
  'a2-lesen-mc': { route: 'okuma', title: { tr: 'A2 Okuma', en: 'A2 Reading' } },
  'a2-schreiben-message': { route: 'yazma', title: { tr: 'A2 Yazma', en: 'A2 Writing' } },
  'a2-schreiben-controlled': { route: 'yazma', title: { tr: 'A2 Yazma', en: 'A2 Writing' } },
  'a2-sprechen-repeat': { route: 'konusma', title: { tr: 'A2 Konuşma', en: 'A2 Speaking' } },
  'a2-sprechen-prompt': { route: 'konusma', title: { tr: 'A2 Konuşma', en: 'A2 Speaking' } },
  'a2-sprechen-roleplay': { route: 'konusma', title: { tr: 'A2 Konuşma', en: 'A2 Speaking' } },
  'a2-activity-karaoke': { route: 'karaoke', title: { tr: 'A2 Karaoke', en: 'A2 Karaoke' } },
  'a2-activity-charades': {
    route: 'sessiz-sinema',
    title: { tr: 'A2 Sessiz Sinema', en: 'A2 Charades' },
  },
  'a2-activity-arena': { route: 'arena', title: { tr: 'A2 Arena', en: 'A2 Arena' } },
  'a2-activity-quiz': {
    route: 'quiz-merkezi',
    title: { tr: 'A2 Quiz Merkezi', en: 'A2 Quiz Center' },
  },
  'a2-activity-exam': { route: 'sinav-modu', title: { tr: 'A2 Sınav Modu', en: 'A2 Exam Mode' } },
};

const A2_UNIT_TITLES_EN: Record<string, string> = {
  'a2-arbeit-alltag': 'Work, Career & Planning',
  'a2-gesundheit-wohnen': 'Health, Body & Housing',
  'a2-reisen-medien': 'Travel, City & Digital Media',
};

const ECOSYSTEM_HIGHLIGHTS: Array<{
  routeId: NavRouteId;
  category: Record<UiLanguage, string>;
  title: Record<UiLanguage, string>;
  desc: Record<UiLanguage, string>;
}> = [
  {
    routeId: 'karaoke',
    category: { tr: 'Etkinlikler', en: 'Activities' },
    title: { tr: 'Karaoke & Sessiz Sinema', en: 'Karaoke & Charades' },
    desc: {
      tr: 'Ritmik satır tekrarı ve sınıf canlandırma kartları.',
      en: 'Rhythmic line repetition and classroom acting cards.',
    },
  },
  {
    routeId: 'arena',
    category: { tr: 'Etkinlikler', en: 'Activities' },
    title: { tr: 'Arena, Quiz & Sınav Bankası', en: 'Arena, Quiz & Exam Bank' },
    desc: {
      tr: '60 sn hızlı tekrar, konu filtreli quiz ve 4 bölümlü deneme sınavı.',
      en: '60-sec rapid review, topic-filtered quizzes, and 4-part practice exams.',
    },
  },
  {
    routeId: 'ogretmen-studyosu',
    category: { tr: 'Öğretim Araçları', en: 'Teaching Tools' },
    title: { tr: 'Sınıflarım, Ödevler & Stüdyo', en: 'My Classes, Assignments & Studio' },
    desc: {
      tr: 'Yerel sınıf grupları, modül ödevleri ve ders taslakları.',
      en: 'Local class groups, module assignments, and lesson drafts.',
    },
  },
];

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const {
    rolePreview,
    activeCourse,
    setActiveCourse,
    progress,
    a2Progress,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
  } = useAppState();
  const { locale, isEn, tx } = useI18n();
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const isA2 = activeCourse === 'de-A2';

  // Per-skill real progress counters
  const skillMetrics: Record<
    'kelime' | 'dinleme' | 'okuma' | 'yazma' | 'konusma',
    { done: number; total: number; shortHint: string }
  > = isA2
    ? {
        kelime: {
          done: uniqueA2CompletedWordIds.length,
          total: A2_CURRICULUM_TOTALS.words,
          shortHint: tx({
            tr: '30 A2 sözcük, artikel ve çoğul pratiği.',
            en: '30 A2 words, article and plural practice.',
          }),
        },
        dinleme: {
          done: a2Progress.listeningMasteredIds.length,
          total: A2_CURRICULUM_TOTALS.listening,
          shortHint: tx({
            tr: '4 A2 senaryosu, 0.8×/1.0× de-DE seslendirme.',
            en: '4 A2 scenarios with 0.8×/1.0× de-DE audio.',
          }),
        },
        okuma: {
          done: a2Progress.readingMasteredIds.length,
          total: A2_CURRICULUM_TOTALS.reading,
          shortHint: tx({
            tr: '4 A2 metni, Richtig/Falsch/Yok ve Lückentext.',
            en: '4 A2 texts with Richtig/Falsch/Not given & Lückentext.',
          }),
        },
        yazma: {
          done: a2Progress.writingMasteredIds.length,
          total: A2_CURRICULUM_TOTALS.writing,
          shortHint: tx({
            tr: '4 A2 yazma görevi ve yerel kural kontrolü.',
            en: '4 A2 writing tasks with local rule checks.',
          }),
        },
        konusma: {
          done: a2Progress.speakingMasteredIds.length,
          total: A2_CURRICULUM_TOTALS.speaking,
          shortHint: tx({
            tr: 'Kalıp tekrarı, kılavuzlu yanıt ve rol oyunları.',
            en: 'Phrase repetition, guided prompts, and roleplays.',
          }),
        },
      }
    : {
        kelime: {
          done: uniqueCompletedWordIds.length,
          total: A1_CURRICULUM_TOTALS.words,
          shortHint: tx({
            tr: 'Artikel odaklı kartlar, test ve eşleştirme.',
            en: 'Article-focused flashcards, quizzes, and matching.',
          }),
        },
        dinleme: {
          done: progress.listeningMasteredIds.length,
          total: A1_CURRICULUM_TOTALS.listening,
          shortHint: tx({
            tr: 'Günlük A1 diyalogları ve gizli transkript.',
            en: 'Everyday A1 dialogues with toggleable transcript.',
          }),
        },
        okuma: {
          done: progress.readingMasteredIds.length,
          total: A1_CURRICULUM_TOTALS.reading,
          shortHint: tx({
            tr: 'E-posta, menü ve duyurularla anlama pratiği.',
            en: 'Comprehension practice with emails, menus, and notices.',
          }),
        },
        yazma: {
          done: progress.writingMasteredIds.length,
          total: A1_CURRICULUM_TOTALS.writing,
          shortHint: tx({
            tr: 'Form, kısa mesaj ve yerel kural kontrolü.',
            en: 'Forms, short messages, and local rule checks.',
          }),
        },
        konusma: {
          done: progress.speakingMasteredIds.length,
          total: A1_CURRICULUM_TOTALS.speaking,
          shortHint: tx({
            tr: 'Telaffuz tekrarı, kısa yanıt ve rol oyunu.',
            en: 'Pronunciation drills, short responses, and roleplay.',
          }),
        },
      };

  const activityDone = isA2
    ? a2Progress.activityMasteredIds.length
    : progress.activityMasteredIds.length;
  const activityTotal = isA2 ? A2_CURRICULUM_TOTALS.activities : A1_CURRICULUM_TOTALS.activities;
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
        return tx(
          { tr: '{{done}} / {{total}} tamamlandı', en: '{{done}} / {{total}} completed' },
          { done: m.done, total: m.total }
        );
      }
      return tx(
        {
          tr: '{{done}} / {{total}} etkinlik tamamlandı',
          en: '{{done}} / {{total}} activities completed',
        },
        { done: activityDone, total: activityTotal }
      );
    };

    if (isA2) {
      const latest = a2Progress.recentActivities[0];
      if (latest) {
        const mapped = A2_MODE_TO_ROUTE[latest.mode];
        return {
          route: mapped.route,
          moduleTitle: tx(mapped.title),
          contextLabel: tx({ tr: 'Son çalışılan modül', en: 'Last studied module' }),
          progressText: getProgressText(mapped.route),
        };
      }
    } else {
      const latestLearning = progress.recentActivities.find((entry) => A1_MODE_TO_ROUTE[entry.mode]);
      if (latestLearning) {
        const mapped = A1_MODE_TO_ROUTE[latestLearning.mode]!;
        return {
          route: mapped.route,
          moduleTitle: tx(mapped.title),
          contextLabel: tx({ tr: 'Son çalışılan modül', en: 'Last studied module' }),
          progressText: getProgressText(mapped.route),
        };
      }
    }

    const orderedSkills: Array<{
      route: 'kelime' | 'dinleme' | 'okuma' | 'yazma' | 'konusma';
      title: string;
    }> = [
      {
        route: 'kelime',
        title: isA2
          ? tx({ tr: 'A2 Kelime', en: 'A2 Vocabulary' })
          : tx({ tr: 'Kelime', en: 'Vocabulary' }),
      },
      {
        route: 'dinleme',
        title: isA2
          ? tx({ tr: 'A2 Dinleme', en: 'A2 Listening' })
          : tx({ tr: 'Dinleme', en: 'Listening' }),
      },
      {
        route: 'okuma',
        title: isA2
          ? tx({ tr: 'A2 Okuma', en: 'A2 Reading' })
          : tx({ tr: 'Okuma', en: 'Reading' }),
      },
      {
        route: 'yazma',
        title: isA2
          ? tx({ tr: 'A2 Yazma', en: 'A2 Writing' })
          : tx({ tr: 'Yazma', en: 'Writing' }),
      },
      {
        route: 'konusma',
        title: isA2
          ? tx({ tr: 'A2 Konuşma', en: 'A2 Speaking' })
          : tx({ tr: 'Konuşma', en: 'Speaking' }),
      },
    ];

    const nextSkill = orderedSkills.find(
      (s) => skillMetrics[s.route].done < skillMetrics[s.route].total
    );

    if (nextSkill) {
      return {
        route: nextSkill.route,
        moduleTitle: nextSkill.title,
        contextLabel:
          totalCompletedItems === 0
            ? tx({ tr: 'Önerilen başlangıç', en: 'Recommended start' })
            : tx({ tr: 'Sıradaki adım', en: 'Next step' }),
        progressText: getProgressText(nextSkill.route),
      };
    }

    return {
      route: 'sinav-modu',
      moduleTitle: isA2
        ? tx({ tr: 'A2 Sınav Modu', en: 'A2 Exam Mode' })
        : tx({ tr: 'Sınav Modu', en: 'Exam Mode' }),
      contextLabel: tx({ tr: 'Sıradaki adım', en: 'Next step' }),
      progressText: getProgressText('sinav-modu'),
    };
  };

  const resumeTarget = resolveResumeTarget();
  const heroImage = isA2 ? a2HeroImage : heroAcademyImage;

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
                {tx(
                  { tr: '%{{pct}} · {{xp}} XP', en: '{{pct}}% · {{xp}} XP' },
                  { pct: overallPercent, xp: activeXp }
                )}
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl sm:text-3xl lg:text-[2.15rem] font-semibold leading-[1.18] tracking-tight text-[#0D0D0D] dark:text-[#FFFFFF] [text-wrap:balance]">
              {isA2 ? locale.home.titleA2 : locale.brand.slogan}
            </h1>

            {/* Focused Resume Card */}
            <div className="mt-5 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  {resumeTarget.contextLabel}:{' '}
                  <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {resumeTarget.moduleTitle}
                  </strong>
                </span>
                <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {resumeTarget.progressText}
                </span>
              </div>
              <div
                className="mt-2.5 h-2 w-full overflow-hidden rounded-md bg-[#E5E5DF] dark:bg-[#24242C]"
                role="progressbar"
                aria-valuenow={overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={
                  isA2
                    ? tx({ tr: 'Almanca A2 genel ilerleme', en: 'German A2 overall progress' })
                    : tx({ tr: 'Almanca A1 genel ilerleme', en: 'German A1 overall progress' })
                }
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
                  ? tx({
                      tr: 'Teachers Kingdom Almanca A2 çalışma ortamı',
                      en: 'Teachers Kingdom German A2 study workspace',
                    })
                  : tx({
                      tr: 'Teachers Kingdom Almanca A1 çalışma masası',
                      en: 'Teachers Kingdom German A1 study desk',
                    })
              }
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#16161A] via-[#2A141A] to-[#0D0D0D] p-8 text-center text-[#FFFFFF]">
              <BookOpen className="h-9 w-9 text-[#D4AF37]" />
              <p className="mt-3 font-display text-lg font-semibold">
                {isA2 ? tx({ tr: 'Almanca CEFR A2', en: 'German CEFR A2' }) : locale.brand.name}
              </p>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/80 via-[#0B0B0D]/20 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="font-mono text-xs font-medium text-[#E5B34A]">
              {isA2
                ? tx({
                    tr: 'CEFR A2 · 5 Beceri & Sınav Bankası',
                    en: 'CEFR A2 · 5 Skills & Exam Bank',
                  })
                : tx({
                    tr: 'CEFR A1 · 5 Beceri & Sınav Bankası',
                    en: 'CEFR A1 · 5 Skills & Exam Bank',
                  })}
            </p>
            <p className="mt-1 font-display text-base sm:text-lg font-medium leading-snug">
              {tx({
                tr: 'Kelime, Dinleme, Okuma, Yazma ve Konuşma',
                en: 'Vocabulary, Listening, Reading, Writing & Speaking',
              })}
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
            {tx(
              { tr: '{{done}} / {{total}} öğe', en: '{{done}} / {{total}} items' },
              { done: totalCompletedItems, total: totalAvailableItems }
            )}
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
                    {isEn ? step.titleEn : step.titleTr}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {metric.shortHint}
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
                ? tx({
                    tr: 'A2 Üniteleri, Etkinlikler ve Öğretim Araçları',
                    en: 'A2 Units, Activities & Teaching Tools',
                  })
                : tx({
                    tr: 'Etkinlikler, Sınav Bankası ve Öğretim Araçları',
                    en: 'Activities, Exam Bank & Teaching Tools',
                  })}
            </p>
            <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {isA2
                ? tx(
                    {
                      tr: '3 kelime ünitesi · {{done}}/{{total}} etkinlik/sınav · 3 yerel öğretim aracı',
                      en: '3 vocabulary units · {{done}}/{{total}} activities/exams · 3 local teaching tools',
                    },
                    { done: activityDone, total: activityTotal }
                  )
                : tx(
                    {
                      tr: '{{done}}/{{total}} etkinlik/sınav · Öğrenci & öğretmen araçları',
                      en: '{{done}}/{{total}} activities/exams · Student & teacher tools',
                    },
                    { done: activityDone, total: activityTotal }
                  )}
            </p>
          </div>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] whitespace-nowrap shrink-0">
            <span>{showOverview ? locale.home.hideOverview : locale.home.showAll}</span>
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
                      {tx({
                        tr: '3 Tematik A2 Kelime Ünitesi',
                        en: '3 Thematic A2 Vocabulary Units',
                      })}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onNavigate('kelime')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B] whitespace-nowrap"
                    >
                      <span>{tx({ tr: 'A2 Kelimeye Git', en: 'Go to A2 Vocabulary' })}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {A2_TOPIC_SUMMARIES.map((topic, index) => {
                      const doneCount = topic.wordIds.filter((wordId) =>
                        uniqueA2CompletedWordIds.includes(wordId)
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
                                {tx({ tr: 'Ünite 0{{n}}', en: 'Unit 0{{n}}' }, { n: index + 1 })} ·{' '}
                                {topic.titleDe}
                              </span>
                              <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                                {doneCount}/{topic.wordIds.length}
                              </span>
                            </div>
                            <h4 className="mt-2 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                              {isEn ? A2_UNIT_TITLES_EN[topic.id] ?? topic.titleDe : topic.titleTr}
                            </h4>
                          </div>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                            <span>{tx({ tr: 'Üniteyi Çalış', en: 'Study Unit' })}</span>
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
                      {tx({
                        tr: 'A2 Etkinlikler ve Sınav Bankası',
                        en: 'A2 Activities & Exam Bank',
                      })}
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
                          title: 'A2 Karaoke',
                          meta: `${A2_KARAOKE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_KARAOKE_IDS.length}`,
                        },
                        {
                          routeId: 'sessiz-sinema' as NavRouteId,
                          title: tx({ tr: 'A2 Sessiz Sinema', en: 'A2 Charades' }),
                          meta: `${A2_CHARADE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_CHARADE_IDS.length}`,
                        },
                        {
                          routeId: 'arena' as NavRouteId,
                          title: 'A2 Arena',
                          meta: tx(
                            {
                              tr: '{{done}}/{{total}} · Seri {{streak}}',
                              en: '{{done}}/{{total}} · Streak {{streak}}',
                            },
                            {
                              done: A2_ARENA_IDS.filter((id) =>
                                a2Progress.activityMasteredIds.includes(id)
                              ).length,
                              total: A2_ARENA_IDS.length,
                              streak: a2Progress.a2ArenaBestStreak,
                            }
                          ),
                        },
                        {
                          routeId: 'quiz-merkezi' as NavRouteId,
                          title: tx({ tr: 'A2 Quiz Merkezi', en: 'A2 Quiz Center' }),
                          meta: `${A2_QUIZ_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length}/${A2_QUIZ_IDS.length}`,
                        },
                        {
                          routeId: 'sinav-modu' as NavRouteId,
                          title: tx({ tr: 'A2 Sınav Modu', en: 'A2 Exam Mode' }),
                          meta:
                            a2Progress.a2ExamBestScorePercent === null
                              ? `0/${A2_EXAM_IDS.length}`
                              : tx(
                                  { tr: 'En iyi %{{pct}}', en: 'Best {{pct}}%' },
                                  { pct: a2Progress.a2ExamBestScorePercent }
                                ),
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
                            {card.meta}
                          </span>
                          <h4 className="mt-1.5 font-display text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {card.title}
                          </h4>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>{locale.home.openLabel}</span>
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
                      {tx({
                        tr: 'Sınıf, Ödev ve Öğretmen Araçları',
                        en: 'Class, Assignment & Teacher Tools',
                      })}
                    </h3>
                    <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {tx({ tr: 'Tarayıcı içi yerel kayıt', en: 'Local browser storage' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {(
                      [
                        {
                          routeId: 'siniflarim' as NavRouteId,
                          title: tx({ tr: 'Sınıflarım', en: 'My Classes' }),
                          desc: tx({
                            tr: 'A1/A2 şube kartları ve yerel oturum özeti.',
                            en: 'A1/A2 class sections and local session overview.',
                          }),
                        },
                        {
                          routeId: 'odevler' as NavRouteId,
                          title: tx({ tr: 'Ödevler', en: 'Assignments' }),
                          desc: tx({
                            tr: 'Modüllere bağlı yerel görevlendirme ve takip.',
                            en: 'Module-linked local tasks and progress tracking.',
                          }),
                        },
                        {
                          routeId: 'ogretmen-studyosu' as NavRouteId,
                          title: tx({ tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' }),
                          desc: tx({
                            tr: 'Tahta önizlemesi, taslaklar ve de-DE ses testi.',
                            en: 'Board preview, lesson drafts, and de-DE voice test.',
                          }),
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
                            {tool.title}
                          </h4>
                          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                            {tool.desc}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>{tx({ tr: 'Aracı Aç', en: 'Open Tool' })}</span>
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
                      {tx({
                        tr: 'Etkinlikler, Sınav Bankası ve Öğretim Araçları',
                        en: 'Activities, Exam Bank & Teaching Tools',
                      })}
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
                            {tx(item.category)}
                          </span>
                          <h4 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {tx(item.title)}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                            {tx(item.desc)}
                          </p>
                        </div>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          <span>{tx({ tr: 'Modülü Aç', en: 'Open Module' })}</span>
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
                        <span>{tx({ tr: 'Öğrenciler İçin', en: 'For Students' })}</span>
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        {isEn ? (
                          <>
                            Article-focused flashcards, 0.8×/1.0×{' '}
                            <span className="font-mono">de-DE</span> audio, and real progress
                            tracking.
                          </>
                        ) : (
                          <>
                            Artikel odaklı kelime kartları, 0.8×/1.0×{' '}
                            <span className="font-mono">de-DE</span> seslendirme ve gerçek ilerleme
                            kaydı.
                          </>
                        )}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate('kelime')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                      >
                        <span>{tx({ tr: 'A1 Kelimeye Başla', en: 'Start A1 Vocabulary' })}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('sinav-modu')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        {tx({ tr: 'Sınav Modu', en: 'Exam Mode' })}
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
                        <span>{tx({ tr: 'Öğretmenler İçin', en: 'For Teachers' })}</span>
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        {tx({
                          tr: 'Akıllı tahta önizlemesi, yerel sınıf/ödev yönetimi ve yazdırılabilir A1/A2 ders taslakları.',
                          en: 'Smartboard preview, local class/assignment management, and printable A1/A2 lesson drafts.',
                        })}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onNavigate('ogretmen-studyosu')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                      >
                        <span>{tx({ tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' })}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('odevler')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        {tx({ tr: 'Ödevler', en: 'Assignments' })}
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('siniflarim')}
                        className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                      >
                        {tx({ tr: 'Sınıflarım', en: 'My Classes' })}
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
