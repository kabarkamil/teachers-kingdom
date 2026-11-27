import React, { useCallback, useEffect, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { VocabTopic } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface FlashcardsModeProps {
  topic: VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

export const FlashcardsMode: React.FC<FlashcardsModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { progress, speechSpeed, recordFlashcardStudied } = useAppState();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speakingTarget, setSpeakingTarget] = useState<'word' | 'sentence' | null>(null);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    stopGermanSpeech();
    setSpeakingTarget(null);
  }, [topic.id]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const currentWord = topic.words[index] ?? topic.words[0];
  const articleToken = ARTICLE_TOKENS[currentWord.article];
  const isLearned = progress.studiedFlashcards.includes(currentWord.id);
  const learnedInTopic = topic.words.filter((w) =>
    progress.studiedFlashcards.includes(w.id)
  ).length;

  const goPrev = useCallback(() => {
    stopGermanSpeech();
    setSpeakingTarget(null);
    setFlipped(false);
    setIndex((prev) => (prev === 0 ? topic.words.length - 1 : prev - 1));
  }, [topic.words.length]);

  const goNext = useCallback(() => {
    stopGermanSpeech();
    setSpeakingTarget(null);
    setFlipped(false);
    setIndex((prev) => (prev === topic.words.length - 1 ? 0 : prev + 1));
  }, [topic.words.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === ' ') {
        if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement) {
          return;
        }
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const handleSpeak = (text: string, target: 'word' | 'sentence', e: React.MouseEvent) => {
    e.stopPropagation();
    const res = speakGermanText(text, speechSpeed, {
      onStart: () => setSpeakingTarget(target),
      onEnd: () => setSpeakingTarget(null),
      onError: () => {
        setSpeakingTarget(null);
        onSpeechError();
      },
    });
    if (!res.queued) {
      onSpeechError();
    }
  };

  const handleMarkLearned = () => {
    recordFlashcardStudied(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header meta row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">
            {topic.titleTr}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            Kart {index + 1} / {topic.words.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-[#7C1D2E] dark:text-[#D9A13B]">
            Öğrenilen: {learnedInTopic} / {topic.words.length}
          </span>
        </div>

        <p className="hidden sm:block text-xs text-[#52525B] dark:text-[#A1A1AA]">
          Klavye: Boşluk (çevir) · ← / → (geç)
        </p>
      </div>

      {/* Interactive 3D Flashcard */}
      <div className="tk-perspective mx-auto max-w-2xl">
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          aria-label={
            flipped
              ? 'Kartın ön yüzünü görmek için tıklayın'
              : 'Anlamı ve örnek cümleyi görmek için kartı çevirin'
          }
          className={`tk-preserve-3d relative min-h-[340px] sm:min-h-[360px] w-full cursor-pointer select-none ${
            flipped ? 'tk-rotate-y-180' : ''
          }`}
        >
          {/* FRONT FACE */}
          <div className="tk-backface-hidden absolute inset-0 flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className={`font-mono font-semibold ${articleToken.textClass}`}>
                  {articleToken.article}
                </span>
                <span aria-hidden="true" className="text-[#A1A1AA]">
                  ·
                </span>
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  {articleToken.genderLabelTr} ({articleToken.genderLabelDe})
                </span>
              </div>

              <button
                type="button"
                disabled={!speechSupported}
                onClick={(e) =>
                  handleSpeak(`${currentWord.article} ${currentWord.word}`, 'word', e)
                }
                aria-label={`${currentWord.article} ${currentWord.word} telaffuzunu dinle`}
                className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  speakingTarget === 'word'
                    ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#272730]'
                }`}
              >
                <Volume2 className="h-4 w-4" />
                <span>{speakingTarget === 'word' ? 'Okunuyor…' : 'Dinle (de-DE)'}</span>
              </button>
            </div>

            <div className="my-auto py-6 text-center">
              <p className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
                <span className={articleToken.textClass}>{currentWord.article}</span>{' '}
                <span>{currentWord.word}</span>
              </p>
              <p className="mt-3 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                Çoğul:{' '}
                <span className="font-medium text-[#111113] dark:text-[#E4E4E7]">
                  {currentWord.plural}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#ECECE8] pt-4 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
              <span>Ön Yüz · Almanca</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
                <RotateCw className="h-3.5 w-3.5" />
                Çevirmek için tıkla
              </span>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="tk-backface-hidden tk-rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-xl border border-[#9A6B16]/45 bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#D9A13B]/45 dark:bg-[#16161A]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold ${articleToken.textClass}`}>
                  {currentWord.article} {currentWord.word}
                </span>
                <span aria-hidden="true" className="text-[#A1A1AA]">
                  ·
                </span>
                <span className="text-[#52525B] dark:text-[#A1A1AA]">Türkçe Karşılık</span>
              </div>

              <button
                type="button"
                disabled={!speechSupported}
                onClick={(e) => handleSpeak(currentWord.exampleDe, 'sentence', e)}
                aria-label="Örnek cümleyi Almanca dinle"
                className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  speakingTarget === 'sentence'
                    ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#272730]'
                }`}
              >
                <Volume2 className="h-4 w-4" />
                <span>{speakingTarget === 'sentence' ? 'Okunuyor…' : 'Cümleyi Dinle'}</span>
              </button>
            </div>

            <div className="my-auto space-y-5 py-4">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {currentWord.turkish}
                </p>
              </div>

              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#282830] dark:bg-[#111113]">
                <p className="text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
                  “{currentWord.exampleDe}”
                </p>
                <p className="mt-1.5 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {currentWord.exampleTr}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                <strong className="font-semibold text-[#111113] dark:text-[#E4E4E7]">
                  Artikel Notu:{' '}
                </strong>
                {currentWord.articleTipTr}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#ECECE8] pt-4 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
              <span>Arka Yüz · Anlam ve Bağlam</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
                <RotateCw className="h-3.5 w-3.5" />
                Ön yüze dön
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Controls */}
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Önceki</span>
          </button>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <RotateCw className="h-4 w-4" />
            <span>Çevir</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <span>Sonraki</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleMarkLearned}
          disabled={isLearned}
          className={`inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors whitespace-nowrap ${
            isLearned
              ? 'border border-[#15803D]/30 bg-[#F0FDF4] text-[#15803D] dark:border-[#22C55E]/30 dark:bg-[#14532D]/30 dark:text-[#86EFAC]'
              : 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]'
          }`}
        >
          <Check className="h-4 w-4" />
          <span>{isLearned ? 'Öğrenildi' : 'Öğrendim (+5 XP)'}</span>
        </button>
      </div>

      {/* Quick Word Index Strip */}
      <div className="border-t border-[#D9D9D3] pt-5 dark:border-[#282830]">
        <p className="mb-3 text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
          Ünitedeki Tüm Sözcükler ({topic.words.length})
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {topic.words.map((w, idx) => {
            const active = idx === index;
            const done = progress.studiedFlashcards.includes(w.id);
            const tok = ARTICLE_TOKENS[w.article];
            return (
              <button
                key={w.id}
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  stopGermanSpeech();
                  setSpeakingTarget(null);
                  setFlipped(false);
                  setIndex(idx);
                }}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? 'border-[#111113] bg-[#111113] text-[#F6F6F4] dark:border-[#D9A13B] dark:bg-[#1E1E24] dark:text-[#F4F4F5]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#E4E4E7] dark:hover:bg-[#1E1E24]'
                }`}
              >
                <span className="truncate">
                  <span className={active ? 'text-[#E5B34A] font-medium' : `${tok.textClass} font-medium`}>
                    {w.article}
                  </span>{' '}
                  {w.word}
                </span>
                {done && (
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      active ? 'text-[#86EFAC]' : 'text-[#15803D] dark:text-[#4ADE80]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
