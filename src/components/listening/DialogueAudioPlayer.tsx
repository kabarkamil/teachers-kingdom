import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Languages,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from 'lucide-react';
import type { ListeningScenario } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import {
  getSpeakerProfile,
  isSpeechSynthesisSupported,
  resolveDialogueSpeakerVoices,
  stopGermanSpeech,
} from '../../utils/speech';

interface DialogueAudioPlayerProps {
  scenario: ListeningScenario;
}

type PlaybackStatus = 'idle' | 'starting' | 'playing' | 'paused' | 'ended' | 'unavailable';
type ListeningRate = 0.8 | 1.0;
type UnavailableReasonCode = 'unsupported' | 'timeout' | 'synth_error' | 'init_error';

export const DialogueAudioPlayer: React.FC<DialogueAudioPlayerProps> = ({ scenario }) => {
  const { locale, tx } = useI18n();
  const [speechSupported] = useState<boolean>(() => isSpeechSynthesisSupported());
  const [voicePlan, setVoicePlan] = useState(() => resolveDialogueSpeakerVoices());
  const [status, setStatus] = useState<PlaybackStatus>(() =>
    isSpeechSynthesisSupported() ? 'idle' : 'unavailable'
  );
  const [unavailableReasonCode, setUnavailableReasonCode] =
    useState<UnavailableReasonCode | null>(() =>
      isSpeechSynthesisSupported() ? null : 'unsupported'
    );
  const [rate, setRate] = useState<ListeningRate>(1.0);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [completedLines, setCompletedLines] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showTurkish, setShowTurkish] = useState<boolean>(false);

  // Refs to prevent stale closures across sequential utterances
  const sessionTokenRef = useRef<number>(0);
  const watchdogRef = useRef<number | null>(null);
  const rateRef = useRef<ListeningRate>(rate);
  rateRef.current = rate;

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const cancelPlayback = useCallback(() => {
    sessionTokenRef.current += 1;
    clearWatchdog();
    stopGermanSpeech();
  }, [clearWatchdog]);

  // Refresh speaker voice assignment when browser loads voices asynchronously
  useEffect(() => {
    if (!speechSupported) return;
    const refreshVoices = () => setVoicePlan(resolveDialogueSpeakerVoices());
    refreshVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoices);
    };
  }, [speechSupported]);

  // Reset player & keep transcript hidden initially whenever scenario changes
  useEffect(() => {
    cancelPlayback();
    setStatus(speechSupported ? 'idle' : 'unavailable');
    setUnavailableReasonCode(speechSupported ? null : 'unsupported');
    setCurrentLineIdx(0);
    setCompletedLines(0);
    setShowTranscript(false);
    setShowTurkish(false);
  }, [scenario.id, cancelPlayback, speechSupported]);

  // Stop speech cleanly on unmount
  useEffect(() => {
    return () => {
      cancelPlayback();
    };
  }, [cancelPlayback]);

  const speakFromLine = useCallback(
    (startIndex: number, singleLineOnly = false, playbackRate?: ListeningRate) => {
      if (!speechSupported) {
        setStatus('unavailable');
        setUnavailableReasonCode('unsupported');
        return;
      }

      const line = scenario.lines[startIndex];
      if (!line) {
        setStatus('ended');
        setCompletedLines(scenario.lines.length);
        return;
      }

      cancelPlayback();
      const token = sessionTokenRef.current;
      const effectiveRate = playbackRate ?? rateRef.current;

      setCurrentLineIdx(startIndex);
      setStatus('starting');
      setUnavailableReasonCode(null);

      try {
        const utterance = new SpeechSynthesisUtterance(line.textDe);
        utterance.lang = 'de-DE';

        const currentPlan = resolveDialogueSpeakerVoices(window.speechSynthesis.getVoices());
        setVoicePlan(currentPlan);

        const speakerProfile = getSpeakerProfile(currentPlan, line.speakerGender);
        if (speakerProfile.voice) {
          utterance.voice = speakerProfile.voice;
        }
        utterance.pitch = speakerProfile.pitch;
        utterance.rate = Math.min(
          1.2,
          Math.max(0.65, effectiveRate * speakerProfile.rateMultiplier)
        );

        let startedConfirmed = false;

        // Honest watchdog: confirm playback strictly via utterance.onstart; never fake start if browser TTS stalls
        watchdogRef.current = window.setTimeout(() => {
          if (sessionTokenRef.current !== token || startedConfirmed) return;
          cancelPlayback();
          setStatus('unavailable');
          setUnavailableReasonCode('timeout');
        }, 1800);

        utterance.onstart = () => {
          if (sessionTokenRef.current !== token) return;
          startedConfirmed = true;
          clearWatchdog();
          setStatus('playing');
        };

        utterance.onend = () => {
          if (sessionTokenRef.current !== token) return;
          clearWatchdog();

          if (singleLineOnly) {
            setStatus('idle');
            return;
          }

          const nextIndex = startIndex + 1;
          setCompletedLines(nextIndex);

          if (nextIndex < scenario.lines.length) {
            // Brief natural pause between dialogue turns
            window.setTimeout(() => {
              if (sessionTokenRef.current === token) {
                speakFromLine(nextIndex, false);
              }
            }, 260);
          } else {
            setStatus('ended');
          }
        };

        utterance.onerror = (event) => {
          if (sessionTokenRef.current !== token) return;
          clearWatchdog();
          // Ignore intentional cancellations triggered by pause/stop/replay
          if (event.error === 'canceled' || event.error === 'interrupted') {
            return;
          }
          setStatus('unavailable');
          setUnavailableReasonCode('synth_error');
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        clearWatchdog();
        setStatus('unavailable');
        setUnavailableReasonCode('init_error');
      }
    },
    [scenario.lines, speechSupported, cancelPlayback, clearWatchdog]
  );

  const handlePlayOrPause = () => {
    if (status === 'playing' || status === 'starting') {
      cancelPlayback();
      setStatus('paused');
      return;
    }
    if (status === 'paused') {
      speakFromLine(currentLineIdx, false);
      return;
    }
    // idle, ended, or retry after unavailable
    setCompletedLines(0);
    speakFromLine(0, false);
  };

  const handleReplay = () => {
    setCompletedLines(0);
    speakFromLine(0, false);
  };

  const handleStop = () => {
    cancelPlayback();
    setCurrentLineIdx(0);
    setCompletedLines(0);
    setStatus(speechSupported ? 'idle' : 'unavailable');
  };

  const handleSpeedChange = (nextRate: ListeningRate) => {
    setRate(nextRate);
    rateRef.current = nextRate;
    if (status === 'playing') {
      speakFromLine(currentLineIdx, false, nextRate);
    }
  };

  const totalLines = scenario.lines.length;
  const progressPercent =
    status === 'ended'
      ? 100
      : status === 'playing' || status === 'paused'
      ? Math.round(((currentLineIdx + (status === 'playing' ? 0.5 : 0)) / totalLines) * 100)
      : Math.round((completedLines / totalLines) * 100);

  const statusLabel = (() => {
    switch (status) {
      case 'starting':
        return tx({ tr: 'Ses motoru başlatılıyor…', en: 'Starting speech engine…' });
      case 'playing':
        return tx(
          {
            tr: 'Oynatılıyor · Replik {current} / {total}',
            en: 'Playing · Line {current} / {total}',
          },
          { current: currentLineIdx + 1, total: totalLines }
        );
      case 'paused':
        return tx(
          {
            tr: 'Duraklatıldı · Replik {current} / {total}',
            en: 'Paused · Line {current} / {total}',
          },
          { current: currentLineIdx + 1, total: totalLines }
        );
      case 'ended':
        return tx(
          {
            tr: 'Tamamlandı · {total} / {total} replik dinlendi',
            en: 'Completed · {total} / {total} lines played',
          },
          { total: totalLines }
        );
      case 'unavailable':
        return tx({
          tr: 'Tarayıcı seslendirmesi kullanılamıyor',
          en: 'Browser speech synthesis unavailable',
        });
      default:
        return tx(
          { tr: 'Dinlemeye hazır · {total} replik', en: 'Ready to listen · {total} lines' },
          { total: totalLines }
        );
    }
  })();

  const voiceStatusNote = (() => {
    if (!voicePlan.supported) {
      return tx({
        tr: 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor.',
        en: 'Web Speech API speech synthesis is not supported in this browser.',
      });
    }
    if (voicePlan.germanVoiceCount === 0) {
      return tx({
        tr: 'Tarayıcıda özel de-DE sesi listelenmedi; sistem varsayılan sentezleyicisi denenir.',
        en: 'No dedicated de-DE voice listed; the system default synthesizer will be tried.',
      });
    }
    const femaleName = voicePlan.female.voice?.name ?? 'de-DE';
    const maleName = voicePlan.male.voice?.name ?? 'de-DE';
    if (voicePlan.germanVoiceCount === 1) {
      return tx(
        {
          tr: 'Tarayıcıda yalnızca 1 Almanca ses bulundu ({name}); tüm konuşmacılar bu sesle okunur.',
          en: 'Only 1 German voice found ({name}); all speakers use this voice.',
        },
        { name: femaleName }
      );
    }
    if (voicePlan.hasDistinctVoices) {
      return tx(
        {
          tr: 'Çift konuşmacı sesi aktif ({female} · {male})',
          en: 'Dual speaker voices active ({female} · {male})',
        },
        { female: femaleName, male: maleName }
      );
    }
    return tx(
      {
        tr: 'Tarayıcıda tek Almanca ses profili aktif ({name}).',
        en: 'Single German voice profile active ({name}).',
      },
      { name: femaleName }
    );
  })();

  const unavailableMessage = (() => {
    switch (unavailableReasonCode) {
      case 'unsupported':
        return tx({
          tr: 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor.',
          en: 'Web Speech API speech synthesis is not supported in this browser.',
        });
      case 'timeout':
        return tx({
          tr: 'Tarayıcı ses motoru (de-DE) bu ortamda ses oynatmayı başlatamadı. Sahte oynatma yapılmaz; aşağıdaki metni açarak diyalogu inceleyebilirsiniz.',
          en: 'The browser speech engine (de-DE) could not start playback here. No simulated playback is used; open the transcript below to review the dialogue.',
        });
      case 'synth_error':
        return tx({
          tr: 'Tarayıcı ses sentezleyicisi bu satırı okurken bir hata döndürdü. Cihazınızın ses veya Almanca (de-DE) dil paketi ayarlarını kontrol edebilir ya da metni açarak devam edebilirsiniz.',
          en: 'The browser speech synthesizer returned an error while reading this line. Check your device audio or German (de-DE) language pack settings, or open the transcript to continue.',
        });
      case 'init_error':
        return tx({
          tr: 'Tarayıcı seslendirme API’si başlatılamadı. Metin görünümünü açarak alıştırmalara devam edebilirsiniz.',
          en: 'Could not start the browser speech API. Open the transcript view to continue with the exercises.',
        });
      default:
        return tx({
          tr: 'Bu tarayıcıda Almanca seslendirme (de-DE) kullanılamıyor. Sahte ses oynatma yapılmaz; aşağıdaki metin görünümünü açarak çalışabilirsiniz.',
          en: 'German speech synthesis (de-DE) is unavailable in this browser. No simulated audio is used; open the transcript below to continue studying.',
        });
    }
  })();

  return (
    <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]">
      {/* Scenario Title & Honest TTS Attribution */}
      <div className="flex flex-col gap-3 border-b border-[#ECECE8] pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-[#24242C]">
        <div>
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <span>{scenario.contextLabelTr}</span>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {scenario.titleDe}
            </span>
          </p>
          <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {scenario.titleTr}
          </h2>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-[#52525B] dark:text-[#A1A1AA] shrink-0">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <span>
              {voicePlan.supported
                ? voicePlan.hasDistinctVoices
                  ? tx({
                      tr: 'Tarayıcı Seslendirmesi (de-DE · Çift Konuşmacı Sesi)',
                      en: 'Browser Speech (de-DE · Dual Speaker Voices)',
                    })
                  : voicePlan.germanVoiceCount === 1
                  ? tx({
                      tr: 'Tarayıcı Seslendirmesi (de-DE · Tek Ses)',
                      en: 'Browser Speech (de-DE · Single Voice)',
                    })
                  : locale.common.browserTtsNotice
                : tx({
                    tr: 'Tarayıcı Seslendirmesi Desteklenmiyor',
                    en: 'Browser Speech Not Supported',
                  })}
            </span>
          </div>
          <p className="text-[11px] text-[#71717A] dark:text-[#8E8E98]">
            {voiceStatusNote}
          </p>
        </div>
      </div>

      {/* Audio Controls Row */}
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={!speechSupported}
            onClick={handlePlayOrPause}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-medium text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
          >
            {status === 'playing' || status === 'starting' ? (
              <>
                <Pause className="h-4 w-4" />
                <span>{locale.audio.pause}</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>
                  {status === 'paused'
                    ? tx({ tr: 'Devam Et', en: 'Resume' })
                    : tx({ tr: 'Diyalogu Dinle', en: 'Play Dialogue' })}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!speechSupported}
            onClick={handleReplay}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{tx({ tr: 'Baştan Dinle', en: 'Replay' })}</span>
          </button>

          {(status === 'playing' || status === 'paused' || status === 'starting') && (
            <button
              type="button"
              onClick={handleStop}
              aria-label={tx({ tr: 'Oynatmayı durdur', en: 'Stop playback' })}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] whitespace-nowrap shrink-0"
            >
              <Square className="h-3.5 w-3.5" />
              <span>{locale.audio.stop}</span>
            </button>
          )}
        </div>

        {/* Speed Selector (0.8x / 1.0x) */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA] whitespace-nowrap">
            {tx({ tr: 'Oynatma Hızı:', en: 'Playback Speed:' })}
          </span>
          <div
            role="group"
            aria-label={locale.audio.speedLabel}
            className="flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]"
          >
            <button
              type="button"
              disabled={!speechSupported}
              onClick={() => handleSpeedChange(0.8)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                rate === 0.8
                  ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
              }`}
            >
              {tx({ tr: '0.8× (Yavaş)', en: '0.8× (Slow)' })}
            </button>
            <button
              type="button"
              disabled={!speechSupported}
              onClick={() => handleSpeedChange(1.0)}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
                rate === 1.0
                  ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
              }`}
            >
              {tx({ tr: '1.0× (Normal)', en: '1.0× (Normal)' })}
            </button>
          </div>
        </div>
      </div>

      {/* Real Playback Progress Indicator */}
      <div className="mt-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-medium text-[#111113] dark:text-[#E4E4E7]">{statusLabel}</span>
          <span className="font-mono tabular-nums">
            {status === 'unavailable'
              ? tx({ tr: '%0', en: '0%' })
              : tx({ tr: '%{pct}', en: '{pct}%' }, { pct: progressPercent })}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
          <div
            className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
            style={{ width: status === 'unavailable' ? '0%' : `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Honest Audio Unavailable / Fallback Banner */}
      {(status === 'unavailable' || unavailableReasonCode) && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#9A6B16]/40 bg-[#FEF9EB] px-4 py-3 text-xs leading-relaxed text-[#713F12] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#FDE68A]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{unavailableMessage}</p>
        </div>
      )}

      {/* Ear-First Pedagogical Transcript Area (Hidden Initially) */}
      <div className="mt-6 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({ tr: 'Diyalog Metni (Transkript)', en: 'Dialogue Transcript' })}
            </p>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {showTranscript
                ? tx({
                    tr: 'Metin açık; satırları tek tek dinleyebilirsiniz.',
                    en: 'Transcript open; click any line to listen individually.',
                  })
                : tx({
                    tr: 'Önce dinleyin; kontrol için metni istediğiniz zaman açın.',
                    en: 'Listen first; open the transcript anytime to check.',
                  })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showTranscript && (
              <button
                type="button"
                onClick={() => setShowTurkish((prev) => !prev)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                  showTurkish
                    ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                    : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#E4E4E7]'
                }`}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>
                  {showTurkish
                    ? tx({ tr: 'Türkçe Çeviriyi Gizle', en: 'Hide Turkish Gloss' })
                    : locale.common.showTurkish}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowTranscript((prev) => !prev)}
              aria-expanded={showTranscript}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>{locale.common.hideTranscript}</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{locale.common.showTranscript}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showTranscript && (
          <ol className="mt-4 divide-y divide-[#ECECE8] rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] dark:divide-[#24242C] dark:border-[#282830] dark:bg-[#111113]">
            {scenario.lines.map((line, idx) => {
              const isActiveLine =
                (status === 'playing' || status === 'paused') && currentLineIdx === idx;
              return (
                <li
                  key={line.id}
                  className={`flex items-start justify-between gap-3 px-4 py-3.5 transition-colors ${
                    isActiveLine ? 'bg-[#FEF9EB] dark:bg-[#231D11]/70' : ''
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                      {line.speaker}
                    </p>
                    <p className="text-sm leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                      {line.textDe}
                    </p>
                    {showTurkish && (
                      <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        {line.textTr}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={() => speakFromLine(idx, true)}
                    aria-label={tx(
                      { tr: '{speaker} repliğini dinle', en: "Listen to {speaker}'s line" },
                      { speaker: line.speaker }
                    )}
                    title={tx({ tr: 'Bu cümleyi dinle', en: 'Listen to this line' })}
                    className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#111113] disabled:opacity-40 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] shrink-0"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};
