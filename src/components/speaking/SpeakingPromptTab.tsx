import React, { useEffect, useState } from 'react';
import { BookMarked, CheckCircle2, Eye, EyeOff, MessageCircle, Sparkles } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { SpeakingPromptItem } from '../../types';
import { ModelAudioBar } from './ModelAudioBar';
import { SpeechTranscriptHelper } from './SpeechTranscriptHelper';

interface SpeakingPromptTabProps {
  scenarioId: string;
  items: SpeakingPromptItem[];
}

export const SpeakingPromptTab: React.FC<SpeakingPromptTabProps> = ({ scenarioId, items }) => {
  const { progress, recordSpeakingCompletion } = useAppState();
  const [showPhrasesMap, setShowPhrasesMap] = useState<Record<string, boolean>>({});
  const [showTranslationMap, setShowTranslationMap] = useState<Record<string, boolean>>({});
  const [showModelMap, setShowModelMap] = useState<Record<string, boolean>>({});
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, Record<string, boolean>>>(
    {}
  );
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setShowPhrasesMap({});
    setShowTranslationMap({});
    setShowModelMap({});
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

  const handleComplete = (item: SpeakingPromptItem) => {
    const xpAwarded = recordSpeakingCompletion(item.id, scenarioId, 'prompt', item.titleTr);
    setFeedbackMap((prev) => ({
      ...prev,
      [item.id]:
        xpAwarded > 0
          ? `Kısa yanıt pratiği kaydedildi · +${xpAwarded} XP kazanıldı.`
          : 'Tekrar pratiğiniz kaydedildi (bu görev daha önce tamamlandığı için ek XP eklenmedi).',
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
          2. Leitfragen / Kurze Antwort (Kılavuzlu Kısa A1 Cevapları)
        </h3>
        <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
          Soruyu dinleyip önce kendi A1 cevabınızı sesli verin; gerekirse Redemittel veya örnek yanıtı açın.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const isMastered = progress.speakingMasteredIds.includes(item.id);
          const showPhrases = Boolean(showPhrasesMap[item.id]);
          const showTr = Boolean(showTranslationMap[item.id]);
          const showModel = Boolean(showModelMap[item.id]);
          const itemChecks = checkedCriteria[item.id] ?? {};
          const allChecked = item.selfCheckCriteria.every((c) => Boolean(itemChecks[c.id]));

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
                    <span>Tamamlandı</span>
                  </span>
                ) : (
                  <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    İlk tamamlama +10 XP
                  </span>
                )}
              </div>

              {/* Question Prompt & Cue Points */}
              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#16161A]">
                <p className="font-display text-lg font-medium leading-snug text-[#111113] dark:text-[#F4F4F5]">
                  {item.questionDe}
                </p>

                <ModelAudioBar
                  textDe={item.questionDe}
                  labelTr="Soruyu Dinle"
                  speakerGender={item.speakerGender}
                  compact
                />

                <div className="border-t border-[#D9D9D3] pt-3 dark:border-[#282830]">
                  <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    Yanıtınızda Yer Alması Gereken Noktalar (Stichpunkte):
                  </p>
                  <ul className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {item.cuesDe.map((cue, idx) => (
                      <li
                        key={cue}
                        className="rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-2.5 py-2 dark:border-[#282830] dark:bg-[#111113]"
                      >
                        <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                          {idx + 1}. {cue}
                        </span>
                        {showTr && item.cuesTr[idx] && (
                          <span className="mt-0.5 block text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                            {item.cuesTr[idx]}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hidden-by-default Support Toggles */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowPhrasesMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                >
                  <BookMarked className="h-3.5 w-3.5" />
                  <span>
                    {showPhrases
                      ? 'İpuçları / Redemittel’i Gizle'
                      : 'İpuçları / Redemittel (A1 İfadeler)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowTranslationMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
                >
                  {showTr ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>
                    {showTr ? 'Türkçe Yönerge / Çeviriyi Gizle' : 'Türkçe Yönerge / Çeviri'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowModelMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111113] hover:underline dark:text-[#E4E4E7]"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
                  <span>
                    {showModel ? 'Örnek A1 Cevabı Gizle' : 'Örnek A1 Cevabı Göster / Dinle'}
                  </span>
                </button>
              </div>

              {/* Turkish Prompt Translation */}
              {showTr && (
                <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-xs sm:text-sm text-[#111113] dark:border-[#24242C] dark:bg-[#16161A] dark:text-[#E4E4E7]">
                  <span className="font-semibold">Soru (Türkçe): </span>
                  {item.questionTr}
                </div>
              )}

              {/* Redemittel Panel */}
              {showPhrases && (
                <div className="rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] p-4 space-y-2 dark:border-[#282830] dark:bg-[#16161A]">
                  <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    Yardımcı A1 Kalıpları (Redemittel)
                  </p>
                  <ul className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
                    {item.phrases.map((phrase) => (
                      <li
                        key={phrase.id}
                        className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                          {phrase.german}
                        </span>
                        <span className="text-[#52525B] dark:text-[#A1A1AA]">
                          {phrase.categoryTr} · {phrase.turkish}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optional Model Answer with Audio */}
              {showModel && (
                <div className="rounded-lg border border-[#7C1D2E]/30 bg-[#FDF2F4]/40 p-4 space-y-3 dark:border-[#D9A13B]/40 dark:bg-[#1B1813]">
                  <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                    Örnek A1 Model Yanıt
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                    “{item.modelAnswerDe}”
                  </p>
                  <ModelAudioBar
                    textDe={item.modelAnswerDe}
                    labelTr="Örnek Cevabı Dinle"
                    speakerGender={item.speakerGender === 'female' ? 'male' : 'female'}
                    compact
                  />
                  {showTr && (
                    <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {item.modelAnswerTr}
                    </p>
                  )}
                </div>
              )}

              {/* Optional Browser Speech-to-Text Preview */}
              <SpeechTranscriptHelper taskId={item.id} />

              {/* Explicit A1 Self-Check Checklist */}
              <div className="space-y-3 border-t border-[#ECECE8] pt-4 dark:border-[#24242C]">
                <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  A1 Öz-Değerlendirme Kontrol Listesi (Tamamlamak için 3 ölçütü onaylayın)
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
                        ? 'Tekrar Pratiği Kaydet (0 XP)'
                        : 'Pratiği Tamamlandı Olarak Kaydet (+10 XP)'}
                    </span>
                  </button>

                  {feedbackMap[item.id] && (
                    <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                      {feedbackMap[item.id]}
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
