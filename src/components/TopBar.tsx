import React from 'react';
import {
  AlertCircle,
  Cloud,
  CloudOff,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Sun,
  User,
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import { useI18n } from '../hooks/useI18n';
import { formatSyncStatusLabel } from '../services/cloudSyncService';
import { BrandMark } from './BrandMark';

interface TopBarProps {
  sidebarCollapsed: boolean;
  mobileMenuOpen?: boolean;
  onToggleSidebarCollapse: () => void;
  onOpenMobileMenu: () => void;
  onNavigateHome: () => void;
  onOpenAuthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  sidebarCollapsed,
  mobileMenuOpen = false,
  onToggleSidebarCollapse,
  onOpenMobileMenu,
  onNavigateHome,
  onOpenAuthModal,
}) => {
  const {
    theme,
    toggleTheme,
    rolePreview,
    setRolePreview,
    activeCourse,
    setActiveCourse,
    uiLanguage,
    toggleUiLanguage,
    displayName,
    cloudUser,
    cloudSyncStatus,
  } = useAppState();
  const { locale, tx } = useI18n();
  const syncLabel = formatSyncStatusLabel(cloudSyncStatus, uiLanguage);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#D9D9D3] bg-[#FFFFFF]/95 backdrop-blur-sm dark:border-[#282830] dark:bg-[#0D0D0D]/95">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-2 lg:gap-3 px-2.5 sm:px-4 lg:px-6">
        {/* Left Zone: Sidebar toggles + Desktop wordmark + CEFR Level Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 min-w-0 justify-self-start">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label={locale.topBar.openMenu}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] lg:hidden dark:border-[#282830] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24] shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label={locale.topBar.toggleSidebar}
            aria-expanded={!sidebarCollapsed}
            title={
              sidebarCollapsed ? locale.topBar.expandMenuTitle : locale.topBar.collapseMenuTitle
            }
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[#52525B] transition-colors hover:border-[#D9D9D3] hover:bg-[#ECECE8] hover:text-[#0D0D0D] lg:inline-flex dark:text-[#A1A1AA] dark:hover:border-[#282830] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF] shrink-0"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4.5 w-4.5" />
            ) : (
              <PanelLeftClose className="h-4.5 w-4.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            aria-label={`${locale.brand.name} ${locale.home.navHome}`}
            className="hidden lg:inline-flex items-center text-left transition-opacity hover:opacity-85 whitespace-nowrap min-w-0"
          >
            <span className="font-display text-base xl:text-lg font-semibold tracking-tight text-[#0D0D0D] dark:text-[#FFFFFF] truncate">
              {locale.brand.name}
            </span>
          </button>

          {/* Accessible CEFR Level Switcher: A1 / A2 */}
          <div className="hidden sm:flex items-center lg:pl-3 lg:ml-0.5 lg:border-l lg:border-[#D9D9D3] lg:dark:border-[#282830] shrink-0">
            <div
              role="group"
              aria-label={locale.course.levelSwitcherAria}
              className="flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <button
                type="button"
                aria-pressed={activeCourse === 'de-A1'}
                onClick={() => setActiveCourse('de-A1')}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeCourse === 'de-A1'
                    ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {locale.course.a1Label}
              </button>
              <button
                type="button"
                aria-pressed={activeCourse === 'de-A2'}
                onClick={() => setActiveCourse('de-A2')}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeCourse === 'de-A2'
                    ? 'bg-[#7A1C24] text-white dark:bg-[#7A1C24] dark:text-white'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                {locale.course.a2Label}
              </button>
            </div>
          </div>
        </div>

        {/* Center Zone: Geometric Emblem */}
        <div className="flex items-center justify-center justify-self-center">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label={`${locale.brand.name} ${locale.home.navHome}`}
            title={locale.brand.name}
            className="inline-flex h-11 items-center justify-center rounded-xl px-1 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1C24] dark:focus-visible:outline-[#D4AF37]"
          >
            <BrandMark
              variant="crest"
              decorative={false}
              className="h-9 w-12 sm:h-10 sm:w-14 shrink-0"
            />
          </button>
        </div>

        {/* Right Zone: Role Preview + TR/EN Toggle + Theme Toggle + Auth Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 justify-self-end">
          {/* Role Preview Segmented Control */}
          <div
            role="group"
            aria-label={locale.roles.previewLabel}
            className="hidden md:flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
          >
            <button
              type="button"
              aria-pressed={rolePreview === 'student'}
              onClick={() => setRolePreview('student')}
              className={`px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                rolePreview === 'student'
                  ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                  : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
              }`}
            >
              {locale.roles.student}
            </button>
            <button
              type="button"
              aria-pressed={rolePreview === 'teacher'}
              onClick={() => setRolePreview('teacher')}
              className={`px-2.5 lg:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                rolePreview === 'teacher'
                  ? 'bg-[#7A1C24] text-white dark:bg-[#7A1C24] dark:text-white'
                  : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
              }`}
            >
              {locale.roles.teacher}
            </button>
          </div>

          {/* Cloud Sync Status Pill */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            title={
              cloudUser
                ? `${cloudUser.email} · ${syncLabel}`
                : `${syncLabel} — ${locale.topBar.authAction}`
            }
            aria-label={tx(
              { tr: 'Senkronizasyon durumu: {{status}}', en: 'Sync status: {{status}}' },
              { status: syncLabel }
            )}
            className={`hidden xl:inline-flex h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              cloudSyncStatus === 'synced'
                ? 'border-[#15803D]/35 bg-[#F0FDF4] text-[#166534] dark:border-[#4ADE80]/35 dark:bg-[#0D2315] dark:text-[#86EFAC]'
                : cloudSyncStatus === 'syncing'
                ? 'border-[#D4AF37]/50 bg-[#FEF9EB] text-[#9A6B16] dark:border-[#D4AF37]/45 dark:bg-[#231D10] dark:text-[#D4AF37]'
                : cloudSyncStatus === 'error'
                ? 'border-[#7A1C24]/50 bg-[#FDF2F4] text-[#7A1C24] dark:border-[#EF4444]/40 dark:bg-[#3B1014] dark:text-[#FCA5A5]'
                : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#52525B] hover:border-[#7A1C24] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:border-[#D4AF37]'
            }`}
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : cloudSyncStatus === 'synced' ? (
              <Cloud className="h-3.5 w-3.5 shrink-0" />
            ) : cloudSyncStatus === 'error' ? (
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <CloudOff className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{syncLabel}</span>
          </button>

          {/* TR / EN Language Switcher */}
          <button
            type="button"
            onClick={toggleUiLanguage}
            aria-label={locale.topBar.switchLangLabel}
            title={locale.topBar.switchLangLabel}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-2.5 font-mono text-xs font-semibold text-[#52525B] transition-colors hover:border-[#7A1C24] hover:text-[#0D0D0D] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:border-[#D4AF37] dark:hover:text-[#FFFFFF] shrink-0"
          >
            <span className={uiLanguage === 'tr' ? 'text-[#7A1C24] dark:text-[#D4AF37]' : ''}>
              TR
            </span>
            <span aria-hidden="true" className="opacity-40">/</span>
            <span className={uiLanguage === 'en' ? 'text-[#7A1C24] dark:text-[#D4AF37]' : ''}>
              EN
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? locale.topBar.themeToLight : locale.topBar.themeToDark}
            title={theme === 'dark' ? locale.topBar.themeToLight : locale.topBar.themeToDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] text-[#0D0D0D] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#FFFFFF] dark:hover:bg-[#1E1E24] shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-[#D4AF37]" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Primary Auth Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex h-10 items-center gap-1.5 sm:gap-2 rounded-lg bg-[#7A1C24] px-2.5 sm:px-3.5 lg:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#62151C] dark:bg-[#D4AF37] dark:text-[#0D0D0D] dark:hover:bg-[#E3C254] whitespace-nowrap shrink-0"
          >
            <User className="h-4 w-4 shrink-0" />
            <span className="sm:hidden max-w-[56px] truncate">
              {displayName ? displayName : locale.topBar.authShort}
            </span>
            <span className="hidden sm:inline max-w-[108px] lg:max-w-[140px] truncate">
              {displayName ? displayName : locale.topBar.authAction}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
