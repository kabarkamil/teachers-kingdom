import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ARENA_IDS, GERMAN_A1_ARENA_ITEMS } from '../../data/germanA1Activities';
import type { ArenaItem, NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivitySubNav } from './ActivitySubNav';

interface ArenaViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type ArenaMode = 'streak' | 'timed60';
type ArenaPhase = 'ready' | 'playing' | 'summary';

function shuffleItems(items: ArenaItem[]): ArenaItem[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ onNavigate }) => {
  const { progress, recordActivityAnswer } = useAppState();
  const [arenaMode, setArenaMode] = useState<ArenaMode>('streak');
  const [phase, setPhase] = useState<ArenaPhase>('ready');
  const [deck, setDeck] = useState<ArenaItem[]>(GERMAN_A1_ARENA_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [roundBestStreak, setRoundBestStreak] = useState(0);
  const [roundCorrect, setRoundCorrect] = useState(0);
  const [roundAnswered, setRoundAnswered] = useState(0);
  const [roundXpEarned, setRoundXpEarned] = useState(0);

  const masteredCount = ARENA_IDS.filter((id) =>
    progress.activityMasteredIds.includes(id)
  ).length;

  useEffect(() => {
    if (phase !== 'playing' || arenaMode !== 'timed60') return;
    if (secondsLeft <= 0) {
      setPhase('summary');
      return;
    }
    const id = window.setTimeout(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [phase, arenaMode, secondsLeft]);

  const startRound = (mode: ArenaMode) => {
    setArenaMode(mode);
    setDeck(shuffleItems(GERMAN_A1_ARENA_ITEMS));
    setCurrentIndex(0);
    setSelectedOption(null);
    setSecondsLeft(60);
    setStreak(0);
    setRoundBestStreak(0);
    setRoundCorrect(0);
    setRoundAnswered(0);
    setRoundXpEarned(0);
    setPhase('playing');
  };

  const currentItem = deck[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (selectedOption !== null || !currentItem) return;
    setSelectedOption(optIdx);

    const isCorrect = optIdx === currentItem.correctIndex;
    const nextStreak = isCorrect ? streak + 1 : 0;
    const nextBest = Math.max(roundBestStreak, nextStreak);
    setStreak(nextStreak);
    setRoundBestStreak(nextBest);
    setRoundAnswered((n) => n + 1);
    if (isCorrect) {
      setRoundCorrect((n) => n + 1);
    }

    const xp = recordActivityAnswer(
      currentItem.id,
      'arena',
      `Arena (${currentItem.categoryLabelTr}) · ${currentItem.promptDe}`,
      isCorrect,
      nextStreak
    );
    if (xp > 0) {
      setRoundXpEarned((prev) => prev + xp);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= deck.length) {
      setPhase('summary');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
  };

  const roundAccuracy =
    roundAnswered > 0 ? Math.round((roundCorrect / roundAnswered) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="arena" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Hızlı Tekrar Arenası
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Arena — Süreli ve Seri A1 Hızlı Tekrar
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">En İyi Seri</p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {progress.arenaBestStreak}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Ustalaşılan</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {masteredCount} / {GERMAN_A1_ARENA_ITEMS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
        </div>
      </div>

      {/* Ready Screen */}
      {phase === 'ready' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                <Flame className="h-4 w-4" />
                <span>Süresiz Odak · 12 A1 Sorusu</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Seri Modu (Streak Pratiği)
              </h2>
              <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                Süresiz 12 karışık A1 sorusuyla doğru yanıt serinizi geliştirin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startRound('streak')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Seri Modunu Başlat</span>
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                <Clock className="h-4 w-4" />
                <span>60 Saniye · Hızlı Refleks</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                60 Saniye Hız Turu
              </h2>
              <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                60 saniyelik geri sayımda A1 artikel ve kelime refleksinizi ölçün.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startRound('timed60')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-semibold text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#23232B] dark:text-[#F4F4F5] dark:hover:bg-[#2E2E38]"
            >
              <Clock className="h-4 w-4 text-[#D9A13B]" />
              <span>60 Saniye Turunu Başlat</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Round */}
      {phase === 'playing' && currentItem && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          {/* Live Round Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                Soru {currentIndex + 1} / {deck.length}
              </span>
              <span className="text-[#52525B] dark:text-[#A1A1AA]">
                {currentItem.categoryLabelTr}
              </span>
              <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                <Flame className="h-3.5 w-3.5" />
                Seri: {streak}
              </span>
              {arenaMode === 'timed60' && (
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  <Clock className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
                  {secondsLeft} sn
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPhase('summary')}
              className="text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
            >
              Turu Bitir
            </button>
          </div>

          {/* Prompt */}
          <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">{currentItem.promptSubTr}</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {currentItem.promptDe}
            </p>
            {currentItem.audioTextDe && (
              <ModelAudioBar textDe={currentItem.audioTextDe} labelTr="Dinle" compact />
            )}
          </div>

          {/* Options */}
          <div
            className={`grid gap-3 ${
              currentItem.options.length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {currentItem.options.map((opt, idx) => {
              const answered = selectedOption !== null;
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentItem.correctIndex;

              let btnClass =
                'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
              if (answered && isCorrectOpt) {
                btnClass =
                  'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80] dark:bg-[#0F2417] dark:text-[#BBF7D0]';
              } else if (answered && isSelected && !isCorrectOpt) {
                btnClass =
                  'border-[#B91C1C] bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171] dark:bg-[#2A1215] dark:text-[#FECACA]';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm sm:text-base font-medium transition-colors ${btnClass}`}
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

          {/* Explanation & Next */}
          {selectedOption !== null && (
            <div className="flex flex-col gap-3 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs sm:text-sm text-[#111113] dark:text-[#E4E4E7]">
                {currentItem.explanationTr}
              </p>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap shrink-0"
              >
                {currentIndex + 1 >= deck.length ? 'Sonucu Gör' : 'Sonraki Soru'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* Round Summary */}
      {phase === 'summary' && (
        <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex items-center gap-3">
            <Trophy className="h-7 w-7 text-[#9A6B16] dark:text-[#D9A13B]" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Arena Turu Tamamlandı
              </h2>
              <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                {arenaMode === 'timed60' ? '60 Saniye Hız Turu' : 'Seri Modu'} · Gerçek yerel tur sonuçlarınız
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Doğru / Yanıtlanan</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {roundCorrect} / {roundAnswered}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tur Doğruluğu</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {roundAnswered === 0 ? '—' : `%${roundAccuracy}`}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tur En İyi Serisi</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {roundBestStreak}
              </p>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Bu Turda Yeni XP</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-[#15803D] dark:text-[#4ADE80] tabular-nums">
                +{roundXpEarned} XP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => startRound(arenaMode)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Karışık Yeni Tur Başlat</span>
            </button>
            <button
              type="button"
              onClick={() => setPhase('ready')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF]"
            >
              <span>Mod Seçimine Dön</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#7A1C24] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#D4AF37]"
            >
              <span>İlerlememi Gör</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
