/**
 * Optional local browser SpeechRecognition helper (de-DE).
 *
 * Honesty contract:
 * - Uses only the browser's built-in SpeechRecognition / webkitSpeechRecognition API when available.
 * - Never sends audio to a custom backend and never claims automatic pronunciation grading.
 * - Reports browser incompatibility, denied microphone permissions, or engine errors transparently.
 */

export type SpeechRecognitionStatus =
  | 'idle'
  | 'listening'
  | 'unsupported'
  | 'permission-denied'
  | 'error';

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: { finalText: string; interimText: string }) => void;
  onEnd?: () => void;
  onError?: (status: 'unsupported' | 'permission-denied' | 'error', messageTr: string) => void;
}

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionResultList {
  length: number;
  [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: BrowserSpeechRecognitionResultList;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: BrowserSpeechRecognitionCtor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
}

function getSpeechRecognitionCtor(): BrowserSpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const win = window as WindowWithSpeechRecognition;
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export interface SpeechRecognitionSession {
  stop: () => void;
  abort: () => void;
}

/**
 * Starts a local de-DE browser speech-to-text preview session.
 * Returns null if the browser does not support SpeechRecognition or startup fails.
 */
export function startGermanSpeechRecognition(
  callbacks: SpeechRecognitionCallbacks
): SpeechRecognitionSession | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) {
    callbacks.onError?.(
      'unsupported',
      'Bu tarayıcı yerel ses tanıma (SpeechRecognition) özelliğini desteklemiyor. Öz-değerlendirme kontrol listesiyle pratiğinize devam edebilirsiniz.'
    );
    return null;
  }

  try {
    const recognition = new Ctor();
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onstart = () => {
      callbacks.onStart?.();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result?.[0]?.transcript ?? '';
        if (result?.isFinal) {
          finalTranscript = `${finalTranscript} ${piece}`.trim();
        } else {
          interimTranscript = `${interimTranscript} ${piece}`.trim();
        }
      }
      callbacks.onResult?.({
        finalText: finalTranscript,
        interimText: interimTranscript,
      });
    };

    recognition.onerror = (event) => {
      const code = event.error;
      if (code === 'aborted') {
        return;
      }
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        callbacks.onError?.(
          'permission-denied',
          'Mikrofon izni verilmedi veya bu ortamda kısıtlandı. Tarayıcı izinlerini kontrol edebilir ya da mikrofon olmadan sesli tekrar yapabilirsiniz.'
        );
        return;
      }
      if (code === 'no-speech') {
        callbacks.onError?.(
          'error',
          'Konuşma algılanamadı. Mikrofonu yaklaştırıp tekrar deneyebilir veya öz-değerlendirme ile devam edebilirsiniz.'
        );
        return;
      }
      if (code === 'audio-capture') {
        callbacks.onError?.(
          'error',
          'Aktif bir mikrofon aygıtı bulunamadı. Mikrofon olmadan model cümleleri dinleyip tekrar edebilirsiniz.'
        );
        return;
      }
      if (code === 'network') {
        callbacks.onError?.(
          'error',
          'Tarayıcı ses tanıma servisine şu anda ulaşılamadı. Model seslendirmeleri dinleyip sesli tekrar yapabilirsiniz.'
        );
        return;
      }
      callbacks.onError?.(
        'error',
        'Tarayıcı ses tanıma başlatılamadı. Öz-değerlendirme adımlarıyla pratiğinizi tamamlayabilirsiniz.'
      );
    };

    recognition.onend = () => {
      callbacks.onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // Ignore stop race
        }
      },
      abort: () => {
        try {
          recognition.abort();
        } catch {
          // Ignore abort race
        }
      },
    };
  } catch {
    callbacks.onError?.(
      'error',
      'Tarayıcı mikrofon dinlemesi başlatılamadı. Öz-değerlendirme kontrol listesiyle pratiğe devam edebilirsiniz.'
    );
    return null;
  }
}
