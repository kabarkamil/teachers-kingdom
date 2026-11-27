import React from 'react';
import {
  BookOpen,
  BookText,
  ClipboardCheck,
  ClipboardList,
  Compass,
  Drama,
  FileSpreadsheet,
  GraduationCap,
  Headphones,
  Home,
  LayoutGrid,
  MessageSquare,
  Mic2,
  PenTool,
  Settings,
  Swords,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { NAVIGATION_GROUPS } from '../data/navigation';
import { useAppState } from '../context/AppStateContext';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { getLocale } from '../i18n/tr';
import type { NavRouteId } from '../types';
import { BrandMark } from './BrandMark';

interface SidebarProps {
  activeRoute: NavRouteId;
  onSelectRoute: (route: NavRouteId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ROUTE_ICONS: Record<NavRouteId, React.ComponentType<{ className?: string }>> = {
  home: Home,
  kelime: BookOpen,
  dinleme: Headphones,
  okuma: BookText,
  yazma: PenTool,
  konusma: MessageSquare,
  karaoke: Mic2,
  'sessiz-sinema': Drama,
  arena: Swords,
  'quiz-merkezi': ClipboardCheck,
  'sinav-modu': FileSpreadsheet,
  siniflarim: Users,
  odevler: ClipboardList,
  'ogretmen-studyosu': GraduationCap,
  'ogrenme-yolum': Compass,
  profil: UserCircle,
  ayarlar: Settings,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onSelectRoute,
  collapsed,
  mobileOpen,
  onCloseMobile,
}) => {
  const {
    rolePreview,
    setRolePreview,
    activeCourse,
    setActiveCourse,
    uiLanguage,
  } = useAppState();
  const locale = getLocale(uiLanguage);
  const mobileDrawerRef = useDialogFocus(mobileOpen, onCloseMobile);
  const isA2 = activeCourse === 'de-A2';

  const handleSelect = (route: NavRouteId) => {
    onSelectRoute(route);
    onCloseMobile();
  };

  const renderNavContent = (isCompact: boolean) => (
    <div className="flex h-full flex-col">
      {/* Mobile Drawer Header */}
      <div className="flex items-center justify-between border-b border-[#D9D9D3] px-4 py-3.5 lg:hidden dark:border-[#282830]">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-7 w-7" />
          <div>
            <p className="font-display text-base font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {locale.brand.name}
            </p>
            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {locale.course.language} ·{' '}
              <span className="font-mono font-medium">{isA2 ? 'A2' : 'A1'}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#52525B] hover:bg-[#ECECE8] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile CEFR Level Switcher */}
      <div className="border-b border-[#D9D9D3] px-4 py-3 sm:hidden dark:border-[#282830]">
        <p className="mb-1.5 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          {uiLanguage === 'en' ? 'Active German Level' : 'Aktif Almanca Seviyesi'}
        </p>
        <div
          role="group"
          aria-label="CEFR Level"
          className="grid grid-cols-2 gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
        >
          <button
            type="button"
            aria-pressed={activeCourse === 'de-A1'}
            onClick={() => setActiveCourse('de-A1')}
            className={`py-2.5 text-xs font-semibold rounded-md transition-colors ${
              activeCourse === 'de-A1'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] dark:text-[#A1A1AA]'
            }`}
          >
            {locale.course.a1Label}
          </button>
          <button
            type="button"
            aria-pressed={activeCourse === 'de-A2'}
            onClick={() => setActiveCourse('de-A2')}
            className={`py-2.5 text-xs font-semibold rounded-md transition-colors ${
              activeCourse === 'de-A2'
                ? 'bg-[#7A1C24] text-white dark:bg-[#7A1C24] dark:text-white'
                : 'text-[#52525B] dark:text-[#A1A1AA]'
            }`}
          >
            {locale.course.a2Label}
          </button>
        </div>
      </div>

      {/* Mobile Role Preview Switcher */}
      <div className="border-b border-[#D9D9D3] px-4 py-3 md:hidden dark:border-[#282830]">
        <p className="mb-1.5 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
          {locale.roles.previewLabel}
        </p>
        <div
          role="group"
          aria-label={locale.roles.previewLabel}
          className="grid grid-cols-2 gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
        >
          <button
            type="button"
            aria-pressed={rolePreview === 'student'}
            onClick={() => setRolePreview('student')}
            className={`py-2.5 text-xs font-medium rounded-md transition-colors ${
              rolePreview === 'student'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] dark:text-[#A1A1AA]'
            }`}
          >
            {locale.roles.student}
          </button>
          <button
            type="button"
            aria-pressed={rolePreview === 'teacher'}
            onClick={() => setRolePreview('teacher')}
            className={`py-2.5 text-xs font-medium rounded-md transition-colors ${
              rolePreview === 'teacher'
                ? 'bg-[#7A1C24] text-white dark:bg-[#7A1C24] dark:text-white'
                : 'text-[#52525B] dark:text-[#A1A1AA]'
            }`}
          >
            {locale.roles.teacher}
          </button>
        </div>
      </div>

      {/* Scrollable Navigation Tree */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Home */}
        <div>
          <button
            type="button"
            onClick={() => handleSelect('home')}
            title={isCompact ? locale.home.navHome : undefined}
            aria-label={isCompact ? locale.home.navHome : undefined}
            aria-current={activeRoute === 'home' ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activeRoute === 'home'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#0D0D0D] hover:bg-[#ECECE8] dark:text-[#E4E4E7] dark:hover:bg-[#1E1E24]'
            } ${isCompact ? 'justify-center px-2' : ''}`}
          >
            <Home className="h-4.5 w-4.5 shrink-0" />
            {!isCompact && <span className="truncate">{locale.home.navHome}</span>}
          </button>
        </div>

        {/* 4 Structured Groups */}
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.id} className="space-y-1">
            {!isCompact ? (
              <p className="px-3 pb-1 text-xs font-semibold text-[#52525B] dark:text-[#A1A1AA]">
                {uiLanguage === 'en' ? group.titleEn : group.titleTr}
              </p>
            ) : (
              <div className="mx-2 my-2 border-t border-[#D9D9D3] dark:border-[#282830]" />
            )}

            {group.items.map((item) => {
              const Icon = ROUTE_ICONS[item.id] ?? LayoutGrid;
              const isActive = activeRoute === item.id;
              const label = uiLanguage === 'en' ? item.labelEn : item.labelTr;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  title={isCompact ? label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-[#7A1C24] font-medium text-white dark:bg-[#23232B] dark:text-[#D4AF37] dark:ring-1 dark:ring-[#D4AF37]/40'
                      : 'text-[#0D0D0D] hover:bg-[#ECECE8] dark:text-[#E4E4E7] dark:hover:bg-[#1E1E24]'
                  } ${isCompact ? 'justify-center px-2' : ''}`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-white dark:text-[#D4AF37]'
                          : 'text-[#7A1C24] dark:text-[#D4AF37]'
                      }`}
                    />
                    {!isCompact && <span className="truncate">{label}</span>}
                  </span>

                  {!isCompact && (item.group === 'learning' || item.group === 'activities') && (
                    <span
                      className={`font-mono text-[11px] font-semibold shrink-0 ${
                        isActive
                          ? 'text-[#F6D693] dark:text-[#D4AF37]'
                          : 'text-[#9A6B16] dark:text-[#D4AF37]'
                      }`}
                    >
                      {isA2 ? 'A2' : 'A1'}
                    </span>
                  )}

                  {!isCompact && item.group === 'teaching' && (
                    <span
                      className={`font-mono text-[11px] font-medium shrink-0 ${
                        isActive
                          ? 'text-[#F6D693] dark:text-[#D4AF37]'
                          : 'text-[#71717A] dark:text-[#8E8E98]'
                      }`}
                    >
                      A1·A2
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Streamlined Active Level & Quick-Switch Footer */}
      <div
        className={`border-t border-[#D9D9D3] dark:border-[#282830] ${
          isCompact ? 'p-2' : 'px-3.5 py-3'
        }`}
      >
        {isCompact ? (
          <button
            type="button"
            onClick={() => setActiveCourse(isA2 ? 'de-A1' : 'de-A2')}
            title={isA2 ? locale.home.switchToA1 : locale.home.switchToA2}
            aria-label={isA2 ? locale.home.switchToA1 : locale.home.switchToA2}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] font-mono text-xs font-semibold text-[#7A1C24] transition-colors hover:border-[#7A1C24] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#D4AF37] dark:hover:border-[#D4AF37]"
          >
            {isA2 ? 'A2' : 'A1'}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
              {isA2 ? locale.course.a2Label : locale.course.a1Label}
            </span>
            <div
              role="group"
              aria-label="Quick level switch"
              className="inline-flex shrink-0 items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <button
                type="button"
                onClick={() => setActiveCourse('de-A1')}
                aria-pressed={!isA2}
                className={`min-h-[32px] rounded-md px-2.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap ${
                  !isA2
                    ? 'bg-[#7A1C24] text-white dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                A1
              </button>
              <button
                type="button"
                onClick={() => setActiveCourse('de-A2')}
                aria-pressed={isA2}
                className={`min-h-[32px] rounded-md px-2.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap ${
                  isA2
                    ? 'bg-[#7A1C24] text-white dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
                }`}
              >
                A2
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 border-r border-[#D9D9D3] bg-[#FFFFFF] transition-[width] duration-200 dark:border-[#282830] dark:bg-[#0D0D0D] ${
          collapsed ? 'w-[72px]' : 'w-[272px]'
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{renderNavContent(collapsed)}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-[#0D0D0D]/60 backdrop-blur-[2px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            ref={mobileDrawerRef}
            tabIndex={-1}
            className="fixed inset-y-0 left-0 z-50 w-[290px] max-w-[85vw] border-r border-[#D9D9D3] bg-[#FFFFFF] shadow-xl dark:border-[#282830] dark:bg-[#0D0D0D] focus:outline-none"
          >
            {renderNavContent(false)}
          </div>
        </div>
      )}
    </>
  );
};
