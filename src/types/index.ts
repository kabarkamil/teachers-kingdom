export type ThemeMode = 'light' | 'dark';

export type UiLanguage = 'tr' | 'en';

export type UserRole = 'student' | 'teacher';

export type CloudSyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

export interface CloudUserSession {
  userId: string;
  email: string;
}

export type SpeechSpeed = 'normal' | 'slow';

export type GermanArticle = 'der' | 'die' | 'das';

export type GermanCase = 'nom' | 'acc' | 'dat';

export type VocabMode = 'flashcards' | 'articles' | 'quiz' | 'memory';

export type ListeningExerciseKind = 'tf' | 'cloze' | 'mc';

export type ReadingExerciseKind = 'tf' | 'cloze' | 'mc';

export type WritingTaskKind = 'form' | 'message' | 'controlled';

export type SpeakingTaskKind = 'repeat' | 'prompt' | 'roleplay';

export type ActivitySubKind = 'karaoke' | 'charades' | 'arena' | 'quiz' | 'exam';

export type ActivityMode =
  | VocabMode
  | 'horen-tf'
  | 'horen-cloze'
  | 'horen-mc'
  | 'lesen-tf'
  | 'lesen-cloze'
  | 'lesen-mc'
  | 'schreiben-form'
  | 'schreiben-message'
  | 'schreiben-controlled'
  | 'sprechen-repeat'
  | 'sprechen-prompt'
  | 'sprechen-roleplay'
  | 'activity-karaoke'
  | 'activity-charades'
  | 'activity-arena'
  | 'activity-quiz'
  | 'activity-exam'
  | 'teaching-class'
  | 'teaching-assignment'
  | 'teaching-studio';

export type CourseId = 'de-A1' | 'de-A2';

export type ActiveCourseId = 'de-A1' | 'de-A2';

export type NavGroupId = 'learning' | 'activities' | 'teaching' | 'personal';

export type NavRouteId =
  | 'home'
  | 'kelime'
  | 'dinleme'
  | 'okuma'
  | 'yazma'
  | 'konusma'
  | 'karaoke'
  | 'sessiz-sinema'
  | 'arena'
  | 'quiz-merkezi'
  | 'sinav-modu'
  | 'siniflarim'
  | 'odevler'
  | 'ogretmen-studyosu'
  | 'ogrenme-yolum'
  | 'profil'
  | 'ayarlar';

export interface VocabWord {
  id: string;
  topicId: string;
  article: GermanArticle;
  word: string;
  plural: string;
  turkish: string;
  exampleDe: string;
  exampleTr: string;
  articleTipTr: string;
  contextClozeDe: string;
  /** Verified exact form that fits the ___ blank in contextClozeDe (matching exampleDe). */
  contextAnswerDe: string;
  /** Verified grammatical case required by the blank in contextClozeDe. */
  contextCase: GermanCase;
  /** Optional verified oblique singular form for weak n-declension masculine nouns (e.g. Name -> Namen). */
  obliqueFormDe?: string;
}

export interface VocabTopic {
  id: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  imageUrl: string;
  imageAlt: string;
  words: VocabWord[];
}

export type SpeakerGender = 'female' | 'male';

export interface ListeningLine {
  id: string;
  speaker: string;
  speakerGender: SpeakerGender;
  textDe: string;
  textTr: string;
}

export interface ListeningTrueFalseItem {
  id: string;
  statementDe: string;
  statementTr: string;
  isTrue: boolean;
  explanationTr: string;
}

export interface ListeningClozeItem {
  id: string;
  promptDe: string;
  hintTr: string;
  options: string[];
  correctOption: string;
  explanationTr: string;
}

export interface ListeningMcItem {
  id: string;
  questionTr: string;
  questionDe: string;
  options: string[];
  correctIndex: number;
  explanationTr: string;
}

export interface ListeningScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  imageUrl: string;
  imageAlt: string;
  lines: ListeningLine[];
  trueFalse: ListeningTrueFalseItem[];
  cloze: ListeningClozeItem[];
  multipleChoice: ListeningMcItem[];
}

export type ReadingDocumentFormat = 'email' | 'menu' | 'notice' | 'note';

export interface ReadingGlossaryItem {
  id: string;
  german: string;
  article?: GermanArticle;
  turkish: string;
  noteTr?: string;
}

export interface ReadingMenuSection {
  headingDe: string;
  headingTr: string;
  items: Array<{
    nameDe: string;
    detailDe?: string;
    price: string;
    nameTr: string;
  }>;
}

export interface ReadingDocumentContent {
  /** Short format label shown in UI (e.g. "Kişisel E-Posta", "Kafe Menüsü") */
  formatLabelTr: string;
  formatLabelDe: string;
  /** Header metadata rows (e.g. Von/An/Betreff, opening hours, address, trip info) */
  metaRows: Array<{
    labelDe: string;
    valueDe: string;
    valueTr: string;
  }>;
  /** Main German paragraphs or bulleted notice/note lines */
  paragraphsDe: string[];
  paragraphsTr: string[];
  /** Optional structured menu rows for the café menu / price list format */
  menuSections?: ReadingMenuSection[];
  /** Optional sign-off / footer note (e.g. email closing, card payment note, contact line) */
  footerNoteDe?: string;
  footerNoteTr?: string;
  /** Clean plain-text German script used for optional verified de-DE read-aloud */
  readAloudDe: string;
}

export interface ReadingTrueFalseItem {
  id: string;
  statementDe: string;
  statementTr: string;
  isTrue: boolean;
  explanationTr: string;
}

export interface ReadingClozeItem {
  id: string;
  promptDe: string;
  hintTr: string;
  /** Explicitly verified 4 options appropriate to the exact grammatical target */
  options: [string, string, string, string];
  correctOption: string;
  explanationTr: string;
}

export interface ReadingMcItem {
  id: string;
  questionTr: string;
  questionDe: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationTr: string;
}

export interface ReadingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  format: ReadingDocumentFormat;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  document: ReadingDocumentContent;
  glossary: ReadingGlossaryItem[];
  trueFalse: ReadingTrueFalseItem[];
  cloze: ReadingClozeItem[];
  multipleChoice: ReadingMcItem[];
}

export interface WritingPhraseHelper {
  id: string;
  german: string;
  turkish: string;
  categoryTr: string;
}

export interface WritingFormField {
  id: string;
  labelDe: string;
  labelTr: string;
  placeholderDe: string;
  acceptedValues: string[];
  canonicalValue: string;
  caseSensitiveCapitalization?: boolean;
  tipTr: string;
}

export interface WritingFormTaskData {
  id: string;
  titleDe: string;
  titleTr: string;
  situationDe: string;
  situationTr: string;
  fields: WritingFormField[];
}

export interface WritingBulletSubCondition {
  id: string;
  labelTr: string;
  /** Regex pattern matching valid A1 expressions for this single independent requirement. */
  pattern: string;
  /** Evaluate case-sensitively when capitalization distinguishes meaning (e.g. formal "Sie" or proper name). */
  caseSensitive?: boolean;
  missingHintTr: string;
}

export interface WritingBulletCriterion {
  id: string;
  labelDe: string;
  labelTr: string;
  /**
   * Independent sub-conditions for this Leitpunkt.
   * ALL sub-conditions must pass (logical AND — never a .some() shortcut across distinct requirements).
   */
  requiredSubConditions: WritingBulletSubCondition[];
  hintTr: string;
}

export interface WritingPitfallRule {
  id: string;
  pattern: string;
  caseSensitive?: boolean;
  messageTr: string;
}

export interface WritingMessageTaskData {
  id: string;
  formatLabelDe: string;
  formatLabelTr: string;
  titleDe: string;
  titleTr: string;
  promptDe: string;
  promptTr: string;
  minWords: number;
  bullets: WritingBulletCriterion[];
  nounCapitalizationTargets: string[];
  pitfallRules: WritingPitfallRule[];
  phrases: WritingPhraseHelper[];
  modelAnswerDe: string;
  modelAnswerTr: string;
}

export interface WritingSatzbauItem {
  id: string;
  kind: 'satzbau';
  instructionDe: string;
  instructionTr: string;
  tokens: string[];
  acceptedSentencesDe: string[];
  canonicalSentenceDe: string;
  explanationTr: string;
}

export interface WritingClozeTypedItem {
  id: string;
  kind: 'cloze-typed';
  beforeBlankDe: string;
  afterBlankDe: string;
  hintTr: string;
  acceptedAnswers: string[];
  canonicalAnswer: string;
  requiresCapitalizedNoun?: boolean;
  disallowLeadingArticle?: boolean;
  caseArticleHints?: Array<{
    wrongValue: string;
    messageTr: string;
  }>;
  explanationTr: string;
}

export type WritingControlledItem = WritingSatzbauItem | WritingClozeTypedItem;

export interface WritingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  formTask: WritingFormTaskData;
  messageTask: WritingMessageTaskData;
  controlledItems: WritingControlledItem[];
}

export interface SpeakingPhraseHelper {
  id: string;
  german: string;
  turkish: string;
  categoryTr: string;
}

export interface SpeakingSelfCheckCriterion {
  id: string;
  labelTr: string;
}

export interface SpeakingRepeatItem {
  id: string;
  titleTr: string;
  textDe: string;
  textTr: string;
  pronunciationFocusDe: string;
  pronunciationTipTr: string;
  speakerGender: SpeakerGender;
  selfCheckCriteria: SpeakingSelfCheckCriterion[];
}

export interface SpeakingPromptItem {
  id: string;
  titleTr: string;
  questionDe: string;
  questionTr: string;
  cuesDe: string[];
  cuesTr: string[];
  speakerGender: SpeakerGender;
  phrases: SpeakingPhraseHelper[];
  modelAnswerDe: string;
  modelAnswerTr: string;
  selfCheckCriteria: SpeakingSelfCheckCriterion[];
}

export interface SpeakingRoleplayTurn {
  id: string;
  turnNumber: number;
  partnerLineDe: string;
  partnerLineTr: string;
  learnerCueDe: string;
  learnerCueTr: string;
  modelResponseDe: string;
  modelResponseTr: string;
}

export interface SpeakingRoleplayTask {
  id: string;
  titleDe: string;
  titleTr: string;
  situationDe: string;
  situationTr: string;
  partnerName: string;
  partnerRoleTr: string;
  partnerGender: SpeakerGender;
  turns: SpeakingRoleplayTurn[];
  phrases: SpeakingPhraseHelper[];
  selfCheckCriteria: SpeakingSelfCheckCriterion[];
}

export interface SpeakingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  repeatItems: SpeakingRepeatItem[];
  promptItems: SpeakingPromptItem[];
  roleplay: SpeakingRoleplayTask;
}

export interface KaraokeLine {
  id: string;
  lineNumber: number;
  textDe: string;
  textTr: string;
  rhythmCueDe: string;
  focusWords: string[];
  speakerGender: SpeakerGender;
  startSec?: number;
  endSec?: number;
  sectionLabelTr?: string;
  sectionLabelEn?: string;
}

export interface KaraokeMiniQuizItem {
  id: string;
  questionTr: string;
  questionEn: string;
  promptDe: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationTr: string;
  explanationEn: string;
}

export interface KaraokeTrack {
  id: string;
  cefrLevel?: 'A1' | 'A2';
  audioUrl?: string;
  titleDe: string;
  titleTr: string;
  titleEn?: string;
  themeTr: string;
  themeEn?: string;
  tempoLabelTr: string;
  tempoLabelEn?: string;
  lines: KaraokeLine[];
  miniQuiz?: KaraokeMiniQuizItem[];
}

export interface CharadeItem {
  id: string;
  categoryTr: string;
  targetDe: string;
  targetTr: string;
  mimeCueTr: string;
  germanClueDe: string;
  grammarHintTr: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationTr: string;
}

export type ArenaPromptCategory = 'artikel' | 'anlam' | 'ifade';

export interface ArenaItem {
  id: string;
  category: ArenaPromptCategory;
  categoryLabelTr: string;
  promptDe: string;
  promptSubTr: string;
  audioTextDe?: string;
  options: string[];
  correctIndex: number;
  explanationTr: string;
}

export type QuizTopicFilter = 'artikel' | 'grammatik' | 'alltag' | 'verstehen';

export interface QuizQuestionItem {
  id: string;
  topic: QuizTopicFilter;
  topicLabelTr: string;
  questionTr: string;
  promptDe: string;
  audioTextDe?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationTr: string;
}

export type ExamSectionId = 'wortschatz' | 'grammatik' | 'lesen' | 'kommunikation';

export interface ExamQuestionItem {
  id: string;
  section: ExamSectionId;
  sectionLabelTr: string;
  sectionLabelDe: string;
  contextBoxDe?: string;
  questionTr: string;
  promptDe: string;
  audioTextDe?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationTr: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  mode: ActivityMode;
  topicId: string;
  summaryTr: string;
  xpEarned: number;
  isCorrect?: boolean;
}

export type TeachingAssignmentModule =
  | 'kelime'
  | 'dinleme'
  | 'okuma'
  | 'yazma'
  | 'konusma'
  | 'karaoke'
  | 'sessiz-sinema'
  | 'arena'
  | 'quiz-merkezi'
  | 'sinav-modu';

export type TeachingAssignmentStatus = 'assigned' | 'completed' | 'reviewed';

export interface TeachingRosterEntry {
  id: string;
  name: string;
  noteTr: string;
  addedAt: string;
}

export interface TeachingClassGroup {
  id: string;
  courseId?: ActiveCourseId;
  name: string;
  levelLabel: string;
  scheduleTr: string;
  focusTopicTr: string;
  descriptionTr: string;
  roster: TeachingRosterEntry[];
  createdAt: string;
}

export interface TeachingAssignment {
  id: string;
  courseId?: ActiveCourseId;
  titleTr: string;
  moduleRoute: TeachingAssignmentModule;
  targetId?: string;
  targetLabelTr: string;
  classId?: string;
  dueDateLabel?: string;
  instructionsTr: string;
  status: TeachingAssignmentStatus;
  completedAt?: string;
  reviewedAt?: string;
  reviewNoteTr?: string;
  createdAt: string;
  isStarter?: boolean;
}

export type StudioDraftKind = 'lesson' | 'quiz' | 'homework';

export interface StudioChecklistItem {
  id: string;
  textTr: string;
  sampleDe?: string;
  checked: boolean;
}

export interface StudioDraft {
  id: string;
  courseId?: ActiveCourseId;
  titleTr: string;
  kind: StudioDraftKind;
  moduleFocus: TeachingAssignmentModule;
  durationMinutes: number;
  notesTr: string;
  items: StudioChecklistItem[];
  updatedAt: string;
}

export interface ProgressState {
  studiedFlashcards: string[];
  articleAttempts: number;
  articleCorrect: number;
  articleMasteredIds: string[];
  quizAttempts: number;
  quizCorrect: number;
  quizMasteredIds: string[];
  memoryGamesCompleted: number;
  memoryPairsMatched: number;
  memoryAttempts: number;
  listeningAttempts: number;
  listeningCorrect: number;
  listeningMasteredIds: string[];
  readingAttempts: number;
  readingCorrect: number;
  readingMasteredIds: string[];
  writingAttempts: number;
  writingCorrect: number;
  writingMasteredIds: string[];
  speakingAttempts: number;
  speakingMasteredIds: string[];
  activityAttempts: number;
  activityCorrect: number;
  activityMasteredIds: string[];
  arenaBestStreak: number;
  examCompletedCount: number;
  examBestScorePercent: number | null;
  teachingClasses: TeachingClassGroup[];
  teachingAssignments: TeachingAssignment[];
  studioDrafts: StudioDraft[];
  assignmentCompletedIds: string[];
  teachingMilestoneIds: string[];
  xp: number;
  recentActivities: ActivityLogEntry[];
}

export type A2VocabMode = 'flashcards' | 'articles-plural' | 'meaning' | 'context';

export type A2ActivityMode =
  | 'a2-flashcards'
  | 'a2-articles-plural'
  | 'a2-meaning'
  | 'a2-context'
  | 'a2-horen-tf'
  | 'a2-horen-cloze'
  | 'a2-horen-mc'
  | 'a2-lesen-tf'
  | 'a2-lesen-cloze'
  | 'a2-lesen-mc'
  | 'a2-schreiben-message'
  | 'a2-schreiben-controlled'
  | 'a2-sprechen-repeat'
  | 'a2-sprechen-prompt'
  | 'a2-sprechen-roleplay'
  | 'a2-activity-karaoke'
  | 'a2-activity-charades'
  | 'a2-activity-arena'
  | 'a2-activity-quiz'
  | 'a2-activity-exam';

export type A2WritingTaskKind = 'message' | 'controlled';

export type A2WritingRegister = 'du' | 'Sie';

export interface A2SpeakingPhraseHelper {
  de: string;
  tr: string;
}

export interface A2SpeakingRepeatItem {
  id: string;
  phraseDe: string;
  phraseTr: string;
  pronunciationFocusDe: string;
  pronunciationTipTr: string;
  speakerGender: SpeakerGender;
  selfCheckCriteria: string[];
}

export interface A2SpeakingPromptItem {
  id: string;
  questionDe: string;
  questionTr: string;
  cuesDe: string[];
  cuesTr: string[];
  phrases: A2SpeakingPhraseHelper[];
  modelAnswerDe: string;
  modelAnswerTr: string;
  speakerGender: SpeakerGender;
  selfCheckCriteria: string[];
}

export interface A2SpeakingRoleplayTurn {
  id: string;
  partnerNameDe: string;
  partnerGender: SpeakerGender;
  partnerLineDe: string;
  partnerLineTr: string;
  learnerCueTr: string;
  sampleResponseDe: string;
  sampleResponseTr: string;
  sampleGender: SpeakerGender;
}

export interface A2SpeakingRoleplayTask {
  id: string;
  titleDe: string;
  titleTr: string;
  situationTr: string;
  partnerRoleDe: string;
  learnerRoleTr: string;
  phrases: A2SpeakingPhraseHelper[];
  turns: A2SpeakingRoleplayTurn[];
  selfCheckCriteria: string[];
}

export interface A2SpeakingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  cefrFocusTr: string;
  register: A2WritingRegister;
  registerLabelTr: string;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  repeatItems: A2SpeakingRepeatItem[];
  promptItems: A2SpeakingPromptItem[];
  roleplay: A2SpeakingRoleplayTask;
}

export interface A2WritingStructureRequirement {
  id: string;
  labelTr: string;
  pattern: string;
  exampleDe: string;
  missingHintTr: string;
  caseSensitive?: boolean;
}

export interface A2WritingMessageTaskData {
  id: string;
  formatLabelDe: string;
  formatLabelTr: string;
  titleDe: string;
  titleTr: string;
  register: A2WritingRegister;
  registerLabelTr: string;
  promptDe: string;
  promptTr: string;
  minWords: number;
  minSentences: number;
  bullets: WritingBulletCriterion[];
  structureRequirements: A2WritingStructureRequirement[];
  nounCapitalizationTargets: string[];
  pitfallRules: WritingPitfallRule[];
  phrases: WritingPhraseHelper[];
  draftingStepsTr: string[];
  modelAnswerDe: string;
  modelAnswerTr: string;
}

export interface A2WritingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  cefrFocusTr: string;
  register: A2WritingRegister;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  messageTask: A2WritingMessageTaskData;
  controlledItems: WritingControlledItem[];
}

export interface A2ListeningScenario extends ListeningScenario {
  cefrFocusTr: string;
  estimatedMinutes: number;
}

export type A2ReadingVerdict = 'richtig' | 'falsch' | 'nicht-im-text';

export type A2ReadingDocumentFormat = 'email' | 'notice' | 'guide' | 'report';

export interface A2ReadingVerdictItem {
  id: string;
  statementDe: string;
  statementTr: string;
  expectedVerdict: A2ReadingVerdict;
  explanationTr: string;
}

export interface A2ReadingScenario {
  id: string;
  titleDe: string;
  titleTr: string;
  contextLabelTr: string;
  subtitleTr: string;
  cefrFocusTr: string;
  format: A2ReadingDocumentFormat;
  estimatedMinutes: number;
  imageUrl: string;
  imageAlt: string;
  document: ReadingDocumentContent;
  /** Exact German phrases inside paragraphsDe highlighted when the learner enables key-phrase focus */
  highlightPhrasesDe: string[];
  glossary: ReadingGlossaryItem[];
  verdictItems: A2ReadingVerdictItem[];
  cloze: ReadingClozeItem[];
  multipleChoice: ReadingMcItem[];
}

export interface A2VocabWord {
  id: string;
  unitId: string;
  article: GermanArticle;
  word: string;
  /** Full plural with article, e.g. "die Berufe" */
  plural: string;
  /** Two plausible but grammatically incorrect German plural distractors */
  pluralDistractors: [string, string];
  turkish: string;
  exampleDe: string;
  exampleTr: string;
  articlePluralTipTr: string;
  /** Sentence containing a single `___` blank */
  contextClozeDe: string;
  /** Verified exact word/form that fills `___` in contextClozeDe (matching exampleDe) */
  contextAnswerDe: string;
  /** 4 curated A2 contextual options including contextAnswerDe */
  contextOptions: [string, string, string, string];
  contextNoteTr: string;
}

export interface A2VocabTopic {
  id: string;
  unitNumber: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  grammarBadgeTr: string;
  imageUrl: string;
  imageAlt: string;
  words: A2VocabWord[];
}

export interface A2ActivityLogEntry {
  id: string;
  timestamp: string;
  mode: A2ActivityMode;
  unitId: string;
  summaryTr: string;
  xpEarned: number;
  isCorrect?: boolean;
}

export interface GermanA2ProgressState {
  schemaVersion: 1;
  courseId: 'de-A2';
  studiedFlashcards: string[];
  articlePluralAttempts: number;
  articlePluralCorrect: number;
  articlePluralMasteredIds: string[];
  meaningAttempts: number;
  meaningCorrect: number;
  meaningMasteredIds: string[];
  contextAttempts: number;
  contextCorrect: number;
  contextMasteredIds: string[];
  listeningAttempts: number;
  listeningCorrect: number;
  listeningMasteredIds: string[];
  readingAttempts: number;
  readingCorrect: number;
  readingMasteredIds: string[];
  writingAttempts: number;
  writingCorrect: number;
  writingMasteredIds: string[];
  speakingAttempts: number;
  speakingMasteredIds: string[];
  activityAttempts: number;
  activityCorrect: number;
  activityMasteredIds: string[];
  a2ArenaBestStreak: number;
  a2ExamBestScorePercent: number | null;
  a2ExamCompletedCount: number;
  xp: number;
  recentActivities: A2ActivityLogEntry[];
}
