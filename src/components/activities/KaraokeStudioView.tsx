import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  XCircle,
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

function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const KaraokeStudioView: React.FC<KaraokeStudioViewProps> = ({ onNavigate }) => {
  const { progress, rolePreview, speechSpeed, uiLanguage, recordKaraokeCompletion } = useAppState();
  const isEn = uiLanguage === 'en';
  const [selectedTrackId, setSelectedTrackId] = useState<string>(GERMAN_A1_KARAOKE_TRACKS[0].id);
  const [rateMode, setRateMode] = useState<'slow' | 'normal'>(speechSpeed);
  const [showTranslations, setShowTranslations] = useState(false);

  // Studio MP3 audio playback state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioLoadError, setAudioLoadError] = useState<string | null>(null);

  // Web Speech API playback state strictly confirmed via speech.ts onStart / onEnd
  const [startingLineIndex, setStartingLineIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSequenceMode, setIsSequenceMode] = useState(false);
  const [audioErrorReason, setAudioErrorReason] = useState<SpeechFailureReason | null>(null);

  // Per-track completion feedback & inline A1 mini-quiz state
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [quizSelections, setQuizSelections] = useState<Record<string, number>>({});

  const playbackTokenRef = useRef(0);
  const speechSupported = isSpeechSynthesisSupported();

  const activeTrack: KaraokeTrack =
    GERMAN_A1_KARAOKE_TRACKS.find((t) => t.id === selectedTrackId) ?? GERMAN_A1_KARAOKE_TRACKS[0];
  const hasStudioAudio = Boolean(activeTrack.audioUrl);

  useEffect(() => {
    setRateMode(speechSpeed);
  }, [speechSpeed]);

  // Keep HTML5 audio playback rate synced smoothly without restarting playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rateMode === 'slow' ? 0.8 : 1.0;
    }
  }, [rateMode, selectedTrackId]);

  const stopSpeechPlayback = () => {
    playbackTokenRef.current += 1;
    stopGermanSpeech();
    setStartingLineIndex(null);
    setActiveLineIndex(null);
    setIsSequenceMode(false);
  };

  const stopStudioAudio = (resetTime = false) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      if (resetTime) {
        audio.currentTime = 0;
      }
    }
    setAudioIsPlaying(false);
    if (resetTime) {
      setAudioCurrentTime(0);
    }
  };

  const stopAllPlayback = (resetAudio = false) => {
    stopSpeechPlayback();
    stopStudioAudio(resetAudio);
  };

  // Stop any playing audio when switching tracks or unmounting
  useEffect(() => {
    stopAllPlayback(true);
    setAudioDuration(0);
    setAudioLoadError(null);
    setAudioErrorReason(null);

    return () => {
      playbackTokenRef.current += 1;
      stopGermanSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedTrackId]);

  // Real-time synced lyric index for MP3 studio tracks
  const syncedAudioLineIndex = useMemo(() => {
    if (!hasStudioAudio) return null;
    if (!audioIsPlaying && audioCurrentTime === 0) return null;
    const foundIndex = activeTrack.lines.findIndex(
      (line) =>
        typeof line.startSec === 'number' &&
        typeof line.endSec === 'number' &&
        audioCurrentTime >= line.startSec &&
        audioCurrentTime < line.endSec
    );
    return foundIndex >= 0 ? foundIndex : null;
  }, [activeTrack.lines, audioCurrentTime, audioIsPlaying, hasStudioAudio]);

  const studioPhaseLabel = useMemo(() => {
    if (!hasStudioAudio) return null;
    const firstStart = activeTrack.lines[0]?.startSec;
    const lastEnd = activeTrack.lines[activeTrack.lines.length - 1]?.endSec;

    if (syncedAudioLineIndex !== null) {
      const line = activeTrack.lines[syncedAudioLineIndex];
      const sec = isEn
        ? line.sectionLabelEn ?? line.sectionLabelTr
        : line.sectionLabelTr;
      return sec
        ? `${sec} · ${isEn ? 'Line' : 'Satır'} 0${line.lineNumber}`
        : `${isEn ? 'Line' : 'Satır'} 0${line.lineNumber}`;
    }

    if (typeof firstStart === 'number' && audioCurrentTime > 0 && audioCurrentTime < firstStart) {
      return isEn ? 'Piano intro · Get ready to sing...' : 'Piyano girişi · Eşlik etmeye hazırlanın...';
    }

    if (typeof lastEnd === 'number' && audioCurrentTime >= lastEnd) {
      return isEn ? 'Outro · Well done!' : 'Kapanış · Harika eşlik ettiniz!';
    }

    return isEn ? 'Ready to play · Studio MP3' : 'Oynatmaya hazır · Stüdyo MP3';
  }, [activeTrack.lines, audioCurrentTime, hasStudioAudio, isEn, syncedAudioLineIndex]);

  const safePlayStudioAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    stopSpeechPlayback();
    setAudioLoadError(null);
    audio.playbackRate = rateMode === 'slow' ? 0.8 : 1.0;

    try {
      await audio.play();
    } catch {
      setAudioIsPlaying(false);
      setAudioLoadError(
        isEn
          ? 'Browser audio playback was blocked or interrupted. Check your sound settings and click Play again, or use the per-line speech button.'
          : 'Tarayıcı ses oynatımı engellendi veya kesintiye uğradı. Ses izinlerini kontrol edip tekrar Oynat butonuna basabilir ya da satır bazlı seslendirmeyi kullanabilirsiniz.'
      );
    }
  };

  const handleToggleStudioPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioIsPlaying) {
      audio.pause();
      return;
    }

    if (audioDuration > 0 && audio.currentTime >= audioDuration - 0.25) {
      audio.currentTime = 0;
      setAudioCurrentTime(0);
    }
    void safePlayStudioAudio();
  };

  const handleRestartStudioAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setAudioCurrentTime(0);
    void safePlayStudioAudio();
  };

  const handleSeekStudioAudio = (targetSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clamped = Math.max(0, Math.min(targetSeconds, audioDuration || targetSeconds));
    audio.currentTime = clamped;
    setAudioCurrentTime(clamped);
  };

  const handleJumpToStudioLine = (index: number) => {
    const line = activeTrack.lines[index];
    if (!line) return;

    // Fallback to TTS if the MP3 file could not be loaded
    if (!audioRef.current || audioLoadError) {
      handlePlaySingleLineTts(index);
      return;
    }

    if (syncedAudioLineIndex === index && audioIsPlaying) {
      audioRef.current.pause();
      return;
    }

    const start = typeof line.startSec === 'number' ? line.startSec : 0;
    audioRef.current.currentTime = start;
    setAudioCurrentTime(start);
    void safePlayStudioAudio();
  };

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

  const handlePlayAllTts = () => {
    if (activeLineIndex !== null || startingLineIndex !== null) {
      stopSpeechPlayback();
      return;
    }
    playbackTokenRef.current += 1;
    const token = playbackTokenRef.current;
    playLineAt(0, true, token);
  };

  const handlePlaySingleLineTts = (index: number) => {
    if (hasStudioAudio) {
      stopStudioAudio(false);
    }
    if (activeLineIndex === index || startingLineIndex === index) {
      stopSpeechPlayback();
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
          ? isEn
            ? `Track marked complete · +${xp} XP earned.`
            : `Parça tamamlandı olarak kaydedildi · +${xp} XP kazanıldı.`
          : isEn
          ? 'Repeat practice logged (no extra XP — single-grant reward already claimed).'
          : 'Tekrar pratiğiniz kaydedildi (bu parça daha önce tamamlandığı için ek XP eklenmedi).',
    }));
  };

  const miniQuizItems = activeTrack.miniQuiz ?? [];
  const miniQuizAnsweredCount = miniQuizItems.filter(
    (item) => quizSelections[item.id] !== undefined
  ).length;
  const miniQuizCorrectCount = miniQuizItems.filter(
    (item) => quizSelections[item.id] === item.correctIndex
  ).length;

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    setQuizSelections((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleResetMiniQuiz = () => {
    setQuizSelections((prev) => {
      const next = { ...prev };
      miniQuizItems.forEach((item) => {
        delete next[item.id];
      });
      return next;
    });
  };

  const completedTracksCount = KARAOKE_IDS.filter((id) =>
    progress.activityMasteredIds.includes(id)
  ).length;
  const isTrackMastered = progress.activityMasteredIds.includes(activeTrack.id);
  const isTtsPlayingOrStarting = activeLineIndex !== null || startingLineIndex !== null;

  const audioErrorText =
    audioErrorReason === 'unsupported'
      ? isEn
        ? 'This browser does not support Web Speech API (de-DE). You can still practice aloud following the rhythm cues.'
        : 'Bu tarayıcı Web Speech API (de-DE) seslendirmesini desteklemiyor. Satırları ritim vurgularıyla kendiniz sesli okuyarak pratik yapabilirsiniz.'
      : audioErrorReason === 'timeout'
      ? isEn
        ? 'Browser speech engine timed out. Please try again or read the lines aloud with the rhythm markers.'
        : 'Tarayıcı ses motoru zaman aşımına uğradı. Tekrar deneyebilir veya metni ritim işaretleriyle yüksek sesle okuyabilirsiniz.'
      : audioErrorReason === 'error'
      ? isEn
        ? 'Speech playback could not start. Check your browser audio settings or read the lines aloud.'
        : 'Seslendirme başlatılamadı. Tarayıcı ses ayarlarını kontrol edebilir veya satırları kendiniz sesli okuyabilirsiniz.'
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivitySubNav activeRoute="karaoke" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>{isEn ? 'Activities' : 'Etkinlikler'}</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7A1C24] dark:text-[#D4AF37]">
              {isEn ? 'German A1 · Karaoke Studio' : 'Almanca A1 · Karaoke Stüdyosu'}
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>{isEn ? 'Classroom Display Ready' : 'Sınıf Ekranı Uyumlu'}</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#0D0D0D] dark:text-[#FFFFFF]">
            {isEn
              ? 'Karaoke Studio — Synchronized A1 Songs & Rhythm'
              : 'Karaoke Stüdyosu — Senkronize A1 Şarkı & Ritim Takibi'}
          </h1>
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#9A6B16] dark:text-[#D4AF37]">
              Öğren. Öğret. Üret.
            </span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="font-medium text-[#7A1C24] dark:text-[#F4A5AE]">You can do it</span>
          </p>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {isEn ? 'Total XP' : 'Toplam XP'}
            </p>
            <p className="font-mono text-xl font-semibold text-[#0D0D0D] dark:text-[#D4AF37] tabular-nums">
              {progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {isEn ? 'Tracks Completed' : 'Tamamlanan Parça'}
            </p>
            <p className="font-mono text-xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF] tabular-nums">
              {completedTracksCount} / {GERMAN_A1_KARAOKE_TRACKS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Track Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GERMAN_A1_KARAOKE_TRACKS.map((track, idx) => {
          const isSelected = track.id === activeTrack.id;
          const mastered = progress.activityMasteredIds.includes(track.id);
          const isStudioTrack = Boolean(track.audioUrl);
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              aria-pressed={isSelected}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? 'border-[#7A1C24] bg-[#FFFFFF] ring-1 ring-[#7A1C24] dark:border-[#D4AF37] dark:bg-[#16161A] dark:ring-[#D4AF37]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#0D0D0D]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[#9A6B16] dark:text-[#D4AF37]">
                    {isEn ? `Track 0${idx + 1}` : `Parça 0${idx + 1}`}
                  </span>
                  {isStudioTrack && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#7A1C24] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]">
                      <Music2 className="h-2.5 w-2.5" />
                      MP3
                    </span>
                  )}
                </div>
                {mastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{isEn ? 'Done' : 'Tamamlandı'}</span>
                  </span>
                ) : (
                  <span className="font-mono text-[#52525B] dark:text-[#A1A1AA]">+15 XP</span>
                )}
              </div>
              <h2 className="mt-2 font-display text-base font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                {track.titleDe}
              </h2>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {isEn ? track.titleEn ?? track.titleTr : track.titleTr} ·{' '}
                {isEn ? track.themeEn ?? track.themeTr : track.themeTr}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Karaoke Stage */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
        {/* Hidden HTML5 Audio Element for Studio MP3 Tracks */}
        {hasStudioAudio && (
          <audio
            ref={audioRef}
            src={activeTrack.audioUrl}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const el = e.currentTarget;
              setAudioDuration(el.duration || 0);
              el.playbackRate = rateMode === 'slow' ? 0.8 : 1.0;
              setAudioLoadError(null);
            }}
            onTimeUpdate={(e) => {
              setAudioCurrentTime(e.currentTarget.currentTime);
            }}
            onPlay={() => {
              setAudioIsPlaying(true);
              setAudioLoadError(null);
            }}
            onPause={() => {
              setAudioIsPlaying(false);
            }}
            onEnded={() => {
              setAudioIsPlaying(false);
            }}
            onError={() => {
              setAudioIsPlaying(false);
              setAudioLoadError(
                isEn
                  ? 'The MP3 track could not be loaded right now. You can still listen line-by-line via speech synthesis or follow the rhythm cues.'
                  : 'MP3 ses dosyası şu anda yüklenemedi. Satır yanındaki seslendirme butonunu veya ritim vurgularını kullanarak çalışmaya devam edebilirsiniz.'
              );
            }}
          />
        )}

        {/* Controls Bar */}
        <div className="flex flex-col gap-4 border-b border-[#ECECE8] pb-5 lg:flex-row lg:items-center lg:justify-between dark:border-[#24242C]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <span className="rounded bg-[#0D0D0D] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]">
                {activeTrack.cefrLevel ?? 'A1'}
              </span>
              <span>
                {isEn ? activeTrack.themeEn ?? activeTrack.themeTr : activeTrack.themeTr}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isEn ? activeTrack.tempoLabelEn ?? activeTrack.tempoLabelTr : activeTrack.tempoLabelTr}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {activeTrack.titleDe}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {hasStudioAudio ? (
              <>
                <button
                  type="button"
                  onClick={handleToggleStudioPlay}
                  className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    audioIsPlaying
                      ? 'bg-[#7A1C24] text-[#FFFFFF] hover:bg-[#641624] dark:bg-[#B8324B]'
                      : 'bg-[#0D0D0D] text-[#FFFFFF] hover:bg-[#27272A] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E6B452]'
                  }`}
                >
                  {audioIsPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                  <span>
                    {audioIsPlaying
                      ? isEn
                        ? 'Pause Song'
                        : 'Duraklat'
                      : isEn
                      ? 'Play Song'
                      : 'Şarkıyı Oynat'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleRestartStudioAudio}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24] whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Restart' : 'Baştan Al'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handlePlayAllTts}
                disabled={!speechSupported && audioErrorReason === 'unsupported'}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isTtsPlayingOrStarting && isSequenceMode
                    ? 'bg-[#7A1C24] text-[#FFFFFF] hover:bg-[#641624] dark:bg-[#B8324B]'
                    : 'bg-[#0D0D0D] text-[#FFFFFF] hover:bg-[#27272A] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E6B452]'
                }`}
              >
                {startingLineIndex !== null && isSequenceMode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isTtsPlayingOrStarting && isSequenceMode ? (
                  <Square className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                <span>
                  {isTtsPlayingOrStarting && isSequenceMode
                    ? isEn
                      ? 'Stop Playback'
                      : 'Oynatmayı Durdur'
                    : isEn
                    ? 'Play All Lines'
                    : 'Tüm Satırları Çal'}
                </span>
              </button>
            )}

            {/* Speed Toggle */}
            <div
              role="group"
              aria-label={isEn ? 'Playback speed' : 'Karaoke hızı'}
              className="inline-flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]"
            >
              <button
                type="button"
                onClick={() => {
                  if (!hasStudioAudio) stopSpeechPlayback();
                  setRateMode('slow');
                }}
                aria-pressed={rateMode === 'slow'}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                  rateMode === 'slow'
                    ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                0.8×
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!hasStudioAudio) stopSpeechPlayback();
                  setRateMode('normal');
                }}
                aria-pressed={rateMode === 'normal'}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                  rateMode === 'normal'
                    ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                1.0×
              </button>
            </div>

            {/* Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowTranslations((prev) => !prev)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {showTranslations ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>
                {showTranslations
                  ? isEn
                    ? 'Hide Turkish'
                    : 'Türkçeyi Gizle'
                  : isEn
                  ? 'Show Turkish'
                  : 'Türkçe Çeviriyi Göster'}
              </span>
            </button>
          </div>
        </div>

        {/* Synchronized Studio Audio Timeline Bar */}
        {hasStudioAudio && (
          <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 space-y-2.5 dark:border-[#282830] dark:bg-[#0D0D0D]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-medium text-[#0D0D0D] dark:text-[#FFFFFF]">
                <Headphones className="h-4 w-4 text-[#7A1C24] dark:text-[#D4AF37]" />
                <span>{studioPhaseLabel}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-[#52525B] dark:text-[#D4AF37] tabular-nums">
                {formatAudioTime(audioCurrentTime)} / {formatAudioTime(audioDuration || 69)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={audioDuration > 0 ? audioDuration : 69}
              step={0.1}
              value={Math.min(audioCurrentTime, audioDuration > 0 ? audioDuration : 69)}
              onChange={(e) => handleSeekStudioAudio(Number(e.target.value))}
              aria-label={isEn ? 'Song playback timeline' : 'Şarkı zaman çizelgesi'}
              className="w-full cursor-pointer accent-[#7A1C24] dark:accent-[#D4AF37]"
            />
            <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
              {isEn
                ? 'Tip: Click any lyric line below to jump directly to that moment in the song, or use the speaker icon for isolated pronunciation.'
                : 'İpucu: Şarkıda o ana atlamak için herhangi bir satırın oynat butonuna tıklayın veya yavaş telaffuz için hoparlör ikonunu kullanın.'}
            </p>
          </div>
        )}

        {/* Audio Error / Restriction Alerts */}
        {audioLoadError && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#D4AF37]/50 bg-[#FEF9EB] p-3.5 text-xs text-[#78350F] dark:border-[#D4AF37]/40 dark:bg-[#231D10] dark:text-[#F6D693]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{audioLoadError}</span>
          </div>
        )}

        {!hasStudioAudio && !speechSupported && !audioErrorText && (
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

        {/* Line-by-Line Synchronized Lyrics Stage */}
        <ol className="space-y-3">
          {activeTrack.lines.map((line, idx) => {
            const isTtsActive = activeLineIndex === idx;
            const isStudioActive = hasStudioAudio && syncedAudioLineIndex === idx;
            const isActive = isStudioActive || isTtsActive;
            const isStarting = startingLineIndex === idx;

            const currentSection = isEn
              ? line.sectionLabelEn ?? line.sectionLabelTr
              : line.sectionLabelTr;
            const prevLine = idx > 0 ? activeTrack.lines[idx - 1] : null;
            const prevSection = prevLine
              ? isEn
                ? prevLine.sectionLabelEn ?? prevLine.sectionLabelTr
                : prevLine.sectionLabelTr
              : null;
            const showSectionHeader = Boolean(currentSection && currentSection !== prevSection);

            return (
              <React.Fragment key={line.id}>
                {showSectionHeader && (
                  <li className="pt-2 first:pt-0 list-none">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FEF9EB] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#9A6B16] dark:border-[#D4AF37]/30 dark:bg-[#201B11] dark:text-[#D4AF37]">
                      <Music2 className="h-3 w-3" />
                      <span>{currentSection}</span>
                    </div>
                  </li>
                )}
                <li
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-[#7A1C24] bg-[#FDF2F4]/80 shadow-sm dark:border-[#D4AF37] dark:bg-[#211C12]'
                      : 'border-[#ECECE8] bg-[#F6F6F4]/70 dark:border-[#24242C] dark:bg-[#111113]'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D4AF37]">
                          0{line.lineNumber}
                        </span>
                        {typeof line.startSec === 'number' && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[11px] tabular-nums">
                              {formatAudioTime(line.startSec)}
                            </span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{line.rhythmCueDe}</span>
                        {isActive && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#7A1C24] dark:text-[#D4AF37]">
                              {isStudioActive
                                ? isEn
                                  ? 'Now singing'
                                  : 'Şimdi söyleniyor'
                                : isEn
                                ? 'Reading aloud'
                                : 'Şimdi okunuyor'}
                            </span>
                          </>
                        )}
                      </div>

                      <p
                        className={`font-display text-base sm:text-lg font-medium leading-snug ${
                          isActive
                            ? 'text-[#7A1C24] dark:text-[#FFFFFF]'
                            : 'text-[#0D0D0D] dark:text-[#F4F4F5]'
                        }`}
                      >
                        {line.textDe}
                      </p>

                      {showTranslations && (
                        <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                          {line.textTr}
                        </p>
                      )}

                      <p className="text-[11px] text-[#52525B] dark:text-[#8E8E98]">
                        {isEn ? 'Focus words:' : 'Odak kelimeler:'} {line.focusWords.join(' · ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasStudioAudio ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleJumpToStudioLine(idx)}
                            aria-label={
                              isEn
                                ? `Play from line ${line.lineNumber}`
                                : `Satır ${line.lineNumber} başından çal`
                            }
                            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-colors ${
                              isStudioActive && audioIsPlaying
                                ? 'bg-[#7A1C24] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                                : 'border border-[#D9D9D3] bg-[#FFFFFF] text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24]'
                            }`}
                          >
                            {isStudioActive && audioIsPlaying ? (
                              <Pause className="h-3.5 w-3.5 fill-current" />
                            ) : (
                              <Play className="h-3.5 w-3.5 fill-current text-[#7A1C24] dark:text-[#D4AF37]" />
                            )}
                            <span>
                              {isStudioActive && audioIsPlaying
                                ? isEn
                                  ? 'Pause'
                                  : 'Duraklat'
                                : isEn
                                ? 'Play Here'
                                : 'Buradan Çal'}
                            </span>
                          </button>

                          {speechSupported && (
                            <button
                              type="button"
                              onClick={() => handlePlaySingleLineTts(idx)}
                              title={isEn ? 'Isolated German speech (TTS)' : 'Yavaş telaffuz (TTS)'}
                              aria-label={
                                isEn
                                  ? `Pronounce line ${line.lineNumber} slowly`
                                  : `Satır ${line.lineNumber} telaffuzunu dinle`
                              }
                              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                                isTtsActive
                                  ? 'border-[#7A1C24] bg-[#7A1C24] text-[#FFFFFF] dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                                  : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                              }`}
                            >
                              {isStarting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : isTtsActive ? (
                                <Square className="h-3.5 w-3.5 fill-current" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePlaySingleLineTts(idx)}
                          aria-label={
                            isEn
                              ? `Listen to line ${line.lineNumber}`
                              : `Satır ${line.lineNumber} seslendir`
                          }
                          className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-colors ${
                            isTtsActive
                              ? 'bg-[#7A1C24] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                              : 'border border-[#D9D9D3] bg-[#FFFFFF] text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24]'
                          }`}
                        >
                          {isStarting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : isTtsActive ? (
                            <Square className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <Volume2 className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
                          )}
                          <span>
                            {isTtsActive
                              ? isEn
                                ? 'Stop'
                                : 'Durdur'
                              : isEn
                              ? 'Listen Line'
                              : 'Satırı Dinle'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ol>

        {/* Inline A1 Vocabulary & Comprehension Mini Check (e.g., Ein kleiner Schritt) */}
        {miniQuizItems.length > 0 && (
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FBF9F2] p-5 space-y-5 dark:border-[#D4AF37]/30 dark:bg-[#141311]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8E2CE] pb-4 dark:border-[#2A261C]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#7A1C24] dark:text-[#D4AF37]">
                  <BookOpenCheck className="h-4 w-4" />
                  <span>
                    {isEn
                      ? 'A1 Song Vocabulary & Comprehension Check'
                      : 'A1 Şarkı Kelime & Anlama Kontrolü'}
                  </span>
                </div>
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  {isEn
                    ? 'Reinforce key words from the song: aufmachen, die Sonne, das Fenster, das Wort.'
                    : 'Şarkıdaki temel A1 kelimelerini pekiştirin: aufmachen, die Sonne, das Fenster, das Wort.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg border border-[#D4AF37]/40 bg-[#FFFFFF] px-3 py-1.5 font-mono text-xs font-semibold text-[#0D0D0D] dark:bg-[#0D0D0D] dark:text-[#D4AF37] tabular-nums">
                  {miniQuizCorrectCount} / {miniQuizItems.length}{' '}
                  {isEn ? 'Correct' : 'Doğru'}
                </span>
                {miniQuizAnsweredCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetMiniQuiz}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#0D0D0D] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{isEn ? 'Reset' : 'Sıfırla'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {miniQuizItems.map((item, qIdx) => {
                const selectedIdx = quizSelections[item.id];
                const isAnswered = selectedIdx !== undefined;
                const isCorrect = selectedIdx === item.correctIndex;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-4 space-y-3 dark:border-[#282830] dark:bg-[#16161A]"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
                        <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D4AF37]">
                          0{qIdx + 1}.
                        </span>{' '}
                        {isEn ? item.questionEn : item.questionTr}
                      </p>
                      <p className="font-display text-sm sm:text-base font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                        {item.promptDe}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.options.map((opt, optIdx) => {
                        const isPicked = selectedIdx === optIdx;
                        const isRightOption = optIdx === item.correctIndex;

                        let btnClasses =
                          'border-[#D9D9D3] bg-[#F6F6F4] text-[#0D0D0D] hover:border-[#0D0D0D] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:border-[#D4AF37]';

                        if (isAnswered) {
                          if (isRightOption) {
                            btnClasses =
                              'border-[#15803D] bg-[#ECFDF5] text-[#14532D] dark:border-[#4ADE80] dark:bg-[#102618] dark:text-[#86EFAC]';
                          } else if (isPicked) {
                            btnClasses =
                              'border-[#7A1C24] bg-[#FDF2F4] text-[#7A1C24] dark:border-[#F87171] dark:bg-[#2A1216] dark:text-[#FCA5A5]';
                          } else {
                            btnClasses =
                              'border-[#ECECE8] bg-[#F6F6F4]/60 text-[#71717A] dark:border-[#24242C] dark:bg-[#111113]/60 dark:text-[#71717A]';
                          }
                        }

                        return (
                          <button
                            key={`${item.id}-${optIdx}`}
                            type="button"
                            onClick={() => handleSelectQuizOption(item.id, optIdx)}
                            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${btnClasses}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isRightOption && (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            )}
                            {isAnswered && isPicked && !isRightOption && (
                              <XCircle className="h-3.5 w-3.5 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <p
                        className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-[#ECFDF5] text-[#14532D] dark:bg-[#102618] dark:text-[#86EFAC]'
                            : 'bg-[#FDF2F4] text-[#7A1C24] dark:bg-[#2A1216] dark:text-[#FCA5A5]'
                        }`}
                      >
                        {isEn ? item.explanationEn : item.explanationTr}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {miniQuizCorrectCount === miniQuizItems.length && (
              <div className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/50 bg-[#FFFFFF] px-4 py-2.5 text-xs font-medium text-[#0D0D0D] dark:bg-[#0D0D0D] dark:text-[#D4AF37]">
                <Sparkles className="h-4 w-4 shrink-0 text-[#7A1C24] dark:text-[#D4AF37]" />
                <span>
                  {isEn
                    ? 'You can do it! All A1 vocabulary checks are correct — claim your single-grant +15 XP below.'
                    : 'You can do it! Tüm A1 kelime kontrollerini doğru yanıtladınız — aşağıdan tek seferlik +15 XP ödülünüzü kaydedebilirsiniz.'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Completion Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {isEn
              ? 'Save your practice after singing along and completing the check (single-grant +15 XP).'
              : 'Şarkıya eşlik edip alıştırmayı tamamladıktan sonra pratiği kaydedin (tek seferlik +15 XP).'}
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
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7A1C24] px-4 text-xs sm:text-sm font-medium text-[#FFFFFF] transition-colors hover:bg-[#641624] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isTrackMastered
                  ? isEn
                    ? 'Log Repeat Practice (0 XP)'
                    : 'Tekrar Pratiği Kaydet (0 XP)'
                  : isEn
                  ? 'Mark Track Complete (+15 XP)'
                  : 'Parçayı Tamamlandı Olarak Kaydet (+15 XP)'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
