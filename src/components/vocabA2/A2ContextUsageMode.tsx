import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { A2VocabTopic } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface A2ContextUsageModeProps {
  topic: A2VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

function getOrderedOptions(wordId: string, options: [string, string, string, string]): string[] {
  const shift = wordId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 4;
  return options.map((_, i) => options[(i + shift) % 4]);
}

export const A2ContextUsageMode: React.FC<A2ContextUsageModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { a2Progress, speechSpeed, recordA2ContextAnswer } = useAppState();
  const { tx } = useI18n();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastXp, setLastXp] = useState(0);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setLastXp(0);
    stopGermanSpeech();
  }, [topic.id]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const currentWord = topic.words[index] ?? topic.words[0];
  const options = useMemo(
    () => getOrderedOptions(currentWord.id, currentWord.contextOptions),
    [currentWord]
  );

  const isAnswered = selected !== null;
  const isCorrect = selected === currentWord.contextAnswerDe;
  const isMastered = a2Progress.contextMasteredIds.includes(currentWord.id);
  const masteredInTopic = topic.words.filter((w) =>
    a2Progress.contextMasteredIds.includes(w.id)
  ).length;

  const parts = currentWord.contextClozeDe.split('___');

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
    const correct = opt === currentWord.contextAnswerDe;
    const xp = recordA2ContextAnswer(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word} (bağlam)`,
      correct
    );
    setLastXp(xp);
  };

  const handleNext = () => {
    stopGermanSpeech();
    setSelected(null);
    setLastXp(0);
    setIndex((prev) => (prev + 1) % topic.words.length);
  };

  const handleSpeakSentence = () => {
    const res = speakGermanText(currentWord.exampleDe, speechSpeed, {
      onError: () => onSpeechError(),
    });
    if (!res.queued) {
      onSpeechError();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2 text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">{topic.titleTr}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {tx(
              { tr: 'Cümle {{current}} / {{total}}', en: 'Sentence {{current}} / {{total}}' },
              { current: index + 1, total: topic.words.length }
            )}
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
          {tx(
            {
              tr: 'Ustalaşılan: {{mastered}} / {{total}}',
              en: 'Mastered: {{mastered}} / {{total}}',
            },
            { mastered: masteredInTopic, total: topic.words.length }
          )}
        </span>
      </div>

      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
            {tx({
              tr: 'Cümle İçi Kullanım · A2 Bağlam Tamamlama',
              en: 'Context Usage · A2 Sentence Completion',
            })}
          </p>
          {isMastered && (
            <span className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
              {tx({ tr: 'Ustalaşıldı', en: 'Mastered' })}
            </span>
          )}
        </div>

        {/* Cloze Sentence Box */}
        <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-5 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
          <p className="font-display text-lg sm:text-xl font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
            {parts[0]}
            <span
              className={`mx-1 inline-block rounded-md border px-2.5 py-0.5 font-mono text-base font-semibold ${
                isAnswered
                  ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#4ADE80]'
                  : 'border-[#7C1D2E]/40 bg-[#FFFFFF] text-[#7C1D2E] dark:border-[#D9A13B]/50 dark:bg-[#16161A] dark:text-[#D9A13B]'
              }`}
            >
              {isAnswered ? currentWord.contextAnswerDe : '______'}
            </span>
            {parts[1] ?? ''}
          </p>
          <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Anlam ipucu:', en: 'Meaning hint:' })} {currentWord.exampleTr}
          </p>
        </div>

        {/* 4 Curated A2 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelectedOpt = selected === opt;
            const isRightOpt = opt === currentWord.contextAnswerDe;
            let cls =
              'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]';
            if (isAnswered) {
              if (isRightOpt) {
                cls =
                  'border-[#15803D] bg-[#F0FDF4] text-[#15803D] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#4ADE80]';
              } else if (isSelectedOpt) {
                cls =
                  'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#2A1013] dark:text-[#FCA5A5]';
              } else {
                cls =
                  'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/50 dark:text-[#71717A]';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelect(opt)}
                className={`min-h-[48px] rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl border p-4 space-y-3 ${
              isCorrect
                ? 'border-[#15803D]/35 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#0D2315]'
                : 'border-[#B91C1C]/35 bg-[#FEF2F2] dark:border-[#EF4444]/35 dark:bg-[#2A1013]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 text-[#991B1B] dark:text-[#FCA5A5] shrink-0" />
              )}
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {isCorrect
                    ? lastXp > 0
                      ? tx(
                          {
                            tr: 'Harika! Doğru A2 bağlam seçimi (+{{xp}} XP).',
                            en: 'Great! Correct A2 context choice (+{{xp}} XP).',
                          },
                          { xp: lastXp }
                        )
                      : tx({
                          tr: 'Doğru! Bu bağlam cümlesi zaten ustalaşıldı.',
                          en: 'Correct! This context sentence is already mastered.',
                        })
                    : tx(
                        {
                          tr: 'Doğru sözcük: "{{article}} {{word}}" ({{meaning}})',
                          en: 'Correct word: "{{article}} {{word}}" ({{meaning}})',
                        },
                        {
                          article: currentWord.article,
                          word: currentWord.word,
                          meaning: currentWord.turkish,
                        }
                      )}
                </p>
                <p className="leading-relaxed text-[#52525B] dark:text-[#D4D4D8]">
                  {currentWord.contextNoteTr}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={!speechSupported}
                onClick={handleSpeakSentence}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'Tam Cümleyi Dinle (de-DE)',
                    en: 'Listen to Full Sentence (de-DE)',
                  })}
                </span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-semibold text-white hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                <span>{tx({ tr: 'Sonraki Cümle', en: 'Next Sentence' })}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
