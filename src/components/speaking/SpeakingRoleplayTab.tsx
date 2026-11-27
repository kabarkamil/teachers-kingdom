import React, { useEffect, useState } from 'react';
import {
  BookMarked,
  CheckCircle2,
  Eye,
  EyeOff,
  MessageSquare,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { SpeakingRoleplayTask } from '../../types';
import { ModelAudioBar } from './ModelAudioBar';
import { SpeechTranscriptHelper } from './SpeechTranscriptHelper';

interface SpeakingRoleplayTabProps {
  scenarioId: string;
  task: SpeakingRoleplayTask;
}

export const SpeakingRoleplayTab: React.FC<SpeakingRoleplayTabProps> = ({ scenarioId, task }) => {
  const { progress, recordSpeakingCompletion } = useAppState();
  const { locale, tx } = useI18n();
  const [showPhrases, setShowPhrases] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [revealedTurns, setRevealedTurns] = useState<Record<string, boolean>>({});
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ xpAwarded: number } | null>(null);

  useEffect(() => {
    setShowPhrases(false);
    setShowTranslation(false);
    setRevealedTurns({});
    setCheckedCriteria({});
    setFeedback(null);
  }, [scenarioId, task.id]);

  const isMastered = progress.speakingMasteredIds.includes(task.id);
  const allChecked = task.selfCheckCriteria.every((c) => Boolean(checkedCriteria[c.id]));
  const learnerGender = task.partnerGender === 'female' ? 'male' : 'female';

  const handleComplete = () => {
    const xpAwarded = recordSpeakingCompletion(task.id, scenarioId, 'roleplay', task.titleTr);
    setFeedback({ xpAwarded });
  };

  return (
    <div className="space-y-6">
      {/* Header & Situation Brief */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
            {tx(
              {
                tr: '3. Dialog / Rollenspiel · {{title}}',
                en: '3. Dialogue / Roleplay · {{title}}',
              },
              { title: task.titleDe }
            )}
          </p>
          <h3 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {task.titleTr}
          </h3>
        </div>
        {isMastered ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
            <CheckCircle2 className="h-4 w-4" />
            <span>{locale.common.completed}</span>
          </span>
        ) : (
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'İlk tamamlama +10 XP', en: 'First completion +10 XP' })}
          </span>
        )}
      </div>

      {/* Situation Context Box */}
      <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <UserRound className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx(
              { tr: 'Konuşma Partneri: {{name}}', en: 'Speaking Partner: {{name}}' },
              { name: task.partnerName }
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span>{task.partnerRoleTr}</span>
        </div>

        <p className="text-sm leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
          {task.situationDe}
        </p>

        {showTranslation && (
          <p className="border-t border-[#D9D9D3] pt-2.5 text-xs sm:text-sm leading-relaxed text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]">
            {task.situationTr}
          </p>
        )}

        {/* Hidden-by-default Support Toggles */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            onClick={() => setShowPhrases((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>
              {showPhrases
                ? tx({ tr: 'İpuçları / Redemittel’i Gizle', en: 'Hide Hints / Redemittel' })
                : tx({
                    tr: 'İpuçları / Redemittel (A1 İfadeler)',
                    en: 'Hints / Redemittel (A1 Phrases)',
                  })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowTranslation((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
          >
            {showTranslation ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>
              {showTranslation
                ? tx({
                    tr: 'Türkçe Yönerge / Çeviriyi Gizle',
                    en: 'Hide Turkish Gloss / Translation',
                  })
                : tx({ tr: 'Türkçe Yönerge / Çeviri', en: 'Turkish Gloss / Translation' })}
            </span>
          </button>
        </div>
      </div>

      {/* Redemittel Panel */}
      {showPhrases && (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 space-y-2 dark:border-[#282830] dark:bg-[#111113]">
          <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Rol Oyunu İçin A1 Kalıpları (Redemittel)',
              en: 'A1 Roleplay Phrases (Redemittel)',
            })}
          </p>
          <ul className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
            {task.phrases.map((phrase) => (
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

      {/* 3 Guided Dialogue Turns */}
      <div className="space-y-4">
        {task.turns.map((turn) => {
          const modelOpen = Boolean(revealedTurns[turn.id]);

          return (
            <div
              key={turn.id}
              className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 sm:p-5 space-y-4 dark:border-[#282830] dark:bg-[#111113]/60"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                  {tx(
                    { tr: 'Tur 0{{num}} · {{name}}', en: 'Turn 0{{num}} · {{name}}' },
                    { num: turn.turnNumber, name: task.partnerName }
                  )}
                </span>
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Dinle ve yanıtla', en: 'Listen and respond' })}
                </span>
              </div>

              {/* Partner Line */}
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 space-y-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                <p className="text-sm sm:text-base font-medium text-[#111113] dark:text-[#F4F4F5]">
                  “{turn.partnerLineDe}”
                </p>
                {showTranslation && (
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {turn.partnerLineTr}
                  </p>
                )}
                <ModelAudioBar
                  textDe={turn.partnerLineDe}
                  labelTr={`${task.partnerName} Repliğini Dinle`}
                  labelEn={`Listen to ${task.partnerName}`}
                  speakerGender={task.partnerGender}
                  compact
                />
              </div>

              {/* Learner Response Cue */}
              <div className="space-y-2.5 pl-1">
                <div className="flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {tx({ tr: 'Sıra Sizde:', en: 'Your Turn:' })}{' '}
                      <span className="font-normal">{turn.learnerCueDe}</span>
                    </p>
                    {showTranslation && (
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        {turn.learnerCueTr}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setRevealedTurns((prev) => ({ ...prev, [turn.id]: !prev[turn.id] }))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
                >
                  {modelOpen ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>
                    {modelOpen
                      ? tx({ tr: 'Örnek Yanıtı Gizle', en: 'Hide Sample Answer' })
                      : tx({
                          tr: 'Örnek A1 Yanıtı Göster / Dinle (önce kendiniz deneyin)',
                          en: 'Show / Listen to Sample A1 Answer (try yourself first)',
                        })}
                  </span>
                </button>

                {modelOpen && (
                  <div className="rounded-lg border border-[#7C1D2E]/30 bg-[#FDF2F4]/40 p-3.5 space-y-2.5 dark:border-[#D9A13B]/40 dark:bg-[#1B1813]">
                    <p className="text-sm font-medium text-[#111113] dark:text-[#F4F4F5]">
                      “{turn.modelResponseDe}”
                    </p>
                    {showTranslation && (
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        {turn.modelResponseTr}
                      </p>
                    )}
                    <ModelAudioBar
                      textDe={turn.modelResponseDe}
                      labelTr="Örnek Yanıtı Dinle"
                      labelEn="Listen to Sample Answer"
                      speakerGender={learnerGender}
                      compact
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Local Speech-to-Text Helper */}
      <SpeechTranscriptHelper taskId={task.id} />

      {/* Explicit A1 Self-Check Checklist */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-3 dark:border-[#282830] dark:bg-[#111113]/60">
        <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
          {tx(
            {
              tr: 'Rol Oyunu A1 Öz-Değerlendirme Kontrol Listesi ({{count}} ölçütü onaylayın)',
              en: 'A1 Roleplay Self-Assessment Checklist (Check all {{count}} criteria)',
            },
            { count: task.selfCheckCriteria.length }
          )}
        </p>

        <div className="space-y-2">
          {task.selfCheckCriteria.map((criterion) => {
            const checked = Boolean(checkedCriteria[criterion.id]);
            return (
              <label
                key={criterion.id}
                className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-[#111113] dark:text-[#E4E4E7]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setCheckedCriteria((prev) => ({
                      ...prev,
                      [criterion.id]: !prev[criterion.id],
                    }))
                  }
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
            onClick={handleComplete}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-medium transition-colors ${
              allChecked
                ? 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]'
                : 'cursor-not-allowed bg-[#ECECE8] text-[#71717A] dark:bg-[#23232B] dark:text-[#71717A]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isMastered
                ? tx({ tr: 'Rol Oyununu Tekrar Kaydet (0 XP)', en: 'Log Roleplay Repeat (0 XP)' })
                : tx({
                    tr: 'Rol Oyununu Tamamlandı Olarak Kaydet (+10 XP)',
                    en: 'Mark Roleplay Complete (+10 XP)',
                  })}
            </span>
          </button>

          {feedback && (
            <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
              {feedback.xpAwarded > 0
                ? tx(
                    {
                      tr: 'Rol oyunu pratiği kaydedildi · +{{xp}} XP kazanıldı.',
                      en: 'Roleplay practice saved · +{{xp}} XP earned.',
                    },
                    { xp: feedback.xpAwarded }
                  )
                : tx({
                    tr: 'Tekrar pratiğiniz kaydedildi (bu rol oyunu daha önce tamamlandığı için ek XP eklenmedi).',
                    en: 'Repeat practice saved (no extra XP — this roleplay was already completed).',
                  })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
