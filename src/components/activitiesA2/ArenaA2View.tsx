import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Swords,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { A2_ARENA_IDS, GERMAN_A2_ARENA_ITEMS } from '../../data/germanA2Activities';
import type { ArenaItem, NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivityA2SubNav } from './ActivityA2SubNav';

interface ArenaA2ViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type ArenaFormat = 'streak' | 'timed';
type ArenaPhase = 'lobby' | 'playing' | 'summary';

const TIMED_ROUND_SECONDS = 60;

function shuffleA2Items(items: ArenaItem[]): ArenaItem[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const ArenaA2View: React.FC<ArenaA2ViewProps> = ({ onNavigate }) => {
  const { a2Progress, uiLanguage, recordA2ActivityAnswer } = useAppState();
  const isEn = uiLanguage === 'en';
  const [format, setFormat] = useState<ArenaFormat>('streak');
  const [phase, setPhase] = useState<ArenaPhase>('lobby');
  const [deck, setDeck] = useState<ArenaItem[]>(GERMAN_A2_ARENA_ITEMS);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionBestStreak, setSessionBestStreak] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [lastXpAwarded, setLastXpAwarded] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TIMED_ROUND_SECONDS);

  const currentItem = deck[questionIdx];
  const masteredCount = A2_ARENA_IDS.filter((id) =>
    a2Progress.activityMasteredIds.includes(id)
  ).length;

  useEffect(() => {
    if (phase !== 'playing' || format !== 'timed') return;
    if (secondsLeft <= 0) {
      setPhase('summary');
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhase('summary');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, format, secondsLeft]);

  const startRound = (chosenFormat: ArenaFormat) => {
    setFormat(chosenFormat);
    setDeck(shuffleA2Items(GERMAN_A2_ARENA_ITEMS));
    setPhase('playing');
    setQuestionIdx(0);
    setSelectedIdx(null);
    setCurrentStreak(0);
    setSessionBestStreak(0);
    setSessionCorrect(0);
    setSessionAnswered(0);
    setSessionXpEarned(0);
    setLastXpAwarded(null);
    setSecondsLeft(TIMED_ROUND_SECONDS);
  };

  const handleAnswer = (optIdx: number) => {
    if (selectedIdx !== null || !currentItem) return;
    setSelectedIdx(optIdx);
    const isCorrect = optIdx === currentItem.correctIndex;
    const nextStreak = isCorrect ? currentStreak + 1 : 0;
    setCurrentStreak(nextStreak);
    setSessionBestStreak((prev) => Math.max(prev, nextStreak));
    setSessionAnswered((prev) => prev + 1);
    if (isCorrect) setSessionCorrect((prev) => prev + 1);

    const xp = recordA2ActivityAnswer(
      currentItem.id,
      'arena',
      `${currentItem.categoryLabelTr} · ${currentItem.options[currentItem.correctIndex]}`,
      isCorrect,
      nextStreak,
      true
    );
    setLastXpAwarded(xp);
    setSessionXpEarned((prev) => prev + xp);
  };

  const handleNext = () => {
    if (questionIdx + 1 >= GERMAN_A2_ARENA_ITEMS.length) {
      setPhase('summary');
      return;
    }
    setQuestionIdx((prev) => prev + 1);
    setSelectedIdx(null);
    setLastXpAwarded(null);
  };

  const sessionAccuracy =
    sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="arena" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A2 · Hızlı Tekrar Arenası (Bireysel)
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            A2 Arena — Seri &amp; 60 Saniyelik Hız Turu
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {isEn ? 'A2 Best Streak' : 'A2 En İyi Seri'}
            </p>
            <p className="font-mono text-xl font-semibold text-[#7A1C24] dark:text-[#D4AF37] tabular-nums">
              {a2Progress.a2ArenaBestStreak}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {isEn ? 'Mastered A2' : 'Ustalaşılan A2 Soru'}
            </p>
            <p className="font-mono text-xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF] tabular-nums">
              {masteredCount} / {GERMAN_A2_ARENA_ITEMS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {isEn ? 'Total A2 XP' : 'Toplam A2 XP'}
            </p>
            <p className="font-mono text-xl font-semibold text-[#0D0D0D] dark:text-[#D4AF37] tabular-nums">
              {a2Progress.xp}
            </p>
          </div>
        </div>
      </div>

      {/* Lobby */}
      {phase === 'lobby' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                <Flame className="h-4 w-4" />
                <span>Seri Modu · Süresiz Odak</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                12 Soruluk A2 Seri Turu
              </h2>
              <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                Süresiz 12 A2 sorusuyla kişisel seri rekorunuzu geliştirin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startRound('streak')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>A2 Seri Modunu Başlat</span>
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                <Clock className="h-4 w-4" />
                <span>Hız Turu · 60 Saniye</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                60 Saniyelik A2 Hızlı Tekrar
              </h2>
              <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                60 saniyede A2 sözcük ve yan cümle hızınızı ölçün (ilk ustalaşmada +10 A2 XP).
              </p>
            </div>
            <button
              type="button"
              onClick={() => startRound('timed')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-semibold text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#23232B] dark:text-[#F4F4F5] dark:hover:bg-[#2E2E38]"
            >
              <Swords className="h-4 w-4 text-[#D9A13B]" />
              <span>60 Saniye Turunu Başlat</span>
            </button>
          </div>
        </div>
      )}

      {/* Playing */}
      {phase === 'playing' && currentItem && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B] tabular-nums">
                Soru {questionIdx + 1} / {GERMAN_A2_ARENA_ITEMS.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#52525B] dark:text-[#A1A1AA]">
                {currentItem.categoryLabelTr}
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs font-semibold tabular-nums">
              <span className="inline-flex items-center gap-1.5 text-[#7C1D2E] dark:text-[#D9A13B]">
                <Flame className="h-4 w-4" />
                <span>Seri: {currentStreak}</span>
              </span>
              {format === 'timed' && (
                <span
                  className={`inline-flex items-center gap-1.5 ${
                    secondsLeft <= 10
                      ? 'text-[#B91C1C] dark:text-[#F87171]'
                      : 'text-[#111113] dark:text-[#F4F4F5]'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{secondsLeft} sn</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => setPhase('summary')}
                className="text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
              >
                Turu Bitir
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
              {currentItem.promptSubTr}
            </h2>
            {currentItem.promptDe && (
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-base sm:text-lg font-medium text-[#111113] dark:text-[#F4F4F5]">
                  {currentItem.promptDe}
                </p>
                <ModelAudioBar
                  textDe={currentItem.audioTextDe ?? currentItem.promptDe.replace(/___+/g, '...')}
                  labelTr="İfadeyi Dinle (de-DE)"
                  compact
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrectOpt = idx === currentItem.correctIndex;
              let styleClass =
                'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
              if (selectedIdx !== null) {
                if (isCorrectOpt) {
                  styleClass =
                    'border-[#15803D] bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80] dark:bg-[#0D2315] dark:text-[#86EFAC]';
                } else if (isSelected) {
                  styleClass =
                    'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#F87171] dark:bg-[#3B1014] dark:text-[#FCA5A5]';
                } else {
                  styleClass =
                    'border-[#ECECE8] bg-[#F6F6F4]/60 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/60 dark:text-[#71717A]';
                }
              }
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={selectedIdx !== null}
                  onClick={() => handleAnswer(idx)}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors ${styleClass}`}
                >
                  <span>{opt}</span>
                  {selectedIdx !== null && isCorrectOpt && (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  )}
                  {selectedIdx !== null && isSelected && !isCorrectOpt && (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedIdx !== null && (
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C] dark:bg-[#111113]">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {selectedIdx === currentItem.correctIndex
                    ? lastXpAwarded && lastXpAwarded > 0
                      ? `Doğru · +${lastXpAwarded} A2 XP kazanıldı`
                      : 'Doğru (bu A2 sorusu daha önce tamamlandığı için 0 ek XP)'
                    : 'Tekrar edilmeli'}
                </p>
                <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {currentItem.explanationTr}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#7C1D2E] px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap shrink-0"
              >
                {questionIdx + 1 >= GERMAN_A2_ARENA_ITEMS.length
                  ? 'Sonuçları Gör'
                  : 'Sonraki Soru'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Summary */}
      {phase === 'summary' && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-6 w-6 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                A2 Arena Turu Tamamlandı
              </h2>
              <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                {format === 'timed'
                  ? '60 saniyelik A2 hız turu özeti'
                  : '12 soruluk A2 seri turu özeti'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Doğru / Yanıt</p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {sessionCorrect} / {sessionAnswered}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tur Doğruluğu</p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                %{sessionAccuracy}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tur / En İyi Seri</p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {sessionBestStreak} / {a2Progress.a2ArenaBestStreak}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Yeni A2 XP</p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#15803D] dark:text-[#4ADE80] tabular-nums">
                +{sessionXpEarned} XP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => startRound(format)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Aynı Modda Tekrar Oyna</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('lobby')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs sm:text-sm font-medium text-[#0D0D0D] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF]"
            >
              <span>{isEn ? 'Back to Modes' : 'Mod Seçimine Dön'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-xs sm:text-sm font-medium text-[#7A1C24] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#D4AF37]"
            >
              <span>{isEn ? 'View Progress' : 'İlerlememi Gör'}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
