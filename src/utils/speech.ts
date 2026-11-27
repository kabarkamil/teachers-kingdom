import type { SpeakerGender, SpeechSpeed } from '../types';

export interface SpeechResult {
  /** True only when the utterance was handed to speechSynthesis.speak(); actual audio start is confirmed via onStart. */
  queued: boolean;
  reason?: 'unsupported' | 'error';
}

export type SpeechFailureReason = 'unsupported' | 'timeout' | 'error';

export interface GermanVoiceInfo {
  supported: boolean;
  hasGermanVoice: boolean;
  germanVoiceCount: number;
  hasDistinctSpeakerVoices: boolean;
  voiceName: string | null;
  femaleVoiceName: string | null;
  maleVoiceName: string | null;
}

export interface SpeakerVoiceProfile {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
  rateMultiplier: number;
}

export interface DialogueVoicePlan {
  supported: boolean;
  germanVoiceCount: number;
  hasDistinctVoices: boolean;
  female: SpeakerVoiceProfile;
  male: SpeakerVoiceProfile;
  statusNoteTr: string;
}

const SPEECH_START_TIMEOUT_MS = 1800;

let activeSpeechSessionId = 0;
let activeStartWatchdog: number | null = null;

function clearActiveStartWatchdog(): void {
  if (activeStartWatchdog !== null && typeof window !== 'undefined') {
    window.clearTimeout(activeStartWatchdog);
    activeStartWatchdog = null;
  }
}

const FEMALE_VOICE_HINTS = [
  'anna',
  'petra',
  'helena',
  'katja',
  'hedda',
  'vicki',
  'amala',
  'gisela',
  'klarissa',
  'louisa',
  'maja',
  'marlene',
  'tanja',
  'sabine',
  'steffi',
  'katrin',
  'female',
  'frau',
  'google deutsch',
];

const MALE_VOICE_HINTS = [
  'markus',
  'martin',
  'stefan',
  'conrad',
  'florian',
  'kasper',
  'killian',
  'klaus',
  'ralf',
  'bernd',
  'hans',
  'yannick',
  'daniel',
  'viktor',
  'michael',
  'christoph',
  'male',
  'mann',
];

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Returns available German voices prioritizing exact de-DE voices first,
 * followed by regional German variants (de-AT, de-CH, de).
 */
export function getGermanVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  if (!voices.length) return [];
  const exactDeDe = voices.filter((v) => v.lang.toLowerCase() === 'de-de');
  const otherDe = voices.filter(
    (v) => v.lang.toLowerCase().startsWith('de') && v.lang.toLowerCase() !== 'de-de'
  );
  return [...exactDeDe, ...otherDe];
}

export function selectGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const germanVoices = getGermanVoices(voices);
  return germanVoices[0] ?? null;
}

function matchesGenderHints(voice: SpeechSynthesisVoice, hints: string[]): boolean {
  const normalized = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  return hints.some((hint) => normalized.includes(hint));
}

function isSameVoice(
  a: SpeechSynthesisVoice | null,
  b: SpeechSynthesisVoice | null
): boolean {
  if (!a || !b) return false;
  return a.voiceURI === b.voiceURI && a.name === b.name;
}

/**
 * Resolves distinct male and female de-DE voices for multi-speaker dialogues
 * when the browser exposes 2+ German voices, with subtle pitch/rate differentiation.
 * When only 1 German voice (or none) exists, reports it honestly without faking multi-voice output.
 */
export function resolveDialogueSpeakerVoices(
  providedVoices?: SpeechSynthesisVoice[]
): DialogueVoicePlan {
  if (!isSpeechSynthesisSupported()) {
    return {
      supported: false,
      germanVoiceCount: 0,
      hasDistinctVoices: false,
      female: { voice: null, pitch: 1, rateMultiplier: 1 },
      male: { voice: null, pitch: 1, rateMultiplier: 1 },
      statusNoteTr: 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor.',
    };
  }

  let voices: SpeechSynthesisVoice[] = [];
  try {
    voices = providedVoices ?? window.speechSynthesis.getVoices();
  } catch {
    voices = [];
  }

  const germanVoices = getGermanVoices(voices);

  if (germanVoices.length === 0) {
    return {
      supported: true,
      germanVoiceCount: 0,
      hasDistinctVoices: false,
      female: { voice: null, pitch: 1, rateMultiplier: 1 },
      male: { voice: null, pitch: 1, rateMultiplier: 1 },
      statusNoteTr:
        'Tarayıcıda özel de-DE sesi listelenmedi; sistem varsayılan sentezleyicisi denenir.',
    };
  }

  if (germanVoices.length === 1) {
    const onlyVoice = germanVoices[0];
    return {
      supported: true,
      germanVoiceCount: 1,
      hasDistinctVoices: false,
      female: { voice: onlyVoice, pitch: 1, rateMultiplier: 1 },
      male: { voice: onlyVoice, pitch: 1, rateMultiplier: 1 },
      statusNoteTr: `Tarayıcıda yalnızca 1 Almanca ses bulundu (${onlyVoice.name}); tüm konuşmacılar bu sesle okunur.`,
    };
  }

  // 2+ German voices exist: assign distinct female and male voices
  let femaleVoice =
    germanVoices.find((v) => matchesGenderHints(v, FEMALE_VOICE_HINTS)) ?? null;
  let maleVoice =
    germanVoices.find(
      (v) => matchesGenderHints(v, MALE_VOICE_HINTS) && !isSameVoice(v, femaleVoice)
    ) ?? null;

  if (!femaleVoice) {
    femaleVoice = germanVoices.find((v) => !isSameVoice(v, maleVoice)) ?? germanVoices[0];
  }
  if (!maleVoice) {
    maleVoice = germanVoices.find((v) => !isSameVoice(v, femaleVoice)) ?? germanVoices[1];
  }

  const hasDistinctVoices = !isSameVoice(femaleVoice, maleVoice);

  return {
    supported: true,
    germanVoiceCount: germanVoices.length,
    hasDistinctVoices,
    female: {
      voice: femaleVoice,
      pitch: hasDistinctVoices ? 1.05 : 1,
      rateMultiplier: hasDistinctVoices ? 1.01 : 1,
    },
    male: {
      voice: maleVoice,
      pitch: hasDistinctVoices ? 0.92 : 1,
      rateMultiplier: hasDistinctVoices ? 0.97 : 1,
    },
    statusNoteTr: hasDistinctVoices
      ? `Çift konuşmacı sesi aktif (${femaleVoice.name} · ${maleVoice.name})`
      : `Tarayıcıda tek Almanca ses profili aktif (${femaleVoice.name}).`,
  };
}

export function getSpeakerProfile(
  plan: DialogueVoicePlan,
  gender: SpeakerGender
): SpeakerVoiceProfile {
  return gender === 'female' ? plan.female : plan.male;
}

export function getGermanVoiceInfo(): GermanVoiceInfo {
  const plan = resolveDialogueSpeakerVoices();
  return {
    supported: plan.supported,
    hasGermanVoice: plan.germanVoiceCount > 0,
    germanVoiceCount: plan.germanVoiceCount,
    hasDistinctSpeakerVoices: plan.hasDistinctVoices,
    voiceName: plan.female.voice
      ? `${plan.female.voice.name} (${plan.female.voice.lang})`
      : null,
    femaleVoiceName: plan.female.voice ? plan.female.voice.name : null,
    maleVoiceName: plan.male.voice ? plan.male.voice.name : null,
  };
}

export function stopGermanSpeech(): void {
  activeSpeechSessionId += 1;
  clearActiveStartWatchdog();
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Graceful silent recovery
    }
  }
}

export function speakGermanText(
  text: string,
  speed: SpeechSpeed = 'normal',
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (reason?: SpeechFailureReason) => void;
  },
  explicitRate?: number,
  speakerGender?: SpeakerGender
): SpeechResult {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onError?.('unsupported');
    return { queued: false, reason: 'unsupported' };
  }

  try {
    activeSpeechSessionId += 1;
    const sessionId = activeSpeechSessionId;
    clearActiveStartWatchdog();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';

    const baseRate = explicitRate ?? (speed === 'slow' ? 0.72 : 0.94);

    if (speakerGender) {
      const plan = resolveDialogueSpeakerVoices();
      const profile = getSpeakerProfile(plan, speakerGender);
      if (profile.voice) {
        utterance.voice = profile.voice;
      }
      utterance.pitch = profile.pitch;
      utterance.rate = Math.min(1.2, Math.max(0.65, baseRate * profile.rateMultiplier));
    } else {
      const voices = window.speechSynthesis.getVoices();
      const germanVoice = selectGermanVoice(voices);
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      utterance.rate = baseRate;
      utterance.pitch = 1;
    }

    let startConfirmed = false;

    // Confirm real playback start strictly via onstart; fail honestly if TTS engine stalls
    activeStartWatchdog = window.setTimeout(() => {
      if (activeSpeechSessionId !== sessionId || startConfirmed) return;
      clearActiveStartWatchdog();
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel failures during timeout recovery
      }
      callbacks?.onError?.('timeout');
    }, SPEECH_START_TIMEOUT_MS);

    utterance.onstart = () => {
      if (activeSpeechSessionId !== sessionId) return;
      startConfirmed = true;
      clearActiveStartWatchdog();
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      if (activeSpeechSessionId !== sessionId) return;
      clearActiveStartWatchdog();
      callbacks?.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (activeSpeechSessionId !== sessionId) return;
      clearActiveStartWatchdog();
      if (event.error === 'canceled' || event.error === 'interrupted') {
        return;
      }
      callbacks?.onError?.('error');
    };

    window.speechSynthesis.speak(utterance);
    return { queued: true };
  } catch {
    clearActiveStartWatchdog();
    callbacks?.onError?.('error');
    return { queued: false, reason: 'error' };
  }
}
