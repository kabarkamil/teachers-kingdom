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
import type { A2VocabTopic } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface A2FlashcardsModeProps {
  topic: A2VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

export const A2FlashcardsMode: React.FC<A2FlashcardsModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { a2Progress, speechSpeed, recordA2FlashcardStudied } = useAppState();
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
  const isLearned = a2Progress.studiedFlashcards.includes(currentWord.id);
  const learnedInTopic = topic.words.filter((w) =>
    a2Progress.studiedFlashcards.includes(w.id)
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
    recordA2FlashcardStudied(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word} (${currentWord.plural})`
    );
  };

  return (
    <div className="space-y-6">
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
              : 'Türkçe anlamı ve A2 örnek cümleyi görmek için kartı çevirin'
          }
          className={`tk-preserve-3d relative min-h-[350px] sm:min-h-[370px] w-full cursor-pointer select-none ${
            flipped ? 'tk-rotate-y-180' : ''
          }`}
        >
          {/* FRONT FACE */}
          <div className="tk-backface-hidden absolute inset-0 flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className={`font-mono font-semibold ${articleToken.textClass}`}>
                {articleToken.article} · {articleToken.genderLabelTr} ({articleToken.genderLabelDe})
              </span>
              <span className="font-mono text-[#71717A] dark:text-[#8E8E98]">
                CEFR A2 · Ön Yüz
              </span>
            </div>

            <div className="my-auto py-4 text-center space-y-3">
              <p className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
                <span className={`mr-2 font-mono font-semibold ${articleToken.textClass}`}>
                  {currentWord.article}
                </span>
                <span>{currentWord.word}</span>
              </p>

              <p className="font-mono text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA]">
                Çoğul (Plural):{' '}
                <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {currentWord.plural}
                </strong>
              </p>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  disabled={!speechSupported}
                  onClick={(e) =>
                    handleSpeak(`${currentWord.article} ${currentWord.word}. ${currentWord.plural}.`, 'word', e)
                  }
                  aria-label={`${currentWord.article} ${currentWord.word} kelimesini dinle`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-xs font-semibold text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                >
                  <Volume2
                    className={`h-4 w-4 ${
                      speakingTarget === 'word'
                        ? 'text-[#7C1D2E] dark:text-[#D9A13B]'
                        : 'text-[#52525B] dark:text-[#A1A1AA]'
                    }`}
                  />
                  <span>
                    {speakingTarget === 'word' ? 'Okunuyor…' : 'Tekil & Çoğul Dinle (de-DE)'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#ECECE8] pt-4 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
              <span>Anlam ve A2 bağlam cümlesi için kartı çevirin</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Çevir</span>
              </span>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="tk-backface-hidden tk-rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-xl border border-[#7C1D2E]/40 bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#D9A13B]/45 dark:bg-[#16161A]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5]">
                <span className={articleToken.textClass}>{currentWord.article}</span> {currentWord.word} ·{' '}
                {currentWord.plural}
              </span>
              <span className="font-mono text-[#7C1D2E] dark:text-[#D9A13B]">Türkçe &amp; Bağlam</span>
            </div>

            <div className="my-auto space-y-4 py-2">
              <div>
                <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">Türkçe Karşılığı</p>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {currentWord.turkish}
                </p>
              </div>

              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-2 dark:border-[#24242C] dark:bg-[#111113]">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                    {currentWord.exampleDe}
                  </p>
                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={(e) => handleSpeak(currentWord.exampleDe, 'sentence', e)}
                    aria-label="Örnek A2 cümleyi dinle"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#7C1D2E] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#D9A13B] dark:hover:bg-[#1E1E24]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {currentWord.exampleTr}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  Artikel &amp; Çoğul İpucu:{' '}
                </strong>
                {currentWord.articlePluralTipTr}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#ECECE8] pt-3.5 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
              <span>Ön yüze dönmek için karta tıklayın</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
                <RotateCw className="h-3.5 w-3.5" />
                <span>Ön Yüz</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Single-Grant Mastery Controls */}
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Önceki</span>
        </button>

        <button
          type="button"
          onClick={handleMarkLearned}
          disabled={isLearned}
          className={`inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ${
            isLearned
              ? 'border border-[#15803D]/35 bg-[#F0FDF4] text-[#15803D] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#4ADE80]'
              : 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]'
          }`}
        >
          <Check className="h-4 w-4" />
          <span>{isLearned ? 'Öğrenildi (+5 XP Alındı)' : 'Kartı Öğrendim (+5 XP)'}</span>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
        >
          <span>Sonraki</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
