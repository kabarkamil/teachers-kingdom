import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Headphones, Target } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  GERMAN_A2_LISTENING_SCENARIOS,
  TOTAL_A2_LISTENING_EXERCISES,
  getA2ListeningExerciseIds,
  getA2ListeningScenarioById,
} from '../../data/germanA2Listening';
import { A2DialogueAudioPlayer } from './A2DialogueAudioPlayer';
import { A2ListeningExercises } from './A2ListeningExercises';

interface ListeningA2ModuleProps {
  initialScenarioId?: string;
}

export const ListeningA2Module: React.FC<ListeningA2ModuleProps> = ({ initialScenarioId }) => {
  const { a2Progress, a2ListeningAccuracyPercent } = useAppState();
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    initialScenarioId && getA2ListeningScenarioById(initialScenarioId)
      ? initialScenarioId
      : GERMAN_A2_LISTENING_SCENARIOS[0].id
  );
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialScenarioId && getA2ListeningScenarioById(initialScenarioId)) {
      setActiveScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  const activeScenario =
    getA2ListeningScenarioById(activeScenarioId) ?? GERMAN_A2_LISTENING_SCENARIOS[0];

  const masteredListeningCount = a2Progress.listeningMasteredIds.length;
  const listeningCompletionPercent =
    TOTAL_A2_LISTENING_EXERCISES > 0
      ? Math.round((masteredListeningCount / TOTAL_A2_LISTENING_EXERCISES) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <header className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-7 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              <Headphones className="h-4 w-4" />
              <span>ALMANCA CEFR A2 · AŞAMA 2 · HÖREN</span>
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
              A2 Dinleme (Hören) Stüdyosu
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 py-2.5 dark:border-[#282830] dark:bg-[#111113]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80]" />
                <span>A2 Dinleme</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {masteredListeningCount}/{TOTAL_A2_LISTENING_EXERCISES}
              </p>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] tabular-nums">
                %{listeningCompletionPercent} tamamlandı
              </p>
            </div>

            <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 py-2.5 dark:border-[#282830] dark:bg-[#111113]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                <Target className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>Doğruluk</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2ListeningAccuracyPercent !== null ? `%${a2ListeningAccuracyPercent}` : '—'}
              </p>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] tabular-nums">
                {a2Progress.listeningAttempts} deneme
              </p>
            </div>

            <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 py-2.5 dark:border-[#282830] dark:bg-[#111113]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                <Award className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
                <span>A2 XP</span>
              </div>
              <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.xp}
              </p>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">İzole A2 puanı</p>
            </div>
          </div>
        </div>
      </header>

      {/* Scenario Selector Grid */}
      <section aria-label="A2 dinleme senaryoları">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
            Senaryo Seçin ({GERMAN_A2_LISTENING_SCENARIOS.length} Özgün A2 Diyalog)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A2_LISTENING_SCENARIOS.map((scenario, idx) => {
            const isSelected = scenario.id === activeScenario.id;
            const ids = getA2ListeningExerciseIds(scenario);
            const done = ids.filter((id) => a2Progress.listeningMasteredIds.includes(id)).length;
            const pct = ids.length > 0 ? Math.round((done / ids.length) * 100) : 0;

            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setActiveScenarioId(scenario.id)}
                aria-pressed={isSelected}
                className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#7C1D2E] bg-[#FFFFFF] ring-2 ring-[#7C1D2E]/20 dark:border-[#D9A13B] dark:bg-[#16161A] dark:ring-[#D9A13B]/25'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#D9A13B]/60'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#18181B]">
                  {!brokenImages[scenario.id] ? (
                    <img
                      src={scenario.imageUrl}
                      alt={scenario.imageAlt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [scenario.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#18181B] via-[#27272A] to-[#7C1D2E]/60 text-[#F6F6F4]">
                      <Headphones className="h-8 w-8 opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113]/80 via-[#111113]/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#F6F6F4]">
                    <span>0{idx + 1} · {scenario.contextLabelTr}</span>
                    <span>{done}/{ids.length}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {scenario.titleDe}
                    </p>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {scenario.titleTr}
                    </p>
                  </div>

                  <div className="mt-3.5 space-y-1.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-sm bg-[#ECECE8] dark:bg-[#24242C]">
                      <div
                        className="h-full bg-[#7C1D2E] dark:bg-[#D9A13B]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
                      <span>{isSelected ? 'Aktif Senaryo' : 'Seç ve Dinle'}</span>
                      <span className="font-mono tabular-nums">%{pct}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Scenario Audio Player */}
      <A2DialogueAudioPlayer scenario={activeScenario} />

      {/* Active Scenario Comprehension Exercises */}
      <A2ListeningExercises scenario={activeScenario} />
    </div>
  );
};
