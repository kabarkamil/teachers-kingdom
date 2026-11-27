import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ALL_A2_WORDS } from '../../data/germanA2Vocab';
import { useI18n } from '../../hooks/useI18n';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { A2VocabTopic } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface A2MeaningMatchModeProps {
  topic: A2VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

function buildMeaningOptions(wordId: string, correctTr: string): string[] {
  const pool = ALL_A2_WORDS.filter((w) => w.id !== wordId && w.turkish !== correctTr);
  const seed = wordId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 7, 0);
  const picks: string[] = [];
  let cursor = seed % pool.length;
  while (picks.length < 3 && pool.length > 0) {
    const candidate = pool[cursor % pool.length].turkish;
    if (!picks.includes(candidate)) {
      picks.push(candidate);
    }
    cursor += 5;
  }
  const combined = [correctTr, ...picks];
  const shift = seed % combined.length;
  return combined.map((_, idx) => combined[(idx + shift) % combined.length]);
}

export const A2MeaningMatchMode: React.FC<A2MeaningMatchModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { a2Progress, speechSpeed, recordA2MeaningAnswer } = useAppState();
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
    () => buildMeaningOptions(currentWord.id, currentWord.turkish),
    [currentWord]
  );

  const isAnswered = selected !== null;
  const isCorrect = selected === currentWord.turkish;
  const isMastered = a2Progress.meaningMasteredIds.includes(currentWord.id);
  const masteredInTopic = topic.words.filter((w) =>
    a2Progress.meaningMasteredIds.includes(w.id)
  ).length;
  const articleToken = ARTICLE_TOKENS[currentWord.article];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    const correct = option === currentWord.turkish;
    const xp = recordA2MeaningAnswer(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word} → ${currentWord.turkish}`,
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

  const handleSpeak = (text: string) => {
    const res = speakGermanText(text, speechSpeed, {
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
              { tr: 'Soru {{current}} / {{total}}', en: 'Question {{current}} / {{total}}' },
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              {tx({
                tr: 'Anlam Eşleştirme · Almanca → Türkçe',
                en: 'Meaning Match · German → Turkish',
              })}
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              <span className={`mr-2 font-mono ${articleToken.textClass}`}>{currentWord.article}</span>
              <span>{currentWord.word}</span>
            </h3>
            <p className="mt-1 font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
              Plural: {currentWord.plural}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isMastered && (
              <span className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
                {tx({ tr: 'Ustalaşıldı', en: 'Mastered' })}
              </span>
            )}
            <button
              type="button"
              disabled={!speechSupported}
              onClick={() => handleSpeak(`${currentWord.article} ${currentWord.word}`)}
              aria-label={tx(
                {
                  tr: '{{article}} {{word}} kelimesini dinle',
                  en: 'Listen to {{article}} {{word}}',
                },
                { article: currentWord.article, word: currentWord.word }
              )}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] text-[#7C1D2E] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#D9A13B]"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelectedOpt = selected === opt;
            const isRightOpt = opt === currentWord.turkish;
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
                className={`min-h-[48px] rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${cls}`}
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
                            tr: 'Doğru eşleştirme (+{{xp}} XP)!',
                            en: 'Correct match (+{{xp}} XP)!',
                          },
                          { xp: lastXp }
                        )
                      : tx({
                          tr: 'Doğru eşleştirme (bu sözcük zaten ustalaşıldı).',
                          en: 'Correct match (this word is already mastered).',
                        })
                    : tx(
                        {
                          tr: 'Doğru karşılık: "{{meaning}}"',
                          en: 'Correct meaning: "{{meaning}}"',
                        },
                        { meaning: currentWord.turkish }
                      )}
                </p>
                <p className="text-[#111113] dark:text-[#F4F4F5]">{currentWord.exampleDe}</p>
                <p className="text-[#52525B] dark:text-[#D4D4D8]">{currentWord.exampleTr}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={!speechSupported}
                onClick={() => handleSpeak(currentWord.exampleDe)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
              >
                <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>{tx({ tr: 'Örnek Cümleyi Dinle', en: 'Listen to Example Sentence' })}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-semibold text-white hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                <span>{tx({ tr: 'Sonraki Kelime', en: 'Next Word' })}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
