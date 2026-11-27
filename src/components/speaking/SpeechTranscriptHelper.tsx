import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Mic, MicOff, RotateCcw } from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  startGermanSpeechRecognition,
  type SpeechRecognitionSession,
  type SpeechRecognitionStatus,
} from '../../utils/speechRecognition';

interface SpeechTranscriptHelperProps {
  taskId: string;
}

export const SpeechTranscriptHelper: React.FC<SpeechTranscriptHelperProps> = ({ taskId }) => {
  const supported = isSpeechRecognitionSupported();
  const [status, setStatus] = useState<SpeechRecognitionStatus>(
    supported ? 'idle' : 'unsupported'
  );
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [statusMessageTr, setStatusMessageTr] = useState<string | null>(null);
  const sessionRef = useRef<SpeechRecognitionSession | null>(null);

  useEffect(() => {
    sessionRef.current?.abort();
    sessionRef.current = null;
    setStatus(supported ? 'idle' : 'unsupported');
    setFinalText('');
    setInterimText('');
    setStatusMessageTr(null);

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

    setStatusMessageTr(null);
    setInterimText('');

    const session = startGermanSpeechRecognition({
      onStart: () => {
        setStatus('listening');
        setStatusMessageTr(null);
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
        setStatusMessageTr(messageTr);
        sessionRef.current = null;
      },
    });

    sessionRef.current = session;
  };

  const handleClear = () => {
    setFinalText('');
    setInterimText('');
    setStatusMessageTr(null);
    if (supported && status !== 'listening') {
      setStatus('idle');
    }
  };

  const combinedText = `${finalText}${interimText ? ` ${interimText}` : ''}`.trim();

  return (
    <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3.5 space-y-2.5 dark:border-[#24242C] dark:bg-[#111113]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#111113] dark:text-[#F4F4F5]">
          <Mic className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
          <span>İsteğe Bağlı Mikrofon Konuşma-Metin Önizlemesi (de-DE)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {combinedText && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-10 sm:h-9 items-center gap-1 rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Temizle</span>
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
                <span>Dinlemeyi Durdur</span>
              </>
            ) : (
              <>
                <Mic className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>{supported ? 'Mikrofonu Dene' : 'Tarayıcıda Desteklenmiyor'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
        {supported
          ? 'Yalnızca yerel ses-metin önizlemesidir; telaffuz puanlaması yapılmaz ve mikrofon zorunlu değildir.'
          : 'Bu tarayıcı konuşma tanımayı desteklemiyor; model cümleleri dinleyip öz-değerlendirme ile tamamlayabilirsiniz.'}
      </p>

      {status === 'listening' && (
        <p className="text-xs font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
          Dinleniyor (de-DE)… Almanca cümlenizi söyleyin, bitince “Dinlemeyi Durdur”a basın.
        </p>
      )}

      {combinedText && (
        <div className="rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2 text-xs text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]">
          <span className="block text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
            Tarayıcı Yerel Döküm Önizlemesi (Puanlama değildir):
          </span>
          <p className="mt-1 font-medium leading-relaxed">{combinedText}</p>
        </div>
      )}

      {statusMessageTr && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-md border border-[#D9A13B]/45 bg-[#FFFBEB] px-3 py-2 text-xs text-[#78350F] dark:border-[#D9A13B]/35 dark:bg-[#231D10] dark:text-[#F6D693]"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{statusMessageTr}</span>
        </div>
      )}
    </div>
  );
};
