/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { getLocale } from './i18n/tr';
import type { ActiveCourseId, NavRouteId, TeachingAssignmentModule } from './types';
import {
  COURSE_SCOPED_ROUTES,
  buildAppUrl,
  buildDocumentTitle,
  parseAppLocation,
} from './utils/routing';

const VocabModule = lazy(() =>
  import('./components/vocab/VocabModule').then((m) => ({ default: m.VocabModule }))
);
const VocabA2Module = lazy(() =>
  import('./components/vocabA2/VocabA2Module').then((m) => ({ default: m.VocabA2Module }))
);
const ListeningModule = lazy(() =>
  import('./components/listening/ListeningModule').then((m) => ({ default: m.ListeningModule }))
);
const ListeningA2Module = lazy(() =>
  import('./components/listeningA2/ListeningA2Module').then((m) => ({
    default: m.ListeningA2Module,
  }))
);
const ReadingModule = lazy(() =>
  import('./components/reading/ReadingModule').then((m) => ({ default: m.ReadingModule }))
);
const ReadingA2Module = lazy(() =>
  import('./components/readingA2/ReadingA2Module').then((m) => ({ default: m.ReadingA2Module }))
);
const WritingModule = lazy(() =>
  import('./components/writing/WritingModule').then((m) => ({ default: m.WritingModule }))
);
const WritingA2Module = lazy(() =>
  import('./components/writingA2/WritingA2Module').then((m) => ({ default: m.WritingA2Module }))
);
const SpeakingModule = lazy(() =>
  import('./components/speaking/SpeakingModule').then((m) => ({ default: m.SpeakingModule }))
);
const SpeakingA2Module = lazy(() =>
  import('./components/speakingA2/SpeakingA2Module').then((m) => ({
    default: m.SpeakingA2Module,
  }))
);
const KaraokeStudioView = lazy(() =>
  import('./components/activities/KaraokeStudioView').then((m) => ({
    default: m.KaraokeStudioView,
  }))
);
const KaraokeA2View = lazy(() =>
  import('./components/activitiesA2/KaraokeA2View').then((m) => ({ default: m.KaraokeA2View }))
);
const CharadesView = lazy(() =>
  import('./components/activities/CharadesView').then((m) => ({ default: m.CharadesView }))
);
const CharadesA2View = lazy(() =>
  import('./components/activitiesA2/CharadesA2View').then((m) => ({ default: m.CharadesA2View }))
);
const ArenaView = lazy(() =>
  import('./components/activities/ArenaView').then((m) => ({ default: m.ArenaView }))
);
const ArenaA2View = lazy(() =>
  import('./components/activitiesA2/ArenaA2View').then((m) => ({ default: m.ArenaA2View }))
);
const QuizCenterView = lazy(() =>
  import('./components/activities/QuizCenterView').then((m) => ({ default: m.QuizCenterView }))
);
const QuizCenterA2View = lazy(() =>
  import('./components/activitiesA2/QuizCenterA2View').then((m) => ({
    default: m.QuizCenterA2View,
  }))
);
const ExamBankView = lazy(() =>
  import('./components/activities/ExamBankView').then((m) => ({ default: m.ExamBankView }))
);
const ExamBankA2View = lazy(() =>
  import('./components/activitiesA2/ExamBankA2View').then((m) => ({ default: m.ExamBankA2View }))
);
const ClassesView = lazy(() =>
  import('./components/teaching/ClassesView').then((m) => ({ default: m.ClassesView }))
);
const AssignmentsView = lazy(() =>
  import('./components/teaching/AssignmentsView').then((m) => ({ default: m.AssignmentsView }))
);
const TeacherStudioView = lazy(() =>
  import('./components/teaching/TeacherStudioView').then((m) => ({
    default: m.TeacherStudioView,
  }))
);
const ProgressView = lazy(() =>
  import('./components/ProgressView').then((m) => ({ default: m.ProgressView }))
);
const ProfileView = lazy(() =>
  import('./components/ProfileView').then((m) => ({ default: m.ProfileView }))
);
const SettingsView = lazy(() =>
  import('./components/SettingsView').then((m) => ({ default: m.SettingsView }))
);

function TeachersKingdomShell() {
  const { activeCourse, setActiveCourse, uiLanguage, storageWarning, dismissStorageWarning } =
    useAppState();
  const locale = getLocale(uiLanguage);

  const initialLocation = useMemo(() => {
    if (typeof window === 'undefined') {
      return parseAppLocation('/', '', activeCourse);
    }
    return parseAppLocation(window.location.pathname, window.location.search, activeCourse);
    // Intentionally computed once on initial mount to capture the incoming URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeRoute, setActiveRoute] = useState<NavRouteId>(initialLocation.route);
  const [selectedVocabTopicId, setSelectedVocabTopicId] = useState<string | undefined>(
    initialLocation.course === 'de-A1' && initialLocation.route === 'kelime'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedA2TopicId, setSelectedA2TopicId] = useState<string | undefined>(
    initialLocation.course === 'de-A2' && initialLocation.route === 'kelime'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedA2ListeningScenarioId, setSelectedA2ListeningScenarioId] = useState<
    string | undefined
  >(
    initialLocation.course === 'de-A2' && initialLocation.route === 'dinleme'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedA2ReadingScenarioId, setSelectedA2ReadingScenarioId] = useState<
    string | undefined
  >(
    initialLocation.course === 'de-A2' && initialLocation.route === 'okuma'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedA2WritingScenarioId, setSelectedA2WritingScenarioId] = useState<
    string | undefined
  >(
    initialLocation.course === 'de-A2' && initialLocation.route === 'yazma'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedA2SpeakingScenarioId, setSelectedA2SpeakingScenarioId] = useState<
    string | undefined
  >(
    initialLocation.course === 'de-A2' && initialLocation.route === 'konusma'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedListeningScenarioId, setSelectedListeningScenarioId] = useState<
    string | undefined
  >(
    initialLocation.course === 'de-A1' && initialLocation.route === 'dinleme'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedReadingScenarioId, setSelectedReadingScenarioId] = useState<string | undefined>(
    initialLocation.course === 'de-A1' && initialLocation.route === 'okuma'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedWritingScenarioId, setSelectedWritingScenarioId] = useState<string | undefined>(
    initialLocation.course === 'de-A1' && initialLocation.route === 'yazma'
      ? initialLocation.targetId
      : undefined
  );
  const [selectedSpeakingScenarioId, setSelectedSpeakingScenarioId] = useState<string | undefined>(
    initialLocation.course === 'de-A1' && initialLocation.route === 'konusma'
      ? initialLocation.targetId
      : undefined
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const activeCourseRef = useRef<ActiveCourseId>(activeCourse);
  activeCourseRef.current = activeCourse;
  const activeRouteRef = useRef<NavRouteId>(activeRoute);
  activeRouteRef.current = activeRoute;
  const skipNextCourseUrlPushRef = useRef<boolean>(false);
  const hasSyncedInitialCourseRef = useRef<boolean>(false);

  const applyTargetSelection = useCallback(
    (route: NavRouteId, course: ActiveCourseId, targetId?: string) => {
      if (course === 'de-A2') {
        if (route === 'kelime') setSelectedA2TopicId(targetId);
        else if (route === 'dinleme') setSelectedA2ListeningScenarioId(targetId);
        else if (route === 'okuma') setSelectedA2ReadingScenarioId(targetId);
        else if (route === 'yazma') setSelectedA2WritingScenarioId(targetId);
        else if (route === 'konusma') setSelectedA2SpeakingScenarioId(targetId);
        return;
      }
      if (route === 'kelime') setSelectedVocabTopicId(targetId);
      else if (route === 'dinleme') setSelectedListeningScenarioId(targetId);
      else if (route === 'okuma') setSelectedReadingScenarioId(targetId);
      else if (route === 'yazma') setSelectedWritingScenarioId(targetId);
      else if (route === 'konusma') setSelectedSpeakingScenarioId(targetId);
    },
    []
  );

  // Apply explicit course from initial URL and normalize non-canonical/unknown paths on mount
  useEffect(() => {
    if (
      initialLocation.explicitCourse &&
      initialLocation.explicitCourse !== activeCourseRef.current
    ) {
      skipNextCourseUrlPushRef.current = true;
      setActiveCourse(initialLocation.explicitCourse);
    }

    if (typeof window !== 'undefined' && initialLocation.needsCanonicalReplace) {
      const canonical = buildAppUrl(
        initialLocation.route,
        initialLocation.course,
        initialLocation.targetId
      );
      window.history.replaceState(
        {
          route: initialLocation.route,
          course: initialLocation.course,
          targetId: initialLocation.targetId,
        },
        '',
        canonical
      );
    }
  }, [initialLocation, setActiveCourse]);

  // Keep URL synchronized when user switches A1/A2 directly in TopBar or HomeView
  useEffect(() => {
    if (!hasSyncedInitialCourseRef.current) {
      hasSyncedInitialCourseRef.current = true;
      return;
    }
    if (skipNextCourseUrlPushRef.current) {
      skipNextCourseUrlPushRef.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    const route = activeRouteRef.current;
    if (route === 'home' || COURSE_SCOPED_ROUTES.has(route)) {
      const nextUrl = buildAppUrl(route, activeCourse);
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (nextUrl !== currentUrl) {
        window.history.pushState({ route, course: activeCourse }, '', nextUrl);
      }
    }
  }, [activeCourse]);

  // Handle browser Back / Forward buttons cleanly via popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const parsed = parseAppLocation(
        window.location.pathname,
        window.location.search,
        activeCourseRef.current
      );
      if (parsed.course !== activeCourseRef.current) {
        skipNextCourseUrlPushRef.current = true;
        setActiveCourse(parsed.course);
      }
      applyTargetSelection(parsed.route, parsed.course, parsed.targetId);
      setActiveRoute(parsed.route);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [applyTargetSelection, setActiveCourse]);

  // Keep browser tab & history entry title synchronized with active module and CEFR level
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = buildDocumentTitle(activeRoute, activeCourse, uiLanguage);
    }
  }, [activeRoute, activeCourse, uiLanguage]);

  const navigateTo = useCallback(
    (
      route: NavRouteId,
      options?: { course?: ActiveCourseId; targetId?: string; replace?: boolean }
    ) => {
      const nextCourse = options?.course ?? activeCourseRef.current;
      if (nextCourse !== activeCourseRef.current) {
        skipNextCourseUrlPushRef.current = true;
        setActiveCourse(nextCourse);
      }
      applyTargetSelection(route, nextCourse, options?.targetId);
      setActiveRoute(route);

      if (typeof window !== 'undefined') {
        const nextUrl = buildAppUrl(route, nextCourse, options?.targetId);
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        if (nextUrl !== currentUrl) {
          const statePayload = { route, course: nextCourse, targetId: options?.targetId };
          if (options?.replace) {
            window.history.replaceState(statePayload, '', nextUrl);
          } else {
            window.history.pushState(statePayload, '', nextUrl);
          }
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [applyTargetSelection, setActiveCourse]
  );

  const handleNavigate = (route: NavRouteId) => {
    navigateTo(route);
  };

  const handleOpenVocabTopic = (topicId: string) => {
    navigateTo('kelime', { course: 'de-A1', targetId: topicId });
  };

  const handleOpenA2Topic = (topicId: string) => {
    navigateTo('kelime', { course: 'de-A2', targetId: topicId });
  };

  const handleOpenA2ListeningScenario = (scenarioId: string) => {
    navigateTo('dinleme', { course: 'de-A2', targetId: scenarioId });
  };

  const handleOpenA2ReadingScenario = (scenarioId: string) => {
    navigateTo('okuma', { course: 'de-A2', targetId: scenarioId });
  };

  const handleOpenA2WritingScenario = (scenarioId: string) => {
    navigateTo('yazma', { course: 'de-A2', targetId: scenarioId });
  };

  const handleOpenA2SpeakingScenario = (scenarioId: string) => {
    navigateTo('konusma', { course: 'de-A2', targetId: scenarioId });
  };

  const handleOpenListeningScenario = (scenarioId: string) => {
    navigateTo('dinleme', { course: 'de-A1', targetId: scenarioId });
  };

  const handleOpenReadingScenario = (scenarioId: string) => {
    navigateTo('okuma', { course: 'de-A1', targetId: scenarioId });
  };

  const handleOpenWritingScenario = (scenarioId: string) => {
    navigateTo('yazma', { course: 'de-A1', targetId: scenarioId });
  };

  const handleOpenSpeakingScenario = (scenarioId: string) => {
    navigateTo('konusma', { course: 'de-A1', targetId: scenarioId });
  };

  const handleLaunchAssignmentTarget = (
    moduleRoute: TeachingAssignmentModule,
    targetId?: string,
    courseId: ActiveCourseId = 'de-A1'
  ) => {
    navigateTo(moduleRoute, { course: courseId, targetId });
  };

  const renderMainView = () => {
    const isA2 = activeCourse === 'de-A2';

    switch (activeRoute) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'kelime':
        return isA2 ? (
          <VocabA2Module initialTopicId={selectedA2TopicId} />
        ) : (
          <VocabModule initialTopicId={selectedVocabTopicId} />
        );
      case 'dinleme':
        return isA2 ? (
          <ListeningA2Module initialScenarioId={selectedA2ListeningScenarioId} />
        ) : (
          <ListeningModule initialScenarioId={selectedListeningScenarioId} />
        );
      case 'okuma':
        return isA2 ? (
          <ReadingA2Module initialScenarioId={selectedA2ReadingScenarioId} />
        ) : (
          <ReadingModule initialScenarioId={selectedReadingScenarioId} />
        );
      case 'yazma':
        return isA2 ? (
          <WritingA2Module initialScenarioId={selectedA2WritingScenarioId} />
        ) : (
          <WritingModule initialScenarioId={selectedWritingScenarioId} />
        );
      case 'konusma':
        return isA2 ? (
          <SpeakingA2Module initialScenarioId={selectedA2SpeakingScenarioId} />
        ) : (
          <SpeakingModule initialScenarioId={selectedSpeakingScenarioId} />
        );
      case 'karaoke':
        return isA2 ? (
          <KaraokeA2View onNavigate={handleNavigate} />
        ) : (
          <KaraokeStudioView onNavigate={handleNavigate} />
        );
      case 'sessiz-sinema':
        return isA2 ? (
          <CharadesA2View onNavigate={handleNavigate} />
        ) : (
          <CharadesView onNavigate={handleNavigate} />
        );
      case 'arena':
        return isA2 ? (
          <ArenaA2View onNavigate={handleNavigate} />
        ) : (
          <ArenaView onNavigate={handleNavigate} />
        );
      case 'quiz-merkezi':
        return isA2 ? (
          <QuizCenterA2View onNavigate={handleNavigate} />
        ) : (
          <QuizCenterView onNavigate={handleNavigate} />
        );
      case 'sinav-modu':
        return isA2 ? (
          <ExamBankA2View onNavigate={handleNavigate} />
        ) : (
          <ExamBankView onNavigate={handleNavigate} />
        );
      case 'siniflarim':
        return <ClassesView onNavigate={handleNavigate} />;
      case 'odevler':
        return (
          <AssignmentsView
            onNavigate={handleNavigate}
            onLaunchTarget={handleLaunchAssignmentTarget}
          />
        );
      case 'ogretmen-studyosu':
        return (
          <TeacherStudioView
            onNavigate={handleNavigate}
            onLaunchTarget={handleLaunchAssignmentTarget}
          />
        );
      case 'ogrenme-yolum':
        return (
          <ProgressView
            onOpenTopic={handleOpenVocabTopic}
            onOpenA2Topic={handleOpenA2Topic}
            onOpenA2ListeningScenario={handleOpenA2ListeningScenario}
            onOpenA2ReadingScenario={handleOpenA2ReadingScenario}
            onOpenA2WritingScenario={handleOpenA2WritingScenario}
            onOpenA2SpeakingScenario={handleOpenA2SpeakingScenario}
            onOpenListeningScenario={handleOpenListeningScenario}
            onOpenReadingScenario={handleOpenReadingScenario}
            onOpenWritingScenario={handleOpenWritingScenario}
            onOpenSpeakingScenario={handleOpenSpeakingScenario}
            onOpenActivityRoute={handleNavigate}
          />
        );
      case 'profil':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'ayarlar':
        return <SettingsView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F6F4] text-[#0D0D0D] dark:bg-[#0D0D0D] dark:text-[#FFFFFF] overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-[#0D0D0D] focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-[#FFFFFF] focus:shadow-lg dark:focus:bg-[#D4AF37] dark:focus:text-[#0D0D0D]"
      >
        {locale.home.skipToContent}
      </a>

      <div className="print:hidden">
        <TopBar
          sidebarCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          onToggleSidebarCollapse={() => setSidebarCollapsed((c) => !c)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateHome={() => handleNavigate('home')}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />
      </div>

      <div className="flex flex-1 min-w-0">
        <div className="print:hidden">
          <Sidebar
            activeRoute={activeRoute}
            onSelectRoute={handleNavigate}
            collapsed={sidebarCollapsed}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8 focus:outline-none"
          >
            {storageWarning && (
              <div
                role="alert"
                className="mx-auto mb-6 flex max-w-6xl items-start justify-between gap-3 rounded-xl border border-[#9A6B16]/45 bg-[#FEF9EB] px-4 py-3 text-xs leading-relaxed text-[#0D0D0D] dark:border-[#D4AF37]/45 dark:bg-[#231D11] dark:text-[#FFFFFF]"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D4AF37] shrink-0" />
                  <div className="space-y-1">
                    <p>{storageWarning}</p>
                    <button
                      type="button"
                      onClick={() => handleNavigate('ayarlar')}
                      className="font-semibold text-[#7A1C24] underline underline-offset-2 dark:text-[#D4AF37]"
                    >
                      Ayarlar ve Veri Yedekleme ekranını aç
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={dismissStorageWarning}
                  aria-label="Depolama uyarısını kapat"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#52525B] hover:bg-[#ECECE8] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <Suspense
              fallback={
                <div className="mx-auto flex max-w-6xl items-center justify-center py-20 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {uiLanguage === 'en' ? 'Loading module…' : 'Modül yükleniyor…'}
                </div>
              }
            >
              {renderMainView()}
            </Suspense>
          </main>

          <footer className="print:hidden border-t border-[#D9D9D3] bg-[#FFFFFF]/80 px-4 py-4 sm:px-6 lg:px-10 dark:border-[#282830] dark:bg-[#0D0D0D]/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-[#52525B] sm:flex-row sm:items-center sm:justify-between dark:text-[#A1A1AA]">
              <p>
                <strong className="font-semibold text-[#0D0D0D] dark:text-[#FFFFFF]">
                  {locale.brand.name}
                </strong>{' '}
                ·{' '}
                <span className="font-semibold text-[#9A6B16] dark:text-[#D4AF37]">
                  {locale.brand.philosophy}
                </span>{' '}
                ·{' '}
                <span className="font-medium text-[#7A1C24] dark:text-[#F4C9CD]">
                  {locale.brand.mottoEn}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{locale.home.footerStatus}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenPortability={() => {
          setAuthModalOpen(false);
          handleNavigate('ayarlar');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppStateProvider>
        <TeachersKingdomShell />
      </AppStateProvider>
    </AppErrorBoundary>
  );
}
