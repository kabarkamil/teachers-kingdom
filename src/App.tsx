/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { getLocale } from './i18n/tr';
import type { ActiveCourseId, NavRouteId, TeachingAssignmentModule } from './types';

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
  const [activeRoute, setActiveRoute] = useState<NavRouteId>('home');
  const [selectedVocabTopicId, setSelectedVocabTopicId] = useState<string | undefined>(undefined);
  const [selectedA2TopicId, setSelectedA2TopicId] = useState<string | undefined>(undefined);
  const [selectedA2ListeningScenarioId, setSelectedA2ListeningScenarioId] = useState<
    string | undefined
  >(undefined);
  const [selectedA2ReadingScenarioId, setSelectedA2ReadingScenarioId] = useState<
    string | undefined
  >(undefined);
  const [selectedA2WritingScenarioId, setSelectedA2WritingScenarioId] = useState<
    string | undefined
  >(undefined);
  const [selectedA2SpeakingScenarioId, setSelectedA2SpeakingScenarioId] = useState<
    string | undefined
  >(undefined);
  const [selectedListeningScenarioId, setSelectedListeningScenarioId] = useState<
    string | undefined
  >(undefined);
  const [selectedReadingScenarioId, setSelectedReadingScenarioId] = useState<string | undefined>(
    undefined
  );
  const [selectedWritingScenarioId, setSelectedWritingScenarioId] = useState<string | undefined>(
    undefined
  );
  const [selectedSpeakingScenarioId, setSelectedSpeakingScenarioId] = useState<string | undefined>(
    undefined
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleNavigate = (route: NavRouteId) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVocabTopic = (topicId: string) => {
    setActiveCourse('de-A1');
    setSelectedVocabTopicId(topicId);
    setActiveRoute('kelime');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenA2Topic = (topicId: string) => {
    setActiveCourse('de-A2');
    setSelectedA2TopicId(topicId);
    setActiveRoute('kelime');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenA2ListeningScenario = (scenarioId: string) => {
    setActiveCourse('de-A2');
    setSelectedA2ListeningScenarioId(scenarioId);
    setActiveRoute('dinleme');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenA2ReadingScenario = (scenarioId: string) => {
    setActiveCourse('de-A2');
    setSelectedA2ReadingScenarioId(scenarioId);
    setActiveRoute('okuma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenA2WritingScenario = (scenarioId: string) => {
    setActiveCourse('de-A2');
    setSelectedA2WritingScenarioId(scenarioId);
    setActiveRoute('yazma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenA2SpeakingScenario = (scenarioId: string) => {
    setActiveCourse('de-A2');
    setSelectedA2SpeakingScenarioId(scenarioId);
    setActiveRoute('konusma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenListeningScenario = (scenarioId: string) => {
    setActiveCourse('de-A1');
    setSelectedListeningScenarioId(scenarioId);
    setActiveRoute('dinleme');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReadingScenario = (scenarioId: string) => {
    setActiveCourse('de-A1');
    setSelectedReadingScenarioId(scenarioId);
    setActiveRoute('okuma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWritingScenario = (scenarioId: string) => {
    setActiveCourse('de-A1');
    setSelectedWritingScenarioId(scenarioId);
    setActiveRoute('yazma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSpeakingScenario = (scenarioId: string) => {
    setActiveCourse('de-A1');
    setSelectedSpeakingScenarioId(scenarioId);
    setActiveRoute('konusma');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchAssignmentTarget = (
    moduleRoute: TeachingAssignmentModule,
    targetId?: string,
    courseId: ActiveCourseId = 'de-A1'
  ) => {
    if (courseId === 'de-A2') {
      setActiveCourse('de-A2');
      if (moduleRoute === 'kelime' && targetId) {
        handleOpenA2Topic(targetId);
        return;
      }
      if (moduleRoute === 'dinleme' && targetId) {
        handleOpenA2ListeningScenario(targetId);
        return;
      }
      if (moduleRoute === 'okuma' && targetId) {
        handleOpenA2ReadingScenario(targetId);
        return;
      }
      if (moduleRoute === 'yazma' && targetId) {
        handleOpenA2WritingScenario(targetId);
        return;
      }
      if (moduleRoute === 'konusma' && targetId) {
        handleOpenA2SpeakingScenario(targetId);
        return;
      }
      handleNavigate(moduleRoute);
      return;
    }

    setActiveCourse('de-A1');
    if (moduleRoute === 'kelime' && targetId) {
      handleOpenVocabTopic(targetId);
      return;
    }
    if (moduleRoute === 'dinleme' && targetId) {
      handleOpenListeningScenario(targetId);
      return;
    }
    if (moduleRoute === 'okuma' && targetId) {
      handleOpenReadingScenario(targetId);
      return;
    }
    if (moduleRoute === 'yazma' && targetId) {
      handleOpenWritingScenario(targetId);
      return;
    }
    if (moduleRoute === 'konusma' && targetId) {
      handleOpenSpeakingScenario(targetId);
      return;
    }
    handleNavigate(moduleRoute);
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
