import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  A2ActivityLogEntry,
  A2ActivityMode,
  A2WritingTaskKind,
  ActiveCourseId,
  ActivityLogEntry,
  ActivityMode,
  ActivitySubKind,
  CloudSyncStatus,
  CloudUserSession,
  GermanA2ProgressState,
  ListeningExerciseKind,
  ProgressState,
  ReadingExerciseKind,
  SpeakingTaskKind,
  SpeechSpeed,
  StudioDraft,
  StudioDraftKind,
  TeachingAssignment,
  TeachingAssignmentModule,
  TeachingAssignmentStatus,
  TeachingClassGroup,
  ThemeMode,
  UiLanguage,
  UserRole,
  WritingTaskKind,
} from '../types';
import { STARTER_A1_ASSIGNMENTS } from '../data/germanA1Teaching';
import type { LocalUserPrefs, ProgressLoadOutcome } from '../services/contracts';
import { DEFAULT_LOCAL_PREFS, platformServices } from '../services/localAdapters';
import {
  clearSyncMeta,
  getCurrentCloudSession,
  isBrowserOnline,
  isCloudConfigured,
  pullCloudState,
  pushCloudState,
  readSyncMeta,
  reconcileCloudAndLocal,
  signInCloudWithEmail,
  signOutCloud,
  signUpCloudWithEmail,
  subscribeCloudAuth,
  writeSyncMeta,
  type CloudAuthResult,
  type CloudStateSnapshot,
} from '../services/cloudSyncService';
import {
  INITIAL_A2_PROGRESS,
  clearA2ProgressFromStorage,
  getUniqueA2CompletedWordIds,
  loadA2ProgressFromStorage,
  mergeA2ProgressSafely,
  saveA2ProgressToStorage,
  type A2ProgressLoadOutcome,
} from '../utils/a2DataPortability';
import {
  TK_BACKUP_SCHEMA_VERSION,
  type ValidatedBackupPayload,
} from '../utils/dataPortability';

const INITIAL_PROGRESS: ProgressState = {
  studiedFlashcards: [],
  articleAttempts: 0,
  articleCorrect: 0,
  articleMasteredIds: [],
  quizAttempts: 0,
  quizCorrect: 0,
  quizMasteredIds: [],
  memoryGamesCompleted: 0,
  memoryPairsMatched: 0,
  memoryAttempts: 0,
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
  arenaBestStreak: 0,
  examCompletedCount: 0,
  examBestScorePercent: null,
  teachingClasses: [],
  teachingAssignments: STARTER_A1_ASSIGNMENTS,
  studioDrafts: [],
  assignmentCompletedIds: [],
  teachingMilestoneIds: [],
  xp: 0,
  recentActivities: [],
};

function readInitialTheme(): ThemeMode {
  return platformServices.auth.readTheme();
}

function readInitialPrefs(): LocalUserPrefs {
  return platformServices.auth.readPrefs();
}

function readInitialProgressWithDiagnostics(): ProgressLoadOutcome {
  return platformServices.progressSync.loadProgress(INITIAL_PROGRESS);
}

function createActivity(
  mode: ActivityMode,
  topicId: string,
  summaryTr: string,
  xpEarned: number,
  isCorrect?: boolean
): ActivityLogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    mode,
    topicId,
    summaryTr,
    xpEarned,
    isCorrect,
  };
}

function createA2Activity(
  mode: A2ActivityMode,
  unitId: string,
  summaryTr: string,
  xpEarned: number,
  isCorrect?: boolean
): A2ActivityLogEntry {
  return {
    id: `a2-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    mode,
    unitId,
    summaryTr,
    xpEarned,
    isCorrect,
  };
}

export interface CreateTeachingClassInput {
  courseId?: ActiveCourseId;
  name: string;
  levelLabel: string;
  scheduleTr: string;
  focusTopicTr: string;
  descriptionTr: string;
}

export interface CreateTeachingAssignmentInput {
  courseId?: ActiveCourseId;
  titleTr: string;
  moduleRoute: TeachingAssignmentModule;
  targetId?: string;
  targetLabelTr: string;
  classId?: string;
  dueDateLabel?: string;
  instructionsTr: string;
}

export interface SaveStudioDraftInput {
  id?: string;
  courseId?: ActiveCourseId;
  titleTr: string;
  kind: StudioDraftKind;
  moduleFocus: TeachingAssignmentModule;
  durationMinutes: number;
  notesTr: string;
  items: Array<{ id?: string; textTr: string; sampleDe?: string; checked?: boolean }>;
}

interface AppStateContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  rolePreview: UserRole;
  setRolePreview: (role: UserRole) => void;
  speechSpeed: SpeechSpeed;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  displayName: string;
  setDisplayName: (name: string) => void;
  activeCourse: ActiveCourseId;
  setActiveCourse: (course: ActiveCourseId) => void;
  uiLanguage: UiLanguage;
  setUiLanguage: (lang: UiLanguage) => void;
  toggleUiLanguage: () => void;
  progress: ProgressState;
  a2Progress: GermanA2ProgressState;
  uniqueCompletedWordIds: string[];
  uniqueA2CompletedWordIds: string[];
  overallAccuracyPercent: number | null;
  vocabAccuracyPercent: number | null;
  a2VocabAccuracyPercent: number | null;
  a2ListeningAccuracyPercent: number | null;
  a2ReadingAccuracyPercent: number | null;
  a2WritingAccuracyPercent: number | null;
  a2ActivityAccuracyPercent: number | null;
  a2OverallAccuracyPercent: number | null;
  listeningAccuracyPercent: number | null;
  readingAccuracyPercent: number | null;
  writingAccuracyPercent: number | null;
  activityAccuracyPercent: number | null;
  recordFlashcardStudied: (wordId: string, topicId: string, label: string) => boolean;
  recordArticleAnswer: (wordId: string, topicId: string, label: string, isCorrect: boolean) => number;
  recordQuizAnswer: (wordId: string, topicId: string, label: string, isCorrect: boolean) => number;
  recordMemoryRoundComplete: (topicId: string, topicTitle: string, pairs: number, moves: number) => void;
  recordA2FlashcardStudied: (wordId: string, unitId: string, label: string) => boolean;
  recordA2ArticlePluralAnswer: (
    wordId: string,
    unitId: string,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2MeaningAnswer: (
    wordId: string,
    unitId: string,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2ContextAnswer: (
    wordId: string,
    unitId: string,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2ListeningAnswer: (
    exerciseId: string,
    scenarioId: string,
    kind: ListeningExerciseKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2ReadingAnswer: (
    exerciseId: string,
    scenarioId: string,
    kind: ReadingExerciseKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2WritingAnswer: (
    taskId: string,
    scenarioId: string,
    kind: A2WritingTaskKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordA2SpeakingCompletion: (
    taskId: string,
    scenarioId: string,
    kind: SpeakingTaskKind,
    label: string
  ) => number;
  recordA2KaraokeCompletion: (trackId: string, label: string) => number;
  recordA2ActivityAnswer: (
    itemId: string,
    kind: Exclude<ActivitySubKind, 'karaoke'>,
    label: string,
    isCorrect: boolean,
    streakAfterAnswer?: number,
    countsTowardAccuracy?: boolean
  ) => number;
  recordA2ExamSubmission: (
    results: Array<{ itemId: string; isCorrect: boolean }>,
    scorePercent: number
  ) => number;
  recordListeningAnswer: (
    exerciseId: string,
    scenarioId: string,
    kind: ListeningExerciseKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordReadingAnswer: (
    exerciseId: string,
    scenarioId: string,
    kind: ReadingExerciseKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordWritingAnswer: (
    taskId: string,
    scenarioId: string,
    kind: WritingTaskKind,
    label: string,
    isCorrect: boolean
  ) => number;
  recordSpeakingCompletion: (
    taskId: string,
    scenarioId: string,
    kind: SpeakingTaskKind,
    label: string
  ) => number;
  recordKaraokeCompletion: (trackId: string, label: string) => number;
  recordActivityAnswer: (
    itemId: string,
    kind: Exclude<ActivitySubKind, 'karaoke'>,
    label: string,
    isCorrect: boolean,
    streakAfterAnswer?: number,
    countsTowardAccuracy?: boolean
  ) => number;
  recordExamSubmission: (
    results: Array<{ itemId: string; isCorrect: boolean }>,
    scorePercent: number
  ) => number;
  createTeachingClass: (input: CreateTeachingClassInput) => { id: string; xpAwarded: number };
  deleteTeachingClass: (classId: string) => void;
  addClassRosterEntry: (classId: string, name: string, noteTr: string) => void;
  removeClassRosterEntry: (classId: string, entryId: string) => void;
  createTeachingAssignment: (
    input: CreateTeachingAssignmentInput
  ) => { id: string; xpAwarded: number };
  toggleAssignmentCompleted: (
    assignmentId: string
  ) => { status: TeachingAssignmentStatus; xpAwarded: number };
  updateAssignmentReview: (
    assignmentId: string,
    reviewed: boolean,
    reviewNoteTr: string
  ) => void;
  deleteTeachingAssignment: (assignmentId: string) => void;
  saveStudioDraft: (input: SaveStudioDraftInput) => { id: string; xpAwarded: number };
  deleteStudioDraft: (draftId: string) => void;
  toggleStudioDraftItem: (draftId: string, itemId: string) => void;
  importLocalData: (
    payload: ValidatedBackupPayload,
    mode: 'replace' | 'merge'
  ) => {
    xpBefore: number;
    xpAfter: number;
    a2XpBefore: number;
    a2XpAfter: number;
    mode: 'replace' | 'merge';
  };
  lastSavedAt: string | null;
  storageWarning: string | null;
  dismissStorageWarning: () => void;
  cloudConfigured: boolean;
  cloudUser: CloudUserSession | null;
  cloudSyncStatus: CloudSyncStatus;
  lastCloudSyncAt: string | null;
  cloudSyncError: string | null;
  cloudSignIn: (email: string, password: string) => Promise<CloudAuthResult>;
  cloudSignUp: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<CloudAuthResult>;
  cloudSignOut: () => Promise<void>;
  syncCloudNow: () => Promise<{ ok: boolean; summaryTr: string; summaryEn: string }>;
  pullFromCloud: () => Promise<{ ok: boolean; summaryTr: string; summaryEn: string }>;
  pushToCloud: () => Promise<{ ok: boolean; summaryTr: string; summaryEn: string }>;
  resetProgress: () => void;
  resetA2Progress: () => void;
  resetAllLocalData: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialLoadRef = useRef<ProgressLoadOutcome | null>(null);
  if (initialLoadRef.current === null) {
    initialLoadRef.current = readInitialProgressWithDiagnostics();
  }

  const initialA2LoadRef = useRef<A2ProgressLoadOutcome | null>(null);
  if (initialA2LoadRef.current === null) {
    initialA2LoadRef.current = loadA2ProgressFromStorage();
  }

  const [theme, setThemeState] = useState<ThemeMode>(readInitialTheme);
  const [prefs, setPrefs] = useState<LocalUserPrefs>(readInitialPrefs);
  const [progress, setProgress] = useState<ProgressState>(() => initialLoadRef.current!.progress);
  const [a2Progress, setA2Progress] = useState<GermanA2ProgressState>(
    () => initialA2LoadRef.current!.progress
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(
    () => initialLoadRef.current!.warningTr ?? initialA2LoadRef.current!.warningTr
  );

  // Cloud Sync State (offline-first: defaults cleanly to localStorage mode)
  const cloudConfigured = isCloudConfigured();
  const initialSyncMeta = useRef(readSyncMeta());
  const [cloudUser, setCloudUser] = useState<CloudUserSession | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(() =>
    isBrowserOnline() ? 'local' : 'offline'
  );
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState<string | null>(
    () => initialSyncMeta.current.lastCloudSyncAt
  );
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const localUpdatedAtRef = useRef<string | null>(initialSyncMeta.current.localUpdatedAt);
  const suppressAutoPushRef = useRef<boolean>(false);
  const hasMountedSyncRef = useRef<boolean>(false);
  const autoPushTimerRef = useRef<number | null>(null);
  const lastAutoSyncedUserRef = useRef<string | null>(null);

  const latestStateRef = useRef({
    theme,
    prefs,
    progress,
    a2Progress,
    cloudUser,
  });
  latestStateRef.current = { theme, prefs, progress, a2Progress, cloudUser };

  // Synced refs guarantee single-award XP across rapid actions without side-effecting inside setState
  const studiedFlashcardsRef = useRef<Set<string>>(new Set(progress.studiedFlashcards));
  const masteredArticleRef = useRef<Set<string>>(new Set(progress.articleMasteredIds));
  const masteredQuizRef = useRef<Set<string>>(new Set(progress.quizMasteredIds));
  const masteredListeningRef = useRef<Set<string>>(new Set(progress.listeningMasteredIds));
  const masteredReadingRef = useRef<Set<string>>(new Set(progress.readingMasteredIds));
  const masteredWritingRef = useRef<Set<string>>(new Set(progress.writingMasteredIds));
  const masteredSpeakingRef = useRef<Set<string>>(new Set(progress.speakingMasteredIds));
  const masteredActivityRef = useRef<Set<string>>(new Set(progress.activityMasteredIds));
  const completedAssignmentRef = useRef<Set<string>>(new Set(progress.assignmentCompletedIds));
  const teachingMilestoneRef = useRef<Set<string>>(new Set(progress.teachingMilestoneIds));

  // Isolated German A2 single-grant XP refs
  const a2FlashcardsRef = useRef<Set<string>>(new Set(a2Progress.studiedFlashcards));
  const a2ArticlePluralRef = useRef<Set<string>>(new Set(a2Progress.articlePluralMasteredIds));
  const a2MeaningRef = useRef<Set<string>>(new Set(a2Progress.meaningMasteredIds));
  const a2ContextRef = useRef<Set<string>>(new Set(a2Progress.contextMasteredIds));
  const a2ListeningRef = useRef<Set<string>>(new Set(a2Progress.listeningMasteredIds));
  const a2ReadingRef = useRef<Set<string>>(new Set(a2Progress.readingMasteredIds));
  const a2WritingRef = useRef<Set<string>>(new Set(a2Progress.writingMasteredIds));
  const a2SpeakingRef = useRef<Set<string>>(new Set(a2Progress.speakingMasteredIds));
  const a2ActivityRef = useRef<Set<string>>(new Set(a2Progress.activityMasteredIds));
  const a2SkipInitialWriteRef = useRef<boolean>(true);

  useEffect(() => {
    studiedFlashcardsRef.current = new Set(progress.studiedFlashcards);
    masteredArticleRef.current = new Set(progress.articleMasteredIds);
    masteredQuizRef.current = new Set(progress.quizMasteredIds);
    masteredListeningRef.current = new Set(progress.listeningMasteredIds);
    masteredReadingRef.current = new Set(progress.readingMasteredIds);
    masteredWritingRef.current = new Set(progress.writingMasteredIds);
    masteredSpeakingRef.current = new Set(progress.speakingMasteredIds);
    masteredActivityRef.current = new Set(progress.activityMasteredIds);
    completedAssignmentRef.current = new Set(progress.assignmentCompletedIds);
    teachingMilestoneRef.current = new Set(progress.teachingMilestoneIds);
  }, [
    progress.studiedFlashcards,
    progress.articleMasteredIds,
    progress.quizMasteredIds,
    progress.listeningMasteredIds,
    progress.readingMasteredIds,
    progress.writingMasteredIds,
    progress.speakingMasteredIds,
    progress.activityMasteredIds,
    progress.assignmentCompletedIds,
    progress.teachingMilestoneIds,
  ]);

  useEffect(() => {
    a2FlashcardsRef.current = new Set(a2Progress.studiedFlashcards);
    a2ArticlePluralRef.current = new Set(a2Progress.articlePluralMasteredIds);
    a2MeaningRef.current = new Set(a2Progress.meaningMasteredIds);
    a2ContextRef.current = new Set(a2Progress.contextMasteredIds);
    a2ListeningRef.current = new Set(a2Progress.listeningMasteredIds);
    a2ReadingRef.current = new Set(a2Progress.readingMasteredIds);
    a2WritingRef.current = new Set(a2Progress.writingMasteredIds);
    a2SpeakingRef.current = new Set(a2Progress.speakingMasteredIds);
    a2ActivityRef.current = new Set(a2Progress.activityMasteredIds);
  }, [
    a2Progress.studiedFlashcards,
    a2Progress.articlePluralMasteredIds,
    a2Progress.meaningMasteredIds,
    a2Progress.contextMasteredIds,
    a2Progress.listeningMasteredIds,
    a2Progress.readingMasteredIds,
    a2Progress.writingMasteredIds,
    a2Progress.speakingMasteredIds,
    a2Progress.activityMasteredIds,
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    platformServices.auth.writeTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = prefs.uiLanguage;
    platformServices.auth.writePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    const outcome = platformServices.progressSync.saveProgress(progress);
    if (outcome.ok) {
      setLastSavedAt(new Date().toISOString());
    } else if (outcome.errorTr) {
      setStorageWarning(outcome.errorTr);
    }
  }, [progress]);

  useEffect(() => {
    if (a2SkipInitialWriteRef.current) {
      a2SkipInitialWriteRef.current = false;
      return;
    }
    const outcome = saveA2ProgressToStorage(a2Progress);
    if (outcome.ok) {
      setLastSavedAt(new Date().toISOString());
    } else if (outcome.errorTr) {
      setStorageWarning(outcome.errorTr);
    }
  }, [a2Progress]);

  const dismissStorageWarning = useCallback(() => {
    setStorageWarning(null);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setRolePreview = useCallback((role: UserRole) => {
    setPrefs((prev) => ({ ...prev, rolePreview: role }));
  }, []);

  const setSpeechSpeed = useCallback((speed: SpeechSpeed) => {
    setPrefs((prev) => ({ ...prev, speechSpeed: speed }));
  }, []);

  const setDisplayName = useCallback((name: string) => {
    setPrefs((prev) => ({ ...prev, displayName: name.trim().slice(0, 48) }));
  }, []);

  const setActiveCourse = useCallback((course: ActiveCourseId) => {
    setPrefs((prev) => ({ ...prev, activeCourse: course }));
  }, []);

  const setUiLanguage = useCallback((lang: UiLanguage) => {
    setPrefs((prev) => ({ ...prev, uiLanguage: lang }));
  }, []);

  const toggleUiLanguage = useCallback(() => {
    setPrefs((prev) => ({ ...prev, uiLanguage: prev.uiLanguage === 'tr' ? 'en' : 'tr' }));
  }, []);

  const recordA2FlashcardStudied = useCallback(
    (wordId: string, unitId: string, label: string): boolean => {
      if (a2FlashcardsRef.current.has(wordId)) {
        return false;
      }
      a2FlashcardsRef.current.add(wordId);
      setA2Progress((prev) => {
        if (prev.studiedFlashcards.includes(wordId)) {
          return prev;
        }
        const entry = createA2Activity(
          'a2-flashcards',
          unitId,
          `A2 kelime kartı öğrenildi: ${label}`,
          5,
          true
        );
        return {
          ...prev,
          studiedFlashcards: [...prev.studiedFlashcards, wordId],
          xp: prev.xp + 5,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return true;
    },
    []
  );

  const recordA2ArticlePluralAnswer = useCallback(
    (wordId: string, unitId: string, label: string, isCorrect: boolean): number => {
      let xpAwarded = 0;
      if (isCorrect && !a2ArticlePluralRef.current.has(wordId)) {
        a2ArticlePluralRef.current.add(wordId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.articlePluralMasteredIds.includes(wordId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const nextMastered =
          isCorrect && !alreadyMastered
            ? [...prev.articlePluralMasteredIds, wordId]
            : prev.articlePluralMasteredIds;
        const entry = createA2Activity(
          'a2-articles-plural',
          unitId,
          isCorrect
            ? `A2 Artikel & Çoğul doğru: ${label}`
            : `A2 Artikel & Çoğul tekrarı: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          articlePluralAttempts: prev.articlePluralAttempts + 1,
          articlePluralCorrect: prev.articlePluralCorrect + (isCorrect ? 1 : 0),
          articlePluralMasteredIds: nextMastered,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2MeaningAnswer = useCallback(
    (wordId: string, unitId: string, label: string, isCorrect: boolean): number => {
      let xpAwarded = 0;
      if (isCorrect && !a2MeaningRef.current.has(wordId)) {
        a2MeaningRef.current.add(wordId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.meaningMasteredIds.includes(wordId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const nextMastered =
          isCorrect && !alreadyMastered
            ? [...prev.meaningMasteredIds, wordId]
            : prev.meaningMasteredIds;
        const entry = createA2Activity(
          'a2-meaning',
          unitId,
          isCorrect ? `A2 anlam eşleştirme doğru: ${label}` : `A2 anlam tekrarı: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          meaningAttempts: prev.meaningAttempts + 1,
          meaningCorrect: prev.meaningCorrect + (isCorrect ? 1 : 0),
          meaningMasteredIds: nextMastered,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2ContextAnswer = useCallback(
    (wordId: string, unitId: string, label: string, isCorrect: boolean): number => {
      let xpAwarded = 0;
      if (isCorrect && !a2ContextRef.current.has(wordId)) {
        a2ContextRef.current.add(wordId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.contextMasteredIds.includes(wordId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const nextMastered =
          isCorrect && !alreadyMastered
            ? [...prev.contextMasteredIds, wordId]
            : prev.contextMasteredIds;
        const entry = createA2Activity(
          'a2-context',
          unitId,
          isCorrect
            ? `A2 cümle içi kullanım doğru: ${label}`
            : `A2 cümle içi kullanım tekrarı: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          contextAttempts: prev.contextAttempts + 1,
          contextCorrect: prev.contextCorrect + (isCorrect ? 1 : 0),
          contextMasteredIds: nextMastered,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2ListeningAnswer = useCallback(
    (
      exerciseId: string,
      scenarioId: string,
      kind: ListeningExerciseKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<ListeningExerciseKind, A2ActivityMode> = {
        tf: 'a2-horen-tf',
        cloze: 'a2-horen-cloze',
        mc: 'a2-horen-mc',
      };
      let xpAwarded = 0;
      if (isCorrect && !a2ListeningRef.current.has(exerciseId)) {
        a2ListeningRef.current.add(exerciseId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.listeningMasteredIds.includes(exerciseId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const listeningMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.listeningMasteredIds, exerciseId]
            : prev.listeningMasteredIds;
        const entry = createA2Activity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `A2 dinleme sorusu doğru: ${label}`
            : `A2 dinleme sorusu tekrarı: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          listeningAttempts: prev.listeningAttempts + 1,
          listeningCorrect: prev.listeningCorrect + (isCorrect ? 1 : 0),
          listeningMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2ReadingAnswer = useCallback(
    (
      exerciseId: string,
      scenarioId: string,
      kind: ReadingExerciseKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<ReadingExerciseKind, A2ActivityMode> = {
        tf: 'a2-lesen-tf',
        cloze: 'a2-lesen-cloze',
        mc: 'a2-lesen-mc',
      };
      let xpAwarded = 0;
      if (isCorrect && !a2ReadingRef.current.has(exerciseId)) {
        a2ReadingRef.current.add(exerciseId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.readingMasteredIds.includes(exerciseId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const readingMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.readingMasteredIds, exerciseId]
            : prev.readingMasteredIds;
        const entry = createA2Activity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `A2 okuma sorusu doğru: ${label}`
            : `A2 okuma sorusu tekrarı: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          readingAttempts: prev.readingAttempts + 1,
          readingCorrect: prev.readingCorrect + (isCorrect ? 1 : 0),
          readingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2WritingAnswer = useCallback(
    (
      taskId: string,
      scenarioId: string,
      kind: A2WritingTaskKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<A2WritingTaskKind, A2ActivityMode> = {
        message: 'a2-schreiben-message',
        controlled: 'a2-schreiben-controlled',
      };
      // Strictly single-grant +10 A2 XP per unique mastered A2 writing task
      let xpAwarded = 0;
      if (isCorrect && !a2WritingRef.current.has(taskId)) {
        a2WritingRef.current.add(taskId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.writingMasteredIds.includes(taskId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const writingMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.writingMasteredIds, taskId]
            : prev.writingMasteredIds;
        const entry = createA2Activity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `A2 yazma görevi tamamlandı: ${label}`
            : `A2 yazma görevi kontrol edildi: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          writingAttempts: prev.writingAttempts + 1,
          writingCorrect: prev.writingCorrect + (isCorrect ? 1 : 0),
          writingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2SpeakingCompletion = useCallback(
    (
      taskId: string,
      scenarioId: string,
      kind: SpeakingTaskKind,
      label: string
    ): number => {
      const modeMap: Record<SpeakingTaskKind, A2ActivityMode> = {
        repeat: 'a2-sprechen-repeat',
        prompt: 'a2-sprechen-prompt',
        roleplay: 'a2-sprechen-roleplay',
      };
      // Strictly single-grant +10 A2 XP per unique speaking task; excluded from a2OverallAccuracyPercent
      let xpAwarded = 0;
      if (!a2SpeakingRef.current.has(taskId)) {
        a2SpeakingRef.current.add(taskId);
        xpAwarded = 10;
      }
      setA2Progress((prev) => {
        const alreadyMastered = prev.speakingMasteredIds.includes(taskId);
        const xpEarned = !alreadyMastered ? 10 : 0;
        const speakingMasteredIds = !alreadyMastered
          ? [...prev.speakingMasteredIds, taskId]
          : prev.speakingMasteredIds;
        const entry = createA2Activity(
          modeMap[kind],
          scenarioId,
          `A2 konuşma pratiği tamamlandı: ${label}`,
          xpEarned,
          true
        );
        return {
          ...prev,
          speakingAttempts: prev.speakingAttempts + 1,
          speakingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return xpAwarded;
    },
    []
  );

  const recordA2KaraokeCompletion = useCallback((trackId: string, label: string): number => {
    // Strictly single-grant +15 A2 XP; excluded from activityAttempts / a2OverallAccuracyPercent
    const willAwardXp = !a2ActivityRef.current.has(trackId) ? 15 : 0;
    if (willAwardXp > 0) {
      a2ActivityRef.current.add(trackId);
    }

    setA2Progress((prev) => {
      const alreadyMastered = prev.activityMasteredIds.includes(trackId);
      const xpEarned = !alreadyMastered ? 15 : 0;
      const activityMasteredIds = !alreadyMastered
        ? [...prev.activityMasteredIds, trackId]
        : prev.activityMasteredIds;

      const entry = createA2Activity(
        'a2-activity-karaoke',
        'karaoke',
        `A2 Karaoke parçası tamamlandı: ${label}`,
        xpEarned,
        true
      );

      return {
        ...prev,
        activityMasteredIds,
        xp: prev.xp + xpEarned,
        recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
      };
    });

    return willAwardXp;
  }, []);

  const recordA2ActivityAnswer = useCallback(
    (
      itemId: string,
      kind: Exclude<ActivitySubKind, 'karaoke'>,
      label: string,
      isCorrect: boolean,
      streakAfterAnswer?: number,
      countsTowardAccuracy = true
    ): number => {
      const modeMap: Record<Exclude<ActivitySubKind, 'karaoke'>, A2ActivityMode> = {
        charades: 'a2-activity-charades',
        arena: 'a2-activity-arena',
        quiz: 'a2-activity-quiz',
        exam: 'a2-activity-exam',
      };
      const willAwardXp = isCorrect && !a2ActivityRef.current.has(itemId) ? 10 : 0;
      if (willAwardXp > 0) {
        a2ActivityRef.current.add(itemId);
      }

      setA2Progress((prev) => {
        const alreadyMastered = prev.activityMasteredIds.includes(itemId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const activityMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.activityMasteredIds, itemId]
            : prev.activityMasteredIds;
        const nextBestStreak =
          kind === 'arena' && typeof streakAfterAnswer === 'number'
            ? Math.max(prev.a2ArenaBestStreak, streakAfterAnswer)
            : prev.a2ArenaBestStreak;

        const entry = createA2Activity(
          modeMap[kind],
          kind,
          isCorrect ? `A2 etkinlik doğru: ${label}` : `A2 etkinlik tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );

        return {
          ...prev,
          activityAttempts: countsTowardAccuracy ? prev.activityAttempts + 1 : prev.activityAttempts,
          activityCorrect:
            countsTowardAccuracy && isCorrect ? prev.activityCorrect + 1 : prev.activityCorrect,
          activityMasteredIds,
          a2ArenaBestStreak: nextBestStreak,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordA2ExamSubmission = useCallback(
    (
      results: Array<{ itemId: string; isCorrect: boolean }>,
      scorePercent: number
    ): number => {
      const newlyMasteredIds: string[] = [];
      for (const r of results) {
        if (r.isCorrect && !a2ActivityRef.current.has(r.itemId)) {
          a2ActivityRef.current.add(r.itemId);
          newlyMasteredIds.push(r.itemId);
        }
      }
      const totalXpAwarded = newlyMasteredIds.length * 10;

      setA2Progress((prev) => {
        const existingSet = new Set(prev.activityMasteredIds);
        const toAdd: string[] = [];
        let correctCount = 0;
        for (const r of results) {
          if (r.isCorrect) {
            correctCount += 1;
            if (!existingSet.has(r.itemId)) {
              existingSet.add(r.itemId);
              toAdd.push(r.itemId);
            }
          }
        }
        const xpEarned = toAdd.length * 10;
        const bestScore =
          prev.a2ExamBestScorePercent === null
            ? scorePercent
            : Math.max(prev.a2ExamBestScorePercent, scorePercent);

        const entry = createA2Activity(
          'a2-activity-exam',
          'sinav-modu',
          `A2 Deneme Sınavı tamamlandı: ${correctCount}/${results.length} (%${scorePercent})`,
          xpEarned,
          scorePercent >= 60
        );

        return {
          ...prev,
          activityAttempts: prev.activityAttempts + results.length,
          activityCorrect: prev.activityCorrect + correctCount,
          activityMasteredIds:
            toAdd.length > 0 ? [...prev.activityMasteredIds, ...toAdd] : prev.activityMasteredIds,
          a2ExamCompletedCount: prev.a2ExamCompletedCount + 1,
          a2ExamBestScorePercent: bestScore,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return totalXpAwarded;
    },
    []
  );

  const recordFlashcardStudied = useCallback(
    (wordId: string, topicId: string, label: string): boolean => {
      if (studiedFlashcardsRef.current.has(wordId)) {
        return false;
      }
      studiedFlashcardsRef.current.add(wordId);
      setProgress((prev) => {
        if (prev.studiedFlashcards.includes(wordId)) {
          return prev;
        }
        const entry = createActivity(
          'flashcards',
          topicId,
          `Kelime kartı öğrenildi: ${label}`,
          5,
          true
        );
        return {
          ...prev,
          studiedFlashcards: [...prev.studiedFlashcards, wordId],
          xp: prev.xp + 5,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
      return true;
    },
    []
  );

  const recordArticleAnswer = useCallback(
    (wordId: string, topicId: string, label: string, isCorrect: boolean): number => {
      const isNewlyMastered = isCorrect && !masteredArticleRef.current.has(wordId);
      if (isNewlyMastered) {
        masteredArticleRef.current.add(wordId);
      }
      const xpAwarded = isNewlyMastered ? 10 : 0;

      setProgress((prev) => {
        const alreadyMastered = prev.articleMasteredIds.includes(wordId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const articleMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.articleMasteredIds, wordId]
            : prev.articleMasteredIds;
        const entry = createActivity(
          'articles',
          topicId,
          isCorrect
            ? `Artikel doğru seçildi: ${label}`
            : `Artikel tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          articleAttempts: prev.articleAttempts + 1,
          articleCorrect: prev.articleCorrect + (isCorrect ? 1 : 0),
          articleMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return xpAwarded;
    },
    []
  );

  const recordQuizAnswer = useCallback(
    (wordId: string, topicId: string, label: string, isCorrect: boolean): number => {
      const isNewlyMastered = isCorrect && !masteredQuizRef.current.has(wordId);
      if (isNewlyMastered) {
        masteredQuizRef.current.add(wordId);
      }
      const xpAwarded = isNewlyMastered ? 10 : 0;

      setProgress((prev) => {
        const alreadyMastered = prev.quizMasteredIds.includes(wordId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const quizMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.quizMasteredIds, wordId]
            : prev.quizMasteredIds;
        const entry = createActivity(
          'quiz',
          topicId,
          isCorrect
            ? `Anlam testi doğru: ${label}`
            : `Anlam testi tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );
        return {
          ...prev,
          quizAttempts: prev.quizAttempts + 1,
          quizCorrect: prev.quizCorrect + (isCorrect ? 1 : 0),
          quizMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return xpAwarded;
    },
    []
  );

  const recordMemoryRoundComplete = useCallback(
    (topicId: string, topicTitle: string, pairs: number, moves: number) => {
      setProgress((prev) => {
        const xpEarned = 25;
        const entry = createActivity(
          'memory',
          topicId,
          `Hafıza eşleştirme tamamlandı (${topicTitle} · ${moves} hamle)`,
          xpEarned,
          true
        );
        return {
          ...prev,
          memoryGamesCompleted: prev.memoryGamesCompleted + 1,
          memoryPairsMatched: prev.memoryPairsMatched + pairs,
          memoryAttempts: prev.memoryAttempts + moves,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });
    },
    []
  );

  const recordListeningAnswer = useCallback(
    (
      exerciseId: string,
      scenarioId: string,
      kind: ListeningExerciseKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<ListeningExerciseKind, ActivityMode> = {
        tf: 'horen-tf',
        cloze: 'horen-cloze',
        mc: 'horen-mc',
      };
      const willAwardXp = isCorrect && !masteredListeningRef.current.has(exerciseId) ? 10 : 0;
      if (willAwardXp > 0) {
        masteredListeningRef.current.add(exerciseId);
      }

      setProgress((prev) => {
        const alreadyMastered = prev.listeningMasteredIds.includes(exerciseId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const listeningMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.listeningMasteredIds, exerciseId]
            : prev.listeningMasteredIds;

        const entry = createActivity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `Dinleme sorusu doğru: ${label}`
            : `Dinleme sorusu tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );

        return {
          ...prev,
          listeningAttempts: prev.listeningAttempts + 1,
          listeningCorrect: prev.listeningCorrect + (isCorrect ? 1 : 0),
          listeningMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordReadingAnswer = useCallback(
    (
      exerciseId: string,
      scenarioId: string,
      kind: ReadingExerciseKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<ReadingExerciseKind, ActivityMode> = {
        tf: 'lesen-tf',
        cloze: 'lesen-cloze',
        mc: 'lesen-mc',
      };
      // Guard against double-counting across repeated checks, re-renders, or rapid clicks
      const willAwardXp = isCorrect && !masteredReadingRef.current.has(exerciseId) ? 10 : 0;
      if (willAwardXp > 0) {
        masteredReadingRef.current.add(exerciseId);
      }

      setProgress((prev) => {
        const alreadyMastered = prev.readingMasteredIds.includes(exerciseId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const readingMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.readingMasteredIds, exerciseId]
            : prev.readingMasteredIds;

        const entry = createActivity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `Okuma sorusu doğru: ${label}`
            : `Okuma sorusu tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );

        return {
          ...prev,
          readingAttempts: prev.readingAttempts + 1,
          readingCorrect: prev.readingCorrect + (isCorrect ? 1 : 0),
          readingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordWritingAnswer = useCallback(
    (
      taskId: string,
      scenarioId: string,
      kind: WritingTaskKind,
      label: string,
      isCorrect: boolean
    ): number => {
      const modeMap: Record<WritingTaskKind, ActivityMode> = {
        form: 'schreiben-form',
        message: 'schreiben-message',
        controlled: 'schreiben-controlled',
      };
      // Guard against double-counting across repeated checks, re-renders, or reloads
      const willAwardXp = isCorrect && !masteredWritingRef.current.has(taskId) ? 10 : 0;
      if (willAwardXp > 0) {
        masteredWritingRef.current.add(taskId);
      }

      setProgress((prev) => {
        const alreadyMastered = prev.writingMasteredIds.includes(taskId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const writingMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.writingMasteredIds, taskId]
            : prev.writingMasteredIds;

        const entry = createActivity(
          modeMap[kind],
          scenarioId,
          isCorrect
            ? `Yazma görevi tamamlandı: ${label}`
            : `Yazma görevi kontrol edildi: ${label}`,
          xpEarned,
          isCorrect
        );

        return {
          ...prev,
          writingAttempts: prev.writingAttempts + 1,
          writingCorrect: prev.writingCorrect + (isCorrect ? 1 : 0),
          writingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordSpeakingCompletion = useCallback(
    (
      taskId: string,
      scenarioId: string,
      kind: SpeakingTaskKind,
      label: string
    ): number => {
      const modeMap: Record<SpeakingTaskKind, ActivityMode> = {
        repeat: 'sprechen-repeat',
        prompt: 'sprechen-prompt',
        roleplay: 'sprechen-roleplay',
      };
      // Strictly single-award XP per unique speaking task across re-checks, re-renders, or reloads
      const willAwardXp = !masteredSpeakingRef.current.has(taskId) ? 10 : 0;
      if (willAwardXp > 0) {
        masteredSpeakingRef.current.add(taskId);
      }

      setProgress((prev) => {
        const alreadyMastered = prev.speakingMasteredIds.includes(taskId);
        const xpEarned = !alreadyMastered ? 10 : 0;
        const speakingMasteredIds = !alreadyMastered
          ? [...prev.speakingMasteredIds, taskId]
          : prev.speakingMasteredIds;

        const entry = createActivity(
          modeMap[kind],
          scenarioId,
          `Konuşma pratiği tamamlandı: ${label}`,
          xpEarned,
          true
        );

        return {
          ...prev,
          speakingAttempts: prev.speakingAttempts + 1,
          speakingMasteredIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordKaraokeCompletion = useCallback((trackId: string, label: string): number => {
    const willAwardXp = !masteredActivityRef.current.has(trackId) ? 15 : 0;
    if (willAwardXp > 0) {
      masteredActivityRef.current.add(trackId);
    }

    setProgress((prev) => {
      const alreadyMastered = prev.activityMasteredIds.includes(trackId);
      const xpEarned = !alreadyMastered ? 15 : 0;
      const activityMasteredIds = !alreadyMastered
        ? [...prev.activityMasteredIds, trackId]
        : prev.activityMasteredIds;

      const entry = createActivity(
        'activity-karaoke',
        'karaoke',
        `Karaoke parçası tamamlandı: ${label}`,
        xpEarned,
        true
      );

      return {
        ...prev,
        activityMasteredIds,
        xp: prev.xp + xpEarned,
        recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
      };
    });

    return willAwardXp;
  }, []);

  const recordActivityAnswer = useCallback(
    (
      itemId: string,
      kind: Exclude<ActivitySubKind, 'karaoke'>,
      label: string,
      isCorrect: boolean,
      streakAfterAnswer?: number,
      countsTowardAccuracy = true
    ): number => {
      const modeMap: Record<Exclude<ActivitySubKind, 'karaoke'>, ActivityMode> = {
        charades: 'activity-charades',
        arena: 'activity-arena',
        quiz: 'activity-quiz',
        exam: 'activity-exam',
      };
      const willAwardXp = isCorrect && !masteredActivityRef.current.has(itemId) ? 10 : 0;
      if (willAwardXp > 0) {
        masteredActivityRef.current.add(itemId);
      }

      setProgress((prev) => {
        const alreadyMastered = prev.activityMasteredIds.includes(itemId);
        const xpEarned = isCorrect && !alreadyMastered ? 10 : 0;
        const activityMasteredIds =
          isCorrect && !alreadyMastered
            ? [...prev.activityMasteredIds, itemId]
            : prev.activityMasteredIds;
        const nextBestStreak =
          typeof streakAfterAnswer === 'number'
            ? Math.max(prev.arenaBestStreak, streakAfterAnswer)
            : prev.arenaBestStreak;

        const entry = createActivity(
          modeMap[kind],
          kind,
          isCorrect ? `Etkinlik doğru: ${label}` : `Etkinlik tekrar edilmeli: ${label}`,
          xpEarned,
          isCorrect
        );

        return {
          ...prev,
          activityAttempts: countsTowardAccuracy ? prev.activityAttempts + 1 : prev.activityAttempts,
          activityCorrect:
            countsTowardAccuracy && isCorrect ? prev.activityCorrect + 1 : prev.activityCorrect,
          activityMasteredIds,
          arenaBestStreak: nextBestStreak,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return willAwardXp;
    },
    []
  );

  const recordExamSubmission = useCallback(
    (
      results: Array<{ itemId: string; isCorrect: boolean }>,
      scorePercent: number
    ): number => {
      const newlyMasteredIds: string[] = [];
      for (const r of results) {
        if (r.isCorrect && !masteredActivityRef.current.has(r.itemId)) {
          masteredActivityRef.current.add(r.itemId);
          newlyMasteredIds.push(r.itemId);
        }
      }
      const totalXpAwarded = newlyMasteredIds.length * 10;

      setProgress((prev) => {
        const existingSet = new Set(prev.activityMasteredIds);
        const toAdd: string[] = [];
        let correctCount = 0;
        for (const r of results) {
          if (r.isCorrect) {
            correctCount += 1;
            if (!existingSet.has(r.itemId)) {
              existingSet.add(r.itemId);
              toAdd.push(r.itemId);
            }
          }
        }
        const xpEarned = toAdd.length * 10;
        const bestScore =
          prev.examBestScorePercent === null
            ? scorePercent
            : Math.max(prev.examBestScorePercent, scorePercent);

        const entry = createActivity(
          'activity-exam',
          'sinav-modu',
          `A1 Deneme Sınavı tamamlandı: ${correctCount}/${results.length} (%${scorePercent})`,
          xpEarned,
          scorePercent >= 60
        );

        return {
          ...prev,
          activityAttempts: prev.activityAttempts + results.length,
          activityCorrect: prev.activityCorrect + correctCount,
          activityMasteredIds:
            toAdd.length > 0 ? [...prev.activityMasteredIds, ...toAdd] : prev.activityMasteredIds,
          examCompletedCount: prev.examCompletedCount + 1,
          examBestScorePercent: bestScore,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return totalXpAwarded;
    },
    []
  );

  const createTeachingClass = useCallback(
    (input: CreateTeachingClassInput): { id: string; xpAwarded: number } => {
      const id = `class-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const milestoneId = 'teach-class-created';
      const xpAwarded = !teachingMilestoneRef.current.has(milestoneId) ? 10 : 0;
      if (xpAwarded > 0) {
        teachingMilestoneRef.current.add(milestoneId);
      }

      const courseId: ActiveCourseId = input.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
      const levelShort = courseId === 'de-A2' ? 'A2' : 'A1';

      const newClass: TeachingClassGroup = {
        id,
        courseId,
        name: input.name.trim().slice(0, 80),
        levelLabel: input.levelLabel.trim().slice(0, 24) || `CEFR ${levelShort}`,
        scheduleTr: input.scheduleTr.trim().slice(0, 80),
        focusTopicTr: input.focusTopicTr.trim().slice(0, 100),
        descriptionTr: input.descriptionTr.trim().slice(0, 240),
        roster: [],
        createdAt: new Date().toISOString(),
      };

      setProgress((prev) => {
        const alreadyEarned = prev.teachingMilestoneIds.includes(milestoneId);
        const xpEarned = !alreadyEarned ? 10 : 0;
        const teachingMilestoneIds = !alreadyEarned
          ? [...prev.teachingMilestoneIds, milestoneId]
          : prev.teachingMilestoneIds;

        const entry = createActivity(
          'teaching-class',
          'siniflarim',
          `Yerel ${levelShort} sınıf grubu oluşturuldu: ${newClass.name}`,
          xpEarned,
          true
        );

        return {
          ...prev,
          teachingClasses: [newClass, ...prev.teachingClasses],
          teachingMilestoneIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return { id, xpAwarded };
    },
    []
  );

  const deleteTeachingClass = useCallback((classId: string) => {
    setProgress((prev) => ({
      ...prev,
      teachingClasses: prev.teachingClasses.filter((c) => c.id !== classId),
      teachingAssignments: prev.teachingAssignments.map((a) =>
        a.classId === classId ? { ...a, classId: undefined } : a
      ),
    }));
  }, []);

  const addClassRosterEntry = useCallback((classId: string, name: string, noteTr: string) => {
    const cleanName = name.trim().slice(0, 60);
    if (!cleanName) return;
    const entryId = `roster-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    setProgress((prev) => ({
      ...prev,
      teachingClasses: prev.teachingClasses.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              roster: [
                ...cls.roster,
                {
                  id: entryId,
                  name: cleanName,
                  noteTr: noteTr.trim().slice(0, 120),
                  addedAt: new Date().toISOString(),
                },
              ],
            }
          : cls
      ),
    }));
  }, []);

  const removeClassRosterEntry = useCallback((classId: string, entryId: string) => {
    setProgress((prev) => ({
      ...prev,
      teachingClasses: prev.teachingClasses.map((cls) =>
        cls.id === classId
          ? { ...cls, roster: cls.roster.filter((r) => r.id !== entryId) }
          : cls
      ),
    }));
  }, []);

  const createTeachingAssignment = useCallback(
    (input: CreateTeachingAssignmentInput): { id: string; xpAwarded: number } => {
      const id = `assign-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const milestoneId = 'teach-assignment-created';
      const xpAwarded = !teachingMilestoneRef.current.has(milestoneId) ? 10 : 0;
      if (xpAwarded > 0) {
        teachingMilestoneRef.current.add(milestoneId);
      }

      const courseId: ActiveCourseId = input.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
      const levelShort = courseId === 'de-A2' ? 'A2' : 'A1';

      const newAssignment: TeachingAssignment = {
        id,
        courseId,
        titleTr: input.titleTr.trim().slice(0, 100),
        moduleRoute: input.moduleRoute,
        targetId: input.targetId,
        targetLabelTr: input.targetLabelTr.trim().slice(0, 100),
        classId: input.classId || undefined,
        dueDateLabel: input.dueDateLabel?.trim().slice(0, 48) || undefined,
        instructionsTr: input.instructionsTr.trim().slice(0, 320),
        status: 'assigned',
        createdAt: new Date().toISOString(),
      };

      setProgress((prev) => {
        const alreadyEarned = prev.teachingMilestoneIds.includes(milestoneId);
        const xpEarned = !alreadyEarned ? 10 : 0;
        const teachingMilestoneIds = !alreadyEarned
          ? [...prev.teachingMilestoneIds, milestoneId]
          : prev.teachingMilestoneIds;

        const entry = createActivity(
          'teaching-assignment',
          'odevler',
          `Yeni ${levelShort} ödevi oluşturuldu: ${newAssignment.titleTr}`,
          xpEarned,
          true
        );

        return {
          ...prev,
          teachingAssignments: [newAssignment, ...prev.teachingAssignments],
          teachingMilestoneIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return { id, xpAwarded };
    },
    []
  );

  const toggleAssignmentCompleted = useCallback(
    (assignmentId: string): { status: TeachingAssignmentStatus; xpAwarded: number } => {
      let nextStatus: TeachingAssignmentStatus = 'completed';
      let xpAwarded = 0;

      const existing = progress.teachingAssignments.find((a) => a.id === assignmentId);
      if (existing) {
        const isCurrentlyDone = existing.status === 'completed' || existing.status === 'reviewed';
        nextStatus = isCurrentlyDone ? 'assigned' : 'completed';
        if (!isCurrentlyDone && !completedAssignmentRef.current.has(assignmentId)) {
          completedAssignmentRef.current.add(assignmentId);
          xpAwarded = 15;
        }
      }

      setProgress((prev) => {
        const target = prev.teachingAssignments.find((a) => a.id === assignmentId);
        if (!target) return prev;

        const isCurrentlyDone = target.status === 'completed' || target.status === 'reviewed';
        const computedNext: TeachingAssignmentStatus = isCurrentlyDone ? 'assigned' : 'completed';
        const alreadyAwarded = prev.assignmentCompletedIds.includes(assignmentId);
        const xpEarned = !isCurrentlyDone && !alreadyAwarded ? 15 : 0;
        const assignmentCompletedIds =
          !isCurrentlyDone && !alreadyAwarded
            ? [...prev.assignmentCompletedIds, assignmentId]
            : prev.assignmentCompletedIds;

        const updatedAssignments = prev.teachingAssignments.map((a) =>
          a.id === assignmentId
            ? {
                ...a,
                status: computedNext,
                completedAt:
                  computedNext === 'completed' ? new Date().toISOString() : undefined,
                reviewedAt: computedNext === 'assigned' ? undefined : a.reviewedAt,
              }
            : a
        );

        if (computedNext === 'completed') {
          const levelShort = target.courseId === 'de-A2' ? 'A2' : 'A1';
          const entry = createActivity(
            'teaching-assignment',
            'odevler',
            `${levelShort} ödevi tamamlandı: ${target.titleTr}`,
            xpEarned,
            true
          );
          return {
            ...prev,
            teachingAssignments: updatedAssignments,
            assignmentCompletedIds,
            xp: prev.xp + xpEarned,
            recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
          };
        }

        return {
          ...prev,
          teachingAssignments: updatedAssignments,
        };
      });

      return { status: nextStatus, xpAwarded };
    },
    [progress.teachingAssignments]
  );

  const updateAssignmentReview = useCallback(
    (assignmentId: string, reviewed: boolean, reviewNoteTr: string) => {
      const cleanNote = reviewNoteTr.trim().slice(0, 240);
      setProgress((prev) => ({
        ...prev,
        teachingAssignments: prev.teachingAssignments.map((a) => {
          if (a.id !== assignmentId) return a;
          const nextStatus: TeachingAssignmentStatus = reviewed
            ? 'reviewed'
            : a.completedAt
            ? 'completed'
            : 'assigned';
          return {
            ...a,
            status: nextStatus,
            reviewedAt: reviewed ? new Date().toISOString() : undefined,
            reviewNoteTr: cleanNote || undefined,
          };
        }),
      }));
    },
    []
  );

  const deleteTeachingAssignment = useCallback((assignmentId: string) => {
    setProgress((prev) => ({
      ...prev,
      teachingAssignments: prev.teachingAssignments.filter((a) => a.id !== assignmentId),
    }));
  }, []);

  const saveStudioDraft = useCallback(
    (input: SaveStudioDraftInput): { id: string; xpAwarded: number } => {
      const id = input.id || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const milestoneId = 'teach-studio-draft-saved';
      const xpAwarded = !teachingMilestoneRef.current.has(milestoneId) ? 15 : 0;
      if (xpAwarded > 0) {
        teachingMilestoneRef.current.add(milestoneId);
      }

      const courseId: ActiveCourseId = input.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
      const levelShort = courseId === 'de-A2' ? 'A2' : 'A1';

      const normalizedDraft: StudioDraft = {
        id,
        courseId,
        titleTr: input.titleTr.trim().slice(0, 100) || `Adsız ${levelShort} Taslak`,
        kind: input.kind,
        moduleFocus: input.moduleFocus,
        durationMinutes: Math.max(5, Math.min(180, Math.round(input.durationMinutes || 45))),
        notesTr: input.notesTr.trim().slice(0, 400),
        items: input.items
          .filter((item) => item.textTr.trim().length > 0)
          .map((item, idx) => ({
            id: item.id || `item-${Date.now()}-${idx}`,
            textTr: item.textTr.trim().slice(0, 180),
            sampleDe: item.sampleDe?.trim().slice(0, 220) || undefined,
            checked: Boolean(item.checked),
          })),
        updatedAt: new Date().toISOString(),
      };

      setProgress((prev) => {
        const alreadyEarned = prev.teachingMilestoneIds.includes(milestoneId);
        const xpEarned = !alreadyEarned ? 15 : 0;
        const teachingMilestoneIds = !alreadyEarned
          ? [...prev.teachingMilestoneIds, milestoneId]
          : prev.teachingMilestoneIds;

        const exists = prev.studioDrafts.some((d) => d.id === id);
        const nextDrafts = exists
          ? prev.studioDrafts.map((d) => (d.id === id ? normalizedDraft : d))
          : [normalizedDraft, ...prev.studioDrafts];

        const entry = createActivity(
          'teaching-studio',
          'ogretmen-studyosu',
          `Öğretmen Stüdyosu taslağı kaydedildi: ${normalizedDraft.titleTr}`,
          xpEarned,
          true
        );

        return {
          ...prev,
          studioDrafts: nextDrafts,
          teachingMilestoneIds,
          xp: prev.xp + xpEarned,
          recentActivities: [entry, ...prev.recentActivities].slice(0, 20),
        };
      });

      return { id, xpAwarded };
    },
    []
  );

  const deleteStudioDraft = useCallback((draftId: string) => {
    setProgress((prev) => ({
      ...prev,
      studioDrafts: prev.studioDrafts.filter((d) => d.id !== draftId),
    }));
  }, []);

  const toggleStudioDraftItem = useCallback((draftId: string, itemId: string) => {
    setProgress((prev) => ({
      ...prev,
      studioDrafts: prev.studioDrafts.map((draft) =>
        draft.id === draftId
          ? {
              ...draft,
              updatedAt: new Date().toISOString(),
              items: draft.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : draft
      ),
    }));
  }, []);

  const importLocalData = useCallback(
    (
      payload: ValidatedBackupPayload,
      mode: 'replace' | 'merge'
    ): {
      xpBefore: number;
      xpAfter: number;
      a2XpBefore: number;
      a2XpAfter: number;
      mode: 'replace' | 'merge';
    } => {
      const xpBefore = progress.xp;
      const a2XpBefore = a2Progress.xp;
      const nextProgress =
        mode === 'merge'
          ? platformServices.progressSync.reconcileProgress(progress, payload.progress)
          : payload.progress;

      let nextA2Progress = a2Progress;
      if (payload.a2Progress) {
        nextA2Progress =
          mode === 'merge'
            ? mergeA2ProgressSafely(a2Progress, payload.a2Progress)
            : payload.a2Progress;
      } else if (mode === 'replace') {
        nextA2Progress = { ...INITIAL_A2_PROGRESS };
      }

      // Immediately synchronize single-grant XP refs before React commits the next render
      studiedFlashcardsRef.current = new Set(nextProgress.studiedFlashcards);
      masteredArticleRef.current = new Set(nextProgress.articleMasteredIds);
      masteredQuizRef.current = new Set(nextProgress.quizMasteredIds);
      masteredListeningRef.current = new Set(nextProgress.listeningMasteredIds);
      masteredReadingRef.current = new Set(nextProgress.readingMasteredIds);
      masteredWritingRef.current = new Set(nextProgress.writingMasteredIds);
      masteredSpeakingRef.current = new Set(nextProgress.speakingMasteredIds);
      masteredActivityRef.current = new Set(nextProgress.activityMasteredIds);
      completedAssignmentRef.current = new Set(nextProgress.assignmentCompletedIds);
      teachingMilestoneRef.current = new Set(nextProgress.teachingMilestoneIds);

      a2FlashcardsRef.current = new Set(nextA2Progress.studiedFlashcards);
      a2ArticlePluralRef.current = new Set(nextA2Progress.articlePluralMasteredIds);
      a2MeaningRef.current = new Set(nextA2Progress.meaningMasteredIds);
      a2ContextRef.current = new Set(nextA2Progress.contextMasteredIds);
      a2ListeningRef.current = new Set(nextA2Progress.listeningMasteredIds);
      a2ReadingRef.current = new Set(nextA2Progress.readingMasteredIds);
      a2WritingRef.current = new Set(nextA2Progress.writingMasteredIds);
      a2SpeakingRef.current = new Set(nextA2Progress.speakingMasteredIds);
      a2ActivityRef.current = new Set(nextA2Progress.activityMasteredIds);

      setStorageWarning(null);
      setProgress(nextProgress);
      if (payload.a2Progress || mode === 'replace') {
        setA2Progress(nextA2Progress);
      }

      if (payload.prefs) {
        setPrefs((prev) => ({
          displayName:
            mode === 'replace' && payload.prefs?.displayName !== undefined
              ? payload.prefs.displayName
              : prev.displayName || payload.prefs?.displayName || '',
          rolePreview:
            mode === 'replace' && payload.prefs?.rolePreview
              ? payload.prefs.rolePreview
              : prev.rolePreview,
          speechSpeed:
            mode === 'replace' && payload.prefs?.speechSpeed
              ? payload.prefs.speechSpeed
              : prev.speechSpeed,
          activeCourse:
            mode === 'replace' && payload.prefs?.activeCourse
              ? payload.prefs.activeCourse
              : prev.activeCourse,
          uiLanguage: prev.uiLanguage,
        }));
        if (mode === 'replace' && payload.prefs.theme) {
          setThemeState(payload.prefs.theme);
        }
      }

      return {
        xpBefore,
        xpAfter: nextProgress.xp,
        a2XpBefore,
        a2XpAfter: nextA2Progress.xp,
        mode,
      };
    },
    [progress, a2Progress]
  );

  const resetProgress = useCallback(() => {
    studiedFlashcardsRef.current.clear();
    masteredArticleRef.current.clear();
    masteredQuizRef.current.clear();
    masteredListeningRef.current.clear();
    masteredReadingRef.current.clear();
    masteredWritingRef.current.clear();
    masteredSpeakingRef.current.clear();
    masteredActivityRef.current.clear();
    completedAssignmentRef.current.clear();
    teachingMilestoneRef.current.clear();
    setStorageWarning(null);
    setProgress(INITIAL_PROGRESS);
    platformServices.progressSync.clearProgress();
  }, []);

  const resetA2Progress = useCallback(() => {
    a2FlashcardsRef.current.clear();
    a2ArticlePluralRef.current.clear();
    a2MeaningRef.current.clear();
    a2ContextRef.current.clear();
    a2ListeningRef.current.clear();
    a2ReadingRef.current.clear();
    a2WritingRef.current.clear();
    a2SpeakingRef.current.clear();
    a2ActivityRef.current.clear();
    a2SkipInitialWriteRef.current = true;
    setStorageWarning(null);
    setA2Progress({ ...INITIAL_A2_PROGRESS });
    clearA2ProgressFromStorage();
  }, []);

  const resetAllLocalData = useCallback(() => {
    studiedFlashcardsRef.current.clear();
    masteredArticleRef.current.clear();
    masteredQuizRef.current.clear();
    masteredListeningRef.current.clear();
    masteredReadingRef.current.clear();
    masteredWritingRef.current.clear();
    masteredSpeakingRef.current.clear();
    masteredActivityRef.current.clear();
    completedAssignmentRef.current.clear();
    teachingMilestoneRef.current.clear();
    a2FlashcardsRef.current.clear();
    a2ArticlePluralRef.current.clear();
    a2MeaningRef.current.clear();
    a2ContextRef.current.clear();
    a2ListeningRef.current.clear();
    a2ReadingRef.current.clear();
    a2WritingRef.current.clear();
    a2SpeakingRef.current.clear();
    a2ActivityRef.current.clear();
    a2SkipInitialWriteRef.current = true;
    setStorageWarning(null);
    setProgress(INITIAL_PROGRESS);
    setA2Progress({ ...INITIAL_A2_PROGRESS });
    setPrefs(DEFAULT_LOCAL_PREFS);
    platformServices.progressSync.clearProgress();
    clearA2ProgressFromStorage();
    platformServices.auth.clearPrefs();
    clearSyncMeta();
    localUpdatedAtRef.current = null;
    setLastCloudSyncAt(null);
  }, []);

  const buildCurrentCloudSnapshot = useCallback(
    (overrideUpdatedAt?: string): CloudStateSnapshot => {
      const { theme: curTheme, prefs: curPrefs, progress: curA1, a2Progress: curA2 } =
        latestStateRef.current;
      const updatedAt =
        overrideUpdatedAt ?? localUpdatedAtRef.current ?? new Date().toISOString();
      return {
        updatedAt,
        schemaVersion: TK_BACKUP_SCHEMA_VERSION,
        prefs: {
          ...curPrefs,
          theme: curTheme,
        },
        progressA1: curA1,
        progressA2: curA2,
      };
    },
    []
  );

  const applyCloudSnapshotLocally = useCallback(
    (snapshot: CloudStateSnapshot, userId: string) => {
      suppressAutoPushRef.current = true;

      studiedFlashcardsRef.current = new Set(snapshot.progressA1.studiedFlashcards);
      masteredArticleRef.current = new Set(snapshot.progressA1.articleMasteredIds);
      masteredQuizRef.current = new Set(snapshot.progressA1.quizMasteredIds);
      masteredListeningRef.current = new Set(snapshot.progressA1.listeningMasteredIds);
      masteredReadingRef.current = new Set(snapshot.progressA1.readingMasteredIds);
      masteredWritingRef.current = new Set(snapshot.progressA1.writingMasteredIds);
      masteredSpeakingRef.current = new Set(snapshot.progressA1.speakingMasteredIds);
      masteredActivityRef.current = new Set(snapshot.progressA1.activityMasteredIds);
      completedAssignmentRef.current = new Set(snapshot.progressA1.assignmentCompletedIds);
      teachingMilestoneRef.current = new Set(snapshot.progressA1.teachingMilestoneIds);

      a2FlashcardsRef.current = new Set(snapshot.progressA2.studiedFlashcards);
      a2ArticlePluralRef.current = new Set(snapshot.progressA2.articlePluralMasteredIds);
      a2MeaningRef.current = new Set(snapshot.progressA2.meaningMasteredIds);
      a2ContextRef.current = new Set(snapshot.progressA2.contextMasteredIds);
      a2ListeningRef.current = new Set(snapshot.progressA2.listeningMasteredIds);
      a2ReadingRef.current = new Set(snapshot.progressA2.readingMasteredIds);
      a2WritingRef.current = new Set(snapshot.progressA2.writingMasteredIds);
      a2SpeakingRef.current = new Set(snapshot.progressA2.speakingMasteredIds);
      a2ActivityRef.current = new Set(snapshot.progressA2.activityMasteredIds);

      setProgress(snapshot.progressA1);
      setA2Progress(snapshot.progressA2);
      setPrefs({
        displayName: snapshot.prefs.displayName,
        rolePreview: snapshot.prefs.rolePreview,
        speechSpeed: snapshot.prefs.speechSpeed,
        activeCourse: snapshot.prefs.activeCourse,
        uiLanguage: snapshot.prefs.uiLanguage,
      });
      setThemeState(snapshot.prefs.theme);

      localUpdatedAtRef.current = snapshot.updatedAt;
      const syncStamp = new Date().toISOString();
      setLastCloudSyncAt(syncStamp);
      writeSyncMeta({
        localUpdatedAt: snapshot.updatedAt,
        lastCloudSyncAt: syncStamp,
        lastSyncedUserId: userId,
      });

      window.setTimeout(() => {
        suppressAutoPushRef.current = false;
      }, 300);
    },
    []
  );

  const pushToCloud = useCallback(async () => {
    const session = latestStateRef.current.cloudUser;
    if (!cloudConfigured || !session) {
      return {
        ok: false,
        summaryTr: 'Bulut oturumu aktif değil; veriler yerel depolamada güvende.',
        summaryEn: 'No active cloud session; your data remains safe locally.',
      };
    }
    if (!isBrowserOnline()) {
      setCloudSyncStatus('offline');
      return {
        ok: false,
        summaryTr: 'Çevrimdışı durumdasınız; yerel kayıt aktif.',
        summaryEn: 'You are offline; local storage remains active.',
      };
    }

    setCloudSyncStatus('syncing');
    setCloudSyncError(null);
    const nowIso = new Date().toISOString();
    const snapshot = buildCurrentCloudSnapshot(nowIso);
    const res = await pushCloudState(session, snapshot);

    if (!res.ok) {
      setCloudSyncStatus(isBrowserOnline() ? 'error' : 'offline');
      setCloudSyncError(res.errorTr ?? 'Bulut gönderimi başarısız.');
      return {
        ok: false,
        summaryTr: res.errorTr ?? 'Buluta gönderilemedi.',
        summaryEn: res.errorEn ?? 'Could not push to cloud.',
      };
    }

    const finalStamp = res.updatedAt ?? nowIso;
    localUpdatedAtRef.current = finalStamp;
    setLastCloudSyncAt(finalStamp);
    writeSyncMeta({
      localUpdatedAt: finalStamp,
      lastCloudSyncAt: finalStamp,
      lastSyncedUserId: session.userId,
    });
    setCloudSyncStatus('synced');
    return {
      ok: true,
      summaryTr: 'Yerel veriler buluta başarıyla gönderildi.',
      summaryEn: 'Local data pushed to cloud successfully.',
    };
  }, [cloudConfigured, buildCurrentCloudSnapshot]);

  const pullFromCloud = useCallback(async () => {
    const session = latestStateRef.current.cloudUser;
    if (!cloudConfigured || !session) {
      return {
        ok: false,
        summaryTr: 'Bulut oturumu aktif değil.',
        summaryEn: 'No active cloud session.',
      };
    }
    if (!isBrowserOnline()) {
      setCloudSyncStatus('offline');
      return {
        ok: false,
        summaryTr: 'Çevrimdışı durumdasınız; buluttan çekilemedi.',
        summaryEn: 'You are offline; unable to pull from cloud.',
      };
    }

    setCloudSyncStatus('syncing');
    setCloudSyncError(null);
    const res = await pullCloudState(session.userId);
    if (!res.ok) {
      setCloudSyncStatus(isBrowserOnline() ? 'error' : 'offline');
      setCloudSyncError(res.errorTr ?? 'Buluttan veri çekilemedi.');
      return {
        ok: false,
        summaryTr: res.errorTr ?? 'Buluttan veri çekilemedi.',
        summaryEn: res.errorEn ?? 'Could not pull cloud data.',
      };
    }

    if (!res.snapshot) {
      setCloudSyncStatus('synced');
      return {
        ok: true,
        summaryTr: 'Bulutta henüz kayıt bulunamadı; yerel veriniz korundu.',
        summaryEn: 'No cloud record found yet; your local data was kept.',
      };
    }

    applyCloudSnapshotLocally(res.snapshot, session.userId);
    setCloudSyncStatus('synced');
    return {
      ok: true,
      summaryTr: 'Bulut verisi çekildi ve yerel oturuma uygulandı.',
      summaryEn: 'Cloud data pulled and applied locally.',
    };
  }, [cloudConfigured, applyCloudSnapshotLocally]);

  const syncCloudWithSession = useCallback(
    async (session: CloudUserSession) => {
      if (!cloudConfigured) {
        setCloudSyncStatus('local');
        return {
          ok: false,
          summaryTr: 'Bulut bağlantısı yapılandırılmadı; yerel mod aktif.',
          summaryEn: 'Cloud sync is not configured; local mode is active.',
        };
      }
      if (!isBrowserOnline()) {
        setCloudSyncStatus('offline');
        return {
          ok: false,
          summaryTr: 'Çevrimdışı durumdasınız; yerel veriniz güvende.',
          summaryEn: 'You are offline; your local data is safe.',
        };
      }

      setCloudSyncStatus('syncing');
      setCloudSyncError(null);

      const pulled = await pullCloudState(session.userId);
      if (!pulled.ok) {
        setCloudSyncStatus(isBrowserOnline() ? 'error' : 'offline');
        setCloudSyncError(pulled.errorTr ?? 'Bulut eşitleme hatası.');
        return {
          ok: false,
          summaryTr: pulled.errorTr ?? 'Bulut eşitleme hatası.',
          summaryEn: pulled.errorEn ?? 'Cloud sync failed.',
        };
      }

      const localSnapshot = buildCurrentCloudSnapshot(
        localUpdatedAtRef.current ?? new Date(0).toISOString()
      );

      if (!pulled.snapshot) {
        const freshIso = new Date().toISOString();
        const pushRes = await pushCloudState(session, { ...localSnapshot, updatedAt: freshIso });
        if (!pushRes.ok) {
          setCloudSyncStatus(isBrowserOnline() ? 'error' : 'offline');
          setCloudSyncError(pushRes.errorTr ?? 'Buluta ilk gönderim başarısız.');
          return {
            ok: false,
            summaryTr: pushRes.errorTr ?? 'Buluta ilk gönderim başarısız.',
            summaryEn: pushRes.errorEn ?? 'Initial cloud upload failed.',
          };
        }
        const stamp = pushRes.updatedAt ?? freshIso;
        localUpdatedAtRef.current = stamp;
        setLastCloudSyncAt(stamp);
        writeSyncMeta({
          localUpdatedAt: stamp,
          lastCloudSyncAt: stamp,
          lastSyncedUserId: session.userId,
        });
        setCloudSyncStatus('synced');
        return {
          ok: true,
          summaryTr: 'Yerel verileriniz buluta ilk kez eşitlendi.',
          summaryEn: 'Your local progress was uploaded to the cloud for the first time.',
        };
      }

      const reconciled = reconcileCloudAndLocal(localSnapshot, pulled.snapshot);
      const mergedSnapshot: CloudStateSnapshot = {
        updatedAt: reconciled.resolvedUpdatedAt,
        schemaVersion: TK_BACKUP_SCHEMA_VERSION,
        prefs: reconciled.mergedPrefs,
        progressA1: reconciled.mergedProgressA1,
        progressA2: reconciled.mergedProgressA2,
      };

      if (reconciled.shouldApplyToLocal) {
        applyCloudSnapshotLocally(mergedSnapshot, session.userId);
      }

      if (reconciled.shouldPushToRemote) {
        const pushRes = await pushCloudState(session, mergedSnapshot);
        if (!pushRes.ok) {
          setCloudSyncStatus(isBrowserOnline() ? 'error' : 'offline');
          setCloudSyncError(pushRes.errorTr ?? 'Birleştirilmiş veri buluta gönderilemedi.');
          return {
            ok: false,
            summaryTr: pushRes.errorTr ?? 'Birleştirilmiş veri buluta gönderilemedi.',
            summaryEn: pushRes.errorEn ?? 'Could not push merged state to cloud.',
          };
        }
      }

      const stamp = new Date().toISOString();
      localUpdatedAtRef.current = mergedSnapshot.updatedAt;
      setLastCloudSyncAt(stamp);
      writeSyncMeta({
        localUpdatedAt: mergedSnapshot.updatedAt,
        lastCloudSyncAt: stamp,
        lastSyncedUserId: session.userId,
      });
      setCloudSyncStatus('synced');

      if (reconciled.winner === 'remote') {
        return {
          ok: true,
          summaryTr: 'Bulut kaydı daha günceldi; çakışmasız birleştirilip eşitlendi.',
          summaryEn: 'Cloud record was newer; merged safely and synced.',
        };
      }
      if (reconciled.winner === 'local') {
        return {
          ok: true,
          summaryTr: 'Yerel kaydınız daha günceldi; bulutla güvenli biçimde eşitlendi.',
          summaryEn: 'Local record was newer; merged safely and pushed to cloud.',
        };
      }
      return {
        ok: true,
        summaryTr: 'Yerel ve bulut verileriniz güncel ve senkronize.',
        summaryEn: 'Local and cloud records are up to date.',
      };
    },
    [cloudConfigured, buildCurrentCloudSnapshot, applyCloudSnapshotLocally]
  );

  const syncCloudNow = useCallback(async () => {
    const session = latestStateRef.current.cloudUser;
    if (!session) {
      return {
        ok: false,
        summaryTr: 'Eşitleme için önce bulut hesabıyla giriş yapın.',
        summaryEn: 'Sign in with a cloud account to sync.',
      };
    }
    return syncCloudWithSession(session);
  }, [syncCloudWithSession]);

  const cloudSignIn = useCallback(
    async (email: string, password: string): Promise<CloudAuthResult> => {
      const res = await signInCloudWithEmail(email, password);
      if (res.ok && res.session) {
        setCloudUser(res.session);
        lastAutoSyncedUserRef.current = res.session.userId;
        await syncCloudWithSession(res.session);
      }
      return res;
    },
    [syncCloudWithSession]
  );

  const cloudSignUp = useCallback(
    async (
      email: string,
      password: string,
      displayNameInput: string,
      roleInput: UserRole
    ): Promise<CloudAuthResult> => {
      if (displayNameInput.trim()) {
        setPrefs((prev) => ({
          ...prev,
          displayName: displayNameInput.trim().slice(0, 48),
          rolePreview: roleInput,
        }));
      }
      const res = await signUpCloudWithEmail(email, password, displayNameInput, roleInput);
      if (res.ok && res.session && !res.needsEmailConfirmation) {
        setCloudUser(res.session);
        lastAutoSyncedUserRef.current = res.session.userId;
        await syncCloudWithSession(res.session);
      }
      return res;
    },
    [syncCloudWithSession]
  );

  const cloudSignOut = useCallback(async () => {
    if (autoPushTimerRef.current !== null) {
      window.clearTimeout(autoPushTimerRef.current);
      autoPushTimerRef.current = null;
    }
    await signOutCloud();
    lastAutoSyncedUserRef.current = null;
    setCloudUser(null);
    setCloudSyncError(null);
    setCloudSyncStatus(isBrowserOnline() ? 'local' : 'offline');
  }, []);

  // Initialize Supabase session listener & online/offline handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      if (latestStateRef.current.cloudUser) {
        void syncCloudWithSession(latestStateRef.current.cloudUser);
      } else {
        setCloudSyncStatus('local');
      }
    };
    const handleOffline = () => {
      setCloudSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let unsubscribe = () => {};
    if (cloudConfigured) {
      void getCurrentCloudSession().then((session) => {
        if (session) {
          setCloudUser(session);
          if (lastAutoSyncedUserRef.current !== session.userId) {
            lastAutoSyncedUserRef.current = session.userId;
            void syncCloudWithSession(session);
          }
        }
      });

      unsubscribe = subscribeCloudAuth((session) => {
        setCloudUser(session);
        if (session) {
          if (lastAutoSyncedUserRef.current !== session.userId) {
            lastAutoSyncedUserRef.current = session.userId;
            void syncCloudWithSession(session);
          }
        } else {
          lastAutoSyncedUserRef.current = null;
          setCloudSyncStatus(isBrowserOnline() ? 'local' : 'offline');
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, [cloudConfigured, syncCloudWithSession]);

  // Track localUpdatedAt & debounced auto-push when signed in
  useEffect(() => {
    if (!hasMountedSyncRef.current) {
      hasMountedSyncRef.current = true;
      return;
    }
    if (suppressAutoPushRef.current) {
      return;
    }

    const nowIso = new Date().toISOString();
    localUpdatedAtRef.current = nowIso;
    writeSyncMeta({
      localUpdatedAt: nowIso,
      lastCloudSyncAt: readSyncMeta().lastCloudSyncAt,
      lastSyncedUserId: cloudUser?.userId ?? readSyncMeta().lastSyncedUserId,
    });

    if (!cloudConfigured || !cloudUser) return;
    if (!isBrowserOnline()) {
      setCloudSyncStatus('offline');
      return;
    }

    if (autoPushTimerRef.current !== null) {
      window.clearTimeout(autoPushTimerRef.current);
    }
    autoPushTimerRef.current = window.setTimeout(() => {
      autoPushTimerRef.current = null;
      void pushToCloud();
    }, 2200);

    return () => {
      if (autoPushTimerRef.current !== null) {
        window.clearTimeout(autoPushTimerRef.current);
        autoPushTimerRef.current = null;
      }
    };
  }, [progress, a2Progress, prefs, theme, cloudConfigured, cloudUser, pushToCloud]);

  const uniqueCompletedWordIds = useMemo(() => {
    const set = new Set<string>([
      ...progress.studiedFlashcards,
      ...progress.articleMasteredIds,
      ...progress.quizMasteredIds,
    ]);
    return Array.from(set);
  }, [progress.studiedFlashcards, progress.articleMasteredIds, progress.quizMasteredIds]);

  const uniqueA2CompletedWordIds = useMemo(
    () => getUniqueA2CompletedWordIds(a2Progress),
    [a2Progress]
  );

  const vocabAccuracyPercent = useMemo(() => {
    const totalAttempts = progress.articleAttempts + progress.quizAttempts;
    if (totalAttempts === 0) return null;
    const totalCorrect = progress.articleCorrect + progress.quizCorrect;
    return Math.round((totalCorrect / totalAttempts) * 100);
  }, [
    progress.articleAttempts,
    progress.articleCorrect,
    progress.quizAttempts,
    progress.quizCorrect,
  ]);

  const a2VocabAccuracyPercent = useMemo(() => {
    const totalAttempts =
      a2Progress.articlePluralAttempts + a2Progress.meaningAttempts + a2Progress.contextAttempts;
    if (totalAttempts === 0) return null;
    const totalCorrect =
      a2Progress.articlePluralCorrect + a2Progress.meaningCorrect + a2Progress.contextCorrect;
    return Math.round((totalCorrect / totalAttempts) * 100);
  }, [
    a2Progress.articlePluralAttempts,
    a2Progress.articlePluralCorrect,
    a2Progress.meaningAttempts,
    a2Progress.meaningCorrect,
    a2Progress.contextAttempts,
    a2Progress.contextCorrect,
  ]);

  const a2ListeningAccuracyPercent = useMemo(() => {
    if (a2Progress.listeningAttempts === 0) return null;
    return Math.round((a2Progress.listeningCorrect / a2Progress.listeningAttempts) * 100);
  }, [a2Progress.listeningAttempts, a2Progress.listeningCorrect]);

  const a2ReadingAccuracyPercent = useMemo(() => {
    if (a2Progress.readingAttempts === 0) return null;
    return Math.round((a2Progress.readingCorrect / a2Progress.readingAttempts) * 100);
  }, [a2Progress.readingAttempts, a2Progress.readingCorrect]);

  const a2WritingAccuracyPercent = useMemo(() => {
    if (a2Progress.writingAttempts === 0) return null;
    return Math.round((a2Progress.writingCorrect / a2Progress.writingAttempts) * 100);
  }, [a2Progress.writingAttempts, a2Progress.writingCorrect]);

  const a2ActivityAccuracyPercent = useMemo(() => {
    if (a2Progress.activityAttempts === 0) return null;
    return Math.round((a2Progress.activityCorrect / a2Progress.activityAttempts) * 100);
  }, [a2Progress.activityAttempts, a2Progress.activityCorrect]);

  const a2OverallAccuracyPercent = useMemo(() => {
    // Strictly scored A2 attempts only — never inflate with non-scored flashcards, speaking, karaoke, or classroom acting marks
    const totalAttempts =
      a2Progress.articlePluralAttempts +
      a2Progress.meaningAttempts +
      a2Progress.contextAttempts +
      a2Progress.listeningAttempts +
      a2Progress.readingAttempts +
      a2Progress.writingAttempts +
      a2Progress.activityAttempts;
    if (totalAttempts === 0) return null;
    const totalCorrect =
      a2Progress.articlePluralCorrect +
      a2Progress.meaningCorrect +
      a2Progress.contextCorrect +
      a2Progress.listeningCorrect +
      a2Progress.readingCorrect +
      a2Progress.writingCorrect +
      a2Progress.activityCorrect;
    return Math.round((totalCorrect / totalAttempts) * 100);
  }, [
    a2Progress.articlePluralAttempts,
    a2Progress.articlePluralCorrect,
    a2Progress.meaningAttempts,
    a2Progress.meaningCorrect,
    a2Progress.contextAttempts,
    a2Progress.contextCorrect,
    a2Progress.listeningAttempts,
    a2Progress.listeningCorrect,
    a2Progress.readingAttempts,
    a2Progress.readingCorrect,
    a2Progress.writingAttempts,
    a2Progress.writingCorrect,
    a2Progress.activityAttempts,
    a2Progress.activityCorrect,
  ]);

  const listeningAccuracyPercent = useMemo(() => {
    if (progress.listeningAttempts === 0) return null;
    return Math.round((progress.listeningCorrect / progress.listeningAttempts) * 100);
  }, [progress.listeningAttempts, progress.listeningCorrect]);

  const readingAccuracyPercent = useMemo(() => {
    if (progress.readingAttempts === 0) return null;
    return Math.round((progress.readingCorrect / progress.readingAttempts) * 100);
  }, [progress.readingAttempts, progress.readingCorrect]);

  const writingAccuracyPercent = useMemo(() => {
    if (progress.writingAttempts === 0) return null;
    return Math.round((progress.writingCorrect / progress.writingAttempts) * 100);
  }, [progress.writingAttempts, progress.writingCorrect]);

  const activityAccuracyPercent = useMemo(() => {
    if (progress.activityAttempts === 0) return null;
    return Math.round((progress.activityCorrect / progress.activityAttempts) * 100);
  }, [progress.activityAttempts, progress.activityCorrect]);

  const overallAccuracyPercent = useMemo(() => {
    const totalAttempts =
      progress.articleAttempts +
      progress.quizAttempts +
      progress.listeningAttempts +
      progress.readingAttempts +
      progress.writingAttempts +
      progress.activityAttempts;
    if (totalAttempts === 0) return null;
    const totalCorrect =
      progress.articleCorrect +
      progress.quizCorrect +
      progress.listeningCorrect +
      progress.readingCorrect +
      progress.writingCorrect +
      progress.activityCorrect;
    return Math.round((totalCorrect / totalAttempts) * 100);
  }, [
    progress.articleAttempts,
    progress.articleCorrect,
    progress.quizAttempts,
    progress.quizCorrect,
    progress.listeningAttempts,
    progress.listeningCorrect,
    progress.readingAttempts,
    progress.readingCorrect,
    progress.writingAttempts,
    progress.writingCorrect,
    progress.activityAttempts,
    progress.activityCorrect,
  ]);

  const value = useMemo<AppStateContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      rolePreview: prefs.rolePreview,
      setRolePreview,
      speechSpeed: prefs.speechSpeed,
      setSpeechSpeed,
      displayName: prefs.displayName,
      setDisplayName,
      activeCourse: prefs.activeCourse,
      setActiveCourse,
      uiLanguage: prefs.uiLanguage,
      setUiLanguage,
      toggleUiLanguage,
      progress,
      a2Progress,
      uniqueCompletedWordIds,
      uniqueA2CompletedWordIds,
      overallAccuracyPercent,
      vocabAccuracyPercent,
      a2VocabAccuracyPercent,
      a2ListeningAccuracyPercent,
      a2ReadingAccuracyPercent,
      a2WritingAccuracyPercent,
      a2ActivityAccuracyPercent,
      a2OverallAccuracyPercent,
      listeningAccuracyPercent,
      readingAccuracyPercent,
      writingAccuracyPercent,
      activityAccuracyPercent,
      recordFlashcardStudied,
      recordArticleAnswer,
      recordQuizAnswer,
      recordMemoryRoundComplete,
      recordA2FlashcardStudied,
      recordA2ArticlePluralAnswer,
      recordA2MeaningAnswer,
      recordA2ContextAnswer,
      recordA2ListeningAnswer,
      recordA2ReadingAnswer,
      recordA2WritingAnswer,
      recordA2SpeakingCompletion,
      recordA2KaraokeCompletion,
      recordA2ActivityAnswer,
      recordA2ExamSubmission,
      recordListeningAnswer,
      recordReadingAnswer,
      recordWritingAnswer,
      recordSpeakingCompletion,
      recordKaraokeCompletion,
      recordActivityAnswer,
      recordExamSubmission,
      createTeachingClass,
      deleteTeachingClass,
      addClassRosterEntry,
      removeClassRosterEntry,
      createTeachingAssignment,
      toggleAssignmentCompleted,
      updateAssignmentReview,
      deleteTeachingAssignment,
      saveStudioDraft,
      deleteStudioDraft,
      toggleStudioDraftItem,
      importLocalData,
      lastSavedAt,
      storageWarning,
      dismissStorageWarning,
      cloudConfigured,
      cloudUser,
      cloudSyncStatus,
      lastCloudSyncAt,
      cloudSyncError,
      cloudSignIn,
      cloudSignUp,
      cloudSignOut,
      syncCloudNow,
      pullFromCloud,
      pushToCloud,
      resetProgress,
      resetA2Progress,
      resetAllLocalData,
    }),
    [
      theme,
      toggleTheme,
      setTheme,
      prefs.rolePreview,
      setRolePreview,
      prefs.speechSpeed,
      setSpeechSpeed,
      prefs.displayName,
      setDisplayName,
      prefs.activeCourse,
      setActiveCourse,
      prefs.uiLanguage,
      setUiLanguage,
      toggleUiLanguage,
      progress,
      a2Progress,
      uniqueCompletedWordIds,
      uniqueA2CompletedWordIds,
      overallAccuracyPercent,
      vocabAccuracyPercent,
      a2VocabAccuracyPercent,
      a2ListeningAccuracyPercent,
      a2ReadingAccuracyPercent,
      a2WritingAccuracyPercent,
      a2ActivityAccuracyPercent,
      a2OverallAccuracyPercent,
      listeningAccuracyPercent,
      readingAccuracyPercent,
      writingAccuracyPercent,
      activityAccuracyPercent,
      recordFlashcardStudied,
      recordArticleAnswer,
      recordQuizAnswer,
      recordMemoryRoundComplete,
      recordA2FlashcardStudied,
      recordA2ArticlePluralAnswer,
      recordA2MeaningAnswer,
      recordA2ContextAnswer,
      recordA2ListeningAnswer,
      recordA2ReadingAnswer,
      recordA2WritingAnswer,
      recordA2SpeakingCompletion,
      recordA2KaraokeCompletion,
      recordA2ActivityAnswer,
      recordA2ExamSubmission,
      recordListeningAnswer,
      recordReadingAnswer,
      recordWritingAnswer,
      recordSpeakingCompletion,
      recordKaraokeCompletion,
      recordActivityAnswer,
      recordExamSubmission,
      createTeachingClass,
      deleteTeachingClass,
      addClassRosterEntry,
      removeClassRosterEntry,
      createTeachingAssignment,
      toggleAssignmentCompleted,
      updateAssignmentReview,
      deleteTeachingAssignment,
      saveStudioDraft,
      deleteStudioDraft,
      toggleStudioDraftItem,
      importLocalData,
      lastSavedAt,
      storageWarning,
      dismissStorageWarning,
      cloudConfigured,
      cloudUser,
      cloudSyncStatus,
      lastCloudSyncAt,
      cloudSyncError,
      cloudSignIn,
      cloudSignUp,
      cloudSignOut,
      syncCloudNow,
      pullFromCloud,
      pushToCloud,
      resetProgress,
      resetA2Progress,
      resetAllLocalData,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return ctx;
}
