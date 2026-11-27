import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CloudOff,
  Copy,
  Download,
  FileJson,
  HardDrive,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
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

function formatClockTr(iso: string | null): string {
  if (!iso) return 'Henüz bu oturumda yazılmadı';
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export const DataPortabilityPanel: React.FC = () => {
  const {
    theme,
    rolePreview,
    speechSpeed,
    activeCourse,
    displayName,
    progress,
    a2Progress,
    lastSavedAt,
    importLocalData,
    resetProgress,
    resetA2Progress,
    resetAllLocalData,
  } = useAppState();

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

  // Safe two-step reset state
  const [resetPanelOpen, setResetPanelOpen] = useState(false);
  const [resetScope, setResetScope] = useState<'progress-only' | 'a2-only' | 'all-local'>(
    'progress-only'
  );
  const [resetConfirmedCheck, setResetConfirmedCheck] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

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
      },
      a2Progress
    );
    setExportNotice(`Yedek dosyası (A1 + A2) oluşturuldu: ${filename}`);
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
      },
      a2Progress
    );
    const jsonText = JSON.stringify(envelope, null, 2);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonText);
        setCopiedJson(true);
        setCopyFallbackJson(null);
        setExportNotice('JSON yedek metni (A1 + A2) panoya kopyalandı.');
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
      'Tarayıcı pano erişimini kısıtladı; JSON yedeğini aşağıdaki kutudan kopyalayabilirsiniz.'
    );
  };

  const validateRawText = (rawText: string) => {
    setImportError(null);
    setImportSuccess(null);
    const result = parseAndValidateBackup(rawText);
    if (!result.ok) {
      setPendingBackup(null);
      setImportError(result.errorTr);
      return;
    }
    setPendingBackup(result.data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      setPendingBackup(null);
      setImportError('Seçilen dosya 2 MB sınırını aşıyor; geçerli bir yerel yedek değil.');
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
      setImportError('Dosya okunamadı. Lütfen geçerli bir .json dosyası seçin.');
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
          ? `A1 +${a1Delta} XP (toplam ${outcome.xpAfter} XP)`
          : `A1 çift XP eklenmedi (${outcome.xpAfter} XP)`
      );
      if (outcome.a2XpAfter > 0 || outcome.a2XpBefore > 0) {
        parts.push(
          a2Delta > 0
            ? `A2 +${a2Delta} XP (toplam ${outcome.a2XpAfter} XP)`
            : `A2 çift XP eklenmedi (${outcome.a2XpAfter} XP)`
        );
      }
      setImportSuccess(`Yedek güvenli biçimde birleştirildi: ${parts.join(' · ')}.`);
    } else {
      const a2Suffix =
        outcome.a2XpAfter > 0 ? ` · A2 ${outcome.a2XpAfter} XP` : '';
      setImportSuccess(
        `Yerel ilerleme yedeği geri yüklendi (A1 ${outcome.xpAfter} XP${a2Suffix}).`
      );
    }
    window.setTimeout(() => setImportSuccess(null), 5000);
  };

  const handleExecuteReset = () => {
    if (!resetConfirmedCheck) return;
    if (resetScope === 'all-local') {
      resetAllLocalData();
      setResetNotice(
        'A1 ve A2 ilerleme kayıtları, yerel sınıflar, ödevler, taslaklar ve profil tercihleri sıfırlandı.'
      );
    } else if (resetScope === 'a2-only') {
      resetA2Progress();
      setResetNotice(
        `Almanca A2 ilerleme kaydı (${STORAGE_KEY_A2_STATE}) sıfırlandı; Almanca A1 ilerlemeniz ve tercihleriniz korundu.`
      );
    } else {
      resetProgress();
      setResetNotice(
        `Almanca A1 ilerleme kaydı (${STORAGE_KEY_STATE}) sıfırlandı; A2 kaydınız, tema ve profil adınız korundu.`
      );
    }
    setResetPanelOpen(false);
    setResetConfirmedCheck(false);
    window.setTimeout(() => setResetNotice(null), 4000);
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
              Hesap, Servis Katmanı ve Senkronizasyon Mimarisi
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Hesap ve Senkronizasyon Durumu
            </h2>
          </div>
          <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
            Şema v{TK_BACKUP_SCHEMA_VERSION} · {STORAGE_KEY_STATE} · {platformServices.progressSync.id}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Today: Local Browser Layer */}
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#282830] dark:bg-[#111113]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                <HardDrive className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>Bugün Aktif: Yerel Tarayıcı Depolaması</span>
              </span>
              <span className="font-mono text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
                {diagnostics.available ? 'Çalışıyor' : 'Kısıtlı'}
              </span>
            </div>

            <dl className="divide-y divide-[#ECECE8] text-xs dark:divide-[#24242C]">
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Yerel Profil</dt>
                <dd className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate max-w-[180px]">
                  {displayName || 'Misafir Kullanıcı'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Rol Önizlemesi</dt>
                <dd className="font-medium text-[#111113] dark:text-[#F4F4F5]">
                  {rolePreview === 'teacher' ? 'Öğretmen' : 'Öğrenci'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Depolama Boyutu (A1 + A2)</dt>
                <dd className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {formatBytesTr(diagnostics.totalBytes)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">İzole A2 Kaydı</dt>
                <dd className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {a2Progress.xp} XP · {formatBytesTr(diagnostics.a2ProgressBytes)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-[#52525B] dark:text-[#A1A1AA]">Son Yerel Kayıt</dt>
                <dd className="font-mono text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                  {formatClockTr(lastSavedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* External Backend / Cloud Sync Layer */}
          <div className="rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#282830] dark:bg-[#111113]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                <CloudOff className="h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B]" />
                <span>Harici Sunucu &amp; Bulut Senkronizasyonu</span>
              </span>
              <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Bağlı Değil
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
              İstemci servis arayüzleri (kimlik doğrulama, bulut eşitleme ve sınıf kalıcılığı) arka uç bağlantısı için ayrılmıştır; ancak şu an bağlı bir sunucu olmadığından tüm işlemler yerel tarayıcıda çalışır.
            </p>
            <ul className="space-y-1.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <li>• Çoklu cihaz otomatik eşitleme için harici veritabanı ve API gerekir.</li>
              <li>• Kalıcı öğretmen/öğrenci oturumu için kimlik doğrulama servisi gerekir.</li>
              <li>• Cihazlar arası taşıma için aşağıdaki JSON yedekleme aracını bugün kullanabilirsiniz.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. JSON EXPORT & SCHEMA-VALIDATED IMPORT */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Yerel Yedekleme ve Veri Taşıma (JSON)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
            Almanca A1 ve A2 ilerlemenizi, XP kayıtlarınızı, yerel sınıflarınızı, ödevlerinizi ve Öğretmen Stüdyosu taslaklarınızı tek bir şema doğrulamalı JSON dosyasıyla dışa/içe aktarın.
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
              <span>JSON Yedeği İndir</span>
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
              <span>{copiedJson ? 'JSON Kopyalandı' : 'JSON Metnini Kopyala'}</span>
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
                  Manuel JSON Kopyalama Alanı
                </span>
                <button
                  type="button"
                  onClick={() => setCopyFallbackJson(null)}
                  className="underline text-[#78350F] dark:text-[#F6D693]"
                >
                  Kapat
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
                JSON Yedeği İçe Aktar (Şema Doğrulamalı)
              </h3>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Bozuk veya geçersiz dosyalar mevcut verinize dokunmadan reddedilir.
              </p>
            </div>

            {/* Import Mode Selector */}
            <div
              role="group"
              aria-label="İçe aktarma modu"
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
                Tam Geri Yükle
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
                Birleştir (Çift XP Korumalı)
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
              aria-label="JSON yedek dosyası seç"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs sm:text-sm font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] dark:bg-[#23232B] dark:text-[#F4F4F5] dark:hover:bg-[#2E2E38] whitespace-nowrap"
            >
              <Upload className="h-4 w-4 text-[#D9A13B]" />
              <span>.json Dosyası Seç</span>
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
              <span>{showPasteBox ? 'Yapıştırma Alanını Kapat' : 'JSON Metni Yapıştır'}</span>
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
                JSON İçeriğini Doğrula
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
                  Yedek Şeması Doğrulandı — Onayınız Bekleniyor
                </p>
                <span className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B]">
                  {pendingBackup.sourceFormat === 'envelope-v1'
                    ? 'Resmî Yedek v1'
                    : 'Ham tk_stage1_progress_v1'}
                </span>
              </div>

              {pendingBackup.exportedAt && (
                <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  Dışa aktarma zamanı: {formatClockTr(pendingBackup.exportedAt)}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">Yedek XP (A1 / A2)</span>
                  <p className="mt-0.5 font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                    A1 {pendingStats.xp} XP{pendingStats.hasA2 ? ` · A2 ${pendingStats.a2Xp} XP` : ''}
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">Çekirdek A1</span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {pendingStats.uniqueWords} K · {pendingStats.listening} D · {pendingStats.reading} O
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">Üretim &amp; A2</span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {pendingStats.writing} Y · {pendingStats.speaking} K · {pendingStats.a2Words} A2K · {pendingStats.a2Listening} A2D · {pendingStats.a2Reading} A2O · {pendingStats.a2Writing} A2Y · {pendingStats.a2Speaking} A2S · {pendingStats.a2Activities} A2E
                  </p>
                </div>
                <div className="rounded-lg border border-[#ECECE8] bg-[#FFFFFF] p-2.5 dark:border-[#24242C] dark:bg-[#16161A]">
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">Öğretim (Yerel)</span>
                  <p className="mt-0.5 font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {pendingStats.classes} sınıf · {pendingStats.completedAssignments}/{pendingStats.assignments} ödev · {pendingStats.drafts} taslak
                  </p>
                </div>
              </div>

              {pendingBackup.warningsTr.length > 0 && (
                <ul className="space-y-1 text-xs text-[#9A6B16] dark:text-[#F6D693]">
                  {pendingBackup.warningsTr.map((w, idx) => (
                    <li key={idx}>• {w}</li>
                  ))}
                </ul>
              )}

              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Seçili işlem:{' '}
                <strong className="text-[#111113] dark:text-[#F4F4F5]">
                  {importMode === 'replace'
                    ? 'Tam Geri Yükleme (mevcut tarayıcı verisinin yerine geçer)'
                    : 'Güvenli Birleştirme (benzersiz kazanımları birleştirir, çift XP eklemez)'}
                </strong>
              </p>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingBackup(null)}
                  className="h-9 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="h-9 rounded-lg bg-[#7C1D2E] px-4 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                >
                  İçe Aktarmayı Onayla
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
                Veri Bütünlüğü ve Güvenli Sıfırlama
              </h2>
              <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {integrity.isHealthy && a2Integrity.isHealthy
                  ? `Bütünlük doğrulandı · ${integrity.totalUniqueMasteredItems} A1 kazanımı · ${a2Integrity.totalUniqueMasteredWords} A2 kelimesi · ${a2Integrity.totalUniqueListeningItems} A2 dinleme · ${a2Integrity.totalUniqueReadingItems} A2 okuma · ${a2Integrity.totalUniqueWritingTasks} A2 yazma · ${a2Integrity.totalUniqueSpeakingTasks} A2 konuşma · ${a2Integrity.totalUniqueActivityItems} A2 etkinlik/sınav · Çift XP koruması aktif`
                  : [...integrity.issuesTr, ...a2Integrity.issuesTr].join(' ')}
              </p>
            </div>
          </div>

          {!resetPanelOpen && (
            <button
              type="button"
              onClick={() => {
                setResetPanelOpen(true);
                setResetConfirmedCheck(false);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#B91C1C]/40 px-4 text-xs font-medium text-[#991B1B] transition-colors hover:bg-[#FEF2F2] dark:border-[#EF4444]/40 dark:text-[#FCA5A5] dark:hover:bg-[#450A0A]/40 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Güvenli Sıfırlama</span>
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

        {resetPanelOpen && (
          <div className="rounded-xl border border-[#B91C1C]/35 bg-[#FEF2F2]/60 p-5 space-y-4 dark:border-[#EF4444]/35 dark:bg-[#2A1013]/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#991B1B] dark:text-[#FCA5A5]">
                  Dikkat: Yerel Tarayıcı Verisi Sıfırlanacak
                </p>
                <p className="mt-0.5 text-xs text-[#7F1D1D] dark:text-[#FECACA]">
                  İşlemden önce ilerlemenizi kaybetmemek için JSON yedeği indirmeniz önerilir.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] whitespace-nowrap shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Önce Yedek İndir</span>
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
                <p className="font-semibold">Yalnızca A1 İlerlemesini Sıfırla</p>
                <p className="mt-0.5 opacity-85">
                  tk_stage1_progress_v1 sıfırlanır; A2 kaydınız, tema ve profil adınız korunur.
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
                <p className="font-semibold">Yalnızca A2 İlerlemesini Sıfırla</p>
                <p className="mt-0.5 opacity-85">
                  tk_course_de_a2_progress_v1 sıfırlanır; tüm A1 kaydınız korunur.
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
                <p className="font-semibold">Tüm Yerel Oturumu Temizle</p>
                <p className="mt-0.5 opacity-85">
                  A1 ve A2 kayıtlarına ek olarak görünen ad ve rol/hız tercihleri de sıfırlanır.
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
                Seçili yerel tarayıcı verisinin geri alınamayacak biçimde sıfırlanacağını anlıyor ve onaylıyorum.
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setResetPanelOpen(false);
                  setResetConfirmedCheck(false);
                }}
                className="h-9 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={!resetConfirmedCheck}
                onClick={handleExecuteReset}
                className="h-9 rounded-lg bg-[#B91C1C] px-4 text-xs font-semibold text-white hover:bg-[#991B1B] disabled:opacity-40"
              >
                Evet, Seçili Veriyi Sıfırla
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
