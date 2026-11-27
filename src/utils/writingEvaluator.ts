import type {
  WritingClozeTypedItem,
  WritingFormField,
  WritingMessageTaskData,
  WritingSatzbauItem,
} from '../types';

export interface FormFieldCheckResult {
  fieldId: string;
  isCorrect: boolean;
  status: 'empty' | 'correct' | 'capitalization' | 'incorrect';
  feedbackTr: string;
}

export interface SubConditionCheckResult {
  id: string;
  labelTr: string;
  passed: boolean;
  missingHintTr: string;
}

export interface BulletCheckResult {
  id: string;
  labelDe: string;
  labelTr: string;
  /** True ONLY when EVERY independent sub-condition for this Leitpunkt passes. */
  covered: boolean;
  subConditionResults: SubConditionCheckResult[];
  hintTr: string;
}

export interface NounCapitalizationWarning {
  found: string;
  expected: string;
}

export interface MessageEvaluationResult {
  passed: boolean;
  wordCount: number;
  uniqueWordCount: number;
  minWords: number;
  minUniqueWords: number;
  meetsWordCount: boolean;
  meetsWordDiversity: boolean;
  hasGermanClauseStructure: boolean;
  detectedVerbCount: number;
  hasPunctuation: boolean;
  hasSentenceStartCapitalization: boolean;
  coveredBulletsCount: number;
  totalBullets: number;
  bulletResults: BulletCheckResult[];
  nounCapitalizationWarnings: NounCapitalizationWarning[];
  pitfallWarnings: string[];
  structuralWarnings: string[];
  summaryTr: string;
}

export interface ControlledCheckResult {
  isCorrect: boolean;
  status: 'empty' | 'correct' | 'capitalization' | 'article-hint' | 'incorrect';
  feedbackTr: string;
  assembledText?: string;
}

function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const GERMAN_WORD_CHAR = '[A-Za-zÄÖÜäöüß]';

/**
 * Broad curated list of common CEFR A1 German finite/modal/auxiliary verb forms
 * used solely as a local structural guard against verbless keyword lists or off-topic text.
 */
const A1_GERMAN_VERB_PATTERN = new RegExp(
  `(?<!${GERMAN_WORD_CHAR})(?:` +
    [
      'bin', 'bist', 'ist', 'sind', 'seid',
      'habe', 'hast', 'hat', 'haben', 'habt',
      'heiße', 'heisse', 'heißt', 'heisst', 'heißen', 'heissen',
      'wohne', 'wohnst', 'wohnt', 'wohnen',
      'lebe', 'lebst', 'lebt', 'leben',
      'komme', 'kommst', 'kommt', 'kommen', 'komm',
      'lerne', 'lernst', 'lernt', 'lernen',
      'besuche', 'besuchst', 'besucht', 'besuchen',
      'beginnt', 'beginnen', 'startet', 'starten',
      'treffe', 'triffst', 'trifft', 'treffen',
      'sehe', 'siehst', 'sieht', 'sehen',
      'freue', 'freust', 'freut', 'freuen',
      'möchte', 'möchtest', 'möchten', 'hätte', 'hätten',
      'will', 'willst', 'wollen',
      'kann', 'kannst', 'können', 'könnt',
      'muss', 'musst', 'müssen',
      'darf', 'darfst', 'dürfen',
      'reserviere', 'reservierst', 'reserviert', 'reservieren',
      'bestelle', 'bestellst', 'bestellt', 'bestellen',
      'trinke', 'trinkst', 'trinkt', 'trinken',
      'esse', 'isst', 'essen',
      'gehe', 'gehst', 'geht', 'gehen',
      'fahre', 'fährst', 'fährt', 'fahren',
      'mache', 'machst', 'macht', 'machen',
      'nehme', 'nimmst', 'nimmt', 'nehmen',
      'hole', 'holst', 'holt', 'holen', 'abholen',
      'klingele', 'klingle', 'klingeln', 'klingel',
      'bringe', 'bringst', 'bringt', 'bringen',
      'gebe', 'gibst', 'gibt', 'geben',
      'liege', 'liegst', 'liegt', 'liegen',
      'bleibe', 'bleibst', 'bleibt', 'bleiben',
      'suche', 'suchst', 'sucht', 'suchen',
      'brauche', 'brauchst', 'braucht', 'brauchen',
      'finde', 'findest', 'findet', 'finden',
      'mag', 'magst', 'mögen',
      'spreche', 'sprichst', 'spricht', 'sprechen',
      'arbeite', 'arbeitest', 'arbeitet', 'arbeiten',
      'spiele', 'spielst', 'spielt', 'spielen',
      'schreibe', 'schreibst', 'schreibt', 'schreiben',
      'lese', 'liest', 'lesen',
      'höre', 'hörst', 'hört', 'hören',
      'frage', 'fragst', 'fragt', 'fragen',
      'danke', 'bedanke',
      'warte', 'wartest', 'wartet', 'warten',
      'kaufe', 'kaufst', 'kauft', 'kaufen',
      'kostet', 'kosten',
      'zahle', 'zahlst', 'zahlt', 'zahlen', 'bezahle', 'bezahlen',
      'stelle', 'stellst', 'stellt', 'stellen',
      'angenommen', 'abgeholt', 'reserviert', 'gebucht',
    ].join('|') +
    `)(?!${GERMAN_WORD_CHAR})`,
  'giu'
);

/**
 * Common German A1 subject-verb agreement and preposition/article pitfalls
 * checked across all guided A1 writing tasks in addition to scenario-specific rules.
 */
const GLOBAL_A1_PITFALL_RULES: Array<{
  pattern: string;
  caseSensitive?: boolean;
  messageTr: string;
}> = [
  {
    pattern: `(?<!${GERMAN_WORD_CHAR})ich\\s+(?:wohnen|kommen|lernen|machen|fahren|trinken|essen|bestellen|reservieren|haben|sein|heißen|heissen|gehen|nehmen|bleiben)(?!${GERMAN_WORD_CHAR})`,
    messageTr:
      '"ich" öznesiyle fiil mastar (-en) hâlinde kalmaz, "-e" ekiyle çekimlenir (ör. "ich wohne", "ich komme", "ich fahre", "ich habe").',
  },
  {
    pattern: `(?<!${GERMAN_WORD_CHAR})wir\\s+(?:bin|bist|ist|habe|hast|hat|komme|kommst|kommt|fahre|fährst|fährt|mache|machst|macht|trifft|gehe|geht)(?!${GERMAN_WORD_CHAR})`,
    messageTr:
      '"wir" öznesiyle fiil çoğul çekimlenir (ör. "wir sind", "wir haben", "wir kommen", "wir treffen", "wir fahren").',
  },
  {
    pattern: `(?<!${GERMAN_WORD_CHAR})du\\s+(?:bin|ist|sind|habe|hat|haben|komme|kommt|kommen|fahre|fährt|fahren|mache|macht|machen|wohne|wohnt|wohnen)(?!${GERMAN_WORD_CHAR})`,
    messageTr:
      '"du" öznesiyle fiil "-st" alacak şekilde çekimlenir (ör. "du bist", "du hast", "du kommst", "du fährst").',
  },
];

/**
 * Checks a single German A1 form field with transparent capitalization and accuracy feedback.
 */
export function evaluateFormField(
  field: WritingFormField,
  rawInput: string
): FormFieldCheckResult {
  const cleaned = normalizeWhitespace(rawInput);

  if (!cleaned) {
    return {
      fieldId: field.id,
      isCorrect: false,
      status: 'empty',
      feedbackTr: `Bu alan boş bırakılamaz. İpucu: ${field.tipTr}`,
    };
  }

  const exactMatch = field.acceptedValues.some((val) => val === cleaned);
  if (exactMatch) {
    return {
      fieldId: field.id,
      isCorrect: true,
      status: 'correct',
      feedbackTr: 'Doğru dolduruldu.',
    };
  }

  const lowerCleaned = cleaned.toLocaleLowerCase('de-DE');
  const caseInsensitiveMatch = field.acceptedValues.find(
    (val) => val.toLocaleLowerCase('de-DE') === lowerCleaned
  );

  if (caseInsensitiveMatch) {
    if (field.caseSensitiveCapitalization) {
      return {
        fieldId: field.id,
        isCorrect: false,
        status: 'capitalization',
        feedbackTr: `Bilgi doğru, ancak Almancada isimler ve özel adlar büyük harfle başlar: "${caseInsensitiveMatch}" yazınız.`,
      };
    }
    return {
      fieldId: field.id,
      isCorrect: true,
      status: 'correct',
      feedbackTr: 'Doğru dolduruldu.',
    };
  }

  return {
    fieldId: field.id,
    isCorrect: false,
    status: 'incorrect',
    feedbackTr: `Bilgi metinle eşleşmiyor. ${field.tipTr}`,
  };
}

/**
 * Transparent, local rule-based A1 message check.
 * - Evaluates EVERY required sub-condition of EVERY Leitpunkt independently (strict logical AND).
 * - Checks word count, unique word diversity (blocks repetitive padding), basic A1 German verb/clause presence,
 *   sentence-ending punctuation, sentence-start capitalization, German noun capitalization, and target A1 pitfalls.
 * - Explicitly scoped as a local rule-based check; never claims full German grammar grading or external AI/server evaluation.
 */
export function evaluateGuidedMessage(
  task: WritingMessageTaskData,
  rawText: string
): MessageEvaluationResult {
  const trimmed = rawText.trim();
  const words = trimmed
    ? trimmed
        .split(/\s+/)
        .map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
        .filter(Boolean)
    : [];

  const wordCount = words.length;
  const lowerWords = words.map((w) => w.toLocaleLowerCase('de-DE'));
  const uniqueWordCount = new Set(lowerWords).size;
  const minUniqueWords = Math.max(12, Math.floor(task.minWords * 0.65));

  // Detect obvious spam padding (e.g., repeating the same word 3+ times in a row or >30% of words)
  let hasConsecutiveSpam = false;
  let streak = 1;
  const freqMap = new Map<string, number>();
  for (let i = 0; i < lowerWords.length; i += 1) {
    const w = lowerWords[i];
    freqMap.set(w, (freqMap.get(w) ?? 0) + 1);
    if (i > 0 && lowerWords[i] === lowerWords[i - 1]) {
      streak += 1;
      if (streak >= 3) hasConsecutiveSpam = true;
    } else {
      streak = 1;
    }
  }
  const maxSingleWordCount = freqMap.size > 0 ? Math.max(...freqMap.values()) : 0;
  const hasExcessiveRepetition =
    hasConsecutiveSpam || (wordCount >= 12 && maxSingleWordCount / wordCount > 0.3);

  const meetsWordCount = wordCount >= task.minWords;
  const meetsWordDiversity = uniqueWordCount >= minUniqueWords && !hasExcessiveRepetition;
  const hasPunctuation = /[.!?]/.test(trimmed);

  // Strip email addresses before checking German verbs and lowercase nouns
  const textWithoutEmails = trimmed.replace(/\S+@\S+\.\S+/g, ' ');

  const verbMatches = textWithoutEmails.match(A1_GERMAN_VERB_PATTERN) ?? [];
  const detectedVerbCount = verbMatches.length;
  const hasGermanClauseStructure = detectedVerbCount >= 2;

  // Check if the first letter of the message starts with an uppercase character
  const firstLetterMatch = trimmed.match(/[A-Za-zÄÖÜäöüß]/);
  const firstStartsUpper = firstLetterMatch
    ? firstLetterMatch[0] === firstLetterMatch[0].toLocaleUpperCase('de-DE')
    : false;

  // Check if sentences after . ! ? begin with uppercase
  const afterSentenceBreakLower = /[.!?]\s+[a-zäöüß]/.test(trimmed);
  const hasSentenceStartCapitalization = firstStartsUpper && !afterSentenceBreakLower;

  // Evaluate EVERY required sub-condition independently; a bullet is covered ONLY when ALL sub-conditions pass
  const bulletResults: BulletCheckResult[] = task.bullets.map((bullet) => {
    const subConditionResults: SubConditionCheckResult[] = bullet.requiredSubConditions.map(
      (sub) => {
        let passed = false;
        try {
          const flags = sub.caseSensitive ? 'u' : 'iu';
          const regex = new RegExp(sub.pattern, flags);
          passed = regex.test(trimmed);
        } catch {
          passed = false;
        }
        return {
          id: sub.id,
          labelTr: sub.labelTr,
          passed,
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
      subConditionResults,
      hintTr: bullet.hintTr,
    };
  });

  const coveredBulletsCount = bulletResults.filter((b) => b.covered).length;

  // Check lowercase occurrences of key German nouns in the scenario
  const nounCapitalizationWarnings: NounCapitalizationWarning[] = [];
  for (const expectedNoun of task.nounCapitalizationTargets) {
    const lowerTarget = expectedNoun.toLocaleLowerCase('de-DE');
    const regex = new RegExp(
      `(?<!${GERMAN_WORD_CHAR})${escapeRegExp(lowerTarget)}(?!${GERMAN_WORD_CHAR})`,
      'u'
    );
    if (regex.test(textWithoutEmails)) {
      nounCapitalizationWarnings.push({
        found: lowerTarget,
        expected: expectedNoun,
      });
    }
  }

  // Evaluate both scenario-specific and global A1 grammar/article pitfall rules
  const pitfallWarnings: string[] = [];
  const allPitfallRules = [...task.pitfallRules, ...GLOBAL_A1_PITFALL_RULES];
  for (const rule of allPitfallRules) {
    try {
      const flags = rule.caseSensitive ? 'u' : 'iu';
      const regex = new RegExp(rule.pattern, flags);
      if (regex.test(textWithoutEmails)) {
        if (!pitfallWarnings.includes(rule.messageTr)) {
          pitfallWarnings.push(rule.messageTr);
        }
      }
    } catch {
      // Skip invalid regex defensively
    }
  }

  // Structural warnings for non-empty text
  const structuralWarnings: string[] = [];
  if (wordCount > 0 && meetsWordCount && !meetsWordDiversity) {
    structuralWarnings.push(
      `Aynı sözcükler çok sık tekrarlanmış (${uniqueWordCount} farklı sözcük). En az ${minUniqueWords} farklı sözcükle anlamlı A1 cümleleri kurun.`
    );
  }
  if (wordCount > 0 && !hasGermanClauseStructure) {
    structuralWarnings.push(
      'Metninizde yeterli Almanca fiil yapısı bulunamadı. Yalnızca anahtar sözcük listesi yerine en az iki tam A1 cümlesi (özne + çekimli fiil) yazın.'
    );
  }

  const allBulletsCovered = coveredBulletsCount === task.bullets.length;
  const passed =
    allBulletsCovered &&
    meetsWordCount &&
    meetsWordDiversity &&
    hasGermanClauseStructure &&
    hasPunctuation &&
    hasSentenceStartCapitalization &&
    nounCapitalizationWarnings.length === 0 &&
    pitfallWarnings.length === 0;

  let summaryTr = '';
  if (wordCount === 0) {
    summaryTr = 'Kontrol etmek için önce Almanca kısa mesajınızı yazın.';
  } else if (passed) {
    summaryTr =
      'Tebrikler! Tüm zorunlu içerik noktaları (ve alt öğeleri), temel cümle/fiil yapısı, büyük harf/noktalama ve hedeflenen A1 kural kontrolleri karşılandı.';
  } else if (!allBulletsCovered) {
    summaryTr = `Zorunlu noktalardan ${coveredBulletsCount}/${task.bullets.length} tanesi tüm alt öğeleriyle tamamlandı. Eksik işaretlenen alt öğeleri metninize ekleyip tekrar kontrol edin.`;
  } else if (structuralWarnings.length > 0) {
    summaryTr =
      'İçerik anahtarları görülüyor ancak tam cümle yapısı veya sözcük çeşitliliği yetersiz. Aşağıdaki yapısal uyarıyı giderip tekrar kontrol edin.';
  } else if (nounCapitalizationWarnings.length > 0 || pitfallWarnings.length > 0) {
    summaryTr =
      'İçerik noktaları tamamlandı, ancak aşağıda işaretlenen Almanca isim büyük harfi veya A1 dilbilgisi uyarısını düzeltip tekrar kontrol edin.';
  } else if (!meetsWordCount) {
    summaryTr = `Mesajınız şu an ${wordCount} sözcük içeriyor. A1 hedefi için en az ${task.minWords} sözcükle cümlelerinizi biraz genişletin.`;
  } else {
    summaryTr =
      'İçerik noktaları tamam; cümle başı büyük harf ve sonuna noktalama işareti (. / ! / ?) ekleyerek tekrar kontrol edin.';
  }

  return {
    passed,
    wordCount,
    uniqueWordCount,
    minWords: task.minWords,
    minUniqueWords,
    meetsWordCount,
    meetsWordDiversity,
    hasGermanClauseStructure,
    detectedVerbCount,
    hasPunctuation,
    hasSentenceStartCapitalization,
    coveredBulletsCount,
    totalBullets: task.bullets.length,
    bulletResults,
    nounCapitalizationWarnings,
    pitfallWarnings,
    structuralWarnings,
    summaryTr,
  };
}

/**
 * Joins sentence-building tokens cleanly, attaching punctuation without extra leading spaces.
 */
export function assembleSatzbauTokens(tokens: string[]): string {
  return tokens
    .reduce((acc, token) => {
      if (!acc) return token;
      if (/^[.,!?;:]$/.test(token)) {
        return `${acc}${token}`;
      }
      return `${acc} ${token}`;
    }, '')
    .trim();
}

/**
 * Evaluates a Satzbau (word-order building) task against all grammatically valid A1 permutations.
 */
export function evaluateSatzbau(
  item: WritingSatzbauItem,
  selectedTokens: string[]
): ControlledCheckResult {
  if (selectedTokens.length === 0) {
    return {
      isCorrect: false,
      status: 'empty',
      feedbackTr: 'Önce sözcük kartlarına tıklayarak Almanca cümleyi oluşturun.',
    };
  }

  const assembled = assembleSatzbauTokens(selectedTokens);

  if (selectedTokens.length < item.tokens.length) {
    return {
      isCorrect: false,
      status: 'incorrect',
      assembledText: assembled,
      feedbackTr: `Henüz tüm sözcükleri yerleştirmediniz (${selectedTokens.length}/${item.tokens.length}). Tüm parçaları kullanarak cümleyi tamamlayın.`,
    };
  }

  const exactMatch = item.acceptedSentencesDe.some(
    (valid) => normalizeWhitespace(valid) === normalizeWhitespace(assembled)
  );

  if (exactMatch) {
    return {
      isCorrect: true,
      status: 'correct',
      assembledText: assembled,
      feedbackTr: `Doğru cümle dizimi! ${item.explanationTr}`,
    };
  }

  return {
    isCorrect: false,
    status: 'incorrect',
    assembledText: assembled,
    feedbackTr: `Sözcük sırası A1 cümle yapısıyla uyuşmuyor. Çekimli fiilin 2. konumda (veya soru cümlesinde doğru yerde) olmasına dikkat edin. ${item.explanationTr}`,
  };
}

const LEADING_ARTICLE_REGEX = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/i;

/**
 * Evaluates a typed Lückentext-Schreiben blank with explicit capitalization and article/case feedback.
 */
export function evaluateTypedCloze(
  item: WritingClozeTypedItem,
  rawInput: string
): ControlledCheckResult {
  const cleaned = normalizeWhitespace(rawInput);

  if (!cleaned) {
    return {
      isCorrect: false,
      status: 'empty',
      feedbackTr: `Lütfen boşluğa uygun Almanca sözcüğü yazın. İpucu: ${item.hintTr}`,
    };
  }

  // Exact match check
  if (item.acceptedAnswers.some((ans) => ans === cleaned)) {
    return {
      isCorrect: true,
      status: 'correct',
      feedbackTr: `Doğru! ${item.explanationTr}`,
    };
  }

  // Check if user accidentally included a leading article in a bare-noun blank
  if (item.disallowLeadingArticle && LEADING_ARTICLE_REGEX.test(cleaned)) {
    const stripped = cleaned.replace(LEADING_ARTICLE_REGEX, '').trim();
    const matchesBare = item.acceptedAnswers.some(
      (ans) => ans.toLocaleLowerCase('de-DE') === stripped.toLocaleLowerCase('de-DE')
    );
    if (matchesBare) {
      return {
        isCorrect: false,
        status: 'article-hint',
        feedbackTr: `Boşluktan önce artikel zaten yer aldığı için buraya yalnızca çıplak isim yazılmalıdır: "${item.canonicalAnswer}".`,
      };
    }
  }

  // Check explicit case/article distractor hints (e.g. "ein" instead of "einen")
  if (item.caseArticleHints) {
    const matchedHint = item.caseArticleHints.find(
      (hint) => hint.wrongValue.toLocaleLowerCase('de-DE') === cleaned.toLocaleLowerCase('de-DE')
    );
    if (matchedHint) {
      return {
        isCorrect: false,
        status: 'article-hint',
        feedbackTr: matchedHint.messageTr,
      };
    }
  }

  // Check German noun capitalization
  const ciMatch = item.acceptedAnswers.find(
    (ans) => ans.toLocaleLowerCase('de-DE') === cleaned.toLocaleLowerCase('de-DE')
  );
  if (ciMatch) {
    if (item.requiresCapitalizedNoun) {
      return {
        isCorrect: false,
        status: 'capitalization',
        feedbackTr: `Sözcük doğru, ancak Almancada tüm isimler büyük harfle başlar: "${ciMatch}" yazınız.`,
      };
    }
    return {
      isCorrect: true,
      status: 'correct',
      feedbackTr: `Doğru! ${item.explanationTr}`,
    };
  }

  return {
    isCorrect: false,
    status: 'incorrect',
    feedbackTr: `Beklenen yanıtla eşleşmedi. İpucu: ${item.hintTr} — ${item.explanationTr}`,
  };
}
