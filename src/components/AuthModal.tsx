import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  CloudOff,
  HardDrive,
  Info,
  LogOut,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { useI18n } from '../hooks/useI18n';
import { formatSyncStatusLabel } from '../services/cloudSyncService';
import type { UserRole } from '../types';
import { BrandMark } from './BrandMark';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onOpenPortability?: () => void;
}

type ModalTab = 'local' | 'cloud';
type CloudAuthMode = 'signin' | 'signup';

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onOpenPortability }) => {
  const {
    rolePreview,
    setRolePreview,
    displayName,
    setDisplayName,
    uiLanguage,
    cloudConfigured,
    cloudUser,
    cloudSyncStatus,
    lastCloudSyncAt,
    cloudSignIn,
    cloudSignUp,
    cloudSignOut,
    syncCloudNow,
  } = useAppState();
  const { locale, isEn, bcp47, tx } = useI18n();

  const [activeTab, setActiveTab] = useState<ModalTab>(() => (cloudUser ? 'cloud' : 'local'));
  const [nameInput, setNameInput] = useState(displayName);
  const [selectedRole, setSelectedRole] = useState<UserRole>(rolePreview);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Cloud auth form state
  const [cloudMode, setCloudMode] = useState<CloudAuthMode>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudSuccess, setCloudSuccess] = useState<string | null>(null);

  const dialogRef = useDialogFocus(open, onClose);

  useEffect(() => {
    if (open) {
      setNameInput(displayName);
      setSelectedRole(rolePreview);
      setSavedFeedback(false);
      setCloudError(null);
      setCloudSuccess(null);
      setActiveTab(cloudUser ? 'cloud' : 'local');
    }
  }, [open, displayName, rolePreview, cloudUser]);

  if (!open) return null;

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayName(nameInput);
    setRolePreview(selectedRole);
    setSavedFeedback(true);
    window.setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleCloudAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCloudError(null);
    setCloudSuccess(null);

    if (!emailInput.trim() || passwordInput.length < 6) {
      setCloudError(
        isEn
          ? 'Please enter a valid email and a password of at least 6 characters.'
          : 'Lütfen geçerli bir e-posta ve en az 6 karakterli bir parola girin.'
      );
      return;
    }

    setCloudBusy(true);
    const res =
      cloudMode === 'signin'
        ? await cloudSignIn(emailInput, passwordInput)
        : await cloudSignUp(emailInput, passwordInput, nameInput, selectedRole);
    setCloudBusy(false);

    if (!res.ok) {
      setCloudError(isEn ? (res.errorEn ?? res.errorTr ?? 'Error') : (res.errorTr ?? 'Hata'));
      return;
    }

    if (res.needsEmailConfirmation) {
      setCloudSuccess(
        isEn
          ? 'Account created! Please confirm your email link, then sign in to start cloud sync.'
          : 'Hesap oluşturuldu! E-postanızdaki doğrulama bağlantısını onayladıktan sonra giriş yapabilirsiniz.'
      );
      setPasswordInput('');
      return;
    }

    setPasswordInput('');
    setCloudSuccess(
      isEn
        ? 'Signed in and synced with the cloud.'
        : 'Bulut oturumu açıldı ve verileriniz eşitlendi.'
    );
  };

  const handleManualSync = async () => {
    setCloudError(null);
    setCloudSuccess(null);
    setCloudBusy(true);
    const res = await syncCloudNow();
    setCloudBusy(false);
    if (res.ok) {
      setCloudSuccess(isEn ? res.summaryEn : res.summaryTr);
    } else {
      setCloudError(isEn ? res.summaryEn : res.summaryTr);
    }
  };

  const handleSignOut = async () => {
    setCloudBusy(true);
    await cloudSignOut();
    setCloudBusy(false);
    setCloudSuccess(
      isEn
        ? 'Signed out of cloud sync. Your local progress stays safe on this device.'
        : 'Bulut oturumu kapatıldı. Yerel ilerlemeniz bu cihazda güvenle korunuyor.'
    );
  };

  const syncStatusLabel = formatSyncStatusLabel(cloudSyncStatus, uiLanguage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#0D0D0D]/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 shadow-xl dark:border-[#282830] dark:bg-[#16161A] focus:outline-none max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 shrink-0" />
            <div>
              <h2
                id="auth-modal-title"
                className="font-display text-xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
              >
                {locale.topBar.authAction}
              </h2>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {locale.brand.philosophy} · {locale.brand.mottoEn}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close modal' : 'Pencereyi kapat'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Mode Switcher: Local vs Cloud Sync */}
        <div
          role="tablist"
          aria-label={isEn ? 'Session mode' : 'Oturum modu'}
          className="mt-5 grid grid-cols-2 gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-1 dark:border-[#282830] dark:bg-[#0D0D0D]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'local'}
            onClick={() => setActiveTab('local')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors ${
              activeTab === 'local'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <HardDrive className="h-3.5 w-3.5" />
            <span>{isEn ? 'Local Mode' : 'Yerel Mod'}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cloud'}
            onClick={() => setActiveTab('cloud')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-colors ${
              activeTab === 'cloud'
                ? 'bg-[#7A1C24] text-white dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>{isEn ? 'Cloud Sync' : 'Bulut Senkron'}</span>
          </button>
        </div>

        {/* TAB 1: LOCAL PROFILE */}
        {activeTab === 'local' && (
          <form onSubmit={handleLocalSubmit} className="mt-5 space-y-4">
            <div className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 text-xs leading-relaxed text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6B16] dark:text-[#D4AF37]" />
                <p>
                  {isEn
                    ? 'Offline-first mode: Your profile name, A1 & A2 XP, classes, and assignments are saved instantly in localStorage without requiring an account.'
                    : 'Çevrimdışı öncelikli mod: Profil adınız, A1 & A2 XP puanlarınız, sınıflarınız ve ödevleriniz hesap gerektirmeden doğrudan tarayıcınızda (localStorage) saklanır.'}
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="tk-local-name"
                className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
              >
                {isEn ? 'Display Name (Local Profile)' : 'Görünen Adınız (Yerel Profil)'}
              </label>
              <input
                id="tk-local-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={isEn ? 'e.g. Zeynep Kaya' : 'Örn. Zeynep Kaya'}
                maxLength={48}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-[#71717A] focus:border-[#7A1C24] focus:outline-none dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                {isEn ? 'Platform Role' : 'Platform Görünüm Rolü'}
              </span>
              <div
                role="group"
                aria-label={locale.roles.previewLabel}
                className="mt-1.5 grid grid-cols-2 gap-2"
              >
                <button
                  type="button"
                  aria-pressed={selectedRole === 'student'}
                  onClick={() => setSelectedRole('student')}
                  className={`rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    selectedRole === 'student'
                      ? 'border-[#0D0D0D] bg-[#0D0D0D] text-[#FFFFFF] dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                      : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:border-[#0D0D0D]/40 dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
                  }`}
                >
                  {locale.roles.student}
                </button>
                <button
                  type="button"
                  aria-pressed={selectedRole === 'teacher'}
                  onClick={() => setSelectedRole('teacher')}
                  className={`rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    selectedRole === 'teacher'
                      ? 'border-[#7A1C24] bg-[#7A1C24] text-white dark:border-[#7A1C24] dark:bg-[#7A1C24] dark:text-white'
                      : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:border-[#7A1C24]/40 dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
                  }`}
                >
                  {locale.roles.teacher}
                </button>
              </div>
            </div>

            {onOpenPortability && (
              <div className="border-t border-[#ECECE8] pt-3 dark:border-[#24242C]">
                <button
                  type="button"
                  onClick={onOpenPortability}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 py-2 text-xs font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24]"
                >
                  <HardDrive className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
                  <span>
                    {isEn
                      ? 'Backup & Data Portability (JSON · Settings)'
                      : 'Yedekleme ve Veri Taşıma (JSON · Ayarlar)'}
                  </span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#D9D9D3] px-4 py-2 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#0D0D0D] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]"
              >
                {isEn ? 'Cancel' : 'Vazgeç'}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#7A1C24] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#62151C] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254]"
              >
                {savedFeedback
                  ? isEn
                    ? 'Saved'
                    : 'Kaydedildi'
                  : isEn
                  ? 'Continue Locally'
                  : 'Yerel Olarak Devam Et'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CLOUD SYNC */}
        {activeTab === 'cloud' && (
          <div className="mt-5 space-y-4">
            {cloudUser ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] p-4 text-xs dark:border-[#4ADE80]/30 dark:bg-[#0D2315]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#166534] dark:text-[#86EFAC]">
                      <Cloud className="h-4 w-4" />
                      <span>{syncStatusLabel}</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#166534]/80 dark:text-[#86EFAC]/80">
                      {lastCloudSyncAt
                        ? new Date(lastCloudSyncAt).toLocaleTimeString(bcp47, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-[#0D0D0D] dark:text-[#FFFFFF] break-all">
                    {cloudUser.email}
                  </p>
                  <p className="mt-1 text-[#166534]/90 dark:text-[#86EFAC]/90">
                    {isEn
                      ? 'Profile, A1 & A2 XP, modules, and classes sync across devices automatically.'
                      : 'Profiliniz, A1 & A2 XP puanlarınız, modülleriniz ve sınıflarınız cihazlar arasında otomatik eşitlenir.'}
                  </p>
                </div>

                {cloudError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-[#7A1C24]/40 bg-[#FDF2F4] p-3 text-xs text-[#7A1C24] dark:border-[#EF4444]/40 dark:bg-[#3B1014] dark:text-[#FCA5A5]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cloudError}</span>
                  </div>
                )}

                {cloudSuccess && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] p-3 text-xs font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cloudSuccess}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    disabled={cloudBusy}
                    onClick={handleManualSync}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7A1C24] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#62151C] disabled:opacity-50 dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254]"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${cloudBusy ? 'animate-spin' : ''}`} />
                    <span>{isEn ? 'Sync Now' : 'Şimdi Eşitle'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={cloudBusy}
                    onClick={handleSignOut}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] px-3.5 text-xs font-medium text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#0D0D0D] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{isEn ? 'Sign Out' : 'Oturumu Kapat'}</span>
                  </button>
                </div>
              </div>
            ) : !cloudConfigured ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#D4AF37]/45 bg-[#FEF9EB] p-4 text-xs leading-relaxed text-[#52525B] dark:border-[#D4AF37]/35 dark:bg-[#231D10] dark:text-[#E5D5A8]">
                  <div className="flex items-start gap-2.5">
                    <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6B16] dark:text-[#D4AF37]" />
                    <div className="space-y-1.5">
                      <p className="font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                        {isEn
                          ? 'Cloud Sync Ready (Environment Not Configured Yet)'
                          : 'Bulut Senkronizasyonu Hazır (Ortam Değişkenleri Tanımlı Değil)'}
                      </p>
                      <p>
                        {isEn
                          ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or Netlify Environment Variables to activate cross-device sync. Meanwhile, localStorage works seamlessly.'
                          : 'Cihazlar arası eşitlemeyi etkinleştirmek için .env veya Netlify ortam ayarlarına VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini ekleyin. Bu sırada yerel mod kesintisiz çalışır.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('local')}
                    className="rounded-lg bg-[#7A1C24] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#62151C] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254]"
                  >
                    {isEn ? 'Continue Locally' : 'Yerel Olarak Devam Et'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCloudAuthSubmit} className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                    {cloudMode === 'signin'
                      ? isEn
                        ? 'Sign in with Email'
                        : 'E-posta ile Giriş Yap'
                      : isEn
                      ? 'Create Cloud Account'
                      : 'Bulut Hesabı Oluştur'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCloudMode((m) => (m === 'signin' ? 'signup' : 'signin'));
                      setCloudError(null);
                      setCloudSuccess(null);
                    }}
                    className="font-semibold text-[#7A1C24] hover:underline dark:text-[#D4AF37]"
                  >
                    {cloudMode === 'signin'
                      ? isEn
                        ? 'Need an account? Sign up'
                        : 'Hesabın yok mu? Kayıt ol'
                      : isEn
                      ? 'Have an account? Sign in'
                      : 'Hesabın var mı? Giriş yap'}
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="tk-cloud-email"
                    className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
                  >
                    {isEn ? 'Email Address' : 'E-posta Adresi'}
                  </label>
                  <input
                    id="tk-cloud-email"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={tx({
                      tr: 'ornek@teacherskingdom.net',
                      en: 'name@teacherskingdom.net',
                    })}
                    className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0D0D0D] focus:border-[#7A1C24] focus:outline-none dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tk-cloud-password"
                    className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
                  >
                    {isEn ? 'Password' : 'Parola'}
                  </label>
                  <input
                    id="tk-cloud-password"
                    type="password"
                    required
                    minLength={6}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••"
                    className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0D0D0D] focus:border-[#7A1C24] focus:outline-none dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:focus:border-[#D4AF37]"
                  />
                </div>

                {cloudMode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="tk-cloud-name"
                        className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]"
                      >
                        {isEn ? 'Display Name' : 'Görünen Ad'}
                      </label>
                      <input
                        id="tk-cloud-name"
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        maxLength={48}
                        placeholder={isEn ? 'Your name' : 'Adınız'}
                        className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#7A1C24] focus:outline-none dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] dark:focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                        {isEn ? 'Role' : 'Rol'}
                      </span>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('student')}
                          className={`h-[38px] rounded-lg border text-xs font-medium ${
                            selectedRole === 'student'
                              ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                              : 'border-[#D9D9D3] text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]'
                          }`}
                        >
                          {locale.roles.student}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRole('teacher')}
                          className={`h-[38px] rounded-lg border text-xs font-medium ${
                            selectedRole === 'teacher'
                              ? 'border-[#7A1C24] bg-[#7A1C24] text-white'
                              : 'border-[#D9D9D3] text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]'
                          }`}
                        >
                          {locale.roles.teacher}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {cloudError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-[#7A1C24]/40 bg-[#FDF2F4] p-3 text-xs text-[#7A1C24] dark:border-[#EF4444]/40 dark:bg-[#3B1014] dark:text-[#FCA5A5]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cloudError}</span>
                  </div>
                )}

                {cloudSuccess && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg border border-[#15803D]/35 bg-[#F0FDF4] p-3 text-xs font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{cloudSuccess}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('local')}
                    className="text-xs font-medium text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]"
                  >
                    {isEn ? 'Continue Locally' : 'Yerel Olarak Devam Et'}
                  </button>
                  <button
                    type="submit"
                    disabled={cloudBusy}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7A1C24] px-4 text-sm font-medium text-white transition-colors hover:bg-[#62151C] disabled:opacity-50 dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254]"
                  >
                    {cloudBusy && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    <span>
                      {cloudMode === 'signin'
                        ? isEn
                          ? 'Sign In & Sync'
                          : 'Giriş Yap ve Eşitle'
                        : isEn
                        ? 'Create Account'
                        : 'Kayıt Ol ve Eşitle'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
