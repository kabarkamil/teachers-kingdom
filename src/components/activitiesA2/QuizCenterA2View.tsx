import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { A2_QUIZ_IDS, GERMAN_A2_QUIZ_QUESTIONS } from '../../data/germanA2Activities';
import type { NavRouteId, QuizTopicFilter } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivityA2SubNav } from './ActivityA2SubNav';

interface QuizCenterA2ViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type QuizFilterValue = 'all' | QuizTopicFilter;

const A2_TOPIC_TO_SKILL: Record<
  QuizTopicFilter,
  { route: NavRouteId; labelTr: string; labelEn: string }
> = {
  artikel: { route: 'kelime', labelTr: 'A2 Kelime Modülünde Tekrar Et', labelEn: 'Review in A2 Vocab' },
  grammatik: { route: 'yazma', labelTr: 'A2 Yazma & Dilbilgisinde Çalış', labelEn: 'Practice in A2 Writing' },
  alltag: { route: 'konusma', labelTr: 'A2 Konuşmada Pratik Yap', labelEn: 'Practice in A2 Speaking' },
  verstehen: { route: 'okuma', labelTr: 'A2 Okuma / Dinlemeye Geç', labelEn: 'Go to A2 Reading' },
};

const TOPIC_FILTERS: Array<{ id: QuizFilterValue; labelTr: string; labelEn: string }> = [
  { id: 'all', labelTr: 'Tümü (12)', labelEn: 'All (12)' },
  { id: 'artikel', labelTr: 'Nomen & Artikel', labelEn: 'Nouns & Articles' },
  { id: 'grammatik', labelTr: 'Grammatik & Nebensätze', labelEn: 'Grammar & Clauses' },
  { id: 'alltag', labelTr: 'Alltag & Kommunikation', labelEn: 'Daily Communication' },
  { id: 'verstehen', labelTr: 'Hören & Lesen', labelEn: 'Listening & Reading' },
];

export const QuizCenterA2View: React.FC<QuizCenterA2ViewProps> = ({ onNavigate }) => {
  const { a2Progress, uiLanguage, recordA2ActivityAnswer } = useAppState();
  const isEn = uiLanguage === 'en';
  const [topicFilter, setTopicFilter] = useState<QuizFilterValue>('all');
  const [answers, setAnswers] = useState<
    Record<string, { selectedIdx: number; isCorrect: boolean; xpEarned: number }>
  >({});

  const filteredQuestions = useMemo(() => {
    if (topicFilter === 'all') return GERMAN_A2_QUIZ_QUESTIONS;
    return GERMAN_A2_QUIZ_QUESTIONS.filter((q) => q.topic === topicFilter);
  }, [topicFilter]);

  const masteredSet = new Set(a2Progress.activityMasteredIds);
  const completedCount = A2_QUIZ_IDS.filter((id) => masteredSet.has(id)).length;

  const sessionCorrectCount = filteredQuestions.filter(
    (q) => answers[q.id]?.isCorrect
  ).length;
  const sessionAnsweredCount = filteredQuestions.filter((q) => Boolean(answers[q.id])).length;

  const handleSelectOption = (questionId: string, optIdx: number) => {
    if (answers[questionId]) return;
    const question = GERMAN_A2_QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = optIdx === question.correctIndex;
    const xpEarned = recordA2ActivityAnswer(
      question.id,
      'quiz',
      `${question.topicLabelTr} · ${question.options[question.correctIndex]}`,
      isCorrect,
      undefined,
      true
    );
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedIdx: optIdx, isCorrect, xpEarned },
    }));
  };

  const handleResetSession = () => {
    setAnswers({});
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="quiz-merkezi" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A2 · Quiz Merkezi
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            A2 Quiz Merkezi — Konu Filtreli Alıştırma Bankası
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Oturum Skoru</p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {sessionCorrectCount} / {sessionAnsweredCount}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Ustalaşılan A2 Soru</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedCount} / {GERMAN_A2_QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="A2 Quiz konu filtresi"
          className="flex flex-wrap items-center gap-1.5"
        >
          {TOPIC_FILTERS.map((filter) => {
            const isSelected = topicFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTopicFilter(filter.id)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'border-[#7A1C24] bg-[#7A1C24] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#0D0D0D] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {isEn ? filter.labelEn : filter.labelTr}
              </button>
            );
          })}
        </div>

        {sessionAnsweredCount > 0 && (
          <button
            type="button"
            onClick={handleResetSession}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] whitespace-nowrap self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Oturum Seçimlerini Temizle</span>
          </button>
        )}
      </div>

      {/* Question Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const answer = answers[q.id];
          const isMastered = masteredSet.has(q.id);
          return (
            <article
              key={q.id}
              className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 space-y-4 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                  Soru {idx + 1} · {q.topicLabelTr}
                </span>
                {isMastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Ustalaşıldı</span>
                  </span>
                ) : (
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">+10 A2 XP</span>
                )}
              </div>

              <div className="space-y-2.5">
                <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {q.questionTr}
                </h2>
                {q.promptDe && (
                  <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
                    <p className="text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
                      {q.promptDe}
                    </p>
                    <ModelAudioBar
                      textDe={q.audioTextDe ?? q.promptDe.replace(/___+/g, '...')}
                      labelTr="Almanca Cümleyi Dinle (de-DE)"
                      compact
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answer?.selectedIdx === optIdx;
                  const isCorrectOpt = optIdx === q.correctIndex;
                  let styleClass =
                    'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
                  if (answer) {
                    if (isCorrectOpt) {
                      styleClass =
                        'border-[#15803D] bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#86EFAC]';
                    } else if (isSelected) {
                      styleClass =
                        'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#F87171] dark:bg-[#3B1014] dark:text-[#FCA5A5]';
                    } else {
                      styleClass =
                        'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/50 dark:text-[#71717A]';
                    }
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={Boolean(answer)}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`flex items-center justify-between gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${styleClass}`}
                    >
                      <span>{opt}</span>
                      {answer && isCorrectOpt && (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      )}
                      {answer && isSelected && !isCorrectOpt && (
                        <XCircle className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {answer && (
                <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 text-xs space-y-1 dark:border-[#24242C] dark:bg-[#111113]">
                  <p
                    className={`font-semibold ${
                      answer.isCorrect
                        ? 'text-[#15803D] dark:text-[#4ADE80]'
                        : 'text-[#B91C1C] dark:text-[#F87171]'
                    }`}
                  >
                    {answer.isCorrect
                      ? answer.xpEarned > 0
                        ? `Doğru · +${answer.xpEarned} A2 XP kazanıldı`
                        : 'Doğru (bu soru daha önce tamamlandığı için 0 ek XP)'
                      : `Yanlış · Doğru yanıt: ${q.options[q.correctIndex]}`}
                  </p>
                  <p className="leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {q.explanationTr}
                  </p>
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={() => onNavigate(A2_TOPIC_TO_SKILL[q.topic].route)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1C24] hover:underline dark:text-[#D4AF37]"
                    >
                      <span>
                        {isEn
                          ? A2_TOPIC_TO_SKILL[q.topic].labelEn
                          : A2_TOPIC_TO_SKILL[q.topic].labelTr}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
