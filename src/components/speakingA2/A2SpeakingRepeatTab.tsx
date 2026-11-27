import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { A2SpeakingScenario } from '../../types';
import { stopGermanSpeech } from '../../utils/speech';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { SpeechTranscriptHelper } from '../speaking/SpeechTranscriptHelper';

interface A2SpeakingRepeatTabProps {
  scenario: A2SpeakingScenario;
}

export const A2SpeakingRepeatTab: React.FC<A2SpeakingRepeatTabProps> = ({ scenario }) => {
  const { a2Progress, recordA2SpeakingCompletion } = useAppState();
  const items = scenario.repeatItems;

  const [index, setIndex] = useState(0);
  const [showTurkish, setShowTurkish] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean[]>>({});
  const [completedBanner, setCompletedBanner] = useState<{
    taskId: string;
    xpAwarded: number;
  } | null>(null);

  useEffect(() => {
    setIndex(0);
    setShowTurkish(false);
    setCompletedBanner(null);
    stopGermanSpeech();
  }, [scenario.id]);

  const item = items[index];
  if (!item) return null;

  const isMastered = a2Progress.speakingMasteredIds.includes(item.id);
  const checks = checkedMap[item.id] ?? item.selfCheckCriteria.map(() => false);
  const allChecked = checks.every(Boolean);

  const handleToggleCheck = (criterionIdx: number) => {
    setCheckedMap((prev) => {
      const current = prev[item.id] ?? item.selfCheckCriteria.map(() => false);
      const next = current.map((v, i) => (i === criterionIdx ? !v : v));
      return { ...prev, [item.id]: next };
    });
  };

  const handleComplete = () => {
    if (!allChecked) return;
    const xpAwarded = recordA2SpeakingCompletion(
      item.id,
      scenario.id,
      'repeat',
      `${scenario.titleTr} · A2 Kalıp ${index + 1}`
    );
    setCompletedBanner({ taskId: item.id, xpAwarded });
  };

  const handleResetChecks = () => {
    setCheckedMap((prev) => ({
      ...prev,
      [item.id]: item.selfCheckCriteria.map(() => false),
    }));
    setCompletedBanner(null);
  };

  const handleMove = (delta: number) => {
    stopGermanSpeech();
    setIndex((prev) => (prev + delta + items.length) % items.length);
    setShowTurkish(false);
    setCompletedBanner(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
        <span>
          <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            1. Telaffuz &amp; Kalıp Tekrarı
          </strong>{' '}
          · 0.8× veya 1.0× hızda dinleyip sesli tekrarlayın.
        </span>
        <span className="font-mono tabular-nums">
          Kalıp {index + 1} / {items.length}
        </span>
      </div>

      {/* Main A2 Phrase Card */}
      <article className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-3.5 text-xs dark:border-[#24242C]">
          <span className="font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
            A2 Odak Yapı: {item.pronunciationFocusDe}
          </span>
          <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">
            {scenario.registerLabelTr} ·{' '}
            {isMastered ? (
              <span className="font-semibold text-[#15803D] dark:text-[#4ADE80]">
                Tamamlandı
              </span>
            ) : (
              'Yeni Görev (+10 A2 XP)'
            )}
          </span>
        </div>

        <div className="space-y-3">
          <p className="font-display text-2xl sm:text-[1.75rem] font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
            {item.phraseDe}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTurkish((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
            >
              {showTurkish ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showTurkish ? 'Türkçe Anlamı Gizle' : 'Türkçe Anlamı Göster'}</span>
            </button>
          </div>

          {showTurkish && (
            <p className="text-sm font-medium text-[#52525B] dark:text-[#D4D4D8]">
              {item.phraseTr}
            </p>
          )}
        </div>

        {/* Verified speech.ts Audio Bar (0.8x / 1.0x) */}
        <ModelAudioBar
          textDe={item.phraseDe}
          labelTr="A2 Modelini Dinle (de-DE)"
          speakerGender={item.speakerGender}
        />

        {/* Pronunciation & Grammar Tip */}
        <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/80 p-4 text-xs leading-relaxed text-[#52525B] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#A1A1AA]">
          <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Telaffuz ve A2 Yapı İpucu:{' '}
          </strong>
          {item.pronunciationTipTr}
        </div>

        {/* Optional Browser SpeechRecognition Helper (Honest, no AI scoring claim) */}
        <SpeechTranscriptHelper taskId={item.id} />

        {/* Self-Check Rubric */}
        <div className="space-y-3 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Öz-Değerlendirme Kontrol Listesi (3 Adım)
            </p>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {checks.filter(Boolean).length} / {checks.length}
            </span>
          </div>

          <div className="space-y-2">
            {item.selfCheckCriteria.map((criterion, cIdx) => (
              <label
                key={criterion}
                className="flex items-start gap-2.5 rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/50 px-3.5 py-2.5 text-xs sm:text-sm text-[#111113] cursor-pointer hover:bg-[#ECECE8]/60 dark:border-[#24242C] dark:bg-[#111113] dark:text-[#E4E4E7] dark:hover:bg-[#1E1E24]"
              >
                <input
                  type="checkbox"
                  checked={checks[cIdx] ?? false}
                  onChange={() => handleToggleCheck(cIdx)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#7C1D2E] dark:accent-[#D9A13B] shrink-0"
                />
                <span>{criterion}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!allChecked}
                onClick={handleComplete}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isMastered ? 'Tekrarı Kaydet (0 XP)' : 'Pratiği Tamamla (+10 A2 XP)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleResetChecks}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>İşaretleri Sıfırla</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMove(-1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Önceki</span>
              </button>
              <button
                type="button"
                onClick={() => handleMove(1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <span>Sonraki</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {completedBanner && completedBanner.taskId === item.id && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
            >
              <span>
                A2 telaffuz ve kalıp tekrarı yerel A2 ilerlemenize kaydedildi.
              </span>
              <span className="font-mono font-semibold tabular-nums shrink-0">
                {completedBanner.xpAwarded > 0
                  ? `+${completedBanner.xpAwarded} A2 XP`
                  : '0 XP (Daha önce kazanıldı)'}
              </span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
