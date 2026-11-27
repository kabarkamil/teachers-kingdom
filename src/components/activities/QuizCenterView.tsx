import React, { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { GERMAN_A1_QUIZ_QUESTIONS, QUIZ_IDS } from '../../data/germanA1Activities';
import type { NavRouteId, QuizTopicFilter } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivitySubNav } from './ActivitySubNav';

interface QuizCenterViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type TopicOption = 'all' | QuizTopicFilter;

const TOPIC_FILTERS: Array<{ id: TopicOption; labelTr: string }> = [
  { id: 'all', labelTr: 'Tüm Konular (12)' },
  { id: 'artikel', labelTr: 'Artikel & İsimler' },
  { id: 'grammatik', labelTr: 'Fiil Çekimi & Cümle' },
  { id: 'alltag', labelTr: 'Günlük İletişim' },
  { id: 'verstehen', labelTr: 'Okuma & Dinleme' },
];

export const QuizCenterView: React.FC<QuizCenterViewProps> = ({ onNavigate }) => {
  const { progress, recordActivityAnswer } = useAppState();
  const [topicFilter, setTopicFilter] = useState<TopicOption>('all');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [xpFeedback, setXpFeedback] = useState<Record<string, string>>({});

  const filteredQuestions = useMemo(() => {
    if (topicFilter === 'all') return GERMAN_A1_QUIZ_QUESTIONS;
    return GERMAN_A1_QUIZ_QUESTIONS.filter((q) => q.topic === topicFilter);
  }, [topicFilter]);

  const masteredSet = new Set(progress.activityMasteredIds);
  const completedCount = QUIZ_IDS.filter((id) => masteredSet.has(id)).length;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (answers[questionId] !== undefined) return;
    const question = GERMAN_A1_QUIZ_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    const isCorrect = optionIdx === question.correctIndex;
    const xp = recordActivityAnswer(
      question.id,
      'quiz',
      `Quiz Merkezi · ${question.topicLabelTr}`,
      isCorrect
    );

    if (isCorrect) {
      setXpFeedback((prev) => ({
        ...prev,
        [questionId]:
          xp > 0
            ? `Doğru · +${xp} XP kazanıldı.`
            : 'Doğru (bu soru daha önce tamamlandığı için ek XP eklenmedi).',
      }));
    } else {
      setXpFeedback((prev) => ({
        ...prev,
        [questionId]: 'Yanlış yanıt — açıklamayı inceleyip tekrar deneyebilirsiniz.',
      }));
    }
  };

  const handleResetSessionAnswers = () => {
    setAnswers({});
    setXpFeedback({});
  };

  const answeredInFilter = filteredQuestions.filter((q) => answers[q.id] !== undefined).length;
  const correctInFilter = filteredQuestions.filter(
    (q) => answers[q.id] !== undefined && answers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="quiz-merkezi" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Quiz Merkezi
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Quiz Merkezi — Karma A1 Tarama Soruları
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tamamlanan Soru</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedCount} / {GERMAN_A1_QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Filter & Session Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Quiz konu filtresi"
          className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
        >
          {TOPIC_FILTERS.map((f) => {
            const active = topicFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setTopicFilter(f.id)}
                aria-pressed={active}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                {f.labelTr}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs">
          {answeredInFilter > 0 && (
            <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              Oturum: {correctInFilter}/{answeredInFilter} doğru
            </span>
          )}
          {Object.keys(answers).length > 0 && (
            <button
              type="button"
              onClick={handleResetSessionAnswers}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Seçimleri Temizle</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const picked = answers[q.id];
          const answered = picked !== undefined;
          const isMastered = masteredSet.has(q.id);

          return (
            <article
              key={q.id}
              className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-4 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#52525B] dark:text-[#A1A1AA]">
                  <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                    Soru {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{q.topicLabelTr}</span>
                </div>
                {isMastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Tamamlandı</span>
                  </span>
                ) : (
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">+10 XP</span>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#52525B] dark:text-[#A1A1AA]">
                  {q.questionTr}
                </p>
                <p className="font-display text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {q.promptDe}
                </p>
                {q.audioTextDe && (
                  <ModelAudioBar textDe={q.audioTextDe} labelTr="Dinle (de-DE)" compact />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = picked === optIdx;
                  const isCorrectOpt = optIdx === q.correctIndex;

                  let style =
                    'border-[#D9D9D3] bg-[#F6F6F4]/60 text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
                  if (answered && isCorrectOpt) {
                    style =
                      'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80] dark:bg-[#0F2417] dark:text-[#BBF7D0]';
                  } else if (answered && isSelected && !isCorrectOpt) {
                    style =
                      'border-[#B91C1C] bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171] dark:bg-[#2A1215] dark:text-[#FECACA]';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={answered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3.5 py-3 text-left text-xs sm:text-sm font-medium transition-colors ${style}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrectOpt && (
                        <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                      )}
                      {answered && isSelected && !isCorrectOpt && (
                        <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 space-y-1 text-xs sm:text-sm dark:border-[#24242C] dark:bg-[#111113]">
                  {xpFeedback[q.id] && (
                    <p
                      className={`font-semibold ${
                        picked === q.correctIndex
                          ? 'text-[#15803D] dark:text-[#4ADE80]'
                          : 'text-[#B91C1C] dark:text-[#F87171]'
                      }`}
                    >
                      {xpFeedback[q.id]}
                    </p>
                  )}
                  <p className="text-[#52525B] dark:text-[#A1A1AA]">{q.explanationTr}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
