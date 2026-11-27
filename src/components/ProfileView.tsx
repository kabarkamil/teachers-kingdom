import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Cloud,
  CloudOff,
  Download,
  HardDrive,
  SlidersHorizontal,
  UserCircle,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { formatSyncStatusLabel } from '../services/cloudSyncService';
import { TOTAL_ACTIVITY_ITEMS } from '../data/germanA1Activities';
import { TOTAL_LISTENING_EXERCISES } from '../data/germanA1Listening';
import { TOTAL_READING_EXERCISES } from '../data/germanA1Reading';
import { TOTAL_SPEAKING_TASKS } from '../data/germanA1Speaking';
import { TOTAL_WRITING_TASKS } from '../data/germanA1Writing';
import { ALL_A1_WORDS } from '../data/germanA1Vocab';
import { TOTAL_A2_ACTIVITY_ITEMS } from '../data/germanA2Activities';
import { TOTAL_A2_LISTENING_EXERCISES } from '../data/germanA2Listening';
import { TOTAL_A2_READING_EXERCISES } from '../data/germanA2Reading';
import { TOTAL_A2_SPEAKING_TASKS } from '../data/germanA2Speaking';
import { TOTAL_A2_WRITING_TASKS } from '../data/germanA2Writing';
import { ALL_A2_WORDS } from '../data/germanA2Vocab';
import { tr } from '../i18n/tr';
import type { NavRouteId } from '../types';
import {
  formatBytesTr,
  getLocalStorageDiagnostics,
  triggerJsonBackupDownload,
} from '../utils/dataPortability';

interface ProfileViewProps {
  onNavigate: (route: NavRouteId) => void;
}

function formatSavedTimeTr(iso: string | null): string {
  if (!iso) return 'Bu oturumda hazır';
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const {
    theme,
    speechSpeed,
    activeCourse,
    uiLanguage,
    displayName,
    setDisplayName,
    rolePreview,
    setRolePreview,
    progress,
    a2Progress,
    lastSavedAt,
    cloudUser,
    cloudSyncStatus,
    lastCloudSyncAt,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
    overallAccuracyPercent,
    a2OverallAccuracyPercent,
  } = useAppState();

  const [draftName, setDraftName] = useState(displayName);
  const [savedNotice, setSavedNotice] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const storageInfo = useMemo(
    () => getLocalStorageDiagnostics(),
    [progress, a2Progress, lastSavedAt]
  );

  const completedAssignmentsCount = progress.teachingAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'reviewed'
  ).length;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayName(draftName);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleQuickExport = () => {
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
    setExportMessage(`Yedek dosyası (A1 + A2) indirildi: ${filename}`);
    window.setTimeout(() => setExportMessage(null), 4000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-8">
      <div className="border-b border-[#D9D9D3] pb-6 dark:border-[#282830]">
        <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          Kişisel Alan · Yerel Tarayıcı Profili
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
          Profil
        </h1>
      </div>

      {/* Local Profile Card */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECECE8] pb-6 dark:border-[#24242C]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#111113] text-[#D9A13B] dark:bg-[#1E1E24]">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {displayName || 'Misafir Kullanıcı'}
              </h2>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {rolePreview === 'teacher' ? 'Öğretmen Önizlemesi' : 'Öğrenci Önizlemesi'} ·{' '}
                {tr.course.language} {activeCourse === 'de-A2' ? 'A2' : 'A1'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-right">
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 XP</p>
              <p className="font-mono text-lg font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {progress.xp}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 XP</p>
              <p className="font-mono text-lg font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                {a2Progress.xp}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Kelime</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {uniqueCompletedWordIds.length}/{ALL_A1_WORDS.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Kelime</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {uniqueA2CompletedWordIds.length}/{ALL_A2_WORDS.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Dinleme</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.listeningMasteredIds.length}/{TOTAL_A2_LISTENING_EXERCISES}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Okuma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.readingMasteredIds.length}/{TOTAL_A2_READING_EXERCISES}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Yazma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.writingMasteredIds.length}/{TOTAL_A2_WRITING_TASKS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Konuşma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.speakingMasteredIds.length}/{TOTAL_A2_SPEAKING_TASKS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Etkinlik</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2Progress.activityMasteredIds.length}/{TOTAL_A2_ACTIVITY_ITEMS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A2 Doğruluk</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {a2OverallAccuracyPercent === null ? '—' : `%${a2OverallAccuracyPercent}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Dinleme</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.listeningMasteredIds.length}/{TOTAL_LISTENING_EXERCISES}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Okuma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.readingMasteredIds.length}/{TOTAL_READING_EXERCISES}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Yazma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.writingMasteredIds.length}/{TOTAL_WRITING_TASKS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Konuşma</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.speakingMasteredIds.length}/{TOTAL_SPEAKING_TASKS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Etkinlik</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {progress.activityMasteredIds.length}/{TOTAL_ACTIVITY_ITEMS}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">Ödev</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {completedAssignmentsCount}/{progress.teachingAssignments.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">A1 Doğruluk</p>
              <p className="font-mono text-lg font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                {overallAccuracyPercent === null ? '—' : `%${overallAccuracyPercent}`}
              </p>
            </div>
          </div>
        </div>

        {/* Editable Local Profile Form */}
        <form onSubmit={handleSaveName} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-display-name"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Görünen Ad (Yerel Tarayıcı Kaydı)
              </label>
              <input
                id="profile-display-name"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Adınız veya takma adınız"
                maxLength={48}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Aktif Görünüm Rolü
              </span>
              <div role="group" aria-label="Aktif Görünüm Rolü" className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={rolePreview === 'student'}
                  onClick={() => setRolePreview('student')}
                  className={`h-[42px] rounded-lg border text-sm font-medium transition-colors ${
                    rolePreview === 'student'
                      ? 'border-[#111113] bg-[#111113] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                  }`}
                >
                  Öğrenci
                </button>
                <button
                  type="button"
                  aria-pressed={rolePreview === 'teacher'}
                  onClick={() => setRolePreview('teacher')}
                  className={`h-[42px] rounded-lg border text-sm font-medium transition-colors ${
                    rolePreview === 'teacher'
                      ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#B8324B] dark:bg-[#B8324B]'
                      : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                  }`}
                >
                  Öğretmen
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              {savedNotice && <Check className="h-4 w-4" />}
              <span>{savedNotice ? 'Kaydedildi' : 'Yerel Profili Kaydet'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7C1D2E] hover:underline dark:text-[#D9A13B]"
            >
              <span>Ayrıntılı İlerleme Raporunu Gör</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Stage 8: Honest Local Storage vs. Cloud Sync Summary & Quick Portability */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              <HardDrive className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
              <span>Yerel Tarayıcı Depolaması · {storageInfo.available ? 'Aktif' : 'Kısıtlı'}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
              Profil adınız, XP puanınız, A1 ilerlemeniz, yerel sınıflarınız ({progress.teachingClasses.length}), ödevleriniz ({progress.teachingAssignments.length}) ve Öğretmen Stüdyosu taslaklarınız ({progress.studioDrafts.length}) yalnızca bu tarayıcıda tutulur.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#111113] dark:text-[#F4F4F5] tabular-nums">
              <span>Boyut: {formatBytesTr(storageInfo.totalBytes)}</span>
              <span>Son kayıt: {formatSavedTimeTr(lastSavedAt)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#0D0D0D]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {cloudUser ? (
                <Cloud className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
              ) : (
                <CloudOff className="h-4 w-4 text-[#9A6B16] dark:text-[#D4AF37]" />
              )}
              <span>
                Bulut Senkronizasyonu · {formatSyncStatusLabel(cloudSyncStatus, uiLanguage)}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
              {cloudUser
                ? `Bulut hesabı (${cloudUser.email}) bağlı. Profil, A1/A2 XP ve sınıf verileriniz son eşitleme (${formatSavedTimeTr(lastCloudSyncAt)}) ile korunur.`
                : 'Bulut oturumu açmadan çevrimdışı öncelikli yerel modda çalışıyorsunuz. Üst çubuktan bulut hesabıyla giriş yapabilir veya verilerinizi JSON olarak yedekleyebilirsiniz.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ECECE8] pt-4 dark:border-[#24242C]">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleQuickExport}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#111113] px-4 text-xs font-medium text-white transition-colors hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>JSON Yedeği İndir</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ayarlar')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-4 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5] dark:hover:bg-[#282830]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Yedekle / İçe Aktar (Ayarlar)</span>
            </button>
          </div>

          {exportMessage && (
            <p
              role="status"
              aria-live="polite"
              className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]"
            >
              {exportMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
