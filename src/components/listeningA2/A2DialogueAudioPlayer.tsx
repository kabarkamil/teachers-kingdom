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
import type { A2ListeningScenario, ListeningLine } from '../../types';
import {
  isSpeechSynthesisSupported,
  resolveDialogueSpeakerVoices,
  speakGermanText,
  stopGermanSpeech,
} from '../../utils/speech';

interface A2DialogueAudioPlayerProps {
  scenario: A2ListeningScenario;
}

type PlayerStatus = 'idle' | 'starting' | 'playing' | 'paused' | 'completed' | 'fallback';

const PLAYBACK_RATES: Array<{ value: 0.8 | 1.0; label: string }> = [
  { value: 0.8, label: '0.8× Yavaş' },
  { value: 1.0, label: '1.0× Normal' },
];

export const A2DialogueAudioPlayer: React.FC<A2DialogueAudioPlayerProps> = ({ scenario }) => {
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [rate, setRate] = useState<0.8 | 1.0>(1.0);
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(-1);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [hasDualVoice, setHasDualVoice] = useState<boolean>(false);

  const sessionTokenRef = useRef<number>(0);
  const rateRef = useRef<0.8 | 1.0>(rate);
  const linesRef = useRef<ListeningLine[]>(scenario.lines);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    linesRef.current = scenario.lines;
  }, [scenario.lines]);

  // Detect available German voices cleanly via speech.ts
  useEffect(() => {
    if (!isSpeechSynthesisSupported()) return;
    const inspectVoices = () => {
      const pair = resolveDialogueSpeakerVoices();
      setHasDualVoice(pair.hasDistinctVoices);
    };
    inspectVoices();
    const synth = window.speechSynthesis;
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', inspectVoices);
      return () => synth.removeEventListener('voiceschanged', inspectVoices);
    }
    return undefined;
  }, []);

  const stopPlayback = useCallback((nextStatus: PlayerStatus = 'idle') => {
    sessionTokenRef.current += 1;
    stopGermanSpeech();
    setStatus(nextStatus);
    if (nextStatus === 'idle') {
      setCurrentLineIdx(-1);
    }
  }, []);

  // Reset player cleanly when switching scenarios or unmounting
  useEffect(() => {
    stopPlayback('idle');
    setShowTranscript(false);
    setShowTranslation(false);
    setFallbackNotice(null);
    return () => {
      sessionTokenRef.current += 1;
      stopGermanSpeech();
    };
  }, [scenario.id, stopPlayback]);

  const speakSequenceFrom = useCallback((startIndex: number, singleLineOnly = false) => {
    const lines = linesRef.current;
    if (startIndex < 0 || startIndex >= lines.length) {
      setStatus('completed');
      setCurrentLineIdx(-1);
      return;
    }

    if (!isSpeechSynthesisSupported()) {
      setStatus('fallback');
      setFallbackNotice(
        'Bu tarayıcıda Web Speech API (de-DE seslendirme) desteklenmiyor. Aşağıdan metni açarak diyaloğu okuyabilirsiniz.'
      );
      setShowTranscript(true);
      return;
    }

    const token = ++sessionTokenRef.current;
    const line = lines[startIndex];
    setFallbackNotice(null);
    setCurrentLineIdx(startIndex);
    setStatus('starting');

    const result = speakGermanText(
      line.textDe,
      rateRef.current < 1 ? 'slow' : 'normal',
      {
        onStart: () => {
          if (sessionTokenRef.current !== token) return;
          setStatus('playing');
        },
        onEnd: () => {
          if (sessionTokenRef.current !== token) return;
          if (singleLineOnly) {
            setStatus('idle');
            setCurrentLineIdx(-1);
            return;
          }
          const nextIdx = startIndex + 1;
          if (nextIdx < linesRef.current.length) {
            speakSequenceFrom(nextIdx, false);
          } else {
            setStatus('completed');
            setCurrentLineIdx(-1);
          }
        },
        onError: (reason) => {
          if (sessionTokenRef.current !== token) return;
          setStatus('fallback');
          setShowTranscript(true);
          if (reason === 'timeout') {
            setFallbackNotice(
              'Tarayıcı ses motoru yanıt vermedi (zaman aşımı). Diyalogu metin görünümünden takip edebilir veya tekrar deneyebilirsiniz.'
            );
          } else if (reason === 'unsupported') {
            setFallbackNotice(
              'Bu tarayıcıda Almanca seslendirme desteklenmiyor. Metin görünümü otomatik açıldı.'
            );
          } else {
            setFallbackNotice(
              'Seslendirme sırasında bir tarayıcı hatası oluştu. Metin görünümü üzerinden çalışmaya devam edebilirsiniz.'
            );
          }
        },
      },
      rateRef.current,
      line.speakerGender
    );

    if (!result.queued) {
      if (sessionTokenRef.current !== token) return;
      setStatus('fallback');
      setShowTranscript(true);
      setFallbackNotice(
        'Almanca seslendirme kuyruğa alınamadı. Diyalogu metin görünümünden okuyabilirsiniz.'
      );
    }
  }, []);

  const handlePrimaryPlayPause = () => {
    if (status === 'playing' || status === 'starting') {
      stopPlayback('paused');
      return;
    }
    if (status === 'paused' && currentLineIdx >= 0 && currentLineIdx < scenario.lines.length) {
      speakSequenceFrom(currentLineIdx, false);
      return;
    }
    speakSequenceFrom(0, false);
  };

  const handleReplayAll = () => {
    speakSequenceFrom(0, false);
  };

  const handleSpeedChange = (nextRate: 0.8 | 1.0) => {
    setRate(nextRate);
    rateRef.current = nextRate;
    if (status === 'playing' || status === 'starting') {
      const idx = currentLineIdx >= 0 ? currentLineIdx : 0;
      speakSequenceFrom(idx, false);
    }
  };

  const activeLine =
    currentLineIdx >= 0 && currentLineIdx < scenario.lines.length
      ? scenario.lines[currentLineIdx]
      : null;

  const progressRatio =
    status === 'completed'
      ? 100
      : currentLineIdx >= 0
      ? Math.round(((currentLineIdx + 1) / scenario.lines.length) * 100)
      : 0;

  const statusLabelTr =
    status === 'playing'
      ? `Oynatılıyor · Satır ${currentLineIdx + 1}/${scenario.lines.length}`
      : status === 'starting'
      ? 'Almanca ses başlatılıyor…'
      : status === 'paused'
      ? `Duraklatıldı · Satır ${Math.max(1, currentLineIdx + 1)}/${scenario.lines.length}`
      : status === 'completed'
      ? 'Dinleme tamamlandı — soruları çözebilir veya tekrar dinleyebilirsiniz'
      : status === 'fallback'
      ? 'Seslendirme kullanılamıyor — metin desteği açık'
      : `Dinlemeye hazır · ${scenario.lines.length} replik (de-DE)`;

  return (
    <section
      aria-label="A2 Almanca dinleme oynatıcısı"
      className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] overflow-hidden dark:border-[#282830] dark:bg-[#16161A]"
    >
      {/* Top Bar */}
      <div className="border-b border-[#D9D9D3] bg-[#F6F6F4] px-5 py-4 sm:px-6 dark:border-[#282830] dark:bg-[#111113]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                CEFR A2 · HÖREN
              </span>
              <span>·</span>
              <span>{scenario.contextLabelTr}</span>
              <span>·</span>
              <span className="font-mono">~{scenario.estimatedMinutes} dk</span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {scenario.titleDe}
            </h2>
            <p className="mt-0.5 text-sm text-[#52525B] dark:text-[#A1A1AA]">
              {scenario.titleTr} — {scenario.subtitleTr}
            </p>
          </div>

          {/* Speed Selector */}
          <div
            role="group"
            aria-label="Seslendirme hızı"
            className="inline-flex items-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] p-1 self-start sm:self-center dark:border-[#282830] dark:bg-[#16161A]"
          >
            {PLAYBACK_RATES.map((option) => {
              const active = rate === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSpeedChange(option.value)}
                  aria-pressed={active}
                  className={`h-9 rounded-md px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">A2 Odak:</span>{' '}
          {scenario.cefrFocusTr}
        </p>
      </div>

      {/* Main Audio Controls */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrimaryPlayPause}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#111113] px-5 text-sm font-semibold text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E5B353] whitespace-nowrap"
          >
            {status === 'playing' || status === 'starting' ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Duraklat</span>
              </>
            ) : status === 'paused' ? (
              <>
                <Play className="h-4 w-4" />
                <span>Devam Et</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Diyalogu Dinle</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReplayAll}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Baştan Dinle</span>
          </button>

          {(status === 'playing' || status === 'starting' || status === 'paused') && (
            <button
              type="button"
              onClick={() => stopPlayback('idle')}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-sm font-medium text-[#52525B] transition-colors hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] whitespace-nowrap"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Durdur</span>
            </button>
          )}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTranscript((prev) => !prev)}
              aria-expanded={showTranscript}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                  <span>Metni Gizle</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                  <span>Metni Göster</span>
                </>
              )}
            </button>

            {showTranscript && (
              <button
                type="button"
                onClick={() => setShowTranslation((prev) => !prev)}
                aria-pressed={showTranslation}
                className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  showTranslation
                    ? 'border-[#9A6B16] bg-[#9A6B16]/10 text-[#9A6B16] dark:border-[#D9A13B] dark:bg-[#D9A13B]/15 dark:text-[#D9A13B]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>{showTranslation ? 'Türkçeyi Gizle' : 'Türkçe Çeviriyi Göster'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Track & Active Speaker Indicator */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <span className="flex items-center gap-1.5 font-medium text-[#111113] dark:text-[#F4F4F5]">
              <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
              <span>{statusLabelTr}</span>
            </span>
            <span className="font-mono tabular-nums">
              {activeLine
                ? `Konuşmacı: ${activeLine.speaker}`
                : hasDualVoice
                ? 'Çift konuşmacı (de-DE) hazır'
                : 'Tarayıcı de-DE ses motoru'}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-md bg-[#ECECE8] dark:bg-[#24242C]">
            <div
              className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {/* Listening-first Guidance when Transcript is Hidden */}
        {!showTranscript && !fallbackNotice && (
          <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 py-2.5 text-xs text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]">
            Önce 1.0× veya 0.8× hızda dinleyin; gerekirse{' '}
            <span className="font-medium text-[#111113] dark:text-[#F4F4F5]">Metni Göster</span> ile kontrol edin.
          </div>
        )}

        {/* Honest TTS Fallback Notice */}
        {fallbackNotice && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-lg border border-[#9A6B16]/40 bg-[#9A6B16]/10 px-4 py-3 text-xs leading-relaxed text-[#111113] dark:border-[#D9A13B]/40 dark:bg-[#D9A13B]/10 dark:text-[#F4F4F5]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6B16] dark:text-[#D9A13B]" />
            <span>{fallbackNotice}</span>
          </div>
        )}

        {/* Expandable Transcript & Optional Turkish Translation */}
        {showTranscript && (
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] divide-y divide-[#D9D9D3] dark:border-[#282830] dark:bg-[#111113] dark:divide-[#282830]">
            {scenario.lines.map((line, index) => {
              const isCurrent = index === currentLineIdx && (status === 'playing' || status === 'starting');
              return (
                <div
                  key={line.id}
                  className={`flex items-start justify-between gap-3 px-4 py-3.5 transition-colors ${
                    isCurrent
                      ? 'bg-[#9A6B16]/12 dark:bg-[#D9A13B]/14'
                      : 'bg-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[#71717A] dark:text-[#A1A1AA]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`font-semibold ${
                          line.speakerGender === 'female'
                            ? 'text-[#7C1D2E] dark:text-[#F4A2B0]'
                            : 'text-[#9A6B16] dark:text-[#D9A13B]'
                        }`}
                      >
                        {line.speaker}
                      </span>
                    </div>
                    <p className="mt-1 text-sm sm:text-[15px] leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
                      {line.textDe}
                    </p>
                    {showTranslation && (
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        {line.textTr}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => speakSequenceFrom(index, true)}
                    aria-label={`${line.speaker} repliğini dinle`}
                    title="Bu satırı tek başına dinle"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] transition-colors hover:border-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
