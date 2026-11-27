import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, Undo2, XCircle } from 'lucide-react';
import type {
  WritingClozeTypedItem,
  WritingControlledItem,
  WritingSatzbauItem,
} from '../../types';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import {
  assembleSatzbauTokens,
  evaluateSatzbau,
  evaluateTypedCloze,
  type ControlledCheckResult,
} from '../../utils/writingEvaluator';
import { GermanCharBar } from '../writing/GermanCharBar';

interface A2WritingControlledTasksProps {
  scenarioId: string;
  items: WritingControlledItem[];
}

function deterministicShuffleIndices(seed: string, length: number): number[] {
  const indices = Array.from({ length }, (_, idx) => idx);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = indices.length - 1; i > 0; i -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  const isIdentity = indices.every((val, idx) => val === idx);
  if (isIdentity && indices.length > 1) {
    const first = indices[0];
    indices[0] = indices[indices.length - 1];
    indices[indices.length - 1] = first;
  }
  return indices;
}

const A2SatzbauCard: React.FC<{
  scenarioId: string;
  item: WritingSatzbauItem;
  index: number;
}> = ({ scenarioId, item, index }) => {
  const { a2Progress, recordA2WritingAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [bankOrder] = useState<number[]>(() =>
    deterministicShuffleIndices(item.id, item.tokens.length)
  );
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [result, setResult] = useState<ControlledCheckResult | null>(null);
  const [lastXp, setLastXp] = useState(0);

  const isMastered = a2Progress.writingMasteredIds.includes(item.id);

  useEffect(() => {
    setSelectedIndices([]);
    setResult(null);
    setLastXp(0);
  }, [item.id]);

  const selectedTokens = selectedIndices.map((idx) => item.tokens[idx]);
  const assembled = assembleSatzbauTokens(selectedTokens);
  const allPlaced = selectedIndices.length === item.tokens.length;

  const handleAddToken = (tokenIdx: number) => {
    if (selectedIndices.includes(tokenIdx)) return;
    setSelectedIndices((prev) => [...prev, tokenIdx]);
    setResult(null);
  };

  const handleRemoveLast = () => {
    setSelectedIndices((prev) => prev.slice(0, -1));
    setResult(null);
  };

  const handleReset = () => {
    setSelectedIndices([]);
    setResult(null);
    setLastXp(0);
  };

  const handleCheck = () => {
    if (!allPlaced) return;
    const res = evaluateSatzbau(item, selectedTokens);
    setResult(res);
    const xp = recordA2WritingAnswer(
      item.id,
      scenarioId,
      'controlled',
      `A2 Satzbau #${index + 1}`,
      res.isCorrect
    );
    setLastXp(xp);
  };

  return (
    <div className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
            A2 Satzbau #{index + 1}
          </span>
          <span aria-hidden="true">·</span>
          <span>{tx({ tr: 'Cümle Kurma', en: 'Sentence Building' })}</span>
        </div>
        {isMastered && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {locale.common.completed}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-[#111113] dark:text-[#F4F4F5]" lang="de">
        {item.instructionDe}
      </p>
      <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">{item.instructionTr}</p>

      {/* Assembled Sentence Dropzone */}
      <div
        className="mt-4 min-h-[54px] rounded-xl border border-dashed border-[#D9D9D3] bg-[#F6F6F4] p-3 dark:border-[#3A3A44] dark:bg-[#111113]"
        lang="de"
      >
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-[#71717A] dark:text-[#8E8E98]">
            {tx({
              tr: 'Aşağıdaki sözcük parçalarına sırayla tıklayarak A2 cümlesini oluşturun…',
              en: 'Click the word tiles below in order to build the A2 sentence…',
            })}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {selectedIndices.map((tokenIdx, pos) => (
              <button
                key={`${tokenIdx}-${pos}`}
                type="button"
                onClick={() => {
                  setSelectedIndices((prev) => prev.filter((_, i) => i !== pos));
                  setResult(null);
                }}
                className="rounded-lg border border-[#7C1D2E]/45 bg-[#FDF2F4] px-2.5 py-1 text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FCE4E8] dark:border-[#D9A13B]/50 dark:bg-[#231D11] dark:text-[#F6D693]"
              >
                {item.tokens[tokenIdx]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Token Bank */}
      <div className="mt-3 flex flex-wrap gap-2" lang="de">
        {bankOrder.map((tokenIdx) => {
          const used = selectedIndices.includes(tokenIdx);
          return (
            <button
              key={tokenIdx}
              type="button"
              disabled={used}
              onClick={() => handleAddToken(tokenIdx)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                used
                  ? 'cursor-not-allowed border-[#ECECE8] bg-[#F6F6F4] text-[#A1A1AA] opacity-40 dark:border-[#24242C] dark:bg-[#111113]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]'
              }`}
            >
              {item.tokens[tokenIdx]}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!allPlaced}
          className="h-10 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#641624] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
        >
          {tx({ tr: 'Cümleyi Kontrol Et', en: 'Check Sentence' })}
        </button>
        <button
          type="button"
          onClick={handleRemoveLast}
          disabled={selectedIndices.length === 0}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
        >
          <Undo2 className="h-3.5 w-3.5" />
          {tx({ tr: 'Geri Al', en: 'Undo' })}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={selectedIndices.length === 0 && !result}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {locale.common.reset}
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs ${
            result.isCorrect
              ? 'border-[#15803D]/35 bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]'
              : 'border-[#B91C1C]/35 bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444]/35 dark:bg-[#2A1013] dark:text-[#FCA5A5]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {result.isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C] dark:text-[#F87171]" />
              )}
              <div>
                <p className="font-semibold">{result.feedbackTr}</p>
                {!result.isCorrect && (
                  <p className="mt-1 opacity-90" lang="de">
                    {tx(
                      { tr: 'Sizin cümleniz: {{sentence}}', en: 'Your sentence: {{sentence}}' },
                      { sentence: assembled }
                    )}
                  </p>
                )}
                <p className="mt-1 opacity-90">{item.explanationTr}</p>
              </div>
            </div>
            {lastXp > 0 && (
              <span className="shrink-0 rounded-md bg-[#15803D] px-2 py-0.5 font-mono text-[11px] font-bold text-white dark:bg-[#4ADE80] dark:text-[#0B0B0D]">
                +{lastXp} A2 XP
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const A2TypedClozeCard: React.FC<{
  scenarioId: string;
  item: WritingClozeTypedItem;
  index: number;
}> = ({ scenarioId, item, index }) => {
  const { a2Progress, recordA2WritingAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<ControlledCheckResult | null>(null);
  const [lastXp, setLastXp] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isMastered = a2Progress.writingMasteredIds.includes(item.id);

  useEffect(() => {
    setAnswer('');
    setShowHint(false);
    setResult(null);
    setLastXp(0);
  }, [item.id]);

  const insertChar = (ch: string) => {
    const el = inputRef.current;
    if (!el) {
      setAnswer((prev) => `${prev}${ch}`);
      return;
    }
    const start = el.selectionStart ?? answer.length;
    const end = el.selectionEnd ?? answer.length;
    const next = `${answer.slice(0, start)}${ch}${answer.slice(end)}`;
    setAnswer(next);
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    const res = evaluateTypedCloze(item, answer);
    setResult(res);
    const xp = recordA2WritingAnswer(
      item.id,
      scenarioId,
      'controlled',
      `A2 Lückentext #${index + 1}`,
      res.isCorrect
    );
    setLastXp(xp);
  };

  return (
    <form
      onSubmit={handleCheck}
      className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
            A2 Lückentext #{index + 1}
          </span>
          <span aria-hidden="true">·</span>
          <span>{tx({ tr: 'Yazarak Boşluk Doldurma', en: 'Typed Fill-in-the-Blank' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-2.5 text-[11px] font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
            {showHint ? locale.common.hideHint : tx({ tr: 'İpucu', en: 'Hint' })}
          </button>
          {isMastered && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {locale.common.completed}
            </span>
          )}
        </div>
      </div>

      {showHint && (
        <p className="mt-2.5 rounded-lg border border-[#ECECE8] bg-[#F6F6F4] px-3 py-2 text-xs text-[#52525B] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#A1A1AA]">
          {tx({ tr: 'İpucu (puanı etkilemez):', en: 'Hint (unscored):' })} {item.hintTr}
        </p>
      )}

      <div
        className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#111113] dark:text-[#F4F4F5] sm:text-base"
        lang="de"
      >
        <span>{item.beforeBlankDe}</span>
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setResult(null);
          }}
          placeholder="…"
          aria-label={tx({ tr: 'Eksik Almanca sözcük', en: 'Missing German word' })}
          className="w-40 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 py-1.5 text-sm font-medium text-[#111113] focus:border-[#7C1D2E] focus:bg-[#FFFFFF] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
        />
        <span>{item.afterBlankDe}</span>
      </div>

      <div className="mt-3">
        <GermanCharBar onInsert={insertChar} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={!answer.trim()}
          className="h-10 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#641624] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
        >
          {tx({ tr: 'Yanıtı Kontrol Et', en: 'Check Answer' })}
        </button>
        <button
          type="button"
          onClick={() => {
            setAnswer('');
            setResult(null);
            setLastXp(0);
          }}
          disabled={!answer && !result}
          className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {tx({ tr: 'Temizle', en: 'Clear' })}
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 rounded-xl border p-3.5 text-xs ${
            result.isCorrect
              ? 'border-[#15803D]/35 bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]'
              : 'border-[#B91C1C]/35 bg-[#FEF2F2] text-[#991B1B] dark:border-[#EF4444]/35 dark:bg-[#2A1013] dark:text-[#FCA5A5]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {result.isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C] dark:text-[#F87171]" />
              )}
              <div>
                <p className="font-semibold">{result.feedbackTr}</p>
                <p className="mt-1 opacity-90">{item.explanationTr}</p>
              </div>
            </div>
            {lastXp > 0 && (
              <span className="shrink-0 rounded-md bg-[#15803D] px-2 py-0.5 font-mono text-[11px] font-bold text-white dark:bg-[#4ADE80] dark:text-[#0B0B0D]">
                +{lastXp} A2 XP
              </span>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export const A2WritingControlledTasks: React.FC<A2WritingControlledTasksProps> = ({
  scenarioId,
  items,
}) => {
  const { isEn } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#ECECE8] bg-[#FFFFFF] px-4 py-2.5 text-xs text-[#52525B] dark:border-[#24242C] dark:bg-[#16161A] dark:text-[#A1A1AA]">
        {isEn ? (
          <>
            Verify subordinate clauses (
            <strong className="text-[#111113] dark:text-[#F4F4F5]" lang="de">
              weil / dass / wenn / obwohl
            </strong>
            ),{' '}
            <strong className="text-[#111113] dark:text-[#F4F4F5]" lang="de">
              deshalb
            </strong>{' '}
            and Perfekt word order with local rules (first correct solution{' '}
            <strong className="font-mono text-[#7C1D2E] dark:text-[#D9A13B]">+10 A2 XP</strong>).
          </>
        ) : (
          <>
            Yan cümle (
            <strong className="text-[#111113] dark:text-[#F4F4F5]" lang="de">
              weil / dass / wenn / obwohl
            </strong>
            ),{' '}
            <strong className="text-[#111113] dark:text-[#F4F4F5]" lang="de">
              deshalb
            </strong>{' '}
            ve Perfekt dizilimini yerel kurallarla doğrulayın (ilk çözüm{' '}
            <strong className="font-mono text-[#7C1D2E] dark:text-[#D9A13B]">+10 A2 XP</strong>).
          </>
        )}
      </div>
      {items.map((item, idx) =>
        item.kind === 'satzbau' ? (
          <A2SatzbauCard key={item.id} scenarioId={scenarioId} item={item} index={idx} />
        ) : (
          <A2TypedClozeCard key={item.id} scenarioId={scenarioId} item={item} index={idx} />
        )
      )}
    </div>
  );
};
