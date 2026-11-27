import React from 'react';
import { ClipboardCheck, Drama, FileSpreadsheet, Mic2, Swords } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  A2_ARENA_IDS,
  A2_CHARADE_IDS,
  A2_EXAM_IDS,
  A2_KARAOKE_IDS,
  A2_QUIZ_IDS,
} from '../../data/germanA2Activities';
import type { NavRouteId } from '../../types';

interface ActivityA2SubNavProps {
  activeRoute: NavRouteId;
  onNavigate: (route: NavRouteId) => void;
}

const SUB_ITEMS: Array<{
  routeId: NavRouteId;
  labelTr: string;
  ids: string[];
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { routeId: 'karaoke', labelTr: 'Karaoke Stüdyosu', ids: A2_KARAOKE_IDS, icon: Mic2 },
  { routeId: 'sessiz-sinema', labelTr: 'Sessiz Sinema', ids: A2_CHARADE_IDS, icon: Drama },
  { routeId: 'arena', labelTr: 'Arena', ids: A2_ARENA_IDS, icon: Swords },
  { routeId: 'quiz-merkezi', labelTr: 'Quiz Merkezi', ids: A2_QUIZ_IDS, icon: ClipboardCheck },
  { routeId: 'sinav-modu', labelTr: 'Sınav Modu', ids: A2_EXAM_IDS, icon: FileSpreadsheet },
];

export const ActivityA2SubNav: React.FC<ActivityA2SubNavProps> = ({ activeRoute, onNavigate }) => {
  const { a2Progress } = useAppState();
  const masteredSet = new Set(a2Progress.activityMasteredIds);

  return (
    <nav
      aria-label="Almanca A2 etkinlik alt modülleri"
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
                ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:bg-[#F6F6F4] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#F4F4F5]'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{item.labelTr}</span>
            <span
              className={`font-mono text-[11px] tabular-nums ${
                isActive ? 'opacity-90' : 'text-[#71717A] dark:text-[#8E8E98]'
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
