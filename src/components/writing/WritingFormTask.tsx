import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Languages,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { WritingFormTaskData } from '../../types';
import { evaluateFormField, type FormFieldCheckResult } from '../../utils/writingEvaluator';
import { GermanCharBar } from './GermanCharBar';

interface WritingFormTaskProps {
  scenarioId: string;
  task: WritingFormTaskData;
}

export const WritingFormTask: React.FC<WritingFormTaskProps> = ({ scenarioId, task }) => {
  const { progress, recordWritingAnswer } = useAppState();
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, FormFieldCheckResult> | null>(null);
  const [showTurkish, setShowTurkish] = useState(false);
  const [lastXpAwarded, setLastXpAwarded] = useState<number | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(task.fields[0]?.id ?? null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isMastered = progress.writingMasteredIds.includes(task.id);

  // Reset form state cleanly when switching scenario
  useEffect(() => {
    setValues({});
    setResults(null);
    setShowTurkish(false);
    setLastXpAwarded(null);
    setActiveFieldId(task.fields[0]?.id ?? null);
  }, [task.id, task.fields]);

  const handleFieldChange = (fieldId: string, nextVal: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: nextVal }));
    if (results) {
      setResults((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        delete copy[fieldId];
        return Object.keys(copy).length > 0 ? copy : null;
      });
    }
  };

  const handleInsertChar = (ch: string) => {
    const targetId = activeFieldId ?? task.fields[0]?.id;
    if (!targetId) return;
    const el = inputRefs.current[targetId];
    const current = values[targetId] ?? '';

    if (el && typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = `${current.slice(0, start)}${ch}${current.slice(end)}`;
      handleFieldChange(targetId, next);
      window.requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + ch.length, start + ch.length);
      });
    } else {
      handleFieldChange(targetId, `${current}${ch}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const evaluated: Record<string, FormFieldCheckResult> = {};
    let correctCount = 0;
    let hasAnyInput = false;

    for (const field of task.fields) {
      const raw = values[field.id] ?? '';
      if (raw.trim().length > 0) hasAnyInput = true;
      const res = evaluateFormField(field, raw);
      evaluated[field.id] = res;
      if (res.isCorrect) correctCount += 1;
    }

    setResults(evaluated);
    if (!hasAnyInput) {
      setLastXpAwarded(null);
      return;
    }

    const allCorrect = correctCount === task.fields.length;
    const earned = recordWritingAnswer(task.id, scenarioId, 'form', task.titleTr, allCorrect);
    setLastXpAwarded(earned);
  };

  const handleReset = () => {
    setValues({});
    setResults(null);
    setLastXpAwarded(null);
  };

  const allPassed =
    results !== null && task.fields.every((field) => results[field.id]?.isCorrect === true);
  const passedCount = results
    ? task.fields.filter((field) => results[field.id]?.isCorrect === true).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Situation Brief (German first, optional Turkish guidance toggle) */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 dark:border-[#282830] dark:bg-[#111113]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              <ClipboardList className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
              <span>Formular ausfüllen</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#7C1D2E] dark:text-[#D9A13B]">{task.titleDe}</span>
              {isMastered && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tamamlandı
                  </span>
                </>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {task.titleTr}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowTurkish((prev) => !prev)}
            aria-expanded={showTurkish}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              showTurkish
                ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
            }`}
          >
            <Languages className="h-3.5 w-3.5 shrink-0" />
            <span>{showTurkish ? 'Türkçe Yönergeyi Gizle' : 'Türkçe Yönerge / Çeviri'}</span>
          </button>
        </div>

        <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
          {task.situationDe}
        </p>

        {showTurkish && (
          <p className="mt-2.5 border-t border-[#E5E5DF] pt-2.5 text-xs sm:text-sm leading-relaxed text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
            {task.situationTr}
          </p>
        )}
      </div>

      {/* Interactive German A1 Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GermanCharBar onInsert={handleInsertChar} />
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            Almancada isimler ve özel adlar büyük harfle başlar.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {task.fields.map((field, index) => {
            const fieldRes = results?.[field.id];
            const borderTone = !fieldRes
              ? 'border-[#D9D9D3] focus:border-[#7C1D2E] dark:border-[#282830] dark:focus:border-[#D9A13B]'
              : fieldRes.isCorrect
              ? 'border-[#15803D] dark:border-[#4ADE80]'
              : fieldRes.status === 'capitalization'
              ? 'border-[#9A6B16] dark:border-[#D9A13B]'
              : 'border-[#B91C1C] dark:border-[#F87171]';

            return (
              <div
                key={field.id}
                className="rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-4 dark:border-[#24242C] dark:bg-[#111113]"
              >
                <label
                  htmlFor={field.id}
                  className="flex items-baseline justify-between gap-2 text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                >
                  <span>
                    <span className="mr-1.5 font-mono text-[#9A6B16] dark:text-[#D9A13B]">
                      0{index + 1}.
                    </span>
                    {field.labelDe}
                  </span>
                  {showTurkish && (
                    <span className="font-normal text-[#52525B] dark:text-[#A1A1AA]">
                      {field.labelTr}
                    </span>
                  )}
                </label>

                <input
                  ref={(el) => {
                    inputRefs.current[field.id] = el;
                  }}
                  id={field.id}
                  type="text"
                  value={values[field.id] ?? ''}
                  onFocus={() => setActiveFieldId(field.id)}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholderDe}
                  autoComplete="off"
                  className={`mt-2 w-full rounded-lg border bg-[#FAFAF8] px-3.5 py-2.5 text-sm text-[#111113] placeholder:text-[#71717A] focus:outline-none dark:bg-[#16161A] dark:text-[#F4F4F5] dark:placeholder:text-[#71717A] ${borderTone}`}
                />

                {fieldRes && (
                  <div
                    className={`mt-2 flex items-start gap-1.5 text-xs leading-relaxed ${
                      fieldRes.isCorrect
                        ? 'text-[#15803D] dark:text-[#4ADE80]'
                        : fieldRes.status === 'capitalization'
                        ? 'text-[#9A6B16] dark:text-[#F5D08A]'
                        : 'text-[#B91C1C] dark:text-[#F87171]'
                    }`}
                  >
                    {fieldRes.isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : fieldRes.status === 'capitalization' ? (
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{fieldRes.feedbackTr}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Form Actions & Transparent Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <span>Formu Kontrol Et</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Temizle</span>
            </button>
          </div>

          {results && (
            <div
              role="status"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${
                allPassed
                  ? 'text-[#15803D] dark:text-[#4ADE80]'
                  : 'text-[#9A6B16] dark:text-[#F5D08A]'
              }`}
            >
              {allPassed ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span className="tabular-nums">
                {allPassed
                  ? lastXpAwarded && lastXpAwarded > 0
                    ? `Tüm alanlar doğru (${passedCount}/${task.fields.length}) · +${lastXpAwarded} XP`
                    : `Tüm alanlar doğru (${passedCount}/${task.fields.length}) · Daha önce tamamlandı`
                  : `${passedCount}/${task.fields.length} alan doğru — işaretli alanları düzenleyip tekrar kontrol edin.`}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
