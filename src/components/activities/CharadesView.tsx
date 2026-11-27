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
import { CHARADE_IDS, GERMAN_A1_CHARADES } from '../../data/germanA1Activities';
import type { NavRouteId } from '../../types';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { ActivitySubNav } from './ActivitySubNav';

interface CharadesViewProps {
  onNavigate: (route: NavRouteId) => void;
}

type CharadePlayMode = 'guess' | 'classroom';

export const CharadesView: React.FC<CharadesViewProps> = ({ onNavigate }) => {
  const { progress, rolePreview, recordActivityAnswer } = useAppState();
  const [playMode, setPlayMode] = useState<CharadePlayMode>(
    rolePreview === 'teacher' ? 'classroom' : 'guess'
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [revealedClueLevel, setRevealedClueLevel] = useState<1 | 2 | 3>(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Classroom / partner card reveal & 45s timer
  const [classroomRevealed, setClassroomRevealed] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);

  const currentCard = GERMAN_A1_CHARADES[cardIndex];
  const masteredSet = new Set(progress.activityMasteredIds);
  const completedCount = CHARADE_IDS.filter((id) => masteredSet.has(id)).length;
  const isCurrentMastered = masteredSet.has(currentCard.id);

  useEffect(() => {
    setRevealedClueLevel(1);
    setSelectedOption(null);
    setFeedbackNotice(null);
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
    const id = window.setTimeout(() => {
      setTimerSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [timerRunning, timerSeconds]);

  const handleSelectGuess = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentCard.correctIndex;
    const xp = recordActivityAnswer(
      currentCard.id,
      'charades',
      `Sessiz Sinema · ${currentCard.targetDe}`,
      isCorrect
    );
    setFeedbackNotice(
      isCorrect
        ? xp > 0
          ? `Doğru tahmin! +${xp} XP kazanıldı.`
          : 'Doğru tahmin! (Bu kart daha önce tamamlandığı için ek XP eklenmedi.)'
        : `Doğru yanıt: ${currentCard.targetDe} (${currentCard.targetTr}).`
    );
  };

  const handleClassroomSolved = () => {
    setTimerRunning(false);
    setClassroomRevealed(true);
    // Classroom self-check awards single-grant +10 XP without inflating scored A1 accuracy
    const xp = recordActivityAnswer(
      currentCard.id,
      'charades',
      `Sessiz Sinema (Sınıf) · ${currentCard.targetDe}`,
      true,
      undefined,
      false
    );
    setFeedbackNotice(
      xp > 0
        ? `Kart tahmin edildi olarak kaydedildi · +${xp} XP (öz-bildirim olduğu için puanlı doğruluk oranını şişirmez).`
        : 'Kart tekrar kaydedildi (daha önce tamamlandığı için ek XP eklenmedi).'
    );
  };

  const goPrev = () => {
    setCardIndex((prev) => (prev === 0 ? GERMAN_A1_CHARADES.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCardIndex((prev) => (prev + 1) % GERMAN_A1_CHARADES.length);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="sessiz-sinema" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Sessiz Sinema (Scharade)
            </span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Sessiz Sinema / Scharade — İpucu &amp; Mimik Kartları
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
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Çözülen Kart</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedCount} / {GERMAN_A1_CHARADES.length}
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Sessiz sinema çalışma modu"
          className="inline-flex rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={playMode === 'guess'}
            onClick={() => setPlayMode('guess')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
              playMode === 'guess'
                ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Bireysel Tahmin Modu</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={playMode === 'classroom'}
            onClick={() => setPlayMode('classroom')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
              playMode === 'classroom'
                ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Sınıf / Eşli Canlandırma Modu</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
          <span>
            Kart {cardIndex + 1} / {GERMAN_A1_CHARADES.length}
          </span>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Önceki kart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Sonraki kart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Card Stage */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div className="flex items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {currentCard.categoryTr}
            </span>
            <span aria-hidden="true">·</span>
            <span>Kart 0{cardIndex + 1}</span>
          </div>
          {isCurrentMastered ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Tamamlandı</span>
            </span>
          ) : (
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
              İlk doğru tahmin +10 XP
            </span>
          )}
        </div>

        {/* Progressive 3-Tier Clue Deck */}
        <div className="space-y-3">
          <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
            <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              İpucu 1 · Mimik &amp; Beden Dili (Türkçe)
            </p>
            <p className="mt-1.5 text-sm sm:text-base font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
              {currentCard.mimeCueTr}
            </p>
          </div>

          {revealedClueLevel >= 2 && (
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                İpucu 2 · Almanca A1 Bağlam İpucu
              </p>
              <p className="text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
                “{currentCard.germanClueDe}”
              </p>
              <ModelAudioBar textDe={currentCard.germanClueDe} labelTr="İpucunu Dinle" compact />
            </div>
          )}

          {revealedClueLevel >= 3 && (
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <p className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
                İpucu 3 · Artikel / Dilbilgisi İpucu
              </p>
              <p className="mt-1 text-sm text-[#111113] dark:text-[#F4F4F5]">
                {currentCard.grammarHintTr}
              </p>
            </div>
          )}

          {revealedClueLevel < 3 && (
            <button
              type="button"
              onClick={() =>
                setRevealedClueLevel((prev) => (prev === 1 ? 2 : 3))
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
            >
              <Lightbulb className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
              <span>
                {revealedClueLevel === 1
                  ? '2. İpucunu Aç (Almanca A1 Cümle)'
                  : '3. İpucunu Aç (Artikel / Tür İpucu)'}
              </span>
            </button>
          )}
        </div>

        {/* Mode 1: Solo 4-Option Guessing */}
        {playMode === 'guess' && (
          <div className="space-y-4 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
            <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Hangi Almanca A1 sözcüğü veya eylemi anlatılıyor?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCard.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOpt = idx === currentCard.correctIndex;
                const answered = selectedOption !== null;

                let btnStyle =
                  'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';
                if (answered && isCorrectOpt) {
                  btnStyle =
                    'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80] dark:bg-[#0F2417] dark:text-[#BBF7D0]';
                } else if (answered && isSelected && !isCorrectOpt) {
                  btnStyle =
                    'border-[#B91C1C] bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171] dark:bg-[#2A1215] dark:text-[#FECACA]';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelectGuess(idx)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${btnStyle}`}
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

            {selectedOption !== null && (
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {feedbackNotice}
                </p>
                <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {currentCard.explanationTr}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <ModelAudioBar
                    textDe={currentCard.targetDe}
                    labelTr={`Telaffuzu Dinle: ${currentCard.targetDe}`}
                    compact
                  />
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
                  >
                    <span>Sonraki Kart</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Classroom / Partner Charade Mode */}
        {playMode === 'classroom' && (
          <div className="space-y-4 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <div>
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    Yerel Canlandırma Sayacı
                  </p>
                  <p className="font-mono text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    00:{String(timerSeconds).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTimerRunning((r) => !r)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <span>
                    {timerRunning
                      ? 'Duraklat'
                      : timerSeconds === 0
                      ? 'Süre Doldu'
                      : 'Sayacı Başlat'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(45);
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>45 sn Sıfırla</span>
                </button>
              </div>
            </div>

            {/* Secret Target Word Card */}
            <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-3 dark:border-[#282830] dark:bg-[#111113]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
                  Anlatılacak Hedef Kelime (Yalnızca anlatan kişi açmalı)
                </span>
                <button
                  type="button"
                  onClick={() => setClassroomRevealed((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                >
                  {classroomRevealed ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  <span>{classroomRevealed ? 'Kelimeyi Gizle' : 'Hedef Kelimeyi Göster'}</span>
                </button>
              </div>

              {classroomRevealed ? (
                <div className="space-y-2.5 pt-1">
                  <p className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {currentCard.targetDe}{' '}
                    <span className="text-base font-normal text-[#52525B] dark:text-[#A1A1AA]">
                      ({currentCard.targetTr})
                    </span>
                  </p>
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {currentCard.explanationTr}
                  </p>
                  <ModelAudioBar
                    textDe={currentCard.targetDe}
                    labelTr="Telaffuzu Dinle"
                    compact
                  />
                </div>
              ) : (
                <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  Hedef kelime gizli. Anlatıcı “Hedef Kelimeyi Göster” düğmesine basarak kelimeyi görebilir.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {feedbackNotice ? (
                <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                  {feedbackNotice}
                </span>
              ) : (
                <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  Grup doğru tahmin ettiğinde kartı tamamlandı olarak işaretleyebilirsiniz.
                </span>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClassroomSolved}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isCurrentMastered ? 'Tekrar Kaydet (0 XP)' : 'Tahmin Edildi (+10 XP)'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                >
                  <span>Sonraki</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
