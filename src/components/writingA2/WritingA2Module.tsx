import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, FileEdit, Layers, PenLine } from 'lucide-react';
import {
  GERMAN_A2_WRITING_SCENARIOS,
  TOTAL_A2_WRITING_TASKS,
  getA2WritingScenarioById,
  getA2WritingScenarioTaskIds,
} from '../../data/germanA2Writing';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { A2WritingMessageTask } from './A2WritingMessageTask';
import { A2WritingControlledTasks } from './A2WritingControlledTasks';

type A2WritingTab = 'message' | 'controlled';

interface WritingA2ModuleProps {
  initialScenarioId?: string;
}

export const WritingA2Module: React.FC<WritingA2ModuleProps> = ({ initialScenarioId }) => {
  const { a2Progress, a2WritingAccuracyPercent } = useAppState();
  const { locale, tx } = useI18n();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    () => getA2WritingScenarioById(initialScenarioId).id
  );
  const [activeTab, setActiveTab] = useState<A2WritingTab>('message');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialScenarioId) {
      const target = getA2WritingScenarioById(initialScenarioId);
      setSelectedScenarioId(target.id);
      setActiveTab('message');
    }
  }, [initialScenarioId]);

  const scenario = getA2WritingScenarioById(selectedScenarioId);
  const masteredSet = new Set(a2Progress.writingMasteredIds);
  const totalMastered = a2Progress.writingMasteredIds.length;
  const scenarioTaskIds = getA2WritingScenarioTaskIds(scenario);
  const scenarioDoneCount = scenarioTaskIds.filter((id) => masteredSet.has(id)).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      {/* Module Header */}
      <header className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-7 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                {tx({ tr: 'Almanca A2 · Aşama 4', en: 'German A2 · Stage 4' })}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">Schreiben (CEFR A2)</span>
              <span aria-hidden="true">·</span>
              <span>
                {tx({ tr: 'İzole A2 İlerleme Kaydı', en: 'Isolated A2 Progress Tracking' })}
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5] sm:text-3xl">
              {tx({ tr: 'A2 Yazma Atölyesi (Schreiben)', en: 'A2 Writing Workshop (Schreiben)' })}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-center dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'A2 Yazma', en: 'A2 Writing' })}
              </div>
              <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                {totalMastered}/{TOTAL_A2_WRITING_TASKS}
              </div>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-center dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {locale.common.accuracy}
              </div>
              <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                {a2WritingAccuracyPercent !== null
                  ? tx({ tr: '%{{n}}', en: '{{n}}%' }, { n: a2WritingAccuracyPercent })
                  : '—'}
              </div>
            </div>
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-center dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 XP</div>
              <div className="mt-0.5 font-mono text-base font-semibold tabular-nums text-[#7C1D2E] dark:text-[#D9A13B]">
                {a2Progress.xp}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 4 Authentic A2 Writing Scenarios */}
      <section aria-label={tx({ tr: 'A2 Yazma Senaryoları', en: 'A2 Writing Scenarios' })}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GERMAN_A2_WRITING_SCENARIOS.map((sc) => {
            const ids = getA2WritingScenarioTaskIds(sc);
            const done = ids.filter((id) => masteredSet.has(id)).length;
            const isSelected = sc.id === scenario.id;
            const imgFailed = failedImages[sc.id];

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioId(sc.id);
                  setActiveTab('message');
                }}
                className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[#7C1D2E] bg-[#FFFFFF] ring-1 ring-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#16161A] dark:ring-[#D9A13B]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161A]">
                  {!imgFailed ? (
                    <img
                      src={sc.imageUrl}
                      alt={sc.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedImages((prev) => ({ ...prev, [sc.id]: true }))}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2A141A] to-[#111113] p-4">
                      <PenLine className="h-8 w-8 text-[#D9A13B]" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B0B0D]/85 via-[#0B0B0D]/30 to-transparent p-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-white">
                      <span>{sc.contextLabelTr}</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#E5B34A]">
                        <Clock className="h-3 w-3" />
                        {tx(
                          { tr: '{{min}} dk', en: '{{min}} min' },
                          { min: sc.estimatedMinutes }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h2 className="font-display text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {sc.titleTr}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]" lang="de">
                      {sc.titleDe}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                      {sc.cefrFocusTr}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#ECECE8] pt-2.5 text-xs dark:border-[#24242C]">
                    <span className="text-[#52525B] dark:text-[#A1A1AA]">
                      {tx({ tr: 'İlerleme:', en: 'Progress:' })}{' '}
                      <strong className="font-mono tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                        {done}/{ids.length}
                      </strong>
                    </span>
                    {done === ids.length ? (
                      <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                    ) : (
                      <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                        {isSelected ? tx({ tr: 'Seçili', en: 'Selected' }) : locale.home.openLabel}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Scenario Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D9D3] pb-3 dark:border-[#282830]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('message')}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-colors sm:text-sm ${
              activeTab === 'message'
                ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <FileEdit className="h-4 w-4" />
            {tx({
              tr: '1. Kılavuzlu A2 E-Posta / Mesaj (3 Leitpunkte)',
              en: '1. Guided A2 Email / Message (3 Leitpunkte)',
            })}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('controlled')}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-colors sm:text-sm ${
              activeTab === 'controlled'
                ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Layers className="h-4 w-4" />
            {tx(
              {
                tr: '2. A2 Satzbau & Lückentext ({{count}} Alıştırma)',
                en: '2. A2 Satzbau & Lückentext ({{count}} Exercises)',
              },
              { count: scenario.controlledItems.length }
            )}
          </button>
        </div>

        <span className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          {tx({ tr: 'Bu senaryoda tamamlanan:', en: 'Completed in this scenario:' })}{' '}
          <strong className="font-mono tabular-nums text-[#111113] dark:text-[#F4F4F5]">
            {scenarioDoneCount}/{scenarioTaskIds.length}
          </strong>
        </span>
      </div>

      {/* Active Workspace */}
      {activeTab === 'message' ? (
        <A2WritingMessageTask scenarioId={scenario.id} task={scenario.messageTask} />
      ) : (
        <A2WritingControlledTasks scenarioId={scenario.id} items={scenario.controlledItems} />
      )}
    </div>
  );
};
