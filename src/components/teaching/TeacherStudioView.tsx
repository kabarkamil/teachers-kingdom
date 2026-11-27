import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckSquare,
  ClipboardPlus,
  Copy,
  FileText,
  Info,
  Plus,
  Printer,
  Square,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import {
  CURRICULUM_PREVIEW_ITEMS,
  STUDIO_AUDIO_PRESETS,
  STUDIO_DRAFT_TEMPLATES,
  TEACHING_MODULE_CATALOG,
  formatStudioDraftAsPlainText,
  getModuleShortLabelTr,
} from '../../data/germanA1Teaching';
import {
  A2_CURRICULUM_PREVIEW_ITEMS,
  A2_STUDIO_AUDIO_PRESETS,
  A2_STUDIO_DRAFT_TEMPLATES,
  TEACHING_A2_MODULE_CATALOG,
} from '../../data/germanA2Teaching';
import type {
  ActiveCourseId,
  NavRouteId,
  SpeakerGender,
  StudioDraft,
  StudioDraftKind,
  TeachingAssignmentModule,
} from '../../types';
import {
  getGermanVoiceInfo,
  resolveDialogueSpeakerVoices,
  stopGermanSpeech,
} from '../../utils/speech';
import { ModelAudioBar } from '../speaking/ModelAudioBar';
import { TeachingSubNav } from './TeachingSubNav';

interface TeacherStudioViewProps {
  onNavigate: (route: NavRouteId) => void;
  onLaunchTarget: (
    moduleRoute: TeachingAssignmentModule,
    targetId?: string,
    courseId?: ActiveCourseId
  ) => void;
}

type StudioTab = 'preview' | 'builder' | 'audio';

const GERMAN_SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

const DRAFT_KIND_LABELS: Record<StudioDraftKind, string> = {
  lesson: 'Ders Planı',
  quiz: 'Kısa Quiz Taslağı',
  homework: 'Ödev Kontrol Listesi',
};

const ALL_DRAFT_TEMPLATES = [
  ...STUDIO_DRAFT_TEMPLATES.map((t) => ({ ...t, courseId: 'de-A1' as ActiveCourseId })),
  ...A2_STUDIO_DRAFT_TEMPLATES,
];

export const TeacherStudioView: React.FC<TeacherStudioViewProps> = ({
  onNavigate,
  onLaunchTarget,
}) => {
  const {
    activeCourse,
    progress,
    saveStudioDraft,
    deleteStudioDraft,
    toggleStudioDraftItem,
    createTeachingAssignment,
  } = useAppState();

  const [studioCourse, setStudioCourse] = useState<ActiveCourseId>(activeCourse);
  const [activeTab, setActiveTab] = useState<StudioTab>('preview');
  const [studioNotice, setStudioNotice] = useState<string | null>(null);

  // Tab 1: Curriculum Previewer state
  const [previewModuleFilter, setPreviewModuleFilter] = useState<string>('all');
  const [selectedPreviewId, setSelectedPreviewId] = useState<string>(() =>
    activeCourse === 'de-A2'
      ? A2_CURRICULUM_PREVIEW_ITEMS[0].id
      : CURRICULUM_PREVIEW_ITEMS[0].id
  );

  // Tab 2: Lesson / Quiz / Homework Checklist Builder state
  const [editingDraftId, setEditingDraftId] = useState<string | undefined>(undefined);
  const [draftCourseId, setDraftCourseId] = useState<ActiveCourseId>(activeCourse);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftKind, setDraftKind] = useState<StudioDraftKind>('lesson');
  const [draftModuleFocus, setDraftModuleFocus] = useState<TeachingAssignmentModule>('kelime');
  const [draftDuration, setDraftDuration] = useState<number>(45);
  const [draftNotes, setDraftNotes] = useState('');
  const [draftItems, setDraftItems] = useState<
    Array<{ id: string; textTr: string; sampleDe?: string; checked: boolean }>
  >([]);
  const [newItemTextTr, setNewItemTextTr] = useState('');
  const [newItemSampleDe, setNewItemSampleDe] = useState('');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const [copyFallbackText, setCopyFallbackText] = useState<string | null>(null);
  const [printPreviewDraft, setPrintPreviewDraft] = useState<StudioDraft | null>(null);

  // Tab 3: de-DE Model Audio Lab state
  const [audioTextDe, setAudioTextDe] = useState(() =>
    activeCourse === 'de-A2' ? A2_STUDIO_AUDIO_PRESETS[0].textDe : STUDIO_AUDIO_PRESETS[0].textDe
  );
  const [audioGender, setAudioGender] = useState<SpeakerGender>('female');
  const [voiceTick, setVoiceTick] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const handleVoicesChanged = () => setVoiceTick((t) => t + 1);
    window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged);
      stopGermanSpeech();
    };
  }, []);

  const voicePlan = useMemo(() => {
    void voiceTick;
    return resolveDialogueSpeakerVoices();
  }, [voiceTick]);

  const voiceInfo = useMemo(() => {
    void voiceTick;
    return getGermanVoiceInfo();
  }, [voiceTick]);

  const activePreviewSource =
    studioCourse === 'de-A2' ? A2_CURRICULUM_PREVIEW_ITEMS : CURRICULUM_PREVIEW_ITEMS;

  const activeAudioPresets =
    studioCourse === 'de-A2' ? A2_STUDIO_AUDIO_PRESETS : STUDIO_AUDIO_PRESETS;

  const filteredPreviewItems = useMemo(() => {
    if (previewModuleFilter === 'all') return activePreviewSource;
    return activePreviewSource.filter((item) => item.moduleRoute === previewModuleFilter);
  }, [activePreviewSource, previewModuleFilter]);

  const activePreviewItem = useMemo(() => {
    return (
      filteredPreviewItems.find((item) => item.id === selectedPreviewId) ??
      filteredPreviewItems[0] ??
      activePreviewSource[0]
    );
  }, [filteredPreviewItems, selectedPreviewId, activePreviewSource]);

  const handleStudioCourseChange = (nextCourse: ActiveCourseId) => {
    setStudioCourse(nextCourse);
    setDraftCourseId(nextCourse);
    const nextPreviewList =
      nextCourse === 'de-A2' ? A2_CURRICULUM_PREVIEW_ITEMS : CURRICULUM_PREVIEW_ITEMS;
    setPreviewModuleFilter('all');
    setSelectedPreviewId(nextPreviewList[0].id);
    const nextPresets =
      nextCourse === 'de-A2' ? A2_STUDIO_AUDIO_PRESETS : STUDIO_AUDIO_PRESETS;
    setAudioTextDe(nextPresets[0].textDe);
  };

  const showNotice = (message: string) => {
    setStudioNotice(message);
    window.setTimeout(() => setStudioNotice(null), 3200);
  };

  // Tab 1 actions
  const handleAssignFromPreview = () => {
    const item = activePreviewItem;
    const { xpAwarded } = createTeachingAssignment({
      courseId: studioCourse,
      titleTr: `${item.moduleLabelTr}: ${item.titleTr}`,
      moduleRoute: item.moduleRoute,
      targetId: item.targetId,
      targetLabelTr: item.titleTr,
      dueDateLabel: `${studioCourse === 'de-A2' ? 'A2' : 'A1'} Stüdyodan Atandı`,
      instructionsTr: item.teachingTipTr,
    });
    showNotice(
      xpAwarded > 0
        ? `"${item.titleTr}" Ödevler listesine eklendi (+${xpAwarded} XP).`
        : `"${item.titleTr}" Ödevler listesine eklendi.`
    );
  };

  const handleAppendPreviewToBuilder = () => {
    const item = activePreviewItem;
    setDraftCourseId(studioCourse);
    setDraftItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        textTr: `${item.moduleLabelTr} · ${item.titleTr}`,
        sampleDe: item.germanHeadlineDe,
        checked: false,
      },
    ]);
    if (!draftTitle.trim()) {
      setDraftTitle(`${studioCourse === 'de-A2' ? 'A2' : 'A1'} ${item.titleTr} Ders Akışı`);
      setDraftModuleFocus(item.moduleRoute);
    }
    setActiveTab('builder');
    showNotice('Müfredat öğesi Taslak Oluşturucu adımlarına eklendi.');
  };

  // Tab 2 actions
  const handleLoadTemplate = (templateId: string) => {
    const tpl = ALL_DRAFT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setEditingDraftId(undefined);
    setDraftCourseId(tpl.courseId);
    setDraftTitle(tpl.titleTr);
    setDraftKind(tpl.kind);
    setDraftModuleFocus(tpl.moduleFocus);
    setDraftDuration(tpl.durationMinutes);
    setDraftNotes(tpl.notesTr);
    setDraftItems(
      tpl.items.map((it, idx) => ({
        id: `tpl-item-${Date.now()}-${idx}`,
        textTr: it.textTr,
        sampleDe: it.sampleDe,
        checked: false,
      }))
    );
    showNotice(`"${tpl.titleTr}" şablonu düzenleyiciye yüklendi.`);
  };

  const handleLoadSavedDraftForEdit = (draft: StudioDraft) => {
    setEditingDraftId(draft.id);
    setDraftCourseId(draft.courseId === 'de-A2' ? 'de-A2' : 'de-A1');
    setDraftTitle(draft.titleTr);
    setDraftKind(draft.kind);
    setDraftModuleFocus(draft.moduleFocus);
    setDraftDuration(draft.durationMinutes);
    setDraftNotes(draft.notesTr);
    setDraftItems(draft.items.map((it) => ({ ...it })));
    showNotice(`"${draft.titleTr}" düzenlenmek üzere açıldı.`);
  };

  const handleResetDraftEditor = () => {
    setEditingDraftId(undefined);
    setDraftCourseId(studioCourse);
    setDraftTitle('');
    setDraftKind('lesson');
    setDraftModuleFocus('kelime');
    setDraftDuration(45);
    setDraftNotes('');
    setDraftItems([]);
  };

  const handleAddDraftStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTextTr.trim()) return;
    setDraftItems((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        textTr: newItemTextTr.trim(),
        sampleDe: newItemSampleDe.trim() || undefined,
        checked: false,
      },
    ]);
    setNewItemTextTr('');
    setNewItemSampleDe('');
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    const { id, xpAwarded } = saveStudioDraft({
      id: editingDraftId,
      courseId: draftCourseId,
      titleTr: draftTitle,
      kind: draftKind,
      moduleFocus: draftModuleFocus,
      durationMinutes: draftDuration,
      notesTr: draftNotes,
      items: draftItems,
    });
    setEditingDraftId(id);
    showNotice(
      xpAwarded > 0
        ? `Taslak yerel tarayıcıya kaydedildi (+${xpAwarded} XP ilk stüdyo taslağı kazanımı).`
        : 'Taslak yerel tarayıcıya kaydedildi.'
    );
  };

  const handleCopyDraft = async (draft: StudioDraft) => {
    const plainText = formatStudioDraftAsPlainText(draft);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(plainText);
        setCopiedDraftId(draft.id);
        setCopyFallbackText(null);
        window.setTimeout(() => setCopiedDraftId(null), 2000);
        return;
      }
    } catch {
      // Fallback below
    }
    setCopyFallbackText(plainText);
    showNotice('Tarayıcı pano erişimini kısıtladı; metni aşağıdaki kutudan manuel kopyalayabilirsiniz.');
  };

  const handleConvertDraftToAssignment = (draft: StudioDraft) => {
    const targetCourse: ActiveCourseId = draft.courseId === 'de-A2' ? 'de-A2' : 'de-A1';
    const catalog =
      targetCourse === 'de-A2' ? TEACHING_A2_MODULE_CATALOG : TEACHING_MODULE_CATALOG;
    const modConfig = catalog.find((m) => m.route === draft.moduleFocus) ?? catalog[0];
    const target = modConfig.targets[0];
    const summarySteps = draft.items
      .slice(0, 3)
      .map((i) => i.textTr)
      .join(' · ');

    createTeachingAssignment({
      courseId: targetCourse,
      titleTr: draft.titleTr,
      moduleRoute: draft.moduleFocus,
      targetId: target?.id,
      targetLabelTr: target?.labelTr ?? modConfig.labelTr,
      dueDateLabel: `${draft.durationMinutes} dk · Stüdyo Taslağı`,
      instructionsTr: summarySteps || draft.notesTr || 'Öğretmen Stüdyosu kontrol listesi görevi.',
    });
    showNotice(`"${draft.titleTr}" Ödevler modülüne aktarıldı.`);
  };

  const handleInsertGermanChar = (ch: string) => {
    setAudioTextDe((prev) => `${prev}${ch}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <div className="print:hidden space-y-8">
        <TeachingSubNav activeRoute="ogretmen-studyosu" onNavigate={onNavigate} />

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#D9D9D3] pb-6 lg:flex-row lg:items-end lg:justify-between dark:border-[#282830]">
          <div>
            <p className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              Öğretim ve Yönetim · Öğren. Öğret. Üret. · Almanca CEFR A1 &amp; A2
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              Öğretmen Stüdyosu
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Level Switcher */}
            <div
              role="group"
              aria-label="Stüdyo seviye seçici"
              className="inline-flex items-center gap-1 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <button
                type="button"
                aria-pressed={studioCourse === 'de-A1'}
                onClick={() => handleStudioCourseChange('de-A1')}
                className={`h-9 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  studioCourse === 'de-A1'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA]'
                }`}
              >
                CEFR A1
              </button>
              <button
                type="button"
                aria-pressed={studioCourse === 'de-A2'}
                onClick={() => handleStudioCourseChange('de-A2')}
                className={`h-9 rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  studioCourse === 'de-A2'
                    ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA]'
                }`}
              >
                CEFR A2
              </button>
            </div>

            {/* 3 Workspace Tabs */}
            <div
              role="tablist"
              aria-label="Öğretmen Stüdyosu araçları"
              className="flex flex-wrap items-center gap-1 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-1 dark:border-[#282830] dark:bg-[#16161A]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'preview'}
                onClick={() => setActiveTab('preview')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'preview'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{studioCourse === 'de-A2' ? 'A2 Önizleme' : 'A1 Önizleme'}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'builder'}
                onClick={() => setActiveTab('builder')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'builder'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Taslak Oluşturucu</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'audio'}
                onClick={() => setActiveTab('audio')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'audio'
                    ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>de-DE Ses Testi</span>
              </button>
            </div>
          </div>
        </div>

        {studioNotice && (
          <div
            role="status"
            className="rounded-xl border border-[#15803D]/35 bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#166534] dark:border-[#4ADE80]/30 dark:bg-[#0D2315] dark:text-[#86EFAC]"
          >
            {studioNotice}
          </div>
        )}

        {/* TAB 1: CURRICULUM & CLASSROOM BOARD PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: 'all',
                  label: studioCourse === 'de-A2' ? 'Tüm A2 Modülleri' : 'Tüm A1 Modülleri',
                },
                { id: 'kelime', label: 'Kelime' },
                { id: 'dinleme', label: 'Dinleme' },
                { id: 'okuma', label: 'Okuma' },
                { id: 'yazma', label: 'Yazma' },
                { id: 'konusma', label: 'Konuşma' },
                { id: 'karaoke', label: 'Karaoke' },
                { id: 'sessiz-sinema', label: 'Sessiz Sinema' },
                { id: 'quiz-merkezi', label: 'Quiz' },
                ...(studioCourse === 'de-A2' ? [{ id: 'sinav-modu', label: 'A2 Sınav' }] : []),
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPreviewModuleFilter(f.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    previewModuleFilter === f.id
                      ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Selector List */}
              <div className="lg:col-span-5 space-y-2 max-h-[540px] overflow-y-auto pr-1">
                {filteredPreviewItems.map((item) => {
                  const isActive = activePreviewItem.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPreviewId(item.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        isActive
                          ? 'border-[#7C1D2E] bg-[#FFFFFF] dark:border-[#D9A13B] dark:bg-[#16161A]'
                          : 'border-[#D9D9D3] bg-[#FFFFFF] hover:border-[#111113]/40 dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#52525B]'
                      }`}
                    >
                      <p className="text-[11px] font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                        {item.moduleLabelTr}
                      </p>
                      <h3 className="mt-1 font-display text-sm sm:text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                        {item.titleTr}
                      </h3>
                      <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-1">
                        {item.germanHeadlineDe}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right High-Contrast Classroom Presentation Card */}
              <div className="lg:col-span-7 rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 dark:border-[#282830] dark:bg-[#16161A]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
                  <div>
                    <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                      Tahta &amp; Ekran Paylaşımı Önizlemesi · {activePreviewItem.moduleLabelTr}
                    </p>
                    <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {activePreviewItem.titleTr}
                    </h2>
                  </div>
                </div>

                {/* German Showcase Prompt */}
                <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-5 space-y-3 dark:border-[#24242C] dark:bg-[#111113]">
                  <p className="font-display text-lg sm:text-xl font-semibold leading-snug text-[#111113] dark:text-[#F4F4F5]">
                    {activePreviewItem.germanHeadlineDe}
                  </p>
                  <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                    {activePreviewItem.turkishMeaningTr}
                  </p>
                  <div className="pt-2">
                    <ModelAudioBar
                      textDe={activePreviewItem.germanHeadlineDe}
                      labelTr="Sınıfa Dinlet (de-DE)"
                    />
                  </div>
                </div>

                {/* Pedagogical Tip */}
                <div className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    Ders Uygulama Notu:{' '}
                  </strong>
                  {activePreviewItem.teachingTipTr}
                </div>

                {/* Direct Actions */}
                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
                  <button
                    type="button"
                    onClick={() =>
                      onLaunchTarget(
                        activePreviewItem.moduleRoute,
                        activePreviewItem.targetId,
                        studioCourse
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-4 text-xs sm:text-sm font-medium text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] whitespace-nowrap"
                  >
                    <span>
                      {studioCourse === 'de-A2' ? 'Canlı A2 Modülünde Aç' : 'Canlı A1 Modülünde Aç'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAssignFromPreview}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] whitespace-nowrap"
                  >
                    <ClipboardPlus className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                    <span>Ödev Olarak Ata</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAppendPreviewToBuilder}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B]" />
                    <span>Taslağa Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LESSON / QUIZ / HOMEWORK CHECKLIST BUILDER */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Panel */}
            <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
                <div>
                  <h2 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {editingDraftId ? 'Taslağı Düzenle' : 'Yeni A1 / A2 Ders & Ödev Kontrol Listesi'}
                  </h2>
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    Yerel tarayıcıya kaydedilir, panoya kopyalanabilir veya yazdırılabilir.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ALL_DRAFT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleLoadTemplate(tpl.id)}
                      className="rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-2.5 py-1.5 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] whitespace-nowrap"
                    >
                      {tpl.courseId === 'de-A2' ? 'A2' : 'A1'} · {DRAFT_KIND_LABELS[tpl.kind]}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveDraft} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      Taslak Seviyesi:
                    </span>
                    <div
                      role="group"
                      aria-label="Taslak CEFR seviyesi"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-1 dark:border-[#282830] dark:bg-[#111113]"
                    >
                      <button
                        type="button"
                        aria-pressed={draftCourseId === 'de-A1'}
                        onClick={() => setDraftCourseId('de-A1')}
                        className={`h-7 rounded-md px-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                          draftCourseId === 'de-A1'
                            ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                            : 'text-[#52525B] dark:text-[#A1A1AA]'
                        }`}
                      >
                        CEFR A1
                      </button>
                      <button
                        type="button"
                        aria-pressed={draftCourseId === 'de-A2'}
                        onClick={() => setDraftCourseId('de-A2')}
                        className={`h-7 rounded-md px-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                          draftCourseId === 'de-A2'
                            ? 'bg-[#7C1D2E] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                            : 'text-[#52525B] dark:text-[#A1A1AA]'
                        }`}
                      >
                        CEFR A2
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="draft-title"
                      className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                    >
                      Taslak Başlığı *
                    </label>
                    <input
                      id="draft-title"
                      type="text"
                      required
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder={
                        draftCourseId === 'de-A2'
                          ? 'Örn: 45 Dk A2 weil/deshalb Yan Cümleler Ders Planı'
                          : 'Örn: 45 Dk A1 Aile ve Artikel Ders Planı'
                      }
                      maxLength={100}
                      className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="draft-kind"
                      className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                    >
                      Taslak Türü
                    </label>
                    <select
                      id="draft-kind"
                      value={draftKind}
                      onChange={(e) => setDraftKind(e.target.value as StudioDraftKind)}
                      className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    >
                      <option value="lesson">Ders Planı</option>
                      <option value="quiz">Kısa Quiz Taslağı</option>
                      <option value="homework">Ödev Kontrol Listesi</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="draft-module"
                        className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                      >
                        Odak Modül
                      </label>
                      <select
                        id="draft-module"
                        value={draftModuleFocus}
                        onChange={(e) =>
                          setDraftModuleFocus(e.target.value as TeachingAssignmentModule)
                        }
                        className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-2.5 py-2.5 text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                      >
                        {TEACHING_MODULE_CATALOG.map((m) => (
                          <option key={m.route} value={m.route}>
                            {m.shortLabelTr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="draft-duration"
                        className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                      >
                        Süre (dk)
                      </label>
                      <input
                        id="draft-duration"
                        type="number"
                        min={5}
                        max={180}
                        value={draftDuration}
                        onChange={(e) => setDraftDuration(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2.5 font-mono text-sm text-[#111113] tabular-nums dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="draft-notes"
                      className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                    >
                      Öğretmen Notu / Kazanım Hedefi
                    </label>
                    <textarea
                      id="draft-notes"
                      rows={2}
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      placeholder="Ders içi geçişler veya ödev kontrol ölçütleri..."
                      maxLength={400}
                      className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2 text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    />
                  </div>
                </div>

                {/* Checklist Steps inside Editor */}
                <div className="border-t border-[#ECECE8] pt-4 space-y-3 dark:border-[#24242C]">
                  <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    Kontrol Listesi Adımları ({draftItems.length})
                  </p>

                  {draftItems.length > 0 && (
                    <ul className="space-y-2">
                      {draftItems.map((item, idx) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-[#ECECE8] bg-[#F6F6F4] p-3 dark:border-[#24242C] dark:bg-[#111113]"
                        >
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs sm:text-sm font-medium text-[#111113] dark:text-[#F4F4F5]">
                              <span className="font-mono text-xs text-[#9A6B16] dark:text-[#D9A13B] mr-1.5">
                                {idx + 1}.
                              </span>
                              {item.textTr}
                            </p>
                            {item.sampleDe && (
                              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                                DE: {item.sampleDe}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setDraftItems((prev) => prev.filter((x) => x.id !== item.id))
                            }
                            aria-label="Adımı kaldır"
                            className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-md text-[#52525B] hover:text-[#991B1B] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5] shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Add step inline controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={newItemTextTr}
                      onChange={(e) => setNewItemTextTr(e.target.value)}
                      placeholder="Adım / soru açıklaması (TR)"
                      maxLength={180}
                      className="sm:col-span-6 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs sm:text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    />
                    <input
                      type="text"
                      value={newItemSampleDe}
                      onChange={(e) => setNewItemSampleDe(e.target.value)}
                      placeholder="Örnek Almanca cümle (isteğe bağlı)"
                      maxLength={220}
                      className="sm:col-span-4 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs sm:text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    />
                    <button
                      type="button"
                      onClick={handleAddDraftStep}
                      disabled={!newItemTextTr.trim()}
                      className="sm:col-span-2 inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] hover:bg-[#ECECE8] disabled:opacity-45 dark:border-[#282830] dark:bg-[#1E1E24] dark:text-[#F4F4F5]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Ekle</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ECECE8] pt-4 dark:border-[#24242C]">
                  <button
                    type="button"
                    onClick={handleResetDraftEditor}
                    className="h-10 rounded-lg border border-[#D9D9D3] px-3.5 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#A1A1AA]"
                  >
                    Formu Temizle
                  </button>
                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-[#7C1D2E] px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                  >
                    {editingDraftId ? 'Değişiklikleri Kaydet' : 'Taslağı Yerel Olarak Kaydet'}
                  </button>
                </div>
              </form>
            </section>

            {/* Saved Local Drafts List */}
            <section className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <h2 className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  Kayıtlı Yerel Taslaklar
                </h2>
                <span className="font-mono tabular-nums">{progress.studioDrafts.length} taslak</span>
              </div>

              {copyFallbackText && (
                <div className="rounded-xl border border-[#D9A13B]/50 bg-[#FFFBEB] p-4 space-y-2 dark:border-[#D9A13B]/40 dark:bg-[#231D10]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#78350F] dark:text-[#F6D693]">
                      Manuel Kopyalama Metni
                    </p>
                    <button
                      type="button"
                      onClick={() => setCopyFallbackText(null)}
                      className="text-xs underline text-[#78350F] dark:text-[#F6D693]"
                    >
                      Kapat
                    </button>
                  </div>
                  <textarea
                    readOnly
                    rows={6}
                    value={copyFallbackText}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full rounded-lg border border-[#D9A13B]/40 bg-[#FFFFFF] p-2.5 font-mono text-xs text-[#111113] dark:bg-[#111113] dark:text-[#F4F4F5]"
                  />
                </div>
              )}

              {progress.studioDrafts.length === 0 ? (
                <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 text-center dark:border-[#282830] dark:bg-[#16161A]">
                  <FileText className="mx-auto h-6 w-6 text-[#9A6B16] dark:text-[#D9A13B]" />
                  <p className="mt-2 text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    Henüz kayıtlı stüdyo taslağı yok
                  </p>
                  <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    Sol paneldeki şablonlardan birini yükleyip kaydedebilir veya kendi A1 ders planınızı oluşturabilirsiniz.
                  </p>
                </div>
              ) : (
                progress.studioDrafts.map((draft) => {
                  const checkedCount = draft.items.filter((i) => i.checked).length;
                  return (
                    <article
                      key={draft.id}
                      className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 space-y-4 dark:border-[#282830] dark:bg-[#16161A]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                              {draft.courseId === 'de-A2' ? 'CEFR A2' : 'CEFR A1'}
                            </span>{' '}
                            ·{' '}
                            <span className="font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                              {DRAFT_KIND_LABELS[draft.kind]}
                            </span>{' '}
                            · {getModuleShortLabelTr(draft.moduleFocus)} · {draft.durationMinutes} dk
                          </p>
                          <h3 className="mt-1 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {draft.titleTr}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteStudioDraft(draft.id)}
                          aria-label={`${draft.titleTr} taslağını sil`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#52525B] hover:text-[#991B1B] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5] shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {draft.items.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-mono text-[11px] text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                            Tamamlanan adım: {checkedCount}/{draft.items.length}
                          </p>
                          <ul className="space-y-1.5">
                            {draft.items.map((item) => (
                              <li key={item.id} className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => toggleStudioDraftItem(draft.id, item.id)}
                                  className="flex w-full items-start gap-2 text-left text-xs text-[#111113] dark:text-[#E4E4E7]"
                                >
                                  {item.checked ? (
                                    <CheckSquare className="mt-0.5 h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                                  ) : (
                                    <Square className="mt-0.5 h-3.5 w-3.5 text-[#71717A] shrink-0" />
                                  )}
                                  <span className={item.checked ? 'line-through opacity-65' : ''}>
                                    {item.textTr}
                                  </span>
                                </button>
                                {item.sampleDe && (
                                  <div className="pl-5">
                                    <ModelAudioBar
                                      textDe={item.sampleDe}
                                      labelTr={item.sampleDe}
                                      compact
                                    />
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#ECECE8] pt-3 dark:border-[#24242C]">
                        <button
                          type="button"
                          onClick={() => handleLoadSavedDraftForEdit(draft)}
                          className="h-8 rounded-lg border border-[#D9D9D3] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyDraft(draft)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D9D3] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                        >
                          {copiedDraftId === draft.id ? (
                            <Check className="h-3.5 w-3.5 text-[#15803D]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>{copiedDraftId === draft.id ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintPreviewDraft(draft)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D9D3] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Yazdır</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConvertDraftToAssignment(draft)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#111113] px-2.5 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
                        >
                          <ClipboardPlus className="h-3.5 w-3.5" />
                          <span>Ödevlere Aktar</span>
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </div>
        )}

        {/* TAB 3: VERIFIED de-DE MODEL AUDIO LAB */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-5 dark:border-[#282830] dark:bg-[#16161A]">
              <div>
                <p className="text-xs font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                  Doğrulanmış Web Speech API · src/utils/speech.ts
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  de-DE Model Ses ve Telaffuz Testi
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  Ders öncesi akıllı tahta veya hoparlör üzerinden Almanca örnek cümleleri 0.8× (yavaş A1) ve 1.0× (normal) hızlarında test edin.
                </p>
              </div>

              {/* Special German Characters */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="studio-audio-textarea"
                    className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                  >
                    Almanca Örnek Metin (de-DE)
                  </label>
                  <div className="flex items-center gap-1">
                    {GERMAN_SPECIAL_CHARS.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleInsertGermanChar(ch)}
                        className="h-7 w-7 rounded border border-[#D9D9D3] bg-[#F6F6F4] font-mono text-xs font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  id="studio-audio-textarea"
                  rows={3}
                  value={audioTextDe}
                  onChange={(e) => setAudioTextDe(e.target.value)}
                  maxLength={320}
                  className="w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
                />
              </div>

              {/* Speaker Gender Selector + ModelAudioBar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
                  Konuşmacı Profili:
                </span>
                <div className="inline-flex rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-0.5 dark:border-[#282830] dark:bg-[#111113]">
                  <button
                    type="button"
                    onClick={() => setAudioGender('female')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      audioGender === 'female'
                        ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : 'text-[#52525B] dark:text-[#A1A1AA]'
                    }`}
                  >
                    Kadın Sesi
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioGender('male')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      audioGender === 'male'
                        ? 'bg-[#111113] text-[#F6F6F4] dark:bg-[#D9A13B] dark:text-[#111113]'
                        : 'text-[#52525B] dark:text-[#A1A1AA]'
                    }`}
                  >
                    Erkek Sesi
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <ModelAudioBar
                  textDe={audioTextDe.trim() || 'Guten Tag!'}
                  labelTr="Model Sesi Oynat (de-DE)"
                  speakerGender={audioGender}
                />
              </div>

              {/* Honest Browser Speech Diagnostics */}
              <div className="rounded-xl border border-[#ECECE8] p-4 space-y-2 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
                <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  Tarayıcı Ses Motoru Durumu (Dürüst Algılama)
                </p>
                <p>
                  Web Speech API:{' '}
                  <strong className="text-[#111113] dark:text-[#F4F4F5]">
                    {voiceInfo.supported ? 'Destekleniyor' : 'Bu tarayıcıda desteklenmiyor'}
                  </strong>{' '}
                  · Algılanan Almanca ses sayısı:{' '}
                  <strong className="font-mono text-[#111113] dark:text-[#F4F4F5] tabular-nums">
                    {voiceInfo.germanVoiceCount}
                  </strong>
                </p>
                <p>{voicePlan.statusNoteTr}</p>
              </div>
            </section>

            {/* Classroom A1 / A2 Audio Presets */}
            <section className="lg:col-span-5 rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-6 space-y-4 dark:border-[#282830] dark:bg-[#16161A]">
              <h3 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Hazır {studioCourse === 'de-A2' ? 'A2' : 'A1'} Ders İçi Ses Kalıpları
              </h3>
              <div className="space-y-2.5">
                {activeAudioPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAudioTextDe(preset.textDe)}
                    className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                      audioTextDe === preset.textDe
                        ? 'border-[#7C1D2E] bg-[#FDF2F4]/40 dark:border-[#D9A13B] dark:bg-[#1E1E24]'
                        : 'border-[#ECECE8] bg-[#F6F6F4] hover:border-[#111113]/30 dark:border-[#24242C] dark:bg-[#111113]'
                    }`}
                  >
                    <p className="text-[11px] font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                      {preset.categoryTr} · {preset.labelTr}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#111113] dark:text-[#F4F4F5]">
                      {preset.textDe}
                    </p>
                    <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                      {preset.textTr}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Honest Storage Scope Note */}
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex items-start gap-2.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <Info className="mt-0.5 h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
            <p className="leading-relaxed">
              Öğretmen Stüdyosunda hazırlanan taslaklar yalnızca tarayıcınızdaki yerel depolamada saklanır. Kurumsal bulut arşivi, ekip içi taslak paylaşımı ve öğrenci hesaplarına otomatik dağıtım sonraki aşamalarda eklenecektir.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Sheet Overlay (In-App — Avoids window.open inside iframe) */}
      {printPreviewDraft && (
        <div className="rounded-2xl border border-[#111113] bg-[#FFFFFF] p-6 sm:p-8 text-[#111113] space-y-5 print:border-0 print:p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D9D3] pb-4 print:hidden">
            <div>
              <p className="text-xs font-semibold text-[#7C1D2E]">
                Yazdırılabilir Çalışma Kağıdı Önizlemesi
              </p>
              <p className="text-xs text-[#52525B]">
                Yazdır düğmesi tarayıcı yazdırma diyaloğunu açar; PDF olarak da kaydedebilirsiniz.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-medium text-white hover:bg-[#27272A]"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Yazdır / PDF Kaydet</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintPreviewDraft(null)}
                className="h-9 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4]"
              >
                Önizlemeyi Kapat
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D9D9D3] pb-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-[#52525B]">
                  Teachers Kingdom · Almanca CEFR{' '}
                  {printPreviewDraft.courseId === 'de-A2' ? 'A2' : 'A1'} ·{' '}
                  {DRAFT_KIND_LABELS[printPreviewDraft.kind]}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#111113]">
                  {printPreviewDraft.titleTr}
                </h2>
              </div>
              <p className="font-mono text-xs text-[#52525B]">
                {getModuleShortLabelTr(printPreviewDraft.moduleFocus)} ·{' '}
                {printPreviewDraft.durationMinutes} dk
              </p>
            </div>

            {printPreviewDraft.notesTr && (
              <p className="text-sm text-[#3F3F46] leading-relaxed">
                <strong>Not: </strong>
                {printPreviewDraft.notesTr}
              </p>
            )}

            <ol className="space-y-3">
              {printPreviewDraft.items.map((item, idx) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-[#D9D9D3] p-3.5 text-sm space-y-1"
                >
                  <p className="font-medium text-[#111113]">
                    {idx + 1}. {item.checked ? '[x] ' : '[ ] '}
                    {item.textTr}
                  </p>
                  {item.sampleDe && (
                    <p className="font-mono text-xs text-[#52525B]">DE: {item.sampleDe}</p>
                  )}
                </li>
              ))}
            </ol>

            <p className="pt-4 border-t border-[#ECECE8] text-xs text-[#52525B]">
              Teachers Kingdom (teacherskingdom.net) · Öğren. Öğret. Üret.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
