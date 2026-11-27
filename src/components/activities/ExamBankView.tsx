import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { EXAM_IDS, GERMAN_A1_EXAM_QUESTIONS } from '../../data/germanA1Activities';
import type { ExamSectionId, NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivitySubNav } from './ActivitySubNav';

interface ExamBankViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type ExamPhase = 'intro' | 'running' | 'review';

const SECTION_META: Array<{ id: ExamSectionId; labelTr: string; labelDe: string }> = [
  { id: 'wortschatz', labelTr: 'Kelime & Artikel', labelDe: 'Wortschatz & Artikel' },
  { id: 'grammatik', labelTr: 'Dilbilgisi & Cümle', labelDe: 'Grammatik & Satzbau' },
  { id: 'lesen', labelTr: 'Okuduğunu Anlama', labelDe: 'Leseverstehen' },
  { id: 'kommunikation', labelTr: 'Günlük İletişim', labelDe: 'Alltag & Kommunikation' },
];

const EXAM_DURATION_SECONDS = 15 * 60;

export const ExamBankView: React.FC<ExamBankViewProps> = ({ onNavigate }) => {
  const { progress, recordExamSubmission } = useAppState();
  const [phase, setPhase] = useState<ExamPhase>('intro');
  const [useTimer, setUseTimer] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [lastXpAwarded, setLastXpAwarded] = useState(0);
  const [submittedScorePct, setSubmittedScorePct] = useState<number | null>(null);

  const masteredExamCount = EXAM_IDS.filter((id) =>
    progress.activityMasteredIds.includes(id)
  ).length;

  const finishExam = (answersSnapshot: Record<string, number>) => {
    const results = GERMAN_A1_EXAM_QUESTIONS.map((q) => ({
      itemId: q.id,
      isCorrect: answersSnapshot[q.id] === q.correctIndex,
    }));
    const correctTotal = results.filter((r) => r.isCorrect).length;
    const scorePct = Math.round((correctTotal / GERMAN_A1_EXAM_QUESTIONS.length) * 100);
    const xpAwarded = recordExamSubmission(results, scorePct);
    setLastXpAwarded(xpAwarded);
    setSubmittedScorePct(scorePct);
    setPhase('review');
  };

  useEffect(() => {
    if (phase !== 'running' || !useTimer) return;
    if (secondsLeft <= 0) {
      finishExam(selectedAnswers);
      return;
    }
    const id = window.setTimeout(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [phase, useTimer, secondsLeft, selectedAnswers]);

  const startExam = (timed: boolean) => {
    setUseTimer(timed);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setLastXpAwarded(0);
    setSubmittedScorePct(null);
    setPhase('running');
  };

  const currentQuestion = GERMAN_A1_EXAM_QUESTIONS[currentIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const formattedClock = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(
    secondsLeft % 60
  ).padStart(2, '0')}`;

  const reviewCorrectCount = GERMAN_A1_EXAM_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="sinav-modu" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Sınav Modu / Sınav Bankası
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            CEFR A1 Deneme Sınavı ve Soru Bankası
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">En Yüksek Skor</p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {progress.examBestScorePercent === null ? '—' : `%${progress.examBestScorePercent}`}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Çözülen Banka Sorusu</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {masteredExamCount} / {GERMAN_A1_EXAM_QUESTIONS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tamamlanan Deneme</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {progress.examCompletedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Phase 1: Exam Intro */}
      {phase === 'intro' && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Almanca A1 Tam Deneme Yapısı (15 Soru · 4 Bölüm)
            </h2>
            <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
              15 dakikalık zamanlı veya süresiz modda çözün; her yeni doğru soru +10 XP kazandırır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SECTION_META.map((sec, idx) => {
              const count = GERMAN_A1_EXAM_QUESTIONS.filter((q) => q.section === sec.id).length;
              return (
                <div
                  key={sec.id}
                  className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]"
                >
                  <p className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B]">
                    Bölüm 0{idx + 1} · {count} Soru
                  </p>
                  <p className="mt-1 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {sec.labelTr}
                  </p>
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">{sec.labelDe}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startExam(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <Clock className="h-4 w-4" />
              <span>Zamanlı Sınavı Başlat (15 Dakika)</span>
            </button>
            <button
              type="button"
              onClick={() => startExam(false)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-5 text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
            >
              <Play className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
              <span>Süresiz Deneme Başlat</span>
            </button>
          </div>
        </section>
      )}

      {/* Phase 2: Running Exam */}
      {phase === 'running' && currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Question Panel */}
          <section className="lg:col-span-8 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
              <div className="text-xs">
                <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                  Soru {currentIdx + 1} / {GERMAN_A1_EXAM_QUESTIONS.length}
                </span>
                <span aria-hidden="true" className="mx-2 text-[#A1A1AA]">·</span>
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  {currentQuestion.sectionLabelTr}
                </span>
              </div>

              {useTimer && (
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
                  <Clock className="h-4 w-4" />
                  <span>{formattedClock}</span>
                </span>
              )}
            </div>

            {currentQuestion.contextBoxDe && (
              <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-4 text-sm leading-relaxed text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]">
                <span className="block mb-1 text-[11px] font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                  Kısa A1 Okuma Metni
                </span>
                {currentQuestion.contextBoxDe}
              </div>
            )}

            <div className="space-y-2.5">
              <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                {currentQuestion.questionTr}
              </p>
              <p className="font-display text-lg sm:text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {currentQuestion.promptDe}
              </p>
              {currentQuestion.audioTextDe && (
                <ModelAudioBar
                  textDe={currentQuestion.audioTextDe}
                  labelTr="İfadeyi Dinle (de-DE)"
                  compact
                />
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
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-[#7C1D2E] bg-[#FDF2F4]/60 text-[#111113] ring-1 ring-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D10] dark:text-[#F4F4F5] dark:ring-[#D9A13B]'
                        : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B] shrink-0">
                      {String.fromCharCode(65 + optIdx)}.
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
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs sm:text-sm font-medium text-[#111113] disabled:opacity-40 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Önceki</span>
              </button>

              {currentIdx < GERMAN_A1_EXAM_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <span>Sonraki Soru</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => finishExam(selectedAnswers)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <FileCheck2 className="h-4 w-4" />
                  <span>Sınavı Bitir ve Değerlendir</span>
                </button>
              )}
            </div>
          </section>

          {/* Right Question Navigator */}
          <aside className="lg:col-span-4 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-5 h-fit dark:border-[#282830] dark:bg-[#16161A]">
            <div>
              <h2 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Soru Haritası
              </h2>
              <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                Yanıtlanan: {answeredCount} / {GERMAN_A1_EXAM_QUESTIONS.length}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {GERMAN_A1_EXAM_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    aria-label={`Soru ${idx + 1}`}
                    className={`h-10 rounded-lg border font-mono text-xs font-semibold transition-colors tabular-nums ${
                      isCurrent
                        ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : isAnswered
                        ? 'border-[#111113] bg-[#111113] text-[#F6F6F4] dark:border-[#52525B] dark:bg-[#23232B] dark:text-[#F4F4F5]'
                        : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[#ECECE8] pt-4 space-y-2.5 dark:border-[#24242C]">
              <button
                type="button"
                onClick={() => finishExam(selectedAnswers)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Sınavı Teslim Et ({answeredCount}/15)</span>
              </button>
              <p className="text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                Boş bırakılan sorular yanlış sayılır. Teslim sonrası tüm soruların ayrıntılı çözümünü görebilirsiniz.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Phase 3: Exam Score Report & Full Answer Review */}
      {phase === 'review' && (
        <div className="space-y-6">
          <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Award className="mt-1 h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    A1 Deneme Sınavı Sonuç Karnesi
                  </h2>
                  <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                    {(submittedScorePct ?? 0) >= 60
                      ? 'CEFR A1 temel yeterlilik eşiği (%60 ve üzeri) başarıyla geçildi.'
                      : 'A1 temel yeterlilik hedefi (%60) için aşağıdaki açıklamaları inceleyip tekrar deneyebilirsiniz.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startExam(useTimer)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Yeni Deneme Başlat</span>
              </button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Doğru Sayısı</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {reviewCorrectCount} / {GERMAN_A1_EXAM_QUESTIONS.length}
                </p>
              </div>
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Sınav Başarı Oranı</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  %{submittedScorePct ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Bu Denemede Yeni XP</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-[#15803D] dark:text-[#4ADE80] tabular-nums">
                  +{lastXpAwarded} XP
                </p>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
              {SECTION_META.map((sec) => {
                const secQs = GERMAN_A1_EXAM_QUESTIONS.filter((q) => q.section === sec.id);
                const secCorrect = secQs.filter(
                  (q) => selectedAnswers[q.id] === q.correctIndex
                ).length;
                const pct = Math.round((secCorrect / secQs.length) * 100);
                return (
                  <div
                    key={sec.id}
                    className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-2 dark:border-[#24242C] dark:bg-[#111113]"
                  >
                    <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {sec.labelTr}
                    </p>
                    <div className="flex items-center justify-between font-mono text-xs tabular-nums">
                      <span className="text-[#52525B] dark:text-[#A1A1AA]">
                        {secCorrect}/{secQs.length}
                      </span>
                      <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                        %{pct}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D9D9D3] dark:bg-[#23232B]">
                      <div
                        className="h-full bg-[#7C1D2E] dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Full Answer Review */}
          <section className="space-y-3">
            <h3 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Soru Bazlı Çözüm İncelemesi (15 Soru)
            </h3>
            {GERMAN_A1_EXAM_QUESTIONS.map((q, idx) => {
              const userChoice = selectedAnswers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-2.5 dark:border-[#282830] dark:bg-[#16161A]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">
                      Soru {idx + 1} · {q.sectionLabelTr}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Doğru</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#B91C1C] dark:text-[#F87171]">
                        <XCircle className="h-4 w-4" />
                        <span>{userChoice === undefined ? 'Boş Bırakıldı' : 'Yanlış'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {q.promptDe}
                  </p>
                  <div className="text-xs sm:text-sm space-y-1">
                    {userChoice !== undefined && !isCorrect && (
                      <p className="text-[#B91C1C] dark:text-[#F87171]">
                        Sizin yanıtınız: {q.options[userChoice]}
                      </p>
                    )}
                    <p className="font-medium text-[#15803D] dark:text-[#4ADE80]">
                      Doğru yanıt: {q.options[q.correctIndex]}
                    </p>
                    <p className="text-[#52525B] dark:text-[#A1A1AA]">{q.explanationTr}</p>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      )}
    </div>
  );
};
