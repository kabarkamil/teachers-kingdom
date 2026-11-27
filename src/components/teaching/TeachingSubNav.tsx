import React from 'react';
import { ClipboardList, GraduationCap, Users } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { NavRouteId } from '../../types';

interface TeachingSubNavProps {
  activeRoute: NavRouteId;
  onNavigate: (route: NavRouteId) => void;
}

export const TeachingSubNav: React.FC<TeachingSubNavProps> = ({ activeRoute, onNavigate }) => {
  const { progress } = useAppState();

  const completedAssignments = progress.teachingAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'reviewed'
  ).length;

  const items: Array<{
    routeId: NavRouteId;
    labelTr: string;
    countLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      routeId: 'siniflarim',
      labelTr: 'Sınıflarım',
      countLabel: `${progress.teachingClasses.length}`,
      icon: Users,
    },
    {
      routeId: 'odevler',
      labelTr: 'Ödevler',
      countLabel: `${completedAssignments}/${progress.teachingAssignments.length}`,
      icon: ClipboardList,
    },
    {
      routeId: 'ogretmen-studyosu',
      labelTr: 'Öğretmen Stüdyosu',
      countLabel: `${progress.studioDrafts.length}`,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#ECECE8] bg-[#FFFFFF] p-2 dark:border-[#24242C] dark:bg-[#16161A]">
      <nav aria-label="Öğretim ve yönetim modülleri" className="flex flex-wrap items-center gap-1.5">
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
              <span>{item.labelTr}</span>
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
        A1 &amp; A2 Yerel Tarayıcı Kaydı · Harici Bulut Senkronizasyonu Sonraki Fazda
      </p>
    </div>
  );
};
