import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  RotateCcw,
  TextCursorInput,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { A2ListeningScenario, ListeningExerciseKind } from '../../types';

interface A2ListeningExercisesProps {
  scenario: A2ListeningScenario;
}

interface SessionAnswer {
  choice: string;
  isCorrect: boolean;
  xpAwarded: number;
}

const EXERCISE_TABS: Array<{
  id: ListeningExerciseKind;
  labelTr: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'tf', labelTr: '1. Richtig / Falsch', icon: ClipboardCheck },
  { id: 'cloze', labelTr: '2. Lückentext', icon: TextCursorInput },
  { id: 'mc', labelTr: '3. Anlama Testi', icon: HelpCircle },
];

export const A2ListeningExercises: React.FC<A2ListeningExercisesProps> = ({ scenario }) => {
  const { a2Progress, recordA2ListeningAnswer } = useAppState();
  const [activeTab, setActiveTab] = useState<ListeningExerciseKind>('tf');
  const [answers, setAnswers] = useState<Record<string, SessionAnswer>>({});

  useEffect(() => {
    setAnswers({});
    setActiveTab('tf');
  }, [scenario.id]);

  const handleTrueFalsePick = (
    itemId: string,
    statementDe: string,
    expectedTrue: boolean,
    pickedTrue: boolean
  ) => {
    if (answers[itemId]) return;
    const isCorrect = expectedTrue === pickedTrue;
    const xpAwarded = recordA2ListeningAnswer(
      itemId,
      scenario.id,
      'tf',
      `${scenario.titleTr} · "${statementDe}"`,
      isCorrect
    );
    setAnswers((prev) => ({
      ...prev,
      [itemId]: { choice: pickedTrue ? 'richtig' : 'falsch', isCorrect, xpAwarded },
    }));
  };

  const handleClozePick = (itemId: string, correctOption: string, pickedOption: string) => {
    if (answers[itemId]) return;
    const isCorrect = pickedOption === correctOption;
    const xpAwarded = recordA2ListeningAnswer(
      itemId,
      scenario.id,
      'cloze',
      `${scenario.titleTr} · Boşluk (${correctOption})`,
      isCorrect
    );
    setAnswers((prev) => ({
      ...prev,
      [itemId]: { choice: pickedOption, isCorrect, xpAwarded },
    }));
  };

  const handleMcPick = (
    itemId: string,
    questionTr: string,
    correctIndex: number,
    pickedIndex: number
  ) => {
    if (answers[itemId]) return;
    const isCorrect = pickedIndex === correctIndex;
    const xpAwarded = recordA2ListeningAnswer(
      itemId,
      scenario.id,
      'mc',
      `${scenario.titleTr} · ${questionTr}`,
      isCorrect
    );
    setAnswers((prev) => ({
      ...prev,
      [itemId]: { choice: String(pickedIndex), isCorrect, xpAwarded },
    }));
  };

  const countMastered = (ids: string[]) =>
    ids.filter((id) => a2Progress.listeningMasteredIds.includes(id)).length;

  const tfDone = countMastered(scenario.trueFalse.map((q) => q.id));
  const clDone = countMastered(scenario.cloze.map((q) => q.id));
  const mcDone = countMastered(scenario.multipleChoice.map((q) => q.id));

  const hasAnySessionAnswer = Object.keys(answers).length > 0;

  return (
    <section aria-label="A2 dinleme anlama alıştırmaları" className="space-y-5">
      {/* Tabs & Reset */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="A2 dinleme alıştırma sekmeleri"
          className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#D9D9D3] bg-[#ECECE8]/80 p-1 dark:border-[#282830] dark:bg-[#16161A]"
        >
          {EXERCISE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const doneCount = tab.id === 'tf' ? tfDone : tab.id === 'cloze' ? clDone : mcDone;
            const totalCount =
              tab.id === 'tf'
                ? scenario.trueFalse.length
                : tab.id === 'cloze'
                ? scenario.cloze.length
                : scenario.multipleChoice.length;

            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.labelTr}</span>
                <span className="font-mono text-[11px] opacity-80 tabular-nums">
                  ({doneCount}/{totalCount})
                </span>
              </button>
            );
          })}
        </div>

        {hasAnySessionAnswer && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Soruları Tekrar Çöz</span>
          </button>
        )}
      </div>

      {/* TAB 1: RICHTIG / FALSCH */}
      {activeTab === 'tf' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenario.trueFalse.map((item, idx) => {
            const ans = answers[item.id];
            const alreadyMastered = a2Progress.listeningMasteredIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="font-mono font-semibold">Soru {idx + 1}</span>
                    {alreadyMastered && (
                      <span className="font-medium text-[#15803D] dark:text-[#4ADE80]">
                        Tamamlandı
                      </span>
                    )}
                  </div>

                  <p className="mt-3 font-display text-base sm:text-lg font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                    “{item.statementDe}”
                  </p>
                  <p className="mt-1.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {item.statementTr}
                  </p>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'richtig', label: 'Richtig', val: true },
                      { key: 'falsch', label: 'Falsch', val: false },
                    ].map((btn) => {
                      const isPicked = ans?.choice === btn.key;
                      const isCorrectOption = item.isTrue === btn.val;

                      let cls =
                        'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';

                      if (ans) {
                        if (isCorrectOption) {
                          cls =
                            'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E] dark:bg-[#14532D]/35 dark:text-[#BBF7D0]';
                        } else if (isPicked) {
                          cls =
                            'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#450A0A]/45 dark:text-[#FECACA]';
                        } else {
                          cls =
                            'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/40 dark:text-[#686873]';
                        }
                      }

                      return (
                        <button
                          key={btn.key}
                          type="button"
                          disabled={Boolean(ans)}
                          onClick={() =>
                            handleTrueFalsePick(item.id, item.statementDe, item.isTrue, btn.val)
                          }
                          className={`h-11 rounded-lg border px-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${cls}`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {ans && (
                    <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 text-xs leading-relaxed dark:border-[#282830] dark:bg-[#111113]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {ans.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                            <span className="text-[#15803D] dark:text-[#4ADE80]">
                              {ans.xpAwarded > 0
                                ? `Doğru! (+${ans.xpAwarded} A2 XP)`
                                : 'Doğru! (Tekrar Pekiştirme)'}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                            <span className="text-[#B91C1C] dark:text-[#F87171]">
                              Yanlış Seçim
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mt-1.5 text-[#52525B] dark:text-[#A1A1AA]">
                        {item.explanationTr}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: LÜCKENTEXT */}
      {activeTab === 'cloze' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenario.cloze.map((item, idx) => {
            const ans = answers[item.id];
            const alreadyMastered = a2Progress.listeningMasteredIds.includes(item.id);
            const parts = item.promptDe.split('___');

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="font-mono font-semibold">Boşluk {idx + 1}</span>
                    {alreadyMastered && (
                      <span className="font-medium text-[#15803D] dark:text-[#4ADE80]">
                        Tamamlandı
                      </span>
                    )}
                  </div>

                  <p className="mt-3 font-display text-base sm:text-lg font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                    “{parts[0]}
                    <span className="mx-1 border-b-2 border-[#7C1D2E] px-1 text-[#7C1D2E] dark:border-[#D9A13B] dark:text-[#D9A13B]">
                      {ans ? item.correctOption : '_____'}
                    </span>
                    {parts[1] ?? ''}”
                  </p>
                  <p className="mt-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    İpucu: {item.hintTr}
                  </p>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.map((opt) => {
                      const isPicked = ans?.choice === opt;
                      const isRight = opt === item.correctOption;

                      let cls =
                        'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';

                      if (ans) {
                        if (isRight) {
                          cls =
                            'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E] dark:bg-[#14532D]/35 dark:text-[#BBF7D0]';
                        } else if (isPicked) {
                          cls =
                            'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#450A0A]/45 dark:text-[#FECACA]';
                        } else {
                          cls =
                            'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/40 dark:text-[#686873]';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(ans)}
                          onClick={() => handleClozePick(item.id, item.correctOption, opt)}
                          className={`h-11 rounded-lg border px-2.5 text-xs sm:text-sm font-medium transition-colors ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {ans && (
                    <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 text-xs leading-relaxed dark:border-[#282830] dark:bg-[#111113]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {ans.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                            <span className="text-[#15803D] dark:text-[#4ADE80]">
                              {ans.xpAwarded > 0
                                ? `Doğru! (+${ans.xpAwarded} A2 XP)`
                                : 'Doğru! (Tekrar Pekiştirme)'}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                            <span className="text-[#B91C1C] dark:text-[#F87171]">
                              Doğru sözcük: {item.correctOption}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mt-1.5 text-[#52525B] dark:text-[#A1A1AA]">
                        {item.explanationTr}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ANLAMA TESTİ (MULTIPLE CHOICE) */}
      {activeTab === 'mc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenario.multipleChoice.map((item, idx) => {
            const ans = answers[item.id];
            const alreadyMastered = a2Progress.listeningMasteredIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="font-mono font-semibold">Anlama Sorusu {idx + 1}</span>
                    {alreadyMastered && (
                      <span className="font-medium text-[#15803D] dark:text-[#4ADE80]">
                        Tamamlandı
                      </span>
                    )}
                  </div>

                  <p className="mt-3 font-display text-lg font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                    {item.questionTr}
                  </p>
                  <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {item.questionDe}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    {item.options.map((opt, optIdx) => {
                      const letter = ['A', 'B', 'C', 'D'][optIdx];
                      const isPicked = ans?.choice === String(optIdx);
                      const isRight = optIdx === item.correctIndex;

                      let cls =
                        'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]';

                      if (ans) {
                        if (isRight) {
                          cls =
                            'border-[#15803D] bg-[#F0FDF4] text-[#14532D] dark:border-[#22C55E] dark:bg-[#14532D]/35 dark:text-[#BBF7D0]';
                        } else if (isPicked) {
                          cls =
                            'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444] dark:bg-[#450A0A]/45 dark:text-[#FECACA]';
                        } else {
                          cls =
                            'border-[#ECECE8] bg-[#F6F6F4]/50 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/40 dark:text-[#686873]';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={Boolean(ans)}
                          onClick={() =>
                            handleMcPick(item.id, item.questionTr, item.correctIndex, optIdx)
                          }
                          className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${cls}`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-xs opacity-75 shrink-0">
                              {letter}.
                            </span>
                            <span>{opt}</span>
                          </span>
                          {ans && isRight && (
                            <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                          )}
                          {ans && isPicked && !isRight && (
                            <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {ans && (
                    <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 text-xs leading-relaxed dark:border-[#282830] dark:bg-[#111113]">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {ans.isCorrect ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                            <span className="text-[#15803D] dark:text-[#4ADE80]">
                              {ans.xpAwarded > 0
                                ? `Doğru! (+${ans.xpAwarded} A2 XP)`
                                : 'Doğru! (Tekrar Pekiştirme)'}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                            <span className="text-[#B91C1C] dark:text-[#F87171]">
                              Doğru yanıt: {item.options[item.correctIndex]}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="mt-1.5 text-[#52525B] dark:text-[#A1A1AA]">
                        {item.explanationTr}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
