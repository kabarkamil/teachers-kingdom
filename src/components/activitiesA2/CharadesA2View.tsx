import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { A2_CHARADE_IDS, GERMAN_A2_CHARADES } from '../../data/germanA2Activities';
import { useI18n } from '../../hooks/useI18n';
import type { NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivityA2SubNav } from './ActivityA2SubNav';

interface CharadesA2ViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type CharadePlayMode = 'guess' | 'classroom';

type CharadeA2Feedback =
  | { kind: 'guess-correct'; xp: number }
  | { kind: 'guess-wrong'; targetDe: string; targetTr: string }
  | { kind: 'classroom'; xp: number };

export const CharadesA2View: React.FC<CharadesA2ViewProps> = ({ onNavigate }) => {
  const { a2Progress, rolePreview, recordA2ActivityAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [playMode, setPlayMode] = useState<CharadePlayMode>(
    rolePreview === 'teacher' ? 'classroom' : 'guess'
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [revealedClueLevel, setRevealedClueLevel] = useState<1 | 2 | 3>(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<CharadeA2Feedback | null>(null);

  // Classroom / pair acting card reveal & real 45s countdown timer
  const [classroomRevealed, setClassroomRevealed] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentCard = GERMAN_A2_CHARADES[cardIndex];
  const masteredSet = new Set(a2Progress.activityMasteredIds);
  const completedCount = A2_CHARADE_IDS.filter((id) => masteredSet.has(id)).length;
  const isCurrentMastered = masteredSet.has(currentCard.id);

  useEffect(() => {
    setRevealedClueLevel(1);
    setSelectedOption(null);
    setFeedback(null);
    setClassroomRevealed(false);
    setTimerRunning(false);
    setTimerSeconds(45);
  }, [cardIndex, playMode]);

  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      return;
    }
    const id = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentCard.correctIndex;
    const xp = recordA2ActivityAnswer(
      currentCard.id,
      'charades',
      currentCard.targetDe,
      isCorrect,
      undefined,
      true
    );
    if (isCorrect) {
      setFeedback({ kind: 'guess-correct', xp });
    } else {
      setFeedback({
        kind: 'guess-wrong',
        targetDe: currentCard.targetDe,
        targetTr: currentCard.targetTr,
      });
    }
  };

  const handleClassroomMarkGuessed = () => {
    // Classroom self-check grants single-grant +10 A2 XP without inflating scored A2 accuracy
    const xp = recordA2ActivityAnswer(
      currentCard.id,
      'charades',
      `${currentCard.targetDe} (Sınıf/Eşli Canlandırma)`,
      true,
      undefined,
      false
    );
    setClassroomRevealed(true);
    setTimerRunning(false);
    setFeedback({ kind: 'classroom', xp });
  };

  const feedbackNotice =
    feedback === null
      ? null
      : feedback.kind === 'guess-correct'
      ? feedback.xp > 0
        ? tx(
            { tr: 'Doğru A2 tahmini · +{{xp}} A2 XP kazanıldı.', en: 'Correct A2 guess · +{{xp}} A2 XP earned.' },
            { xp: feedback.xp }
          )
        : tx({
            tr: 'Doğru tahmin! Bu A2 kartı daha önce tamamlandığı için ek XP eklenmedi.',
            en: 'Correct guess! No extra XP — this A2 card was already completed.',
          })
      : feedback.kind === 'guess-wrong'
      ? tx(
          { tr: 'Doğru ifade: "{{de}}" ({{tr}}).', en: 'Correct expression: "{{de}}" ({{tr}}).' },
          { de: feedback.targetDe, tr: feedback.targetTr }
        )
      : feedback.xp > 0
      ? tx(
          {
            tr: 'Canlandırma kartı tamamlandı · +{{xp}} A2 XP (öz-bildirim olduğu için puanlı doğruluk oranını şişirmez).',
            en: 'Acting card completed · +{{xp}} A2 XP (self-check does not inflate scored accuracy).',
          },
          { xp: feedback.xp }
        )
      : tx({
          tr: 'Canlandırma kartı tekrarlandı (daha önce tamamlandığı için ek XP eklenmedi).',
          en: 'Acting card repeated (no extra XP — already completed).',
        });

  const goPrev = () => {
    setCardIndex((prev) => (prev === 0 ? GERMAN_A2_CHARADES.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCardIndex((prev) => (prev + 1) % GERMAN_A2_CHARADES.length);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="sessiz-sinema" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>{locale.navGroups.activities}</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {tx({
                tr: 'Almanca A2 · Sessiz Sinema (Scharade)',
                en: 'German A2 · Charades (Scharade)',
              })}
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'A2 Sessiz Sinema — Günlük A2 Eylemleri & Durum Kartları',
              en: 'A2 Charades — Everyday A2 Actions & Situation Cards',
            })}
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Toplam A2 XP', en: 'Total A2 XP' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Tamamlanan Kart', en: 'Completed Cards' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedCount} / {GERMAN_A2_CHARADES.length}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher & Card Progress */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label={tx({ tr: 'A2 Sessiz Sinema oyun modu', en: 'A2 Charades play mode' })}
          className="inline-flex rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
        >
          <button
            type="button"
            aria-pressed={playMode === 'guess'}
            onClick={() => setPlayMode('guess')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              playMode === 'guess'
                ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{tx({ tr: 'Bireysel Tahmin (Puanlı)', en: 'Solo Guessing (Scored)' })}</span>
          </button>
          <button
            type="button"
            aria-pressed={playMode === 'classroom'}
            onClick={() => setPlayMode('classroom')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              playMode === 'classroom'
                ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>
              {tx({
                tr: 'Sınıf / Eşli Canlandırma (45 sn)',
                en: 'Classroom / Partner Acting (45s)',
              })}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label={tx({ tr: 'Önceki kart', en: 'Previous card' })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums px-2">
            {tx(
              { tr: 'Kart {{current}} / {{total}}', en: 'Card {{current}} / {{total}}' },
              { current: cardIndex + 1, total: GERMAN_A2_CHARADES.length }
            )}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label={tx({ tr: 'Sonraki kart', en: 'Next card' })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Navigation Dots */}
      <div className="flex flex-wrap items-center gap-1.5">
        {GERMAN_A2_CHARADES.map((card, idx) => {
          const done = masteredSet.has(card.id);
          const isCurrent = idx === cardIndex;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setCardIndex(idx)}
              aria-label={tx({ tr: 'Kart {{num}}', en: 'Card {{num}}' }, { num: idx + 1 })}
              className={`h-8 min-w-[36px] rounded-lg border px-2.5 font-mono text-xs font-medium transition-colors tabular-nums ${
                isCurrent
                  ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                  : done
                  ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80]/35 dark:bg-[#0D2315] dark:text-[#86EFAC]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Card Panel */}
      {playMode === 'guess' ? (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                {currentCard.categoryTr}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#52525B] dark:text-[#A1A1AA]">
                {tx(
                  { tr: 'İpucu Seviyesi {{level}}/3', en: 'Clue Level {{level}}/3' },
                  { level: revealedClueLevel }
                )}
              </span>
            </div>
            {isCurrentMastered && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'Ustalaşıldı', en: 'Mastered' })}</span>
              </span>
            )}
          </div>

          {/* 3-Tier Progressive Clues */}
          <div className="space-y-3">
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                {tx({
                  tr: '1. İpucu — Mimik / Canlandırma Tarifi',
                  en: 'Clue 1 — Mime / Acting Prompt',
                })}
              </p>
              <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                {currentCard.mimeCueTr}
              </p>
            </div>

            {revealedClueLevel >= 2 ? (
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                  {tx({
                    tr: '2. İpucu — Almanca A2 Bağlam & Sesli İpucu (de-DE)',
                    en: 'Clue 2 — German A2 Context & Audio Clue (de-DE)',
                  })}
                </p>
                <p className="text-sm font-medium text-[#111113] dark:text-[#F4F4F5]">
                  {currentCard.germanClueDe}
                </p>
                <ModelAudioBar
                  textDe={currentCard.germanClueDe}
                  labelTr="Bağlam İpucunu Dinle (de-DE)"
                  labelEn="Listen to Context Clue (de-DE)"
                  compact
                />
              </div>
            ) : null}

            {revealedClueLevel >= 3 ? (
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                  {tx({
                    tr: '3. İpucu — A2 Dilbilgisi Yapısı',
                    en: 'Clue 3 — A2 Grammar Structure',
                  })}
                </p>
                <p className="mt-1 text-sm text-[#111113] dark:text-[#F4F4F5]">
                  {currentCard.grammarHintTr}
                </p>
              </div>
            ) : null}

            {revealedClueLevel < 3 && selectedOption === null && (
              <button
                type="button"
                onClick={() =>
                  setRevealedClueLevel((prev) => (prev === 1 ? 2 : 3))
                }
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <Lightbulb className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
                <span>
                  {revealedClueLevel === 1
                    ? tx({
                        tr: '2. İpucunu Aç (Almanca Bağlam + Ses)',
                        en: 'Reveal Clue 2 (German Context + Audio)',
                      })
                    : tx({
                        tr: '3. İpucunu Aç (A2 Dilbilgisi)',
                        en: 'Reveal Clue 3 (A2 Grammar)',
                      })}
                </span>
              </button>
            )}
          </div>

          {/* 4-Option Solo Guess */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Bu A2 eylemini / durumunu en doğru anlatan Almanca ifadeyi seçin:',
                en: 'Choose the German expression that best matches this A2 action or situation:',
              })}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCard.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOpt = idx === currentCard.correctIndex;
                let styleClass =
                  'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
                if (selectedOption !== null) {
                  if (isCorrectOpt) {
                    styleClass =
                      'border-[#15803D] bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#86EFAC]';
                  } else if (isSelected) {
                    styleClass =
                      'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#F87171] dark:bg-[#3B1014] dark:text-[#FCA5A5]';
                  } else {
                    styleClass =
                      'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/60 dark:text-[#71717A]';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors ${styleClass}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrectOpt && (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    )}
                    {selectedOption !== null && isSelected && !isCorrectOpt && (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedOption !== null && (
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {feedbackNotice}
              </p>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <strong className="text-[#111113] dark:text-[#F4F4F5]">
                  {currentCard.targetDe}
                </strong>{' '}
                — {currentCard.targetTr} · {currentCard.explanationTr}
              </p>
              <ModelAudioBar
                textDe={currentCard.targetDe}
                labelTr="Doğru İfadeyi Dinle (de-DE)"
                labelEn="Listen to Correct Expression (de-DE)"
                compact
              />
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null);
                    setFeedback(null);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{tx({ tr: 'Kartı Tekrarla', en: 'Repeat Card' })}</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <span>{tx({ tr: 'Sonraki A2 Kartı', en: 'Next A2 Card' })}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Classroom / Pair Acting Mode */
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-col gap-4 border-b border-[#ECECE8] pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C]">
            <div>
              <p className="font-mono text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                {tx({ tr: 'Sınıf / Eşli Canlandırma Kartı', en: 'Classroom / Partner Acting Card' })} ·{' '}
                {currentCard.categoryTr}
              </p>
              <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Canlandıracak kişi kartı açıp hedef A2 ifadesini görür, ardından gizleyip 45 saniyede mimikle anlatır.',
                  en: 'The actor reveals the card to see the target A2 expression, hides it, and acts it out in 45 seconds.',
                })}
              </p>
            </div>

            {/* Real Countdown Timer */}
            <div className="flex items-center gap-2">
              <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 font-mono text-sm font-semibold text-[#111113] tabular-nums dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]">
                <Clock className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>{tx({ tr: '{{sec}} sn', en: '{{sec}}s' }, { sec: timerSeconds })}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (timerSeconds === 0) setTimerSeconds(45);
                  setTimerRunning((v) => !v);
                }}
                className="inline-flex h-10 items-center rounded-lg bg-[#111113] px-3.5 text-xs font-semibold text-white hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap"
              >
                {timerRunning
                  ? locale.audio.pause
                  : timerSeconds === 0
                  ? locale.audio.restart
                  : tx({ tr: 'Sayacı Başlat', en: 'Start Timer' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(45);
                }}
                aria-label={tx({ tr: 'Sayacı sıfırla', en: 'Reset timer' })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card Reveal Surface */}
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-6 text-center space-y-4 dark:border-[#282830] dark:bg-[#111113]">
            {classroomRevealed ? (
              <div className="space-y-3">
                <p className="text-xs font-mono text-[#9A6B16] dark:text-[#D9A13B]">
                  {tx({
                    tr: 'Hedef A2 İfadesi (Yalnızca Canlandıran Kişi)',
                    en: 'Target A2 Expression (Actor Only)',
                  })}
                </p>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {currentCard.targetDe}
                </p>
                <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {currentCard.targetTr}
                </p>
                <p className="mx-auto max-w-xl text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Canlandırma ipucu:', en: 'Acting prompt:' })} {currentCard.mimeCueTr}
                </p>
                <p className="text-xs font-mono text-[#71717A] dark:text-[#8E8E98]">
                  {currentCard.grammarHintTr}
                </p>
                <div className="flex justify-center pt-2">
                  <ModelAudioBar
                    textDe={currentCard.targetDe}
                    labelTr="Telaffuzu Dinle (de-DE)"
                    labelEn="Listen to Pronunciation (de-DE)"
                    compact
                  />
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-2">
                <p className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({
                    tr: 'Kart Gizli — Canlandırmaya Hazır',
                    en: 'Card Hidden — Ready to Act',
                  })}
                </p>
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({
                    tr: 'Hedef A2 ifadesini görmek için aşağıdaki düğmeyle kartı çevirin.',
                    en: 'Flip the card with the button below to view the target A2 expression.',
                  })}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClassroomRevealed((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] whitespace-nowrap"
              >
                {classroomRevealed ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>{tx({ tr: 'Kartı Gizle', en: 'Hide Card' })}</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>{tx({ tr: 'Hedef Kartı Göster', en: 'Show Target Card' })}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClassroomMarkGuessed}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4" />
                <span>
                  {isCurrentMastered
                    ? tx({ tr: 'Tekrar Tamamlandı', en: 'Completed Again' })
                    : tx({ tr: 'Tahmin Edildi (+10 A2 XP)', en: 'Guessed (+10 A2 XP)' })}
                </span>
              </button>
            </div>
          </div>

          {feedbackNotice && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-3 text-xs font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
            >
              <span>{feedbackNotice}</span>
              <button
                type="button"
                onClick={goNext}
                className="font-semibold underline whitespace-nowrap"
              >
                {tx({ tr: 'Sonraki Kart', en: 'Next Card' })}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
