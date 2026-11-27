import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Languages,
  Puzzle,
  RotateCcw,
  Type,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type {
  WritingClozeTypedItem,
  WritingControlledItem,
  WritingSatzbauItem,
} from '../../types';
import {
  assembleSatzbauTokens,
  evaluateSatzbau,
  evaluateTypedCloze,
  type ControlledCheckResult,
} from '../../utils/writingEvaluator';
import { GermanCharBar } from './GermanCharBar';

interface WritingControlledTasksProps {
  scenarioId: string;
  items: WritingControlledItem[];
}

interface SatzbauCardProps {
  index: number;
  scenarioId: string;
  item: WritingSatzbauItem;
}

const SatzbauCard: React.FC<SatzbauCardProps> = ({ index, scenarioId, item }) => {
  const { progress, recordWritingAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [result, setResult] = useState<ControlledCheckResult | null>(null);
  const [lastXp, setLastXp] = useState<number | null>(null);
  const [showTurkish, setShowTurkish] = useState(false);

  const isMastered = progress.writingMasteredIds.includes(item.id);

  useEffect(() => {
    setSelectedIndices([]);
    setResult(null);
    setLastXp(null);
    setShowTurkish(false);
  }, [item.id]);

  const selectedTokens = selectedIndices.map((i) => item.tokens[i]);

  const handleAddToken = (idx: number) => {
    if (selectedIndices.includes(idx)) return;
    setSelectedIndices((prev) => [...prev, idx]);
    setResult(null);
  };

  const handleRemoveToken = (posInSelected: number) => {
    setSelectedIndices((prev) => prev.filter((_, idx) => idx !== posInSelected));
    setResult(null);
  };

  const handleCheck = () => {
    const res = evaluateSatzbau(item, selectedTokens);
    setResult(res);
    if (res.status !== 'empty') {
      const earned = recordWritingAnswer(
        item.id,
        scenarioId,
        'controlled',
        `Satzbau: ${item.canonicalSentenceDe}`,
        res.isCorrect
      );
      setLastXp(earned);
    }
  };

  const handleReset = () => {
    setSelectedIndices([]);
    setResult(null);
    setLastXp(null);
  };

  return (
    <div className="rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 space-y-4 dark:border-[#282830] dark:bg-[#111113]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <Puzzle className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              0{index + 1}.
            </span>
            <span>{tx({ tr: 'Satzbau · Cümle Kurma', en: 'Satzbau · Sentence Building' })}</span>
            {isMastered && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {locale.common.completed}
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {item.instructionDe}
          </p>
          {showTurkish && (
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">{item.instructionTr}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowTurkish((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
        >
          <Languages className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <span>
            {showTurkish
              ? locale.common.hideHint
              : tx({ tr: 'Türkçe Anlam', en: 'Turkish Meaning' })}
          </span>
        </button>
      </div>

      {/* Assembled Sentence Drop Zone */}
      <div className="min-h-[56px] rounded-xl border border-dashed border-[#C8C8C0] bg-[#FFFFFF] p-3 flex flex-wrap items-center gap-2 dark:border-[#34343E] dark:bg-[#16161A]">
        {selectedIndices.length === 0 ? (
          <span className="text-xs text-[#71717A]">
            {tx({
              tr: 'Aşağıdaki sözcük parçalarına sırayla tıklayarak Almanca cümleyi kurun…',
              en: 'Click the word tiles below in order to build the German sentence…',
            })}
          </span>
        ) : (
          selectedIndices.map((tokenIdx, pos) => (
            <button
              key={`${tokenIdx}-${pos}`}
              type="button"
              onClick={() => handleRemoveToken(pos)}
              title={tx({ tr: 'Kaldırmak için tıklayın', en: 'Click to remove' })}
              className="rounded-lg border border-[#7C1D2E] bg-[#FDF2F4] px-3 py-1.5 text-sm font-medium text-[#7C1D2E] transition-colors hover:bg-[#FCE7EB] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#F5D08A]"
            >
              {item.tokens[tokenIdx]}
            </button>
          ))
        )}
      </div>

      {selectedTokens.length > 0 && (
        <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
          {tx({ tr: 'Önizleme:', en: 'Preview:' })}{' '}
          <strong className="font-medium text-[#111113] dark:text-[#F4F4F5]">
            {assembleSatzbauTokens(selectedTokens)}
          </strong>
        </p>
      )}

      {/* Available Word Bank */}
      <div className="flex flex-wrap items-center gap-2">
        {item.tokens.map((token, idx) => {
          const isUsed = selectedIndices.includes(idx);
          return (
            <button
              key={`${token}-${idx}`}
              type="button"
              disabled={isUsed}
              onClick={() => handleAddToken(idx)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                isUsed
                  ? 'border-[#E5E5DF] bg-[#ECECE8] text-[#A1A1AA] cursor-not-allowed dark:border-[#24242C] dark:bg-[#18181D] dark:text-[#52525B]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:border-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]'
              }`}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={handleCheck}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
        >
          <span>{tx({ tr: 'Cümleyi Kontrol Et', en: 'Check Sentence' })}</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{locale.common.reset}</span>
        </button>
      </div>

      {/* Feedback */}
      {result && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${
            result.isCorrect
              ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80]/30 dark:bg-[#102418] dark:text-[#BBF7D0]'
              : 'border-[#B91C1C]/35 bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#2A1215] dark:text-[#FECACA]'
          }`}
        >
          {result.isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div>
            <p className="font-medium">
              {result.feedbackTr}
              {result.isCorrect && lastXp && lastXp > 0 ? ` (+${lastXp} XP)` : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface ClozeTypedCardProps {
  index: number;
  scenarioId: string;
  item: WritingClozeTypedItem;
}

const ClozeTypedCard: React.FC<ClozeTypedCardProps> = ({ index, scenarioId, item }) => {
  const { progress, recordWritingAnswer } = useAppState();
  const { locale, tx } = useI18n();
  const [value, setValue] = useState('');
  const [result, setResult] = useState<ControlledCheckResult | null>(null);
  const [lastXp, setLastXp] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const isMastered = progress.writingMasteredIds.includes(item.id);

  useEffect(() => {
    setValue('');
    setResult(null);
    setLastXp(null);
    setShowHint(false);
  }, [item.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluateTypedCloze(item, value);
    setResult(res);
    if (res.status !== 'empty') {
      const earned = recordWritingAnswer(
        item.id,
        scenarioId,
        'controlled',
        `Lückentext: ${item.beforeBlankDe} ${item.canonicalAnswer} ${item.afterBlankDe}`,
        res.isCorrect
      );
      setLastXp(earned);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 space-y-4 dark:border-[#282830] dark:bg-[#111113]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          <Type className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
          <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
            0{index + 1}.
          </span>
          <span>
            {tx({
              tr: 'Lückentext-Schreiben · Boşluğu Yaz',
              en: 'Lückentext · Fill in the Blank',
            })}
          </span>
          {isMastered && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {locale.common.completed}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
        >
          <Languages className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <span>
            {showHint
              ? locale.common.hideHint
              : tx({ tr: 'Türkçe İpucu', en: 'Turkish Hint' })}
          </span>
        </button>
      </div>

      {/* Inline Blank Sentence */}
      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
        <span>{item.beforeBlankDe}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (result) setResult(null);
          }}
          aria-label={tx({
            tr: 'Eksik Almanca sözcüğü yazın',
            en: 'Type the missing German word',
          })}
          placeholder="…"
          autoComplete="off"
          className="w-36 sm:w-44 rounded-lg border border-[#7C1D2E]/50 bg-[#FFFFFF] px-3 py-1.5 font-mono text-sm font-semibold text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#D9A13B]/50 dark:bg-[#16161A] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
        />
        <span>{item.afterBlankDe}</span>
      </div>

      {showHint && (
        <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
          {tx({ tr: 'İpucu:', en: 'Hint:' })} {item.hintTr}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
          >
            <span>{tx({ tr: 'Yanıtı Kontrol Et', en: 'Check Answer' })}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setValue('');
              setResult(null);
              setLastXp(null);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{tx({ tr: 'Temizle', en: 'Clear' })}</span>
          </button>
        </div>

        <GermanCharBar compact onInsert={(ch) => setValue((prev) => `${prev}${ch}`)} />
      </div>

      {result && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${
            result.isCorrect
              ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80]/30 dark:bg-[#102418] dark:text-[#BBF7D0]'
              : result.status === 'capitalization' || result.status === 'article-hint'
              ? 'border-[#9A6B16]/40 bg-[#FEF9EB] text-[#713F12] dark:border-[#D9A13B]/35 dark:bg-[#231D11] dark:text-[#FDE68A]'
              : 'border-[#B91C1C]/35 bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#2A1215] dark:text-[#FECACA]'
          }`}
        >
          {result.isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : result.status === 'capitalization' || result.status === 'article-hint' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <p className="font-medium">
            {result.feedbackTr}
            {result.isCorrect && lastXp && lastXp > 0 ? ` (+${lastXp} XP)` : ''}
          </p>
        </div>
      )}
    </form>
  );
};

export const WritingControlledTasks: React.FC<WritingControlledTasksProps> = ({
  scenarioId,
  items,
}) => {
  return (
    <div className="space-y-4">
      {items.map((item, idx) =>
        item.kind === 'satzbau' ? (
          <SatzbauCard key={item.id} index={idx} scenarioId={scenarioId} item={item} />
        ) : (
          <ClozeTypedCard key={item.id} index={idx} scenarioId={scenarioId} item={item} />
        )
      )}
    </div>
  );
};
