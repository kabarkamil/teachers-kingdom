import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckSquare,
  FileText,
  Layers,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ALL_A2_WORDS, GERMAN_A2_TOPICS, getA2TopicById } from '../../data/germanA2Vocab';
import { tr } from '../../i18n/tr';
import type { A2VocabMode } from '../../types';
import { isSpeechSynthesisSupported } from '../../utils/speech';
import { A2ArticlePluralMode } from './A2ArticlePluralMode';
import { A2ContextUsageMode } from './A2ContextUsageMode';
import { A2FlashcardsMode } from './A2FlashcardsMode';
import { A2MeaningMatchMode } from './A2MeaningMatchMode';

interface VocabA2ModuleProps {
  initialTopicId?: string;
}

const A2_MODES: Array<{
  id: A2VocabMode;
  labelTr: string;
  shortDescTr: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'flashcards',
    labelTr: 'Kartlarla Öğren',
    shortDescTr: 'Artikel, çoğul, örnek cümle ve ses',
    icon: Layers,
  },
  {
    id: 'articles-plural',
    labelTr: 'Artikel & Çoğul Avı',
    shortDescTr: 'der / die / das + Plural hatırlama',
    icon: BookOpen,
  },
  {
    id: 'meaning',
    labelTr: 'Anlam Eşleştirme',
    shortDescTr: 'Almanca–Türkçe anlam kontrolü',
    icon: CheckSquare,
  },
  {
    id: 'context',
    labelTr: 'Cümle İçi Kullanım',
    shortDescTr: 'A2 bağlam cümlesi tamamlama',
    icon: FileText,
  },
];

export const VocabA2Module: React.FC<VocabA2ModuleProps> = ({ initialTopicId }) => {
  const {
    a2Progress,
    uniqueA2CompletedWordIds,
    a2VocabAccuracyPercent,
    speechSpeed,
    setSpeechSpeed,
    rolePreview,
  } = useAppState();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId ?? GERMAN_A2_TOPICS[0].id
  );
  const [activeMode, setActiveMode] = useState<A2VocabMode>('flashcards');
  const [speechSupported] = useState<boolean>(() => isSpeechSynthesisSupported());
  const [speechErrorNotice, setSpeechErrorNotice] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTopicId) {
      setSelectedTopicId(initialTopicId);
    }
  }, [initialTopicId]);

  const activeTopic = getA2TopicById(selectedTopicId);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Module Header & Real Isolated A2 Metrics */}
      <div className="flex flex-col gap-5 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Öğrenme Alanı</span>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A2 · CEFR A2 Aşama 1
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
            Almanca A2 Kelime Stüdyosu (Wortschatz)
          </h1>
        </div>

        {/* Real A2 Progress Strip */}
        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Çalışılan A2 Kelime</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {uniqueA2CompletedWordIds.length} / {ALL_A2_WORDS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Doğruluk</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {a2VocabAccuracyPercent === null ? '—' : `%${a2VocabAccuracyPercent}`}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Selector (3 Authentic CEFR A2 Units) */}
      <section aria-labelledby="a2-topic-selector-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="a2-topic-selector-heading"
            className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]"
          >
            1. A2 Tematik Ünite Seçin
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {GERMAN_A2_TOPICS.length} A2 Ünitesi · Toplam {ALL_A2_WORDS.length} Kelime
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GERMAN_A2_TOPICS.map((topic) => {
            const isSelected = topic.id === activeTopic.id;
            const masteredCount = topic.words.filter((w) =>
              uniqueA2CompletedWordIds.includes(w.id)
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2 text-white">
                    <div>
                      <p className="font-mono text-[11px] text-[#F5D08A]">
                        Ünite {topic.unitNumber} · {topic.titleDe}
                      </p>
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
                      {topic.words.length} kelime · {topic.grammarBadgeTr}
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

      {/* Mode Switcher + Shared speech.ts Attribution & Speed Control */}
      <section aria-label="A2 çalışma modu ve seslendirme kontrolleri" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="A2 kelime öğrenme modları"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D9D9D3] bg-[#ECECE8]/80 p-1 dark:border-[#282830] dark:bg-[#16161A]"
          >
            {A2_MODES.map((mode) => {
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
                  Yavaş (A2)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Honest Fallback Notice if Browser TTS Unavailable */}
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

      {/* Active Interactive A2 Mode Canvas */}
      <section aria-live="polite" className="pt-1">
        {activeMode === 'flashcards' && (
          <A2FlashcardsMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'articles-plural' && (
          <A2ArticlePluralMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'meaning' && (
          <A2MeaningMatchMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
        {activeMode === 'context' && (
          <A2ContextUsageMode
            topic={activeTopic}
            speechSupported={speechSupported}
            onSpeechError={() => setSpeechErrorNotice(true)}
          />
        )}
      </section>
    </div>
  );
};
