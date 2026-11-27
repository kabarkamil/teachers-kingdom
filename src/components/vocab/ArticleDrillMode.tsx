import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { GermanArticle, UiLanguage, VocabTopic, VocabWord } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

const GENDER_LABELS: Record<GermanArticle, Record<UiLanguage, string>> = {
  der: { tr: 'Eril', en: 'Masculine' },
  die: { tr: 'Dişil', en: 'Feminine' },
  das: { tr: 'Nötr', en: 'Neuter' },
};

interface ArticleDrillModeProps {
  topic: VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

const ARTICLES: GermanArticle[] = ['der', 'die', 'das'];

function shuffleWords(words: VocabWord[]): VocabWord[] {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ArticleDrillMode: React.FC<ArticleDrillModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { speechSpeed, recordArticleAnswer } = useAppState();
  const { tx } = useI18n();
  const [deck, setDeck] = useState<VocabWord[]>(() => shuffleWords(topic.words));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<GermanArticle | null>(null);
  const [lastXpAwarded, setLastXpAwarded] = useState<number>(0);
  const [showContextHint, setShowContextHint] = useState(false);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setDeck(shuffleWords(topic.words));
    setCurrentIdx(0);
    setSelectedArticle(null);
    setLastXpAwarded(0);
    setShowContextHint(false);
    setRoundCorrect(0);
    setCompleted(false);
    stopGermanSpeech();
  }, [topic]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const currentWord = deck[currentIdx];

  const handleSelect = (choice: GermanArticle) => {
    if (selectedArticle !== null || !currentWord) return;
    setSelectedArticle(choice);
    const isCorrect = choice === currentWord.article;
    if (isCorrect) {
      setRoundCorrect((c) => c + 1);
    }
    const xpAwarded = recordArticleAnswer(
      currentWord.id,
      topic.id,
      `${currentWord.article} ${currentWord.word}`,
      isCorrect
    );
    setLastXpAwarded(xpAwarded);
  };

  const handleNext = () => {
    stopGermanSpeech();
    if (currentIdx + 1 >= deck.length) {
      setCompleted(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedArticle(null);
      setLastXpAwarded(0);
      setShowContextHint(false);
    }
  };

  const handleRestart = () => {
    stopGermanSpeech();
    setDeck(shuffleWords(topic.words));
    setCurrentIdx(0);
    setSelectedArticle(null);
    setLastXpAwarded(0);
    setShowContextHint(false);
    setRoundCorrect(0);
    setCompleted(false);
  };

  const handleListen = () => {
    if (!currentWord) return;
    const res = speakGermanText(`${currentWord.article} ${currentWord.word}`, speechSpeed, {
      onError: onSpeechError,
    });
    if (!res.queued) onSpeechError();
  };

  if (completed) {
    const accuracy = Math.round((roundCorrect / deck.length) * 100);
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-8 text-center dark:border-[#282830] dark:bg-[#16161A]">
        <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
          {tx(
            {
              tr: 'Artikel Alıştırması Tamamlandı · {{topic}}',
              en: 'Article Drill Completed · {{topic}}',
            },
            { topic: topic.titleTr }
          )}
        </p>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
          {tx(
            {
              tr: '{{correct}} / {{total}} Doğru Artikel',
              en: '{{correct}} / {{total}} Correct Articles',
            },
            { correct: roundCorrect, total: deck.length }
          )}
        </h3>
        <p className="mt-2 text-sm text-[#52525B] dark:text-[#A1A1AA]">
          {tx({
            tr: 'Bu turdaki doğruluk oranınız:',
            en: 'Your accuracy in this round:',
          })}{' '}
          <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            {tx({ tr: '%{{n}}', en: '{{n}}%' }, { n: accuracy })}
          </span>
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{tx({ tr: 'Karıştır ve Tekrar Çalış', en: 'Shuffle & Practice Again' })}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) return null;

  const isCorrectSelection = selectedArticle === currentWord.article;
  const correctToken = ARTICLE_TOKENS[currentWord.article];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress bar & counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <span>
            {tx(
              { tr: '{{topic}} · Artikel Seçme', en: '{{topic}} · Article Drill' },
              { topic: topic.titleTr }
            )}
          </span>
          <span className="font-mono tabular-nums">
            {tx(
              {
                tr: 'Soru {{current}} / {{total}} · Doğru: {{correct}}',
                en: 'Question {{current}} / {{total}} · Correct: {{correct}}',
              },
              { current: currentIdx + 1, total: deck.length, correct: roundCorrect }
            )}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
          <div
            className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
            style={{ width: `${((currentIdx + (selectedArticle ? 1 : 0)) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Prompt Card */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="text-center">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Bu isim hangi artikeli alır?',
              en: 'Which article does this noun take?',
            })}
          </p>
          <p className="mt-4 font-display text-3xl sm:text-4xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            <span
              className={
                selectedArticle
                  ? `${correctToken.textClass} underline underline-offset-4`
                  : 'text-[#A1A1AA] dark:text-[#52525B]'
              }
            >
              {selectedArticle ? currentWord.article : '___'}
            </span>{' '}
            <span>{currentWord.word}</span>
          </p>
          <p className="mt-2.5 text-base font-medium text-[#52525B] dark:text-[#A1A1AA]">
            {currentWord.turkish}
          </p>

          {!selectedArticle && (
            <div className="mt-4">
              {showContextHint ? (
                <p className="text-xs italic text-[#52525B] dark:text-[#A1A1AA]">
                  {tx(
                    { tr: 'Bağlam: “{{cloze}}”', en: 'Context: “{{cloze}}”' },
                    { cloze: currentWord.contextClozeDe }
                  )}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowContextHint(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>
                    {tx({
                      tr: 'Örnek cümle ipucu göster',
                      en: 'Show example sentence hint',
                    })}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* der / die / das Selection Buttons */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {ARTICLES.map((art) => {
            const tok = ARTICLE_TOKENS[art];
            const isPicked = selectedArticle === art;
            const isRightAnswer = currentWord.article === art;

            let buttonStyle =
              'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';

            if (selectedArticle !== null) {
              if (isRightAnswer) {
                buttonStyle = tok.buttonActiveClass;
              } else if (isPicked && !isRightAnswer) {
                buttonStyle =
                  'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#450A0A]/50 dark:text-[#FCA5A5]';
              } else {
                buttonStyle =
                  'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#A1A1AA] dark:border-[#24242C] dark:bg-[#111113]/40 dark:text-[#52525B]';
              }
            }

            return (
              <button
                key={art}
                type="button"
                disabled={selectedArticle !== null}
                onClick={() => handleSelect(art)}
                className={`flex flex-col items-center justify-center rounded-xl border px-3 py-4 transition-colors ${buttonStyle}`}
              >
                <span className="font-display text-xl sm:text-2xl font-semibold">{art}</span>
                <span className="mt-0.5 text-xs opacity-85">{tx(GENDER_LABELS[art])}</span>
              </button>
            );
          })}
        </div>

        {/* Immediate Pedagogical Explanation */}
        {selectedArticle !== null && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 dark:border-[#282830] dark:bg-[#111113]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isCorrectSelection ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                    <span className="text-sm font-semibold text-[#15803D] dark:text-[#4ADE80]">
                      {lastXpAwarded > 0
                        ? tx(
                            { tr: 'Doğru! (+{{xp}} XP)', en: 'Correct! (+{{xp}} XP)' },
                            { xp: lastXpAwarded }
                          )
                        : tx({
                            tr: 'Doğru! (Tekrar — XP daha önce kazanıldı)',
                            en: 'Correct! (Repeat — XP already earned)',
                          })}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                    <span className="text-sm font-semibold text-[#B91C1C] dark:text-[#F87171]">
                      {tx(
                        {
                          tr: 'Doğru artikel: {{article}} {{word}}',
                          en: 'Correct article: {{article}} {{word}}',
                        },
                        { article: currentWord.article, word: currentWord.word }
                      )}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={!speechSupported}
                onClick={handleListen}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'Telaffuzu Dinle', en: 'Listen to Pronunciation' })}</span>
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#111113] dark:text-[#E4E4E7]">
              {currentWord.articleTipTr}
            </p>
            <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Örnek:', en: 'Example:' })}{' '}
              <strong className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                {currentWord.exampleDe}
              </strong>{' '}
              — {currentWord.exampleTr}
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <span>
                  {currentIdx + 1 >= deck.length
                    ? tx({ tr: 'Sonucu Gör', en: 'View Results' })
                    : tx({ tr: 'Sonraki Kelime', en: 'Next Word' })}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
