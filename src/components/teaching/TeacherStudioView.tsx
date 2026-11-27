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
} from '../../data/germanA1Teaching';
import {
  A2_CURRICULUM_PREVIEW_ITEMS,
  A2_STUDIO_AUDIO_PRESETS,
  A2_STUDIO_DRAFT_TEMPLATES,
  TEACHING_A2_MODULE_CATALOG,
} from '../../data/germanA2Teaching';
import { useI18n } from '../../hooks/useI18n';
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

const DRAFT_KIND_LABELS: Record<StudioDraftKind, { tr: string; en: string }> = {
  lesson: { tr: 'Ders Planı', en: 'Lesson Plan' },
  quiz: { tr: 'Kısa Quiz Taslağı', en: 'Short Quiz Draft' },
  homework: { tr: 'Ödev Kontrol Listesi', en: 'Homework Checklist' },
};

const STUDIO_MODULE_SHORT_LABELS: Record<TeachingAssignmentModule, { tr: string; en: string }> = {
  kelime: { tr: 'Kelime', en: 'Vocab' },
  dinleme: { tr: 'Dinleme', en: 'Listening' },
  okuma: { tr: 'Okuma', en: 'Reading' },
  yazma: { tr: 'Yazma', en: 'Writing' },
  konusma: { tr: 'Konuşma', en: 'Speaking' },
  karaoke: { tr: 'Karaoke', en: 'Karaoke' },
  'sessiz-sinema': { tr: 'Sessiz Sinema', en: 'Charades' },
  arena: { tr: 'Arena', en: 'Arena' },
  'quiz-merkezi': { tr: 'Quiz', en: 'Quiz' },
  'sinav-modu': { tr: 'Sınav Modu', en: 'Exam Mode' },
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
  const { isEn, locale, tx } = useI18n();

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
    const levelShort = studioCourse === 'de-A2' ? 'A2' : 'A1';
    const { xpAwarded } = createTeachingAssignment({
      courseId: studioCourse,
      titleTr: `${item.moduleLabelTr}: ${item.titleTr}`,
      moduleRoute: item.moduleRoute,
      targetId: item.targetId,
      targetLabelTr: item.titleTr,
      dueDateLabel: tx(
        { tr: '{{level}} Stüdyodan Atandı', en: 'Assigned from {{level}} Studio' },
        { level: levelShort }
      ),
      instructionsTr: item.teachingTipTr,
    });
    showNotice(
      xpAwarded > 0
        ? tx(
            {
              tr: '"{{title}}" Ödevler listesine eklendi (+{{xp}} XP).',
              en: '"{{title}}" added to Assignments (+{{xp}} XP).',
            },
            { title: item.titleTr, xp: xpAwarded }
          )
        : tx(
            {
              tr: '"{{title}}" Ödevler listesine eklendi.',
              en: '"{{title}}" added to Assignments.',
            },
            { title: item.titleTr }
          )
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
      setDraftTitle(
        tx(
          { tr: '{{level}} {{title}} Ders Akışı', en: '{{level}} {{title}} Lesson Flow' },
          { level: studioCourse === 'de-A2' ? 'A2' : 'A1', title: item.titleTr }
        )
      );
      setDraftModuleFocus(item.moduleRoute);
    }
    setActiveTab('builder');
    showNotice(
      tx({
        tr: 'Müfredat öğesi Taslak Oluşturucu adımlarına eklendi.',
        en: 'Curriculum item added to Draft Builder steps.',
      })
    );
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
    showNotice(
      tx(
        { tr: '"{{title}}" şablonu düzenleyiciye yüklendi.', en: 'Template "{{title}}" loaded into editor.' },
        { title: tpl.titleTr }
      )
    );
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
    showNotice(
      tx(
        { tr: '"{{title}}" düzenlenmek üzere açıldı.', en: '"{{title}}" opened for editing.' },
        { title: draft.titleTr }
      )
    );
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
        ? tx(
            {
              tr: 'Taslak yerel tarayıcıya kaydedildi (+{{xp}} XP ilk stüdyo taslağı kazanımı).',
              en: 'Draft saved locally (+{{xp}} XP first-studio-draft bonus).',
            },
            { xp: xpAwarded }
          )
        : tx({
            tr: 'Taslak yerel tarayıcıya kaydedildi.',
            en: 'Draft saved to local browser storage.',
          })
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
    showNotice(
      tx({
        tr: 'Tarayıcı pano erişimini kısıtladı; metni aşağıdaki kutudan manuel kopyalayabilirsiniz.',
        en: 'Browser restricted clipboard access; copy the text manually from the box below.',
      })
    );
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
      dueDateLabel: tx(
        { tr: '{{min}} dk · Stüdyo Taslağı', en: '{{min}} min · Studio Draft' },
        { min: draft.durationMinutes }
      ),
      instructionsTr:
        summarySteps ||
        draft.notesTr ||
        tx({
          tr: 'Öğretmen Stüdyosu kontrol listesi görevi.',
          en: 'Teacher Studio checklist task.',
        }),
    });
    showNotice(
      tx(
        { tr: '"{{title}}" Ödevler modülüne aktarıldı.', en: '"{{title}}" sent to Assignments.' },
        { title: draft.titleTr }
      )
    );
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
              {tx({ tr: 'Öğretim ve Yönetim', en: 'Teaching & Management' })} ·{' '}
              {locale.brand.philosophy} ·{' '}
              {tx({ tr: 'Almanca CEFR A1 & A2', en: 'German CEFR A1 & A2' })}
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({ tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Level Switcher */}
            <div
              role="group"
              aria-label={tx({ tr: 'Stüdyo seviye seçici', en: 'Studio level selector' })}
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
              aria-label={tx({ tr: 'Öğretmen Stüdyosu araçları', en: 'Teacher Studio tools' })}
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
                <span>
                  {studioCourse === 'de-A2'
                    ? tx({ tr: 'A2 Önizleme', en: 'A2 Preview' })
                    : tx({ tr: 'A1 Önizleme', en: 'A1 Preview' })}
                </span>
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
                <span>{tx({ tr: 'Taslak Oluşturucu', en: 'Draft Builder' })}</span>
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
                <span>{tx({ tr: 'de-DE Ses Testi', en: 'de-DE Audio Lab' })}</span>
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
                  label:
                    studioCourse === 'de-A2'
                      ? tx({ tr: 'Tüm A2 Modülleri', en: 'All A2 Modules' })
                      : tx({ tr: 'Tüm A1 Modülleri', en: 'All A1 Modules' }),
                },
                { id: 'kelime', label: tx({ tr: 'Kelime', en: 'Vocab' }) },
                { id: 'dinleme', label: tx({ tr: 'Dinleme', en: 'Listening' }) },
                { id: 'okuma', label: tx({ tr: 'Okuma', en: 'Reading' }) },
                { id: 'yazma', label: tx({ tr: 'Yazma', en: 'Writing' }) },
                { id: 'konusma', label: tx({ tr: 'Konuşma', en: 'Speaking' }) },
                { id: 'karaoke', label: 'Karaoke' },
                { id: 'sessiz-sinema', label: tx({ tr: 'Sessiz Sinema', en: 'Charades' }) },
                { id: 'quiz-merkezi', label: 'Quiz' },
                ...(studioCourse === 'de-A2'
                  ? [{ id: 'sinav-modu', label: tx({ tr: 'A2 Sınav', en: 'A2 Exam' }) }]
                  : []),
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
                      {tx({
                        tr: 'Tahta & Ekran Paylaşımı Önizlemesi',
                        en: 'Board & Screen-Share Preview',
                      })}{' '}
                      · {activePreviewItem.moduleLabelTr}
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
                      labelEn="Play for Class (de-DE)"
                    />
                  </div>
                </div>

                {/* Pedagogical Tip */}
                <div className="text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  <strong className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {tx({ tr: 'Ders Uygulama Notu:', en: 'Classroom Teaching Note:' })}{' '}
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
                      {studioCourse === 'de-A2'
                        ? tx({ tr: 'Canlı A2 Modülünde Aç', en: 'Open Live A2 Module' })
                        : tx({ tr: 'Canlı A1 Modülünde Aç', en: 'Open Live A1 Module' })}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAssignFromPreview}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] whitespace-nowrap"
                  >
                    <ClipboardPlus className="h-4 w-4 text-[#7C1D2E] dark:text-[#D9A13B]" />
                    <span>{tx({ tr: 'Ödev Olarak Ata', en: 'Assign as Homework' })}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAppendPreviewToBuilder}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs sm:text-sm font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B]" />
                    <span>{tx({ tr: 'Taslağa Ekle', en: 'Add to Draft' })}</span>
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
                    {editingDraftId
                      ? tx({ tr: 'Taslağı Düzenle', en: 'Edit Draft' })
                      : tx({
                          tr: 'Yeni A1 / A2 Ders & Ödev Kontrol Listesi',
                          en: 'New A1 / A2 Lesson & Homework Checklist',
                        })}
                  </h2>
                  <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({
                      tr: 'Yerel tarayıcıya kaydedilir, panoya kopyalanabilir veya yazdırılabilir.',
                      en: 'Saved locally in your browser; can be copied to clipboard or printed.',
                    })}
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
                      {tpl.courseId === 'de-A2' ? 'A2' : 'A1'} ·{' '}
                      {isEn ? DRAFT_KIND_LABELS[tpl.kind].en : DRAFT_KIND_LABELS[tpl.kind].tr}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveDraft} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {tx({ tr: 'Taslak Seviyesi:', en: 'Draft Level:' })}
                    </span>
                    <div
                      role="group"
                      aria-label={tx({ tr: 'Taslak CEFR seviyesi', en: 'Draft CEFR level' })}
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
                      {tx({ tr: 'Taslak Başlığı *', en: 'Draft Title *' })}
                    </label>
                    <input
                      id="draft-title"
                      type="text"
                      required
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder={
                        draftCourseId === 'de-A2'
                          ? tx({
                              tr: 'Örn: 45 Dk A2 weil/deshalb Yan Cümleler Ders Planı',
                              en: 'e.g. 45-Min A2 weil/deshalb Subordinate Clauses Lesson Plan',
                            })
                          : tx({
                              tr: 'Örn: 45 Dk A1 Aile ve Artikel Ders Planı',
                              en: 'e.g. 45-Min A1 Family & Articles Lesson Plan',
                            })
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
                      {tx({ tr: 'Taslak Türü', en: 'Draft Type' })}
                    </label>
                    <select
                      id="draft-kind"
                      value={draftKind}
                      onChange={(e) => setDraftKind(e.target.value as StudioDraftKind)}
                      className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    >
                      <option value="lesson">
                        {isEn ? DRAFT_KIND_LABELS.lesson.en : DRAFT_KIND_LABELS.lesson.tr}
                      </option>
                      <option value="quiz">
                        {isEn ? DRAFT_KIND_LABELS.quiz.en : DRAFT_KIND_LABELS.quiz.tr}
                      </option>
                      <option value="homework">
                        {isEn ? DRAFT_KIND_LABELS.homework.en : DRAFT_KIND_LABELS.homework.tr}
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="draft-module"
                        className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                      >
                        {tx({ tr: 'Odak Modül', en: 'Focus Module' })}
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
                            {isEn
                              ? STUDIO_MODULE_SHORT_LABELS[m.route]?.en ?? m.shortLabelTr
                              : m.shortLabelTr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="draft-duration"
                        className="block text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                      >
                        {tx({ tr: 'Süre (dk)', en: 'Duration (min)' })}
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
                      {tx({ tr: 'Öğretmen Notu / Kazanım Hedefi', en: 'Teacher Notes / Learning Goal' })}
                    </label>
                    <textarea
                      id="draft-notes"
                      rows={2}
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      placeholder={tx({
                        tr: 'Ders içi geçişler veya ödev kontrol ölçütleri...',
                        en: 'In-class transitions or homework grading criteria...',
                      })}
                      maxLength={400}
                      className="mt-1.5 w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2 text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    />
                  </div>
                </div>

                {/* Checklist Steps inside Editor */}
                <div className="border-t border-[#ECECE8] pt-4 space-y-3 dark:border-[#24242C]">
                  <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                    {tx(
                      { tr: 'Kontrol Listesi Adımları ({{count}})', en: 'Checklist Steps ({{count}})' },
                      { count: draftItems.length }
                    )}
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
                            aria-label={tx({ tr: 'Adımı kaldır', en: 'Remove step' })}
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
                      placeholder={tx({
                        tr: 'Adım / soru açıklaması',
                        en: 'Step / question description',
                      })}
                      maxLength={180}
                      className="sm:col-span-6 h-10 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 text-xs sm:text-sm text-[#111113] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5]"
                    />
                    <input
                      type="text"
                      value={newItemSampleDe}
                      onChange={(e) => setNewItemSampleDe(e.target.value)}
                      placeholder={tx({
                        tr: 'Örnek Almanca cümle (isteğe bağlı)',
                        en: 'Sample German sentence (optional)',
                      })}
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
                      <span>{tx({ tr: 'Ekle', en: 'Add' })}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ECECE8] pt-4 dark:border-[#24242C]">
                  <button
                    type="button"
                    onClick={handleResetDraftEditor}
                    className="h-10 rounded-lg border border-[#D9D9D3] px-3.5 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#A1A1AA]"
                  >
                    {tx({ tr: 'Formu Temizle', en: 'Clear Form' })}
                  </button>
                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-[#7C1D2E] px-5 text-xs sm:text-sm font-semibold text-white hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113]"
                  >
                    {editingDraftId
                      ? tx({ tr: 'Değişiklikleri Kaydet', en: 'Save Changes' })
                      : tx({ tr: 'Taslağı Yerel Olarak Kaydet', en: 'Save Draft Locally' })}
                  </button>
                </div>
              </form>
            </section>

            {/* Saved Local Drafts List */}
            <section className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A1A1AA]">
                <h2 className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({ tr: 'Kayıtlı Yerel Taslaklar', en: 'Saved Local Drafts' })}
                </h2>
                <span className="font-mono tabular-nums">
                  {tx(
                    { tr: '{{count}} taslak', en: '{{count}} drafts' },
                    { count: progress.studioDrafts.length }
                  )}
                </span>
              </div>

              {copyFallbackText && (
                <div className="rounded-xl border border-[#D9A13B]/50 bg-[#FFFBEB] p-4 space-y-2 dark:border-[#D9A13B]/40 dark:bg-[#231D10]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#78350F] dark:text-[#F6D693]">
                      {tx({ tr: 'Manuel Kopyalama Metni', en: 'Manual Copy Text' })}
                    </p>
                    <button
                      type="button"
                      onClick={() => setCopyFallbackText(null)}
                      className="text-xs underline text-[#78350F] dark:text-[#F6D693]"
                    >
                      {locale.common.close}
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
                    {tx({
                      tr: 'Henüz kayıtlı stüdyo taslağı yok',
                      en: 'No studio drafts saved yet',
                    })}
                  </p>
                  <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                    {tx({
                      tr: 'Sol paneldeki şablonlardan birini yükleyip kaydedebilir veya kendi A1/A2 ders planınızı oluşturabilirsiniz.',
                      en: 'Load a template from the left panel or build your own A1/A2 lesson plan.',
                    })}
                  </p>
                </div>
              ) : (
                progress.studioDrafts.map((draft) => {
                  const checkedCount = draft.items.filter((i) => i.checked).length;
                  const draftModuleLabel = isEn
                    ? STUDIO_MODULE_SHORT_LABELS[draft.moduleFocus]?.en ?? draft.moduleFocus
                    : STUDIO_MODULE_SHORT_LABELS[draft.moduleFocus]?.tr ?? draft.moduleFocus;
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
                              {isEn
                                ? DRAFT_KIND_LABELS[draft.kind].en
                                : DRAFT_KIND_LABELS[draft.kind].tr}
                            </span>{' '}
                            · {draftModuleLabel} ·{' '}
                            {tx(
                              { tr: '{{min}} dk', en: '{{min}} min' },
                              { min: draft.durationMinutes }
                            )}
                          </p>
                          <h3 className="mt-1 font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                            {draft.titleTr}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteStudioDraft(draft.id)}
                          aria-label={tx(
                            { tr: '{{title}} taslağını sil', en: 'Delete draft {{title}}' },
                            { title: draft.titleTr }
                          )}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#52525B] hover:text-[#991B1B] dark:text-[#A1A1AA] dark:hover:text-[#FCA5A5] shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {draft.items.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-mono text-[11px] text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
                            {tx(
                              {
                                tr: 'Tamamlanan adım: {{done}}/{{total}}',
                                en: 'Completed steps: {{done}}/{{total}}',
                              },
                              { done: checkedCount, total: draft.items.length }
                            )}
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
                                      labelEn={item.sampleDe}
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
                          {tx({ tr: 'Düzenle', en: 'Edit' })}
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
                          <span>
                            {copiedDraftId === draft.id
                              ? tx({ tr: 'Kopyalandı', en: 'Copied' })
                              : tx({ tr: 'Kopyala', en: 'Copy' })}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintPreviewDraft(draft)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D9D3] px-2.5 text-xs font-medium text-[#111113] hover:bg-[#F6F6F4] dark:border-[#282830] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>{tx({ tr: 'Yazdır', en: 'Print' })}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConvertDraftToAssignment(draft)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#111113] px-2.5 text-xs font-medium text-[#F6F6F4] hover:bg-[#27272A] dark:bg-[#D9A13B] dark:text-[#111113]"
                        >
                          <ClipboardPlus className="h-3.5 w-3.5" />
                          <span>{tx({ tr: 'Ödevlere Aktar', en: 'Send to Assignments' })}</span>
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
                  {tx({
                    tr: 'Doğrulanmış Web Speech API · src/utils/speech.ts',
                    en: 'Verified Web Speech API · src/utils/speech.ts',
                  })}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({
                    tr: 'de-DE Model Ses ve Telaffuz Testi',
                    en: 'de-DE Model Voice & Pronunciation Lab',
                  })}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({
                    tr: 'Ders öncesi akıllı tahta veya hoparlör üzerinden Almanca örnek cümleleri 0.8× (yavaş) ve 1.0× (normal) hızlarında test edin.',
                    en: 'Test German example sentences on your classroom board or speakers at 0.8× (slow) and 1.0× (normal) speeds before class.',
                  })}
                </p>
              </div>

              {/* Special German Characters */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="studio-audio-textarea"
                    className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]"
                  >
                    {tx({ tr: 'Almanca Örnek Metin (de-DE)', en: 'German Sample Text (de-DE)' })}
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
                  {tx({ tr: 'Konuşmacı Profili:', en: 'Speaker Profile:' })}
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
                    {tx({ tr: 'Kadın Sesi', en: 'Female Voice' })}
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
                    {tx({ tr: 'Erkek Sesi', en: 'Male Voice' })}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
                <ModelAudioBar
                  textDe={audioTextDe.trim() || 'Guten Tag!'}
                  labelTr="Model Sesi Oynat (de-DE)"
                  labelEn="Play Model Voice (de-DE)"
                  speakerGender={audioGender}
                />
              </div>

              {/* Honest Browser Speech Diagnostics */}
              <div className="rounded-xl border border-[#ECECE8] p-4 space-y-2 text-xs text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
                <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {tx({
                    tr: 'Tarayıcı Ses Motoru Durumu (Dürüst Algılama)',
                    en: 'Browser Speech Engine Status (Live Detection)',
                  })}
                </p>
                <p>
                  Web Speech API:{' '}
                  <strong className="text-[#111113] dark:text-[#F4F4F5]">
                    {voiceInfo.supported
                      ? tx({ tr: 'Destekleniyor', en: 'Supported' })
                      : tx({
                          tr: 'Bu tarayıcıda desteklenmiyor',
                          en: 'Not supported in this browser',
                        })}
                  </strong>{' '}
                  · {tx({ tr: 'Algılanan Almanca ses sayısı:', en: 'Detected German voices:' })}{' '}
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
                {tx(
                  {
                    tr: 'Hazır {{level}} Ders İçi Ses Kalıpları',
                    en: 'Ready {{level}} Classroom Audio Presets',
                  },
                  { level: studioCourse === 'de-A2' ? 'A2' : 'A1' }
                )}
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
              {tx({
                tr: 'Öğretmen Stüdyosunda hazırlanan taslaklar yalnızca tarayıcınızdaki yerel depolamada saklanır. Kurumsal bulut arşivi, ekip içi taslak paylaşımı ve öğrenci hesaplarına otomatik dağıtım sonraki aşamalarda eklenecektir.',
                en: 'Drafts created in Teacher Studio are stored only in your browser’s local storage. Cloud archives, team draft sharing, and automatic distribution to student accounts will be added in future phases.',
              })}
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
                {tx({
                  tr: 'Yazdırılabilir Çalışma Kağıdı Önizlemesi',
                  en: 'Printable Worksheet Preview',
                })}
              </p>
              <p className="text-xs text-[#52525B]">
                {tx({
                  tr: 'Yazdır düğmesi tarayıcı yazdırma diyaloğunu açar; PDF olarak da kaydedebilirsiniz.',
                  en: 'Click Print to open the browser print dialog; you can also save as PDF.',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#111113] px-4 text-xs font-medium text-white hover:bg-[#27272A]"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'Yazdır / PDF Kaydet', en: 'Print / Save PDF' })}</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintPreviewDraft(null)}
                className="h-9 rounded-lg border border-[#D9D9D3] px-3 text-xs font-medium text-[#52525B] hover:bg-[#F6F6F4]"
              >
                {tx({ tr: 'Önizlemeyi Kapat', en: 'Close Preview' })}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#D9D9D3] pb-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-[#52525B]">
                  {tx(
                    { tr: 'Teachers Kingdom · Almanca CEFR {{lvl}}', en: 'Teachers Kingdom · German CEFR {{lvl}}' },
                    { lvl: printPreviewDraft.courseId === 'de-A2' ? 'A2' : 'A1' }
                  )}{' '}
                  ·{' '}
                  {isEn
                    ? DRAFT_KIND_LABELS[printPreviewDraft.kind].en
                    : DRAFT_KIND_LABELS[printPreviewDraft.kind].tr}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#111113]">
                  {printPreviewDraft.titleTr}
                </h2>
              </div>
              <p className="font-mono text-xs text-[#52525B]">
                {isEn
                  ? STUDIO_MODULE_SHORT_LABELS[printPreviewDraft.moduleFocus]?.en ??
                    printPreviewDraft.moduleFocus
                  : STUDIO_MODULE_SHORT_LABELS[printPreviewDraft.moduleFocus]?.tr ??
                    printPreviewDraft.moduleFocus}{' '}
                ·{' '}
                {tx(
                  { tr: '{{min}} dk', en: '{{min}} min' },
                  { min: printPreviewDraft.durationMinutes }
                )}
              </p>
            </div>

            {printPreviewDraft.notesTr && (
              <p className="text-sm text-[#3F3F46] leading-relaxed">
                <strong>{tx({ tr: 'Not:', en: 'Note:' })} </strong>
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
              Teachers Kingdom (teacherskingdom.net) · {locale.brand.philosophy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
