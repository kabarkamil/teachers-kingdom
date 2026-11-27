import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Mic, MicOff, RotateCcw } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import {
  isSpeechRecognitionSupported,
  startGermanSpeechRecognition,
  type SpeechRecognitionSession,
  type SpeechRecognitionStatus,
} from '../../utils/speechRecognition';

interface SpeechTranscriptHelperProps {
  taskId: string;
}

interface RecognitionErrorState {
  status: 'unsupported' | 'permission-denied' | 'error';
  messageTr: string;
}

export const SpeechTranscriptHelper: React.FC<SpeechTranscriptHelperProps> = ({ taskId }) => {
  const { isEn, locale, tx } = useI18n();
  const supported = isSpeechRecognitionSupported();
  const [status, setStatus] = useState<SpeechRecognitionStatus>(
    supported ? 'idle' : 'unsupported'
  );
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [errorState, setErrorState] = useState<RecognitionErrorState | null>(null);
  const sessionRef = useRef<SpeechRecognitionSession | null>(null);

  useEffect(() => {
    sessionRef.current?.abort();
    sessionRef.current = null;
    setStatus(supported ? 'idle' : 'unsupported');
    setFinalText('');
    setInterimText('');
    setErrorState(null);

    return () => {
      sessionRef.current?.abort();
      sessionRef.current = null;
    };
  }, [taskId, supported]);

  const handleToggleListening = () => {
    if (status === 'listening') {
      sessionRef.current?.stop();
      setStatus('idle');
      return;
    }

    setErrorState(null);
    setInterimText('');

    const session = startGermanSpeechRecognition({
      onStart: () => {
        setStatus('listening');
        setErrorState(null);
      },
      onResult: ({ finalText: nextFinal, interimText: nextInterim }) => {
        setFinalText(nextFinal);
        setInterimText(nextInterim);
      },
      onEnd: () => {
        setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
        setInterimText('');
        sessionRef.current = null;
      },
      onError: (errStatus, messageTr) => {
        setStatus(errStatus);
        setErrorState({ status: errStatus, messageTr });
        sessionRef.current = null;
      },
    });

    sessionRef.current = session;
  };

  const handleClear = () => {
    setFinalText('');
    setInterimText('');
    setErrorState(null);
    if (supported && status !== 'listening') {
      setStatus('idle');
    }
  };

  const statusMessage = (() => {
    if (!errorState) return null;
    if (!isEn) return errorState.messageTr;
    if (errorState.status === 'unsupported') return locale.audio.micUnsupported;
    if (errorState.status === 'permission-denied') return locale.audio.micPermissionDenied;
    if (errorState.messageTr.includes('algılanamadı')) {
      return 'No speech was detected. Move closer to the microphone and try again, or continue with self-assessment.';
    }
    if (errorState.messageTr.includes('aygıtı')) {
      return 'No active microphone device was found. You can listen to the model phrases and repeat aloud without a microphone.';
    }
    if (errorState.messageTr.includes('servisine')) {
      return 'Browser speech recognition service is currently unreachable. You can listen to the model audio and practice aloud.';
    }
    return locale.audio.micError;
  })();

  const combinedText = `${finalText}${interimText ? ` ${interimText}` : ''}`.trim();

  return (
    <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#111113] dark:text-[#F4F4F5]">
          <Mic className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
          <span>
            {tx({
              tr: 'İsteğe Bağlı Mikrofon Konuşma-Metin Önizlemesi (de-DE)',
              en: 'Optional Microphone Speech-to-Text Preview (de-DE)',
            })}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {combinedText && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-10 sm:h-9 items-center gap-1 rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'Temizle', en: 'Clear' })}</span>
            </button>
          )}

          <button
            type="button"
            aria-pressed={status === 'listening'}
            onClick={handleToggleListening}
            disabled={!supported}
            className={`inline-flex h-10 sm:h-9 items-center gap-1.5 rounded-md px-3.5 text-xs font-medium transition-colors ${
              !supported
                ? 'cursor-not-allowed border border-[#D9D9D3] bg-[#ECECE8] text-[#71717A] dark:border-[#282830] dark:bg-[#1A1A20] dark:text-[#71717A]'
                : status === 'listening'
                ? 'bg-[#7C1D2E] text-white hover:bg-[#641624] dark:bg-[#B8324B]'
                : 'border border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
            }`}
          >
            {status === 'listening' ? (
              <>
                <MicOff className="h-3.5 w-3.5" />
                <span>{locale.audio.micStop}</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {supported
                    ? tx({ tr: 'Mikrofonu Dene', en: 'Try Microphone' })
                    : tx({ tr: 'Tarayıcıda Desteklenmiyor', en: 'Unsupported in Browser' })}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
        {supported
          ? tx({
              tr: 'Yalnızca yerel ses-metin önizlemesidir; telaffuz puanlaması yapılmaz ve mikrofon zorunlu değildir.',
              en: 'Local speech-to-text preview only; no pronunciation grading is performed and a microphone is optional.',
            })
          : tx({
              tr: 'Bu tarayıcı konuşma tanımayı desteklemiyor; model cümleleri dinleyip öz-değerlendirme ile tamamlayabilirsiniz.',
              en: 'This browser does not support speech recognition; you can listen to the model sentences and complete via self-assessment.',
            })}
      </p>

      {status === 'listening' && (
        <p className="text-xs font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
          {tx({
            tr: 'Dinleniyor (de-DE)… Almanca cümlenizi söyleyin, bitince “Dinlemeyi Durdur”a basın.',
            en: 'Listening (de-DE)… Say your German sentence, then press “Stop Listening” when finished.',
          })}
        </p>
      )}

      {combinedText && (
        <div className="rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2 text-xs text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]">
          <span className="block text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Tarayıcı Yerel Döküm Önizlemesi (Puanlama değildir):',
              en: 'Local Browser Transcript Preview (Not graded):',
            })}
          </span>
          <p className="mt-1 font-medium leading-relaxed">{combinedText}</p>
        </div>
      )}

      {statusMessage && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-[#D9A13B]/45 bg-[#FFFBEB] px-3 py-2 text-xs text-[#78350F] dark:border-[#D9A13B]/35 dark:bg-[#231D10] dark:text-[#F6D693]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
