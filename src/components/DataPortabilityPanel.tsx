import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Cloud,
  CloudDownload,
  CloudOff,
  CloudUpload,
  Copy,
  Download,
  FileJson,
  HardDrive,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useI18n } from '../hooks/useI18n';
import { formatSyncStatusLabel } from '../services/cloudSyncService';
import {
  STORAGE_KEY_STATE,
  TK_BACKUP_SCHEMA_VERSION,
  createBackupEnvelope,
  evaluateProgressIntegrity,
  formatBytesTr,
  getLocalStorageDiagnostics,
  parseAndValidateBackup,
  triggerJsonBackupDownload,
  type ValidatedBackupPayload,
} from '../utils/dataPortability';
import {
  STORAGE_KEY_A2_STATE,
  evaluateA2ProgressIntegrity,
  getUniqueA2CompletedWordIds,
} from '../utils/a2DataPortability';
import { platformServices } from '../services/localAdapters';

export const DataPortabilityPanel: React.FC = () => {
  const {
    theme,
    rolePreview,
    speechSpeed,
    activeCourse,
    uiLanguage,
    displayName,
    progress,
    a2Progress,
    lastSavedAt,
    cloudConfigured,
    cloudUser,
    cloudSyncStatus,
    cloudAutoPushPaused,
    lastCloudSyncAt,
    cloudSyncError,
    syncCloudNow,
    pullFromCloud,
    pushToCloud,
    importLocalData,
    resetProgress,
    resetA2Progress,
    resetAllLocalData,
    resetCloudAndLocal,
  } = useAppState();
  const { locale, isEn, tx, formatClock } = useI18n();
  const [cloudActionBusy, setCloudActionBusy] = useState(false);
  const [cloudActionNotice, setCloudActionNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Export state
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copyFallbackJson, setCopyFallbackJson] = useState<string | null>(null);

  // Import state
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [pendingBackup, setPendingBackup] = useState<ValidatedBackupPayload | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Safe two-step reset state (local-only vs. cloud-inclusive)
  const [resetPanelOpen, setResetPanelOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<'local-only' | 'local-and-cloud'>('local-only');
  const [resetScope, setResetScope] = useState<'progress-only' | 'a2-only' | 'all-local'>(
    'progress-only'
  );
  const [resetConfirmedCheck, setResetConfirmedCheck] = useState(false);
  const [resetKeywordInput, setResetKeywordInput] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const diagnostics = useMemo(() => {
    void progress;
    void a2Progress;
    void lastSavedAt;
    return getLocalStorageDiagnostics();
  }, [progress, a2Progress, lastSavedAt]);

  const integrity = useMemo(() => evaluateProgressIntegrity(progress), [progress]);
  const a2Integrity = useMemo(() => evaluateA2ProgressIntegrity(a2Progress), [a2Progress]);

  const handleDownloadBackup = () => {
    const { filename } = triggerJsonBackupDownload(
      progress,
      {
        displayName,
        rolePreview,
        speechSpeed,
        theme,
        activeCourse,
        uiLanguage,
      },
      a2Progress
    );
    setExportNotice(
      tx(
        {
          tr: 'Yedek dosyası (A1 + A2) oluşturuldu: {{filename}}',
          en: 'Backup file (A1 + A2) created: {{filename}}',
        },
        { filename }
      )
    );
    window.setTimeout(() => setExportNotice(null), 3500);
  };

  const handleCopyBackupJson = async () => {
    const envelope = createBackupEnvelope(
      progress,
      {
        displayName,
        rolePreview,
        speechSpeed,
        theme,
        activeCourse,
        uiLanguage,
      },
      a2Progress
    );
    const jsonText = JSON.stringify(envelope, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonText);
        setCopiedJson(true);
        setCopyFallbackJson(null);
        setExportNotice(
          tx({
            tr: 'JSON yedek metni (A1 + A2) panoya kopyalandı.',
            en: 'JSON backup text (A1 + A2) copied to clipboard.',
          })
        );
        window.setTimeout(() => {
          setCopiedJson(false);
          setExportNotice(null);
        }, 2500);
        return;
      }
    } catch {
      // Fall through to manual copy box
    }
    setCopyFallbackJson(jsonText);
    setExportNotice(
      tx({
        tr: 'Tarayıcı pano erişimini kısıtladı; JSON yedeğini aşağıdaki kutudan kopyalayabilirsiniz.',
        en: 'Browser restricted clipboard access; you can copy the JSON backup from the box below.',
      })
    );
  };

  const validateRawText = (rawText: string) => {
    setImportError(null);
    setImportSuccess(null);
    const result = parseAndValidateBackup(rawText);
    if (!result.ok) {
      setPendingBackup(null);
      setImportError(
        isEn
          ? 'Invalid or unrecognized Teachers Kingdom backup JSON. Only valid schema backups can be imported.'
          : result.errorTr
      );
      return;
    }
    setPendingBackup(result.data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      setPendingBackup(null);
      setImportError(
        tx({
          tr: 'Seçilen dosya 2 MB sınırını aşıyor; geçerli bir yerel yedek değil.',
          en: 'Selected file exceeds the 2 MB limit; not a valid local backup.',
        })
      );
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      validateRawText(content);
    };
    reader.onerror = () => {
      setPendingBackup(null);
      setImportError(
        tx({
          tr: 'Dosya okunamadı. Lütfen geçerli bir .json dosyası seçin.',
          en: 'Could not read the file. Please select a valid .json file.',
        })
      );
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handleValidatePastedJson = () => {
    validateRawText(pasteText);
  };

  const handleConfirmImport = () => {
    if (!pendingBackup) return;
    const outcome = importLocalData(pendingBackup, importMode);
    setPendingBackup(null);
    setPasteText('');
    setShowPasteBox(false);
    setImportError(null);

    if (outcome.mode === 'merge') {
      const a1Delta = outcome.xpAfter - outcome.xpBefore;
      const a2Delta = outcome.a2XpAfter - outcome.a2XpBefore;
      const parts: string[] = [];
      parts.push(
        a1Delta > 0
          ? tx(
              {
                tr: 'A1 +{{delta}} XP (toplam {{total}} XP)',
                en: 'A1 +{{delta}} XP (total {{total}} XP)',
              },
              { delta: a1Delta, total: outcome.xpAfter }
            )
          : tx(
              {
                tr: 'A1 çift XP eklenmedi ({{total}} XP)',
                en: 'No duplicate A1 XP added ({{total}} XP)',
              },
              { total: outcome.xpAfter }
            )
      );
      if (outcome.a2XpAfter > 0 || outcome.a2XpBefore > 0) {
        parts.push(
          a2Delta > 0
            ? tx(
                {
                  tr: 'A2 +{{delta}} XP (toplam {{total}} XP)',
                  en: 'A2 +{{delta}} XP (total {{total}} XP)',
                },
                { delta: a2Delta, total: outcome.a2XpAfter }
              )
            : tx(
                {
                  tr: 'A2 çift XP eklenmedi ({{total}} XP)',
                  en: 'No duplicate A2 XP added ({{total}} XP)',
                },
                { total: outcome.a2XpAfter }
              )
        );
      }
      setImportSuccess(
        tx(
          {
            tr: 'Yedek güvenli biçimde birleştirildi: {{summary}}.',
            en: 'Backup merged safely: {{summary}}.',
          },
          { summary: parts.join(' · ') }
        )
      );
    } else {
      const a2Suffix =
        outcome.a2XpAfter > 0 ? ` · A2 ${outcome.a2XpAfter} XP` : '';
      setImportSuccess(
        tx(
          {
            tr: 'Yerel ilerleme yedeği geri yüklendi (A1 {{a1}} XP{{a2}}).',
            en: 'Local progress backup restored (A1 {{a1}} XP{{a2}}).',
          },
          { a1: outcome.xpAfter, a2: a2Suffix }
        )
      );
    }
    window.setTimeout(() => setImportSuccess(null), 5000);
  };

  const expectedResetKeyword = isEn ? 'RESET' : 'SIFIRLA';
  const isCloudResetSelected = resetTarget === 'local-and-cloud' && Boolean(cloudUser);
  const isResetKeywordMatched =
    resetKeywordInput.trim().toLocaleUpperCase('tr-TR') === expectedResetKeyword ||
    resetKeywordInput.trim().toUpperCase() === 'RESET';
  const canConfirmReset =
    resetConfirmedCheck && (!isCloudResetSelected || isResetKeywordMatched) && !resetBusy;

  const handleExecuteReset = async () => {
    if (!canConfirmReset) return;
    setResetError(null);
    setResetNotice(null);

    if (isCloudResetSelected) {
      const cloudScope =
        resetScope === 'all-local' ? 'all' : resetScope === 'a2-only' ? 'a2' : 'a1';
      setResetBusy(true);
      const outcome = await resetCloudAndLocal(cloudScope);
      setResetBusy(false);
      if (!outcome.ok) {
        setResetError(isEn ? outcome.summaryEn : outcome.summaryTr);
        return;
      }
      setResetNotice(isEn ? outcome.summaryEn : outcome.summaryTr);
      setResetPanelOpen(false);
      setResetConfirmedCheck(false);
      setResetKeywordInput('');
      setResetTarget('local-only');
      window.setTimeout(() => setResetNotice(null), 6000);
      return;
    }

    const cloudSafeSuffix = cloudUser
      ? isEn
        ? ' Cloud data was preserved and automatic cloud upload was paused until you manually sync.'
        : ' Bulut verileriniz korundu; manuel eşitleme yapana kadar otomatik bulut gönderimi duraklatıldı.'
      : '';

    if (resetScope === 'all-local') {
      resetAllLocalData();
      setResetNotice(
        tx(
          {
            tr: 'A1 ve A2 yerel ilerleme kayıtları, sınıflar, ödevler, taslaklar ve profil tercihleri sıfırlandı.{{suffix}}',
            en: 'A1 and A2 local progress records, classes, assignments, drafts, and profile preferences were reset.{{suffix}}',
          },
          { suffix: cloudSafeSuffix }
        )
      );
    } else if (resetScope === 'a2-only') {
      resetA2Progress();
      setResetNotice(
        tx(
          {
            tr: 'Almanca A2 yerel ilerleme kaydı ({{key}}) sıfırlandı; A1 kaydınız ve tercihleriniz korundu.{{suffix}}',
            en: 'German A2 local progress ({{key}}) was reset; your A1 progress and preferences were preserved.{{suffix}}',
          },
          { key: STORAGE_KEY_A2_STATE, suffix: cloudSafeSuffix }
        )
      );
    } else {
      resetProgress();
      setResetNotice(
        tx(
          {
            tr: 'Almanca A1 yerel ilerleme kaydı ({{key}}) sıfırlandı; A2 kaydınız, tema ve profil adınız korundu.{{suffix}}',
            en: 'German A1 local progress ({{key}}) was reset; your A2 progress, theme, and display name were preserved.{{suffix}}',
          },
          { key: STORAGE_KEY_STATE, suffix: cloudSafeSuffix }
        )
      );
    }
    setResetPanelOpen(false);
    setResetConfirmedCheck(false);
    setResetKeywordInput('');
    window.setTimeout(() => setResetNotice(null), 6000);
  };

  const pendingStats = useMemo(() => {
    if (!pendingBackup) return null;
    const p = pendingBackup.progress;
    const uniqueWords = new Set([
      ...p.studiedFlashcards,
      ...p.articleMasteredIds,
      ...p.quizMasteredIds,
    ]).size;
    const completedAssignments = p.teachingAssignments.filter(
      (a) => a.status === 'completed' || a.status === 'reviewed'
    ).length;
    const a2Words = pendingBackup.a2Progress
      ? getUniqueA2CompletedWordIds(pendingBackup.a2Progress).length
      : 0;
    const a2Listening = pendingBackup.a2Progress?.listeningMasteredIds.length ?? 0;
    const a2Reading = pendingBackup.a2Progress?.readingMasteredIds.length ?? 0;
    const a2Writing = pendingBackup.a2Progress?.writingMasteredIds.length ?? 0;
    const a2Speaking = pendingBackup.a2Progress?.speakingMasteredIds.length ?? 0;
    const a2Activities = pendingBackup.a2Progress?.activityMasteredIds.length ?? 0;
    return {
      xp: p.xp,
      uniqueWords,
      listening: p.listeningMasteredIds.length,
      reading: p.readingMasteredIds.length,
      writing: p.writingMasteredIds.length,
      speaking: p.speakingMasteredIds.length,
      activities: p.activityMasteredIds.length,
      classes: p.teachingClasses.length,
      assignments: p.teachingAssignments.length,
      completedAssignments,
      drafts: p.studioDrafts.length,
      hasA2: Boolean(pendingBackup.a2Progress),
      a2Xp: pendingBackup.a2Progress?.xp ?? 0,
      a2Words,
      a2Listening,
      a2Reading,
      a2Writing,
      a2Speaking,
      a2Activities,
    };
  }, [pendingBackup]);

  return (
    <div className="space-y-6">
      {/* 1. ACCOUNT & SYNC ARCHITECTURE STATUS */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div>
            <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
              {tx({
                tr: 'Hesap, Servis Katmanı ve Senkronizasyon Mimarisi',
                en: 'Account, Service Layer & Sync Architecture',
              })}
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({
                tr: 'Hesap ve Senkronizasyon Durumu',
                en: 'Account & Synchronization Status',
              })}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            {tx(
              { tr: 'Şema v{{v}}', en: 'Schema v{{v}}' },
              { v: TK_BACKUP_SCHEMA_VERSION }
            )}{' '}
            · {STORAGE_KEY_STATE} · {platformServices.progressSync.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Today: Local Browser Layer */}
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#282830] dark:bg-[#111113]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                <HardDrive className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>
                  {tx({
                    tr: 'Bugün Aktif: Yerel Tarayıcı Depolaması',
                    en: 'Active Today: Local Browser Storage',
                  })}
                </span>
              </span>
              <span className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
                {diagnostics.available
                  ? tx({ tr: 'Çalışıyor', en: 'Operational' })
                  : tx({ tr: 'Kısıtlı', en: 'Restricted' })}
              </span>
            </div>

            <dl className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Yerel Profil', en: 'Local Profile' })}
                </dt>
                <dd className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate max-w-[180px]">
                  {displayName || locale.roles.guestUser}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Rol Önizlemesi', en: 'Role Preview' })}
                </dt>
                <dd className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                  {rolePreview === 'teacher' ? locale.roles.teacher : locale.roles.student}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Depolama Boyutu (A1 + A2)', en: 'Storage Size (A1 + A2)' })}
                </dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {formatBytesTr(diagnostics.totalBytes)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'İzole A2 Kaydı', en: 'Isolated A2 Storage' })}
                </dt>
                <dd className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {a2Progress.xp} XP · {formatBytesTr(diagnostics.a2ProgressBytes)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Son Yerel Kayıt', en: 'Last Local Save' })}
                </dt>
                <dd className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {formatClock(lastSavedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Cloud Sync Layer */}
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#282830] dark:bg-[#0D0D0D]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                {cloudSyncStatus === 'synced' ? (
                  <Cloud className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                ) : cloudSyncStatus === 'syncing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-[#9A6B16] dark:text-[#D4AF37]" />
                ) : (
                  <CloudOff className="h-4 w-4 text-[#9A6B16] dark:text-[#D4AF37]" />
                )}
                <span>
                  {isEn ? 'Cloud Synchronization' : 'Bulut Senkronizasyonu'}
                </span>
              </span>
              <span
                className={`font-mono text-xs font-semibold ${
                  cloudSyncStatus === 'synced'
                    ? 'text-[#15803D] dark:text-[#4ADE80]'
                    : cloudSyncStatus === 'error'
                    ? 'text-[#7A1C24] dark:text-[#FCA5A5]'
                    : 'text-[#9A6B16] dark:text-[#D4AF37]'
                }`}
              >
                {formatSyncStatusLabel(cloudSyncStatus, uiLanguage)}
              </span>
            </div>

            {cloudUser ? (
              <>
                <dl className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                      {isEn ? 'Account' : 'Bulut Hesabı'}
                    </dt>
                    <dd className="font-mono text-[#0D0D0D] dark:text-[#FFFFFF] truncate max-w-[200px]">
                      {cloudUser.email}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                      {isEn ? 'Last Cloud Sync' : 'Son Bulut Eşitleme'}
                    </dt>
                    <dd className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {formatClock(lastCloudSyncAt)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <dt className="text-[#52525B] dark:text-[#A1A1AA]">
                      {isEn ? 'Conflict Policy' : 'Çakışma Çözümü'}
                    </dt>
                    <dd className="font-mono text-[11px] text-[#7A1C24] dark:text-[#D4AF37]">
                      updatedAt + Safe XP Merge
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={cloudActionBusy}
                    onClick={async () => {
                      setCloudActionBusy(true);
                      const res = await syncCloudNow();
                      setCloudActionBusy(false);
                      setCloudActionNotice(isEn ? res.summaryEn : res.summaryTr);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#7A1C24] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#62151C] disabled:opacity-50 dark:bg-[#D4AF37] dark:text-[#0D0D0D]"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${cloudActionBusy ? 'animate-spin' : ''}`} />
                    <span>{isEn ? 'Sync' : 'Eşitle'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={cloudActionBusy}
                    onClick={async () => {
                      setCloudActionBusy(true);
                      const res = await pullFromCloud();
                      setCloudActionBusy(false);
                      setCloudActionNotice(isEn ? res.summaryEn : res.summaryTr);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] disabled:opacity-50 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF]"
                  >
                    <CloudDownload className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
                    <span>{isEn ? 'Pull' : 'Çek'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={cloudActionBusy}
                    onClick={async () => {
                      setCloudActionBusy(true);
                      const res = await pushToCloud();
                      setCloudActionBusy(false);
                      setCloudActionNotice(isEn ? res.summaryEn : res.summaryTr);
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] disabled:opacity-50 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF]"
                  >
                    <CloudUpload className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
                    <span>{isEn ? 'Push' : 'Gönder'}</span>
                  </button>
                </div>

                {cloudAutoPushPaused && (
                  <div
                    role="status"
                    className="rounded-lg border border-[#D4AF37]/50 bg-[#FEF9EB] px-3 py-2 text-[11px] leading-relaxed text-[#78350F] dark:border-[#D4AF37]/40 dark:bg-[#231D10] dark:text-[#F6D693]"
                  >
                    {isEn
                      ? 'Auto-upload is paused after a local-only reset to protect your cloud data. Click Sync or Pull whenever you want to reconnect.'
                      : 'Yerel sıfırlama sonrası bulut verilerinizi korumak için otomatik bulut gönderimi duraklatıldı. Tekrar bağlamak için Eşitle veya Çek butonunu kullanabilirsiniz.'}
                  </div>
                )}

                {(cloudActionNotice || cloudSyncError) && (
                  <p
                    role="status"
                    className={`text-xs font-medium ${
                      cloudSyncError && !cloudActionNotice
                        ? 'text-[#7A1C24] dark:text-[#FCA5A5]'
                        : 'text-[#15803D] dark:text-[#86EFAC]'
                    }`}
                  >
                    {cloudActionNotice ?? cloudSyncError}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {cloudConfigured
                    ? isEn
                      ? 'Cloud sync backend is configured. Sign in from the top bar to sync A1/A2 progress, XP, classes, and assignments across devices.'
                      : 'Bulut senkronizasyon altyapısı hazır. Üst çubuktan bulut hesabıyla giriş yaparak A1/A2 ilerlemenizi, XP puanlarınızı ve sınıflarınızı cihazlar arasında eşitleyebilirsiniz.'
                    : isEn
                    ? 'Running in offline-first localStorage mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable automatic cloud sync; JSON backup remains available anytime.'
                    : 'Çevrimdışı öncelikli yerel mod aktif. Otomatik bulut eşitlemesi için .env / Netlify ortam değişkenlerine VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY eklenebilir; JSON yedekleme her zaman aktiftir.'}
                </p>
                <ul className="space-y-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  <li>
                    •{' '}
                    {isEn
                      ? 'Automatic conflict resolution via updatedAt + safe single-grant XP merge.'
                      : 'updatedAt zaman damgası ve çift XP korumalı güvenli birleştirme.'}
                  </li>
                  <li>
                    •{' '}
                    {isEn
                      ? 'Full offline fallback to localStorage when disconnected.'
                      : 'Bağlantı koptuğunda localStorage üzerinden kesintisiz çalışma.'}
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. JSON EXPORT & SCHEMA-VALIDATED IMPORT */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({
              tr: 'Yerel Yedekleme ve Veri Taşıma (JSON)',
              en: 'Local Backup & Data Portability (JSON)',
            })}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Almanca A1 ve A2 ilerlemenizi, XP kayıtlarınızı, yerel sınıflarınızı, ödevlerinizi ve Öğretmen Stüdyosu taslaklarınızı tek bir şema doğrulamalı JSON dosyasıyla dışa/içe aktarın.',
              en: 'Export or import your German A1 & A2 progress, XP records, local classes, assignments, and Teacher Studio drafts in a single schema-validated JSON file.',
            })}
          </p>
        </div>

        {/* Export Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              <span>{tx({ tr: 'JSON Yedeği İndir', en: 'Download JSON Backup' })}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyBackupJson}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-xs sm:text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              {copiedJson ? (
                <Check className="h-4 w-4 text-[#15803D]" />
              ) : (
                <Copy className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
              )}
              <span>
                {copiedJson
                  ? tx({ tr: 'JSON Kopyalandı', en: 'JSON Copied' })
                  : tx({ tr: 'JSON Metnini Kopyala', en: 'Copy JSON Text' })}
              </span>
            </button>
          </div>

          {exportNotice && (
            <p
              role="status"
              className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]"
            >
              {exportNotice}
            </p>
          )}

          {copyFallbackJson && (
            <div className="rounded-lg border border-[#D9A13B]/50 bg-[#FFFBEB] p-3.5 space-y-2 dark:border-[#D9A13B]/40 dark:bg-[#231D10]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#78350F] dark:text-[#F6D693]">
                  {tx({ tr: 'Manuel JSON Kopyalama Alanı', en: 'Manual JSON Copy Area' })}
                </span>
                <button
                  type="button"
                  onClick={() => setCopyFallbackJson(null)}
                  className="underline text-[#78350F] dark:text-[#F6D693]"
                >
                  {locale.common.close}
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={copyFallbackJson}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-lg border border-[#D9A13B]/40 bg-[#FFFFFF] p-2.5 font-mono text-xs text-[#111113] dark:bg-[#111113] dark:text-[#F4F4F5]"
              />
            </div>
          )}
        </div>

        {/* Import Controls */}
        <div className="border-t border-[#ECECE8] pt-5 space-y-4 dark:border-[#24242C]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'JSON Yedeği İçe Aktar (Şema Doğrulamalı)',
                  en: 'Import JSON Backup (Schema-Validated)',
                })}
              </h3>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Bozuk veya geçersiz dosyalar mevcut verinize dokunmadan reddedilir.',
                  en: 'Corrupted or invalid files are rejected without touching your existing data.',
                })}
              </p>
            </div>

            {/* Import Mode Selector */}
            <div
              role="group"
              aria-label={tx({ tr: 'İçe aktarma modu', en: 'Import mode' })}
              className="inline-flex flex-wrap items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113] shrink-0"
            >
              <button
                type="button"
                aria-pressed={importMode === 'replace'}
                onClick={() => setImportMode('replace')}
                className={`rounded-md px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  importMode === 'replace'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                {tx({ tr: 'Tam Geri Yükle', en: 'Full Restore' })}
              </button>
              <button
                type="button"
                aria-pressed={importMode === 'merge'}
                onClick={() => setImportMode('merge')}
                className={`rounded-md px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  importMode === 'merge'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                {tx({
                  tr: 'Birleştir (Çift XP Korumalı)',
                  en: 'Merge (Duplicate-XP Safe)',
                })}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="sr-only"
              aria-label={tx({
                tr: 'JSON yedek dosyası seç',
                en: 'Choose JSON backup file',
              })}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#23232B] dark:text-[#F4F4F5] dark:hover:bg-[#2E2E38] whitespace-nowrap"
            >
              <Upload className="h-4 w-4 text-[#D9A13B]" />
              <span>{tx({ tr: '.json Dosyası Seç', en: 'Choose .json File' })}</span>
            </button>

            <button
              type="button"
              aria-expanded={showPasteBox}
              onClick={() => {
                setShowPasteBox((v) => !v);
                setImportError(null);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <FileJson className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
              <span>
                {showPasteBox
                  ? tx({ tr: 'Yapıştırma Alanını Kapat', en: 'Close Paste Box' })
                  : tx({ tr: 'JSON Metni Yapıştır', en: 'Paste JSON Text' })}
              </span>
            </button>
          </div>

          {showPasteBox && (
            <div className="space-y-2.5">
              <textarea
                rows={5}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder='{"schema": "teachers-kingdom-backup", "schemaVersion": 1, ...}'
                className="w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] p-3 font-mono text-xs text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
              <button
                type="button"
                disabled={!pasteText.trim()}
                onClick={handleValidatePastedJson}
                className="h-9 rounded-lg bg-[#7C1D2E] px-4 text-xs font-medium text-white hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                {tx({ tr: 'JSON İçeriğini Doğrula', en: 'Validate JSON Content' })}
              </button>
            </div>
          )}

          {/* Validation Error Banner */}
          {importError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-[#B91C1C]/40 bg-[#FEF2F2] p-3.5 text-xs sm:text-sm text-[#991B1B] dark:border-[#EF4444]/40 dark:bg-[#3B1014] dark:text-[#FCA5A5]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Import Success Banner */}
          {importSuccess && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] p-3.5 text-xs sm:text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {/* Validated Pre-Import Preview Card */}
          {pendingBackup && pendingStats && (
            <div className="rounded-xl border border-[#7C1D2E]/50 bg-[#F6F6F4] p-5 space-y-4 dark:border-[#D9A13B]/50 dark:bg-[#111113]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({
                    tr: 'Yedek Şeması Doğrulandı — Onayınız Bekleniyor',
                    en: 'Backup Schema Validated — Awaiting Confirmation',
                  })}
                </p>
                <span className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B]">
                  {pendingBackup.sourceFormat === 'envelope-v1'
                    ? tx({ tr: 'Resmî Yedek v1', en: 'Official Backup v1' })
                    : tx({ tr: 'Ham tk_stage1_progress_v1', en: 'Raw tk_stage1_progress_v1' })}
                </span>
              </div>

              {pendingBackup.exportedAt && (
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  {tx(
                    { tr: 'Dışa aktarma zamanı: {{time}}', en: 'Exported at: {{time}}' },
                    { time: formatClock(pendingBackup.exportedAt) }
                  )}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({ tr: 'Yedek XP (A1 / A2)', en: 'Backup XP (A1 / A2)' })}
                  </span>
                  <p className="mt-0.5 font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                    A1 {pendingStats.xp} XP{pendingStats.hasA2 ? ` · A2 ${pendingStats.a2Xp} XP` : ''}
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({ tr: 'Çekirdek A1', en: 'Core A1' })}
                  </span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {tx(
                      { tr: '{{w}} K · {{l}} D · {{r}} O', en: '{{w}} V · {{l}} L · {{r}} R' },
                      {
                        w: pendingStats.uniqueWords,
                        l: pendingStats.listening,
                        r: pendingStats.reading,
                      }
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({ tr: 'Üretim & A2', en: 'Production & A2' })}
                  </span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {tx(
                      {
                        tr: '{{wr}} Y · {{sp}} K · {{a2w}} A2K · {{a2l}} A2D · {{a2r}} A2O · {{a2wr}} A2Y · {{a2sp}} A2S · {{a2a}} A2E',
                        en: '{{wr}} W · {{sp}} S · {{a2w}} A2V · {{a2l}} A2L · {{a2r}} A2R · {{a2wr}} A2W · {{a2sp}} A2S · {{a2a}} A2A',
                      },
                      {
                        wr: pendingStats.writing,
                        sp: pendingStats.speaking,
                        a2w: pendingStats.a2Words,
                        a2l: pendingStats.a2Listening,
                        a2r: pendingStats.a2Reading,
                        a2wr: pendingStats.a2Writing,
                        a2sp: pendingStats.a2Speaking,
                        a2a: pendingStats.a2Activities,
                      }
                    )}
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({ tr: 'Öğretim (Yerel)', en: 'Teaching (Local)' })}
                  </span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {tx(
                      {
                        tr: '{{c}} sınıf · {{ca}}/{{a}} ödev · {{d}} taslak',
                        en: '{{c}} classes · {{ca}}/{{a}} tasks · {{d}} drafts',
                      },
                      {
                        c: pendingStats.classes,
                        ca: pendingStats.completedAssignments,
                        a: pendingStats.assignments,
                        d: pendingStats.drafts,
                      }
                    )}
                  </p>
                </div>
              </div>

              {pendingBackup.warningsTr.length > 0 && (
                <ul className="space-y-1 text-xs text-[#9A6B16] dark:text-[#F6D693]">
                  {isEn ? (
                    <li>
                      • Legacy or partial fields in this backup were safely normalized before
                      import.
                    </li>
                  ) : (
                    pendingBackup.warningsTr.map((w, idx) => <li key={idx}>• {w}</li>)
                  )}
                </ul>
              )}

              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Seçili işlem:', en: 'Selected action:' })}{' '}
                <strong className="text-[#111113] dark:text-[#F4F4F5]">
                  {importMode === 'replace'
                    ? tx({
                        tr: 'Tam Geri Yükleme (mevcut tarayıcı verisinin yerine geçer)',
                        en: 'Full Restore (replaces current browser data)',
                      })
                    : tx({
                        tr: 'Güvenli Birleştirme (benzersiz kazanımları birleştirir, çift XP eklemez)',
                        en: 'Safe Merge (combines unique completions without duplicate XP)',
                      })}
                </strong>
              </p>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingBackup(null)}
                  className="h-9 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]"
                >
                  {locale.common.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="h-9 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  {tx({ tr: 'İçe Aktarmayı Onayla', en: 'Confirm Import' })}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. DATA INTEGRITY & SAFE TWO-STEP RESET */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
            <div>
              <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'Veri Bütünlüğü ve Güvenli Sıfırlama',
                  en: 'Data Integrity & Safe Reset',
                })}
              </h2>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {integrity.isHealthy && a2Integrity.isHealthy
                  ? tx(
                      {
                        tr: 'Bütünlük doğrulandı · {{a1}} A1 kazanımı · {{a2w}} A2 kelimesi · {{a2l}} A2 dinleme · {{a2r}} A2 okuma · {{a2wr}} A2 yazma · {{a2sp}} A2 konuşma · {{a2a}} A2 etkinlik/sınav · Çift XP koruması aktif',
                        en: 'Integrity verified · {{a1}} A1 items · {{a2w}} A2 words · {{a2l}} A2 listening · {{a2r}} A2 reading · {{a2wr}} A2 writing · {{a2sp}} A2 speaking · {{a2a}} A2 activities/exams · Duplicate-XP guard active',
                      },
                      {
                        a1: integrity.totalUniqueMasteredItems,
                        a2w: a2Integrity.totalUniqueMasteredWords,
                        a2l: a2Integrity.totalUniqueListeningItems,
                        a2r: a2Integrity.totalUniqueReadingItems,
                        a2wr: a2Integrity.totalUniqueWritingTasks,
                        a2sp: a2Integrity.totalUniqueSpeakingTasks,
                        a2a: a2Integrity.totalUniqueActivityItems,
                      }
                    )
                  : isEn
                  ? 'Data consistency check detected anomalies in stored progress. Download a backup before resetting.'
                  : [...integrity.issuesTr, ...a2Integrity.issuesTr].join(' ')}
              </p>
            </div>
          </div>

          {!resetPanelOpen && (
            <button
              type="button"
              onClick={() => {
                setResetPanelOpen(true);
                setResetTarget('local-only');
                setResetConfirmedCheck(false);
                setResetKeywordInput('');
                setResetError(null);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#B91C1C]/40 px-4 text-xs font-medium text-[#991B1B] transition-colors hover:bg-[#FEF2F2] dark:border-[#EF4444]/40 dark:text-[#FCA5A5] dark:hover:bg-[#450A0A]/40 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'Güvenli Sıfırlama', en: 'Safe Reset' })}</span>
            </button>
          )}
        </div>

        {resetNotice && (
          <div
            role="status"
            className="rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-3 text-xs sm:text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
          >
            {resetNotice}
          </div>
        )}

        {resetError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-[#B91C1C]/40 bg-[#FEF2F2] px-4 py-3 text-xs sm:text-sm font-medium text-[#991B1B] dark:border-[#EF4444]/40 dark:bg-[#3B1014] dark:text-[#FCA5A5]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{resetError}</span>
          </div>
        )}

        {resetPanelOpen && (
          <div className="rounded-xl border border-[#B91C1C]/35 bg-[#FEF2F2]/60 p-5 space-y-4 dark:border-[#EF4444]/35 dark:bg-[#2A1013]/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#991B1B] dark:text-[#FCA5A5]">
                  {isCloudResetSelected
                    ? isEn
                      ? 'Warning: Local & Cloud Data Will Be Permanently Erased'
                      : 'Dikkat: Hem Yerel Hem Bulut Verileri Kalıcı Olarak Sıfırlanacak'
                    : isEn
                    ? 'Notice: Only Local Browser Data Will Be Reset (Cloud Protected)'
                    : 'Dikkat: Yalnızca Yerel Tarayıcı Verisi Sıfırlanacak (Bulut Korunur)'}
                </p>
                <p className="mt-0.5 text-xs text-[#7F1D1D] dark:text-[#FECACA]">
                  {tx({
                    tr: 'İşlemden önce ilerlemenizi kaybetmemek için JSON yedeği indirmeniz önerilir.',
                    en: 'Downloading a JSON backup first is recommended so you do not lose your progress.',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] whitespace-nowrap shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'Önce Yedek İndir', en: 'Download Backup First' })}</span>
              </button>
            </div>

            {/* Reset Target Selector: Local-only vs. Local + Cloud */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setResetTarget('local-only');
                  setResetConfirmedCheck(false);
                  setResetKeywordInput('');
                  setResetError(null);
                }}
                aria-pressed={resetTarget === 'local-only'}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  resetTarget === 'local-only'
                    ? 'border-[#0D0D0D] bg-[#FFFFFF] text-[#0D0D0D] dark:border-[#D4AF37] dark:bg-[#16161A] dark:text-[#FFFFFF]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF]/60 text-[#52525B] dark:border-[#282830] dark:bg-[#16161A]/60 dark:text-[#A1A1AA]'
                }`}
              >
                <p className="font-semibold">
                  {isEn
                    ? '1. Reset Local Data Only (Cloud Safe)'
                    : '1. Yalnızca Yerel Verileri Sıfırla (Bulut Korunur)'}
                </p>
                <p className="mt-0.5 opacity-85">
                  {isEn
                    ? 'Clears only this browser. Supabase cloud data is untouched and auto-upload pauses safely.'
                    : 'Yalnızca bu tarayıcıyı temizler. Supabase bulut kaydına dokunulmaz ve otomatik gönderim duraklatılır.'}
                </p>
              </button>

              <button
                type="button"
                disabled={!cloudUser}
                onClick={() => {
                  setResetTarget('local-and-cloud');
                  setResetConfirmedCheck(false);
                  setResetKeywordInput('');
                  setResetError(null);
                }}
                aria-pressed={isCloudResetSelected}
                className={`rounded-lg border p-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCloudResetSelected
                    ? 'border-[#7A1C24] bg-[#FFFFFF] text-[#7A1C24] ring-1 ring-[#7A1C24] dark:border-[#FCA5A5] dark:bg-[#16161A] dark:text-[#FCA5A5] dark:ring-[#FCA5A5]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF]/60 text-[#52525B] dark:border-[#282830] dark:bg-[#16161A]/60 dark:text-[#A1A1AA]'
                }`}
              >
                <p className="font-semibold">
                  {isEn
                    ? '2. Reset Local + Cloud Data (Permanent)'
                    : '2. Bulut Dahil Sıfırla (Kalıcı / Geri Alınamaz)'}
                </p>
                <p className="mt-0.5 opacity-85">
                  {cloudUser
                    ? isEn
                      ? `Erases selected data both locally and in Supabase (${cloudUser.email}).`
                      : `Seçili kapsamı hem yerelde hem de Supabase hesabınızda (${cloudUser.email}) kalıcı olarak sıfırlar.`
                    : isEn
                    ? 'Sign in with a cloud account to reset remote cloud data.'
                    : 'Bulut verilerini sıfırlamak için aktif bir bulut oturumu gerekir.'}
                </p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setResetScope('progress-only')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  resetScope === 'progress-only'
                    ? 'border-[#991B1B] bg-[#FFFFFF] text-[#111113] dark:border-[#FCA5A5] dark:bg-[#16161A] dark:text-[#F4F4F5]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF]/60 text-[#52525B] dark:border-[#282830] dark:bg-[#16161A]/60 dark:text-[#A1A1AA]'
                }`}
              >
                <p className="font-semibold">
                  {tx({
                    tr: 'Yalnızca A1 İlerlemesini Sıfırla',
                    en: 'Reset A1 Progress Only',
                  })}
                </p>
                <p className="mt-0.5 opacity-85">
                  {tx({
                    tr: 'tk_stage1_progress_v1 sıfırlanır; A2 kaydınız, tema ve profil adınız korunur.',
                    en: 'Resets tk_stage1_progress_v1; preserves your A2 progress, theme, and display name.',
                  })}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setResetScope('a2-only')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  resetScope === 'a2-only'
                    ? 'border-[#991B1B] bg-[#FFFFFF] text-[#111113] dark:border-[#FCA5A5] dark:bg-[#16161A] dark:text-[#F4F4F5]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF]/60 text-[#52525B] dark:border-[#282830] dark:bg-[#16161A]/60 dark:text-[#A1A1AA]'
                }`}
              >
                <p className="font-semibold">
                  {tx({
                    tr: 'Yalnızca A2 İlerlemesini Sıfırla',
                    en: 'Reset A2 Progress Only',
                  })}
                </p>
                <p className="mt-0.5 opacity-85">
                  {tx({
                    tr: 'tk_course_de_a2_progress_v1 sıfırlanır; tüm A1 kaydınız korunur.',
                    en: 'Resets tk_course_de_a2_progress_v1; preserves all of your A1 progress.',
                  })}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setResetScope('all-local')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  resetScope === 'all-local'
                    ? 'border-[#991B1B] bg-[#FFFFFF] text-[#111113] dark:border-[#FCA5A5] dark:bg-[#16161A] dark:text-[#F4F4F5]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF]/60 text-[#52525B] dark:border-[#282830] dark:bg-[#16161A]/60 dark:text-[#A1A1AA]'
                }`}
              >
                <p className="font-semibold">
                  {isCloudResetSelected
                    ? tx({
                        tr: 'Tüm Yerel + Bulut Oturumunu Temizle',
                        en: 'Clear All Local + Cloud Data',
                      })
                    : tx({
                        tr: 'Tüm Yerel Oturumu Temizle',
                        en: 'Clear All Local Session Data',
                      })}
                </p>
                <p className="mt-0.5 opacity-85">
                  {tx({
                    tr: 'A1 ve A2 kayıtlarına ek olarak görünen ad ve rol/hız tercihleri de sıfırlanır.',
                    en: 'Resets A1 and A2 progress as well as display name and role/speed preferences.',
                  })}
                </p>
              </button>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#7F1D1D] dark:text-[#FECACA] cursor-pointer">
              <input
                type="checkbox"
                checked={resetConfirmedCheck}
                onChange={(e) => setResetConfirmedCheck(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#B91C1C]"
              />
              <span>
                {isCloudResetSelected
                  ? isEn
                    ? 'I understand that the selected data will be permanently deleted from BOTH this browser and my Supabase cloud account and cannot be undone.'
                    : 'Seçili verilerin HEM bu tarayıcıdan HEM de Supabase bulut hesabımdan geri alınamayacak biçimde silineceğini anlıyor ve onaylıyorum.'
                  : isEn
                  ? 'I understand that the selected local browser data will be permanently reset (my cloud backup will remain safe).'
                  : 'Seçili yerel tarayıcı verisinin geri alınamayacak biçimde sıfırlanacağını anlıyor ve onaylıyorum (bulut verilerim korunacaktır).'}
              </span>
            </label>

            {isCloudResetSelected && (
              <div className="space-y-1.5">
                <label
                  htmlFor="tk-cloud-reset-confirm-input"
                  className="block text-xs font-semibold text-[#991B1B] dark:text-[#FCA5A5]"
                >
                  {isEn
                    ? `Type "${expectedResetKeyword}" to confirm irreversible cloud reset:`
                    : `Geri döndürülemez bulut sıfırlamasını onaylamak için "${expectedResetKeyword}" yazın:`}
                </label>
                <input
                  id="tk-cloud-reset-confirm-input"
                  type="text"
                  value={resetKeywordInput}
                  onChange={(e) => setResetKeywordInput(e.target.value)}
                  placeholder={expectedResetKeyword}
                  autoComplete="off"
                  className="w-full max-w-xs rounded-lg border border-[#B91C1C]/45 bg-[#FFFFFF] px-3 py-2 font-mono text-xs text-[#0D0D0D] focus:border-[#7A1C24] focus:outline-none dark:border-[#EF4444]/45 dark:bg-[#0D0D0D] dark:text-[#FFFFFF]"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                disabled={resetBusy}
                onClick={() => {
                  setResetPanelOpen(false);
                  setResetConfirmedCheck(false);
                  setResetKeywordInput('');
                  setResetError(null);
                }}
                className="h-9 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]"
              >
                {locale.common.cancel}
              </button>
              <button
                type="button"
                disabled={!canConfirmReset}
                onClick={() => void handleExecuteReset()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#B91C1C] px-4 text-xs font-semibold text-white hover:bg-[#991B1B] disabled:opacity-40"
              >
                {resetBusy && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>
                  {isCloudResetSelected
                    ? isEn
                      ? 'Confirm Local + Cloud Reset'
                      : 'Evet, Yerel ve Bulut Verisini Sıfırla'
                    : isEn
                    ? 'Confirm Local-Only Reset'
                    : 'Evet, Yalnızca Yerel Veriyi Sıfırla'}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
