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
import { useI18n } from '../../hooks/useI18n';
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
  const { locale, tx } = useI18n();

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
    const levelShort = isA2Class ? 'A2' : 'A1';
    const { id, xpAwarded } = createTeachingClass({
      courseId: formCourseId,
      name: className,
      levelLabel: levelLabel || (isA2Class ? 'CEFR A2' : 'CEFR A1'),
      scheduleTr:
        scheduleTr ||
        tx(
          { tr: 'Esnek {{level}} Programı', en: 'Flexible {{level}} Schedule' },
          { level: levelShort }
        ),
      focusTopicTr:
        focusTopicTr ||
        tx(
          {
            tr: 'Almanca {{level}} Çekirdek Beceriler',
            en: 'German {{level}} Core Skills',
          },
          { level: levelShort }
        ),
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
        ? tx(
            {
              tr: 'Yerel {{level}} sınıf grubu oluşturuldu (+{{xp}} XP ilk sınıf kazanımı).',
              en: 'Local {{level}} class group created (+{{xp}} XP first-class bonus).',
            },
            { level: levelShort, xp: xpAwarded }
          )
        : tx(
            {
              tr: 'Yerel {{level}} sınıf grubu tarayıcıya kaydedildi.',
              en: 'Local {{level}} class group saved to browser.',
            },
            { level: levelShort }
          )
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
            {tx({
              tr: 'Öğretim ve Yönetim · Almanca CEFR A1 & A2',
              en: 'Teaching & Management · German CEFR A1 & A2',
            })}{' '}
            ·{' '}
            {rolePreview === 'teacher'
              ? tx({ tr: 'Öğretmen Görünümü', en: 'Teacher View' })
              : tx({ tr: 'Öğrenci Görünümü', en: 'Student View' })}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {tx({ tr: 'Sınıflarım', en: 'My Classes' })}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>
            {showCreateForm
              ? tx({ tr: 'Formu Kapat', en: 'Close Form' })
              : tx({ tr: 'Yeni A1 / A2 Sınıf Grubu', en: 'New A1 / A2 Class Group' })}
          </span>
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
              {tx({
                tr: 'Dürüst Kapsam Bildirimi: Yalnızca Yerel Tarayıcı Depolaması Aktiftir',
                en: 'Scope Notice: Local Browser Storage Only',
              })}
            </p>
            <p className="leading-relaxed">
              {tx({
                tr: 'Sınıf grupları ve manuel yoklama/katılımcı kayıtları yalnızca bu tarayıcıdaki yerel depolamada saklanır. Çok kullanıcılı öğretmen/öğrenci hesapları, davet koduyla canlı katılım ve cihazlar arası bulut eşitlemesi harici arka uç fazında eklenecektir; bu nedenle başka cihazlardan gelen sahte öğrenci verisi gösterilmez.',
                en: 'Class groups and manual roster/attendance notes are stored only in this browser’s local storage. Multi-user teacher/student accounts, live invite-code joining, and cross-device cloud sync will be added in a future backend phase; no mock student data from other devices is shown.',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Real Browser Session Progress Snapshot (Linked Directly to tk_stage1_progress_v1 & tk_course_de_a2_progress_v1) */}
      <section className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div>
            <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
              {tx({ tr: 'Gerçek Yerel Oturum Metrikleri', en: 'Live Local Session Metrics' })} ·{' '}
              <span className="font-mono">
                {snapshotCourse === 'de-A2'
                  ? 'tk_course_de_a2_progress_v1'
                  : 'tk_stage1_progress_v1'}
              </span>
            </p>
            <h2 className="mt-0.5 font-display text-lg sm:text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx(
                { tr: 'Aktif Tarayıcı Kullanıcısı: {{name}}', en: 'Active Browser User: {{name}}' },
                { name: displayName || locale.roles.guestUser }
              )}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label={tx({
                tr: 'İlerleme özeti seviye seçici',
                en: 'Progress snapshot level selector',
              })}
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
                {locale.course.a1Label}
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
                {locale.course.a2Label}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('ogrenme-yolum')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7C1D2E] hover:underline dark:text-[#D9A13B] whitespace-nowrap"
            >
              <span>{tx({ tr: 'Tam İlerleme Raporu', en: 'Full Progress Report' })}</span>
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
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Kelime', en: 'A2 Vocab' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {uniqueA2CompletedWordIds.length}/{ALL_A2_WORDS.length}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Dinleme', en: 'A2 Listening' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.listeningMasteredIds.length}/{TOTAL_A2_LISTENING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Okuma', en: 'A2 Reading' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.readingMasteredIds.length}/{TOTAL_A2_READING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Yazma', en: 'A2 Writing' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.writingMasteredIds.length}/{TOTAL_A2_WRITING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Konuşma', en: 'A2 Speaking' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.speakingMasteredIds.length}/{TOTAL_A2_SPEAKING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Etkinlik', en: 'A2 Activities' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2Progress.activityMasteredIds.length}/{TOTAL_A2_ACTIVITY_ITEMS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A2 Doğruluk', en: 'A2 Accuracy' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {a2OverallAccuracyPercent === null
                    ? '—'
                    : tx({ tr: '%{{pct}}', en: '{{pct}}%' }, { pct: a2OverallAccuracyPercent })}
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
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Kelime', en: 'A1 Vocab' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {uniqueCompletedWordIds.length}/{ALL_A1_WORDS.length}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Dinleme', en: 'A1 Listening' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.listeningMasteredIds.length}/{TOTAL_LISTENING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Okuma', en: 'A1 Reading' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.readingMasteredIds.length}/{TOTAL_READING_EXERCISES}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Yazma', en: 'A1 Writing' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.writingMasteredIds.length}/{TOTAL_WRITING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Konuşma', en: 'A1 Speaking' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.speakingMasteredIds.length}/{TOTAL_SPEAKING_TASKS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Etkinlik', en: 'A1 Activities' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {progress.activityMasteredIds.length}/{TOTAL_ACTIVITY_ITEMS}
                </p>
              </div>
              <div className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]">
                <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'A1 Doğruluk', en: 'A1 Accuracy' })}
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                  {overallAccuracyPercent === null
                    ? '—'
                    : tx({ tr: '%{{pct}}', en: '{{pct}}%' }, { pct: overallAccuracyPercent })}
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
              {tx({
                tr: 'Yeni Yerel A1 / A2 Sınıf Grubu Oluştur',
                en: 'Create New Local A1 / A2 Class Group',
              })}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {ALL_CLASS_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyTemplate(preset.id)}
                  className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 py-1.5 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
                >
                  {tx({ tr: 'Şablon: {{label}}', en: 'Template: {{label}}' }, { label: preset.levelLabel })}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateClass} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({ tr: 'Kurs Seviyesi:', en: 'Course Level:' })}
              </span>
              <div
                role="group"
                aria-label={tx({ tr: 'Sınıf kurs seviyesi', en: 'Class course level' })}
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
                  {locale.course.a1Label}
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
                  {locale.course.a2Label}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="class-name"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                {tx({ tr: 'Sınıf / Grup Adı *', en: 'Class / Group Name *' })}
              </label>
              <input
                id="class-name"
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={
                  formCourseId === 'de-A2'
                    ? tx({
                        tr: 'Örn: Almanca A2 · Hafta İçi Akşam',
                        en: 'e.g. German A2 · Weekday Evening',
                      })
                    : tx({
                        tr: 'Örn: Almanca A1 · Hafta İçi Akşam',
                        en: 'e.g. German A1 · Weekday Evening',
                      })
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
                {tx({ tr: 'Seviye Etiketi', en: 'Level Label' })}
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
                {tx({ tr: 'Ders Programı / Zaman', en: 'Schedule / Time' })}
              </label>
              <input
                id="class-schedule"
                type="text"
                value={scheduleTr}
                onChange={(e) => setScheduleTr(e.target.value)}
                placeholder={tx({
                  tr: 'Örn: Pazartesi & Çarşamba · 18:30',
                  en: 'e.g. Monday & Wednesday · 18:30',
                })}
                maxLength={80}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div>
              <label
                htmlFor="class-focus"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                {tx({ tr: 'Odak Ünite / Hedef', en: 'Focus Unit / Goal' })}
              </label>
              <input
                id="class-focus"
                type="text"
                value={focusTopicTr}
                onChange={(e) => setFocusTopicTr(e.target.value)}
                placeholder={tx({
                  tr: 'Örn: Selamlaşma, Aile ve Artikel',
                  en: 'e.g. Greetings, Family & Articles',
                })}
                maxLength={100}
                className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="class-desc"
                className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
              >
                {tx({ tr: 'Sınıf Açıklaması / Ders Notu', en: 'Class Description / Lesson Notes' })}
              </label>
              <textarea
                id="class-desc"
                rows={2}
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                placeholder={tx({
                  tr: 'Bu yerel sınıf grubunun çalışma amacı veya haftalık tekrar planı...',
                  en: 'Study goal or weekly review plan for this local class group...',
                })}
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
                {locale.common.cancel}
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-[#7C1D2E] px-5 text-xs font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
              >
                {tx({ tr: 'Sınıf Grubunu Kaydet', en: 'Save Class Group' })}
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
            {tx({
              tr: 'Henüz kayıtlı yerel A1 / A2 sınıf grubunuz yok',
              en: 'No local A1 / A2 class groups saved yet',
            })}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#52525B] dark:text-[#A1A1AA]">
            {tx({
              tr: 'Sahte öğrenci listesi göstermiyoruz. Kendi yerel A1 veya A2 sınıf grubunuzu sıfırdan oluşturabilir ya da hazır A1/A2 şablonlarından birini yükleyerek ödev ve katılımcı notlarınızı düzenleyebilirsiniz.',
              en: 'We never show mock student rosters. Create your own local A1 or A2 class group from scratch, or load a starter A1/A2 template to organize assignments and roster notes.',
            })}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-medium text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
            >
              <Plus className="h-4 w-4" />
              <span>{tx({ tr: 'İlk Sınıf Grubunu Oluştur', en: 'Create First Class Group' })}</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate(CLASS_TEMPLATE_PRESETS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'A1.1 Şablonuyla Doldur', en: 'Prefill A1.1 Template' })}</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate(A2_CLASS_TEMPLATE_PRESETS[0].id)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
            >
              <span>{tx({ tr: 'A2.1 Şablonuyla Doldur', en: 'Prefill A2.1 Template' })}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Class Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({ tr: 'Yerel Sınıf Grupları', en: 'Local Class Groups' })}
              </span>
              <span className="font-mono tabular-nums">
                {tx(
                  { tr: '{{count}} grup', en: '{{count}} groups' },
                  { count: progress.teachingClasses.length }
                )}
              </span>
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
                      {tx(
                        {
                          tr: '{{roster}} kayıt · {{assignments}} ödev',
                          en: '{{roster}} entries · {{assignments}} tasks',
                        },
                        { roster: cls.roster.length, assignments: linkedCount }
                      )}
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
                      {tx({ tr: 'Odak:', en: 'Focus:' })} {selectedClass.focusTopicTr}
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
                        {locale.common.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClass(selectedClass.id)}
                        className="h-9 rounded-lg bg-[#B91C1C] px-3 text-xs font-medium text-white hover:bg-[#991B1B]"
                      >
                        {tx({ tr: 'Grubu Sil', en: 'Delete Group' })}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteClassId(selectedClass.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] hover:border-[#B91C1C]/40 hover:text-[#991B1B] dark:border-[#282830] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{locale.common.delete}</span>
                    </button>
                  )}
                </div>

                {/* Local Manual Roster */}
                <div className="mt-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                        {tx({
                          tr: 'Yerel Katılımcı / Yoklama Notları',
                          en: 'Local Roster / Attendance Notes',
                        })}
                      </h3>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                        {tx({
                          tr: 'Bu listedeki isimler öğretmen notu olarak yalnızca bu tarayıcıda tutulur; canlı öğrenci hesapları sonraki aşamada bağlanacaktır.',
                          en: 'Names in this list are stored locally in this browser as teacher notes; live student accounts will be linked in a future phase.',
                        })}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                      {tx(
                        { tr: '{{count}} manuel kayıt', en: '{{count}} manual entries' },
                        { count: selectedClass.roster.length }
                      )}
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
                      placeholder={tx({
                        tr: 'Katılımcı adı (ör. Zeynep A.)',
                        en: 'Participant name (e.g. Alex M.)',
                      })}
                      maxLength={60}
                      className="sm:col-span-4 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                    <input
                      type="text"
                      value={rosterNote}
                      onChange={(e) => setRosterNote(e.target.value)}
                      placeholder={tx({
                        tr: 'Kısa yerel not (ör. Artikel tekrarı önerildi)',
                        en: 'Short local note (e.g. Review articles)',
                      })}
                      maxLength={120}
                      className="sm:col-span-5 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                    <button
                      type="submit"
                      disabled={!rosterName.trim()}
                      className="sm:col-span-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#111113] px-3 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113]"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>{tx({ tr: 'Kayıt Ekle', en: 'Add Entry' })}</span>
                    </button>
                  </form>

                  {selectedClass.roster.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#D9D9D3] p-4 text-xs text-[#52525B] dark:border-[#282830] dark:text-[#A1A1AA]">
                      {tx({
                        tr: 'Bu gruba henüz manuel katılımcı notu eklenmedi. Yukarıdaki alandan ders yoklama veya öğrenci takip notu ekleyebilirsiniz.',
                        en: 'No manual participant notes added to this group yet. Use the fields above to log attendance or student follow-up notes.',
                      })}
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
                              {entry.noteTr ||
                                tx({ tr: 'Yerel katılımcı kaydı', en: 'Local roster entry' })}{' '}
                              ·{' '}
                              {tx({
                                tr: 'Senkronize hesap bağlı değil',
                                en: 'No synced account linked',
                              })}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeClassRosterEntry(selectedClass.id, entry.id)}
                            aria-label={tx(
                              { tr: '{{name}} kaydını sil', en: 'Delete entry for {{name}}' },
                              { name: entry.name }
                            )}
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
                      {tx({ tr: 'Bu Sınıfa Bağlı Ödevler', en: 'Assignments Linked to This Class' })}
                    </h3>
                    <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {tx(
                        {
                          tr: 'Genel ödev tamamlama: {{done}}/{{total}}',
                          en: 'Overall assignment completion: {{done}}/{{total}}',
                        },
                        { done: completedAssignmentCount, total: progress.teachingAssignments.length }
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('odevler')}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                  >
                    <ClipboardList className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
                    <span>{tx({ tr: 'Ödevler Ekranına Git', en: 'Go to Assignments' })}</span>
                  </button>
                </div>

                {classAssignments.length === 0 ? (
                  <p className="mt-4 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({
                      tr: 'Henüz doğrudan bu sınıfa bağlanmış bir ödev yok. Ödevler sekmesinden yeni ödev oluştururken bu sınıf grubunu seçebilirsiniz.',
                      en: 'No assignments are linked directly to this class yet. Select this class group when creating an assignment in the Assignments tab.',
                    })}
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
                            ? tx({ tr: 'İncelendi', en: 'Reviewed' })
                            : assignment.status === 'completed'
                            ? locale.common.completed
                            : tx({ tr: 'Atandı', en: 'Assigned' })}
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
