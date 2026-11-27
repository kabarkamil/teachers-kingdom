import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ALL_A1_WORDS } from '../../data/germanA1Vocab';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import type { VocabTopic, VocabWord } from '../../types';
import { speakGermanText, stopGermanSpeech } from '../../utils/speech';

interface MeaningQuizModeProps {
  topic: VocabTopic;
  speechSupported: boolean;
  onSpeechError: () => void;
}

interface QuizQuestion {
  word: VocabWord;
  type: 'meaning' | 'context';
  expectedBlankForm: string;
  dictionaryNoun: string;
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
}

const LEADING_ARTICLE_REGEX = /^(der|die|das)\s+/i;

/**
 * Defensively strips leading German definite articles ("der", "die", "das") so
 * sentence completion choices never duplicate determiners or leak grammatical gender clues.
 */
function stripLeadingGermanArticle(text: string): string {
  return text.trim().replace(LEADING_ARTICLE_REGEX, '').trim();
}

/**
 * Resolves the verified form of a candidate noun for a sentence-completion blank:
 * - For the target word, uses its verified `contextAnswerDe` (guaranteed to match `exampleDe`).
 * - For distractors, uses verified `obliqueFormDe` (e.g. weak masculine `Name -> Namen`)
 *   when the blank's verified `contextCase` is accusative/dative, avoiding fragile regex guesses.
 */
function resolveContextOptionForm(candidate: VocabWord, targetWord: VocabWord): string {
  if (candidate.id === targetWord.id) {
    return stripLeadingGermanArticle(targetWord.contextAnswerDe);
  }
  if (targetWord.contextCase !== 'nom' && candidate.obliqueFormDe) {
    return stripLeadingGermanArticle(candidate.obliqueFormDe);
  }
  return stripLeadingGermanArticle(candidate.word);
}

function shuffle<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Selects distractors for a question:
 * - For 'context' (Cümleyi Tamamla), strictly uses nouns from the same grammatical gender
 *   (`candidate.article === word.article`) — same topic first, then other A1 topics — so
 *   no mismatched-gender fallback ever leaks grammatical clues.
 * - For 'meaning' (Doğru Anlamı Bul), prioritizes same-topic Turkish meanings.
 */
function pickDistractors(
  word: VocabWord,
  topic: VocabTopic,
  type: 'meaning' | 'context'
): VocabWord[] {
  if (type === 'context') {
    const sameTopicSameGender = shuffle(
      topic.words.filter((w) => w.id !== word.id && w.article === word.article)
    );
    const otherTopicSameGender = shuffle(
      ALL_A1_WORDS.filter(
        (w) => w.id !== word.id && w.topicId !== topic.id && w.article === word.article
      )
    );
    return [...sameTopicSameGender, ...otherTopicSameGender].slice(0, 3);
  }

  const sameTopicOthers = shuffle(topic.words.filter((w) => w.id !== word.id));
  const fallbackOthers = shuffle(
    ALL_A1_WORDS.filter((w) => w.id !== word.id && w.topicId !== topic.id)
  );
  return [...sameTopicOthers, ...fallbackOthers].slice(0, 3);
}

function buildQuestions(topic: VocabTopic): QuizQuestion[] {
  const ordered = shuffle(topic.words);
  return ordered.map((word, idx) => {
    const type: 'meaning' | 'context' = idx % 2 === 0 ? 'meaning' : 'context';
    const dictionaryNoun = stripLeadingGermanArticle(word.word);
    const expectedBlankForm =
      type === 'context'
        ? resolveContextOptionForm(word, word)
        : dictionaryNoun;
    const distractors = pickDistractors(word, topic, type);

    const options = shuffle([word, ...distractors]).map((candidate) => ({
      id: candidate.id,
      label:
        type === 'meaning'
          ? candidate.turkish
          : resolveContextOptionForm(candidate, word),
      isCorrect: candidate.id === word.id,
    }));

    return { word, type, expectedBlankForm, dictionaryNoun, options };
  });
}

export const MeaningQuizMode: React.FC<MeaningQuizModeProps> = ({
  topic,
  speechSupported,
  onSpeechError,
}) => {
  const { speechSpeed, recordQuizAnswer } = useAppState();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuestions(topic));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pickedOptionId, setPickedOptionId] = useState<string | null>(null);
  const [lastXpAwarded, setLastXpAwarded] = useState<number>(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setQuestions(buildQuestions(topic));
    setCurrentIdx(0);
    setPickedOptionId(null);
    setLastXpAwarded(0);
    setRoundCorrect(0);
    setCompleted(false);
    stopGermanSpeech();
  }, [topic]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const currentQuestion = questions[currentIdx];

  const handlePick = (optionId: string, isCorrect: boolean) => {
    if (pickedOptionId !== null || !currentQuestion) return;
    setPickedOptionId(optionId);
    if (isCorrect) {
      setRoundCorrect((c) => c + 1);
    }
    const xpAwarded = recordQuizAnswer(
      currentQuestion.word.id,
      topic.id,
      `${currentQuestion.word.article} ${currentQuestion.dictionaryNoun} → ${currentQuestion.word.turkish}`,
      isCorrect
    );
    setLastXpAwarded(xpAwarded);
  };

  const handleNext = () => {
    stopGermanSpeech();
    if (currentIdx + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setPickedOptionId(null);
      setLastXpAwarded(0);
    }
  };

  const handleRestart = () => {
    stopGermanSpeech();
    setQuestions(buildQuestions(topic));
    setCurrentIdx(0);
    setPickedOptionId(null);
    setLastXpAwarded(0);
    setRoundCorrect(0);
    setCompleted(false);
  };

  const handleListen = (text: string) => {
    const res = speakGermanText(text, speechSpeed, { onError: onSpeechError });
    if (!res.queued) onSpeechError();
  };

  if (completed) {
    const accuracy = Math.round((roundCorrect / questions.length) * 100);
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-8 text-center dark:border-[#282830] dark:bg-[#16161A]">
        <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
          Anlam ve Bağlam Testi Tamamlandı · {topic.titleTr}
        </p>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
          {roundCorrect} / {questions.length} Doğru Yanıt
        </h3>
        <p className="mt-2 text-sm text-[#52525B] dark:text-[#A1A1AA]">
          Bu testteki başarı oranınız:{' '}
          <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
            %{accuracy}
          </span>
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Yeni Test Başlat</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const { word, type, expectedBlankForm, dictionaryNoun, options } = currentQuestion;
  const articleToken = ARTICLE_TOKENS[word.article];
  const selectedOption = options.find((o) => o.id === pickedOptionId);
  const clozeParts = word.contextClozeDe.split('___');

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <span>
            {topic.titleTr} · {type === 'meaning' ? 'Doğru Anlamı Bul' : 'Cümleyi Tamamla'}
          </span>
          <span className="font-mono tabular-nums">
            Soru {currentIdx + 1} / {questions.length} · Doğru: {roundCorrect}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
          <div
            className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
            style={{
              width: `${((currentIdx + (pickedOptionId ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              {type === 'meaning'
                ? 'Aşağıdaki Almanca sözcüğün Türkçe karşılığını seçin:'
                : 'Cümledeki boşluğa uygun Almanca ismi seçin (artikelsiz biçim):'}
            </p>
            {type === 'meaning' ? (
              <p className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                <span className={articleToken.textClass}>{word.article}</span> {dictionaryNoun}
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                <p className="font-display text-xl sm:text-2xl font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                  “{clozeParts[0]}
                  <span className="mx-1 border-b-2 border-[#7C1D2E] px-1 text-[#7C1D2E] dark:border-[#D9A13B] dark:text-[#D9A13B]">
                    {pickedOptionId !== null ? expectedBlankForm : '_____'}
                  </span>
                  {clozeParts[1] ?? ''}”
                </p>
                <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  Türkçesi: {word.exampleTr}
                </p>
              </div>
            )}
          </div>

          {type === 'meaning' && (
            <button
              type="button"
              disabled={!speechSupported}
              onClick={() => handleListen(`${word.article} ${dictionaryNoun}`)}
              aria-label="Kelimeyi dinle"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] shrink-0"
            >
              <Volume2 className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isPicked = pickedOptionId === opt.id;

            let optionStyle =
              'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';

            if (pickedOptionId !== null) {
              if (opt.isCorrect) {
                optionStyle =
                  'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E] dark:bg-[#14532D]/35 dark:text-[#BBF7D0]';
              } else if (isPicked && !opt.isCorrect) {
                optionStyle =
                  'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#450A0A]/45 dark:text-[#FECACA]';
              } else {
                optionStyle =
                  'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/40 dark:text-[#686873]';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={pickedOptionId !== null}
                onClick={() => handlePick(opt.id, opt.isCorrect)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${optionStyle}`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs opacity-70 shrink-0">{letter}.</span>
                  <span className="truncate">{opt.label}</span>
                </span>
                {pickedOptionId !== null && opt.isCorrect && (
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                )}
                {pickedOptionId !== null && isPicked && !opt.isCorrect && (
                  <XCircle className="h-4.5 w-4.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Box */}
        {pickedOptionId !== null && selectedOption && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 dark:border-[#282830] dark:bg-[#111113]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedOption.isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                    <span className="text-sm font-semibold text-[#15803D] dark:text-[#4ADE80]">
                      {type === 'context'
                        ? lastXpAwarded > 0
                          ? `Harika! Doğru sözcük: ${expectedBlankForm} (+${lastXpAwarded} XP)`
                          : `Doğru sözcük: ${expectedBlankForm} (Tekrar — XP daha önce kazanıldı)`
                        : lastXpAwarded > 0
                        ? `Harika! Doğru yanıt (+${lastXpAwarded} XP)`
                        : 'Doğru yanıt! (Tekrar — XP daha önce kazanıldı)'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                    <span className="text-sm font-semibold text-[#B91C1C] dark:text-[#F87171]">
                      {type === 'context'
                        ? `Doğru sözcük: ${expectedBlankForm} (${word.article} ${dictionaryNoun} = ${word.turkish})`
                        : `Doğru karşılık: ${word.article} ${dictionaryNoun} = ${word.turkish}`}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={!speechSupported}
                onClick={() => handleListen(word.exampleDe)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Cümleyi Dinle</span>
              </button>
            </div>

            <p className="mt-3 text-sm text-[#111113] dark:text-[#E4E4E7]">
              “{word.exampleDe}”
            </p>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {word.exampleTr} · Sözlük biçimi:{' '}
              <strong className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                {word.article} {dictionaryNoun}
              </strong>{' '}
              ({word.turkish})
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <span>{currentIdx + 1 >= questions.length ? 'Testi Bitir' : 'Sonraki Soru'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
