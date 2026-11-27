import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { SpeakingRepeatItem } from '../../types';
import { ModelAudioBar } from './ModelAudioBar';
import { SpeechTranscriptHelper } from './SpeechTranscriptHelper';

interface SpeakingRepeatTabProps {
  scenarioId: string;
  items: SpeakingRepeatItem[];
}

export const SpeakingRepeatTab: React.FC<SpeakingRepeatTabProps> = ({ scenarioId, items }) => {
  const { progress, recordSpeakingCompletion } = useAppState();
  const { locale, tx } = useI18n();
  const [showTranslationMap, setShowTranslationMap] = useState<Record<string, boolean>>({});
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, Record<string, boolean>>>(
    {}
  );
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { xpAwarded: number }>>({});

  useEffect(() => {
    setShowTranslationMap({});
    setCheckedCriteria({});
    setFeedbackMap({});
  }, [scenarioId]);

  const toggleCriterion = (itemId: string, criterionId: string) => {
    setCheckedCriteria((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] ?? {}),
        [criterionId]: !(prev[itemId]?.[criterionId] ?? false),
      },
    }));
  };

  const handleComplete = (item: SpeakingRepeatItem) => {
    const xpAwarded = recordSpeakingCompletion(item.id, scenarioId, 'repeat', item.titleTr);
    setFeedbackMap((prev) => ({
      ...prev,
      [item.id]: { xpAwarded },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
          {tx({
            tr: '1. Nachsprechen & Aussprache (Dinle ve Yüksek Sesle Tekrar Et)',
            en: '1. Repeat & Pronunciation (Listen and Repeat Aloud)',
          })}
        </h3>
        <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
          {tx({
            tr: '1.0× veya 0.8× hızda dinleyin, yüksek sesle tekrar edin ve öz-değerlendirmeyi işaretleyin.',
            en: 'Listen at 1.0× or 0.8× speed, repeat aloud, and check off your self-assessment.',
          })}
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const isMastered = progress.speakingMasteredIds.includes(item.id);
          const showTr = Boolean(showTranslationMap[item.id]);
          const itemChecks = checkedCriteria[item.id] ?? {};
          const allChecked = item.selfCheckCriteria.every((c) => Boolean(itemChecks[c.id]));
          const feedback = feedbackMap[item.id];

          return (
            <article
              key={item.id}
              className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-4 dark:border-[#282830] dark:bg-[#111113]/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                  {item.titleTr}
                </p>
                {isMastered ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{locale.common.completed}</span>
                  </span>
                ) : (
                  <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({ tr: 'İlk tamamlama +10 XP', en: 'First completion +10 XP' })}
                  </span>
                )}
              </div>

              {/* Model German Sentence */}
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#16161A]">
                <p className="font-display text-lg sm:text-xl font-medium leading-snug text-[#111113] dark:text-[#F4F4F5]">
                  “{item.textDe}”
                </p>

                <ModelAudioBar
                  textDe={item.textDe}
                  labelTr="Model Cümleyi Dinle"
                  labelEn="Listen to Model Sentence"
                  speakerGender={item.speakerGender}
                />

                <div className="border-t border-[#D9D9D3] pt-3 space-y-1.5 dark:border-[#282830]">
                  <p className="font-mono text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                    {tx(
                      { tr: 'Telaffuz Odağı: {{focus}}', en: 'Pronunciation Focus: {{focus}}' },
                      { focus: item.pronunciationFocusDe }
                    )}
                  </p>
                  <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {item.pronunciationTipTr}
                  </p>
                </div>
              </div>

              {/* Hidden-by-default Turkish Translation Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setShowTranslationMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                >
                  {showTr ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>
                    {showTr
                      ? tx({ tr: 'Türkçe Çeviriyi Gizle', en: 'Hide Turkish Gloss' })
                      : tx({
                          tr: 'Türkçe Yönerge / Çeviriyi Göster',
                          en: 'Show Turkish Gloss / Translation',
                        })}
                  </span>
                </button>
                {showTr && (
                  <p className="mt-2 rounded-lg border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-xs sm:text-sm text-[#111113] dark:border-[#24242C] dark:bg-[#16161A] dark:text-[#E4E4E7]">
                    {item.textTr}
                  </p>
                )}
              </div>

              {/* Optional Honest Local Speech-to-Text Preview */}
              <SpeechTranscriptHelper taskId={item.id} />

              {/* Explicit A1 Self-Check Checklist */}
              <div className="space-y-3 border-t border-[#ECECE8] pt-4 dark:border-[#24242C]">
                <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx(
                    {
                      tr: 'A1 Öz-Değerlendirme Kontrol Listesi (Tamamlamak için {{count}} ölçütü onaylayın)',
                      en: 'A1 Self-Assessment Checklist (Check all {{count}} criteria to complete)',
                    },
                    { count: item.selfCheckCriteria.length }
                  )}
                </p>

                <div className="space-y-2">
                  {item.selfCheckCriteria.map((criterion) => {
                    const checked = Boolean(itemChecks[criterion.id]);
                    return (
                      <label
                        key={criterion.id}
                        className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-[#111113] dark:text-[#E4E4E7]"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCriterion(item.id, criterion.id)}
                          className="mt-0.5 h-4 w-4 rounded border-[#D9D9D3] accent-[#7C1D2E] dark:accent-[#D9A13B]"
                        />
                        <span className="leading-snug">{criterion.labelTr}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={!allChecked}
                    onClick={() => handleComplete(item)}
                    className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-medium transition-colors ${
                      allChecked
                        ? 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]'
                        : 'cursor-not-allowed bg-[#ECECE8] text-[#71717A] dark:bg-[#23232B] dark:text-[#71717A]'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {isMastered
                        ? tx({ tr: 'Tekrar Pratiği Kaydet (0 XP)', en: 'Log Repeat Practice (0 XP)' })
                        : tx({
                            tr: 'Pratiği Tamamlandı Olarak Kaydet (+10 XP)',
                            en: 'Mark Practice Complete (+10 XP)',
                          })}
                    </span>
                  </button>

                  {feedback && (
                    <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                      {feedback.xpAwarded > 0
                        ? tx(
                            {
                              tr: 'Öz-değerlendirme kaydedildi · +{{xp}} XP kazanıldı.',
                              en: 'Self-assessment saved · +{{xp}} XP earned.',
                            },
                            { xp: feedback.xpAwarded }
                          )
                        : tx({
                            tr: 'Tekrar pratiğiniz kaydedildi (bu görev daha önce tamamlandığı için ek XP eklenmedi).',
                            en: 'Repeat practice saved (no extra XP — this task was already completed).',
                          })}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
