import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Square, Volume2 } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { SpeakerGender } from '../../types';
import {
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type SpeechFailureReason,
} from '../../utils/speech';

interface ModelAudioBarProps {
  textDe: string;
  labelTr?: string;
  labelEn?: string;
  speakerGender?: SpeakerGender;
  compact?: boolean;
}

type PlaybackState = 'idle' | 'starting' | 'playing';

export const ModelAudioBar: React.FC<ModelAudioBarProps> = ({
  textDe,
  labelTr = 'Modeli Dinle (de-DE)',
  labelEn = 'Listen to Model (de-DE)',
  speakerGender,
  compact = false,
}) => {
  const { speechSpeed } = useAppState();
  const { isEn, locale, tx } = useI18n();
  const [rateMode, setRateMode] = useState<'normal' | 'slow'>(speechSpeed);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [errorReason, setErrorReason] = useState<SpeechFailureReason | null>(null);
  const supported = isSpeechSynthesisSupported();

  useEffect(() => {
    setRateMode(speechSpeed);
  }, [speechSpeed]);

  useEffect(() => {
    setPlaybackState('idle');
    setErrorReason(null);
    return () => {
      stopGermanSpeech();
    };
  }, [textDe]);

  const handleChangeSpeed = (nextMode: 'normal' | 'slow') => {
    if (playbackState !== 'idle') {
      stopGermanSpeech();
      setPlaybackState('idle');
    }
    setRateMode(nextMode);
  };

  const handleTogglePlay = () => {
    if (playbackState === 'playing' || playbackState === 'starting') {
      stopGermanSpeech();
      setPlaybackState('idle');
      return;
    }

    setErrorReason(null);
    const explicitRate = rateMode === 'slow' ? 0.78 : 0.96;

    const result = speakGermanText(
      textDe,
      rateMode,
      {
        onStart: () => {
          setPlaybackState('playing');
          setErrorReason(null);
        },
        onEnd: () => {
          setPlaybackState('idle');
        },
        onError: (reason) => {
          setPlaybackState('idle');
          setErrorReason(reason ?? 'error');
        },
      },
      explicitRate,
      speakerGender
    );

    if (result.queued) {
      setPlaybackState('starting');
    } else {
      setPlaybackState('idle');
      setErrorReason(result.reason ?? 'error');
    }
  };

  const errorMessage =
    errorReason === 'unsupported'
      ? locale.audio.ttsUnsupported
      : errorReason === 'timeout'
      ? locale.audio.ttsTimeout
      : errorReason === 'error'
      ? locale.audio.ttsError
      : null;

  const idleLabel = isEn ? labelEn : labelTr;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleTogglePlay}
          disabled={!supported && errorReason === 'unsupported'}
          className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${
            compact ? 'h-9 px-3 text-xs' : 'h-10 px-3.5 text-xs sm:text-sm'
          } ${
            playbackState === 'playing'
              ? 'bg-[#7A1C24] text-white hover:bg-[#62151C] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254]'
              : 'bg-[#0D0D0D] text-[#FFFFFF] hover:bg-[#27272A] dark:bg-[#23232B] dark:text-[#FFFFFF] dark:hover:bg-[#2E2E38]'
          }`}
        >
          {playbackState === 'starting' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          ) : playbackState === 'playing' ? (
            <Square className="h-3.5 w-3.5 fill-current shrink-0" />
          ) : (
            <Volume2 className="h-4 w-4 shrink-0 text-[#D4AF37]" />
          )}
          <span>
            {playbackState === 'starting'
              ? locale.audio.starting
              : playbackState === 'playing'
              ? locale.audio.stop
              : idleLabel}
          </span>
        </button>

        {/* Speed Selector: 0.8x / 1.0x */}
        <div
          role="group"
          aria-label={locale.audio.speedLabel}
          className="inline-flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#0D0D0D]"
        >
          <button
            type="button"
            onClick={() => handleChangeSpeed('slow')}
            aria-pressed={rateMode === 'slow'}
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
              rateMode === 'slow'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            0.8×
          </button>
          <button
            type="button"
            onClick={() => handleChangeSpeed('normal')}
            aria-pressed={rateMode === 'normal'}
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
              rateMode === 'normal'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            1.0×
          </button>
        </div>

        {!supported && !errorMessage && (
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            {tx({ tr: 'Tarayıcı TTS desteklemiyor', en: 'Browser TTS unavailable' })}
          </span>
        )}
      </div>

      {errorMessage && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-[#D4AF37]/50 bg-[#FEF9EB] px-3 py-2 text-xs text-[#78350F] dark:border-[#D4AF37]/40 dark:bg-[#231D10] dark:text-[#F6D693]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
