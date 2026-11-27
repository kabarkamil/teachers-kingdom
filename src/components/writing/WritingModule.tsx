import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardList, Mail, PenTool, Puzzle } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  GERMAN_A1_WRITING_SCENARIOS,
  TOTAL_WRITING_TASKS,
  getWritingScenarioById,
  getWritingScenarioExerciseIds,
} from '../../data/germanA1Writing';
import { useI18n } from '../../hooks/useI18n';
import type { WritingTaskKind } from '../../types';
import { WritingControlledTasks } from './WritingControlledTasks';
import { WritingFormTask } from './WritingFormTask';
import { WritingMessageTask } from './WritingMessageTask';

interface WritingModuleProps {
  initialScenarioId?: string;
}

export const WritingModule: React.FC<WritingModuleProps> = ({ initialScenarioId }) => {
  const { progress, writingAccuracyPercent, rolePreview } = useAppState();
  const { locale, tx } = useI18n();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId ?? GERMAN_A1_WRITING_SCENARIOS[0].id
  );
  const [activeTab, setActiveTab] = useState<WritingTaskKind>('form');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialScenarioId) {
      setSelectedScenarioId(initialScenarioId);
    }
  }, [initialScenarioId]);

  const activeScenario = getWritingScenarioById(selectedScenarioId);
  const formDone = progress.writingMasteredIds.includes(activeScenario.formTask.id);
  const messageDone = progress.writingMasteredIds.includes(activeScenario.messageTask.id);
  const controlledDoneCount = activeScenario.controlledItems.filter((item) =>
    progress.writingMasteredIds.includes(item.id)
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* Header & Real Writing Metrics */}
      <div className="flex flex-col gap-5 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>{locale.navGroups.learning}</span>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {tx({ tr: 'Almanca A1 · Schreiben', en: 'German A1 · Schreiben' })}
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span>
                  {tx({ tr: 'Öğretmen Önizleme Görünümü', en: 'Teacher Preview Mode' })}
                </span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Almanca A1 Yazma (Schreiben) Atölyesi',
              en: 'German A1 Writing (Schreiben) Workshop',
            })}
          </h1>
        </div>

        {/* Real Progress Strip (strictly from localStorage) */}
        <div className="flex flex-wrap items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">{locale.common.totalXp}</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Yazma Görevi', en: 'Writing Tasks' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {progress.writingMasteredIds.length} / {TOTAL_WRITING_TASKS}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Yazma Doğruluğu', en: 'Writing Accuracy' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {writingAccuracyPercent === null
                ? '—'
                : tx({ tr: '%{{n}}', en: '{{n}}%' }, { n: writingAccuracyPercent })}
            </p>
          </div>
        </div>
      </div>

      {/* 1. Scenario Selector Cards */}
      <section aria-labelledby="schreiben-scenario-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="schreiben-scenario-heading"
            className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]"
          >
            {tx({ tr: '1. Yazma Bağlamı Seçin', en: '1. Select a Writing Context' })}
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx(
              {
                tr: '4 Günlük A1 Bağlamı · {{count}} Görev',
                en: '4 Everyday A1 Contexts · {{count}} Tasks',
              },
              { count: TOTAL_WRITING_TASKS }
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GERMAN_A1_WRITING_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            const ids = getWritingScenarioExerciseIds(scenario);
            const completedCount = ids.filter((id) =>
              progress.writingMasteredIds.includes(id)
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
                      <PenTool className="h-7 w-7 text-[#D9A13B]" />
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
                      {completedCount}/{ids.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3.5">
                  <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {scenario.subtitleTr}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#52525B] dark:text-[#A1A1AA] truncate">
                      {scenario.contextLabelTr}
                    </span>
                    <span
                      className={`font-semibold shrink-0 ml-2 ${
                        isSelected
                          ? 'text-[#7C1D2E] dark:text-[#D9A13B]'
                          : 'text-[#111113] dark:text-[#E4E4E7]'
                      }`}
                    >
                      {isSelected
                        ? tx({ tr: 'Seçili', en: 'Selected' })
                        : tx({ tr: 'Seç', en: 'Select' })}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive 3-Format Writing Studio */}
      <section aria-label={tx({ tr: 'Yazma görevleri', en: 'Writing tasks' })} className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx(
              {
                tr: '2. A1 Yazma Görevleri · {{title}}',
                en: '2. A1 Writing Tasks · {{title}}',
              },
              { title: activeScenario.titleTr }
            )}
          </h2>
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Her ilk doğru görev +10 XP kazandırır (çift sayım yapılmaz)',
              en: 'Each first correct task awards +10 XP (no duplicate counting)',
            })}
          </span>
        </div>

        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
          {/* 3-Tab Format Switcher */}
          <div
            role="tablist"
            aria-label={tx({ tr: 'Yazma görev türü', en: 'Writing task type' })}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-1.5 dark:border-[#24242C] dark:bg-[#111113]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'form'}
              onClick={() => setActiveTab('form')}
              className={`flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'form'
                  ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <ClipboardList className="h-4 w-4 shrink-0" />
                <span className="truncate">1. Formular ausfüllen</span>
              </span>
              {formDone ? (
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    activeTab === 'form'
                      ? 'text-[#4ADE80] dark:text-[#111113]'
                      : 'text-[#15803D] dark:text-[#4ADE80]'
                  }`}
                />
              ) : (
                <span className="font-mono text-[11px] opacity-75 shrink-0">0/1</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'message'}
              onClick={() => setActiveTab('message')}
              className={`flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'message'
                  ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">2. Kurze Nachricht / Notiz</span>
              </span>
              {messageDone ? (
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    activeTab === 'message'
                      ? 'text-[#4ADE80] dark:text-[#111113]'
                      : 'text-[#15803D] dark:text-[#4ADE80]'
                  }`}
                />
              ) : (
                <span className="font-mono text-[11px] opacity-75 shrink-0">0/1</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'controlled'}
              onClick={() => setActiveTab('controlled')}
              className={`flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'controlled'
                  ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <Puzzle className="h-4 w-4 shrink-0" />
                <span className="truncate">3. Satzbau &amp; Lückentext</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums opacity-85 shrink-0">
                {controlledDoneCount}/{activeScenario.controlledItems.length}
              </span>
            </button>
          </div>

          {/* Active Format Panel */}
          {activeTab === 'form' && (
            <WritingFormTask scenarioId={activeScenario.id} task={activeScenario.formTask} />
          )}

          {activeTab === 'message' && (
            <WritingMessageTask
              scenarioId={activeScenario.id}
              task={activeScenario.messageTask}
            />
          )}

          {activeTab === 'controlled' && (
            <WritingControlledTasks
              scenarioId={activeScenario.id}
              items={activeScenario.controlledItems}
            />
          )}
        </div>
      </section>
    </div>
  );
};
