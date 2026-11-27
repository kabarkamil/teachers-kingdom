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
  const { a2Progress, rolePreview, recordA2KaraokeCompletion } = useAppState();
  const [selectedTrackId, setSelectedTrackId] = useState<string>(GERMAN_A2_KARAOKE_TRACKS[0].id);
  const [rateMode, setRateMode] = useState<'slow' | 'normal'>('normal');
  const [showTranslations, setShowTranslations] = useState(false);

  // Playback state strictly confirmed via src/utils/speech.ts onStart / onEnd
  const [startingLineIndex, setStartingLineIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isSequenceMode, setIsSequenceMode] = useState(false);
  const [audioErrorReason, setAudioErrorReason] = useState<SpeechFailureReason | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

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

    const explicitRate = rateMode === 'slow' ? 0.8 : 1.0;
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
      [activeTrack.id]:
        xp > 0
          ? `A2 parçası tamamlandı olarak kaydedildi · +${xp} A2 XP kazanıldı (puanlı doğruluk oranını şişirmez).`
          : 'Tekrar pratiğiniz kaydedildi (bu A2 parçası daha önce tamamlandığı için ek XP eklenmedi).',
    }));
  };

  const completedTracksCount = A2_KARAOKE_IDS.filter((id) =>
    a2Progress.activityMasteredIds.includes(id)
  ).length;
  const isTrackMastered = a2Progress.activityMasteredIds.includes(activeTrack.id);
  const isPlayingOrStarting = activeLineIndex !== null || startingLineIndex !== null;

  const audioErrorText =
    audioErrorReason === 'unsupported'
      ? 'Bu tarayıcı Web Speech API (de-DE) seslendirmesini desteklemiyor. Satırları ritim vurgularıyla kendiniz sesli okuyarak pratik yapabilirsiniz.'
      : audioErrorReason === 'timeout'
      ? 'Tarayıcı ses motoru zaman aşımına uğradı (onstart doğrulanamadı). Tekrar deneyebilir veya metni ritim işaretleriyle yüksek sesle okuyabilirsiniz.'
      : audioErrorReason === 'error'
      ? 'Seslendirme başlatılamadı. Tarayıcı ses ayarlarını kontrol edebilir veya satırları kendiniz sesli okuyabilirsiniz.'
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <ActivityA2SubNav activeRoute="karaoke" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 md:flex-row md:items-end md:justify-between dark:border-[#282830]">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>Etkinlikler</span>
            <span aria-hidden="true" className="mx-2">/</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              Almanca A2 · Karaoke Stüdyosu
            </span>
            {rolePreview === 'teacher' && (
              <>
                <span aria-hidden="true" className="mx-2">·</span>
                <span>Sınıf Ekranı Uyumlu</span>
              </>
            )}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#111113] dark:text-[#F4F4F5]">
            A2 Karaoke Stüdyosu — Ritmik Yan Cümle &amp; Perfekt Akışı
          </h1>
        </div>

        <div className="flex items-center gap-6 border-t border-[#ECECE8] pt-4 md:border-t-0 md:pt-0 dark:border-[#24242C]">
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Toplam A2 XP</p>
            <p className="font-mono text-xl font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
              {a2Progress.xp}
            </p>
          </div>
          <div className="h-8 w-px bg-[#D9D9D3] dark:bg-[#282830]" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Tamamlanan Parça</p>
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
                  A2 Parça 0{idx + 1}
                </span>
                {mastered ? (
                  <span className="inline-flex items-center gap-1 font-medium text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Tamamlandı</span>
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
              <span>{activeTrack.lines.length} ritmik A2 satırı</span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {activeTrack.titleDe}{' '}
              <span className="text-base font-normal text-[#52525B] dark:text-[#A1A1AA]">
                — {activeTrack.titleTr}
              </span>
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              Tema: {activeTrack.themeTr} · 0.8× veya 1.0× hızda sesli tekrarlayın.
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
                  <span>Başlatılıyor…</span>
                </>
              ) : isPlayingOrStarting ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Parçayı Sırayla Dinle</span>
                </>
              )}
            </button>

            <div
              role="group"
              aria-label="A2 Karaoke oynatma hızı"
              className="inline-flex rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]"
            >
              <button
                type="button"
                aria-pressed={rateMode === 'slow'}
                onClick={() => setRateMode('slow')}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                  rateMode === 'slow'
                    ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                0.8× Yavaş
              </button>
              <button
                type="button"
                aria-pressed={rateMode === 'normal'}
                onClick={() => setRateMode('normal')}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                  rateMode === 'normal'
                    ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
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
                  <span>Çeviriyi Gizle</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Türkçe Çeviriyi Göster</span>
                </>
              )}
            </button>
          </div>
        </div>

        {!speechSupported && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[#9A6B16]/40 bg-[#FEF9EB] p-3.5 text-xs text-[#111113] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#F4F4F5]">
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
            <span>
              Bu tarayıcıda Web Speech API (de-DE) seslendirmesi desteklenmiyor. Satırları ritim işaretleriyle yüksek sesle okuyarak A2 çalışmasını tamamlayabilirsiniz.
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
                          · Oynatılıyor {isSequenceMode ? '(Sıralı)' : ''}
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
                      Odak kalıplar:{' '}
                      <span className="font-mono text-[#111113] dark:text-[#E4E4E7]">
                        {line.focusWords.join(' · ')}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={() => handlePlaySingleLine(idx)}
                    aria-label={`${idx + 1}. satırı dinle`}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 ${
                      isActiveLine || isStartingLine
                        ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                    }`}
                  >
                    {isStartingLine ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Başlıyor…</span>
                      </>
                    ) : isActiveLine ? (
                      <>
                        <Square className="h-3 w-3 fill-current" />
                        <span>Durdur</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Satırı Dinle</span>
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
                ? 'Bu A2 parçası daha önce tamamlandı (tekrarlar ek XP veya puanlı doğruluk eklemez).'
                : 'Tüm satırları yüksek sesle tekrarladıysanız parçayı tamamlandı olarak kaydedin (+15 A2 XP · doğruluk oranını şişirmez).'}
            </p>
            {feedbackMap[activeTrack.id] && (
              <p
                role="status"
                className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]"
              >
                {feedbackMap[activeTrack.id]}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleMarkTrackComplete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-semibold text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isTrackMastered ? 'Tekrar Pratiğini Kaydet' : 'Parçayı Tamamladım (+15 A2 XP)'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
