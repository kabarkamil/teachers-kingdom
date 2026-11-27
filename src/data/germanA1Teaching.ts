import type {
  ProgressState,
  StudioDraft,
  StudioDraftKind,
  TeachingAssignment,
  TeachingAssignmentModule,
} from '../types';
import {
  ARENA_IDS,
  CHARADE_IDS,
  EXAM_IDS,
  GERMAN_A1_CHARADES,
  GERMAN_A1_KARAOKE_TRACKS,
  GERMAN_A1_QUIZ_QUESTIONS,
  KARAOKE_IDS,
  QUIZ_IDS,
} from './germanA1Activities';
import {
  GERMAN_A1_LISTENING_SCENARIOS,
  getScenarioExerciseIds,
} from './germanA1Listening';
import {
  GERMAN_A1_READING_SCENARIOS,
  getReadingScenarioExerciseIds,
} from './germanA1Reading';
import {
  GERMAN_A1_SPEAKING_SCENARIOS,
  getSpeakingScenarioExerciseIds,
} from './germanA1Speaking';
import { ALL_A1_WORDS, GERMAN_A1_TOPICS } from './germanA1Vocab';
import {
  GERMAN_A1_WRITING_SCENARIOS,
  getWritingScenarioExerciseIds,
} from './germanA1Writing';

export interface A1ModuleOption {
  route: TeachingAssignmentModule;
  labelTr: string;
  shortLabelTr: string;
  targets: Array<{
    id: string;
    labelTr: string;
    subtitleDe: string;
  }>;
}

export const TEACHING_MODULE_CATALOG: A1ModuleOption[] = [
  {
    route: 'kelime',
    labelTr: 'Kelime (Wortschatz)',
    shortLabelTr: 'Kelime',
    targets: [
      ...GERMAN_A1_TOPICS.map((t) => ({
        id: t.id,
        labelTr: t.titleTr,
        subtitleDe: `${t.titleDe} · ${t.words.length} kelime`,
      })),
    ],
  },
  {
    route: 'dinleme',
    labelTr: 'Dinleme (Hören)',
    shortLabelTr: 'Dinleme',
    targets: GERMAN_A1_LISTENING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · 6 soru`,
    })),
  },
  {
    route: 'okuma',
    labelTr: 'Okuma (Lesen)',
    shortLabelTr: 'Okuma',
    targets: GERMAN_A1_READING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.document.formatLabelDe} · 6 soru`,
    })),
  },
  {
    route: 'yazma',
    labelTr: 'Yazma (Schreiben)',
    shortLabelTr: 'Yazma',
    targets: GERMAN_A1_WRITING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · 5 görev`,
    })),
  },
  {
    route: 'konusma',
    labelTr: 'Konuşma (Sprechen)',
    shortLabelTr: 'Konuşma',
    targets: GERMAN_A1_SPEAKING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · 5 pratik`,
    })),
  },
  {
    route: 'karaoke',
    labelTr: 'Karaoke Stüdyosu',
    shortLabelTr: 'Karaoke',
    targets: [
      {
        id: 'all-karaoke',
        labelTr: 'Tüm A1 Karaoke Parçaları',
        subtitleDe: `${KARAOKE_IDS.length} ritmik A1 parçası`,
      },
    ],
  },
  {
    route: 'sessiz-sinema',
    labelTr: 'Sessiz Sinema (Scharade)',
    shortLabelTr: 'Sessiz Sinema',
    targets: [
      {
        id: 'all-charades',
        labelTr: 'A1 Sessiz Sinema Kart Destesi',
        subtitleDe: `${CHARADE_IDS.length} canlandırma kartı`,
      },
    ],
  },
  {
    route: 'arena',
    labelTr: 'Arena (Hızlı Tekrar)',
    shortLabelTr: 'Arena',
    targets: [
      {
        id: 'all-arena',
        labelTr: 'A1 Hızlı Tekrar Arenası',
        subtitleDe: `${ARENA_IDS.length} hızlı soru`,
      },
    ],
  },
  {
    route: 'quiz-merkezi',
    labelTr: 'Quiz Merkezi',
    shortLabelTr: 'Quiz Merkezi',
    targets: [
      {
        id: 'all-quiz',
        labelTr: 'A1 Karma Tarama Quizleri',
        subtitleDe: `${QUIZ_IDS.length} karma soru`,
      },
    ],
  },
  {
    route: 'sinav-modu',
    labelTr: 'Sınav Modu / Sınav Bankası',
    shortLabelTr: 'A1 Sınavı',
    targets: [
      {
        id: 'all-exam',
        labelTr: 'CEFR A1 4 Bölümlü Deneme Sınavı',
        subtitleDe: `${EXAM_IDS.length} soruluk sınav`,
      },
    ],
  },
];

export function getModuleLabelTr(route: TeachingAssignmentModule): string {
  return TEACHING_MODULE_CATALOG.find((m) => m.route === route)?.labelTr ?? route;
}

export function getModuleShortLabelTr(route: TeachingAssignmentModule): string {
  return TEACHING_MODULE_CATALOG.find((m) => m.route === route)?.shortLabelTr ?? route;
}

export interface TargetLiveProgress {
  done: number;
  total: number;
  unitLabelTr: string;
  percent: number;
}

/**
 * Computes strictly real browser progress for any linked A1 module & target
 * from tk_stage1_progress_v1 without fabricating metrics.
 */
export function getTargetLiveProgress(
  moduleRoute: TeachingAssignmentModule,
  targetId: string | undefined,
  progress: ProgressState,
  uniqueCompletedWordIds: string[]
): TargetLiveProgress {
  switch (moduleRoute) {
    case 'kelime': {
      const topic = GERMAN_A1_TOPICS.find((t) => t.id === targetId);
      const words = topic ? topic.words : ALL_A1_WORDS;
      const done = words.filter((w) => uniqueCompletedWordIds.includes(w.id)).length;
      const total = words.length;
      return {
        done,
        total,
        unitLabelTr: 'kelime',
        percent: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    }
    case 'dinleme': {
      const scenario = GERMAN_A1_LISTENING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getScenarioExerciseIds(scenario)
        : GERMAN_A1_LISTENING_SCENARIOS.flatMap((s) => getScenarioExerciseIds(s));
      const done = ids.filter((id) => progress.listeningMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'soru',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'okuma': {
      const scenario = GERMAN_A1_READING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getReadingScenarioExerciseIds(scenario)
        : GERMAN_A1_READING_SCENARIOS.flatMap((s) => getReadingScenarioExerciseIds(s));
      const done = ids.filter((id) => progress.readingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'soru',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'yazma': {
      const scenario = GERMAN_A1_WRITING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getWritingScenarioExerciseIds(scenario)
        : GERMAN_A1_WRITING_SCENARIOS.flatMap((s) => getWritingScenarioExerciseIds(s));
      const done = ids.filter((id) => progress.writingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'görev',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'konusma': {
      const scenario = GERMAN_A1_SPEAKING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getSpeakingScenarioExerciseIds(scenario)
        : GERMAN_A1_SPEAKING_SCENARIOS.flatMap((s) => getSpeakingScenarioExerciseIds(s));
      const done = ids.filter((id) => progress.speakingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'pratik',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'karaoke': {
      const done = KARAOKE_IDS.filter((id) => progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: KARAOKE_IDS.length,
        unitLabelTr: 'parça',
        percent: KARAOKE_IDS.length > 0 ? Math.round((done / KARAOKE_IDS.length) * 100) : 0,
      };
    }
    case 'sessiz-sinema': {
      const done = CHARADE_IDS.filter((id) => progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: CHARADE_IDS.length,
        unitLabelTr: 'kart',
        percent: CHARADE_IDS.length > 0 ? Math.round((done / CHARADE_IDS.length) * 100) : 0,
      };
    }
    case 'arena': {
      const done = ARENA_IDS.filter((id) => progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: ARENA_IDS.length,
        unitLabelTr: 'soru',
        percent: ARENA_IDS.length > 0 ? Math.round((done / ARENA_IDS.length) * 100) : 0,
      };
    }
    case 'quiz-merkezi': {
      const done = QUIZ_IDS.filter((id) => progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: QUIZ_IDS.length,
        unitLabelTr: 'soru',
        percent: QUIZ_IDS.length > 0 ? Math.round((done / QUIZ_IDS.length) * 100) : 0,
      };
    }
    case 'sinav-modu': {
      const done = EXAM_IDS.filter((id) => progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: EXAM_IDS.length,
        unitLabelTr: 'soru',
        percent: EXAM_IDS.length > 0 ? Math.round((done / EXAM_IDS.length) * 100) : 0,
      };
    }
  }
}

/**
 * Curated starter A1 assignments (all start strictly as 'assigned' with 0 XP earned)
 * so learners and teachers have immediate, realistic CEFR A1 tasks tied to real modules.
 */
export const STARTER_A1_ASSIGNMENTS: TeachingAssignment[] = [
  {
    id: 'assign-starter-selamlasma',
    titleTr: 'Ünite 1: Tanışma Kelimeleri ve Artikel Tekrarı',
    moduleRoute: 'kelime',
    targetId: 'selamlasma-tanisma',
    targetLabelTr: 'Selamlaşma ve Tanışma',
    dueDateLabel: 'Hafta 1 Önerilen Görev',
    instructionsTr:
      'Selamlaşma ve Tanışma ünitesindeki 10 A1 sözcüğünü kartlardan dinleyin ve Artikel Seçme alıştırmasını tamamlayın.',
    status: 'assigned',
    createdAt: '2026-01-01T09:00:00.000Z',
    isStarter: true,
  },
  {
    id: 'assign-starter-horen',
    titleTr: 'Hören Görevi: Tanışma Diyaloğu (Kulak Öncelikli)',
    moduleRoute: 'dinleme',
    targetId: 'horen-begrussung',
    targetLabelTr: 'Tanışma ve Selamlaşma',
    dueDateLabel: 'Hafta 2 Önerilen Görev',
    instructionsTr:
      'Önce metni gizli tutarak diyaloğu dinleyin; ardından Richtig/Falsch ve Lückentext sorularını çözün.',
    status: 'assigned',
    createdAt: '2026-01-01T09:05:00.000Z',
    isStarter: true,
  },
  {
    id: 'assign-starter-schreiben',
    titleTr: 'Schreiben Görevi: Kişisel Kayıt Formu ve Kısa Tanışma Notu',
    moduleRoute: 'yazma',
    targetId: 'schreiben-alltag',
    targetLabelTr: 'Kendini Tanıtma ve Kurs Kaydı',
    dueDateLabel: 'Hafta 3 Önerilen Görev',
    instructionsTr:
      'Kurs kayıt formunu doldurun, Leitpunkte ölçütlerini karşılayan kısa A1 mesajınızı yerel kural denetleyicisiyle kontrol edin.',
    status: 'assigned',
    createdAt: '2026-01-01T09:10:00.000Z',
    isStarter: true,
  },
];

export interface ClassTemplatePreset {
  id: string;
  name: string;
  levelLabel: string;
  scheduleTr: string;
  focusTopicTr: string;
  descriptionTr: string;
}

export const CLASS_TEMPLATE_PRESETS: ClassTemplatePreset[] = [
  {
    id: 'tpl-a1-morning',
    name: 'Almanca A1 · Hafta İçi Sabah Grubu',
    levelLabel: 'CEFR A1.1',
    scheduleTr: 'Salı & Perşembe · 09:30–11:00',
    focusTopicTr: 'Selamlaşma, Aile ve Günlük Diyaloglar',
    descriptionTr:
      'Yeni başlayanlar için Kelime (der/die/das), Hören ve temel Sprechen tekrarlarına odaklanan yerel sınıf şablonu.',
  },
  {
    id: 'tpl-a1-exam',
    name: 'Almanca A1 · Sınav ve Dört Beceri Atölyesi',
    levelLabel: 'CEFR A1.2',
    scheduleTr: 'Cumartesi · 13:00–15:00',
    focusTopicTr: 'Lesen, Schreiben ve 15 Soruluk A1 Deneme',
    descriptionTr:
      'Goethe/telc A1 biçimine hazırlanan öğrenciler için haftalık okuma, yazma ve sınav bankası uygulama grubu.',
  },
];

export interface StudioDraftTemplate {
  id: string;
  titleTr: string;
  kind: StudioDraftKind;
  moduleFocus: TeachingAssignmentModule;
  durationMinutes: number;
  notesTr: string;
  items: Array<{ textTr: string; sampleDe?: string }>;
}

export const STUDIO_DRAFT_TEMPLATES: StudioDraftTemplate[] = [
  {
    id: 'studio-tpl-intro',
    titleTr: '45 Dk A1 Tanışma ve Artikel Ders Akışı',
    kind: 'lesson',
    moduleFocus: 'kelime',
    durationMinutes: 45,
    notesTr:
      'Akıllı tahtada önce model telaffuz (0.8×) dinletilir, ardından öğrenciler eşli olarak tanışma sorularını uygular.',
    items: [
      {
        textTr: 'Isınma (10 dk): Selamlaşma kalıplarını sesli tekrar etme',
        sampleDe: 'Guten Morgen! Wie heißen Sie? Ich heiße Deniz.',
      },
      {
        textTr: 'Kelime & Artikel (15 dk): der Name, die Sprache, das Land renk kodlarıyla çalışma',
        sampleDe: 'Ich komme aus der Türkei und lerne Deutsch.',
      },
      {
        textTr: 'Dinleme (10 dk): Begrüßung & Kennenlernen diyaloğunu metinsiz dinleme',
        sampleDe: 'Woher kommst du? Ich wohne jetzt in Berlin.',
      },
      {
        textTr: 'Kapanış & Ödev (10 dk): Sessiz Sinema veya Artikel Quiz ile hızlı kontrol',
      },
    ],
  },
  {
    id: 'studio-tpl-cafe',
    titleTr: 'A1 Kafe Siparişi & Alışveriş Ödev Kontrol Listesi',
    kind: 'homework',
    moduleFocus: 'konusma',
    durationMinutes: 30,
    notesTr:
      'Ev çalışması için öğrencilere sırasıyla okuma, dinleme ve rol oyunu adımları verilir.',
    items: [
      {
        textTr: 'Okuma: Kafe menüsündeki içecek ve fiyatları inceleme',
        sampleDe: 'Ein Kaffee kostet zwei Euro fünfzig.',
      },
      {
        textTr: 'Konuşma: Nazik sipariş kalıbını (Ich möchte…) 3 kez sesli tekrar etme',
        sampleDe: 'Ich möchte bitte einen Tee und ein Käsebrot.',
      },
      {
        textTr: 'Yazma: Kısa kafe/buluşma notu yazarak Leitpunkte denetimi yapma',
        sampleDe: 'Treffen wir uns um 15 Uhr im Café?',
      },
      {
        textTr: 'Değerlendirme: Quiz Merkezinde Günlük İletişim filtresiyle 4 soru çözme',
      },
    ],
  },
];

export interface StudioAudioPreset {
  id: string;
  categoryTr: string;
  labelTr: string;
  textDe: string;
  textTr: string;
}

export const STUDIO_AUDIO_PRESETS: StudioAudioPreset[] = [
  {
    id: 'audio-classroom-1',
    categoryTr: 'Sınıf Yönergesi',
    labelTr: 'Dinleyin ve tekrar edin',
    textDe: 'Guten Tag! Hören Sie bitte zu und sprechen Sie nach.',
    textTr: 'İyi günler! Lütfen dinleyin ve ardından tekrar edin.',
  },
  {
    id: 'audio-intro-1',
    categoryTr: 'Tanışma',
    labelTr: 'Ad, şehir ve dil tanıtımı',
    textDe: 'Hallo, ich heiße Ela. Ich komme aus Izmir und wohne in München.',
    textTr: 'Merhaba, benim adım Ela. İzmir’den geliyorum ve Münih’te yaşıyorum.',
  },
  {
    id: 'audio-article-1',
    categoryTr: 'Artikel Vurgusu',
    labelTr: 'der / die / das örnek üçlüsü',
    textDe: 'Der Kaffee, die Milch, das Brot. Zum Frühstück trinke ich gern Tee.',
    textTr: 'Kahve, süt, ekmek. Kahvaltıda severek çay içerim.',
  },
  {
    id: 'audio-cafe-1',
    categoryTr: 'Kafe & Fiyat',
    labelTr: 'Nazik sipariş ve hesap',
    textDe: 'Entschuldigung, ich möchte einen Kaffee und ein Stück Kuchen. Was kostet das?',
    textTr: 'Affedersiniz, bir kahve ve bir dilim pasta istiyorum. Bu ne kadar?',
  },
  {
    id: 'audio-way-1',
    categoryTr: 'Yön Tarifi',
    labelTr: 'İstasyon yolu sorma',
    textDe: 'Gehen Sie bitte geradeaus und dann an der Kreuzung links. Der Bahnhof ist rechts.',
    textTr: 'Lütfen düz gidin ve sonra kavşaktan sola dönün. İstasyon sağda.',
  },
  {
    id: 'audio-umlaut-1',
    categoryTr: 'Özel Sesler (ä, ö, ü, ß)',
    labelTr: 'Umlaut ve Eszett telaffuz testi',
    textDe: 'Die Straße ist schön groß. Wir frühstücken um acht Uhr in der Küche.',
    textTr: 'Cadde oldukça büyük. Saat sekizde mutfakta kahvaltı yapıyoruz.',
  },
];

export interface CurriculumPreviewItem {
  id: string;
  moduleRoute: TeachingAssignmentModule;
  targetId: string;
  moduleLabelTr: string;
  titleTr: string;
  germanHeadlineDe: string;
  turkishMeaningTr: string;
  teachingTipTr: string;
}

/**
 * Real Stage 1-6 A1 curriculum preview items surfaced in Öğretmen Stüdyosu
 * for classroom screen sharing, model audio testing, and 1-click assignment creation.
 */
export const CURRICULUM_PREVIEW_ITEMS: CurriculumPreviewItem[] = [
  ...GERMAN_A1_TOPICS.map((topic) => {
    const sampleWords = topic.words.slice(0, 3);
    return {
      id: `prev-vocab-${topic.id}`,
      moduleRoute: 'kelime' as const,
      targetId: topic.id,
      moduleLabelTr: 'Kelime (Wortschatz)',
      titleTr: `${topic.titleTr} (${topic.words.length} sözcük)`,
      germanHeadlineDe: sampleWords.map((w) => `${w.article} ${w.word}`).join(' · '),
      turkishMeaningTr: sampleWords.map((w) => `${w.word} = ${w.turkish}`).join(' · '),
      teachingTipTr: `Örnek cümle: "${sampleWords[0].exampleDe}" — ${sampleWords[0].articleTipTr}`,
    };
  }),
  ...GERMAN_A1_LISTENING_SCENARIOS.map((sc) => ({
    id: `prev-listen-${sc.id}`,
    moduleRoute: 'dinleme' as const,
    targetId: sc.id,
    moduleLabelTr: 'Dinleme (Hören)',
    titleTr: sc.titleTr,
    germanHeadlineDe: `${sc.lines[0].textDe} ${sc.lines[1]?.textDe ?? ''}`.trim(),
    turkishMeaningTr: `${sc.lines[0].textTr} ${sc.lines[1]?.textTr ?? ''}`.trim(),
    teachingTipTr: `${sc.contextLabelTr} · ${sc.lines.length} replik, 6 anlama sorusu.`,
  })),
  ...GERMAN_A1_READING_SCENARIOS.map((sc) => ({
    id: `prev-read-${sc.id}`,
    moduleRoute: 'okuma' as const,
    targetId: sc.id,
    moduleLabelTr: 'Okuma (Lesen)',
    titleTr: `${sc.titleTr} (${sc.document.formatLabelTr})`,
    germanHeadlineDe: sc.document.paragraphsDe[0] ?? sc.titleDe,
    turkishMeaningTr: sc.document.paragraphsTr[0] ?? sc.subtitleTr,
    teachingTipTr: `Sözlük desteğiyle ${sc.glossary.length} anahtar ifade ve 6 A1 okuma sorusu.`,
  })),
  ...GERMAN_A1_WRITING_SCENARIOS.map((sc) => ({
    id: `prev-write-${sc.id}`,
    moduleRoute: 'yazma' as const,
    targetId: sc.id,
    moduleLabelTr: 'Yazma (Schreiben)',
    titleTr: sc.titleTr,
    germanHeadlineDe: sc.messageTask.promptDe,
    turkishMeaningTr: sc.messageTask.promptTr,
    teachingTipTr: `Form doldurma + en az ${sc.messageTask.minWords} kelimelik mesaj (Leitpunkte yerel kural denetimli).`,
  })),
  ...GERMAN_A1_SPEAKING_SCENARIOS.map((sc) => ({
    id: `prev-speak-${sc.id}`,
    moduleRoute: 'konusma' as const,
    targetId: sc.id,
    moduleLabelTr: 'Konuşma (Sprechen)',
    titleTr: sc.titleTr,
    germanHeadlineDe: sc.repeatItems[0]?.textDe ?? sc.titleDe,
    turkishMeaningTr: sc.repeatItems[0]?.textTr ?? sc.subtitleTr,
    teachingTipTr: `Nachsprechen, kılavuzlu Leitfragen ve ${sc.roleplay.turns.length} turlu rol oyunu.`,
  })),
  {
    id: 'prev-act-karaoke',
    moduleRoute: 'karaoke',
    targetId: 'all-karaoke',
    moduleLabelTr: 'Karaoke Stüdyosu',
    titleTr: GERMAN_A1_KARAOKE_TRACKS[0].titleTr,
    germanHeadlineDe: GERMAN_A1_KARAOKE_TRACKS[0].lines
      .slice(0, 2)
      .map((l) => l.textDe)
      .join(' '),
    turkishMeaningTr: GERMAN_A1_KARAOKE_TRACKS[0].lines
      .slice(0, 2)
      .map((l) => l.textTr)
      .join(' '),
    teachingTipTr: 'Ders başında ritmik telaffuz ısınması için 0.8× hızda sınıfça okunabilir.',
  },
  {
    id: 'prev-act-charade',
    moduleRoute: 'sessiz-sinema',
    targetId: 'all-charades',
    moduleLabelTr: 'Sessiz Sinema',
    titleTr: `Sınıf Canlandırma Kartı (${GERMAN_A1_CHARADES.length} kart)`,
    germanHeadlineDe: GERMAN_A1_CHARADES[0].germanClueDe,
    turkishMeaningTr: `Hedef: ${GERMAN_A1_CHARADES[0].targetDe} (${GERMAN_A1_CHARADES[0].targetTr})`,
    teachingTipTr: `Mim ipucu: ${GERMAN_A1_CHARADES[0].mimeCueTr}`,
  },
  {
    id: 'prev-act-quiz',
    moduleRoute: 'quiz-merkezi',
    targetId: 'all-quiz',
    moduleLabelTr: 'Quiz Merkezi',
    titleTr: `Karma A1 Tarama (${GERMAN_A1_QUIZ_QUESTIONS.length} soru)`,
    germanHeadlineDe: GERMAN_A1_QUIZ_QUESTIONS[0].promptDe,
    turkishMeaningTr: GERMAN_A1_QUIZ_QUESTIONS[0].questionTr,
    teachingTipTr: GERMAN_A1_QUIZ_QUESTIONS[0].explanationTr,
  },
];

export function formatStudioDraftAsPlainText(draft: StudioDraft): string {
  const kindLabel =
    draft.kind === 'lesson'
      ? 'Ders Planı'
      : draft.kind === 'quiz'
      ? 'Kısa Quiz Taslağı'
      : 'Ödev Kontrol Listesi';

  const levelTag = draft.courseId === 'de-A2' ? 'ALMANCA CEFR A2' : 'ALMANCA CEFR A1';

  const lines: string[] = [
    `TEACHERS KINGDOM · ${levelTag} (${kindLabel})`,
    `Başlık: ${draft.titleTr}`,
    `Odak Modül: ${getModuleLabelTr(draft.moduleFocus)} · Süre: ${draft.durationMinutes} dk`,
    '',
  ];

  if (draft.notesTr.trim()) {
    lines.push(`Öğretmen Notu: ${draft.notesTr.trim()}`, '');
  }

  lines.push('ADIMLAR / KONTROL LİSTESİ:');
  draft.items.forEach((item, idx) => {
    const box = item.checked ? '[x]' : '[ ]';
    lines.push(`${idx + 1}. ${box} ${item.textTr}`);
    if (item.sampleDe && item.sampleDe.trim()) {
      lines.push(`   DE: ${item.sampleDe.trim()}`);
    }
  });

  lines.push('', 'Not: Teachers Kingdom yerel tarayıcı stüdyosu çıktısıdır (teacherskingdom.net).');
  return lines.join('\n');
}
