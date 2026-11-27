import React from 'react';
import { ClipboardList, GraduationCap, Users } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import type { NavRouteId } from '../../types';

interface TeachingSubNavProps {
  activeRoute: NavRouteId;
  onNavigate: (route: NavRouteId) => void;
}

export const TeachingSubNav: React.FC<TeachingSubNavProps> = ({ activeRoute, onNavigate }) => {
  const { progress } = useAppState();
  const { tx } = useI18n();

  const completedAssignments = progress.teachingAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'reviewed'
  ).length;

  const items: Array<{
    routeId: NavRouteId;
    label: string;
    countLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      routeId: 'siniflarim',
      label: tx({ tr: 'Sınıflarım', en: 'My Classes' }),
      countLabel: `${progress.teachingClasses.length}`,
      icon: Users,
    },
    {
      routeId: 'odevler',
      label: tx({ tr: 'Ödevler', en: 'Assignments' }),
      countLabel: `${completedAssignments}/${progress.teachingAssignments.length}`,
      icon: ClipboardList,
    },
    {
      routeId: 'ogretmen-studyosu',
      label: tx({ tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' }),
      countLabel: `${progress.studioDrafts.length}`,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-2 dark:border-[#24242C] dark:bg-[#16161A]">
      <nav
        aria-label={tx({
          tr: 'Öğretim ve yönetim modülleri',
          en: 'Teaching and management modules',
        })}
        className="flex flex-wrap items-center gap-1.5"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeRoute === item.routeId;

          return (
            <button
              key={item.routeId}
              type="button"
              onClick={() => onNavigate(item.routeId)}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'text-[#52525B] hover:bg-[#F6F6F4] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#F4F4F5]'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  isActive ? 'opacity-90' : 'text-[#71717A] dark:text-[#8E8E98]'
                }`}
              >
                {item.countLabel}
              </span>
            </button>
          );
        })}
      </nav>

      <p className="px-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
        {tx({
          tr: 'A1 & A2 Yerel Tarayıcı Kaydı · Harici Bulut Senkronizasyonu Sonraki Fazda',
          en: 'A1 & A2 Local Browser Storage · Cloud Sync Planned for Next Phase',
        })}
      </p>
    </div>
  );
};
