import type {
  ActiveCourseId,
  CourseId,
  ProgressState,
  SpeechSpeed,
  StudioDraft,
  TeachingAssignment,
  TeachingClassGroup,
  ThemeMode,
  UiLanguage,
  UserRole,
} from '../types';
import type {
  BackupValidationResult,
  LocalBackupPrefs,
  TeachersKingdomBackupV1,
} from '../utils/dataPortability';

export type AdapterRuntimeMode = 'local-only' | 'backend-ready';

export interface LocalUserPrefs {
  rolePreview: UserRole;
  speechSpeed: SpeechSpeed;
  displayName: string;
  activeCourse: ActiveCourseId;
  uiLanguage: UiLanguage;
}

export interface AuthSessionSnapshot {
  mode: AdapterRuntimeMode;
  providerId: string;
  providerLabelTr: string;
  isRemoteAuthConnected: boolean;
  displayName: string;
  rolePreview: UserRole;
  scopeNoteTr: string;
}

export interface AuthServiceAdapter {
  readonly id: string;
  readonly runtimeMode: AdapterRuntimeMode;
  readonly isRemoteAuthConnected: boolean;
  readonly prefsStorageKey: string;
  readonly themeStorageKey: string;
  readPrefs: () => LocalUserPrefs;
  writePrefs: (prefs: LocalUserPrefs) => { ok: boolean };
  clearPrefs: () => void;
  readTheme: () => ThemeMode;
  writeTheme: (theme: ThemeMode) => { ok: boolean };
  getSessionSnapshot: (prefs: LocalUserPrefs) => AuthSessionSnapshot;
}

export interface ProgressLoadOutcome {
  progress: ProgressState;
  sourceStageHint: 'empty' | 'legacy-stage1-6' | 'current-v1' | 'recovered-default';
  warningTr: string | null;
}

export interface SyncStatusSnapshot {
  runtimeMode: AdapterRuntimeMode;
  providerId: string;
  providerLabelTr: string;
  isRemoteSyncConnected: boolean;
  activeCourse: CourseId;
  storageKey: string;
  schemaVersion: number;
  lastLocalSaveAt: string | null;
  pendingRemoteQueueCount: number;
}

export interface ProgressSyncServiceAdapter {
  readonly id: string;
  readonly runtimeMode: AdapterRuntimeMode;
  readonly isRemoteSyncConnected: boolean;
  readonly storageKey: string;
  readonly schemaVersion: number;
  loadProgress: (initialFallback: ProgressState) => ProgressLoadOutcome;
  saveProgress: (progress: ProgressState) => { ok: boolean; errorTr?: string };
  clearProgress: () => void;
  exportEnvelope: (progress: ProgressState, prefs: LocalBackupPrefs) => TeachersKingdomBackupV1;
  validateEnvelope: (rawJson: string) => BackupValidationResult;
  reconcileProgress: (current: ProgressState, incoming: ProgressState) => ProgressState;
  getSyncStatus: (lastLocalSaveAt: string | null) => SyncStatusSnapshot;
}

export interface ClassroomBundleSnapshot {
  exportedAt: string;
  course: CourseId;
  runtimeMode: AdapterRuntimeMode;
  classes: TeachingClassGroup[];
  assignments: TeachingAssignment[];
  studioDrafts: StudioDraft[];
}

export interface ClassroomPersistenceAdapter {
  readonly id: string;
  readonly runtimeMode: AdapterRuntimeMode;
  readonly isMultiUserSynced: boolean;
  readonly scopeNoteTr: string;
  createLocalSnapshot: (progress: ProgressState) => ClassroomBundleSnapshot;
}

export interface PlatformServiceRegistry {
  auth: AuthServiceAdapter;
  progressSync: ProgressSyncServiceAdapter;
  classroom: ClassroomPersistenceAdapter;
}
