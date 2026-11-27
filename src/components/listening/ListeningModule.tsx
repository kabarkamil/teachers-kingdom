import React, { useEffect, useState } from 'react';
import { Headphones } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  GERMAN_A1_LISTENING_SCENARIOS,
  TOTAL_LISTENING_EXERCISES,
  getListeningScenarioById,
  getScenarioExerciseIds,
} from '../../data/germanA1Listening';
import { DialogueAudioPlayer } from './DialogueAudioPlayer';
import { ListeningExercises } from './ListeningExercises';

interface ListeningModuleProps {
  initialScenarioId?: string;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({ initialScenarioId }) => {
  const { progress, listeningAccuracyPercent, rolePreview } = useAppState();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId ?? GERMAN_A1_LISTENING_SCENARIOS[0].id
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialScenarioId) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  const activeScenario = getListeningScenarioById(selectedScenarioId);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* Header & Real Listening Metrics */}
      <div className="flex flex-col gap-5 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Öğrenme Alanı</span>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Hören
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span>Öğretmen Önizleme Görünümü</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Almanca A1 Dinleme (Hören) Atölyesi
          </h1>
        </div>

        {/* Real Progress Strip (strictly from localStorage) */}
        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Dinleme Sorusu</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {progress.listeningMasteredIds.length} / {TOTAL_LISTENING_EXERCISES}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Dinleme Doğruluğu</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {listeningAccuracyPercent === null ? '—' : `%${listeningAccuracyPercent}`}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Authentic A1 Scenario Selector */}
      <section aria-labelledby="horen-scenario-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="horen-scenario-heading"
            className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]"
          >
            1. Dinleme Senaryosu Seçin
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            4 A1 Günlük Bağlam · {TOTAL_LISTENING_EXERCISES} Alıştırma
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_LISTENING_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            const exerciseIds = getScenarioExerciseIds(scenario);
            const completedCount = exerciseIds.filter((id) =>
              progress.listeningMasteredIds.includes(id)
            ).length;
            const imgFailed = failedImages[scenario.id];

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                aria-pressed={isSelected}
                className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[#7C1D2E] bg-[#FFFFFF] ring-1 ring-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#16161A] dark:ring-[#D9A13B]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161A]">
                  {!imgFailed ? (
                    <img
                      src={scenario.imageUrl}
                      alt={scenario.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [scenario.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#16161A] to-[#3B1520] p-4 text-center text-[#F4F4F5]">
                      <Headphones className="h-7 w-7 text-[#D9A13B]" />
                      <span className="mt-2 font-display text-xs">{scenario.titleDe}</span>
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2 text-white">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] text-white/80">{scenario.titleDe}</p>
                      <p className="font-display text-sm font-semibold leading-snug">
                        {scenario.titleTr}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#F5D08A] tabular-nums shrink-0">
                      {completedCount}/{exerciseIds.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {scenario.subtitleTr}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.lines.length} replik · 3 görev
                    </span>
                    <span
                      className={`font-semibold ${
                        isSelected
                          ? 'text-[#7C1D2E] dark:text-[#D9A13B]'
                          : 'text-[#111113] dark:text-[#E4E4E7]'
                      }`}
                    >
                      {isSelected ? 'Seçili' : 'Seç'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Scenario Audio Player + Hidden-by-Default Transcript */}
      <section aria-label="Ses oynatıcı ve diyalog metni">
        <DialogueAudioPlayer scenario={activeScenario} />
      </section>

      {/* Active Scenario 3-Part Interactive Exercises */}
      <section aria-label="Dinleme anlama alıştırmaları" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
            2. Etkileşimli Dinleme Alıştırmaları
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            Her ilk doğru yanıt +10 XP kazandırır
          </span>
        </div>

        <ListeningExercises scenario={activeScenario} />
      </section>
    </div>
  );
};
