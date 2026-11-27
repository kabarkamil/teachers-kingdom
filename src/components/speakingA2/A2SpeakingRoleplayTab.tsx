import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lightbulb, RotateCcw } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { A2SpeakingScenario } from '../../types';
import { stopGermanSpeech } from '../../utils/speech';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { SpeechTranscriptHelper } from '../speaking/SpeechTranscriptHelper';

interface A2SpeakingRoleplayTabProps {
  scenario: A2SpeakingScenario;
}

export const A2SpeakingRoleplayTab: React.FC<A2SpeakingRoleplayTabProps> = ({ scenario }) => {
  const { a2Progress, recordA2SpeakingCompletion } = useAppState();
  const roleplay = scenario.roleplay;

  const [showTurkish, setShowTurkish] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [revealedSamples, setRevealedSamples] = useState<Record<string, boolean>>({});
  const [checks, setChecks] = useState<boolean[]>(() =>
    roleplay.selfCheckCriteria.map(() => false)
  );
  const [completedBanner, setCompletedBanner] = useState<{
    taskId: string;
    xpAwarded: number;
  } | null>(null);

  useEffect(() => {
    setShowTurkish(false);
    setShowPhrases(false);
    setRevealedSamples({});
    setChecks(roleplay.selfCheckCriteria.map(() => false));
    setCompletedBanner(null);
    stopGermanSpeech();
  }, [scenario.id, roleplay.selfCheckCriteria]);

  const isMastered = a2Progress.speakingMasteredIds.includes(roleplay.id);
  const allChecked = checks.every(Boolean);

  const toggleSample = (turnId: string) => {
    setRevealedSamples((prev) => ({ ...prev, [turnId]: !prev[turnId] }));
  };

  const handleToggleCheck = (idx: number) => {
    setChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleComplete = () => {
    if (!allChecked) return;
    const xpAwarded = recordA2SpeakingCompletion(
      roleplay.id,
      scenario.id,
      'roleplay',
      `${scenario.titleTr} · A2 Rol Oyunu (${roleplay.turns.length} Tur)`
    );
    setCompletedBanner({ taskId: roleplay.id, xpAwarded });
  };

  const handleReset = () => {
    setRevealedSamples({});
    setChecks(roleplay.selfCheckCriteria.map(() => false));
    setCompletedBanner(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
        <span>
          <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            3. Çok Turlu Rol Oyunu
          </strong>{' '}
          · Partneri dinleyip yanıtınızı sesli kurun, sonra örnekle karşılaştırın.
        </span>
        <span className="font-mono tabular-nums">{roleplay.turns.length} Tur</span>
      </div>

      {/* Scenario Brief Card */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-3.5 text-xs dark:border-[#24242C]">
          <div className="flex flex-wrap items-center gap-2 text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {scenario.registerLabelTr}
            </span>
            <span aria-hidden="true">·</span>
            <span>Partner: {roleplay.partnerRoleDe}</span>
            <span aria-hidden="true">·</span>
            <span>Rolünüz: {roleplay.learnerRoleTr}</span>
          </div>
          <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">
            {isMastered ? (
              <span className="font-semibold text-[#15803D] dark:text-[#4ADE80]">
                Tamamlandı
              </span>
            ) : (
              'Yeni Görev (+10 A2 XP)'
            )}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {roleplay.titleDe}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
            {roleplay.titleTr}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
            {roleplay.situationTr}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTurkish((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
          >
            {showTurkish ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showTurkish ? 'Türkçe Çevirileri Gizle' : 'Partner Çevirilerini Göster'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPhrases((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
            <span>{showPhrases ? 'Redemittel Gizle' : 'Diyalog Kalıpları (Redemittel)'}</span>
          </button>
        </div>

        {showPhrases && (
          <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/70 p-4 space-y-2 dark:border-[#24242C] dark:bg-[#111113]">
            <p className="text-xs font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
              Senaryoya Özel A2 Kalıpları (Redemittel)
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {roleplay.phrases.map((p) => (
                <li
                  key={p.de}
                  className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-3 dark:border-[#24242C] dark:bg-[#16161A]"
                >
                  <p className="font-medium text-[#111113] dark:text-[#F4F4F5]">{p.de}</p>
                  <p className="mt-0.5 text-[#52525B] dark:text-[#A1A1AA]">{p.tr}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Multi-turn Dialogue Cards */}
      <div className="space-y-4">
        {roleplay.turns.map((turn, idx) => {
          const sampleOpen = Boolean(revealedSamples[turn.id]);
          return (
            <div
              key={turn.id}
              className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 space-y-4 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B] tabular-nums">
                  Tur {idx + 1} / {roleplay.turns.length} · {turn.partnerNameDe}
                </span>
                <span className="text-[#52525B] dark:text-[#A1A1AA]">
                  Partner Repliği
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                  “{turn.partnerLineDe}”
                </p>
                {showTurkish && (
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                    {turn.partnerLineTr}
                  </p>
                )}

                <ModelAudioBar
                  textDe={turn.partnerLineDe}
                  labelTr={`${turn.partnerNameDe} Dinle (de-DE)`}
                  speakerGender={turn.partnerGender}
                  compact
                />
              </div>

              {/* Learner Cue */}
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4]/80 p-4 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                    Sıra Sizde ({roleplay.learnerRoleTr})
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleSample(turn.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                  >
                    {sampleOpen ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    <span>{sampleOpen ? 'Örnek Yanıtı Gizle' : 'Örnek Yanıtı Göster'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-[#111113] dark:text-[#E4E4E7]">
                  {turn.learnerCueTr}
                </p>

                {sampleOpen && (
                  <div className="border-t border-[#ECECE8] pt-3 space-y-2.5 dark:border-[#24242C]">
                    <p className="text-sm font-medium text-[#111113] dark:text-[#F4F4F5]">
                      {turn.sampleResponseDe}
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {turn.sampleResponseTr}
                    </p>
                    <ModelAudioBar
                      textDe={turn.sampleResponseDe}
                      labelTr="Örnek Yanıtı Dinle (de-DE)"
                      speakerGender={turn.sampleGender}
                      compact
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional Browser SpeechRecognition Helper & Self-Check */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
        <SpeechTranscriptHelper taskId={roleplay.id} />

        <div className="space-y-3 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Rol Oyunu Öz-Değerlendirme Kontrol Listesi (3 Adım)
            </p>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {checks.filter(Boolean).length} / {checks.length}
            </span>
          </div>

          <div className="space-y-2">
            {roleplay.selfCheckCriteria.map((criterion, cIdx) => (
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

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              disabled={!allChecked}
              onClick={handleComplete}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {isMastered ? 'Tekrarı Kaydet (0 XP)' : 'Rol Oyununu Tamamla (+10 A2 XP)'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>

          {completedBanner && completedBanner.taskId === roleplay.id && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
            >
              <span>
                {roleplay.turns.length} turlu A2 rol oyunu yerel A2 ilerlemenize kaydedildi.
              </span>
              <span className="font-mono font-semibold tabular-nums shrink-0">
                {completedBanner.xpAwarded > 0
                  ? `+${completedBanner.xpAwarded} A2 XP`
                  : '0 XP (Daha önce kazanıldı)'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
