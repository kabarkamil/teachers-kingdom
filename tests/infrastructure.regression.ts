import assert from 'node:assert/strict';
import type {
  CloudUserSession,
  GermanA2ProgressState,
  ProgressState,
  StudioDraft,
  TeachingAssignment,
  TeachingClassGroup,
} from '../src/types';
import { STARTER_A1_ASSIGNMENTS } from '../src/data/germanA1Teaching';
import {
  canAutoPushToCloud,
  deleteCloudState,
  executeCloudReset,
  isBrowserOnline,
  pullCloudState,
  pushCloudState,
  readSyncMeta,
  reconcileCloudAndLocal,
  STORAGE_KEY_SYNC_META,
  writeSyncMeta,
  type CloudPrefsPayload,
  type CloudStateSnapshot,
} from '../src/services/cloudSyncService';
import { INITIAL_A2_PROGRESS } from '../src/utils/a2DataPortability';
import {
  createBackupEnvelope,
  createEmptyTeachingTombstones,
  mergeProgressSafely,
  parseAndValidateBackup,
  sanitizeProgressState,
  TK_BACKUP_SCHEMA_VERSION,
} from '../src/utils/dataPortability';

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

function makeSyntheticA1(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
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
    teachingAssignments: [],
    studioDrafts: [],
    deletedTeachingIds: createEmptyTeachingTombstones(),
    assignmentCompletedIds: [],
    teachingMilestoneIds: [],
    xp: 0,
    recentActivities: [],
    ...overrides,
  };
}

function makeSyntheticA2(
  overrides: Partial<GermanA2ProgressState> = {}
): GermanA2ProgressState {
  return {
    ...INITIAL_A2_PROGRESS,
    ...overrides,
  };
}

function makeSyntheticPrefs(overrides: Partial<CloudPrefsPayload> = {}): CloudPrefsPayload {
  return {
    displayName: 'Test Learner',
    rolePreview: 'student',
    speechSpeed: 'normal',
    activeCourse: 'de-A1',
    uiLanguage: 'tr',
    theme: 'light',
    ...overrides,
  };
}

function makeSnapshot(
  updatedAt: string,
  progressA1: ProgressState = makeSyntheticA1(),
  progressA2: GermanA2ProgressState = makeSyntheticA2(),
  prefs: CloudPrefsPayload = makeSyntheticPrefs()
): CloudStateSnapshot {
  return {
    updatedAt,
    schemaVersion: TK_BACKUP_SCHEMA_VERSION,
    prefs,
    progressA1,
    progressA2,
  };
}

function withMockBrowserEnv<T>(
  options: { onLine?: boolean },
  fn: (storage: Map<string, string>) => Promise<T> | T
): Promise<T> {
  const storage = new Map<string, string>();
  const prevWindow = (globalThis as Record<string, unknown>).window;
  const prevNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

  const mockLocalStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: { localStorage: mockLocalStorage },
  });

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    writable: true,
    value: { onLine: options.onLine ?? true },
  });

  const restore = () => {
    if (prevWindow === undefined) {
      delete (globalThis as Record<string, unknown>).window;
    } else {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: prevWindow,
      });
    }
    if (prevNavigatorDescriptor) {
      Object.defineProperty(globalThis, 'navigator', prevNavigatorDescriptor);
    }
  };

  return Promise.resolve()
    .then(() => fn(storage))
    .finally(restore);
}

const TESTS: Array<{ name: string; run: () => Promise<void> | void }> = [
  {
    name: 'Local-only reset pauses auto-push and protects Supabase cloud data',
    run: async () => {
      await withMockBrowserEnv({ onLine: true }, () => {
        // Before local reset: auto-push allowed when online + signed in
        assert.equal(
          canAutoPushToCloud({
            cloudConfigured: true,
            hasSession: true,
            isOnline: true,
            autoPushPaused: false,
            suppressAutoPush: false,
          }),
          true
        );

        // Simulate local-only reset persisting autoPushPaused: true in sync meta
        writeSyncMeta({
          localUpdatedAt: null,
          lastCloudSyncAt: '2026-11-27T08:00:00.000Z',
          lastSyncedUserId: 'synthetic-user-1',
          autoPushPaused: true,
        });

        const persisted = readSyncMeta();
        assert.equal(persisted.autoPushPaused, true);
        assert.equal(persisted.lastCloudSyncAt, '2026-11-27T08:00:00.000Z');
        assert.ok(window.localStorage.getItem(STORAGE_KEY_SYNC_META));

        // Guard MUST block auto-push even if user is online and signed in
        assert.equal(
          canAutoPushToCloud({
            cloudConfigured: true,
            hasSession: true,
            isOnline: true,
            autoPushPaused: Boolean(persisted.autoPushPaused),
            suppressAutoPush: false,
          }),
          false
        );

        // Guard MUST also block during suppressAutoPush window
        assert.equal(
          canAutoPushToCloud({
            cloudConfigured: true,
            hasSession: true,
            isOnline: true,
            autoPushPaused: false,
            suppressAutoPush: true,
          }),
          false
        );
      });
    },
  },
  {
    name: 'Cloud-inclusive reset executes deleteAll for scope=all and scoped push for a1/a2',
    run: async () => {
      const session: CloudUserSession = {
        userId: 'synthetic-user-2',
        email: 'synthetic-tester@example.test',
      };
      const calls: string[] = [];

      const transport = {
        isConfigured: () => true,
        isOnline: () => true,
        deleteAll: async (userId: string) => {
          calls.push(`deleteAll:${userId}`);
          return { ok: true, updatedAt: null };
        },
        pushSnapshot: async (_s: CloudUserSession, snap: CloudStateSnapshot) => {
          calls.push(`push:a1=${snap.progressA1.xp},a2=${snap.progressA2.xp}`);
          return { ok: true, updatedAt: snap.updatedAt };
        },
      };

      // 1. Scope "all" deletes the entire cloud row
      const allSnap = makeSnapshot('2026-11-27T09:00:00.000Z');
      const resAll = await executeCloudReset(session, 'all', allSnap, transport);
      assert.equal(resAll.ok, true);
      assert.deepEqual(calls, ['deleteAll:synthetic-user-2']);

      // 2. Scope "a1" pushes clean A1 while preserving A2 XP
      calls.length = 0;
      const a1ResetSnap = makeSnapshot(
        '2026-11-27T09:05:00.000Z',
        makeSyntheticA1({ xp: 0 }),
        makeSyntheticA2({ xp: 85 })
      );
      const resA1 = await executeCloudReset(session, 'a1', a1ResetSnap, transport);
      assert.equal(resA1.ok, true);
      assert.deepEqual(calls, ['push:a1=0,a2=85']);

      // 3. Scope "a2" pushes clean A2 while preserving A1 XP
      calls.length = 0;
      const a2ResetSnap = makeSnapshot(
        '2026-11-27T09:10:00.000Z',
        makeSyntheticA1({ xp: 120 }),
        makeSyntheticA2({ xp: 0 })
      );
      const resA2 = await executeCloudReset(session, 'a2', a2ResetSnap, transport);
      assert.equal(resA2.ok, true);
      assert.deepEqual(calls, ['push:a1=120,a2=0']);
    },
  },
  {
    name: 'Cloud-inclusive reset fails closed when offline or without active session',
    run: async () => {
      let mutated = false;
      const transport = {
        isConfigured: () => true,
        isOnline: () => false,
        deleteAll: async () => {
          mutated = true;
          return { ok: true };
        },
        pushSnapshot: async () => {
          mutated = true;
          return { ok: true };
        },
      };

      const session: CloudUserSession = {
        userId: 'synthetic-user-3',
        email: 'offline-tester@example.test',
      };
      const snap = makeSnapshot('2026-11-27T09:15:00.000Z');

      const offlineRes = await executeCloudReset(session, 'all', snap, transport);
      assert.equal(offlineRes.ok, false);
      assert.equal(mutated, false);

      const noSessionRes = await executeCloudReset(null, 'all', snap, {
        ...transport,
        isOnline: () => true,
      });
      assert.equal(noSessionRes.ok, false);
      assert.equal(mutated, false);
    },
  },
  {
    name: 'Deleted class, assignment, and studio draft never resurrect during cross-device sync',
    run: () => {
      const cls: TeachingClassGroup = {
        id: 'cls-synth-1',
        courseId: 'de-A1',
        name: 'A1 Sabah Grubu',
        levelLabel: 'CEFR A1',
        scheduleTr: 'Salı 10:00',
        focusTopicTr: 'Selamlaşma',
        descriptionTr: 'Sentetik test sınıfı',
        roster: [],
        createdAt: '2026-11-27T08:00:00.000Z',
      };
      const assignment: TeachingAssignment = {
        id: 'assign-synth-1',
        courseId: 'de-A1',
        titleTr: 'Kelime Tekrarı',
        moduleRoute: 'kelime',
        targetLabelTr: 'Ünite 1',
        classId: cls.id,
        instructionsTr: 'Sentetik test ödevi',
        status: 'assigned',
        createdAt: '2026-11-27T08:05:00.000Z',
      };
      const linkedAssignment: TeachingAssignment = {
        id: 'assign-synth-2',
        courseId: 'de-A1',
        titleTr: 'Dinleme Görevi',
        moduleRoute: 'dinleme',
        targetLabelTr: 'Senaryo 1',
        classId: cls.id,
        instructionsTr: 'Sınıf silinince classId temizlenmeli',
        status: 'assigned',
        createdAt: '2026-11-27T08:06:00.000Z',
      };
      const draft: StudioDraft = {
        id: 'draft-synth-1',
        courseId: 'de-A1',
        titleTr: 'Ders Taslağı',
        kind: 'lesson',
        moduleFocus: 'kelime',
        durationMinutes: 40,
        notesTr: 'Sentetik taslak',
        items: [],
        updatedAt: '2026-11-27T08:10:00.000Z',
      };

      // Device B / Cloud still has all items from 08:15
      const remoteSnapshot = makeSnapshot(
        '2026-11-27T08:15:00.000Z',
        makeSyntheticA1({
          teachingClasses: [cls],
          teachingAssignments: [assignment, linkedAssignment],
          studioDrafts: [draft],
        })
      );

      // Device A deleted cls, assignment, and draft at 08:30
      const deleteIso = '2026-11-27T08:30:00.000Z';
      const localSnapshot = makeSnapshot(
        deleteIso,
        makeSyntheticA1({
          teachingClasses: [],
          teachingAssignments: [{ ...linkedAssignment, classId: undefined, updatedAt: deleteIso }],
          studioDrafts: [],
          deletedTeachingIds: {
            classes: { [cls.id]: deleteIso },
            assignments: { [assignment.id]: deleteIso },
            drafts: { [draft.id]: deleteIso },
          },
        })
      );

      // Reconcile Device A -> Cloud
      const reconciledA = reconcileCloudAndLocal(localSnapshot, remoteSnapshot);
      assert.equal(reconciledA.mergedProgressA1.teachingClasses.length, 0);
      assert.deepEqual(
        reconciledA.mergedProgressA1.teachingAssignments.map((a) => a.id),
        [linkedAssignment.id]
      );
      assert.equal(reconciledA.mergedProgressA1.teachingAssignments[0].classId, undefined);
      assert.equal(reconciledA.mergedProgressA1.studioDrafts.length, 0);
      assert.equal(reconciledA.shouldPushToRemote, true);
      assert.equal(reconciledA.mergedProgressA1.deletedTeachingIds?.classes[cls.id], deleteIso);
      assert.equal(
        reconciledA.mergedProgressA1.deletedTeachingIds?.assignments[assignment.id],
        deleteIso
      );
      assert.equal(reconciledA.mergedProgressA1.deletedTeachingIds?.drafts[draft.id], deleteIso);

      // Now Device B (stale copy) syncs with the updated Cloud snapshot
      const updatedCloudSnapshot = makeSnapshot(
        reconciledA.resolvedUpdatedAt,
        reconciledA.mergedProgressA1,
        reconciledA.mergedProgressA2,
        reconciledA.mergedPrefs
      );
      const reconciledB = reconcileCloudAndLocal(remoteSnapshot, updatedCloudSnapshot);
      assert.equal(reconciledB.mergedProgressA1.teachingClasses.length, 0);
      assert.deepEqual(
        reconciledB.mergedProgressA1.teachingAssignments.map((a) => a.id),
        [linkedAssignment.id]
      );
      assert.equal(reconciledB.mergedProgressA1.studioDrafts.length, 0);
      assert.equal(reconciledB.shouldApplyToLocal, true);
    },
  },
  {
    name: 'Deleted starter assignment does not resurrect on sanitization or JSON merge',
    run: () => {
      const starter = STARTER_A1_ASSIGNMENTS[0];
      assert.ok(starter, 'Expected at least one starter A1 assignment');

      const deletedAt = '2026-11-27T10:00:00.000Z';
      const sanitized = sanitizeProgressState(
        {
          xp: 20,
          deletedTeachingIds: {
            classes: {},
            assignments: { [starter.id]: deletedAt },
            drafts: {},
          },
        },
        true
      );
      assert.equal(
        sanitized.teachingAssignments.some((a) => a.id === starter.id),
        false
      );

      // Merging with a snapshot that still contains the starter assignment keeps it deleted
      const withStarter = makeSyntheticA1({
        teachingAssignments: [starter],
      });
      const merged = mergeProgressSafely(sanitized, withStarter);
      assert.equal(
        merged.teachingAssignments.some((a) => a.id === starter.id),
        false
      );
    },
  },
  {
    name: 'JSON backup includes uiLanguage and remains backward compatible with legacy backups',
    run: () => {
      const progress = makeSyntheticA1({
        xp: 35,
        studiedFlashcards: ['w-1'],
        activityMasteredIds: ['act-karaoke-kleiner-schritt'],
      });
      const a2Progress = makeSyntheticA2({
        xp: 25,
        studiedFlashcards: ['a2-w-1'],
      });

      // 1. New backup preserves uiLanguage: 'en'
      const envelope = createBackupEnvelope(
        progress,
        {
          displayName: 'Test Teacher',
          rolePreview: 'teacher',
          speechSpeed: 'slow',
          theme: 'dark',
          activeCourse: 'de-A2',
          uiLanguage: 'en',
        },
        a2Progress
      );
      assert.equal(envelope.prefs.uiLanguage, 'en');

      const parsedNew = parseAndValidateBackup(JSON.stringify(envelope));
      assert.equal(parsedNew.ok, true);
      if (parsedNew.ok) {
        assert.equal(parsedNew.data.prefs?.uiLanguage, 'en');
        assert.equal(parsedNew.data.prefs?.displayName, 'Test Teacher');
        assert.equal(parsedNew.data.progress.xp, 35);
        assert.equal(parsedNew.data.a2Progress?.xp, 25);
      }

      // 2. Legacy v1 backup WITHOUT uiLanguage and WITHOUT deletedTeachingIds loads cleanly
      const legacyEnvelope = {
        schema: 'teachers-kingdom-backup',
        schemaVersion: 1,
        appDomain: 'teacherskingdom.net',
        storageKey: 'tk_stage1_progress_v1',
        course: 'de-A1',
        exportedAt: '2026-10-01T12:00:00.000Z',
        prefs: {
          displayName: 'Legacy Learner',
          rolePreview: 'student',
          speechSpeed: 'normal',
          theme: 'light',
          activeCourse: 'de-A1',
        },
        progress: {
          xp: 15,
          studiedFlashcards: ['w-legacy-1'],
          articleMasteredIds: ['w-legacy-1'],
        },
      };
      const parsedLegacy = parseAndValidateBackup(JSON.stringify(legacyEnvelope));
      assert.equal(parsedLegacy.ok, true);
      if (parsedLegacy.ok) {
        assert.equal(parsedLegacy.data.prefs?.uiLanguage, undefined);
        assert.deepEqual(
          parsedLegacy.data.progress.deletedTeachingIds,
          createEmptyTeachingTombstones()
        );
        assert.equal(parsedLegacy.data.progress.xp, 15);
      }
    },
  },
  {
    name: 'Offline behavior blocks remote calls gracefully and reconciles cleanly when online',
    run: async () => {
      await withMockBrowserEnv({ onLine: false }, async () => {
        assert.equal(isBrowserOnline(), false);
        assert.equal(
          canAutoPushToCloud({
            cloudConfigured: true,
            hasSession: true,
            isOnline: isBrowserOnline(),
            autoPushPaused: false,
            suppressAutoPush: false,
          }),
          false
        );

        const session: CloudUserSession = {
          userId: 'synthetic-offline-user',
          email: 'offline@example.test',
        };
        const snap = makeSnapshot('2026-11-27T11:00:00.000Z');

        const pullRes = await pullCloudState(session.userId);
        const pushRes = await pushCloudState(session, snap);
        const delRes = await deleteCloudState(session.userId);

        assert.equal(pullRes.ok, false);
        assert.equal(pushRes.ok, false);
        assert.equal(delRes.ok, false);
      });
    },
  },
  {
    name: 'Cross-device sync merges concurrent A1/A2 progress without double XP and is idempotent',
    run: () => {
      // Device A studied A1 flashcard (+5) + A1 article (+10) = 15 XP, A2 flashcard (+5)
      const deviceA = makeSnapshot(
        '2026-11-27T11:10:00.000Z',
        makeSyntheticA1({
          studiedFlashcards: ['w-a1'],
          articleAttempts: 1,
          articleCorrect: 1,
          articleMasteredIds: ['w-a1'],
          xp: 15,
        }),
        makeSyntheticA2({
          studiedFlashcards: ['a2-w-1'],
          xp: 5,
        }),
        makeSyntheticPrefs({ uiLanguage: 'tr', theme: 'light', displayName: 'Device A User' })
      );

      // Device B completed A1 karaoke (+15) + A2 listening (+10), newer timestamp & uiLanguage='en'
      const deviceB = makeSnapshot(
        '2026-11-27T11:20:00.000Z',
        makeSyntheticA1({
          activityMasteredIds: ['act-karaoke-kleiner-schritt'],
          xp: 15,
        }),
        makeSyntheticA2({
          listeningAttempts: 1,
          listeningCorrect: 1,
          listeningMasteredIds: ['a2-listen-1'],
          xp: 10,
        }),
        makeSyntheticPrefs({ uiLanguage: 'en', theme: 'dark', displayName: 'Device B User' })
      );

      const firstSync = reconcileCloudAndLocal(deviceA, deviceB);
      assert.equal(firstSync.winner, 'remote');
      assert.equal(firstSync.mergedPrefs.uiLanguage, 'en');
      assert.equal(firstSync.mergedPrefs.theme, 'dark');
      assert.equal(firstSync.mergedProgressA1.xp, 30); // 15 + 15, exact single-grant sum
      assert.equal(firstSync.mergedProgressA2.xp, 15); // 5 + 10, exact single-grant sum
      assert.equal(firstSync.shouldApplyToLocal, true);
      assert.equal(firstSync.shouldPushToRemote, true);

      // Re-syncing identical merged snapshots MUST NOT add extra XP or trigger needless writes
      const syncedSnap = makeSnapshot(
        firstSync.resolvedUpdatedAt,
        firstSync.mergedProgressA1,
        firstSync.mergedProgressA2,
        firstSync.mergedPrefs
      );
      const secondSync = reconcileCloudAndLocal(syncedSnap, syncedSnap);
      assert.equal(secondSync.winner, 'equal');
      assert.equal(secondSync.mergedProgressA1.xp, 30);
      assert.equal(secondSync.mergedProgressA2.xp, 15);
      assert.equal(secondSync.shouldApplyToLocal, false);
      assert.equal(secondSync.shouldPushToRemote, false);
    },
  },
];

export async function runInfrastructureRegressionTests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}> {
  const results: TestResult[] = [];
  for (const testCase of TESTS) {
    const start = Date.now();
    try {
      await testCase.run();
      results.push({
        name: testCase.name,
        passed: true,
        durationMs: Date.now() - start,
      });
    } catch (err) {
      results.push({
        name: testCase.name,
        passed: false,
        durationMs: Date.now() - start,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  const passed = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    results,
  };
}
