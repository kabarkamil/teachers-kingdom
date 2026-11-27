import type {
  GermanA2ProgressState,
  StudioDraftKind,
  TeachingAssignmentModule,
} from '../types';
import {
  A2_ARENA_IDS,
  A2_CHARADE_IDS,
  A2_EXAM_IDS,
  A2_KARAOKE_IDS,
  A2_QUIZ_IDS,
  GERMAN_A2_CHARADES,
  GERMAN_A2_EXAM_QUESTIONS,
  GERMAN_A2_KARAOKE_TRACKS,
  GERMAN_A2_QUIZ_QUESTIONS,
} from './germanA2Activities';
import {
  GERMAN_A2_LISTENING_SCENARIOS,
  getA2ListeningExerciseIds,
} from './germanA2Listening';
import {
  GERMAN_A2_READING_SCENARIOS,
  getA2ReadingExerciseIds,
} from './germanA2Reading';
import {
  GERMAN_A2_SPEAKING_SCENARIOS,
  getA2SpeakingScenarioTaskIds,
} from './germanA2Speaking';
import { ALL_A2_WORDS, GERMAN_A2_TOPICS } from './germanA2Vocab';
import {
  GERMAN_A2_WRITING_SCENARIOS,
  getA2WritingScenarioTaskIds,
} from './germanA2Writing';
import type {
  A1ModuleOption,
  ClassTemplatePreset,
  CurriculumPreviewItem,
  StudioAudioPreset,
  StudioDraftTemplate,
  TargetLiveProgress,
} from './germanA1Teaching';

/**
 * Full CEFR A2 teaching module catalog mapped directly to active Stage 1–6 A2 modules
 * (`tk_course_de_a2_progress_v1`).
 */
export const TEACHING_A2_MODULE_CATALOG: A1ModuleOption[] = [
  {
    route: 'kelime',
    labelTr: 'A2 Kelime (Wortschatz)',
    shortLabelTr: 'A2 Kelime',
    targets: GERMAN_A2_TOPICS.map((u) => ({
      id: u.id,
      labelTr: u.titleTr,
      subtitleDe: `${u.titleDe} · ${u.words.length} kelime`,
    })),
  },
  {
    route: 'dinleme',
    labelTr: 'A2 Dinleme (Hören)',
    shortLabelTr: 'A2 Dinleme',
    targets: GERMAN_A2_LISTENING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · ${getA2ListeningExerciseIds(s).length} soru`,
    })),
  },
  {
    route: 'okuma',
    labelTr: 'A2 Okuma (Lesen)',
    shortLabelTr: 'A2 Okuma',
    targets: GERMAN_A2_READING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.document.formatLabelDe} · ${getA2ReadingExerciseIds(s).length} soru`,
    })),
  },
  {
    route: 'yazma',
    labelTr: 'A2 Yazma (Schreiben)',
    shortLabelTr: 'A2 Yazma',
    targets: GERMAN_A2_WRITING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · ${getA2WritingScenarioTaskIds(s).length} görev`,
    })),
  },
  {
    route: 'konusma',
    labelTr: 'A2 Konuşma (Sprechen)',
    shortLabelTr: 'A2 Konuşma',
    targets: GERMAN_A2_SPEAKING_SCENARIOS.map((s) => ({
      id: s.id,
      labelTr: s.titleTr,
      subtitleDe: `${s.titleDe} · ${getA2SpeakingScenarioTaskIds(s).length} pratik`,
    })),
  },
  {
    route: 'karaoke',
    labelTr: 'A2 Karaoke Stüdyosu',
    shortLabelTr: 'A2 Karaoke',
    targets: [
      {
        id: 'all-a2-karaoke',
        labelTr: 'Tüm A2 Karaoke Parçaları',
        subtitleDe: `${A2_KARAOKE_IDS.length} ritmik A2 parçası`,
      },
    ],
  },
  {
    route: 'sessiz-sinema',
    labelTr: 'A2 Sessiz Sinema (Scharade)',
    shortLabelTr: 'A2 Sessiz Sinema',
    targets: [
      {
        id: 'all-a2-charades',
        labelTr: 'A2 Sessiz Sinema Kart Destesi',
        subtitleDe: `${A2_CHARADE_IDS.length} günlük A2 kartı`,
      },
    ],
  },
  {
    route: 'arena',
    labelTr: 'A2 Arena (Hızlı Tekrar)',
    shortLabelTr: 'A2 Arena',
    targets: [
      {
        id: 'all-a2-arena',
        labelTr: 'A2 Hızlı Tekrar Arenası',
        subtitleDe: `${A2_ARENA_IDS.length} A2 sorusu`,
      },
    ],
  },
  {
    route: 'quiz-merkezi',
    labelTr: 'A2 Quiz Merkezi',
    shortLabelTr: 'A2 Quiz Merkezi',
    targets: [
      {
        id: 'all-a2-quiz',
        labelTr: 'A2 Konu Filtreli Quizler',
        subtitleDe: `${A2_QUIZ_IDS.length} A2 sorusu`,
      },
    ],
  },
  {
    route: 'sinav-modu',
    labelTr: 'A2 Sınav Modu / Sınav Bankası',
    shortLabelTr: 'A2 Sınavı',
    targets: [
      {
        id: 'all-a2-exam',
        labelTr: 'CEFR A2 4 Bölümlü Deneme Sınavı',
        subtitleDe: `${A2_EXAM_IDS.length} soruluk sınav`,
      },
    ],
  },
];

/**
 * Computes strictly real browser progress for any linked CEFR A2 module & target
 * from `tk_course_de_a2_progress_v1` without fabricating metrics.
 */
export function getA2TargetLiveProgress(
  moduleRoute: TeachingAssignmentModule,
  targetId: string | undefined,
  a2Progress: GermanA2ProgressState,
  uniqueA2CompletedWordIds: string[]
): TargetLiveProgress {
  switch (moduleRoute) {
    case 'kelime': {
      const unit = GERMAN_A2_TOPICS.find((u) => u.id === targetId);
      const words = unit ? unit.words : ALL_A2_WORDS;
      const done = words.filter((w) => uniqueA2CompletedWordIds.includes(w.id)).length;
      const total = words.length;
      return {
        done,
        total,
        unitLabelTr: 'kelime',
        percent: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    }
    case 'dinleme': {
      const scenario = GERMAN_A2_LISTENING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getA2ListeningExerciseIds(scenario)
        : GERMAN_A2_LISTENING_SCENARIOS.flatMap((s) => getA2ListeningExerciseIds(s));
      const done = ids.filter((id) => a2Progress.listeningMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'soru',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'okuma': {
      const scenario = GERMAN_A2_READING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getA2ReadingExerciseIds(scenario)
        : GERMAN_A2_READING_SCENARIOS.flatMap((s) => getA2ReadingExerciseIds(s));
      const done = ids.filter((id) => a2Progress.readingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'soru',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'yazma': {
      const scenario = GERMAN_A2_WRITING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getA2WritingScenarioTaskIds(scenario)
        : GERMAN_A2_WRITING_SCENARIOS.flatMap((s) => getA2WritingScenarioTaskIds(s));
      const done = ids.filter((id) => a2Progress.writingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'görev',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'konusma': {
      const scenario = GERMAN_A2_SPEAKING_SCENARIOS.find((s) => s.id === targetId);
      const ids = scenario
        ? getA2SpeakingScenarioTaskIds(scenario)
        : GERMAN_A2_SPEAKING_SCENARIOS.flatMap((s) => getA2SpeakingScenarioTaskIds(s));
      const done = ids.filter((id) => a2Progress.speakingMasteredIds.includes(id)).length;
      return {
        done,
        total: ids.length,
        unitLabelTr: 'pratik',
        percent: ids.length > 0 ? Math.round((done / ids.length) * 100) : 0,
      };
    }
    case 'karaoke': {
      const done = A2_KARAOKE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: A2_KARAOKE_IDS.length,
        unitLabelTr: 'parça',
        percent: A2_KARAOKE_IDS.length > 0 ? Math.round((done / A2_KARAOKE_IDS.length) * 100) : 0,
      };
    }
    case 'sessiz-sinema': {
      const done = A2_CHARADE_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: A2_CHARADE_IDS.length,
        unitLabelTr: 'kart',
        percent: A2_CHARADE_IDS.length > 0 ? Math.round((done / A2_CHARADE_IDS.length) * 100) : 0,
      };
    }
    case 'arena': {
      const done = A2_ARENA_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: A2_ARENA_IDS.length,
        unitLabelTr: 'soru',
        percent: A2_ARENA_IDS.length > 0 ? Math.round((done / A2_ARENA_IDS.length) * 100) : 0,
      };
    }
    case 'quiz-merkezi': {
      const done = A2_QUIZ_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: A2_QUIZ_IDS.length,
        unitLabelTr: 'soru',
        percent: A2_QUIZ_IDS.length > 0 ? Math.round((done / A2_QUIZ_IDS.length) * 100) : 0,
      };
    }
    case 'sinav-modu': {
      const done = A2_EXAM_IDS.filter((id) => a2Progress.activityMasteredIds.includes(id)).length;
      return {
        done,
        total: A2_EXAM_IDS.length,
        unitLabelTr: 'soru',
        percent: A2_EXAM_IDS.length > 0 ? Math.round((done / A2_EXAM_IDS.length) * 100) : 0,
      };
    }
  }
}

export interface A2ClassTemplatePreset extends ClassTemplatePreset {
  courseId: 'de-A2';
}

export const A2_CLASS_TEMPLATE_PRESETS: A2ClassTemplatePreset[] = [
  {
    id: 'tpl-a2-alltag',
    courseId: 'de-A2',
    name: 'Almanca A2 · İş, Günlük Yaşam & Bağlaçlar Grubu',
    levelLabel: 'CEFR A2.1',
    scheduleTr: 'Pazartesi & Çarşamba · 18:30–20:00',
    focusTopicTr: 'A2 Wortschatz (Çoğul), weil/deshalb/dass ve Perfekt',
    descriptionTr:
      'A1 temelini tamamlayan öğrenciler için A2 kelime çoğulları, kulak öncelikli dinleme ve günlük randevu/yazışma pratiği grubu.',
  },
  {
    id: 'tpl-a2-exam',
    courseId: 'de-A2',
    name: 'Almanca A2 · Sertifika Sınavı ve İletişim Atölyesi',
    levelLabel: 'CEFR A2.2',
    scheduleTr: 'Pazar · 11:00–13:00',
    focusTopicTr: 'A2 Schreiben (du/Sie), Sprechen Rol Oyunu & 16 Soruluk Sınav',
    descriptionTr:
      'Goethe-Zertifikat A2 / telc A2 biçiminde e-posta yazma, ortak planlama konuşması ve 4 bölümlü A2 deneme sınavı hazırlık şubesi.',
  },
];

export interface A2AssignmentQuickTemplate {
  id: string;
  titleTr: string;
  moduleRoute: TeachingAssignmentModule;
  targetId: string;
  targetLabelTr: string;
  dueDateLabel: string;
  instructionsTr: string;
}

export const A2_ASSIGNMENT_QUICK_TEMPLATES: A2AssignmentQuickTemplate[] = [
  {
    id: 'a2-tpl-vocab',
    titleTr: 'A2 Ünite 1: İş Hayatı Kelimeleri, Artikel ve Çoğul Tekrarı',
    moduleRoute: 'kelime',
    targetId: GERMAN_A2_TOPICS[0]?.id ?? 'a2-arbeit-alltag',
    targetLabelTr: GERMAN_A2_TOPICS[0]?.titleTr ?? 'İş Hayatı ve Günlük Planlama',
    dueDateLabel: 'A2 Hafta 1 Görevi',
    instructionsTr:
      'A2 İş Hayatı ünitesindeki 10 sözcüğü çoğul biçimleriyle dinleyin; Artikel & Çoğul ve Bağlam Tamamlama modlarını çözün.',
  },
  {
    id: 'a2-tpl-schreiben',
    titleTr: 'A2 Schreiben: Davet Reddi / Randevu Erteleme E-Postası (Leitpunkte)',
    moduleRoute: 'yazma',
    targetId: GERMAN_A2_WRITING_SCENARIOS[0]?.id ?? 'a2-schreiben-einladung',
    targetLabelTr: GERMAN_A2_WRITING_SCENARIOS[0]?.titleTr ?? 'Davet Yanıtı ve Yeni Tarih Önerisi',
    dueDateLabel: 'A2 Hafta 2 Görevi',
    instructionsTr:
      '3 Leitpunkt koşulunu ve uygun hitap/kapanışı (du veya Sie) kullanarak e-postanızı yazın; yerel kural denetleyicisiyle kontrol edin.',
  },
  {
    id: 'a2-tpl-exam',
    titleTr: 'A2 Sınav Bankası: 4 Bölümlü 16 Soruluk CEFR A2 Denemesi',
    moduleRoute: 'sinav-modu',
    targetId: 'all-a2-exam',
    targetLabelTr: 'CEFR A2 4 Bölümlü Deneme Sınavı',
    dueDateLabel: 'A2 Dönem Sonu Değerlendirme',
    instructionsTr:
      'Wortschatz, Grammatik & Nebensätze, Leseverstehen ve Alltag & Kommunikation bölümlerinden oluşan 16 soruluk A2 sınavını tamamlayın.',
  },
];

export interface A2StudioDraftTemplate extends StudioDraftTemplate {
  courseId: 'de-A2';
}

export const A2_STUDIO_DRAFT_TEMPLATES: A2StudioDraftTemplate[] = [
  {
    id: 'studio-tpl-a2-nebensaetze',
    courseId: 'de-A2',
    titleTr: '45 Dk A2 Yan Cümleler (weil/dass/deshalb) ve Perfekt Ders Akışı',
    kind: 'lesson' as StudioDraftKind,
    moduleFocus: 'kelime',
    durationMinutes: 45,
    notesTr:
      'Önce model cümleler 0.8× hızda dinletilir; ardından yan cümlede fiilin sona gitmesi (weil/dass) ile 2. sırada kalması (deshalb) karşılaştırılır.',
    items: [
      {
        textTr: 'Isınma (10 dk): A2 İş & Günlük Yaşam sözcüklerinin artikel ve çoğul tekrarı',
        sampleDe: 'Der Termin ist wichtig, deshalb prüfe ich meinen Kalender.',
      },
      {
        textTr: 'Dinleme (12 dk): A2 randevu veya doktor diyaloğunu kulak öncelikli oynatma',
        sampleDe: 'Ich bleibe heute zu Hause, weil ich seit gestern Fieber habe.',
      },
      {
        textTr: 'Yazma Kılavuzu (13 dk): 3 Leitpunkt ile kısa A2 erteleme mesajı kurma',
        sampleDe: 'Können wir den Termin auf Donnerstag verschieben?',
      },
      {
        textTr: 'Kapanış (10 dk): A2 Quiz Merkezinde Grammatik & Nebensätze filtresinden 3 soru',
      },
    ],
  },
  {
    id: 'studio-tpl-a2-communication',
    courseId: 'de-A2',
    titleTr: 'A2 Ortak Planlama (Sprechen) & E-Posta Ödev Kontrol Listesi',
    kind: 'homework' as StudioDraftKind,
    moduleFocus: 'konusma',
    durationMinutes: 35,
    notesTr:
      'Ev çalışması için okuma metni analizi, 4 turlu ortak planlama konuşması ve kısa yazma denetimi birleştirilir.',
    items: [
      {
        textTr: 'Okuma: A2 e-posta veya şehir rehberini okuyup Richtig/Falsch/Nicht im Text sorularını çözme',
        sampleDe: 'Am Wochenende fahren wir mit dem Zug an den See.',
      },
      {
        textTr: 'Konuşma: Öneri yapma ve gerekçe bildirme kalıplarını sesli tekrar etme',
        sampleDe: 'Hast du am Samstag Zeit? Wir könnten zusammen frühstücken.',
      },
      {
        textTr: 'Yazma: du/Sie kaydına dikkat ederek en az 35 kelimelik A2 e-postası yazma',
        sampleDe: 'Es tut mir leid, dass ich nicht kommen kann. Passt dir nächstes Wochenende?',
      },
      {
        textTr: 'Tekrar: A2 Arena veya Karaoke Stüdyosunda 1 tur tamamlama',
      },
    ],
  },
];

export const A2_STUDIO_AUDIO_PRESETS: StudioAudioPreset[] = [
  {
    id: 'a2-audio-weil',
    categoryTr: 'A2 Bağlaç (weil)',
    labelTr: 'Gerekçe bildirme ve fiil sonda',
    textDe: 'Ich nehme heute die U-Bahn, weil mein Fahrrad kaputt ist.',
    textTr: 'Bugün metroya biniyorum çünkü bisikletim bozuk.',
  },
  {
    id: 'a2-audio-deshalb',
    categoryTr: 'A2 Bağlaç (deshalb)',
    labelTr: 'Sonuç cümlesi ve devrik fiil sırası',
    textDe: 'Es regnet sehr stark, deshalb bleiben wir lieber im Museum.',
    textTr: 'Çok şiddetli yağmur yağıyor, bu yüzden müzede kalmayı tercih ediyoruz.',
  },
  {
    id: 'a2-audio-termin-sie',
    categoryTr: 'A2 Resmi (Sie)',
    labelTr: 'Randevu erteleme ve yeni öneri',
    textDe: 'Guten Tag, ich muss meinen Termin leider absagen. Hätten Sie am Freitag Zeit?',
    textTr: 'İyi günler, randevumu maalesef iptal etmem gerekiyor. Cuma günü vaktiniz olur mu?',
  },
  {
    id: 'a2-audio-perfekt',
    categoryTr: 'A2 Geçmiş (Perfekt)',
    labelTr: 'Hafta sonu deneyimi anlatma',
    textDe: 'Am Samstag sind wir nach Hamburg gefahren und haben dort Freunde besucht.',
    textTr: 'Cumartesi günü Hamburg’a gittik ve orada arkadaşlarımızı ziyaret ettik.',
  },
  {
    id: 'a2-audio-seit-dativ',
    categoryTr: 'A2 Sağlık (seit + Dativ)',
    labelTr: 'Doktor muayenesinde süre belirtme',
    textDe: 'Seit drei Tagen habe ich Halsschmerzen und schlafe schlecht.',
    textTr: 'Üç gündür boğaz ağrım var ve kötü uyuyorum.',
  },
  {
    id: 'a2-audio-plan-du',
    categoryTr: 'A2 Ortak Plan (du)',
    labelTr: 'Öneri sunma ve orta yol bulma',
    textDe: 'Wollen wir am Sonntag wandern gehen, oder sollen wir lieber ins Kino gehen?',
    textTr: 'Pazar günü yürüyüşe mi çıkalım, yoksa sinemaya gitmeyi mi tercih edelim?',
  },
];

/**
 * Real Stage 1–6 CEFR A2 curriculum preview items surfaced in Öğretmen Stüdyosu
 * for classroom screen sharing, verified `de-DE` audio preview, and 1-click A2 assignment creation.
 */
export const A2_CURRICULUM_PREVIEW_ITEMS: CurriculumPreviewItem[] = [
  ...GERMAN_A2_TOPICS.map((unit) => {
    const sampleWords = unit.words.slice(0, 3);
    return {
      id: `a2-prev-vocab-${unit.id}`,
      moduleRoute: 'kelime' as const,
      targetId: unit.id,
      moduleLabelTr: 'A2 Kelime (Wortschatz)',
      titleTr: `${unit.titleTr} (${unit.words.length} sözcük)`,
      germanHeadlineDe: sampleWords.map((w) => `${w.article} ${w.word} (${w.plural})`).join(' · '),
      turkishMeaningTr: sampleWords.map((w) => `${w.word} = ${w.turkish}`).join(' · '),
      teachingTipTr: `Örnek A2 cümlesi: "${sampleWords[0].exampleDe}" — ${sampleWords[0].articlePluralTipTr}`,
    };
  }),
  ...GERMAN_A2_LISTENING_SCENARIOS.map((sc) => ({
    id: `a2-prev-listen-${sc.id}`,
    moduleRoute: 'dinleme' as const,
    targetId: sc.id,
    moduleLabelTr: 'A2 Dinleme (Hören)',
    titleTr: sc.titleTr,
    germanHeadlineDe: `${sc.lines[0]?.textDe ?? sc.titleDe} ${sc.lines[1]?.textDe ?? ''}`.trim(),
    turkishMeaningTr: `${sc.lines[0]?.textTr ?? sc.subtitleTr} ${sc.lines[1]?.textTr ?? ''}`.trim(),
    teachingTipTr: `${sc.contextLabelTr} · ${sc.lines.length} replik, ${getA2ListeningExerciseIds(sc).length} A2 sorusu.`,
  })),
  ...GERMAN_A2_READING_SCENARIOS.map((sc) => ({
    id: `a2-prev-read-${sc.id}`,
    moduleRoute: 'okuma' as const,
    targetId: sc.id,
    moduleLabelTr: 'A2 Okuma (Lesen)',
    titleTr: `${sc.titleTr} (${sc.document.formatLabelTr})`,
    germanHeadlineDe: sc.document.paragraphsDe[0] ?? sc.titleDe,
    turkishMeaningTr: sc.document.paragraphsTr[0] ?? sc.subtitleTr,
    teachingTipTr: `Richtig/Falsch/Nicht im Text + ${sc.glossary.length} A2 anahtar ifade ve ${getA2ReadingExerciseIds(sc).length} soru.`,
  })),
  ...GERMAN_A2_WRITING_SCENARIOS.map((sc) => ({
    id: `a2-prev-write-${sc.id}`,
    moduleRoute: 'yazma' as const,
    targetId: sc.id,
    moduleLabelTr: 'A2 Yazma (Schreiben)',
    titleTr: sc.titleTr,
    germanHeadlineDe: sc.messageTask.promptDe,
    turkishMeaningTr: sc.messageTask.promptTr,
    teachingTipTr: `3 bileşik Leitpunkt, ${sc.messageTask.register === 'Sie' ? 'Sie (resmi)' : 'du (samimi)'} kaydı, en az ${sc.messageTask.minWords} kelime (yerel kural kontrolü).`,
  })),
  ...GERMAN_A2_SPEAKING_SCENARIOS.map((sc) => ({
    id: `a2-prev-speak-${sc.id}`,
    moduleRoute: 'konusma' as const,
    targetId: sc.id,
    moduleLabelTr: 'A2 Konuşma (Sprechen)',
    titleTr: sc.titleTr,
    germanHeadlineDe: sc.repeatItems[0]?.phraseDe ?? sc.titleDe,
    turkishMeaningTr: sc.repeatItems[0]?.phraseTr ?? sc.subtitleTr,
    teachingTipTr: `Kalıp tekrarı, gerekçeli A2 yanıtı ve ${sc.roleplay.turns.length} turlu rol oyunu.`,
  })),
  {
    id: 'a2-prev-act-karaoke',
    moduleRoute: 'karaoke',
    targetId: 'all-a2-karaoke',
    moduleLabelTr: 'A2 Karaoke Stüdyosu',
    titleTr: GERMAN_A2_KARAOKE_TRACKS[0].titleTr,
    germanHeadlineDe: GERMAN_A2_KARAOKE_TRACKS[0].lines
      .slice(0, 2)
      .map((l) => l.textDe)
      .join(' '),
    turkishMeaningTr: GERMAN_A2_KARAOKE_TRACKS[0].lines
      .slice(0, 2)
      .map((l) => l.textTr)
      .join(' '),
    teachingTipTr: 'A2 bağlaç ve Perfekt ritmini sınıfta 0.8× hızda toplu tekrar için kullanabilirsiniz.',
  },
  {
    id: 'a2-prev-act-charade',
    moduleRoute: 'sessiz-sinema',
    targetId: 'all-a2-charades',
    moduleLabelTr: 'A2 Sessiz Sinema',
    titleTr: `A2 Canlandırma Kartları (${GERMAN_A2_CHARADES.length} kart)`,
    germanHeadlineDe: GERMAN_A2_CHARADES[0].germanClueDe,
    turkishMeaningTr: `Hedef: ${GERMAN_A2_CHARADES[0].targetDe} (${GERMAN_A2_CHARADES[0].targetTr})`,
    teachingTipTr: `Mim ipucu: ${GERMAN_A2_CHARADES[0].mimeCueTr}`,
  },
  {
    id: 'a2-prev-act-quiz',
    moduleRoute: 'quiz-merkezi',
    targetId: 'all-a2-quiz',
    moduleLabelTr: 'A2 Quiz Merkezi',
    titleTr: `Konu Filtreli A2 Tarama (${GERMAN_A2_QUIZ_QUESTIONS.length} soru)`,
    germanHeadlineDe: GERMAN_A2_QUIZ_QUESTIONS[0].promptDe,
    turkishMeaningTr: GERMAN_A2_QUIZ_QUESTIONS[0].questionTr,
    teachingTipTr: GERMAN_A2_QUIZ_QUESTIONS[0].explanationTr,
  },
  {
    id: 'a2-prev-act-exam',
    moduleRoute: 'sinav-modu',
    targetId: 'all-a2-exam',
    moduleLabelTr: 'A2 Sınav Bankası',
    titleTr: `4 Bölümlü CEFR A2 Denemesi (${GERMAN_A2_EXAM_QUESTIONS.length} soru)`,
    germanHeadlineDe: GERMAN_A2_EXAM_QUESTIONS[0].promptDe,
    turkishMeaningTr: GERMAN_A2_EXAM_QUESTIONS[0].questionTr,
    teachingTipTr: 'Wortschatz, Grammatik & Nebensätze, Leseverstehen ve Alltag & Kommunikation (4×4 soru).',
  },
];
