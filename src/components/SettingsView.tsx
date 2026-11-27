import React, { useState } from 'react';
import { Globe, Moon, Sun, Volume2 } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useI18n } from '../hooks/useI18n';
import { isSpeechSynthesisSupported, speakGermanText } from '../utils/speech';
import { DataPortabilityPanel } from './DataPortabilityPanel';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    rolePreview,
    setRolePreview,
    speechSpeed,
    setSpeechSpeed,
    uiLanguage,
    setUiLanguage,
  } = useAppState();
  const { locale, tx } = useI18n();

  const [ttsStatusMsg, setTtsStatusMsg] = useState<string | null>(null);
  const speechSupported = isSpeechSynthesisSupported();

  const handleTestVoice = () => {
    setTtsStatusMsg(
      tx({ tr: 'Ses motoru başlatılıyor…', en: 'Starting speech engine…' })
    );
    const res = speakGermanText('Guten Tag! Willkommen bei Teachers Kingdom.', speechSpeed, {
      onStart: () =>
        setTtsStatusMsg(
          tx({
            tr: 'Almanca örnek seslendirme oynatılıyor…',
            en: 'Playing German sample audio…',
          })
        ),
      onEnd: () =>
        setTtsStatusMsg(
          tx({
            tr: 'Tarayıcı seslendirmesi başarıyla test edildi.',
            en: 'Browser speech synthesis tested successfully.',
          })
        ),
      onError: () =>
        setTtsStatusMsg(
          tx({
            tr: 'Seslendirme başlatılamadı. Tarayıcı ses ayarlarınızı kontrol edebilirsiniz.',
            en: 'Speech playback could not start. Please check your browser audio settings.',
          })
        ),
    });
    if (!res.queued) {
      setTtsStatusMsg(locale.common.ttsUnavailable);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-8">
      <div className="border-b border-[#D9D9D3] pb-6 dark:border-[#282830]">
        <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          {tx({
            tr: 'Kişisel Alan · Platform Tercihleri & Veri Taşınabilirliği',
            en: 'Personal · Platform Preferences & Data Portability',
          })}
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
          {tx({ tr: 'Ayarlar', en: 'Settings' })}
        </h1>
      </div>

      {/* Active Core Preferences */}
      <div className="divide-y divide-[#ECECE8] rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] dark:divide-[#24242C] dark:border-[#282830] dark:bg-[#16161A]">
        {/* Interface Language */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {tx({ tr: 'Arayüz Dili', en: 'Interface Language' })}
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Gezinme ve arayüz etiketlerini Türkçe veya İngilizce olarak kullanın.',
                en: 'Switch navigation and interface labels between Turkish and English.',
              })}
            </p>
          </div>
          <div
            role="group"
            aria-label={tx({ tr: 'Arayüz Dili', en: 'Interface Language' })}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              aria-pressed={uiLanguage === 'tr'}
              onClick={() => setUiLanguage('tr')}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                uiLanguage === 'tr'
                  ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Türkçe (TR)</span>
            </button>
            <button
              type="button"
              aria-pressed={uiLanguage === 'en'}
              onClick={() => setUiLanguage('en')}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                uiLanguage === 'en'
                  ? 'border-[#7A1C24] bg-[#7A1C24] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>English (EN)</span>
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {tx({ tr: 'Görünüm Teması', en: 'Appearance Theme' })}
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Açık (Platin) veya Koyu (Obsidyen) kurumsal tema arasında geçiş yapın.',
                en: 'Switch between Light (Platinum) and Dark (Obsidian) theme.',
              })}
            </p>
          </div>
          <div
            role="group"
            aria-label={tx({ tr: 'Görünüm Teması', en: 'Appearance Theme' })}
            className="flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                theme === 'light'
                  ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>{tx({ tr: 'Açık Tema', en: 'Light Theme' })}</span>
            </button>
            <button
              type="button"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>{tx({ tr: 'Koyu Tema', en: 'Dark Theme' })}</span>
            </button>
          </div>
        </div>

        {/* Role Preview */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {tx({ tr: 'Rol Önizleme Modu', en: 'Role View Mode' })}
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Ana sayfa ve modül vurgularını Öğrenci veya Öğretmen bakış açısıyla inceleyin.',
                en: 'Explore the homepage and modules from Student or Teacher perspective.',
              })}
            </p>
          </div>
          <div role="group" aria-label={locale.roles.previewLabel} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-pressed={rolePreview === 'student'}
              onClick={() => setRolePreview('student')}
              className={`h-10 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                rolePreview === 'student'
                  ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              {locale.roles.student}
            </button>
            <button
              type="button"
              aria-pressed={rolePreview === 'teacher'}
              onClick={() => setRolePreview('teacher')}
              className={`h-10 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                rolePreview === 'teacher'
                  ? 'border-[#7A1C24] bg-[#7A1C24] text-white dark:border-[#7A1C24] dark:bg-[#7A1C24]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              {locale.roles.teacher}
            </button>
          </div>
        </div>

        {/* Web Speech API Rate */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {tx({
                tr: 'Almanca Telaffuz Hızı (Web Speech API)',
                en: 'German Speech Speed (Web Speech API)',
              })}
            </h2>
            <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {locale.common.browserTtsNotice}
            </p>
            {ttsStatusMsg && (
              <p
                role="status"
                aria-live="polite"
                className="mt-2 text-xs font-medium text-[#7A1C24] dark:text-[#D4AF37]"
              >
                {ttsStatusMsg}
              </p>
            )}
          </div>
          <div
            role="group"
            aria-label={tx({ tr: 'Almanca Telaffuz Hızı', en: 'German Speech Speed' })}
            className="flex flex-wrap items-center gap-2 shrink-0"
          >
            <button
              type="button"
              aria-pressed={speechSpeed === 'normal'}
              onClick={() => setSpeechSpeed('normal')}
              className={`h-10 rounded-lg border px-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
                speechSpeed === 'normal'
                  ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              Normal (0.94×)
            </button>
            <button
              type="button"
              aria-pressed={speechSpeed === 'slow'}
              onClick={() => setSpeechSpeed('slow')}
              className={`h-10 rounded-lg border px-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
                speechSpeed === 'slow'
                  ? 'border-[#0D0D0D] bg-[#0D0D0D] text-white dark:border-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] dark:border-[#282830] dark:bg-[#0D0D0D] dark:text-[#A1A1AA]'
              }`}
            >
              {tx({ tr: 'Yavaş (0.72×)', en: 'Slow (0.72×)' })}
            </button>
            <button
              type="button"
              disabled={!speechSupported}
              onClick={handleTestVoice}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#FFFFFF] whitespace-nowrap"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>{tx({ tr: 'Test Et', en: 'Test' })}</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON Export/Import & Safe Reset */}
      <DataPortabilityPanel />
    </div>
  );
};
