import React, { useEffect, useState } from 'react';
import { Info, MessageSquare } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  GERMAN_A2_SPEAKING_SCENARIOS,
  TOTAL_A2_SPEAKING_TASKS,
  getA2SpeakingScenarioById,
  getA2SpeakingScenarioTaskIds,
} from '../../data/germanA2Speaking';
import { useI18n } from '../../hooks/useI18n';
import type { SpeakingTaskKind } from '../../types';
import { STORAGE_KEY_A2_STATE } from '../../utils/a2DataPortability';
import { stopGermanSpeech } from '../../utils/speech';
import { A2SpeakingPromptTab } from './A2SpeakingPromptTab';
import { A2SpeakingRepeatTab } from './A2SpeakingRepeatTab';
import { A2SpeakingRoleplayTab } from './A2SpeakingRoleplayTab';

interface SpeakingA2ModuleProps {
  initialScenarioId?: string;
}

const MODE_TABS: Array<{ id: SpeakingTaskKind; labelTr: string; labelEn: string }> = [
  { id: 'repeat', labelTr: '1. Telaffuz & Kalıp Tekrarı', labelEn: '1. Repeat & Pronunciation' },
  { id: 'prompt', labelTr: '2. Kılavuzlu Yanıt & Deneyim', labelEn: '2. Guided Prompt & Experience' },
  { id: 'roleplay', labelTr: '3. Çok Turlu Rol Oyunu', labelEn: '3. Multi-Turn Roleplay' },
];

export const SpeakingA2Module: React.FC<SpeakingA2ModuleProps> = ({ initialScenarioId }) => {
  const { a2Progress } = useAppState();
  const { isEn, tx } = useI18n();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    () => getA2SpeakingScenarioById(initialScenarioId).id
  );
  const [activeTab, setActiveTab] = useState<SpeakingTaskKind>('repeat');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialScenarioId) {
      setSelectedScenarioId(getA2SpeakingScenarioById(initialScenarioId).id);
    }
  }, [initialScenarioId]);

  useEffect(() => {
    return () => {
      stopGermanSpeech();
    };
  }, []);

  const scenario = getA2SpeakingScenarioById(selectedScenarioId);
  const completedCount = a2Progress.speakingMasteredIds.length;
  const completionPct =
    TOTAL_A2_SPEAKING_TASKS > 0
      ? Math.round((completedCount / TOTAL_A2_SPEAKING_TASKS) * 100)
      : 0;

  const handleSelectScenario = (id: string) => {
    stopGermanSpeech();
    setSelectedScenarioId(id);
  };

  const handleSelectTab = (tab: SpeakingTaskKind) => {
    stopGermanSpeech();
    setActiveTab(tab);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 lg:flex-row lg:items-end lg:justify-between dark:border-[#282830]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {tx({ tr: 'Almanca CEFR A2 · Aşama 5', en: 'German CEFR A2 · Stage 5' })}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {tx({
                tr: 'Sprechen (Sözlü İletişim & Ortak Planlama)',
                en: 'Sprechen (Spoken Interaction & Joint Planning)',
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{STORAGE_KEY_A2_STATE}</span>
          </div>

          <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'A2 Konuşma Stüdyosu (Sprechen)',
              en: 'A2 Speaking Studio (Sprechen)',
            })}
          </h1>
        </div>

        {/* Isolated A2 Speaking Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] px-4 py-3 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Toplam A2 XP', en: 'Total A2 XP' })}
            </p>
            <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp} XP
            </p>
          </div>
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] px-4 py-3 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'A2 Konuşma', en: 'A2 Speaking' })}
            </p>
            <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedCount} / {TOTAL_A2_SPEAKING_TASKS}
            </p>
          </div>
          <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] px-4 py-3 dark:border-[#282830] dark:bg-[#16161A]">
            <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Tamamlanma', en: 'Completion' })}
            </p>
            <p className="mt-1 font-mono text-base sm:text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {isEn ? `${completionPct}%` : `%${completionPct}`}
            </p>
          </div>
        </div>
      </header>

      {/* Honest Local Speech & Self-Assessment Boundary Note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] px-4 py-3 text-xs leading-relaxed text-[#52525B] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]">
        <Info className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
        <p>
          {tx({
            tr: 'Seslendirme tarayıcı Web Speech (',
            en: 'Audio playback uses browser Web Speech (',
          })}
          <span className="font-mono text-[#111113] dark:text-[#F4F4F5]">de-DE</span>
          {tx({
            tr: ') ile çalışır; yapay zekâ telaffuz puanlaması yapılmaz ve öz-değerlendirme doğruluk yüzdesini etkilemez.',
            en: '); no AI pronunciation grading is performed and self-assessment does not affect your accuracy percentage.',
          })}
        </p>
      </div>

      {/* 4 A2 Speaking Scenario Selector Cards */}
      <section
        aria-label={tx({ tr: 'A2 Konuşma Senaryoları', en: 'A2 Speaking Scenarios' })}
        className="space-y-3"
      >
        <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: '4 Özgün CEFR A2 Konuşma Senaryosu',
              en: '4 Authentic CEFR A2 Speaking Scenarios',
            })}
          </span>
          <span className="font-mono tabular-nums">
            {tx({
              tr: 'Her senaryoda 5 görev (2 Tekrar · 2 Kılavuzlu Yanıt · 1 Rol Oyunu)',
              en: '5 tasks per scenario (2 Repeat · 2 Guided Prompts · 1 Roleplay)',
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {GERMAN_A2_SPEAKING_SCENARIOS.map((sc) => {
            const isSelected = sc.id === scenario.id;
            const taskIds = getA2SpeakingScenarioTaskIds(sc);
            const done = taskIds.filter((id) =>
              a2Progress.speakingMasteredIds.includes(id)
            ).length;
            const imgFailed = Boolean(failedImages[sc.id]);

            return (
              <button
                key={sc.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectScenario(sc.id)}
                className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[#7C1D2E] bg-[#FDF2F4]/40 dark:border-[#D9A13B] dark:bg-[#1E1B16]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden bg-[#16161A]">
                  {!imgFailed ? (
                    <img
                      src={sc.imageUrl}
                      alt={sc.imageAlt}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [sc.id]: true }))
                      }
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#16161A] via-[#2A141A] to-[#111113]">
                      <MessageSquare className="h-7 w-7 text-[#D9A13B]" />
                    </div>
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/80 via-[#0B0B0D]/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white">
                    <span>{sc.registerLabelTr}</span>
                    <span className="font-semibold text-[#E5B34A] tabular-nums">
                      {done} / {taskIds.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                      {sc.contextLabelTr}
                    </p>
                    <h2 className="mt-1 font-display text-base font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {sc.titleDe}
                    </h2>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {sc.titleTr}
                    </p>
                  </div>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {sc.cefrFocusTr}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Scenario Overview + 3-Mode Tab Bar */}
      <section className="space-y-5">
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 space-y-4 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                {tx(
                  {
                    tr: 'Seçili Senaryo · {{register}} · ~{{min}} dk',
                    en: 'Selected Scenario · {{register}} · ~{{min}} min',
                  },
                  { register: scenario.registerLabelTr, min: scenario.estimatedMinutes }
                )}
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {scenario.titleDe} — {scenario.titleTr}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                {scenario.subtitleTr}
              </p>
            </div>
          </div>

          <div
            role="tablist"
            aria-label={tx({ tr: 'A2 Konuşma çalışma modları', en: 'A2 Speaking practice modes' })}
            className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-1.5 dark:border-[#24242C] dark:bg-[#111113]"
          >
            {MODE_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`min-h-[40px] flex-1 sm:flex-none rounded-md px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                  }`}
                >
                  {isEn ? tab.labelEn : tab.labelTr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Workspace */}
        {activeTab === 'repeat' && <A2SpeakingRepeatTab scenario={scenario} />}
        {activeTab === 'prompt' && <A2SpeakingPromptTab scenario={scenario} />}
        {activeTab === 'roleplay' && <A2SpeakingRoleplayTab scenario={scenario} />}
      </section>
    </div>
  );
};
