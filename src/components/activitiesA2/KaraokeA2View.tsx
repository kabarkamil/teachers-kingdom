import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Play,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { A2_KARAOKE_IDS, GERMAN_A2_KARAOKE_TRACKS } from '../../data/germanA2Activities';
import { useI18n } from '../../hooks/useI18n';
import type { KaraokeTrack, NavRouteId } from '../../types';
import {
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type SpeechFailureReason,
} from '../../utils/speech';
import { ActivityA2SubNav } from './ActivityA2SubNav';

interface KaraokeA2ViewProps {
  onNavigate: (route: NavRouteId) => void;
}

export const KaraokeA2View: React.FC<KaraokeA2ViewProps> = ({ onNavigate }) => {
  const { a2Progress, rolePreview, speechSpeed, recordA2KaraokeCompletion } = useAppState();
  const { locale, tx } = useI18n();
  const [selectedTrackId, setSelectedTrackId] = useState<string>(GERMAN_A2_KARAOKE_TRACKS[0].id);
  const [rateMode, setRateMode] = useState<'slow' | 'normal'>(speechSpeed);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    setRateMode(speechSpeed);
  }, [speechSpeed]);

  // Playback state strictly confirmed via src/utils/speech.ts onStart / onEnd
  const [startingLineIndex, setStartingLineIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSequenceMode, setIsSequenceMode] = useState(false);
  const [audioErrorReason, setAudioErrorReason] = useState<SpeechFailureReason | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { xp: number }>>({});

  const playbackTokenRef = useRef(0);
  const speechSupported = isSpeechSynthesisSupported();

  const activeTrack: KaraokeTrack =
    GERMAN_A2_KARAOKE_TRACKS.find((t) => t.id === selectedTrackId) ?? GERMAN_A2_KARAOKE_TRACKS[0];

  const stopPlayback = () => {
    playbackTokenRef.current += 1;
    stopGermanSpeech();
    setStartingLineIndex(null);
    setActiveLineIndex(null);
    setIsSequenceMode(false);
  };

  useEffect(() => {
    stopPlayback();
    setAudioErrorReason(null);
    return () => {
      playbackTokenRef.current += 1;
      stopGermanSpeech();
    };
  }, [selectedTrackId]);

  const playLineAt = (index: number, continueSequence: boolean, token: number) => {
    if (playbackTokenRef.current !== token) return;
    const line = activeTrack.lines[index];
    if (!line) {
      setStartingLineIndex(null);
      setActiveLineIndex(null);
      setIsSequenceMode(false);
      return;
    }

    setAudioErrorReason(null);
    setStartingLineIndex(index);
    setIsSequenceMode(continueSequence);

    const explicitRate = rateMode === 'slow' ? 0.78 : 0.96;
    const result = speakGermanText(
      line.textDe,
      rateMode,
      {
        onStart: () => {
          if (playbackTokenRef.current !== token) return;
          setStartingLineIndex(null);
          setActiveLineIndex(index);
        },
        onEnd: () => {
          if (playbackTokenRef.current !== token) return;
          setActiveLineIndex(null);
          if (continueSequence && index + 1 < activeTrack.lines.length) {
            playLineAt(index + 1, true, token);
          } else {
            setIsSequenceMode(false);
          }
        },
        onError: (reason) => {
          if (playbackTokenRef.current !== token) return;
          setStartingLineIndex(null);
          setActiveLineIndex(null);
          setIsSequenceMode(false);
          setAudioErrorReason(reason ?? 'error');
        },
      },
      explicitRate,
      line.speakerGender
    );

    if (!result.queued) {
      setStartingLineIndex(null);
      setActiveLineIndex(null);
      setIsSequenceMode(false);
      setAudioErrorReason(result.reason ?? 'error');
    }
  };

  const handlePlayAll = () => {
    if (activeLineIndex !== null || startingLineIndex !== null) {
      stopPlayback();
      return;
    }
    playbackTokenRef.current += 1;
    const token = playbackTokenRef.current;
    playLineAt(0, true, token);
  };

  const handlePlaySingleLine = (index: number) => {
    if (activeLineIndex === index || startingLineIndex === index) {
      stopPlayback();
      return;
    }
    playbackTokenRef.current += 1;
    const token = playbackTokenRef.current;
    playLineAt(index, false, token);
  };

  const handleMarkTrackComplete = () => {
    const xp = recordA2KaraokeCompletion(activeTrack.id, activeTrack.titleDe);
    setFeedbackMap((prev) => ({
      ...prev,
      [activeTrack.id]: { xp },
    }));
  };

  const completedTracksCount = A2_KARAOKE_IDS.filter((id) =>
    a2Progress.activityMasteredIds.includes(id)
  ).length;
  const isTrackMastered = a2Progress.activityMasteredIds.includes(activeTrack.id);
  const isPlayingOrStarting = activeLineIndex !== null || startingLineIndex !== null;

  const activeFeedback = feedbackMap[activeTrack.id];
  const activeFeedbackText = activeFeedback
    ? activeFeedback.xp > 0
      ? tx(
          {
            tr: 'A2 parçası tamamlandı olarak kaydedildi · +{{xp}} A2 XP kazanıldı (puanlı doğruluk oranını şişirmez).',
            en: 'A2 track marked complete · +{{xp}} A2 XP earned (does not inflate scored accuracy).',
          },
          { xp: activeFeedback.xp }
        )
      : tx({
          tr: 'Tekrar pratiğiniz kaydedildi (bu A2 parçası daha önce tamamlandığı için ek XP eklenmedi).',
          en: 'Repeat practice logged (no extra XP — this A2 track was already completed).',
        })
    : null;

  const audioErrorText =
    audioErrorReason === 'unsupported'
      ? tx({
          tr: 'Bu tarayıcı Web Speech API (de-DE) seslendirmesini desteklemiyor. Satırları ritim vurgularıyla kendiniz sesli okuyarak pratik yapabilirsiniz.',
          en: 'This browser does not support Web Speech API (de-DE). You can still practice aloud following the rhythm cues.',
        })
      : audioErrorReason === 'timeout'
      ? tx({
          tr: 'Tarayıcı ses motoru zaman aşımına uğradı (onstart doğrulanamadı). Tekrar deneyebilir veya metni ritim işaretleriyle yüksek sesle okuyabilirsiniz.',
          en: 'Browser speech engine timed out (onstart could not be confirmed). Try again or read the lines aloud with the rhythm cues.',
        })
      : audioErrorReason === 'error'
      ? tx({
          tr: 'Seslendirme başlatılamadı. Tarayıcı ses ayarlarını kontrol edebilir veya satırları kendiniz sesli okuyabilirsiniz.',
          en: 'Speech playback could not start. Check your browser audio settings or practice reading the lines aloud.',
        })
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="karaoke" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>{locale.navGroups.activities}</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {tx({ tr: 'Almanca A2 · Karaoke Stüdyosu', en: 'German A2 · Karaoke Studio' })}
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{locale.common.classroomDisplayReady}</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'A2 Karaoke Stüdyosu — Ritmik Yan Cümle & Perfekt Akışı',
              en: 'A2 Karaoke Studio — Rhythmic Subordinate Clauses & Perfekt Flow',
            })}
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Toplam A2 XP', en: 'Total A2 XP' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({ tr: 'Tamamlanan Parça', en: 'Tracks Completed' })}
            </p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedTracksCount} / {GERMAN_A2_KARAOKE_TRACKS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Track Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GERMAN_A2_KARAOKE_TRACKS.map((track, idx) => {
          const isSelected = track.id === activeTrack.id;
          const mastered = a2Progress.activityMasteredIds.includes(track.id);
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              aria-pressed={isSelected}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? 'border-[#7C1D2E] bg-[#FFFFFF] ring-1 ring-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#16161A] dark:ring-[#D9A13B]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#9A6B16] dark:text-[#D9A13B]">
                  {tx({ tr: 'A2 Parça 0{{num}}', en: 'A2 Track 0{{num}}' }, { num: idx + 1 })}
                </span>
                {mastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{locale.common.completed}</span>
                  </span>
                ) : (
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">+15 A2 XP</span>
                )}
              </div>
              <h2 className="mt-2 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {track.titleDe}
              </h2>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {track.titleTr} · {track.themeTr}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Karaoke Stage */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-4 border-b border-[#ECECE8] pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-[#24242C]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                {activeTrack.tempoLabelTr}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {tx(
                  { tr: '{{count}} ritmik A2 satırı', en: '{{count}} rhythmic A2 lines' },
                  { count: activeTrack.lines.length }
                )}
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {activeTrack.titleDe}{' '}
              <span className="text-base font-normal text-[#52525B] dark:text-[#A1A1AA]">
                — {activeTrack.titleTr}
              </span>
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx(
                {
                  tr: 'Tema: {{theme}} · 0.8× veya 1.0× hızda sesli tekrarlayın.',
                  en: 'Theme: {{theme}} · Repeat aloud at 0.8× or 1.0× speed.',
                },
                { theme: activeTrack.themeTr }
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled={!speechSupported}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              {startingLineIndex !== null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{locale.audio.starting}</span>
                </>
              ) : isPlayingOrStarting ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>{locale.audio.stop}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{tx({ tr: 'Parçayı Sırayla Dinle', en: 'Play All Lines' })}</span>
                </>
              )}
            </button>

            <div
              role="group"
              aria-label={tx({ tr: 'A2 Karaoke oynatma hızı', en: 'A2 Karaoke playback speed' })}
              className="inline-flex rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]"
            >
              <button
                type="button"
                aria-pressed={rateMode === 'slow'}
                onClick={() => {
                  stopPlayback();
                  setRateMode('slow');
                }}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                  rateMode === 'slow'
                    ? 'bg-[#0D0D0D] text-white dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                {tx({ tr: '0.8× Yavaş', en: '0.8× Slow' })}
              </button>
              <button
                type="button"
                aria-pressed={rateMode === 'normal'}
                onClick={() => {
                  stopPlayback();
                  setRateMode('normal');
                }}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                  rateMode === 'normal'
                    ? 'bg-[#0D0D0D] text-white dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                1.0× Normal
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTranslations((v) => !v)}
              aria-pressed={showTranslations}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {showTranslations ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>{locale.common.hideTurkish}</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{locale.common.showTurkish}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {!speechSupported && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#9A6B16]/40 bg-[#FEF9EB] p-3.5 text-xs text-[#111113] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#F4F4F5]">
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
            <span>
              {tx({
                tr: 'Bu tarayıcıda Web Speech API (de-DE) seslendirmesi desteklenmiyor. Satırları ritim işaretleriyle yüksek sesle okuyarak A2 çalışmasını tamamlayabilirsiniz.',
                en: 'Web Speech API (de-DE) is not supported in this browser. You can still complete A2 practice by reading the lines aloud with the rhythm cues.',
              })}
            </span>
          </div>
        )}

        {audioErrorText && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#9A6B16]/40 bg-[#FEF9EB] p-3.5 text-xs text-[#111113] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#F4F4F5]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
            <span>{audioErrorText}</span>
          </div>
        )}

        {/* Synchronized Lyrics Lines */}
        <ol className="space-y-2.5">
          {activeTrack.lines.map((line, idx) => {
            const isActiveLine = activeLineIndex === idx;
            const isStartingLine = startingLineIndex === idx;
            return (
              <li
                key={line.id}
                className={`rounded-xl border p-4 transition-colors ${
                  isActiveLine
                    ? 'border-[#7C1D2E] bg-[#FDF2F4]/70 dark:border-[#D9A13B] dark:bg-[#231D11]/70'
                    : 'border-[#ECECE8] bg-[#F6F6F4]/60 dark:border-[#24242C] dark:bg-[#111113]'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B] tabular-nums">
                        0{idx + 1}
                      </span>
                      <span className="font-mono text-[11px]">{line.rhythmCueDe}</span>
                      {isActiveLine && (
                        <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          ·{' '}
                          {isSequenceMode
                            ? tx({ tr: 'Oynatılıyor (Sıralı)', en: 'Playing (Sequence)' })
                            : locale.audio.playing}
                        </span>
                      )}
                    </div>
                    <p className="text-base sm:text-lg font-medium leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {line.textDe}
                    </p>
                    {showTranslations && (
                      <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                        {line.textTr}
                      </p>
                    )}
                    <p className="text-xs text-[#71717A] dark:text-[#8E8E98]">
                      {tx({ tr: 'Odak kalıplar:', en: 'Focus phrases:' })}{' '}
                      <span className="font-mono text-[#111113] dark:text-[#E4E4E7]">
                        {line.focusWords.join(' · ')}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={() => handlePlaySingleLine(idx)}
                    aria-label={tx(
                      { tr: '{{num}}. satırı dinle', en: 'Listen to line {{num}}' },
                      { num: idx + 1 }
                    )}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 ${
                      isActiveLine || isStartingLine
                        ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                    }`}
                  >
                    {isStartingLine ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>{locale.audio.starting}</span>
                      </>
                    ) : isActiveLine ? (
                      <>
                        <Square className="h-3 w-3 fill-current" />
                        <span>{locale.audio.stop}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{tx({ tr: 'Satırı Dinle', en: 'Listen Line' })}</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Honest Self-Completion Bar (Does Not Inflate Scored A2 Accuracy) */}
        <div className="flex flex-col gap-3 border-t border-[#ECECE8] pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C]">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-[#111113] dark:text-[#F4F4F5]">
              {isTrackMastered
                ? tx({
                    tr: 'Bu A2 parçası daha önce tamamlandı (tekrarlar ek XP veya puanlı doğruluk eklemez).',
                    en: 'This A2 track was already completed (repeats add no extra XP or scored accuracy).',
                  })
                : tx({
                    tr: 'Tüm satırları yüksek sesle tekrarladıysanız parçayı tamamlandı olarak kaydedin (+15 A2 XP · doğruluk oranını şişirmez).',
                    en: 'Once you have repeated all lines aloud, mark the track complete (+15 A2 XP · does not inflate scored accuracy).',
                  })}
            </p>
            {activeFeedbackText && (
              <p
                role="status"
                className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]"
              >
                {activeFeedbackText}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleMarkTrackComplete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-semibold text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isTrackMastered
                ? tx({ tr: 'Tekrar Pratiğini Kaydet', en: 'Log Repeat Practice' })
                : tx({ tr: 'Parçayı Tamamladım (+15 A2 XP)', en: 'Mark Track Complete (+15 A2 XP)' })}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
