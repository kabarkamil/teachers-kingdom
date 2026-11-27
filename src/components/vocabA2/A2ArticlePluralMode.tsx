import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { A2VocabTopic, GermanArticle } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface A2ArticlePluralModeProps {
  topic: A2VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

const ARTICLES: GermanArticle[] = ['der', 'die', 'das'];

function getDeterministicPluralOptions(wordId: string, correctPlural: string, distractors: [string, string]): string[] {
  const hash = wordId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const items = [correctPlural, distractors[0], distractors[1]];
  const offset = hash % 3;
  return [items[offset], items[(offset + 1) % 3], items[(offset + 2) % 3]];
}

export const A2ArticlePluralMode: React.FC<A2ArticlePluralModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { a2Progress, speechSpeed, recordA2ArticlePluralAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [index, setIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<GermanArticle | null>(null);
  const [selectedPlural, setSelectedPlural] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [lastXpEarned, setLastXpEarned] = useState(0);

  useEffect(() => {
    setIndex(0);
    setSelectedArticle(null);
    setSelectedPlural(null);
    setChecked(false);
    setLastXpEarned(0);
    stopGermanSpeech();
  }, [topic.id]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const currentWord = topic.words[index] ?? topic.words[0];
  const pluralOptions = useMemo(
    () =>
      getDeterministicPluralOptions(
        currentWord.id,
        currentWord.plural,
        currentWord.pluralDistractors
      ),
    [currentWord]
  );

  const isMastered = a2Progress.articlePluralMasteredIds.includes(currentWord.id);
  const masteredInTopic = topic.words.filter((w) =>
    a2Progress.articlePluralMasteredIds.includes(w.id)
  ).length;

  const isArticleCorrect = selectedArticle === currentWord.article;
  const isPluralCorrect = selectedPlural === currentWord.plural;
  const isBothCorrect = isArticleCorrect && isPluralCorrect;

  const handleCheck = () => {
    if (!selectedArticle || !selectedPlural || checked) return;
    const correct = selectedArticle === currentWord.article && selectedPlural === currentWord.plural;
    const xp = recordA2ArticlePluralAnswer(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word} / ${currentWord.plural}`,
      correct
    );
    setLastXpEarned(xp);
    setChecked(true);
  };

  const handleNext = () => {
    stopGermanSpeech();
    setSelectedArticle(null);
    setSelectedPlural(null);
    setChecked(false);
    setLastXpEarned(0);
    setIndex((prev) => (prev + 1) % topic.words.length);
  };

  const handleRetryCurrent = () => {
    setSelectedArticle(null);
    setSelectedPlural(null);
    setChecked(false);
    setLastXpEarned(0);
  };

  const handleSpeakAnswer = () => {
    const res = speakGermanText(
      `${currentWord.article} ${currentWord.word}. Plural: ${currentWord.plural}.`,
      speechSpeed,
      {
        onError: () => onSpeechError(),
      }
    );
    if (!res.queued) {
      onSpeechError();
    }
  };

  const correctToken = ARTICLE_TOKENS[currentWord.article];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header Progress Row */}
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

      {/* Main Challenge Card */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              {tx({
                tr: 'Artikel & Çoğul Avı · İki Aşamalı Hatırlama',
                en: 'Article & Plural Drill · Two-Step Recall',
              })}
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {checked ? (
                <>
                  <span className={`mr-2 font-mono ${correctToken.textClass}`}>
                    {currentWord.article}
                  </span>
                  <span>{currentWord.word}</span>
                </>
              ) : (
                <span>___ {currentWord.word}</span>
              )}
            </h3>
            <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Türkçe anlamı:', en: 'Turkish meaning:' })}{' '}
              <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {currentWord.turkish}
              </strong>
            </p>
          </div>

          {isMastered && (
            <span className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] shrink-0">
              {tx({ tr: 'Ustalaşıldı', en: 'Mastered' })}
            </span>
          )}
        </div>

        {/* Step 1: Article Selection */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '1. Doğru artikeli seçin (der / die / das):',
              en: '1. Select the correct article (der / die / das):',
            })}
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {ARTICLES.map((art) => {
              const isSelected = selectedArticle === art;
              const isTarget = art === currentWord.article;
              let btnStyle =
                'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]';
              if (checked) {
                if (isTarget) {
                  btnStyle =
                    'border-[#15803D] bg-[#F0FDF4] text-[#15803D] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#4ADE80]';
                } else if (isSelected && !isTarget) {
                  btnStyle =
                    'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#2A1013] dark:text-[#FCA5A5]';
                }
              } else if (isSelected) {
                btnStyle =
                  'border-[#7C1D2E] bg-[#111113] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]';
              }

              return (
                <button
                  key={art}
                  type="button"
                  disabled={checked}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedArticle(art)}
                  className={`min-h-[44px] rounded-lg border font-mono text-sm font-semibold transition-colors ${btnStyle}`}
                >
                  {art}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Plural Selection */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '2. Doğru çoğul biçimini (Plural) seçin:',
              en: '2. Select the correct plural form (Plural):',
            })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {pluralOptions.map((opt) => {
              const isSelected = selectedPlural === opt;
              const isTarget = opt === currentWord.plural;
              let btnStyle =
                'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]';
              if (checked) {
                if (isTarget) {
                  btnStyle =
                    'border-[#15803D] bg-[#F0FDF4] text-[#15803D] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#4ADE80]';
                } else if (isSelected && !isTarget) {
                  btnStyle =
                    'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#2A1013] dark:text-[#FCA5A5]';
                }
              } else if (isSelected) {
                btnStyle =
                  'border-[#7C1D2E] bg-[#111113] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={checked}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedPlural(opt)}
                  className={`min-h-[44px] rounded-lg border px-3 text-sm font-medium transition-colors ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluate or Feedback */}
        {!checked ? (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={!selectedArticle || !selectedPlural}
              onClick={handleCheck}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <span>{locale.common.check}</span>
            </button>
          </div>
        ) : (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl border p-4 space-y-3 ${
              isBothCorrect
                ? 'border-[#15803D]/35 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#0D2315]'
                : 'border-[#B91C1C]/35 bg-[#FEF2F2] dark:border-[#EF4444]/35 dark:bg-[#2A1013]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {isBothCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 text-[#991B1B] dark:text-[#FCA5A5] shrink-0" />
                )}
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {isBothCorrect
                      ? lastXpEarned > 0
                        ? tx(
                            {
                              tr: 'Tebrikler! Artikel ve çoğul doğru (+{{xp}} XP).',
                              en: 'Well done! Both article and plural are correct (+{{xp}} XP).',
                            },
                            { xp: lastXpEarned }
                          )
                        : tx({
                            tr: 'Doğru! Bu kelime daha önce ustalaşıldı (çift XP eklenmez).',
                            en: 'Correct! This word was already mastered (no duplicate XP).',
                          })
                      : !isArticleCorrect && !isPluralCorrect
                      ? tx(
                          {
                            tr: 'Hem artikel hem çoğul farklı: {{article}} {{word}} / {{plural}}',
                            en: 'Both article and plural differ: {{article}} {{word}} / {{plural}}',
                          },
                          {
                            article: currentWord.article,
                            word: currentWord.word,
                            plural: currentWord.plural,
                          }
                        )
                      : !isArticleCorrect
                      ? tx(
                          {
                            tr: 'Çoğul doğru, ancak doğru artikel "{{article}}": {{article}} {{word}}',
                            en: 'Plural is correct, but the correct article is "{{article}}": {{article}} {{word}}',
                          },
                          { article: currentWord.article, word: currentWord.word }
                        )
                      : tx(
                          {
                            tr: 'Artikel doğru, ancak doğru çoğul biçimi "{{plural}}".',
                            en: 'Article is correct, but the correct plural form is "{{plural}}".',
                          },
                          { plural: currentWord.plural }
                        )}
                  </p>
                  <p className="leading-relaxed text-[#52525B] dark:text-[#D4D4D8]">
                    {currentWord.articlePluralTipTr}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={!speechSupported}
                onClick={handleSpeakAnswer}
                aria-label={tx({
                  tr: 'Doğru tekil ve çoğul biçimi dinle',
                  en: 'Listen to the correct singular and plural forms',
                })}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#7C1D2E] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#D9A13B]"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              {!isBothCorrect && (
                <button
                  type="button"
                  onClick={handleRetryCurrent}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-semibold text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{locale.common.retry}</span>
                </button>
              )}
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
