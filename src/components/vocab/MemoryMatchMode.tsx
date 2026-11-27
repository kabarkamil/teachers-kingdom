import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, Volume2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { VocabTopic, VocabWord } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface MemoryMatchModeProps {
  topic: VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

interface MemoryCard {
  uid: string;
  wordId: string;
  lang: 'de' | 'tr';
  text: string;
  article?: VocabWord['article'];
}

const PAIRS_PER_ROUND = 6;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createBoard(topic: VocabTopic): { cards: MemoryCard[]; chosenWords: VocabWord[] } {
  const chosenWords = shuffle(topic.words).slice(0, PAIRS_PER_ROUND);
  const cards: MemoryCard[] = shuffle(
    chosenWords.flatMap((w): MemoryCard[] => [
      {
        uid: `${w.id}-de`,
        wordId: w.id,
        lang: 'de',
        text: `${w.article} ${w.word}`,
        article: w.article,
      },
      {
        uid: `${w.id}-tr`,
        wordId: w.id,
        lang: 'tr',
        text: w.turkish,
      },
    ])
  );
  return { cards, chosenWords };
}

export const MemoryMatchMode: React.FC<MemoryMatchModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { speechSpeed, recordMemoryRoundComplete } = useAppState();
  const { isEn, tx } = useI18n();
  const [board, setBoard] = useState(() => createBoard(topic));
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedWordIds, setMatchedWordIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const roundRecordedRef = useRef(false);
  const pendingTimerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
  }, []);

  const resetBoard = useCallback(() => {
    clearPendingTimer();
    stopGermanSpeech();
    setBoard(createBoard(topic));
    setFlippedUids([]);
    setMatchedWordIds([]);
    setMoves(0);
    setLocked(false);
    roundRecordedRef.current = false;
  }, [topic, clearPendingTimer]);

  useEffect(() => {
    resetBoard();
  }, [resetBoard]);

  useEffect(() => {
    return () => {
      clearPendingTimer();
      stopGermanSpeech();
    };
  }, [clearPendingTimer]);

  const isBoardComplete = matchedWordIds.length === board.chosenWords.length;

  useEffect(() => {
    if (isBoardComplete && !roundRecordedRef.current && moves > 0) {
      roundRecordedRef.current = true;
      recordMemoryRoundComplete(topic.id, topic.titleTr, board.chosenWords.length, moves);
    }
  }, [
    isBoardComplete,
    moves,
    recordMemoryRoundComplete,
    topic.id,
    topic.titleTr,
    board.chosenWords.length,
  ]);

  const handleCardClick = (card: MemoryCard) => {
    if (locked) return;
    if (matchedWordIds.includes(card.wordId)) return;
    if (flippedUids.includes(card.uid)) return;

    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const first = board.cards.find((c) => c.uid === nextFlipped[0]);
      const second = board.cards.find((c) => c.uid === nextFlipped[1]);

      clearPendingTimer();
      if (first && second && first.wordId === second.wordId && first.lang !== second.lang) {
        pendingTimerRef.current = window.setTimeout(() => {
          pendingTimerRef.current = null;
          setMatchedWordIds((prev) =>
            prev.includes(first.wordId) ? prev : [...prev, first.wordId]
          );
          setFlippedUids([]);
          setLocked(false);
        }, 320);
      } else {
        pendingTimerRef.current = window.setTimeout(() => {
          pendingTimerRef.current = null;
          setFlippedUids([]);
          setLocked(false);
        }, 780);
      }
    }
  };

  const handleListenWord = (word: VocabWord) => {
    const res = speakGermanText(`${word.article} ${word.word}`, speechSpeed, {
      onError: onSpeechError,
    });
    if (!res.queued) onSpeechError();
  };

  return (
    <div className="space-y-6">
      {/* Top Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">
            {topic.titleTr}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {tx(
              { tr: 'Eşleşme: {{matched}} / {{total}}', en: 'Matches: {{matched}} / {{total}}' },
              { matched: matchedWordIds.length, total: board.chosenWords.length }
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {tx({ tr: 'Hamle: {{moves}}', en: 'Moves: {{moves}}' }, { moves })}
          </span>
        </div>

        <button
          type="button"
          onClick={resetBoard}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{tx({ tr: 'Yeni Kart Dağıt', en: 'Deal New Cards' })}</span>
        </button>
      </div>

      {/* Completion Banner */}
      {isBoardComplete && (
        <div className="rounded-xl border border-[#9A6B16]/40 bg-[#FEF9EB] p-5 dark:border-[#D9A13B]/45 dark:bg-[#231D11]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'Tebrikler! Tüm Almanca–Türkçe çiftleri eşleştirdiniz (+25 XP)',
                  en: 'Congratulations! You matched all German–Turkish pairs (+25 XP)',
                })}
              </p>
              <p className="mt-1 text-xs text-[#52525B] dark:text-[#D4D4D8]">
                {isEn ? (
                  <>
                    Completed {board.chosenWords.length} pairs in{' '}
                    <span className="font-mono font-semibold tabular-nums">{moves}</span> moves.
                  </>
                ) : (
                  <>
                    Toplam <span className="font-mono font-semibold tabular-nums">{moves}</span>{' '}
                    hamlede {board.chosenWords.length} çift tamamlandı.
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={resetBoard}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'Yeni Tur Oyna', en: 'Play New Round' })}</span>
            </button>
          </div>
        </div>
      )}

      {/* 12-Card Matching Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {board.cards.map((card) => {
          const isMatched = matchedWordIds.includes(card.wordId);
          const isRevealed = isMatched || flippedUids.includes(card.uid);
          const articleTok = card.article ? ARTICLE_TOKENS[card.article] : null;

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              aria-pressed={isRevealed}
              className={`group relative flex min-h-[104px] sm:min-h-[116px] flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all duration-150 ${
                isMatched
                  ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E]/35 dark:bg-[#14532D]/25 dark:text-[#BBF7D0]'
                  : isRevealed
                  ? 'border-[#7C1D2E] bg-[#FFFFFF] text-[#111113] shadow-sm dark:border-[#D9A13B] dark:bg-[#1E1E24] dark:text-[#F4F4F5]'
                  : 'border-[#D9D9D3] bg-[#111113] text-[#F6F6F4] hover:border-[#9A6B16] hover:bg-[#1C1C21] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#E4E4E7] dark:hover:border-[#D9A13B]'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-[11px] font-medium opacity-70">
                    {card.lang === 'de'
                      ? tx({ tr: 'Almanca', en: 'German' })
                      : tx({ tr: 'Türkçe', en: 'Turkish' })}
                  </span>
                  <span className="mt-1.5 text-sm sm:text-base font-semibold leading-snug">
                    {card.lang === 'de' && card.article && articleTok ? (
                      <>
                        <span className={isMatched ? '' : articleTok.textClass}>
                          {card.article}
                        </span>{' '}
                        {card.text.slice(card.article.length + 1)}
                      </>
                    ) : (
                      card.text
                    )}
                  </span>
                  {isMatched && (
                    <Check className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display text-base font-semibold text-[#D9A13B]">TK</span>
                  <span className="text-[11px] text-[#A1A1AA]">
                    {tx({ tr: 'Kartı Aç', en: 'Flip Card' })}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Review matched pairs with pronunciation */}
      {matchedWordIds.length > 0 && (
        <div className="border-t border-[#D9D9D3] pt-5 dark:border-[#282830]">
          <p className="mb-3 text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
            {tx(
              { tr: 'Eşleştirilen Çiftler ({{count}})', en: 'Matched Pairs ({{count}})' },
              { count: matchedWordIds.length }
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {board.chosenWords
              .filter((w) => matchedWordIds.includes(w.id))
              .map((w) => {
                const tok = ARTICLE_TOKENS[w.article];
                return (
                  <div
                    key={w.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-xs dark:border-[#282830] dark:bg-[#16161A]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111113] dark:text-[#F4F4F5] truncate">
                        <span className={tok.textClass}>{w.article}</span> {w.word}
                      </p>
                      <p className="text-[#52525B] dark:text-[#A1A1AA] truncate">{w.turkish}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!speechSupported}
                      onClick={() => handleListenWord(w)}
                      aria-label={tx(
                        {
                          tr: '{{article}} {{word}} dinle',
                          en: 'Listen to {{article}} {{word}}',
                        },
                        { article: w.article, word: w.word }
                      )}
                      className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-md border border-[#D9D9D3] text-[#52525B] hover:bg-[#ECECE8] hover:text-[#111113] disabled:opacity-45 dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] shrink-0"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
