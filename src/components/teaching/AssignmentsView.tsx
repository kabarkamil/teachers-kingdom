import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Info,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  TEACHING_MODULE_CATALOG,
  getModuleShortLabelTr,
  getTargetLiveProgress,
} from '../../data/germanA1Teaching';
import {
  A2_ASSIGNMENT_QUICK_TEMPLATES,
  TEACHING_A2_MODULE_CATALOG,
  getA2TargetLiveProgress,
} from '../../data/germanA2Teaching';
import type { ActiveCourseId, NavRouteId, TeachingAssignmentModule } from '../../types';
import { TeachingSubNav } from './TeachingSubNav';

interface AssignmentsViewProps {
  onNavigate: (route: NavRouteId) => void;
  onLaunchTarget: (
    moduleRoute: TeachingAssignmentModule,
    targetId?: string,
    courseId?: ActiveCourseId
  ) => void;
}

type StatusFilter = 'all' | 'assigned' | 'completed' | 'reviewed';
type CourseFilter = 'all' | ActiveCourseId;

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  onNavigate,
  onLaunchTarget,
}) => {
  const {
    activeCourse,
    rolePreview,
    progress,
    a2Progress,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
    createTeachingAssignment,
    toggleAssignmentCompleted,
    updateAssignmentReview,
    deleteTeachingAssignment,
  } = useAppState();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [formCourseId, setFormCourseId] = useState<ActiveCourseId>(activeCourse);
  const [titleTr, setTitleTr] = useState('');
  const [moduleRoute, setModuleRoute] = useState<TeachingAssignmentModule>('kelime');
  const [targetId, setTargetId] = useState<string>(() => {
    const cat = activeCourse === 'de-A2' ? TEACHING_A2_MODULE_CATALOG : TEACHING_MODULE_CATALOG;
    return cat[0].targets[0].id;
  });
  const [classId, setClassId] = useState<string>('');
  const [dueDateLabel, setDueDateLabel] = useState('');
  const [instructionsTr, setInstructionsTr] = useState('');

  // Teacher review inline editor state
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewDraftNote, setReviewDraftNote] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const activeCatalog = useMemo(
    () => (formCourseId === 'de-A2' ? TEACHING_A2_MODULE_CATALOG : TEACHING_MODULE_CATALOG),
    [formCourseId]
  );

  const selectedModuleConfig = useMemo(
    () => activeCatalog.find((m) => m.route === moduleRoute) ?? activeCatalog[0],
    [activeCatalog, moduleRoute]
  );

  const handleFormCourseChange = (nextCourse: ActiveCourseId) => {
    setFormCourseId(nextCourse);
    const nextCatalog =
      nextCourse === 'de-A2' ? TEACHING_A2_MODULE_CATALOG : TEACHING_MODULE_CATALOG;
    const mod = nextCatalog.find((m) => m.route === moduleRoute) ?? nextCatalog[0];
    setModuleRoute(mod.route);
    setTargetId(mod.targets[0]?.id ?? '');
  };

  const handleModuleChange = (nextRoute: TeachingAssignmentModule) => {
    setModuleRoute(nextRoute);
    const mod = activeCatalog.find((m) => m.route === nextRoute);
    setTargetId(mod?.targets[0]?.id ?? '');
  };

  const handleQuickAddA2Template = (templateId: string) => {
    const tpl = A2_ASSIGNMENT_QUICK_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    const { xpAwarded } = createTeachingAssignment({
      courseId: 'de-A2',
      titleTr: tpl.titleTr,
      moduleRoute: tpl.moduleRoute,
      targetId: tpl.targetId,
      targetLabelTr: tpl.targetLabelTr,
      dueDateLabel: tpl.dueDateLabel,
      instructionsTr: tpl.instructionsTr,
    });
    setFeedbackBanner(
      xpAwarded > 0
        ? `Hazır A2 ödevi eklendi (+${xpAwarded} XP ilk ödev oluşturma kazanımı).`
        : `"${tpl.titleTr}" A2 ödev listesine eklendi.`
    );
    window.setTimeout(() => setFeedbackBanner(null), 3200);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr.trim()) return;
    const chosenTarget =
      selectedModuleConfig.targets.find((t) => t.id === targetId) ??
      selectedModuleConfig.targets[0];

    const levelShort = formCourseId === 'de-A2' ? 'A2' : 'A1';
    const { xpAwarded } = createTeachingAssignment({
      courseId: formCourseId,
      titleTr,
      moduleRoute,
      targetId: chosenTarget?.id,
      targetLabelTr: chosenTarget?.labelTr ?? selectedModuleConfig.labelTr,
      classId: classId || undefined,
      dueDateLabel: dueDateLabel || undefined,
      instructionsTr:
        instructionsTr.trim() ||
        `${selectedModuleConfig.labelTr} modülündeki "${chosenTarget?.labelTr ?? ''}" çalışmasını tamamlayın.`,
    });

    setTitleTr('');
    setDueDateLabel('');
    setInstructionsTr('');
    setShowCreateForm(false);
    setFeedbackBanner(
      xpAwarded > 0
        ? `Yeni ${levelShort} ödevi yerel olarak oluşturuldu (+${xpAwarded} XP ilk ödev oluşturma kazanımı).`
        : `Yeni ${levelShort} ödevi yerel tarayıcı listesine eklendi.`
    );
    window.setTimeout(() => setFeedbackBanner(null), 3200);
  };

  const handleToggleDone = (assignmentId: string) => {
    const res = toggleAssignmentCompleted(assignmentId);
    if (res.xpAwarded > 0) {
      setFeedbackBanner(`Ödev tamamlandı olarak işaretlendi (+${res.xpAwarded} XP tek seferlik ödül).`);
      window.setTimeout(() => setFeedbackBanner(null), 3200);
    } else if (res.status === 'completed') {
      setFeedbackBanner('Ödev tamamlandı olarak güncellendi (bu ödevin XP ödülü daha önce alınmıştı).');
      window.setTimeout(() => setFeedbackBanner(null), 2800);
    }
  };

  const handleOpenReview = (assignmentId: string, existingNote?: string) => {
    setReviewingId(assignmentId);
    setReviewDraftNote(existingNote ?? '');
  };

  const handleSaveReview = (assignmentId: string, markReviewed: boolean) => {
    updateAssignmentReview(assignmentId, markReviewed, reviewDraftNote);
    setReviewingId(null);
    setReviewDraftNote('');
    setFeedbackBanner(
      markReviewed
        ? 'Öğretmen incelemesi ve yerel geri bildirim notu kaydedildi.'
        : 'İnceleme durumu güncellendi.'
    );
    window.setTimeout(() => setFeedbackBanner(null), 2800);
  };

  const filteredAssignments = useMemo(() => {
    return progress.teachingAssignments.filter((a) => {
      const effectiveCourse: ActiveCourseId = a.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
      if (courseFilter !== 'all' && effectiveCourse !== courseFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (classFilter !== 'all') {
        if (classFilter === 'unassigned' && a.classId) return false;
        if (classFilter !== 'unassigned' && a.classId !== classFilter) return false;
      }
      return true;
    });
  }, [progress.teachingAssignments, courseFilter, statusFilter, classFilter]);

  const counts = useMemo(() => {
    const all = progress.teachingAssignments.length;
    const assigned = progress.teachingAssignments.filter((a) => a.status === 'assigned').length;
    const completed = progress.teachingAssignments.filter((a) => a.status === 'completed').length;
    const reviewed = progress.teachingAssignments.filter((a) => a.status === 'reviewed').length;
    const a1Count = progress.teachingAssignments.filter((a) => a.courseId !== 'de-A2').length;
    const a2Count = progress.teachingAssignments.filter((a) => a.courseId === 'de-A2').length;
    return { all, assigned, completed, reviewed, a1Count, a2Count };
  }, [progress.teachingAssignments]);

  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of progress.teachingClasses) {
      map.set(c.id, c.name);
    }
    return map;
  }, [progress.teachingClasses]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <TeachingSubNav activeRoute="odevler" onNavigate={onNavigate} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#282830]">
        <div>
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            Öğretim ve Yönetim · Almanca CEFR A1 &amp; A2 ·{' '}
            {rolePreview === 'teacher' ? 'Öğretmen Görünümü' : 'Öğrenci Görünümü'}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Ödevler
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{showCreateForm ? 'Formu Kapat' : 'Yeni A1 / A2 Ödevi Ata'}</span>
        </button>
      </div>

      {feedbackBanner && (
        <div
          role="status"
          className="rounded-xl border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
        >
          {feedbackBanner}
        </div>
      )}

      {/* Quick-add CEFR A2 Starter Assignment Templates */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-[#ECECE8] bg-[#FFFFFF] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C] dark:bg-[#16161A]">
        <div className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Hızlı CEFR A2 Ödev Şablonları:
          </strong>{' '}
          Mevcut A1 ödevlerinizi bozmadan tek tıkla A2 görevi ekleyin.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {A2_ASSIGNMENT_QUICK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleQuickAddA2Template(tpl.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
              <span>
                {tpl.moduleRoute === 'kelime'
                  ? 'A2 Kelime'
                  : tpl.moduleRoute === 'yazma'
                  ? 'A2 Yazma'
                  : 'A2 Sınav Modu'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Create New Assignment Form */}
      {showCreateForm && (
        <section className="rounded-xl border border-[#7C1D2E]/40 bg-[#FFFFFF] p-6 dark:border-[#D9A13B]/40 dark:bg-[#16161A]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Yeni Almanca {formCourseId === 'de-A2' ? 'CEFR A2' : 'CEFR A1'} Ödevi Oluştur
              </h2>
              <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Seçtiğiniz seviye ve ünite/senaryo doğrudan ilgili çalışma ekranına bağlanır; ilerleme çubuğu gerçek yerel kayıttan (
                <span className="font-mono">
                  {formCourseId === 'de-A2'
                    ? 'tk_course_de_a2_progress_v1'
                    : 'tk_stage1_progress_v1'}
                </span>
                ) hesaplanır.
              </p>
            </div>

            <div
              role="group"
              aria-label="Ödev CEFR seviyesi"
              className="inline-flex items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-1 dark:border-[#282830] dark:bg-[#111113] shrink-0"
            >
              <button
                type="button"
                aria-pressed={formCourseId === 'de-A1'}
                onClick={() => handleFormCourseChange('de-A1')}
                className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  formCourseId === 'de-A1'
                    ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                CEFR A1
              </button>
              <button
                type="button"
                aria-pressed={formCourseId === 'de-A2'}
                onClick={() => handleFormCourseChange('de-A2')}
                className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  formCourseId === 'de-A2'
                    ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                CEFR A2
              </button>
            </div>
          </div>

          <form
            onSubmit={handleCreateAssignment}
            className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label
                htmlFor="assign-title"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Ödev Başlığı *
              </label>
              <input
                id="assign-title"
                type="text"
                required
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                placeholder={
                  formCourseId === 'de-A2'
                    ? 'Örn: A2 İş Hayatı Çoğul İsimler ve Randevu Yazışması'
                    : 'Örn: Aile Ünitesi Artikel ve Dinleme Tekrarı'
                }
                maxLength={100}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <label
                htmlFor="assign-module"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Bağlı {formCourseId === 'de-A2' ? 'A2' : 'A1'} Modülü
              </label>
              <select
                id="assign-module"
                value={moduleRoute}
                onChange={(e) => handleModuleChange(e.target.value as TeachingAssignmentModule)}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              >
                {activeCatalog.map((m) => (
                  <option key={m.route} value={m.route}>
                    {m.labelTr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="assign-target"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Ünite / Senaryo Hedefi
              </label>
              <select
                id="assign-target"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              >
                {selectedModuleConfig.targets.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.labelTr} ({t.subtitleDe})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="assign-class"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Sınıf Grubu (İsteğe Bağlı)
              </label>
              <select
                id="assign-class"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              >
                <option value="">
                  Genel / Bireysel {formCourseId === 'de-A2' ? 'A2' : 'A1'} Görevi
                </option>
                {progress.teachingClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.levelLabel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="assign-due"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Hedef Tarih / Hafta Etiketi
              </label>
              <input
                id="assign-due"
                type="text"
                value={dueDateLabel}
                onChange={(e) => setDueDateLabel(e.target.value)}
                placeholder="Örn: Cuma 18:00 veya Hafta 4"
                maxLength={48}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="assign-instructions"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Görev Yönergesi
              </label>
              <textarea
                id="assign-instructions"
                rows={2}
                value={instructionsTr}
                onChange={(e) => setInstructionsTr(e.target.value)}
                placeholder="Öğrencinin hangi alıştırmaları çözmesi ve nelere dikkat etmesi gerektiğini yazın..."
                maxLength={320}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="h-10 rounded-lg border border-[#D9D9D3] px-4 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#A1A1AA]"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-[#7C1D2E] px-5 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
              >
                Ödevi Kaydet
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Ödev durum filtresi"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
          >
            {(
              [
                { id: 'all', label: `Tümü (${counts.all})` },
                { id: 'assigned', label: `Bekleyen (${counts.assigned})` },
                { id: 'completed', label: `Tamamlanan (${counts.completed})` },
                { id: 'reviewed', label: `İncelenen (${counts.reviewed})` },
              ] as Array<{ id: StatusFilter; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                  statusFilter === tab.id
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Seviye filtresi"
            className="flex items-center gap-1 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
          >
            {(
              [
                { id: 'all', label: 'A1+A2' },
                { id: 'de-A1', label: `A1 (${counts.a1Count})` },
                { id: 'de-A2', label: `A2 (${counts.a2Count})` },
              ] as Array<{ id: CourseFilter; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCourseFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                  courseFilter === tab.id
                    ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {progress.teachingClasses.length > 0 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-class-select"
              className="text-xs text-[#52525B] dark:text-[#A1A1AA] whitespace-nowrap"
            >
              Sınıf:
            </label>
            <select
              id="filter-class-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5]"
            >
              <option value="all">Tüm Sınıflar</option>
              <option value="unassigned">Genel / Bireysel</option>
              {progress.teachingClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-8 text-center dark:border-[#282830] dark:bg-[#16161A]">
          <ClipboardCheck className="mx-auto h-7 w-7 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <p className="mt-3 font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Seçili filtrede ödev bulunmuyor
          </p>
          <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
            Filtreyi değiştirebilir, hızlı A2 şablonlarından ekleyebilir veya yeni bir Almanca A1/A2 ödevi oluşturabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const assignmentCourse: ActiveCourseId =
              assignment.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
            const isA2Assignment = assignmentCourse === 'de-A2';
            const liveProgress = isA2Assignment
              ? getA2TargetLiveProgress(
                  assignment.moduleRoute,
                  assignment.targetId,
                  a2Progress,
                  uniqueA2CompletedWordIds
                )
              : getTargetLiveProgress(
                  assignment.moduleRoute,
                  assignment.targetId,
                  progress,
                  uniqueCompletedWordIds
                );
            const isDone =
              assignment.status === 'completed' || assignment.status === 'reviewed';
            const isReviewed = assignment.status === 'reviewed';
            const xpAlreadyAwarded = progress.assignmentCompletedIds.includes(assignment.id);
            const linkedClassName = assignment.classId ? classMap.get(assignment.classId) : null;

            return (
              <article
                key={assignment.id}
                className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 min-w-0 flex-1">
                    {/* Clean unboxed metadata row */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                        {isA2Assignment ? 'CEFR A2' : 'CEFR A1'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                        {getModuleShortLabelTr(assignment.moduleRoute)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{assignment.targetLabelTr}</span>
                      {linkedClassName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Sınıf: {linkedClassName}</span>
                        </>
                      )}
                      {assignment.dueDateLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{assignment.dueDateLabel}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          isReviewed
                            ? 'text-[#15803D] dark:text-[#4ADE80]'
                            : isDone
                            ? 'text-[#7C1D2E] dark:text-[#D9A13B]'
                            : 'text-[#52525B] dark:text-[#A1A1AA]'
                        }`}
                      >
                        {isReviewed
                          ? 'Öğretmen İnceledi'
                          : isDone
                          ? 'Tamamlandı'
                          : 'Bekliyor'}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {assignment.titleTr}
                    </h2>

                    <p className="text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                      {assignment.instructionsTr}
                    </p>

                    {/* Real Linked Module Progress Bar */}
                    <div className="pt-2 max-w-md space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        <span>Bu tarayıcıdaki gerçek modül ilerlemesi</span>
                        <span className="font-mono font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                          {liveProgress.done}/{liveProgress.total} {liveProgress.unitLabelTr} (%
                          {liveProgress.percent})
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#ECECE8] dark:bg-[#23232B]">
                        <div
                          className="h-full bg-[#7C1D2E] transition-all duration-300 dark:bg-[#D9A13B]"
                          style={{ width: `${liveProgress.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Teacher Review Note Display */}
                    {assignment.reviewNoteTr && (
                      <div className="mt-3 rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 text-xs text-[#111113] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#E4E4E7]">
                        <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                          Yerel İnceleme Notu:{' '}
                        </span>
                        {assignment.reviewNoteTr}
                      </div>
                    )}
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch lg:min-w-[205px] shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onLaunchTarget(
                          assignment.moduleRoute,
                          assignment.targetId,
                          assignmentCourse
                        )
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111113] px-4 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
                    >
                      <span>{isA2Assignment ? 'A2 Modülünde Aç' : 'A1 Modülünde Aç'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleDone(assignment.id)}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors whitespace-nowrap ${
                        isDone
                          ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]'
                          : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0" />
                      )}
                      <span>
                        {isDone
                          ? 'Tamamlandı (Geri Al)'
                          : xpAlreadyAwarded
                          ? 'Tamamlandı İşaretle'
                          : 'Tamamlandı (+15 XP)'}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          reviewingId === assignment.id
                            ? setReviewingId(null)
                            : handleOpenReview(assignment.id, assignment.reviewNoteTr)
                        }
                        className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs font-medium text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] whitespace-nowrap"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>İncele / Not</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTeachingAssignment(assignment.id)}
                        aria-label={`${assignment.titleTr} ödevini sil`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D9D9D3] text-[#52525B] hover:border-[#B91C1C]/40 hover:text-[#991B1B] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5] shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Local Teacher Review Panel */}
                {reviewingId === assignment.id && (
                  <div className="mt-4 border-t border-[#ECECE8] pt-4 space-y-3 dark:border-[#24242C]">
                    <label
                      htmlFor={`review-note-${assignment.id}`}
                      className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                    >
                      Öğretmen İnceleme Notu (Yerel Kayıt)
                    </label>
                    <textarea
                      id={`review-note-${assignment.id}`}
                      rows={2}
                      value={reviewDraftNote}
                      onChange={(e) => setReviewDraftNote(e.target.value)}
                      placeholder="Örn: Artikel kullanımı çok iyi, cümle sonundaki noktalama kurallarına dikkat."
                      maxLength={240}
                      className="w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewingId(null)}
                        className="h-9 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]"
                      >
                        Kapat
                      </button>
                      {isReviewed && (
                        <button
                          type="button"
                          onClick={() => handleSaveReview(assignment.id, false)}
                          className="h-9 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#111113] dark:border-[#282830] dark:text-[#F4F4F5]"
                        >
                          İnceleme İşaretini Kaldır
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveReview(assignment.id, true)}
                        className="h-9 rounded-lg bg-[#7C1D2E] px-4 text-xs font-medium text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                      >
                        İncelendi Olarak Kaydet
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Honest Local Storage Note */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex items-start gap-2.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
          <Info className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
          <p className="leading-relaxed">
            Ödevler, tamamlama işaretleri ve inceleme notları tarayıcınızdaki yerel depolamada tutulur. Her ödev için `+15 XP` ödülü yalnızca ilk tamamlanışta tek sefer verilir; sunucu taraflı öğrenci teslimi ve otomatik çoklu cihaz bildirimleri sonraki aşamalarda eklenecektir.
          </p>
        </div>
      </div>
    </div>
  );
};
