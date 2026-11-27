import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileSpreadsheet,
  Play,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { A2_EXAM_IDS, GERMAN_A2_EXAM_QUESTIONS } from '../../data/germanA2Activities';
import type { ExamSectionId, NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivityA2SubNav } from './ActivityA2SubNav';

interface ExamBankA2ViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type ExamPhase = 'intro' | 'active' | 'result';

const EXAM_DURATION_SECONDS = 20 * 60;

const EXAM_SECTIONS: Array<{ id: ExamSectionId; labelTr: string }> = [
  { id: 'wortschatz', labelTr: 'Wortschatz & Artikel' },
  { id: 'grammatik', labelTr: 'Grammatik & Nebensätze' },
  { id: 'lesen', labelTr: 'Leseverstehen' },
  { id: 'kommunikation', labelTr: 'Alltag & Kommunikation' },
];

function formatCountdown(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const ExamBankA2View: React.FC<ExamBankA2ViewProps> = ({ onNavigate }) => {
  const { a2Progress, recordA2ExamSubmission } = useAppState();
  const [phase, setPhase] = useState<ExamPhase>('intro');
  const [useTimer, setUseTimer] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [lastSubmissionSummary, setLastSubmissionSummary] = useState<{
    correctCount: number;
    totalCount: number;
    scorePercent: number;
    xpAwarded: number;
  } | null>(null);

  const masteredExamCount = A2_EXAM_IDS.filter((id) =>
    a2Progress.activityMasteredIds.includes(id)
  ).length;

  const submitExam = (answersSnapshot: Record<string, number>) => {
    const results = GERMAN_A2_EXAM_QUESTIONS.map((q) => ({
      itemId: q.id,
      isCorrect: answersSnapshot[q.id] === q.correctIndex,
    }));
    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalCount = results.length;
    const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const xpAwarded = recordA2ExamSubmission(results, scorePercent);

    setLastSubmissionSummary({
      correctCount,
      totalCount,
      scorePercent,
      xpAwarded,
    });
    setPhase('result');
  };

  useEffect(() => {
    if (phase !== 'active' || !useTimer) return;
    if (secondsLeft <= 0) {
      submitExam(selectedAnswers);
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, useTimer, secondsLeft, selectedAnswers]);

  const handleStartExam = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setLastSubmissionSummary(null);
    setPhase('active');
  };

  const currentQuestion = GERMAN_A2_EXAM_QUESTIONS[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="sinav-modu" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A2 · Sınav Modu / Sınav Bankası
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            CEFR A2 Deneme Sınavı (4 Bölüm · 16 Soru)
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">En Yüksek A2 Skor</p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.a2ExamBestScorePercent === null
                ? '—'
                : `%${a2Progress.a2ExamBestScorePercent}`}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tamamlanan Sınav</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {a2Progress.a2ExamCompletedCount}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Ustalaşılan Soru</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {masteredExamCount} / {GERMAN_A2_EXAM_QUESTIONS.length}
            </p>
          </div>
        </div>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXAM_SECTIONS.map((sec, idx) => {
              const count = GERMAN_A2_EXAM_QUESTIONS.filter((q) => q.section === sec.id).length;
              return (
                <div
                  key={sec.id}
                  className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]"
                >
                  <p className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B]">
                    Bölüm 0{idx + 1}
                  </p>
                  <h2 className="mt-1 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {sec.labelTr}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                    {count} A2 sorusu
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#ECECE8] pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C]">
            <label className="inline-flex items-center gap-2.5 text-sm text-[#111113] dark:text-[#F4F4F5] cursor-pointer">
              <input
                type="checkbox"
                checked={useTimer}
                onChange={(e) => setUseTimer(e.target.checked)}
                className="h-4 w-4 rounded border-[#D9D9D3] accent-[#7C1D2E] dark:accent-[#D9A13B]"
              />
              <span>20 dakikalık gerçek sınav sayacı kullan (isteğe bağlı)</span>
            </label>

            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C1D2E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>A2 Deneme Sınavını Başlat</span>
            </button>
          </div>
        </section>
      )}

      {/* ACTIVE EXAM */}
      {phase === 'active' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
              <span className="font-mono text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                Soru {currentIdx + 1} / {GERMAN_A2_EXAM_QUESTIONS.length} ·{' '}
                {currentQuestion.sectionLabelTr}
              </span>
              {useTimer && (
                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums ${
                    secondsLeft <= 120
                      ? 'text-[#B91C1C] dark:text-[#F87171]'
                      : 'text-[#111113] dark:text-[#F4F4F5]'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{formatCountdown(secondsLeft)}</span>
                </span>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.contextBoxDe && (
                <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                  <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                    A2 Okuma / Bağlam Metni
                  </p>
                  <p className="text-sm sm:text-base leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                    {currentQuestion.contextBoxDe}
                  </p>
                  <ModelAudioBar
                    textDe={
                      currentQuestion.audioTextDe ??
                      currentQuestion.contextBoxDe.replace(/___+/g, '...')
                    }
                    labelTr="Metni Dinle (de-DE)"
                    compact
                  />
                </div>
              )}

              <h2 className="font-display text-lg sm:text-xl font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                {currentQuestion.questionTr}
              </h2>

              {currentQuestion.promptDe && (
                <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/70 p-3.5 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
                  <p className="text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
                    {currentQuestion.promptDe}
                  </p>
                  {!currentQuestion.contextBoxDe && (
                    <ModelAudioBar
                      textDe={
                        currentQuestion.audioTextDe ??
                        currentQuestion.promptDe.replace(/___+/g, '...')
                      }
                      labelTr="İfadeyi Dinle (de-DE)"
                      compact
                    />
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: optIdx,
                      }))
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                        : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#111113]/50 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#52525B]'
                    }`}
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-current font-mono text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] disabled:opacity-40 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Önceki</span>
              </button>

              {currentIdx < GERMAN_A2_EXAM_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIdx((i) => Math.min(GERMAN_A2_EXAM_QUESTIONS.length - 1, i + 1))
                  }
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-semibold text-white hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <span>Sonraki Soru</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submitExam(selectedAnswers)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>A2 Sınavını Bitir ve Değerlendir</span>
                </button>
              )}
            </div>
          </section>

          {/* 16-Question Navigator Grid */}
          <aside className="lg:col-span-4 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-5 self-start dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Soru Haritası
              </span>
              <span className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                {answeredCount} / {GERMAN_A2_EXAM_QUESTIONS.length} işaretli
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {GERMAN_A2_EXAM_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-lg border font-mono text-xs font-semibold transition-colors tabular-nums ${
                      isCurrent
                        ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : isAnswered
                        ? 'border-[#111113] bg-[#111113]/10 text-[#111113] dark:border-[#D9A13B]/50 dark:bg-[#231D11] dark:text-[#D9A13B]'
                        : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => submitExam(selectedAnswers)}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#7C1D2E] bg-[#FDF2F4] px-4 text-xs font-semibold text-[#7C1D2E] hover:bg-[#FCE7EB] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]"
            >
              <span>Sınavı Şimdi Teslim Et</span>
            </button>
          </aside>
        </div>
      )}

      {/* RESULT & FULL REVIEW */}
      {phase === 'result' && lastSubmissionSummary && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#ECECE8] pb-5 dark:border-[#24242C]">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className={`mt-0.5 h-6 w-6 shrink-0 ${
                    lastSubmissionSummary.scorePercent >= 60
                      ? 'text-[#15803D] dark:text-[#4ADE80]'
                      : 'text-[#9A6B16] dark:text-[#D9A13B]'
                  }`}
                />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    A2 Deneme Sınavı Karnesi — %{lastSubmissionSummary.scorePercent}
                  </h2>
                  <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                    {lastSubmissionSummary.correctCount} / {lastSubmissionSummary.totalCount} doğru yanıt ·{' '}
                    {lastSubmissionSummary.scorePercent >= 60
                      ? 'CEFR A2 hedef barajı (%60) aşıldı.'
                      : 'CEFR A2 barajı (%60) için eksik bölümleri tekrar etmeniz önerilir.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-semibold text-[#15803D] dark:text-[#4ADE80] tabular-nums">
                  +{lastSubmissionSummary.xpAwarded} Yeni A2 XP
                </span>
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Sınavı Tekrarla</span>
                </button>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EXAM_SECTIONS.map((sec) => {
                const secQuestions = GERMAN_A2_EXAM_QUESTIONS.filter((q) => q.section === sec.id);
                const secCorrect = secQuestions.filter(
                  (q) => selectedAnswers[q.id] === q.correctIndex
                ).length;
                const secPct =
                  secQuestions.length > 0
                    ? Math.round((secCorrect / secQuestions.length) * 100)
                    : 0;
                return (
                  <div
                    key={sec.id}
                    className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-2 dark:border-[#24242C] dark:bg-[#111113]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                        {sec.labelTr}
                      </span>
                      <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                        {secCorrect}/{secQuestions.length}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] dark:bg-[#D9A13B]"
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                    <p className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      %{secPct}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Full Answer Review */}
          <section className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Ayrıntılı A2 Cevap Anahtarı ve Türkçe Açıklamalar
            </h3>
            {GERMAN_A2_EXAM_QUESTIONS.map((q, idx) => {
              const userIdx = selectedAnswers[q.id];
              const isCorrect = userIdx === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-2.5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B]">
                        Soru {idx + 1} · {q.sectionLabelTr}
                      </p>
                      <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                        {q.questionTr}
                      </p>
                      {q.promptDe && (
                        <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
                          {q.promptDe}
                        </p>
                      )}
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                    )}
                  </div>

                  {q.contextBoxDe && (
                    <p className="text-xs italic text-[#52525B] dark:text-[#A1A1AA]">
                      “{q.contextBoxDe}”
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-[#52525B] dark:text-[#A1A1AA]">
                      Yanıtınız:{' '}
                      <strong className="text-[#111113] dark:text-[#F4F4F5]">
                        {userIdx !== undefined ? q.options[userIdx] : 'Boş bırakıldı'}
                      </strong>
                    </span>
                    <span className="text-[#15803D] dark:text-[#4ADE80]">
                      Doğru yanıt: <strong>{q.options[q.correctIndex]}</strong>
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {q.explanationTr}
                  </p>
                </article>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
};
