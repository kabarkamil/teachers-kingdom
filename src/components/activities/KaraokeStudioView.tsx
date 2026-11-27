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
import { GERMAN_A1_KARAOKE_TRACKS, KARAOKE_IDS } from '../../data/germanA1Activities';
import type { KaraokeTrack, NavRouteId } from '../../types';
import {
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type SpeechFailureReason,
} from '../../utils/speech';
import { ActivitySubNav } from './ActivitySubNav';

interface KaraokeStudioViewProps {
  onNavigate: (route: NavRouteId) => void;
}

export const KaraokeStudioView: React.FC<KaraokeStudioViewProps> = ({ onNavigate }) => {
  const { progress, rolePreview, speechSpeed, uiLanguage, recordKaraokeCompletion } = useAppState();
  const isEn = uiLanguage === 'en';
  const [selectedTrackId, setSelectedTrackId] = useState<string>(GERMAN_A1_KARAOKE_TRACKS[0].id);
  const [rateMode, setRateMode] = useState<'slow' | 'normal'>(speechSpeed);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    setRateMode(speechSpeed);
  }, [speechSpeed]);

  // Playback state strictly confirmed via speech.ts onStart / onEnd
  const [startingLineIndex, setStartingLineIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSequenceMode, setIsSequenceMode] = useState(false);
  const [audioErrorReason, setAudioErrorReason] = useState<SpeechFailureReason | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  const playbackTokenRef = useRef(0);
  const speechSupported = isSpeechSynthesisSupported();

  const activeTrack: KaraokeTrack =
    GERMAN_A1_KARAOKE_TRACKS.find((t) => t.id === selectedTrackId) ?? GERMAN_A1_KARAOKE_TRACKS[0];

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
    const xp = recordKaraokeCompletion(activeTrack.id, activeTrack.titleDe);
    setFeedbackMap((prev) => ({
      ...prev,
      [activeTrack.id]:
        xp > 0
          ? `Parça tamamlandı olarak kaydedildi · +${xp} XP kazanıldı.`
          : 'Tekrar pratiğiniz kaydedildi (bu parça daha önce tamamlandığı için ek XP eklenmedi).',
    }));
  };

  const completedTracksCount = KARAOKE_IDS.filter((id) =>
    progress.activityMasteredIds.includes(id)
  ).length;
  const isTrackMastered = progress.activityMasteredIds.includes(activeTrack.id);
  const isPlayingOrStarting = activeLineIndex !== null || startingLineIndex !== null;

  const audioErrorText =
    audioErrorReason === 'unsupported'
      ? 'Bu tarayıcı Web Speech API (de-DE) seslendirmesini desteklemiyor. Satırları ritim vurgularıyla kendiniz sesli okuyarak pratik yapabilirsiniz.'
      : audioErrorReason === 'timeout'
      ? 'Tarayıcı ses motoru zaman aşımına uğradı. Tekrar deneyebilir veya metni ritim işaretleriyle yüksek sesle okuyabilirsiniz.'
      : audioErrorReason === 'error'
      ? 'Seslendirme başlatılamadı. Tarayıcı ses ayarlarını kontrol edebilir veya satırları kendiniz sesli okuyabilirsiniz.'
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="karaoke" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A1 · Karaoke Stüdyosu
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Sınıf Ekranı Uyumlu</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            Karaoke Stüdyosu — Ritmik A1 Satır Takibi
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam XP</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#D9A13B] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tamamlanan Parça</p>
            <p className="font-mono text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              {completedTracksCount} / {GERMAN_A1_KARAOKE_TRACKS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Track Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GERMAN_A1_KARAOKE_TRACKS.map((track, idx) => {
          const isSelected = track.id === activeTrack.id;
          const mastered = progress.activityMasteredIds.includes(track.id);
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
                  Parça 0{idx + 1}
                </span>
                {mastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Tamamlandı</span>
                  </span>
                ) : (
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">+15 XP</span>
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
        {/* Controls Bar */}
        <div className="flex flex-col gap-4 border-b border-[#ECECE8] pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {activeTrack.themeTr} · {activeTrack.tempoLabelTr}
            </p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {activeTrack.titleDe}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled={!speechSupported && audioErrorReason === 'unsupported'}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                isPlayingOrStarting && isSequenceMode
                  ? 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#B8324B]'
                  : 'bg-[#111113] text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]'
              }`}
            >
              {startingLineIndex !== null && isSequenceMode ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlayingOrStarting && isSequenceMode ? (
                <Square className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
              <span>
                {isPlayingOrStarting && isSequenceMode ? 'Oynatmayı Durdur' : 'Tüm Satırları Çal'}
              </span>
            </button>

            <div
              role="group"
              aria-label="Karaoke hızı"
              className="inline-flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]"
            >
              <button
                type="button"
                onClick={() => {
                  stopPlayback();
                  setRateMode('slow');
                }}
                aria-pressed={rateMode === 'slow'}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                  rateMode === 'slow'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                0.8×
              </button>
              <button
                type="button"
                onClick={() => {
                  stopPlayback();
                  setRateMode('normal');
                }}
                aria-pressed={rateMode === 'normal'}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                  rateMode === 'normal'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                1.0×
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTranslations((prev) => !prev)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {showTranslations ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showTranslations ? 'Türkçeyi Gizle' : 'Türkçe Çeviriyi Göster'}</span>
            </button>
          </div>
        </div>

        {!speechSupported && !audioErrorText && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#D4AF37]/50 bg-[#FEF9EB] p-3.5 text-xs text-[#78350F] dark:border-[#D4AF37]/40 dark:bg-[#231D10] dark:text-[#F6D693]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {isEn
                ? 'This browser does not support Web Speech API (de-DE). You can still practice aloud following the rhythm cues.'
                : 'Bu tarayıcıda Web Speech API (de-DE) seslendirmesi desteklenmiyor. Satırları ritim işaretleriyle yüksek sesle okuyarak A1 çalışmasını tamamlayabilirsiniz.'}
            </span>
          </div>
        )}

        {audioErrorText && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#D4AF37]/50 bg-[#FEF9EB] p-3.5 text-xs text-[#78350F] dark:border-[#D4AF37]/40 dark:bg-[#231D10] dark:text-[#F6D693]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{audioErrorText}</span>
          </div>
        )}

        {/* Line-by-Line Lyrics Stage */}
        <ol className="space-y-3">
          {activeTrack.lines.map((line, idx) => {
            const isActive = activeLineIndex === idx;
            const isStarting = startingLineIndex === idx;

            return (
              <li
                key={line.id}
                className={`rounded-xl border p-4 transition-colors ${
                  isActive
                    ? 'border-[#7C1D2E] bg-[#FDF2F4]/60 dark:border-[#D9A13B] dark:bg-[#1F1B12]'
                    : 'border-[#ECECE8] bg-[#F6F6F4]/70 dark:border-[#24242C] dark:bg-[#111113]'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                        0{line.lineNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{line.rhythmCueDe}</span>
                      {isActive && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                            Şimdi okunuyor
                          </span>
                        </>
                      )}
                    </div>

                    <p className="font-display text-base sm:text-lg font-medium leading-snug text-[#111113] dark:text-[#F4F4F5]">
                      {line.textDe}
                    </p>

                    {showTranslations && (
                      <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                        {line.textTr}
                      </p>
                    )}

                    <p className="text-[11px] text-[#52525B] dark:text-[#8E8E98]">
                      Odak kelimeler: {line.focusWords.join(' · ')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlaySingleLine(idx)}
                    aria-label={`Satır ${line.lineNumber} seslendir`}
                    className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-colors shrink-0 ${
                      isActive
                        ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                        : 'border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                    }`}
                  >
                    {isStarting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isActive ? (
                      <Square className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                    )}
                    <span>{isActive ? 'Durdur' : 'Satırı Dinle'}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Completion Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            Satırları tekrar ettikten sonra pratiği kaydedin (tek seferlik +15 XP).
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {feedbackMap[activeTrack.id] && (
              <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                {feedbackMap[activeTrack.id]}
              </span>
            )}
            <button
              type="button"
              onClick={handleMarkTrackComplete}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isTrackMastered
                  ? 'Tekrar Pratiği Kaydet (0 XP)'
                  : 'Parçayı Tamamlandı Olarak Kaydet (+15 XP)'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
