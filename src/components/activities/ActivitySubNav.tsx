import React from 'react';
import { ClipboardCheck, Drama, FileSpreadsheet, Mic2, Swords } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  ARENA_IDS,
  CHARADE_IDS,
  EXAM_IDS,
  KARAOKE_IDS,
  QUIZ_IDS,
} from '../../data/germanA1Activities';
import type { NavRouteId } from '../../types';

interface ActivitySubNavProps {
  activeRoute: NavRouteId;
  onNavigate: (route: NavRouteId) => void;
}

const SUB_ITEMS: Array<{
  routeId: NavRouteId;
  labelTr: string;
  ids: string[];
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { routeId: 'karaoke', labelTr: 'Karaoke Stüdyosu', ids: KARAOKE_IDS, icon: Mic2 },
  { routeId: 'sessiz-sinema', labelTr: 'Sessiz Sinema', ids: CHARADE_IDS, icon: Drama },
  { routeId: 'arena', labelTr: 'Arena', ids: ARENA_IDS, icon: Swords },
  { routeId: 'quiz-merkezi', labelTr: 'Quiz Merkezi', ids: QUIZ_IDS, icon: ClipboardCheck },
  { routeId: 'sinav-modu', labelTr: 'Sınav Modu', ids: EXAM_IDS, icon: FileSpreadsheet },
];

export const ActivitySubNav: React.FC<ActivitySubNavProps> = ({ activeRoute, onNavigate }) => {
  const { progress } = useAppState();
  const masteredSet = new Set(progress.activityMasteredIds);

  return (
    <nav
      aria-label="Etkinlik alt modülleri"
      className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-1.5 dark:border-[#24242C] dark:bg-[#16161A]"
    >
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
                ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:bg-[#F6F6F4] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{item.labelTr}</span>
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
    </nav>
  );
};
