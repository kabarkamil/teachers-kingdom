import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { A2SpeakingScenario } from '../../types';
import { stopGermanSpeech } from '../../utils/speech';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { SpeechTranscriptHelper } from '../speaking/SpeechTranscriptHelper';

interface A2SpeakingPromptTabProps {
  scenario: A2SpeakingScenario;
}

export const A2SpeakingPromptTab: React.FC<A2SpeakingPromptTabProps> = ({ scenario }) => {
  const { a2Progress, recordA2SpeakingCompletion } = useAppState();
  const { locale, tx } = useI18n();
  const items = scenario.promptItems;

  const [index, setIndex] = useState(0);
  const [showTurkish, setShowTurkish] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean[]>>({});
  const [completedBanner, setCompletedBanner] = useState<{
    taskId: string;
    xpAwarded: number;
  } | null>(null);

  useEffect(() => {
    setIndex(0);
    setShowTurkish(false);
    setShowPhrases(false);
    setShowModelAnswer(false);
    setCompletedBanner(null);
    stopGermanSpeech();
  }, [scenario.id]);

  const item = items[index];
  if (!item) return null;

  const isMastered = a2Progress.speakingMasteredIds.includes(item.id);
  const checks = checkedMap[item.id] ?? item.selfCheckCriteria.map(() => false);
  const allChecked = checks.every(Boolean);

  const handleToggleCheck = (criterionIdx: number) => {
    setCheckedMap((prev) => {
      const current = prev[item.id] ?? item.selfCheckCriteria.map(() => false);
      const next = current.map((v, i) => (i === criterionIdx ? !v : v));
      return { ...prev, [item.id]: next };
    });
  };

  const handleComplete = () => {
    if (!allChecked) return;
    const xpAwarded = recordA2SpeakingCompletion(
      item.id,
      scenario.id,
      'prompt',
      `${scenario.titleTr} · A2 Kılavuzlu Yanıt ${index + 1}`
    );
    setCompletedBanner({ taskId: item.id, xpAwarded });
  };

  const handleReset = () => {
    setCheckedMap((prev) => ({
      ...prev,
      [item.id]: item.selfCheckCriteria.map(() => false),
    }));
    setCompletedBanner(null);
  };

  const handleMove = (delta: number) => {
    stopGermanSpeech();
    setIndex((prev) => (prev + delta + items.length) % items.length);
    setShowTurkish(false);
    setShowPhrases(false);
    setShowModelAnswer(false);
    setCompletedBanner(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
        <span>
          <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({ tr: '2. Kılavuzlu Yanıt', en: '2. Guided Prompt' })}
          </strong>{' '}
          {tx({
            tr: '· İpuçlarıyla 2–3 A2 cümlesi kurup sesli anlatın.',
            en: '· Build 2–3 A2 sentences using the cues and speak aloud.',
          })}
        </span>
        <span className="font-mono tabular-nums">
          {tx(
            { tr: 'Soru {{current}} / {{total}}', en: 'Prompt {{current}} / {{total}}' },
            { current: index + 1, total: items.length }
          )}
        </span>
      </div>

      <article className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-3.5 text-xs dark:border-[#24242C]">
          <span className="font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
            {tx(
              {
                tr: 'CEFR A2 Sözlü Üretim · {{register}}',
                en: 'CEFR A2 Spoken Production · {{register}}',
              },
              { register: scenario.registerLabelTr }
            )}
          </span>
          <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">
            {isMastered ? (
              <span className="font-semibold text-[#15803D] dark:text-[#4ADE80]">
                {locale.common.completed}
              </span>
            ) : (
              tx({ tr: 'Yeni Görev (+10 A2 XP)', en: 'New Task (+10 A2 XP)' })
            )}
          </span>
        </div>

        {/* Prompt Question + Audio */}
        <div className="space-y-4">
          <div>
            <p className="font-display text-xl sm:text-2xl font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
              {item.questionDe}
            </p>
            {showTurkish && (
              <p className="mt-2 text-sm text-[#52525B] dark:text-[#D4D4D8]">{item.questionTr}</p>
            )}
          </div>

          <ModelAudioBar
            textDe={item.questionDe}
            labelTr="Soruyu Dinle (de-DE)"
            labelEn="Listen to Question (de-DE)"
            speakerGender={item.speakerGender}
            compact
          />
        </div>

        {/* Stichpunkte / Guided Cues */}
        <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/80 p-4 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
          <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Konuşma Planı İpuçları (Stichpunkte)',
              en: 'Speaking Plan Cues (Stichpunkte)',
            })}
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm">
            {item.cuesDe.map((cueDe, idx) => (
              <li key={cueDe} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                  • {cueDe}
                </span>
                {showTurkish && item.cuesTr[idx] && (
                  <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    — {item.cuesTr[idx]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* On-demand Support Toggles (Hidden by default) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTurkish((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
          >
            {showTurkish ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showTurkish ? locale.common.hideTurkish : locale.common.showTurkish}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPhrases((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
            <span>
              {showPhrases
                ? tx({ tr: 'Redemittel Gizle', en: 'Hide Redemittel' })
                : tx({
                    tr: 'A2 Yardımcı Kalıplar (Redemittel)',
                    en: 'A2 Helpful Phrases (Redemittel)',
                  })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowModelAnswer((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#7C1D2E]/40 bg-[#FDF2F4]/60 px-3 text-xs font-medium text-[#7C1D2E] hover:bg-[#FDF2F4] dark:border-[#D9A13B]/50 dark:bg-[#1E1E24] dark:text-[#D9A13B]"
          >
            {showModelAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>
              {showModelAnswer
                ? tx({ tr: 'Model Yanıtı Gizle', en: 'Hide Model Answer' })
                : tx({ tr: 'A2 Model Yanıtı Göster', en: 'Show A2 Model Answer' })}
            </span>
          </button>
        </div>

        {/* Redemittel Drawer */}
        {showPhrases && (
          <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/60 p-4 space-y-2 dark:border-[#24242C] dark:bg-[#111113]">
            <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              {tx({
                tr: 'A2 Yardımcı Kalıplar (Redemittel)',
                en: 'A2 Helpful Phrases (Redemittel)',
              })}
            </p>
            <ul className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
              {item.phrases.map((p) => (
                <li key={p.de} className="py-2">
                  <p className="font-medium text-[#111113] dark:text-[#F4F4F5]">{p.de}</p>
                  <p className="mt-0.5 text-[#52525B] dark:text-[#A1A1AA]">{p.tr}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Model Answer Drawer with Verified de-DE Audio */}
        {showModelAnswer && (
          <div className="rounded-lg border border-[#7C1D2E]/35 bg-[#FDF2F4]/40 p-4 sm:p-5 space-y-3 dark:border-[#D9A13B]/40 dark:bg-[#1E1B16]">
            <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {tx({
                tr: 'Örnek A2 Model Yanıtı (Kendi cümlenizi kurduktan sonra karşılaştırın)',
                en: 'Sample A2 Model Answer (Compare after forming your own sentences)',
              })}
            </p>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
              {item.modelAnswerDe}
            </p>
            <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
              {item.modelAnswerTr}
            </p>
            <ModelAudioBar
              textDe={item.modelAnswerDe}
              labelTr="Model Yanıtı Dinle (de-DE)"
              labelEn="Listen to Model Answer (de-DE)"
              speakerGender={item.speakerGender === 'female' ? 'male' : 'female'}
              compact
            />
          </div>
        )}

        {/* Optional Browser SpeechRecognition Helper */}
        <SpeechTranscriptHelper taskId={item.id} />

        {/* Self-Check Rubric */}
        <div className="space-y-3 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx(
                {
                  tr: 'Öz-Değerlendirme Kontrol Listesi ({{count}} Adım)',
                  en: 'Self-Assessment Checklist ({{count}} Steps)',
                },
                { count: checks.length }
              )}
            </p>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {checks.filter(Boolean).length} / {checks.length}
            </span>
          </div>

          <div className="space-y-2">
            {item.selfCheckCriteria.map((criterion, cIdx) => (
              <label
                key={criterion}
                className="flex items-start gap-2.5 rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/50 px-3.5 py-2.5 text-xs sm:text-sm text-[#111113] cursor-pointer hover:bg-[#ECECE8]/60 dark:border-[#24242C] dark:bg-[#111113] dark:text-[#E4E4E7] dark:hover:bg-[#1E1E24]"
              >
                <input
                  type="checkbox"
                  checked={checks[cIdx] ?? false}
                  onChange={() => handleToggleCheck(cIdx)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#7C1D2E] dark:accent-[#D9A13B] shrink-0"
                />
                <span>{criterion}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!allChecked}
                onClick={handleComplete}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isMastered
                    ? tx({ tr: 'Tekrarı Kaydet (0 XP)', en: 'Log Repeat (0 XP)' })
                    : tx({ tr: 'Yanıtı Tamamla (+10 A2 XP)', en: 'Complete Prompt (+10 A2 XP)' })}
                </span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{locale.common.reset}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMove(-1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{locale.common.previous}</span>
              </button>
              <button
                type="button"
                onClick={() => handleMove(1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <span>{locale.common.next}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {completedBanner && completedBanner.taskId === item.id && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
            >
              <span>
                {tx({
                  tr: 'A2 kılavuzlu yanıt çalışması yerel A2 ilerlemenize kaydedildi.',
                  en: 'A2 guided prompt practice saved to your local A2 progress.',
                })}
              </span>
              <span className="font-mono font-semibold tabular-nums shrink-0">
                {completedBanner.xpAwarded > 0
                  ? `+${completedBanner.xpAwarded} A2 XP`
                  : tx({ tr: '0 XP (Daha önce kazanıldı)', en: '0 XP (Already earned)' })}
              </span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
