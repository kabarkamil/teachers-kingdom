import React, { useEffect, useState } from 'react';
import { HardDrive, Info, X } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { tr } from '../i18n/tr';
import type { UserRole } from '../types';
import { BrandMark } from './BrandMark';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onOpenPortability?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onOpenPortability }) => {
  const { rolePreview, setRolePreview, displayName, setDisplayName } = useAppState();
  const [nameInput, setNameInput] = useState(displayName);
  const [selectedRole, setSelectedRole] = useState<UserRole>(rolePreview);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const dialogRef = useDialogFocus(open, onClose);

  useEffect(() => {
    if (open) {
      setNameInput(displayName);
      setSelectedRole(rolePreview);
      setSavedFeedback(false);
    }
  }, [open, displayName, rolePreview]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayName(nameInput);
    setRolePreview(selectedRole);
    setSavedFeedback(true);
    window.setTimeout(() => {
      onClose();
    }, 550);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#0B0B0D]/65 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 shadow-xl dark:border-[#282830] dark:bg-[#16161A] focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 shrink-0" />
            <div>
              <h2
                id="auth-modal-title"
                className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                {tr.topBar.authAction}
              </h2>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tr.brand.domain} · Yerel Tarayıcı Oturumu Aktif
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Pencereyi kapat"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#F4F4F5]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Honest Local-Storage Scope Notice */}
        <div className="mt-5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 text-xs leading-relaxed text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]">
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6B16] dark:text-[#D9A13B]" />
            <p>
              <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Yerel Depolama ve Bulut Durumu:
              </strong>{' '}
              İlerlemeniz, XP puanınız, yerel sınıflarınız ve rol önizlemeniz yalnızca bu tarayıcıda (localStorage) saklanır. Harici sunucu hesabı ve bulut eşitlemesi bağlı değildir; verilerinizi JSON dosyası olarak dışa/içe aktarabilirsiniz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="tk-local-name"
              className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
            >
              Görünen Adınız (Yerel Profil)
            </label>
            <input
              id="tk-local-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Örn. Zeynep Kaya"
              maxLength={48}
              className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] placeholder:text-[#71717A] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Platform Görünüm Rolü
            </span>
            <div role="group" aria-label="Platform Görünüm Rolü" className="mt-1.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={selectedRole === 'student'}
                onClick={() => setSelectedRole('student')}
                className={`rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  selectedRole === 'student'
                    ? 'border-[#111113] bg-[#111113] text-[#F6F6F4] dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                }`}
              >
                {tr.roles.student}
              </button>
              <button
                type="button"
                aria-pressed={selectedRole === 'teacher'}
                onClick={() => setSelectedRole('teacher')}
                className={`rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  selectedRole === 'teacher'
                    ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#B8324B] dark:bg-[#B8324B] dark:text-white'
                    : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:border-[#7C1D2E]/40 dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]'
                }`}
              >
                {tr.roles.teacher}
              </button>
            </div>
          </div>

          {onOpenPortability && (
            <div className="border-t border-[#ECECE8] pt-3 dark:border-[#24242C]">
              <button
                type="button"
                onClick={onOpenPortability}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 py-2 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <HardDrive className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                <span>Yedekleme ve Veri Taşıma (JSON · Ayarlar)</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D9D9D3] px-4 py-2 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#ECECE8] hover:text-[#111113] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#F4F4F5]"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#7C1D2E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              {savedFeedback ? 'Kaydedildi' : 'Yerel Olarak Devam Et'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
