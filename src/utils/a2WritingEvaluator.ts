import type { A2WritingMessageTaskData, A2WritingRegister } from '../types';

export interface A2WritingBulletSubResult {
  id: string;
  labelTr: string;
  passed: boolean;
  missingHintTr: string;
}

export interface A2WritingBulletEvaluation {
  id: string;
  labelDe: string;
  labelTr: string;
  covered: boolean;
  hintTr: string;
  subConditionResults: A2WritingBulletSubResult[];
}

export interface A2WritingStructureResult {
  id: string;
  labelTr: string;
  exampleDe: string;
  passed: boolean;
  missingHintTr: string;
}

export interface A2WritingRegisterEvaluation {
  expectedRegister: A2WritingRegister;
  greetingPresent: boolean;
  closingPresent: boolean;
  formalAddressOk: boolean;
  hasCrossRegisterMismatch: boolean;
  passed: boolean;
  feedbackTr: string;
}

export interface A2WritingEvaluationResult {
  passed: boolean;
  scorePercent: number;
  wordCount: number;
  minWords: number;
  meetsWordCount: boolean;
  uniqueWordCount: number;
  minUniqueWords: number;
  meetsUniqueDiversity: boolean;
  sentenceCount: number;
  minSentences: number;
  meetsSentenceCount: boolean;
  detectedVerbCount: number;
  hasVerbStructure: boolean;
  registerCheck: A2WritingRegisterEvaluation;
  bulletResults: A2WritingBulletEvaluation[];
  allBulletsCovered: boolean;
  structureResults: A2WritingStructureResult[];
  allStructuresCovered: boolean;
  hasSentencePunctuation: boolean;
  hasSentenceStartCapitalization: boolean;
  nounCapitalizationWarnings: string[];
  pitfallWarnings: string[];
  summaryTr: string;
  honestNoticeTr: string;
}

const GERMAN_A2_COMMON_VERBS = new Set([
  // Auxiliaries, modals, and core finite verbs
  'bin',
  'bist',
  'ist',
  'sind',
  'seid',
  'war',
  'warst',
  'waren',
  'wart',
  'habe',
  'hast',
  'hat',
  'haben',
  'habt',
  'hatte',
  'hattest',
  'hatten',
  'werde',
  'wirst',
  'wird',
  'werden',
  'würde',
  'würden',
  'kann',
  'kannst',
  'können',
  'könnt',
  'konnte',
  'konnten',
  'könnte',
  'könnten',
  'möchte',
  'möchtest',
  'möchten',
  'muss',
  'musst',
  'müssen',
  'müsst',
  'musste',
  'mussten',
  'will',
  'willst',
  'wollen',
  'soll',
  'sollst',
  'sollen',
  'sollte',
  'sollten',
  'darf',
  'darfst',
  'dürfen',
  // Common A1/A2 everyday verbs
  'komme',
  'kommst',
  'kommt',
  'kommen',
  'gehe',
  'gehst',
  'geht',
  'gehen',
  'fahre',
  'fährst',
  'fährt',
  'fahren',
  'mache',
  'machst',
  'macht',
  'machen',
  'arbeite',
  'arbeitest',
  'arbeitet',
  'arbeiten',
  'lerne',
  'lernst',
  'lernt',
  'lernen',
  'übe',
  'übst',
  'übt',
  'üben',
  'spreche',
  'sprichst',
  'spricht',
  'sprechen',
  'danke',
  'dankst',
  'dankt',
  'danken',
  'finde',
  'findest',
  'findet',
  'finden',
  'denke',
  'denkst',
  'denkt',
  'denken',
  'meine',
  'meinst',
  'meint',
  'meinen',
  'glaube',
  'glaubst',
  'glaubt',
  'glauben',
  'plane',
  'planst',
  'plant',
  'planen',
  'treffe',
  'triffst',
  'trifft',
  'treffen',
  'schlage',
  'schlägst',
  'schlägt',
  'vorschlagen',
  'nachholen',
  'absagen',
  'funktioniert',
  'funktionieren',
  'bleibe',
  'bleibst',
  'bleibt',
  'bleiben',
  'schicke',
  'schickst',
  'schickt',
  'schicken',
  'prüfe',
  'prüft',
  'prüfen',
  'probiere',
  'probiert',
  'probieren',
  'reparieren',
  'helfe',
  'hilfst',
  'hilft',
  'helfen',
  'brauche',
  'brauchst',
  'braucht',
  'brauchen',
  'frage',
  'fragst',
  'fragt',
  'fragen',
  'koste',
  'kostet',
  'kosten',
  'beginne',
  'beginnt',
  'beginnen',
  'startet',
  'teilnehmen',
  'nehme',
  'nimmst',
  'nimmt',
  'nehmen',
  'tut',
  'tun',
  'schreibe',
  'schreibst',
  'schreibt',
  'schreiben',
  'lese',
  'liest',
  'lesen',
  'esse',
  'isst',
  'essen',
  'trinke',
  'trinkst',
  'trinkt',
  'trinken',
  'besuche',
  'besuchst',
  'besucht',
  'besuchen',
  'besichtige',
  'besichtigt',
  'besichtigen',
  'wandere',
  'wandert',
  'wandern',
  'gefallen',
  'gefällt',
  'freue',
  'freut',
  'freuen',
  'warte',
  'wartet',
  'warten',
  'hole',
  'holt',
  'holen',
  'bringe',
  'bringt',
  'bringen',
  'gebe',
  'gibst',
  'gibt',
  'geben',
  'melde',
  'meldet',
  'melden',
  'erreiche',
  'erreicht',
  'erreichen',
  'passe',
  'passt',
  'passen',
  'geht',
  'gibt',
  // Common A2 Partizip II forms
  'gefahren',
  'gewesen',
  'gemacht',
  'gegangen',
  'gegessen',
  'getrunken',
  'gesehen',
  'gesprochen',
  'gearbeitet',
  'gelernt',
  'geregnet',
  'gewandert',
  'geblieben',
  'gekommen',
  'getroffen',
  'geprüft',
  'gefragt',
  'geschrieben',
  'gelesen',
  'gekauft',
  'gekocht',
  'geschlafen',
  'gefeiert',
  'gereist',
  'gelaufen',
  'gewohnt',
  'gespielt',
  'gehört',
  'gezeigt',
  'entlüftet',
  'neugestartet',
  'fotografiert',
  'probiert',
  'telefoniert',
  'organisiert',
  'reserviert',
  'repariert',
]);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

function extractWords(text: string): string[] {
  const matches = text.match(/[A-Za-zÄÖÜäöüß0-9]+/g);
  return matches ? matches : [];
}

function countSentences(text: string): number {
  const normalized = normalizeText(text);
  if (!normalized) return 0;

  // Strip standalone salutation line (e.g. "Hallo Lukas,") and sign-off lines
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const bodyLines = lines.filter((line, idx) => {
    if (
      idx === 0 &&
      /^(hallo|liebe|lieber|hi|hey|sehr\s+geehrte|sehr\s+geehrter|guten\s+tag)\b[^.!?]*,?\s*$/i.test(
        line
      )
    ) {
      return false;
    }
    if (
      idx >= lines.length - 2 &&
      /^(liebe\s+grüße|viele\s+grüße|herzliche\s+grüße|mit\s+freundlichen\s+grüßen|freundliche\s+grüße|bis\s+bald|mach['’]?s\s+gut|schöne\s+grüße|lg|dein|deine)\b/i.test(
        line
      )
    ) {
      return false;
    }
    if (idx === lines.length - 1 && /^[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?$/.test(line)) {
      return false;
    }
    return true;
  });

  const bodyText = bodyLines.join(' ').trim();
  if (!bodyText) return 0;

  const segments = bodyText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => extractWords(s).length >= 3);

  return segments.length;
}

function checkSentenceStartCapitalization(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) return false;

  // Very first letter of the message must be uppercase
  const firstAlpha = normalized.match(/[A-Za-zÄÖÜäöüß]/);
  if (!firstAlpha || firstAlpha[0] !== firstAlpha[0].toUpperCase()) {
    return false;
  }

  // After terminal sentence punctuation (. ! ?), the next alphabetic sentence start must be uppercase.
  // Note: After a salutation comma (e.g. "Hallo Lukas,\nvielen Dank..."), lowercase is valid German orthography.
  const sentenceStarts = normalized.matchAll(/[.!?]\s+([A-Za-zÄÖÜäöüß])/g);
  for (const match of sentenceStarts) {
    const ch = match[1];
    if (ch !== ch.toUpperCase()) {
      return false;
    }
  }
  return true;
}

function detectNounCapitalizationWarnings(text: string, targets: string[]): string[] {
  const warnings: string[] = [];
  for (const noun of targets) {
    const lower = noun.toLowerCase();
    const lowerPattern = new RegExp(`(?<![A-Za-zÄÖÜäöüß])${escapeRegex(lower)}(?![A-Za-zÄÖÜäöüß])`);
    const upperPattern = new RegExp(`(?<![A-Za-zÄÖÜäöüß])${escapeRegex(noun)}(?![A-Za-zÄÖÜäöüß])`);
    if (lowerPattern.test(text) && !upperPattern.test(text)) {
      warnings.push(
        `Almancada tüm isimler büyük harfle başlar: “${lower}” yerine “${noun}” yazın.`
      );
    }
  }
  return warnings;
}

function evaluateRegister(
  expectedRegister: A2WritingRegister,
  text: string
): A2WritingRegisterEvaluation {
  if (expectedRegister === 'du') {
    const greetingPresent = /\b(hallo|liebe|lieber|hi|hey|servus)\b/i.test(text);
    const closingPresent =
      /\b(liebe\s+grüße|viele\s+grüße|herzliche\s+grüße|schöne\s+grüße|bis\s+bald|mach['’]?s\s+gut|dein|deine|lg)\b/i.test(
        text
      );
    const hasCrossRegisterMismatch =
      /\b(sehr\s+geehrte|sehr\s+geehrter|mit\s+freundlichen\s+grüßen|freundliche\s+grüße)\b/i.test(
        text
      ) || /\b(Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer)\b/.test(text);

    const passed = greetingPresent && closingPresent && !hasCrossRegisterMismatch;
    let feedbackTr = 'Samimi hitap (du), selamlama ve kapanış düzeyi bu görevle uyumlu.';
    if (hasCrossRegisterMismatch) {
      feedbackTr =
        'Hitap düzeyi uyumsuz: Bu görev yakın bir arkadaşa (du) yazılıyor; “Sehr geehrte / Mit freundlichen Grüßen / Ihnen” gibi resmî (Sie) kalıplar kullanmayın.';
    } else if (!greetingPresent && !closingPresent) {
      feedbackTr =
        'Samimi bir selamlama (ör. “Hallo …, / Liebe(r) …,”) ve kapanış (ör. “Liebe Grüße / Viele Grüße”) ekleyin.';
    } else if (!greetingPresent) {
      feedbackTr = 'Başta samimi bir selamlama eksik (ör. “Hallo Lukas,” veya “Liebe Sara,”).';
    } else if (!closingPresent) {
      feedbackTr = 'Sonda samimi bir kapanış eksik (ör. “Liebe Grüße” veya “Viele Grüße”).';
    }

    return {
      expectedRegister,
      greetingPresent,
      closingPresent,
      formalAddressOk: true,
      hasCrossRegisterMismatch,
      passed,
      feedbackTr,
    };
  }

  // Formal / Semi-formal "Sie" register
  const greetingPresent =
    /\b(sehr\s+geehrte|sehr\s+geehrter|guten\s+tag|liebe\s+frau|lieber\s+herr)\b/i.test(text);
  const closingPresent =
    /\b(mit\s+freundlichen\s+grüßen|freundliche\s+grüße|viele\s+grüße|herzliche\s+grüße)\b/i.test(
      text
    );
  const formalAddressOk = /\b(Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Frau|Herr)\b/.test(text);
  const hasCrossRegisterMismatch =
    /\b(hi|hey|bis\s+bald|mach['’]?s\s+gut|lg|du|dich|dir|dein|deine|deinen|deiner|deinem|deines)\b/i.test(
      text
    );

  const passed = greetingPresent && closingPresent && formalAddressOk && !hasCrossRegisterMismatch;
  let feedbackTr = 'Resmî/yarı-resmî hitap (Sie), selamlama ve kapanış düzeyi bu görevle uyumlu.';
  if (hasCrossRegisterMismatch) {
    feedbackTr =
      'Hitap düzeyi uyumsuz: Bu görev resmî/yarı-resmî (Sie) bir e-postadır; “du / dich / dir / dein / Hi / Bis bald” gibi samimi ifadeler kullanmayın.';
  } else if (!greetingPresent && !closingPresent) {
    feedbackTr =
      'Resmî bir selamlama (ör. “Sehr geehrte Frau …,”) ve kapanış (ör. “Mit freundlichen Grüßen”) ekleyin.';
  } else if (!greetingPresent) {
    feedbackTr =
      'Başta resmî/yarı-resmî bir selamlama eksik (ör. “Sehr geehrte Frau …,” veya “Guten Tag Frau …,”).';
  } else if (!closingPresent) {
    feedbackTr = 'Sonda resmî bir kapanış eksik (ör. “Mit freundlichen Grüßen”).';
  } else if (!formalAddressOk) {
    feedbackTr =
      'Resmî hitap zamiri eksik: Metinde büyük harfle “Sie / Ihnen / Ihr(en)” kullanın.';
  }

  return {
    expectedRegister,
    greetingPresent,
    closingPresent,
    formalAddressOk,
    hasCrossRegisterMismatch,
    passed,
    feedbackTr,
  };
}

/**
 * Honest, strict local rule-based evaluator for CEFR A2 guided writing tasks.
 * Never claims external AI grading. Every Leitpunkt requires ALL independent
 * compound sub-conditions (logical AND), register alignment (du vs. Sie),
 * target A2 connector/grammar structure, and minimum length/sentence thresholds.
 */
export function evaluateA2GuidedWriting(
  task: A2WritingMessageTaskData,
  rawText: string
): A2WritingEvaluationResult {
  const text = normalizeText(rawText);
  const words = extractWords(text);
  const wordCount = words.length;
  const meetsWordCount = wordCount >= task.minWords;

  const uniqueLowerWords = new Set(words.map((w) => w.toLowerCase()));
  const uniqueWordCount = uniqueLowerWords.size;
  const minUniqueWords = Math.max(18, Math.floor(task.minWords * 0.55));
  const meetsUniqueDiversity = uniqueWordCount >= minUniqueWords;

  const sentenceCount = countSentences(text);
  const meetsSentenceCount = sentenceCount >= task.minSentences;

  const detectedVerbCount = words.filter((w) =>
    GERMAN_A2_COMMON_VERBS.has(w.toLowerCase())
  ).length;
  const hasVerbStructure = detectedVerbCount >= 3;

  const registerCheck = evaluateRegister(task.register, text);

  // Strict independent compound sub-condition evaluation for each Leitpunkt
  const bulletResults: A2WritingBulletEvaluation[] = task.bullets.map((bullet) => {
    const subConditionResults: A2WritingBulletSubResult[] = bullet.requiredSubConditions.map(
      (sub) => {
        const regex = new RegExp(sub.pattern, sub.caseSensitive ? '' : 'i');
        return {
          id: sub.id,
          labelTr: sub.labelTr,
          passed: regex.test(text),
          missingHintTr: sub.missingHintTr,
        };
      }
    );
    const covered =
      subConditionResults.length > 0 && subConditionResults.every((sub) => sub.passed);
    return {
      id: bullet.id,
      labelDe: bullet.labelDe,
      labelTr: bullet.labelTr,
      covered,
      hintTr: bullet.hintTr,
      subConditionResults,
    };
  });
  const allBulletsCovered = bulletResults.every((b) => b.covered);

  // Target A2 structures (connectors, Perfekt, temporal prepositions, etc.)
  const structureResults: A2WritingStructureResult[] = task.structureRequirements.map((req) => {
    const regex = new RegExp(req.pattern, req.caseSensitive ? '' : 'i');
    return {
      id: req.id,
      labelTr: req.labelTr,
      exampleDe: req.exampleDe,
      passed: regex.test(text),
      missingHintTr: req.missingHintTr,
    };
  });
  const allStructuresCovered = structureResults.every((s) => s.passed);

  const hasSentencePunctuation = /[.!?]/.test(text);
  const hasSentenceStartCapitalization = checkSentenceStartCapitalization(text);
  const nounCapitalizationWarnings = detectNounCapitalizationWarnings(
    text,
    task.nounCapitalizationTargets
  );

  const pitfallWarnings: string[] = [];
  for (const rule of task.pitfallRules) {
    const regex = new RegExp(rule.pattern, rule.caseSensitive ? '' : 'i');
    if (regex.test(text)) {
      pitfallWarnings.push(rule.messageTr);
    }
  }

  // Transparent criterion-based score (strictly local rule checks)
  const totalSubConditions = bulletResults.reduce(
    (sum, b) => sum + b.subConditionResults.length,
    0
  );
  const passedSubConditions = bulletResults.reduce(
    (sum, b) => sum + b.subConditionResults.filter((s) => s.passed).length,
    0
  );
  const passedStructures = structureResults.filter((s) => s.passed).length;

  const totalChecks =
    totalSubConditions +
    structureResults.length +
    6; // wordCount, diversity, sentences, verbs, register, mechanics (punct+cap+no pitfalls)

  const mechanicsOk =
    hasSentencePunctuation &&
    hasSentenceStartCapitalization &&
    nounCapitalizationWarnings.length === 0 &&
    pitfallWarnings.length === 0;

  const passedChecks =
    passedSubConditions +
    passedStructures +
    (meetsWordCount ? 1 : 0) +
    (meetsUniqueDiversity ? 1 : 0) +
    (meetsSentenceCount ? 1 : 0) +
    (hasVerbStructure ? 1 : 0) +
    (registerCheck.passed ? 1 : 0) +
    (mechanicsOk ? 1 : 0);

  const scorePercent = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  const passed =
    meetsWordCount &&
    meetsUniqueDiversity &&
    meetsSentenceCount &&
    hasVerbStructure &&
    registerCheck.passed &&
    allBulletsCovered &&
    allStructuresCovered &&
    mechanicsOk;

  let summaryTr = '';
  if (passed) {
    summaryTr =
      'Tebrikler! 3 zorunlu A2 görev maddesi (tüm alt koşullar), hitap düzeyi, hedef A2 yapıları ve yazım kontrolleri eksiksiz geçti.';
  } else if (wordCount === 0) {
    summaryTr = 'Kontrol etmek için önce Almanca taslağınızı yazın.';
  } else if (!registerCheck.passed) {
    summaryTr = registerCheck.feedbackTr;
  } else if (!allBulletsCovered) {
    const missingCount = bulletResults.filter((b) => !b.covered).length;
    summaryTr = `${missingCount} görev maddesinde (Leitpunkt) eksik alt koşul var. Aşağıdaki kırmızı maddeleri tamamlayıp tekrar kontrol edin.`;
  } else if (!allStructuresCovered) {
    summaryTr =
      'İçerik maddeleri hazır; ancak hedef A2 dilbilgisi/bağlaç yapılarından biri eksik. Aşağıdaki A2 yapı kontrolüne bakın.';
  } else if (!meetsWordCount || !meetsSentenceCount || !meetsUniqueDiversity || !hasVerbStructure) {
    summaryTr =
      'Metin A2 uzunluk veya cümle çeşitliliği eşiğini henüz karşılamıyor. En az 4 tam cümle ve yeterli kelime sayısıyla geliştirin.';
  } else {
    summaryTr =
      'İçerik ve A2 yapıları tamam; ancak noktalama, büyük harf (isimler/cümle başı) veya A2 dilbilgisi uyarılarını düzeltmeniz gerekiyor.';
  }

  return {
    passed,
    scorePercent,
    wordCount,
    minWords: task.minWords,
    meetsWordCount,
    uniqueWordCount,
    minUniqueWords,
    meetsUniqueDiversity,
    sentenceCount,
    minSentences: task.minSentences,
    meetsSentenceCount,
    detectedVerbCount,
    hasVerbStructure,
    registerCheck,
    bulletResults,
    allBulletsCovered,
    structureResults,
    allStructuresCovered,
    hasSentencePunctuation,
    hasSentenceStartCapitalization,
    nounCapitalizationWarnings,
    pitfallWarnings,
    summaryTr,
    honestNoticeTr:
      'Dürüst değerlendirme notu: Bu kontrol harici bir yapay zeka puanlaması değildir; tarayıcınızda çalışan yerel CEFR A2 kural motoru ile görev maddeleri (Leitpunkte), hitap düzeyi (du/Sie), bağlaç/Perfekt yapıları ve yazım kuralları doğrulanır.',
  };
}
