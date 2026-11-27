import React from 'react';
import {
  BookOpen,
  BookText,
  ClipboardCheck,
  Compass,
  Drama,
  FileSpreadsheet,
  Headphones,
  Home,
  MessageSquare,
  Mic2,
  PenTool,
  Swords,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  ARENA_IDS,
  CHARADE_IDS,
  EXAM_IDS,
  KARAOKE_IDS,
  QUIZ_IDS,
} from '../../data/germanA1Activities';
import { getLocale } from '../../i18n/tr';
import type { NavRouteId } from '../../types';

interface ActivitySubNavProps {
  activeRoute: NavRouteId;
  onNavigate: (route: NavRouteId) => void;
}

const SUB_ITEMS: Array<{
  routeId: NavRouteId;
  labelTr: string;
  labelEn: string;
  ids: string[];
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { routeId: 'karaoke', labelTr: 'Karaoke Stüdyosu', labelEn: 'Karaoke Studio', ids: KARAOKE_IDS, icon: Mic2 },
  { routeId: 'sessiz-sinema', labelTr: 'Sessiz Sinema', labelEn: 'Charades', ids: CHARADE_IDS, icon: Drama },
  { routeId: 'arena', labelTr: 'Arena', labelEn: 'Arena', ids: ARENA_IDS, icon: Swords },
  { routeId: 'quiz-merkezi', labelTr: 'Quiz Merkezi', labelEn: 'Quiz Center', ids: QUIZ_IDS, icon: ClipboardCheck },
  { routeId: 'sinav-modu', labelTr: 'Sınav Modu', labelEn: 'Exam Mode', ids: EXAM_IDS, icon: FileSpreadsheet },
];

const CORE_SKILL_LINKS: Array<{
  routeId: NavRouteId;
  labelTr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { routeId: 'kelime', labelTr: 'Kelime', labelEn: 'Vocab', icon: BookOpen },
  { routeId: 'dinleme', labelTr: 'Dinleme', labelEn: 'Listening', icon: Headphones },
  { routeId: 'okuma', labelTr: 'Okuma', labelEn: 'Reading', icon: BookText },
  { routeId: 'yazma', labelTr: 'Yazma', labelEn: 'Writing', icon: PenTool },
  { routeId: 'konusma', labelTr: 'Konuşma', labelEn: 'Speaking', icon: MessageSquare },
];

export const ActivitySubNav: React.FC<ActivitySubNavProps> = ({ activeRoute, onNavigate }) => {
  const { progress, activeCourse, setActiveCourse, uiLanguage } = useAppState();
  const locale = getLocale(uiLanguage);
  const isEn = uiLanguage === 'en';
  const masteredSet = new Set(progress.activityMasteredIds);

  return (
    <div className="space-y-2.5">
      <nav
        aria-label={isEn ? 'A1 activity submodules' : 'A1 etkinlik alt modülleri'}
        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-1.5 dark:border-[#24242C] dark:bg-[#16161A]"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {SUB_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.routeId;
            const doneCount = item.ids.filter((id) => masteredSet.has(id)).length;

            return (
              <button
                key={item.routeId}
                type="button"
                onClick={() => onNavigate(item.routeId)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                    : 'text-[#52525B] hover:bg-[#F6F6F4] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{isEn ? item.labelEn : item.labelTr}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'opacity-85' : 'text-[#71717A] dark:text-[#8E8E98]'
                  }`}
                >
                  {doneCount}/{item.ids.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick A1 / A2 Course Switcher */}
        <div
          role="group"
          aria-label={isEn ? 'Switch CEFR level' : 'CEFR seviyesi değiştir'}
          className="inline-flex items-center rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#0D0D0D] shrink-0"
        >
          <button
            type="button"
            aria-pressed={activeCourse === 'de-A1'}
            onClick={() => setActiveCourse('de-A1')}
            className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeCourse === 'de-A1'
                ? 'bg-[#0D0D0D] text-[#FFFFFF] dark:bg-[#D4AF37] dark:text-[#0D0D0D]'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            A1
          </button>
          <button
            type="button"
            aria-pressed={activeCourse === 'de-A2'}
            onClick={() => setActiveCourse('de-A2')}
            className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
              activeCourse === 'de-A2'
                ? 'bg-[#7A1C24] text-white'
                : 'text-[#52525B] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]'
            }`}
          >
            A2
          </button>
        </div>
      </nav>

      {/* Seamless Learning Flow Bridge: Home, Progress & 5 Core A1 Skills */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#ECECE8] bg-[#F6F6F4]/80 px-3 py-2 text-xs dark:border-[#24242C] dark:bg-[#111114]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-[#52525B] transition-colors hover:bg-[#FFFFFF] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]"
          >
            <Home className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
            <span>{locale.home.navHome}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('ogrenme-yolum')}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-[#52525B] transition-colors hover:bg-[#FFFFFF] hover:text-[#0D0D0D] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FFFFFF]"
          >
            <Compass className="h-3.5 w-3.5 text-[#7A1C24] dark:text-[#D4AF37]" />
            <span>{locale.home.progressCta}</span>
          </button>
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-[#D9D9D3] dark:bg-[#282830]" />
          <span className="hidden sm:inline font-mono text-[11px] font-semibold text-[#9A6B16] dark:text-[#D4AF37]">
            {isEn ? 'A1 Skills:' : 'A1 Becerileri:'}
          </span>
          {CORE_SKILL_LINKS.map((skill) => {
            const SkillIcon = skill.icon;
            return (
              <button
                key={skill.routeId}
                type="button"
                onClick={() => onNavigate(skill.routeId)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[#52525B] transition-colors hover:bg-[#FFFFFF] hover:text-[#7A1C24] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#D4AF37]"
              >
                <SkillIcon className="h-3 w-3 shrink-0" />
                <span>{isEn ? skill.labelEn : skill.labelTr}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden lg:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#7A1C24] dark:text-[#D4AF37]">
          <span>{locale.brand.philosophy}</span>
          <span aria-hidden="true">·</span>
          <span>{locale.brand.mottoEn}</span>
        </span>
      </div>
    </div>
  );
};
