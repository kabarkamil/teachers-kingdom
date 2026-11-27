import type { ProgressState, ThemeMode } from '../types';
import {
  STORAGE_KEY_PREFS,
  STORAGE_KEY_STATE,
  STORAGE_KEY_THEME,
  createBackupEnvelope,
  mergeProgressSafely,
  parseAndValidateBackup,
  type LocalBackupPrefs,
} from '../utils/dataPortability';
import type {
  AuthServiceAdapter,
  ClassroomPersistenceAdapter,
  LocalUserPrefs,
  PlatformServiceRegistry,
  ProgressSyncServiceAdapter,
} from './contracts';
import { PROGRESS_SCHEMA_VERSION, migrateRawProgressRecord } from './schemaMigration';

export const DEFAULT_LOCAL_PREFS: LocalUserPrefs = {
  rolePreview: 'student',
  speechSpeed: 'normal',
  displayName: '',
  activeCourse: 'de-A1',
  uiLanguage: 'tr',
};

export const localAuthService: AuthServiceAdapter = {
  id: 'local-browser-profile-v1',
  runtimeMode: 'local-only',
  isRemoteAuthConnected: false,
  prefsStorageKey: STORAGE_KEY_PREFS,
  themeStorageKey: STORAGE_KEY_THEME,

  readPrefs(): LocalUserPrefs {
    if (typeof window === 'undefined') return DEFAULT_LOCAL_PREFS;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_PREFS);
      if (!raw) return DEFAULT_LOCAL_PREFS;
      const parsed = JSON.parse(raw) as Partial<LocalUserPrefs>;
      return {
        rolePreview: parsed.rolePreview === 'teacher' ? 'teacher' : 'student',
        speechSpeed: parsed.speechSpeed === 'slow' ? 'slow' : 'normal',
        displayName:
          typeof parsed.displayName === 'string' ? parsed.displayName.trim().slice(0, 48) : '',
        activeCourse: parsed.activeCourse === 'de-A2' ? 'de-A2' : 'de-A1',
        uiLanguage: parsed.uiLanguage === 'en' ? 'en' : 'tr',
      };
    } catch {
      return DEFAULT_LOCAL_PREFS;
    }
  },

  writePrefs(prefs: LocalUserPrefs): { ok: boolean } {
    if (typeof window === 'undefined') return { ok: false };
    try {
      window.localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
      return { ok: true };
    } catch {
      return { ok: false };
    }
  },

  clearPrefs(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_PREFS);
    } catch {
      // Ignore storage errors
    }
  },

  readTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore storage errors
    }
    return 'light';
  },

  writeTheme(theme: ThemeMode): { ok: boolean } {
    if (typeof window === 'undefined') return { ok: false };
    try {
      window.localStorage.setItem(STORAGE_KEY_THEME, theme);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  },

  getSessionSnapshot(prefs: LocalUserPrefs) {
    return {
      mode: 'local-only' as const,
      providerId: this.id,
      providerLabelTr: 'Yerel Tarayıcı Profili (Sunucu Oturumu Yok)',
      isRemoteAuthConnected: false,
      displayName: prefs.displayName,
      rolePreview: prefs.rolePreview,
      scopeNoteTr:
        'Görünen ad ve Öğrenci/Öğretmen rol önizlemesi yalnızca bu tarayıcıda tutulur; harici kimlik doğrulama servisi bağlı değildir.',
    };
  },
};

export const localProgressSyncService: ProgressSyncServiceAdapter = {
  id: 'local-storage-progress-v1',
  runtimeMode: 'local-only',
  isRemoteSyncConnected: false,
  storageKey: STORAGE_KEY_STATE,
  schemaVersion: PROGRESS_SCHEMA_VERSION,

  loadProgress(initialFallback: ProgressState) {
    if (typeof window === 'undefined') {
      return { progress: initialFallback, sourceStageHint: 'empty' as const, warningTr: null };
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_STATE);
      if (!raw) {
        return { progress: initialFallback, sourceStageHint: 'empty' as const, warningTr: null };
      }
      const parsed = JSON.parse(raw) as unknown;
      const migrated = migrateRawProgressRecord(parsed, initialFallback);
      return {
        progress: migrated.progress,
        sourceStageHint: migrated.sourceStageHint,
        warningTr: migrated.warningTr,
      };
    } catch {
      return {
        progress: initialFallback,
        sourceStageHint: 'recovered-default' as const,
        warningTr:
          'Tarayıcıdaki yerel ilerleme verisi okunamadı (bozuk JSON veya kısıtlı depolama). Uygulama güvenli varsayılanlarla açıldı.',
      };
    }
  },

  saveProgress(progress: ProgressState) {
    if (typeof window === 'undefined') {
      return { ok: false, errorTr: 'Tarayıcı yerel depolaması bu ortamda kullanılamıyor.' };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(progress));
      return { ok: true };
    } catch {
      return {
        ok: false,
        errorTr:
          'Tarayıcı yerel depolamasına yazılamadı (depolama kotası dolu veya gizli mod kısıtlı olabilir). Değişiklikler bu sekmede tutulur; verinizi JSON olarak yedeklemeniz önerilir.',
      };
    }
  },

  clearProgress() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY_STATE);
    } catch {
      // Ignore storage errors
    }
  },

  exportEnvelope(progress: ProgressState, prefs: LocalBackupPrefs) {
    return createBackupEnvelope(progress, prefs);
  },

  validateEnvelope(rawJson: string) {
    return parseAndValidateBackup(rawJson);
  },

  reconcileProgress(current: ProgressState, incoming: ProgressState) {
    return mergeProgressSafely(current, incoming);
  },

  getSyncStatus(lastLocalSaveAt: string | null) {
    return {
      runtimeMode: 'local-only' as const,
      providerId: this.id,
      providerLabelTr: 'Yerel Tarayıcı Depolaması (Bulut Bağlı Değil)',
      isRemoteSyncConnected: false,
      activeCourse: 'de-A1' as const,
      storageKey: STORAGE_KEY_STATE,
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      lastLocalSaveAt,
      pendingRemoteQueueCount: 0,
    };
  },
};

export const localClassroomService: ClassroomPersistenceAdapter = {
  id: 'local-classroom-store-v1',
  runtimeMode: 'local-only',
  isMultiUserSynced: false,
  scopeNoteTr:
    'Sınıflar, ödevler ve Öğretmen Stüdyosu taslakları tk_stage1_progress_v1 içinde yerel olarak tutulur; çevrimiçi çok kullanıcılı sınıf eşitlemesi için harici arka uç gerekir.',

  createLocalSnapshot(progress: ProgressState) {
    return {
      exportedAt: new Date().toISOString(),
      course: 'de-A1' as const,
      runtimeMode: 'local-only' as const,
      classes: progress.teachingClasses,
      assignments: progress.teachingAssignments,
      studioDrafts: progress.studioDrafts,
    };
  },
};

export const platformServices: PlatformServiceRegistry = {
  auth: localAuthService,
  progressSync: localProgressSyncService,
  classroom: localClassroomService,
};
