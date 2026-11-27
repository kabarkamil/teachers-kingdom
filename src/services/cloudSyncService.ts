import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  CloudUserSession,
  GermanA2ProgressState,
  ProgressState,
  ThemeMode,
  UiLanguage,
  UserRole,
} from '../types';
import {
  INITIAL_A2_PROGRESS,
  mergeA2ProgressSafely,
  sanitizeA2ProgressState,
} from '../utils/a2DataPortability';
import {
  TK_BACKUP_SCHEMA_VERSION,
  mergeProgressSafely,
  sanitizeProgressState,
} from '../utils/dataPortability';
import type { LocalUserPrefs } from './contracts';

export const STORAGE_KEY_SYNC_META = 'tk_stage1_sync_meta_v1';
const CLOUD_TABLE = 'user_cloud_states';

export interface CloudPrefsPayload extends LocalUserPrefs {
  theme: ThemeMode;
}

export interface CloudStateSnapshot {
  updatedAt: string;
  schemaVersion: number;
  prefs: CloudPrefsPayload;
  progressA1: ProgressState;
  progressA2: GermanA2ProgressState;
}

export interface LocalSyncMeta {
  localUpdatedAt: string | null;
  lastCloudSyncAt: string | null;
  lastSyncedUserId: string | null;
  autoPushPaused?: boolean;
}

export type CloudResetScope = 'a1' | 'a2' | 'all';

export interface CloudResetResult {
  ok: boolean;
  updatedAt?: string | null;
  errorTr?: string;
  errorEn?: string;
}

export interface AutoPushGuardInput {
  cloudConfigured: boolean;
  hasSession: boolean;
  isOnline: boolean;
  autoPushPaused: boolean;
  suppressAutoPush: boolean;
}

export function canAutoPushToCloud(input: AutoPushGuardInput): boolean {
  return (
    input.cloudConfigured &&
    input.hasSession &&
    input.isOnline &&
    !input.autoPushPaused &&
    !input.suppressAutoPush
  );
}

export interface CloudAuthResult {
  ok: boolean;
  session?: CloudUserSession;
  needsEmailConfirmation?: boolean;
  errorTr?: string;
  errorEn?: string;
}

export interface CloudPullResult {
  ok: boolean;
  snapshot: CloudStateSnapshot | null;
  errorTr?: string;
  errorEn?: string;
}

export interface CloudPushResult {
  ok: boolean;
  updatedAt?: string;
  errorTr?: string;
  errorEn?: string;
}

export interface ConflictReconciliationResult {
  winner: 'local' | 'remote' | 'equal';
  mergedPrefs: CloudPrefsPayload;
  mergedProgressA1: ProgressState;
  mergedProgressA2: GermanA2ProgressState;
  resolvedUpdatedAt: string;
  shouldApplyToLocal: boolean;
  shouldPushToRemote: boolean;
}

interface RawCloudRow {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role_preview: string | null;
  prefs: unknown;
  progress_a1: unknown;
  progress_a2: unknown;
  schema_version: number | null;
  updated_at: string | null;
}

let cachedClient: SupabaseClient | null = null;

function readSupabaseEnv(): { url: string; anonKey: string } {
  const rawUrl = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : '';
  const rawKey =
    typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';
  return {
    url: typeof rawUrl === 'string' ? rawUrl.trim() : '',
    anonKey: typeof rawKey === 'string' ? rawKey.trim() : '',
  };
}

export function isCloudConfigured(): boolean {
  const { url, anonKey } = readSupabaseEnv();
  return /^https?:\/\/.+/.test(url) && anonKey.length >= 16;
}

export function isBrowserOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

function getSupabaseClient(): SupabaseClient | null {
  if (!isCloudConfigured()) return null;
  if (!cachedClient) {
    const { url, anonKey } = readSupabaseEnv();
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return cachedClient;
}

export function readSyncMeta(): LocalSyncMeta {
  const empty: LocalSyncMeta = {
    localUpdatedAt: null,
    lastCloudSyncAt: null,
    lastSyncedUserId: null,
    autoPushPaused: false,
  };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_SYNC_META);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<LocalSyncMeta>;
    return {
      localUpdatedAt: typeof parsed.localUpdatedAt === 'string' ? parsed.localUpdatedAt : null,
      lastCloudSyncAt: typeof parsed.lastCloudSyncAt === 'string' ? parsed.lastCloudSyncAt : null,
      lastSyncedUserId:
        typeof parsed.lastSyncedUserId === 'string' ? parsed.lastSyncedUserId : null,
      autoPushPaused: Boolean(parsed.autoPushPaused),
    };
  } catch {
    return empty;
  }
}

export function writeSyncMeta(meta: LocalSyncMeta): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_SYNC_META, JSON.stringify(meta));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function clearSyncMeta(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_SYNC_META);
  } catch {
    // Ignore storage errors
  }
}

function parseTimestampMs(iso: string | null | undefined): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
}

function sanitizeCloudPrefs(
  rawPrefs: unknown,
  fallbackDisplayName: string | null,
  fallbackRole: string | null
): CloudPrefsPayload {
  const obj =
    typeof rawPrefs === 'object' && rawPrefs !== null && !Array.isArray(rawPrefs)
      ? (rawPrefs as Record<string, unknown>)
      : {};
  const rawName =
    typeof obj.displayName === 'string'
      ? obj.displayName
      : typeof fallbackDisplayName === 'string'
      ? fallbackDisplayName
      : '';
  const rawRole = typeof obj.rolePreview === 'string' ? obj.rolePreview : fallbackRole;

  return {
    displayName: rawName.trim().slice(0, 48),
    rolePreview: rawRole === 'teacher' ? 'teacher' : 'student',
    speechSpeed: obj.speechSpeed === 'slow' ? 'slow' : 'normal',
    activeCourse: obj.activeCourse === 'de-A2' ? 'de-A2' : 'de-A1',
    uiLanguage: obj.uiLanguage === 'en' ? 'en' : 'tr',
    theme: obj.theme === 'dark' ? 'dark' : 'light',
  };
}

function mapSupabaseAuthError(message: string): { errorTr: string; errorEn: string } {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return {
      errorTr: 'E-posta veya parola hatalı. Bilgilerinizi kontrol edip tekrar deneyin.',
      errorEn: 'Invalid email or password. Please check your credentials and try again.',
    };
  }
  if (lower.includes('already registered')) {
    return {
      errorTr: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyebilirsiniz.',
      errorEn: 'This email address is already registered. Try signing in instead.',
    };
  }
  if (lower.includes('password') && lower.includes('6')) {
    return {
      errorTr: 'Parola en az 6 karakter olmalıdır.',
      errorEn: 'Password must be at least 6 characters long.',
    };
  }
  if (lower.includes('email not confirmed')) {
    return {
      errorTr: 'Lütfen önce e-posta kutunuzdaki doğrulama bağlantısını onaylayın.',
      errorEn: 'Please confirm your email address using the verification link first.',
    };
  }
  return {
    errorTr: `Bulut oturumu başlatılamadı: ${message}`,
    errorEn: `Could not complete cloud authentication: ${message}`,
  };
}

export async function getCurrentCloudSession(): Promise<CloudUserSession | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data.session?.user) return null;
    return {
      userId: data.session.user.id,
      email: data.session.user.email ?? '',
    };
  } catch {
    return null;
  }
}

export function subscribeCloudAuth(
  callback: (session: CloudUserSession | null) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({ userId: session.user.id, email: session.user.email ?? '' });
    } else {
      callback(null);
    }
  });
  return () => {
    data.subscription.unsubscribe();
  };
}

export async function signInCloudWithEmail(
  email: string,
  password: string
): Promise<CloudAuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      errorTr: 'Bulut bağlantısı yapılandırılmadı; yerel modda çalışmaya devam edebilirsiniz.',
      errorEn: 'Cloud backend is not configured; you can continue in local mode.',
    };
  }
  if (!isBrowserOnline()) {
    return {
      ok: false,
      errorTr: 'İnternet bağlantısı yok. Çevrimdışı modda yerel olarak devam edebilirsiniz.',
      errorEn: 'No internet connection. You can continue locally while offline.',
    };
  }
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.user) {
      return { ok: false, ...mapSupabaseAuthError(error?.message ?? 'Auth failed') };
    }
    return {
      ok: true,
      session: { userId: data.user.id, email: data.user.email ?? email.trim() },
    };
  } catch {
    return {
      ok: false,
      errorTr: 'Bulut sunucusuna erişilemedi. Yerel ilerlemeniz güvenle korunuyor.',
      errorEn: 'Could not reach the cloud server. Your local progress remains safe.',
    };
  }
}

export async function signUpCloudWithEmail(
  email: string,
  password: string,
  displayName: string,
  rolePreview: UserRole
): Promise<CloudAuthResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      errorTr: 'Bulut bağlantısı yapılandırılmadı; yerel modda çalışmaya devam edebilirsiniz.',
      errorEn: 'Cloud backend is not configured; you can continue in local mode.',
    };
  }
  if (!isBrowserOnline()) {
    return {
      ok: false,
      errorTr: 'İnternet bağlantısı yok. Çevrimdışı modda yerel olarak devam edebilirsiniz.',
      errorEn: 'No internet connection. You can continue locally while offline.',
    };
  }
  try {
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim().slice(0, 48),
          role_preview: rolePreview,
        },
      },
    });
    if (error) {
      return { ok: false, ...mapSupabaseAuthError(error.message) };
    }
    if (!data.session && data.user) {
      return {
        ok: true,
        needsEmailConfirmation: true,
        session: { userId: data.user.id, email: data.user.email ?? email.trim() },
      };
    }
    if (data.user) {
      return {
        ok: true,
        session: { userId: data.user.id, email: data.user.email ?? email.trim() },
      };
    }
    return {
      ok: false,
      errorTr: 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.',
      errorEn: 'Registration could not be completed. Please try again.',
    };
  } catch {
    return {
      ok: false,
      errorTr: 'Bulut sunucusuna erişilemedi. Yerel modda devam edebilirsiniz.',
      errorEn: 'Could not reach the cloud server. You can continue locally.',
    };
  }
}

export async function signOutCloud(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch {
    // Ignore sign-out network errors; local state stays intact
  }
}

export async function pullCloudState(userId: string): Promise<CloudPullResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      snapshot: null,
      errorTr: 'Bulut bağlantısı yapılandırılmadı.',
      errorEn: 'Cloud sync is not configured.',
    };
  }
  if (!isBrowserOnline()) {
    return {
      ok: false,
      snapshot: null,
      errorTr: 'Çevrimdışı durumdasınız; yerel verileriniz kullanılıyor.',
      errorEn: 'You are offline; local data is active.',
    };
  }

  try {
    const { data, error } = await client
      .from(CLOUD_TABLE)
      .select(
        'user_id, email, display_name, role_preview, prefs, progress_a1, progress_a2, schema_version, updated_at'
      )
      .eq('user_id', userId)
      .maybeSingle<RawCloudRow>();

    if (error) {
      return {
        ok: false,
        snapshot: null,
        errorTr: `Buluttan veri çekilemedi: ${error.message}`,
        errorEn: `Could not pull cloud state: ${error.message}`,
      };
    }

    if (!data) {
      return { ok: true, snapshot: null };
    }

    const rawA1 =
      typeof data.progress_a1 === 'object' &&
      data.progress_a1 !== null &&
      !Array.isArray(data.progress_a1)
        ? (data.progress_a1 as Record<string, unknown>)
        : {};
    const sanitizedA1 = sanitizeProgressState(rawA1, true);
    const sanitizedA2 =
      data.progress_a2 && typeof data.progress_a2 === 'object'
        ? sanitizeA2ProgressState(data.progress_a2)
        : INITIAL_A2_PROGRESS;
    const sanitizedPrefs = sanitizeCloudPrefs(data.prefs, data.display_name, data.role_preview);
    const updatedAt =
      typeof data.updated_at === 'string' && !Number.isNaN(Date.parse(data.updated_at))
        ? new Date(data.updated_at).toISOString()
        : new Date().toISOString();

    return {
      ok: true,
      snapshot: {
        updatedAt,
        schemaVersion:
          typeof data.schema_version === 'number'
            ? data.schema_version
            : TK_BACKUP_SCHEMA_VERSION,
        prefs: sanitizedPrefs,
        progressA1: sanitizedA1,
        progressA2: sanitizedA2,
      },
    };
  } catch {
    return {
      ok: false,
      snapshot: null,
      errorTr: 'Bulut sunucusuna bağlanılamadı; yerel depolama aktif.',
      errorEn: 'Unable to reach cloud server; local storage remains active.',
    };
  }
}

export async function pushCloudState(
  session: CloudUserSession,
  snapshot: CloudStateSnapshot
): Promise<CloudPushResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      errorTr: 'Bulut bağlantısı yapılandırılmadı.',
      errorEn: 'Cloud sync is not configured.',
    };
  }
  if (!isBrowserOnline()) {
    return {
      ok: false,
      errorTr: 'Çevrimdışı durumdasınız; bağlantı gelince tekrar eşitlenecek.',
      errorEn: 'You are offline; changes will sync once you reconnect.',
    };
  }

  try {
    const updatedAt = snapshot.updatedAt || new Date().toISOString();
    const { error } = await client.from(CLOUD_TABLE).upsert(
      {
        user_id: session.userId,
        email: session.email,
        display_name: snapshot.prefs.displayName,
        role_preview: snapshot.prefs.rolePreview,
        prefs: snapshot.prefs,
        progress_a1: snapshot.progressA1,
        progress_a2: snapshot.progressA2,
        schema_version: snapshot.schemaVersion,
        updated_at: updatedAt,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      return {
        ok: false,
        errorTr: `Buluta gönderilemedi: ${error.message}`,
        errorEn: `Could not push cloud state: ${error.message}`,
      };
    }

    return { ok: true, updatedAt };
  } catch {
    return {
      ok: false,
      errorTr: 'Bulut sunucusuna gönderim başarısız oldu; verileriniz yerelde korundu.',
      errorEn: 'Failed to push to cloud server; your data is safe locally.',
    };
  }
}

export async function deleteCloudState(userId: string): Promise<CloudResetResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      errorTr: 'Bulut bağlantısı yapılandırılmadı.',
      errorEn: 'Cloud sync is not configured.',
    };
  }
  if (!isBrowserOnline()) {
    return {
      ok: false,
      errorTr: 'Çevrimdışı durumdasınız; bulut verileri yalnızca çevrimiçi iken sıfırlanabilir.',
      errorEn: 'You are offline; cloud data can only be reset while online.',
    };
  }

  try {
    const { error } = await client.from(CLOUD_TABLE).delete().eq('user_id', userId);
    if (error) {
      return {
        ok: false,
        errorTr: `Bulut kaydı silinemedi: ${error.message}`,
        errorEn: `Could not delete cloud record: ${error.message}`,
      };
    }
    return { ok: true, updatedAt: null };
  } catch {
    return {
      ok: false,
      errorTr: 'Bulut sunucusuna erişilemedi; bulut verileriniz değiştirilmedi.',
      errorEn: 'Could not reach cloud server; cloud data was not modified.',
    };
  }
}

export interface CloudResetTransport {
  isConfigured: () => boolean;
  isOnline: () => boolean;
  deleteAll: (userId: string) => Promise<CloudResetResult>;
  pushSnapshot: (session: CloudUserSession, snapshot: CloudStateSnapshot) => Promise<CloudPushResult>;
}

const DEFAULT_CLOUD_RESET_TRANSPORT: CloudResetTransport = {
  isConfigured: isCloudConfigured,
  isOnline: isBrowserOnline,
  deleteAll: deleteCloudState,
  pushSnapshot: pushCloudState,
};

/**
 * Executes an explicit user-confirmed reset that includes Supabase cloud data.
 * Never runs automatically; fails closed when offline or unconfigured.
 */
export async function executeCloudReset(
  session: CloudUserSession | null,
  scope: CloudResetScope,
  nextSnapshot: CloudStateSnapshot,
  transport: CloudResetTransport = DEFAULT_CLOUD_RESET_TRANSPORT
): Promise<CloudResetResult> {
  if (!transport.isConfigured() || !session) {
    return {
      ok: false,
      errorTr: 'Bulut sıfırlaması için aktif bir bulut oturumu gereklidir.',
      errorEn: 'An active cloud session is required to reset cloud data.',
    };
  }
  if (!transport.isOnline()) {
    return {
      ok: false,
      errorTr: 'Çevrimdışı durumdasınız; bulut verileri sıfırlanamadı. İnternet bağlantısıyla tekrar deneyin.',
      errorEn: 'You are offline; cloud data could not be reset. Please try again when online.',
    };
  }

  if (scope === 'all') {
    return transport.deleteAll(session.userId);
  }

  const pushRes = await transport.pushSnapshot(session, nextSnapshot);
  if (!pushRes.ok) {
    return {
      ok: false,
      errorTr: pushRes.errorTr,
      errorEn: pushRes.errorEn,
    };
  }
  return {
    ok: true,
    updatedAt: pushRes.updatedAt ?? nextSnapshot.updatedAt,
  };
}

function stableJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const val = (value as Record<string, unknown>)[key];
      if (val !== undefined) {
        sorted[key] = stableJsonValue(val);
      }
    }
    return sorted;
  }
  return value;
}

function areCanonicalEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(stableJsonValue(a)) === JSON.stringify(stableJsonValue(b));
}

/**
 * Resolves local vs. cloud state conflicts using `updatedAt` timestamps for scalar
 * preferences while merging A1/A2 mastered sets and deletion tombstones safely
 * (zero lost progress, zero double XP, zero resurrection of deleted teaching items).
 */
export function reconcileCloudAndLocal(
  local: CloudStateSnapshot,
  remote: CloudStateSnapshot
): ConflictReconciliationResult {
  const localMs = parseTimestampMs(local.updatedAt);
  const remoteMs = parseTimestampMs(remote.updatedAt);

  const mergedA1 = mergeProgressSafely(local.progressA1, remote.progressA1);
  const mergedA2 = mergeA2ProgressSafely(local.progressA2, remote.progressA2);

  const remoteIsNewer = remoteMs > localMs;
  const localIsNewer = localMs > remoteMs;

  const preferredPrefs: CloudPrefsPayload = remoteIsNewer
    ? {
        ...remote.prefs,
        displayName: remote.prefs.displayName || local.prefs.displayName,
      }
    : {
        ...local.prefs,
        displayName: local.prefs.displayName || remote.prefs.displayName,
      };

  const remoteContentDiffers =
    !areCanonicalEqual(mergedA1, remote.progressA1) ||
    !areCanonicalEqual(mergedA2, remote.progressA2) ||
    !areCanonicalEqual(preferredPrefs, remote.prefs);

  const localContentDiffers =
    !areCanonicalEqual(mergedA1, local.progressA1) ||
    !areCanonicalEqual(mergedA2, local.progressA2) ||
    !areCanonicalEqual(preferredPrefs, local.prefs);

  const remoteChanged = remoteContentDiffers || localIsNewer;
  const localChanged = localContentDiffers || remoteIsNewer;

  const resolvedUpdatedAt = remoteChanged
    ? new Date(Math.max(localMs, remoteMs, Date.now())).toISOString()
    : remote.updatedAt;

  return {
    winner: remoteIsNewer ? 'remote' : localIsNewer ? 'local' : 'equal',
    mergedPrefs: preferredPrefs,
    mergedProgressA1: mergedA1,
    mergedProgressA2: mergedA2,
    resolvedUpdatedAt,
    shouldApplyToLocal: localChanged,
    shouldPushToRemote: remoteChanged,
  };
}

export function formatSyncStatusLabel(
  status: 'local' | 'syncing' | 'synced' | 'offline' | 'error',
  lang: UiLanguage
): string {
  if (lang === 'en') {
    switch (status) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing…';
      case 'offline':
        return 'Offline (Local)';
      case 'error':
        return 'Sync Error';
      default:
        return 'Local';
    }
  }
  switch (status) {
    case 'synced':
      return 'Senkronize';
    case 'syncing':
      return 'Eşleşiyor…';
    case 'offline':
      return 'Çevrimdışı (Yerel)';
    case 'error':
      return 'Eşitleme Hatası';
    default:
      return 'Yerel';
  }
}
