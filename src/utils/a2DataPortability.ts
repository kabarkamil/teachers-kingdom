import { A2_KARAOKE_IDS_META as A2_KARAOKE_IDS } from '../data/curriculumMeta';
import type { A2ActivityLogEntry, A2ActivityMode, GermanA2ProgressState } from '../types';

export const STORAGE_KEY_A2_STATE = 'tk_course_de_a2_progress_v1';

const A2_KARAOKE_ID_SET = new Set<string>(A2_KARAOKE_IDS);

export const INITIAL_A2_PROGRESS: GermanA2ProgressState = {
  schemaVersion: 1,
  courseId: 'de-A2',
  studiedFlashcards: [],
  articlePluralAttempts: 0,
  articlePluralCorrect: 0,
  articlePluralMasteredIds: [],
  meaningAttempts: 0,
  meaningCorrect: 0,
  meaningMasteredIds: [],
  contextAttempts: 0,
  contextCorrect: 0,
  contextMasteredIds: [],
  listeningAttempts: 0,
  listeningCorrect: 0,
  listeningMasteredIds: [],
  readingAttempts: 0,
  readingCorrect: 0,
  readingMasteredIds: [],
  writingAttempts: 0,
  writingCorrect: 0,
  writingMasteredIds: [],
  speakingAttempts: 0,
  speakingMasteredIds: [],
  activityAttempts: 0,
  activityCorrect: 0,
  activityMasteredIds: [],
  a2ArenaBestStreak: 0,
  a2ExamBestScorePercent: null,
  a2ExamCompletedCount: 0,
  xp: 0,
  recentActivities: [],
};

const VALID_A2_ACTIVITY_MODES = new Set<A2ActivityMode>([
  'a2-flashcards',
  'a2-articles-plural',
  'a2-meaning',
  'a2-context',
  'a2-horen-tf',
  'a2-horen-cloze',
  'a2-horen-mc',
  'a2-lesen-tf',
  'a2-lesen-cloze',
  'a2-lesen-mc',
  'a2-schreiben-message',
  'a2-schreiben-controlled',
  'a2-sprechen-repeat',
  'a2-sprechen-prompt',
  'a2-sprechen-roleplay',
  'a2-activity-karaoke',
  'a2-activity-charades',
  'a2-activity-arena',
  'a2-activity-quiz',
  'a2-activity-exam',
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clampNonNegInt(value: unknown, max = 1_000_000): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
}

function sanitizeNullablePercent(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function uniqueSanitizedStrings(value: unknown, maxItems = 2000, maxLen = 120): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const clean = item.trim().slice(0, maxLen);
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
    if (out.length >= maxItems) break;
  }
  return out;
}

function sanitizeIsoDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }
  return new Date().toISOString();
}

function sanitizeA2RecentActivities(value: unknown): A2ActivityLogEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: A2ActivityLogEntry[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const mode = item.mode as A2ActivityMode;
    const summaryTr = sanitizeString(item.summaryTr, 180);
    if (!id || !summaryTr || !VALID_A2_ACTIVITY_MODES.has(mode) || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      timestamp: sanitizeIsoDate(item.timestamp),
      mode,
      unitId: sanitizeString(item.unitId, 80) || 'a2-arbeit-alltag',
      summaryTr,
      xpEarned: clampNonNegInt(item.xpEarned, 200),
      isCorrect: typeof item.isCorrect === 'boolean' ? item.isCorrect : undefined,
    });
    if (out.length >= 20) break;
  }
  return out;
}

/**
 * Pure backward-compatible normalizer for `tk_course_de_a2_progress_v1`.
 * Guarantees deduplicated mastery arrays, valid score bounds, and correct <= attempts invariants
 * across German A2 Stages 1–6.
 */
export function sanitizeA2ProgressState(raw: unknown): GermanA2ProgressState {
  if (!isPlainObject(raw)) {
    return { ...INITIAL_A2_PROGRESS };
  }

  const articlePluralAttempts = clampNonNegInt(raw.articlePluralAttempts);
  const articlePluralCorrect = Math.min(
    articlePluralAttempts,
    clampNonNegInt(raw.articlePluralCorrect)
  );
  const meaningAttempts = clampNonNegInt(raw.meaningAttempts);
  const meaningCorrect = Math.min(meaningAttempts, clampNonNegInt(raw.meaningCorrect));
  const contextAttempts = clampNonNegInt(raw.contextAttempts);
  const contextCorrect = Math.min(contextAttempts, clampNonNegInt(raw.contextCorrect));
  const listeningAttempts = clampNonNegInt(raw.listeningAttempts);
  const listeningCorrect = Math.min(listeningAttempts, clampNonNegInt(raw.listeningCorrect));
  const readingAttempts = clampNonNegInt(raw.readingAttempts);
  const readingCorrect = Math.min(readingAttempts, clampNonNegInt(raw.readingCorrect));
  const writingAttempts = clampNonNegInt(raw.writingAttempts);
  const writingCorrect = Math.min(writingAttempts, clampNonNegInt(raw.writingCorrect));
  const activityAttempts = clampNonNegInt(raw.activityAttempts);
  const activityCorrect = Math.min(activityAttempts, clampNonNegInt(raw.activityCorrect));

  return {
    schemaVersion: 1,
    courseId: 'de-A2',
    studiedFlashcards: uniqueSanitizedStrings(raw.studiedFlashcards),
    articlePluralAttempts,
    articlePluralCorrect,
    articlePluralMasteredIds: uniqueSanitizedStrings(raw.articlePluralMasteredIds),
    meaningAttempts,
    meaningCorrect,
    meaningMasteredIds: uniqueSanitizedStrings(raw.meaningMasteredIds),
    contextAttempts,
    contextCorrect,
    contextMasteredIds: uniqueSanitizedStrings(raw.contextMasteredIds),
    listeningAttempts,
    listeningCorrect,
    listeningMasteredIds: uniqueSanitizedStrings(raw.listeningMasteredIds),
    readingAttempts,
    readingCorrect,
    readingMasteredIds: uniqueSanitizedStrings(raw.readingMasteredIds),
    writingAttempts,
    writingCorrect,
    writingMasteredIds: uniqueSanitizedStrings(raw.writingMasteredIds),
    speakingAttempts: clampNonNegInt(raw.speakingAttempts),
    speakingMasteredIds: uniqueSanitizedStrings(raw.speakingMasteredIds),
    activityAttempts,
    activityCorrect,
    activityMasteredIds: uniqueSanitizedStrings(raw.activityMasteredIds),
    a2ArenaBestStreak: clampNonNegInt(raw.a2ArenaBestStreak, 10_000),
    a2ExamBestScorePercent: sanitizeNullablePercent(raw.a2ExamBestScorePercent),
    a2ExamCompletedCount: clampNonNegInt(raw.a2ExamCompletedCount, 10_000),
    xp: clampNonNegInt(raw.xp),
    recentActivities: sanitizeA2RecentActivities(raw.recentActivities),
  };
}

function unionStrings(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const seen = new Set(current.map((item) => item.id));
  const additions = incoming.filter((item) => !seen.has(item.id));
  return [...current, ...additions];
}

/**
 * Idempotent merge for German A2 progress preserving strict single-grant XP rules:
 * - +5 XP per brand-new unique flashcard
 * - +10 XP per brand-new unique mastery in vocab, listening, reading, writing, speaking, charades, arena, quiz, exam
 * - +15 XP per brand-new unique A2 karaoke track
 * Re-merging the same backup adds 0 XP.
 */
export function mergeA2ProgressSafely(
  current: GermanA2ProgressState,
  incoming: GermanA2ProgressState
): GermanA2ProgressState {
  const currFlash = new Set(current.studiedFlashcards);
  const newFlash = incoming.studiedFlashcards.filter((id) => !currFlash.has(id));

  const currArt = new Set(current.articlePluralMasteredIds);
  const newArt = incoming.articlePluralMasteredIds.filter((id) => !currArt.has(id));

  const currMean = new Set(current.meaningMasteredIds);
  const newMean = incoming.meaningMasteredIds.filter((id) => !currMean.has(id));

  const currCtx = new Set(current.contextMasteredIds);
  const newCtx = incoming.contextMasteredIds.filter((id) => !currCtx.has(id));

  const currListening = new Set(current.listeningMasteredIds);
  const newListening = incoming.listeningMasteredIds.filter((id) => !currListening.has(id));

  const currReading = new Set(current.readingMasteredIds);
  const newReading = incoming.readingMasteredIds.filter((id) => !currReading.has(id));

  const currWriting = new Set(current.writingMasteredIds);
  const newWriting = incoming.writingMasteredIds.filter((id) => !currWriting.has(id));

  const currSpeaking = new Set(current.speakingMasteredIds);
  const newSpeaking = incoming.speakingMasteredIds.filter((id) => !currSpeaking.has(id));

  const currActivities = new Set(current.activityMasteredIds);
  const newActivities = incoming.activityMasteredIds.filter((id) => !currActivities.has(id));

  let activityDeltaXp = 0;
  for (const actId of newActivities) {
    activityDeltaXp += A2_KARAOKE_ID_SET.has(actId) ? 15 : 10;
  }

  const deltaXp =
    newFlash.length * 5 +
    newArt.length * 10 +
    newMean.length * 10 +
    newCtx.length * 10 +
    newListening.length * 10 +
    newReading.length * 10 +
    newWriting.length * 10 +
    newSpeaking.length * 10 +
    activityDeltaXp;

  const nextArticlePluralAttempts = Math.max(
    current.articlePluralAttempts,
    incoming.articlePluralAttempts
  );
  const nextMeaningAttempts = Math.max(current.meaningAttempts, incoming.meaningAttempts);
  const nextContextAttempts = Math.max(current.contextAttempts, incoming.contextAttempts);
  const nextListeningAttempts = Math.max(current.listeningAttempts, incoming.listeningAttempts);
  const nextReadingAttempts = Math.max(current.readingAttempts, incoming.readingAttempts);
  const nextWritingAttempts = Math.max(current.writingAttempts, incoming.writingAttempts);
  const nextSpeakingAttempts = Math.max(current.speakingAttempts, incoming.speakingAttempts);
  const nextActivityAttempts = Math.max(current.activityAttempts, incoming.activityAttempts);

  const nextBestExamScore =
    current.a2ExamBestScorePercent === null
      ? incoming.a2ExamBestScorePercent
      : incoming.a2ExamBestScorePercent === null
      ? current.a2ExamBestScorePercent
      : Math.max(current.a2ExamBestScorePercent, incoming.a2ExamBestScorePercent);

  const mergedActivities = mergeById(current.recentActivities, incoming.recentActivities)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, 20);

  return {
    schemaVersion: 1,
    courseId: 'de-A2',
    studiedFlashcards: unionStrings(current.studiedFlashcards, incoming.studiedFlashcards),
    articlePluralAttempts: nextArticlePluralAttempts,
    articlePluralCorrect: Math.min(
      nextArticlePluralAttempts,
      Math.max(current.articlePluralCorrect, incoming.articlePluralCorrect)
    ),
    articlePluralMasteredIds: unionStrings(
      current.articlePluralMasteredIds,
      incoming.articlePluralMasteredIds
    ),
    meaningAttempts: nextMeaningAttempts,
    meaningCorrect: Math.min(
      nextMeaningAttempts,
      Math.max(current.meaningCorrect, incoming.meaningCorrect)
    ),
    meaningMasteredIds: unionStrings(current.meaningMasteredIds, incoming.meaningMasteredIds),
    contextAttempts: nextContextAttempts,
    contextCorrect: Math.min(
      nextContextAttempts,
      Math.max(current.contextCorrect, incoming.contextCorrect)
    ),
    contextMasteredIds: unionStrings(current.contextMasteredIds, incoming.contextMasteredIds),
    listeningAttempts: nextListeningAttempts,
    listeningCorrect: Math.min(
      nextListeningAttempts,
      Math.max(current.listeningCorrect, incoming.listeningCorrect)
    ),
    listeningMasteredIds: unionStrings(
      current.listeningMasteredIds,
      incoming.listeningMasteredIds
    ),
    readingAttempts: nextReadingAttempts,
    readingCorrect: Math.min(
      nextReadingAttempts,
      Math.max(current.readingCorrect, incoming.readingCorrect)
    ),
    readingMasteredIds: unionStrings(current.readingMasteredIds, incoming.readingMasteredIds),
    writingAttempts: nextWritingAttempts,
    writingCorrect: Math.min(
      nextWritingAttempts,
      Math.max(current.writingCorrect, incoming.writingCorrect)
    ),
    writingMasteredIds: unionStrings(current.writingMasteredIds, incoming.writingMasteredIds),
    speakingAttempts: nextSpeakingAttempts,
    speakingMasteredIds: unionStrings(current.speakingMasteredIds, incoming.speakingMasteredIds),
    activityAttempts: nextActivityAttempts,
    activityCorrect: Math.min(
      nextActivityAttempts,
      Math.max(current.activityCorrect, incoming.activityCorrect)
    ),
    activityMasteredIds: unionStrings(current.activityMasteredIds, incoming.activityMasteredIds),
    a2ArenaBestStreak: Math.max(current.a2ArenaBestStreak, incoming.a2ArenaBestStreak),
    a2ExamBestScorePercent: nextBestExamScore,
    a2ExamCompletedCount: Math.max(current.a2ExamCompletedCount, incoming.a2ExamCompletedCount),
    xp: Math.max(current.xp, incoming.xp, current.xp + deltaXp),
    recentActivities: mergedActivities,
  };
}

export interface A2ProgressLoadOutcome {
  progress: GermanA2ProgressState;
  warningTr: string | null;
}

export function loadA2ProgressFromStorage(): A2ProgressLoadOutcome {
  if (typeof window === 'undefined') {
    return { progress: { ...INITIAL_A2_PROGRESS }, warningTr: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_A2_STATE);
    if (!raw) {
      return { progress: { ...INITIAL_A2_PROGRESS }, warningTr: null };
    }
    const parsed = JSON.parse(raw) as unknown;
    return { progress: sanitizeA2ProgressState(parsed), warningTr: null };
  } catch {
    return {
      progress: { ...INITIAL_A2_PROGRESS },
      warningTr:
        'Almanca A2 yerel ilerleme kaydı (tk_course_de_a2_progress_v1) okunamadı; güvenli başlangıç durumuna geçildi.',
    };
  }
}

export function saveA2ProgressToStorage(
  progress: GermanA2ProgressState
): { ok: boolean; errorTr?: string } {
  if (typeof window === 'undefined') {
    return { ok: false, errorTr: 'Yerel depolama kullanılamıyor.' };
  }
  try {
    window.localStorage.setItem(STORAGE_KEY_A2_STATE, JSON.stringify(progress));
    return { ok: true };
  } catch {
    return {
      ok: false,
      errorTr:
        'Almanca A2 ilerlemesi yerel depolamaya yazılamadı (depolama kotası veya gizli mod kısıtlı olabilir).',
    };
  }
}

export function clearA2ProgressFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_A2_STATE);
  } catch {
    // Ignore storage errors
  }
}

export function getUniqueA2CompletedWordIds(progress: GermanA2ProgressState): string[] {
  return Array.from(
    new Set([
      ...progress.studiedFlashcards,
      ...progress.articlePluralMasteredIds,
      ...progress.meaningMasteredIds,
      ...progress.contextMasteredIds,
    ])
  );
}

export function evaluateA2ProgressIntegrity(progress: GermanA2ProgressState): {
  isHealthy: boolean;
  totalUniqueMasteredWords: number;
  totalUniqueListeningItems: number;
  totalUniqueReadingItems: number;
  totalUniqueWritingTasks: number;
  totalUniqueSpeakingTasks: number;
  totalUniqueActivityItems: number;
  issuesTr: string[];
} {
  const issuesTr: string[] = [];
  const arrayFields: Array<[string, string[]]> = [
    ['studiedFlashcards', progress.studiedFlashcards],
    ['articlePluralMasteredIds', progress.articlePluralMasteredIds],
    ['meaningMasteredIds', progress.meaningMasteredIds],
    ['contextMasteredIds', progress.contextMasteredIds],
    ['listeningMasteredIds', progress.listeningMasteredIds],
    ['readingMasteredIds', progress.readingMasteredIds],
    ['writingMasteredIds', progress.writingMasteredIds],
    ['speakingMasteredIds', progress.speakingMasteredIds],
    ['activityMasteredIds', progress.activityMasteredIds],
  ];
  for (const [name, arr] of arrayFields) {
    if (new Set(arr).size !== arr.length) {
      issuesTr.push(`A2 ${name} alanında yinelenen kimlik algılandı.`);
    }
  }
  if (progress.articlePluralCorrect > progress.articlePluralAttempts) {
    issuesTr.push('A2 artikel & çoğul doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.meaningCorrect > progress.meaningAttempts) {
    issuesTr.push('A2 anlam testi doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.contextCorrect > progress.contextAttempts) {
    issuesTr.push('A2 cümle içi kullanım doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.listeningCorrect > progress.listeningAttempts) {
    issuesTr.push('A2 dinleme doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.readingCorrect > progress.readingAttempts) {
    issuesTr.push('A2 okuma doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.writingCorrect > progress.writingAttempts) {
    issuesTr.push('A2 yazma doğru sayısı deneme sayısını aşıyor.');
  }
  if (progress.activityCorrect > progress.activityAttempts) {
    issuesTr.push('A2 etkinlik/sınav doğru sayısı deneme sayısını aşıyor.');
  }
  if (
    progress.a2ExamBestScorePercent !== null &&
    (progress.a2ExamBestScorePercent < 0 || progress.a2ExamBestScorePercent > 100)
  ) {
    issuesTr.push('A2 en yüksek sınav skoru geçerli yüzde aralığı (0–100) dışında.');
  }
  if (progress.xp < 0 || !Number.isFinite(progress.xp)) {
    issuesTr.push('A2 XP değeri geçersiz.');
  }
  return {
    isHealthy: issuesTr.length === 0,
    totalUniqueMasteredWords: getUniqueA2CompletedWordIds(progress).length,
    totalUniqueListeningItems: progress.listeningMasteredIds.length,
    totalUniqueReadingItems: progress.readingMasteredIds.length,
    totalUniqueWritingTasks: progress.writingMasteredIds.length,
    totalUniqueSpeakingTasks: progress.speakingMasteredIds.length,
    totalUniqueActivityItems: progress.activityMasteredIds.length,
    issuesTr,
  };
}
