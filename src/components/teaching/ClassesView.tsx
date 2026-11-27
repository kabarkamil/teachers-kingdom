import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ClipboardList,
  Info,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { TOTAL_ACTIVITY_ITEMS } from '../../data/germanA1Activities';
import { TOTAL_LISTENING_EXERCISES } from '../../data/germanA1Listening';
import { TOTAL_READING_EXERCISES } from '../../data/germanA1Reading';
import { TOTAL_SPEAKING_TASKS } from '../../data/germanA1Speaking';
import { CLASS_TEMPLATE_PRESETS } from '../../data/germanA1Teaching';
import { ALL_A1_WORDS } from '../../data/germanA1Vocab';
import { TOTAL_WRITING_TASKS } from '../../data/germanA1Writing';
import { TOTAL_A2_ACTIVITY_ITEMS } from '../../data/germanA2Activities';
import { TOTAL_A2_LISTENING_EXERCISES } from '../../data/germanA2Listening';
import { TOTAL_A2_READING_EXERCISES } from '../../data/germanA2Reading';
import { TOTAL_A2_SPEAKING_TASKS } from '../../data/germanA2Speaking';
import { A2_CLASS_TEMPLATE_PRESETS } from '../../data/germanA2Teaching';
import { ALL_A2_WORDS } from '../../data/germanA2Vocab';
import { TOTAL_A2_WRITING_TASKS } from '../../data/germanA2Writing';
import type { ActiveCourseId, NavRouteId } from '../../types';
import { TeachingSubNav } from './TeachingSubNav';

interface ClassesViewProps {
  onNavigate: (route: NavRouteId) => void;
}

const ALL_CLASS_PRESETS = [
  ...CLASS_TEMPLATE_PRESETS.map((p) => ({ ...p, courseId: 'de-A1' as ActiveCourseId })),
  ...A2_CLASS_TEMPLATE_PRESETS,
];

export const ClassesView: React.FC<ClassesViewProps> = ({ onNavigate }) => {
  const {
    activeCourse,
    displayName,
    rolePreview,
    progress,
    a2Progress,
    uniqueCompletedWordIds,
    uniqueA2CompletedWordIds,
    overallAccuracyPercent,
    a2OverallAccuracyPercent,
    createTeachingClass,
    deleteTeachingClass,
    addClassRosterEntry,
    removeClassRosterEntry,
  } = useAppState();

  const [snapshotCourse, setSnapshotCourse] = useState<ActiveCourseId>(activeCourse);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    progress.teachingClasses[0]?.id ?? null
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create class form fields
  const [formCourseId, setFormCourseId] = useState<ActiveCourseId>(activeCourse);
  const [className, setClassName] = useState('');
  const [levelLabel, setLevelLabel] = useState(activeCourse === 'de-A2' ? 'CEFR A2' : 'CEFR A1');
  const [scheduleTr, setScheduleTr] = useState('');
  const [focusTopicTr, setFocusTopicTr] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [formNotice, setFormNotice] = useState<string | null>(null);

  // Manual roster entry fields
  const [rosterName, setRosterName] = useState('');
  const [rosterNote, setRosterNote] = useState('');
  const [confirmDeleteClassId, setConfirmDeleteClassId] = useState<string | null>(null);

  const selectedClass = useMemo(() => {
    if (!progress.teachingClasses.length) return null;
    return (
      progress.teachingClasses.find((c) => c.id === selectedClassId) ??
      progress.teachingClasses[0]
    );
  }, [progress.teachingClasses, selectedClassId]);

  const classAssignments = useMemo(() => {
    if (!selectedClass) return [];
    return progress.teachingAssignments.filter((a) => a.classId === selectedClass.id);
  }, [progress.teachingAssignments, selectedClass]);

  const handleApplyTemplate = (presetId: string) => {
    const preset = ALL_CLASS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setFormCourseId(preset.courseId);
    setClassName(preset.name);
    setLevelLabel(preset.levelLabel);
    setScheduleTr(preset.scheduleTr);
    setFocusTopicTr(preset.focusTopicTr);
    setDescriptionTr(preset.descriptionTr);
    setShowCreateForm(true);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    const isA2Class = formCourseId === 'de-A2';
    const { id, xpAwarded } = createTeachingClass({
      courseId: formCourseId,
      name: className,
      levelLabel: levelLabel || (isA2Class ? 'CEFR A2' : 'CEFR A1'),
      scheduleTr: scheduleTr || (isA2Class ? 'Esnek A2 Programı' : 'Esnek A1 Programı'),
      focusTopicTr:
        focusTopicTr ||
        (isA2Class ? 'Almanca A2 Çekirdek Beceriler' : 'Almanca A1 Çekirdek Beceriler'),
      descriptionTr,
    });
    setSelectedClassId(id);
    setClassName('');
    setScheduleTr('');
    setFocusTopicTr('');
    setDescriptionTr('');
    setShowCreateForm(false);
    setFormNotice(
      xpAwarded > 0
        ? `Yerel ${isA2Class ? 'A2' : 'A1'} sınıf grubu oluşturuldu (+${xpAwarded} XP ilk sınıf kazanımı).`
        : `Yerel ${isA2Class ? 'A2' : 'A1'} sınıf grubu tarayıcıya kaydedildi.`
    );
    window.setTimeout(() => setFormNotice(null), 3200);
  };

  const handleAddRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !rosterName.trim()) return;
    addClassRosterEntry(selectedClass.id, rosterName, rosterNote);
    setRosterName('');
    setRosterNote('');
  };

  const handleDeleteClass = (classId: string) => {
    deleteTeachingClass(classId);
    setConfirmDeleteClassId(null);
    if (selectedClassId === classId) {
      const remaining = progress.teachingClasses.filter((c) => c.id !== classId);
      setSelectedClassId(remaining[0]?.id ?? null);
    }
  };

  const completedAssignmentCount = progress.teachingAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'reviewed'
  ).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <TeachingSubNav activeRoute="siniflarim" onNavigate={onNavigate} />

      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-[#282830]">
        <div>
          <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            Öğretim ve Yönetim · Almanca CEFR A1 &amp; A2 ·{' '}
            {rolePreview === 'teacher' ? 'Öğretmen Görünümü' : 'Öğrenci Görünümü'}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Sınıflarım
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{showCreateForm ? 'Formu Kapat' : 'Yeni A1 / A2 Sınıf Grubu'}</span>
        </button>
      </div>

      {formNotice && (
        <div
          role="status"
          className="rounded-xl border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
        >
          {formNotice}
        </div>
      )}

      {/* Honest Local-Only Scope Notice */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
          <div className="space-y-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
            <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Dürüst Kapsam Bildirimi: Yalnızca Yerel Tarayıcı Depolaması Aktiftir
            </p>
            <p className="leading-relaxed">
              Sınıf grupları ve manuel yoklama/katılımcı kayıtları yalnızca bu tarayıcıdaki yerel depolamada saklanır. Çok kullanıcılı öğretmen/öğrenci hesapları, davet koduyla canlı katılım ve cihazlar arası bulut eşitlemesi harici arka uç fazında eklenecektir; bu nedenle başka cihazlardan gelen sahte öğrenci verisi gösterilmez.
            </p>
          </div>
        </div>
      </div>

      {/* Real Browser Session Progress Snapshot (Linked Directly to tk_stage1_progress_v1 & tk_course_de_a2_progress_v1) */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div>
            <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
              Gerçek Yerel Oturum Metrikleri ·{' '}
              <span className="font-mono">
                {snapshotCourse === 'de-A2'
                  ? 'tk_course_de_a2_progress_v1'
                  : 'tk_stage1_progress_v1'}
              </span>
            </p>
            <h2 className="mt-0.5 font-display text-lg sm:text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Aktif Tarayıcı Kullanıcısı: {displayName || 'Misafir Kullanıcı'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="İlerleme özeti seviye seçici"
              className="inline-flex items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-1 dark:border-[#282830] dark:bg-[#111113]"
            >
              <button
                type="button"
                aria-pressed={snapshotCourse === 'de-A1'}
                onClick={() => setSnapshotCourse('de-A1')}
                className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  snapshotCourse === 'de-A1'
                    ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                Almanca A1
              </button>
              <button
                type="button"
                aria-pressed={snapshotCourse === 'de-A2'}
                onClick={() => setSnapshotCourse('de-A2')}
                className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  snapshotCourse === 'de-A2'
                    ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] dark:text-[#A1A1AA]'
                }`}
              >
                Almanca A2
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B] whitespace-nowrap"
            >
              <span>Tam İlerleme Raporu</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {snapshotCourse === 'de-A2' ? (
            <>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 XP</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {a2Progress.xp}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Kelime</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {uniqueA2CompletedWordIds.length}/{ALL_A2_WORDS.length}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Dinleme</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.listeningMasteredIds.length}/{TOTAL_A2_LISTENING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Okuma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.readingMasteredIds.length}/{TOTAL_A2_READING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Yazma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.writingMasteredIds.length}/{TOTAL_A2_WRITING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Konuşma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.speakingMasteredIds.length}/{TOTAL_A2_SPEAKING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Etkinlik</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.activityMasteredIds.length}/{TOTAL_A2_ACTIVITY_ITEMS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A2 Doğruluk</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2OverallAccuracyPercent === null ? '—' : `%${a2OverallAccuracyPercent}`}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 XP</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#7C1D2E] dark:text-[#D9A13B] tabular-nums">
                  {progress.xp}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Kelime</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {uniqueCompletedWordIds.length}/{ALL_A1_WORDS.length}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Dinleme</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.listeningMasteredIds.length}/{TOTAL_LISTENING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Okuma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.readingMasteredIds.length}/{TOTAL_READING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Yazma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.writingMasteredIds.length}/{TOTAL_WRITING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Konuşma</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.speakingMasteredIds.length}/{TOTAL_SPEAKING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Etkinlik</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.activityMasteredIds.length}/{TOTAL_ACTIVITY_ITEMS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">A1 Doğruluk</p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {overallAccuracyPercent === null ? '—' : `%${overallAccuracyPercent}`}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Create Local Class Form */}
      {showCreateForm && (
        <section className="rounded-xl border border-[#7C1D2E]/40 bg-[#FFFFFF] p-6 dark:border-[#D9A13B]/40 dark:bg-[#16161A]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Yeni Yerel A1 / A2 Sınıf Grubu Oluştur
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {ALL_CLASS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyTemplate(preset.id)}
                  className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 py-1.5 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
                >
                  Şablon: {preset.levelLabel}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateClass} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Kurs Seviyesi:
              </span>
              <div
                role="group"
                aria-label="Sınıf kurs seviyesi"
                className="inline-flex items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-1 dark:border-[#282830] dark:bg-[#111113]"
              >
                <button
                  type="button"
                  aria-pressed={formCourseId === 'de-A1'}
                  onClick={() => {
                    setFormCourseId('de-A1');
                    if (levelLabel.startsWith('CEFR A2')) setLevelLabel('CEFR A1');
                  }}
                  className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                    formCourseId === 'de-A1'
                      ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  Almanca A1
                </button>
                <button
                  type="button"
                  aria-pressed={formCourseId === 'de-A2'}
                  onClick={() => {
                    setFormCourseId('de-A2');
                    if (levelLabel.startsWith('CEFR A1')) setLevelLabel('CEFR A2');
                  }}
                  className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                    formCourseId === 'de-A2'
                      ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  Almanca A2
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="class-name"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Sınıf / Grup Adı *
              </label>
              <input
                id="class-name"
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={
                  formCourseId === 'de-A2'
                    ? 'Örn: Almanca A2 · Hafta İçi Akşam'
                    : 'Örn: Almanca A1 · Hafta İçi Akşam'
                }
                maxLength={80}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <label
                htmlFor="class-level"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Seviye Etiketi
              </label>
              <input
                id="class-level"
                type="text"
                value={levelLabel}
                onChange={(e) => setLevelLabel(e.target.value)}
                placeholder="CEFR A1.1"
                maxLength={24}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <label
                htmlFor="class-schedule"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Ders Programı / Zaman
              </label>
              <input
                id="class-schedule"
                type="text"
                value={scheduleTr}
                onChange={(e) => setScheduleTr(e.target.value)}
                placeholder="Örn: Pazartesi & Çarşamba · 18:30"
                maxLength={80}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <label
                htmlFor="class-focus"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Odak A1 Ünitesi / Hedef
              </label>
              <input
                id="class-focus"
                type="text"
                value={focusTopicTr}
                onChange={(e) => setFocusTopicTr(e.target.value)}
                placeholder="Örn: Selamlaşma, Aile ve Artikel"
                maxLength={100}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="class-desc"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                Sınıf Açıklaması / Ders Notu
              </label>
              <textarea
                id="class-desc"
                rows={2}
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                placeholder="Bu yerel sınıf grubunun çalışma amacı veya haftalık tekrar planı..."
                maxLength={240}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="h-10 rounded-lg border border-[#D9D9D3] px-4 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24]"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-[#7C1D2E] px-5 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                Sınıf Grubunu Kaydet
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Split: Local Class List & Active Class Details */}
      {progress.teachingClasses.length === 0 ? (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-8 text-center dark:border-[#282830] dark:bg-[#16161A]">
          <Users className="mx-auto h-8 w-8 text-[#7C1D2E] dark:text-[#D9A13B]" />
          <h2 className="mt-3 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Henüz kayıtlı yerel A1 / A2 sınıf grubunuz yok
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
            Sahte öğrenci listesi göstermiyoruz. Kendi yerel A1 veya A2 sınıf grubunuzu sıfırdan oluşturabilir ya da hazır A1/A2 şablonlarından birini yükleyerek ödev ve katılımcı notlarınızı düzenleyebilirsiniz.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-medium text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
            >
              <Plus className="h-4 w-4" />
              <span>İlk Sınıf Grubunu Oluştur</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate(CLASS_TEMPLATE_PRESETS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>A1.1 Şablonuyla Doldur</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate(A2_CLASS_TEMPLATE_PRESETS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>A2.1 Şablonuyla Doldur</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Class Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Yerel Sınıf Grupları
              </span>
              <span className="font-mono tabular-nums">{progress.teachingClasses.length} grup</span>
            </div>

            {progress.teachingClasses.map((cls) => {
              const isSelected = selectedClass?.id === cls.id;
              const linkedCount = progress.teachingAssignments.filter(
                (a) => a.classId === cls.id
              ).length;

              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? 'border-[#7C1D2E] bg-[#FFFFFF] dark:border-[#D9A13B] dark:bg-[#16161A]'
                      : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                      {cls.levelLabel}
                    </span>
                    <span className="font-mono tabular-nums">
                      {cls.roster.length} kayıt · {linkedCount} ödev
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {cls.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] truncate">
                    {cls.scheduleTr}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Class Workspace */}
          {selectedClass && (
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
                  <div>
                    <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                      {selectedClass.levelLabel} · {selectedClass.scheduleTr}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {selectedClass.name}
                    </h2>
                    <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      Odak: {selectedClass.focusTopicTr}
                    </p>
                    {selectedClass.descriptionTr && (
                      <p className="mt-2 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                        {selectedClass.descriptionTr}
                      </p>
                    )}
                  </div>

                  {confirmDeleteClassId === selectedClass.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteClassId(null)}
                        className="h-9 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]"
                      >
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClass(selectedClass.id)}
                        className="h-9 rounded-lg bg-[#B91C1C] px-3 text-xs font-medium text-white hover:bg-[#991B1B]"
                      >
                        Grubu Sil
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteClassId(selectedClass.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] hover:border-[#B91C1C]/40 hover:text-[#991B1B] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Sil</span>
                    </button>
                  )}
                </div>

                {/* Local Manual Roster */}
                <div className="mt-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                        Yerel Katılımcı / Yoklama Notları
                      </h3>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        Bu listedeki isimler öğretmen notu olarak yalnızca bu tarayıcıda tutulur; canlı öğrenci hesapları sonraki aşamada bağlanacaktır.
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {selectedClass.roster.length} manuel kayıt
                    </span>
                  </div>

                  <form
                    onSubmit={handleAddRoster}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
                  >
                    <input
                      type="text"
                      value={rosterName}
                      onChange={(e) => setRosterName(e.target.value)}
                      placeholder="Katılımcı adı (ör. Zeynep A.)"
                      maxLength={60}
                      className="sm:col-span-4 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                    <input
                      type="text"
                      value={rosterNote}
                      onChange={(e) => setRosterNote(e.target.value)}
                      placeholder="Kısa yerel not (ör. Artikel tekrarı önerildi)"
                      maxLength={120}
                      className="sm:col-span-5 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                    <button
                      type="submit"
                      disabled={!rosterName.trim()}
                      className="sm:col-span-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#111113] px-3 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113]"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Kayıt Ekle</span>
                    </button>
                  </form>

                  {selectedClass.roster.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#D9D9D3] p-4 text-xs text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]">
                      Bu gruba henüz manuel katılımcı notu eklenmedi. Yukarıdaki alandan ders yoklama veya öğrenci takip notu ekleyebilirsiniz.
                    </p>
                  ) : (
                    <ul className="divide-y divide-[#ECECE8] rounded-lg border border-[#ECECE8] dark:divide-[#24242C] dark:border-[#24242C]">
                      {selectedClass.roster.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate">
                              {entry.name}
                            </p>
                            <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                              {entry.noteTr || 'Yerel katılımcı kaydı'} · Senkronize hesap bağlı değil
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeClassRosterEntry(selectedClass.id, entry.id)}
                            aria-label={`${entry.name} kaydını sil`}
                            className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-md text-[#52525B] hover:bg-[#ECECE8] hover:text-[#991B1B] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24] dark:hover:text-[#FCA5A5] shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Assignments Linked to Selected Class */}
              <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      Bu Sınıfa Bağlı Ödevler
                    </h3>
                    <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      Genel ödev tamamlama: {completedAssignmentCount}/{progress.teachingAssignments.length}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('odevler')}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                  >
                    <ClipboardList className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                    <span>Ödevler Ekranına Git</span>
                  </button>
                </div>

                {classAssignments.length === 0 ? (
                  <p className="mt-4 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    Henüz doğrudan bu sınıfa bağlanmış bir ödev yok. Ödevler sekmesinden yeni ödev oluştururken bu sınıf grubunu seçebilirsiniz.
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-[#ECECE8] dark:divide-[#24242C]">
                    {classAssignments.map((assignment) => (
                      <li
                        key={assignment.id}
                        className="flex items-center justify-between gap-3 py-3 text-xs sm:text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-[#111113] dark:text-[#F4F4F5] truncate">
                            {assignment.titleTr}
                          </p>
                          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                            {assignment.targetLabelTr}
                            {assignment.dueDateLabel ? ` · ${assignment.dueDateLabel}` : ''}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-medium text-[#7C1D2E] dark:text-[#D9A13B] shrink-0">
                          {assignment.status === 'reviewed'
                            ? 'İncelendi'
                            : assignment.status === 'completed'
                            ? 'Tamamlandı'
                            : 'Atandı'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
