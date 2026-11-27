import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckSquare,
  Grid2X2,
  Layers,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ALL_A1_WORDS, GERMAN_A1_TOPICS, getTopicById } from '../../data/germanA1Vocab';
import { tr } from '../../i18n/tr';
import type { VocabMode } from '../../types';
import { isSpeechSynthesisSupported } from '../../utils/speech';
import { ArticleDrillMode } from './ArticleDrillMode';
import { FlashcardsMode } from './FlashcardsMode';
import { MeaningQuizMode } from './MeaningQuizMode';
import { MemoryMatchMode } from './MemoryMatchMode';

interface VocabModuleProps {
  initialTopicId?: string;
}

const MODES: Array<{
  id: VocabMode;
  labelTr: string;
  shortDescTr: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'flashcards',
    labelTr: 'Kelime Kartları',
    shortDescTr: 'Çevirmeli kart, artikel ve telaffuz',
    icon: Layers,
  },
  {
    id: 'articles',
    labelTr: 'Artikel Seçme',
    shortDescTr: 'der / die / das kural alıştırması',
    icon: BookOpen,
  },
  {
    id: 'quiz',
    labelTr: 'Doğru Anlamı Bulma',
    shortDescTr: 'Anlam ve cümle içi bağlam testi',
    icon: CheckSquare,
  },
  {
    id: 'memory',
    labelTr: 'Hafıza Eşleştirme',
    shortDescTr: 'Almanca–Türkçe kart eşleştirme',
    icon: Grid2X2,
  },
];

export const VocabModule: React.FC<VocabModuleProps> = ({ initialTopicId }) => {
  const {
    progress,
    uniqueCompletedWordIds,
    vocabAccuracyPercent,
    speechSpeed,
    setSpeechSpeed,
    rolePreview,
  } = useAppState();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId ?? GERMAN_A1_TOPICS[0].id
  );
  const [activeMode, setActiveMode] = useState<VocabMode>('flashcards');
  const [speechSupported] = useState<boolean>(() => isSpeechSynthesisSupported());
  const [speechErrorNotice, setSpeechErrorNotice] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);

  const activeTopic = getTopicById(selectedTopicId);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Module Header & Real Live Metrics */}
      <div className="flex flex-col gap-5 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Öğrenme Alanı</span>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span>Öğretmen Önizleme Görünümü</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Almanca A1 Kelime Stüdyosu
          </h1>
        </div>

        {/* Real Progress Strip (strictly from localStorage/session actions) */}
        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Kazanılan XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Çalışılan Kelime</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {uniqueCompletedWordIds.length} / {ALL_A1_WORDS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Kelime Doğruluğu</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {vocabAccuracyPercent === null ? '—' : `%${vocabAccuracyPercent}`}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Selector (3 Rich German A1 Categories) */}
      <section aria-labelledby="topic-selector-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="topic-selector-heading"
            className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]"
          >
            1. Ünite / Konu Seçin
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            3 A1 Temel Kategori · Toplam 30 Kelime
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GERMAN_A1_TOPICS.map((topic) => {
            const isSelected = topic.id === activeTopic.id;
            const masteredCount = topic.words.filter((w) =>
              uniqueCompletedWordIds.includes(w.id)
            ).length;
            const imgFailed = failedImages[topic.id];

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                aria-pressed={isSelected}
                className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[#7C1D2E] bg-[#FFFFFF] ring-1 ring-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#16161A] dark:ring-[#D9A13B]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161A]">
                  {!imgFailed ? (
                    <img
                      src={topic.imageUrl}
                      alt={topic.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [topic.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1C1C22] to-[#3B1520] p-4 text-center text-[#F4F4F5]">
                      <BookOpen className="h-7 w-7 text-[#D9A13B]" />
                      <span className="mt-2 font-display text-sm">{topic.titleDe}</span>
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                    <div>
                      <p className="text-[11px] text-white/80">{topic.titleDe}</p>
                      <p className="font-display text-base font-semibold leading-snug">
                        {topic.titleTr}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#F5D08A] tabular-nums shrink-0">
                      {masteredCount}/{topic.words.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {topic.subtitleTr}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#52525B] dark:text-[#A1A1AA]">
                      {topic.words.length} kelime · der/die/das
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected
                          ? 'text-[#7C1D2E] dark:text-[#D9A13B]'
                          : 'text-[#111113] dark:text-[#E4E4E7]'
                      }`}
                    >
                      {isSelected ? 'Seçili Ünite' : 'Seç'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mode Switcher + Browser TTS Attribution & Speed Control */}
      <section aria-label="Çalışma modu ve seslendirme kontrolleri" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* 4-Mode Interactive Tabs */}
          <div
            role="tablist"
            aria-label="Kelime öğrenme modları"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D9D9D3] bg-[#ECECE8]/80 p-1 dark:border-[#282830] dark:bg-[#16161A]"
          >
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveMode(mode.id)}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{mode.labelTr}</span>
                </button>
              );
            })}
          </div>

          {/* Web Speech API Status & Speed Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2 text-xs dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex items-center gap-2 text-[#52525B] dark:text-[#A1A1AA]">
              <Volume2 className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
              <span>{tr.common.browserTtsNotice}</span>
            </div>

            {speechSupported && (
              <div className="flex items-center gap-1 rounded-md border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]">
                <button
                  type="button"
                  onClick={() => setSpeechSpeed('normal')}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    speechSpeed === 'normal'
                      ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  {tr.common.speedNormal}
                </button>
                <button
                  type="button"
                  onClick={() => setSpeechSpeed('slow')}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    speechSpeed === 'slow'
                      ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  {tr.common.speedSlow}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Graceful Fallback Notice if Browser TTS Unavailable */}
        {(!speechSupported || speechErrorNotice) && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-[#9A6B16]/40 bg-[#FEF9EB] px-4 py-3 text-xs text-[#713F12] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#FDE68A]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{tr.common.ttsUnavailable}</p>
          </div>
        )}
      </section>

      {/* Active Interactive Mode Canvas */}
      <section aria-live="polite" className="pt-1">
        {activeMode === 'flashcards' && (
          <FlashcardsMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'articles' && (
          <ArticleDrillMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'quiz' && (
          <MeaningQuizMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'memory' && (
          <MemoryMatchMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
      </section>
    </div>
  );
};
