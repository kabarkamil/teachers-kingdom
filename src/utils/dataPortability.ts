import {
  A1_KARAOKE_IDS as KARAOKE_IDS,
  STARTER_A1_ASSIGNMENTS,
} from '../data/curriculumMeta';
import type {
  ActiveCourseId,
  ActivityLogEntry,
  ActivityMode,
  GermanA2ProgressState,
  ProgressState,
  SpeechSpeed,
  StudioChecklistItem,
  StudioDraft,
  StudioDraftKind,
  TeachingAssignment,
  TeachingAssignmentModule,
  TeachingAssignmentStatus,
  TeachingClassGroup,
  TeachingDeletionTombstones,
  TeachingRosterEntry,
  ThemeMode,
  UiLanguage,
  UserRole,
} from '../types';
import {
  STORAGE_KEY_A2_STATE,
  sanitizeA2ProgressState,
} from './a2DataPortability';

export const STORAGE_KEY_STATE = 'tk_stage1_progress_v1';
export const STORAGE_KEY_THEME = 'tk_stage1_theme';
export const STORAGE_KEY_PREFS = 'tk_stage1_prefs_v1';

export const TK_BACKUP_SCHEMA_ID = 'teachers-kingdom-backup';
export const TK_BACKUP_SCHEMA_VERSION = 1;

export interface LocalBackupPrefs {
  displayName: string;
  rolePreview: UserRole;
  speechSpeed: SpeechSpeed;
  theme?: ThemeMode;
  activeCourse?: ActiveCourseId;
  uiLanguage?: UiLanguage;
}

export interface TeachersKingdomBackupV1 {
  schema: typeof TK_BACKUP_SCHEMA_ID;
  schemaVersion: typeof TK_BACKUP_SCHEMA_VERSION;
  appDomain: 'teacherskingdom.net';
  storageKey: typeof STORAGE_KEY_STATE;
  course: 'de-A1';
  a2StorageKey?: typeof STORAGE_KEY_A2_STATE;
  exportedAt: string;
  prefs: LocalBackupPrefs;
  progress: ProgressState;
  a2Progress?: GermanA2ProgressState;
}

export interface ValidatedBackupPayload {
  sourceFormat: 'envelope-v1' | 'legacy-progress';
  exportedAt: string | null;
  progress: ProgressState;
  a2Progress: GermanA2ProgressState | null;
  prefs: Partial<LocalBackupPrefs> | null;
  warningsTr: string[];
}

export type BackupValidationResult =
  | { ok: true; data: ValidatedBackupPayload }
  | { ok: false; errorTr: string };

export interface StorageDiagnostics {
  available: boolean;
  progressBytes: number;
  a2ProgressBytes: number;
  prefsBytes: number;
  themeBytes: number;
  totalBytes: number;
  hasPersistedProgress: boolean;
  hasPersistedA2Progress: boolean;
}

export interface IntegrityReport {
  isHealthy: boolean;
  totalUniqueMasteredItems: number;
  issuesTr: string[];
}

const VALID_ACTIVITY_MODES = new Set<ActivityMode>([
  'flashcards',
  'articles',
  'quiz',
  'memory',
  'horen-tf',
  'horen-cloze',
  'horen-mc',
  'lesen-tf',
  'lesen-cloze',
  'lesen-mc',
  'schreiben-form',
  'schreiben-message',
  'schreiben-controlled',
  'sprechen-repeat',
  'sprechen-prompt',
  'sprechen-roleplay',
  'activity-karaoke',
  'activity-charades',
  'activity-arena',
  'activity-quiz',
  'activity-exam',
  'teaching-class',
  'teaching-assignment',
  'teaching-studio',
]);

const VALID_ASSIGNMENT_MODULES = new Set<TeachingAssignmentModule>([
  'kelime',
  'dinleme',
  'okuma',
  'yazma',
  'konusma',
  'karaoke',
  'sessiz-sinema',
  'arena',
  'quiz-merkezi',
  'sinav-modu',
]);

const VALID_ASSIGNMENT_STATUSES = new Set<TeachingAssignmentStatus>([
  'assigned',
  'completed',
  'reviewed',
]);

const VALID_DRAFT_KINDS = new Set<StudioDraftKind>(['lesson', 'quiz', 'homework']);

const KARAOKE_ID_SET = new Set<string>(KARAOKE_IDS);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clampNonNegInt(value: unknown, max = 1_000_000): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
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

function sanitizeRosterEntries(value: unknown): TeachingRosterEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: TeachingRosterEntry[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const name = sanitizeString(item.name, 60);
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      name,
      noteTr: sanitizeString(item.noteTr, 120),
      addedAt: sanitizeIsoDate(item.addedAt),
    });
    if (out.length >= 200) break;
  }
  return out;
}

function sanitizeOptionalCourseId(value: unknown): ActiveCourseId | undefined {
  if (value === 'de-A2') return 'de-A2';
  if (value === 'de-A1') return 'de-A1';
  return undefined;
}

export function createEmptyTeachingTombstones(): TeachingDeletionTombstones {
  return {
    classes: {},
    assignments: {},
    drafts: {},
  };
}

function parseMsSafe(iso: string | undefined): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
}

function maxTimestampIso(...candidates: Array<string | undefined>): string | undefined {
  let bestIso: string | undefined;
  let bestMs = -1;
  for (const iso of candidates) {
    if (!iso) continue;
    const ms = Date.parse(iso);
    if (!Number.isNaN(ms) && ms > bestMs) {
      bestMs = ms;
      bestIso = iso;
    }
  }
  return bestIso;
}

function sanitizeTombstoneBucket(value: unknown): Record<string, string> {
  if (!isPlainObject(value)) return {};
  const out: Record<string, string> = {};
  let count = 0;
  for (const [rawKey, rawVal] of Object.entries(value)) {
    if (count >= 500) break;
    const key = sanitizeString(rawKey, 80);
    if (!key || typeof rawVal !== 'string' || !rawVal.trim()) continue;
    const parsed = Date.parse(rawVal);
    if (Number.isNaN(parsed)) continue;
    out[key] = new Date(parsed).toISOString();
    count += 1;
  }
  return out;
}

export function sanitizeTeachingTombstones(value: unknown): TeachingDeletionTombstones {
  if (!isPlainObject(value)) return createEmptyTeachingTombstones();
  return {
    classes: sanitizeTombstoneBucket(value.classes),
    assignments: sanitizeTombstoneBucket(value.assignments),
    drafts: sanitizeTombstoneBucket(value.drafts),
  };
}

function mergeTombstoneBucket(
  a?: Record<string, string>,
  b?: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  const apply = (bucket?: Record<string, string>) => {
    if (!bucket) return;
    for (const [id, iso] of Object.entries(bucket)) {
      const incomingMs = parseMsSafe(iso);
      if (incomingMs <= 0) continue;
      const existingMs = parseMsSafe(out[id]);
      if (incomingMs > existingMs) {
        out[id] = new Date(incomingMs).toISOString();
      }
    }
  };
  apply(a);
  apply(b);
  return out;
}

export function mergeTeachingTombstones(
  a?: TeachingDeletionTombstones,
  b?: TeachingDeletionTombstones
): TeachingDeletionTombstones {
  return {
    classes: mergeTombstoneBucket(a?.classes, b?.classes),
    assignments: mergeTombstoneBucket(a?.assignments, b?.assignments),
    drafts: mergeTombstoneBucket(a?.drafts, b?.drafts),
  };
}

function isItemTombstoned(
  id: string,
  itemTimestampIso: string | undefined,
  bucket: Record<string, string>
): boolean {
  const deletedIso = bucket[id];
  if (!deletedIso) return false;
  const deletedMs = parseMsSafe(deletedIso);
  if (deletedMs <= 0) return false;
  const itemMs = parseMsSafe(itemTimestampIso);
  return deletedMs >= itemMs;
}

function sanitizeTeachingClasses(value: unknown): TeachingClassGroup[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: TeachingClassGroup[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const name = sanitizeString(item.name, 80);
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    const courseId = sanitizeOptionalCourseId(item.courseId);
    out.push({
      id,
      ...(courseId ? { courseId } : {}),
      name,
      levelLabel: sanitizeString(item.levelLabel, 24) || (courseId === 'de-A2' ? 'CEFR A2' : 'CEFR A1'),
      scheduleTr: sanitizeString(item.scheduleTr, 80),
      focusTopicTr: sanitizeString(item.focusTopicTr, 100),
      descriptionTr: sanitizeString(item.descriptionTr, 240),
      roster: sanitizeRosterEntries(item.roster),
      createdAt: sanitizeIsoDate(item.createdAt),
      ...(item.updatedAt ? { updatedAt: sanitizeIsoDate(item.updatedAt) } : {}),
    });
    if (out.length >= 100) break;
  }
  return out;
}

function sanitizeTeachingAssignments(
  value: unknown,
  fallbackToStarter: boolean
): TeachingAssignment[] {
  if (!Array.isArray(value)) {
    return fallbackToStarter ? STARTER_A1_ASSIGNMENTS : [];
  }
  const seen = new Set<string>();
  const out: TeachingAssignment[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const titleTr = sanitizeString(item.titleTr, 100);
    const moduleRoute = item.moduleRoute as TeachingAssignmentModule;
    if (!id || !titleTr || !VALID_ASSIGNMENT_MODULES.has(moduleRoute) || seen.has(id)) {
      continue;
    }
    seen.add(id);
    const rawStatus = item.status as TeachingAssignmentStatus;
    const status: TeachingAssignmentStatus = VALID_ASSIGNMENT_STATUSES.has(rawStatus)
      ? rawStatus
      : 'assigned';
    const courseId = sanitizeOptionalCourseId(item.courseId);
    out.push({
      id,
      ...(courseId ? { courseId } : {}),
      titleTr,
      moduleRoute,
      targetId: sanitizeString(item.targetId, 80) || undefined,
      targetLabelTr: sanitizeString(item.targetLabelTr, 100) || titleTr,
      classId: sanitizeString(item.classId, 80) || undefined,
      dueDateLabel: sanitizeString(item.dueDateLabel, 48) || undefined,
      instructionsTr: sanitizeString(item.instructionsTr, 320),
      status,
      completedAt: item.completedAt ? sanitizeIsoDate(item.completedAt) : undefined,
      reviewedAt: item.reviewedAt ? sanitizeIsoDate(item.reviewedAt) : undefined,
      reviewNoteTr: sanitizeString(item.reviewNoteTr, 240) || undefined,
      createdAt: sanitizeIsoDate(item.createdAt),
      ...(item.updatedAt ? { updatedAt: sanitizeIsoDate(item.updatedAt) } : {}),
      isStarter: Boolean(item.isStarter),
    });
    if (out.length >= 200) break;
  }
  return out;
}

function sanitizeStudioItems(value: unknown): StudioChecklistItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: StudioChecklistItem[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const textTr = sanitizeString(item.textTr, 180);
    if (!id || !textTr || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      textTr,
      sampleDe: sanitizeString(item.sampleDe, 220) || undefined,
      checked: Boolean(item.checked),
    });
    if (out.length >= 100) break;
  }
  return out;
}

function sanitizeStudioDrafts(value: unknown): StudioDraft[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: StudioDraft[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const titleTr = sanitizeString(item.titleTr, 100);
    const rawKind = item.kind as StudioDraftKind;
    const rawModule = item.moduleFocus as TeachingAssignmentModule;
    if (!id || !titleTr || seen.has(id)) continue;
    seen.add(id);
    const courseId = sanitizeOptionalCourseId(item.courseId);
    out.push({
      id,
      ...(courseId ? { courseId } : {}),
      titleTr,
      kind: VALID_DRAFT_KINDS.has(rawKind) ? rawKind : 'lesson',
      moduleFocus: VALID_ASSIGNMENT_MODULES.has(rawModule) ? rawModule : 'kelime',
      durationMinutes: Math.max(5, Math.min(180, clampNonNegInt(item.durationMinutes, 180) || 45)),
      notesTr: sanitizeString(item.notesTr, 400),
      items: sanitizeStudioItems(item.items),
      updatedAt: sanitizeIsoDate(item.updatedAt),
    });
    if (out.length >= 100) break;
  }
  return out;
}

function sanitizeRecentActivities(value: unknown): ActivityLogEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: ActivityLogEntry[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
    const id = sanitizeString(item.id, 80);
    const mode = item.mode as ActivityMode;
    const summaryTr = sanitizeString(item.summaryTr, 180);
    if (!id || !VALID_ACTIVITY_MODES.has(mode) || !summaryTr || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      timestamp: sanitizeIsoDate(item.timestamp),
      mode,
      topicId: sanitizeString(item.topicId, 80),
      summaryTr,
      xpEarned: clampNonNegInt(item.xpEarned, 500),
      isCorrect: typeof item.isCorrect === 'boolean' ? item.isCorrect : undefined,
    });
    if (out.length >= 20) break;
  }
  return out;
}

/**
 * Normalizes any raw ProgressState object (including older Stage 1-6 saves) into a
 * strictly valid, backward-compatible Stage 8 ProgressState without losing data.
 */
export function sanitizeProgressState(
  raw: Record<string, unknown>,
  fallbackStarterAssignments = true
): ProgressState {
  const articleAttempts = clampNonNegInt(raw.articleAttempts);
  const articleCorrect = Math.min(articleAttempts, clampNonNegInt(raw.articleCorrect));

  const quizAttempts = clampNonNegInt(raw.quizAttempts);
  const quizCorrect = Math.min(quizAttempts, clampNonNegInt(raw.quizCorrect));

  const listeningAttempts = clampNonNegInt(raw.listeningAttempts);
  const listeningCorrect = Math.min(listeningAttempts, clampNonNegInt(raw.listeningCorrect));

  const readingAttempts = clampNonNegInt(raw.readingAttempts);
  const readingCorrect = Math.min(readingAttempts, clampNonNegInt(raw.readingCorrect));

  const writingAttempts = clampNonNegInt(raw.writingAttempts);
  const writingCorrect = Math.min(writingAttempts, clampNonNegInt(raw.writingCorrect));

  const activityAttempts = clampNonNegInt(raw.activityAttempts);
  const activityCorrect = Math.min(activityAttempts, clampNonNegInt(raw.activityCorrect));

  const rawExamBest = raw.examBestScorePercent;
  const examBestScorePercent =
    typeof rawExamBest === 'number' && Number.isFinite(rawExamBest)
      ? Math.max(0, Math.min(100, Math.round(rawExamBest)))
      : null;

  const deletedTeachingIds = sanitizeTeachingTombstones(raw.deletedTeachingIds);

  const sanitizedClasses = sanitizeTeachingClasses(raw.teachingClasses).filter(
    (cls) =>
      !isItemTombstoned(
        cls.id,
        maxTimestampIso(cls.updatedAt, cls.createdAt),
        deletedTeachingIds.classes
      )
  );

  const sanitizedAssignments = sanitizeTeachingAssignments(
    raw.teachingAssignments,
    fallbackStarterAssignments
  )
    .filter(
      (a) =>
        !isItemTombstoned(
          a.id,
          maxTimestampIso(a.reviewedAt, a.completedAt, a.updatedAt, a.createdAt),
          deletedTeachingIds.assignments
        )
    )
    .map((a) =>
      a.classId && deletedTeachingIds.classes[a.classId] ? { ...a, classId: undefined } : a
    );

  const sanitizedDrafts = sanitizeStudioDrafts(raw.studioDrafts).filter(
    (draft) => !isItemTombstoned(draft.id, draft.updatedAt, deletedTeachingIds.drafts)
  );

  return {
    studiedFlashcards: uniqueSanitizedStrings(raw.studiedFlashcards),
    articleAttempts,
    articleCorrect,
    articleMasteredIds: uniqueSanitizedStrings(raw.articleMasteredIds),
    quizAttempts,
    quizCorrect,
    quizMasteredIds: uniqueSanitizedStrings(raw.quizMasteredIds),
    memoryGamesCompleted: clampNonNegInt(raw.memoryGamesCompleted),
    memoryPairsMatched: clampNonNegInt(raw.memoryPairsMatched),
    memoryAttempts: clampNonNegInt(raw.memoryAttempts),
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
    arenaBestStreak: clampNonNegInt(raw.arenaBestStreak),
    examCompletedCount: clampNonNegInt(raw.examCompletedCount),
    examBestScorePercent,
    teachingClasses: sanitizedClasses,
    teachingAssignments: sanitizedAssignments,
    studioDrafts: sanitizedDrafts,
    deletedTeachingIds,
    assignmentCompletedIds: uniqueSanitizedStrings(raw.assignmentCompletedIds),
    teachingMilestoneIds: uniqueSanitizedStrings(raw.teachingMilestoneIds),
    xp: clampNonNegInt(raw.xp, 10_000_000),
    recentActivities: sanitizeRecentActivities(raw.recentActivities),
  };
}

export function createBackupEnvelope(
  progress: ProgressState,
  prefs: LocalBackupPrefs,
  a2Progress?: GermanA2ProgressState
): TeachersKingdomBackupV1 {
  const base: TeachersKingdomBackupV1 = {
    schema: TK_BACKUP_SCHEMA_ID,
    schemaVersion: TK_BACKUP_SCHEMA_VERSION,
    appDomain: 'teacherskingdom.net',
    storageKey: STORAGE_KEY_STATE,
    course: 'de-A1',
    exportedAt: new Date().toISOString(),
    prefs: {
      displayName: sanitizeString(prefs.displayName, 48),
      rolePreview: prefs.rolePreview === 'teacher' ? 'teacher' : 'student',
      speechSpeed: prefs.speechSpeed === 'slow' ? 'slow' : 'normal',
      theme: prefs.theme === 'dark' ? 'dark' : 'light',
      activeCourse: prefs.activeCourse === 'de-A2' ? 'de-A2' : 'de-A1',
      uiLanguage: prefs.uiLanguage === 'en' ? 'en' : 'tr',
    },
    progress,
  };
  if (a2Progress) {
    base.a2StorageKey = STORAGE_KEY_A2_STATE;
    base.a2Progress = sanitizeA2ProgressState(a2Progress);
  }
  return base;
}

const LEGACY_PROGRESS_KEYS = [
  'studiedFlashcards',
  'articleMasteredIds',
  'quizMasteredIds',
  'listeningMasteredIds',
  'readingMasteredIds',
  'writingMasteredIds',
  'speakingMasteredIds',
  'activityMasteredIds',
  'recentActivities',
];

/**
 * Strictly validates an imported JSON string before any state mutation.
 * Rejects malformed JSON, wrong schemas, unsupported versions, and unrelated objects.
 */
export function parseAndValidateBackup(rawText: string): BackupValidationResult {
  const cleaned = rawText.replace(/^\uFEFF/, '').trim();
  if (!cleaned) {
    return { ok: false, errorTr: 'İçe aktarılacak JSON içeriği boş görünüyor.' };
  }
  if (cleaned.length > 2_000_000) {
    return {
      ok: false,
      errorTr: 'Dosya boyutu güvenlik sınırını (2 MB) aşıyor; geçerli bir yerel yedek değil.',
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return {
      ok: false,
      errorTr:
        'Geçersiz JSON biçimi. Lütfen Teachers Kingdom tarafından dışa aktarılan bozulmamış bir .json dosyası seçin.',
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      ok: false,
      errorTr: 'Yedek dosyası geçerli bir JSON nesnesi içermiyor.',
    };
  }

  const warningsTr: string[] = [];

  // Case 1: Official Teachers Kingdom Backup Envelope v1
  if ('schema' in parsed) {
    if (parsed.schema !== TK_BACKUP_SCHEMA_ID) {
      return {
        ok: false,
        errorTr: `Bilinmeyen yedek şeması ("${String(parsed.schema)}"). Yalnızca Teachers Kingdom yedekleri kabul edilir.`,
      };
    }

    if (typeof parsed.schemaVersion !== 'number' || !Number.isInteger(parsed.schemaVersion)) {
      return {
        ok: false,
        errorTr: 'Yedek şema sürümü geçersiz veya eksik.',
      };
    }

    if (parsed.schemaVersion > TK_BACKUP_SCHEMA_VERSION || parsed.schemaVersion < 1) {
      return {
        ok: false,
        errorTr: `Desteklenmeyen yedek şema sürümü (v${parsed.schemaVersion}). Bu sürüm v${TK_BACKUP_SCHEMA_VERSION} yedeğini destekler.`,
      };
    }

    if (!isPlainObject(parsed.progress)) {
      return {
        ok: false,
        errorTr: 'Yedek paketinde geçerli bir ilerleme (progress) nesnesi bulunamadı.',
      };
    }

    if (typeof parsed.progress.xp !== 'number' || !Number.isFinite(parsed.progress.xp) || parsed.progress.xp < 0) {
      return {
        ok: false,
        errorTr: 'Yedekteki XP alanı geçersiz veya bozuk; içe aktarma güvenlik nedeniyle iptal edildi.',
      };
    }

    const progress = sanitizeProgressState(parsed.progress, true);

    let a2Progress: GermanA2ProgressState | null = null;
    if ('a2Progress' in parsed && parsed.a2Progress !== undefined && parsed.a2Progress !== null) {
      if (!isPlainObject(parsed.a2Progress)) {
        return {
          ok: false,
          errorTr: 'Yedekteki Almanca A2 ilerleme alanı (a2Progress) geçersiz biçimde.',
        };
      }
      if (
        typeof parsed.a2Progress.xp !== 'number' ||
        !Number.isFinite(parsed.a2Progress.xp) ||
        parsed.a2Progress.xp < 0
      ) {
        return {
          ok: false,
          errorTr: 'Yedekteki Almanca A2 XP değeri geçersiz; içe aktarma güvenlik nedeniyle iptal edildi.',
        };
      }
      a2Progress = sanitizeA2ProgressState(parsed.a2Progress);
    }

    let prefs: Partial<LocalBackupPrefs> | null = null;
    if (isPlainObject(parsed.prefs)) {
      prefs = {
        displayName:
          typeof parsed.prefs.displayName === 'string'
            ? sanitizeString(parsed.prefs.displayName, 48)
            : undefined,
        rolePreview:
          parsed.prefs.rolePreview === 'teacher' || parsed.prefs.rolePreview === 'student'
            ? parsed.prefs.rolePreview
            : undefined,
        speechSpeed:
          parsed.prefs.speechSpeed === 'slow' || parsed.prefs.speechSpeed === 'normal'
            ? parsed.prefs.speechSpeed
            : undefined,
        theme:
          parsed.prefs.theme === 'dark' || parsed.prefs.theme === 'light'
            ? parsed.prefs.theme
            : undefined,
        activeCourse:
          parsed.prefs.activeCourse === 'de-A2' || parsed.prefs.activeCourse === 'de-A1'
            ? parsed.prefs.activeCourse
            : undefined,
        uiLanguage:
          parsed.prefs.uiLanguage === 'en' || parsed.prefs.uiLanguage === 'tr'
            ? parsed.prefs.uiLanguage
            : undefined,
      };
    }

    const exportedAt =
      typeof parsed.exportedAt === 'string' && !Number.isNaN(Date.parse(parsed.exportedAt))
        ? new Date(parsed.exportedAt).toISOString()
        : null;

    if (!Array.isArray(parsed.progress.teachingAssignments)) {
      warningsTr.push(
        'Bu yedek Aşama 7 öncesine ait görünüyor; eksik alanlar geriye dönük uyumlu varsayılanlarla tamamlandı.'
      );
    }

    return {
      ok: true,
      data: {
        sourceFormat: 'envelope-v1',
        exportedAt,
        progress,
        a2Progress,
        prefs,
        warningsTr,
      },
    };
  }

  // Case 2: Raw legacy tk_stage1_progress_v1 export (must have numeric xp + at least 2 recognized array keys)
  const recognizedArrayCount = LEGACY_PROGRESS_KEYS.filter((k) => Array.isArray(parsed[k])).length;
  if (
    typeof parsed.xp === 'number' &&
    Number.isFinite(parsed.xp) &&
    parsed.xp >= 0 &&
    recognizedArrayCount >= 2
  ) {
    warningsTr.push(
      'Ham tk_stage1_progress_v1 biçimi algılandı; eski sürüm alanları güvenli biçimde doğrulandı.'
    );
    return {
      ok: true,
      data: {
        sourceFormat: 'legacy-progress',
        exportedAt: null,
        progress: sanitizeProgressState(parsed, true),
        a2Progress: null,
        prefs: null,
        warningsTr,
      },
    };
  }

  return {
    ok: false,
    errorTr:
      'Bu JSON dosyası tanınan bir Teachers Kingdom yedeği değil. Yalnızca geçerli şemaya sahip yedek dosyaları içe aktarılabilir.',
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
 * Idempotent merge that preserves single-grant XP rules:
 * - Never double-counts XP when the same backup is merged repeatedly.
 * - Adds XP strictly for newly discovered unique mastered/completed IDs not already in `current`.
 * - Uses Math.max on aggregate attempt counters so re-importing the same file never inflates counters.
 */
export function mergeProgressSafely(
  current: ProgressState,
  incoming: ProgressState
): ProgressState {
  const currentFlashcards = new Set(current.studiedFlashcards);
  const newFlashcards = incoming.studiedFlashcards.filter((id) => !currentFlashcards.has(id));

  const currentListening = new Set(current.listeningMasteredIds);
  const newListening = incoming.listeningMasteredIds.filter((id) => !currentListening.has(id));

  const currentReading = new Set(current.readingMasteredIds);
  const newReading = incoming.readingMasteredIds.filter((id) => !currentReading.has(id));

  const currentWriting = new Set(current.writingMasteredIds);
  const newWriting = incoming.writingMasteredIds.filter((id) => !currentWriting.has(id));

  const currentSpeaking = new Set(current.speakingMasteredIds);
  const newSpeaking = incoming.speakingMasteredIds.filter((id) => !currentSpeaking.has(id));

  const currentActivities = new Set(current.activityMasteredIds);
  const newActivities = incoming.activityMasteredIds.filter((id) => !currentActivities.has(id));

  const currentAssignmentsDone = new Set(current.assignmentCompletedIds);
  const newAssignmentsDone = incoming.assignmentCompletedIds.filter(
    (id) => !currentAssignmentsDone.has(id)
  );

  const currentMilestones = new Set(current.teachingMilestoneIds);
  const newMilestones = incoming.teachingMilestoneIds.filter((id) => !currentMilestones.has(id));

  const currentArticles = new Set(current.articleMasteredIds);
  const newArticles = incoming.articleMasteredIds.filter((id) => !currentArticles.has(id));

  const currentQuizzes = new Set(current.quizMasteredIds);
  const newQuizzes = incoming.quizMasteredIds.filter((id) => !currentQuizzes.has(id));

  // Calculate strict single-grant delta XP solely for brand-new unique mastered IDs
  let deltaXp = 0;
  deltaXp += newFlashcards.length * 5;
  deltaXp += newArticles.length * 10;
  deltaXp += newQuizzes.length * 10;
  deltaXp += newListening.length * 10;
  deltaXp += newReading.length * 10;
  deltaXp += newWriting.length * 10;
  deltaXp += newSpeaking.length * 10;
  for (const actId of newActivities) {
    deltaXp += KARAOKE_ID_SET.has(actId) ? 15 : 10;
  }
  deltaXp += newAssignmentsDone.length * 15;
  for (const msId of newMilestones) {
    deltaXp += msId === 'teach-studio-draft-saved' ? 15 : 10;
  }

  // Merge tombstones first so deleted classes, assignments, and studio drafts never resurrect
  const mergedTombstones = mergeTeachingTombstones(
    current.deletedTeachingIds,
    incoming.deletedTeachingIds
  );

  // Merge classes by ID (preferring newer updatedAt/createdAt) and exclude tombstoned IDs
  const mergedClassesMap = new Map<string, TeachingClassGroup>();
  for (const cls of current.teachingClasses) {
    mergedClassesMap.set(cls.id, cls);
  }
  for (const inc of incoming.teachingClasses) {
    const existing = mergedClassesMap.get(inc.id);
    if (!existing) {
      mergedClassesMap.set(inc.id, inc);
    } else {
      const incMs = parseMsSafe(maxTimestampIso(inc.updatedAt, inc.createdAt));
      const curMs = parseMsSafe(maxTimestampIso(existing.updatedAt, existing.createdAt));
      if (incMs > curMs) {
        mergedClassesMap.set(inc.id, inc);
      }
    }
  }
  const mergedClasses = Array.from(mergedClassesMap.values()).filter(
    (cls) =>
      !isItemTombstoned(
        cls.id,
        maxTimestampIso(cls.updatedAt, cls.createdAt),
        mergedTombstones.classes
      )
  );

  // Merge assignments preserving completed/reviewed status if either copy has it, respecting tombstones
  const mergedAssignmentsMap = new Map<string, TeachingAssignment>();
  for (const a of current.teachingAssignments) {
    mergedAssignmentsMap.set(a.id, a);
  }
  const statusRank: Record<TeachingAssignmentStatus, number> = {
    assigned: 0,
    completed: 1,
    reviewed: 2,
  };
  for (const inc of incoming.teachingAssignments) {
    const existing = mergedAssignmentsMap.get(inc.id);
    if (!existing) {
      mergedAssignmentsMap.set(inc.id, inc);
    } else if (statusRank[inc.status] > statusRank[existing.status]) {
      mergedAssignmentsMap.set(inc.id, {
        ...existing,
        status: inc.status,
        completedAt: inc.completedAt ?? existing.completedAt,
        reviewedAt: inc.reviewedAt ?? existing.reviewedAt,
        reviewNoteTr: inc.reviewNoteTr ?? existing.reviewNoteTr,
        updatedAt: maxTimestampIso(inc.updatedAt, existing.updatedAt),
      });
    } else if (
      parseMsSafe(maxTimestampIso(inc.reviewedAt, inc.completedAt, inc.updatedAt, inc.createdAt)) >
      parseMsSafe(
        maxTimestampIso(existing.reviewedAt, existing.completedAt, existing.updatedAt, existing.createdAt)
      )
    ) {
      mergedAssignmentsMap.set(inc.id, inc);
    }
  }
  const mergedAssignments = Array.from(mergedAssignmentsMap.values())
    .filter(
      (a) =>
        !isItemTombstoned(
          a.id,
          maxTimestampIso(a.reviewedAt, a.completedAt, a.updatedAt, a.createdAt),
          mergedTombstones.assignments
        )
    )
    .map((a) =>
      a.classId && mergedTombstones.classes[a.classId] ? { ...a, classId: undefined } : a
    );

  // Merge studio drafts by ID (preferring newer updatedAt) and exclude tombstoned IDs
  const mergedDraftsMap = new Map<string, StudioDraft>();
  for (const draft of current.studioDrafts) {
    mergedDraftsMap.set(draft.id, draft);
  }
  for (const inc of incoming.studioDrafts) {
    const existing = mergedDraftsMap.get(inc.id);
    if (!existing || parseMsSafe(inc.updatedAt) > parseMsSafe(existing.updatedAt)) {
      mergedDraftsMap.set(inc.id, inc);
    }
  }
  const mergedDrafts = Array.from(mergedDraftsMap.values()).filter(
    (draft) => !isItemTombstoned(draft.id, draft.updatedAt, mergedTombstones.drafts)
  );

  const nextArticleAttempts = Math.max(current.articleAttempts, incoming.articleAttempts);
  const nextQuizAttempts = Math.max(current.quizAttempts, incoming.quizAttempts);
  const nextListeningAttempts = Math.max(current.listeningAttempts, incoming.listeningAttempts);
  const nextReadingAttempts = Math.max(current.readingAttempts, incoming.readingAttempts);
  const nextWritingAttempts = Math.max(current.writingAttempts, incoming.writingAttempts);
  const nextActivityAttempts = Math.max(current.activityAttempts, incoming.activityAttempts);

  const nextExamBest =
    current.examBestScorePercent === null
      ? incoming.examBestScorePercent
      : incoming.examBestScorePercent === null
      ? current.examBestScorePercent
      : Math.max(current.examBestScorePercent, incoming.examBestScorePercent);

  const mergedActivities = mergeById(current.recentActivities, incoming.recentActivities)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
    .slice(0, 20);

  // Never decrease XP; cap safely against double counting
  const nextXp = Math.max(current.xp, incoming.xp, current.xp + deltaXp);

  return {
    studiedFlashcards: unionStrings(current.studiedFlashcards, incoming.studiedFlashcards),
    articleAttempts: nextArticleAttempts,
    articleCorrect: Math.min(
      nextArticleAttempts,
      Math.max(current.articleCorrect, incoming.articleCorrect)
    ),
    articleMasteredIds: unionStrings(current.articleMasteredIds, incoming.articleMasteredIds),
    quizAttempts: nextQuizAttempts,
    quizCorrect: Math.min(nextQuizAttempts, Math.max(current.quizCorrect, incoming.quizCorrect)),
    quizMasteredIds: unionStrings(current.quizMasteredIds, incoming.quizMasteredIds),
    memoryGamesCompleted: Math.max(current.memoryGamesCompleted, incoming.memoryGamesCompleted),
    memoryPairsMatched: Math.max(current.memoryPairsMatched, incoming.memoryPairsMatched),
    memoryAttempts: Math.max(current.memoryAttempts, incoming.memoryAttempts),
    listeningAttempts: nextListeningAttempts,
    listeningCorrect: Math.min(
      nextListeningAttempts,
      Math.max(current.listeningCorrect, incoming.listeningCorrect)
    ),
    listeningMasteredIds: unionStrings(current.listeningMasteredIds, incoming.listeningMasteredIds),
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
    speakingAttempts: Math.max(current.speakingAttempts, incoming.speakingAttempts),
    speakingMasteredIds: unionStrings(current.speakingMasteredIds, incoming.speakingMasteredIds),
    activityAttempts: nextActivityAttempts,
    activityCorrect: Math.min(
      nextActivityAttempts,
      Math.max(current.activityCorrect, incoming.activityCorrect)
    ),
    activityMasteredIds: unionStrings(current.activityMasteredIds, incoming.activityMasteredIds),
    arenaBestStreak: Math.max(current.arenaBestStreak, incoming.arenaBestStreak),
    examCompletedCount: Math.max(current.examCompletedCount, incoming.examCompletedCount),
    examBestScorePercent: nextExamBest,
    teachingClasses: mergedClasses,
    teachingAssignments: mergedAssignments,
    studioDrafts: mergedDrafts,
    deletedTeachingIds: mergedTombstones,
    assignmentCompletedIds: unionStrings(
      current.assignmentCompletedIds,
      incoming.assignmentCompletedIds
    ),
    teachingMilestoneIds: unionStrings(
      current.teachingMilestoneIds,
      incoming.teachingMilestoneIds
    ),
    xp: nextXp,
    recentActivities: mergedActivities,
  };
}

function getUtf8ByteLength(str: string | null): number {
  if (!str) return 0;
  try {
    return new Blob([str]).size;
  } catch {
    return str.length;
  }
}

export function getLocalStorageDiagnostics(): StorageDiagnostics {
  if (typeof window === 'undefined') {
    return {
      available: false,
      progressBytes: 0,
      a2ProgressBytes: 0,
      prefsBytes: 0,
      themeBytes: 0,
      totalBytes: 0,
      hasPersistedProgress: false,
      hasPersistedA2Progress: false,
    };
  }

  try {
    const probeKey = '__tk_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);

    const rawProgress = window.localStorage.getItem(STORAGE_KEY_STATE);
    const rawA2Progress = window.localStorage.getItem(STORAGE_KEY_A2_STATE);
    const rawPrefs = window.localStorage.getItem(STORAGE_KEY_PREFS);
    const rawTheme = window.localStorage.getItem(STORAGE_KEY_THEME);

    const progressBytes = getUtf8ByteLength(rawProgress);
    const a2ProgressBytes = getUtf8ByteLength(rawA2Progress);
    const prefsBytes = getUtf8ByteLength(rawPrefs);
    const themeBytes = getUtf8ByteLength(rawTheme);

    return {
      available: true,
      progressBytes,
      a2ProgressBytes,
      prefsBytes,
      themeBytes,
      totalBytes: progressBytes + a2ProgressBytes + prefsBytes + themeBytes,
      hasPersistedProgress: Boolean(rawProgress),
      hasPersistedA2Progress: Boolean(rawA2Progress),
    };
  } catch {
    return {
      available: false,
      progressBytes: 0,
      a2ProgressBytes: 0,
      prefsBytes: 0,
      themeBytes: 0,
      totalBytes: 0,
      hasPersistedProgress: false,
      hasPersistedA2Progress: false,
    };
  }
}

export function formatBytesTr(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function evaluateProgressIntegrity(progress: ProgressState): IntegrityReport {
  const issuesTr: string[] = [];

  const arrayFields: Array<[string, string[]]> = [
    ['studiedFlashcards', progress.studiedFlashcards],
    ['articleMasteredIds', progress.articleMasteredIds],
    ['quizMasteredIds', progress.quizMasteredIds],
    ['listeningMasteredIds', progress.listeningMasteredIds],
    ['readingMasteredIds', progress.readingMasteredIds],
    ['writingMasteredIds', progress.writingMasteredIds],
    ['speakingMasteredIds', progress.speakingMasteredIds],
    ['activityMasteredIds', progress.activityMasteredIds],
    ['assignmentCompletedIds', progress.assignmentCompletedIds],
    ['teachingMilestoneIds', progress.teachingMilestoneIds],
  ];

  for (const [field, arr] of arrayFields) {
    if (new Set(arr).size !== arr.length) {
      issuesTr.push(`${field} alanında yinelenen kimlik algılandı.`);
    }
  }

  if (progress.articleCorrect > progress.articleAttempts) {
    issuesTr.push('Artikel doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.quizCorrect > progress.quizAttempts) {
    issuesTr.push('Anlam testi doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.listeningCorrect > progress.listeningAttempts) {
    issuesTr.push('Dinleme doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.readingCorrect > progress.readingAttempts) {
    issuesTr.push('Okuma doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.writingCorrect > progress.writingAttempts) {
    issuesTr.push('Yazma doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.activityCorrect > progress.activityAttempts) {
    issuesTr.push('Etkinlik doğru sayısı toplam deneme sayısından büyük.');
  }
  if (progress.xp < 0 || !Number.isFinite(progress.xp)) {
    issuesTr.push('XP değeri geçersiz.');
  }

  const uniqueVocabCount = new Set([
    ...progress.studiedFlashcards,
    ...progress.articleMasteredIds,
    ...progress.quizMasteredIds,
  ]).size;

  const totalUniqueMasteredItems =
    uniqueVocabCount +
    progress.listeningMasteredIds.length +
    progress.readingMasteredIds.length +
    progress.writingMasteredIds.length +
    progress.speakingMasteredIds.length +
    progress.activityMasteredIds.length +
    progress.assignmentCompletedIds.length;

  return {
    isHealthy: issuesTr.length === 0,
    totalUniqueMasteredItems,
    issuesTr,
  };
}

export function triggerJsonBackupDownload(
  progress: ProgressState,
  prefs: LocalBackupPrefs,
  a2Progress?: GermanA2ProgressState
): { filename: string; jsonText: string } {
  const envelope = createBackupEnvelope(progress, prefs, a2Progress);
  const jsonText = JSON.stringify(envelope, null, 2);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `teachers-kingdom-yedek-${dateStamp}.json`;

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return { filename, jsonText };
}
