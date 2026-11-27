import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  Info,
  Languages,
  Lightbulb,
  RotateCcw,
  Square,
  Volume2,
  XCircle,
} from 'lucide-react';
import type { A2WritingMessageTaskData } from '../../types';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import {
  evaluateA2GuidedWriting,
  type A2WritingEvaluationResult,
} from '../../utils/a2WritingEvaluator';
import {
  getGermanVoiceInfo,
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type GermanVoiceInfo,
  type SpeechFailureReason,
} from '../../utils/speech';
import { GermanCharBar } from '../writing/GermanCharBar';

interface A2WritingMessageTaskProps {
  scenarioId: string;
  task: A2WritingMessageTaskData;
}

export const A2WritingMessageTask: React.FC<A2WritingMessageTaskProps> = ({ scenarioId, task }) => {
  const { a2Progress, recordA2WritingAnswer, speechSpeed } = useAppState();
  const { locale, tx } = useI18n();
  const [draft, setDraft] = useState('');
  const [showPromptTr, setShowPromptTr] = useState(false);
  const [showScaffold, setShowScaffold] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showModelTr, setShowModelTr] = useState(false);
  const [result, setResult] = useState<A2WritingEvaluationResult | null>(null);
  const [lastXpAwarded, setLastXpAwarded] = useState<number>(0);

  // Verified speech.ts playback state for A2 model response
  const [audioStatus, setAudioStatus] = useState<'idle' | 'starting' | 'playing'>('idle');
  const [audioRateMode, setAudioRateMode] = useState<'normal' | 'slow'>(speechSpeed);
  const [audioFailureReason, setAudioFailureReason] = useState<
    SpeechFailureReason | 'not-queued' | null
  >(null);
  const [voiceInfo, setVoiceInfo] = useState<GermanVoiceInfo>(() => getGermanVoiceInfo());

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const speechRequestRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  const isMastered = a2Progress.writingMasteredIds.includes(task.id);
  const canViewModel = Boolean(result) || isMastered;

  useEffect(() => {
    isMountedRef.current = true;
    const refreshVoice = () => {
      if (isMountedRef.current) {
        setVoiceInfo(getGermanVoiceInfo());
      }
    };
    refreshVoice();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoice);
    }
    return () => {
      isMountedRef.current = false;
      speechRequestRef.current += 1;
      stopGermanSpeech();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoice);
      }
    };
  }, []);

  useEffect(() => {
    setAudioRateMode(speechSpeed);
  }, [speechSpeed]);

  useEffect(() => {
    speechRequestRef.current += 1;
    stopGermanSpeech();
    setAudioStatus('idle');
    setAudioFailureReason(null);
    setDraft('');
    setShowPromptTr(false);
    setShowScaffold(false);
    setShowModel(false);
    setShowModelTr(false);
    setResult(null);
    setLastXpAwarded(0);
  }, [task.id]);

  const liveWordCount = (draft.trim().match(/[A-Za-zÄÖÜäöüß0-9]+/g) ?? []).length;

  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setDraft((prev) => (prev ? `${prev}${snippet}` : snippet));
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const before = draft.slice(0, start);
    const after = draft.slice(end);
    const needsLeadingSpace =
      snippet.length > 1 && before.length > 0 && !/[\s\n]$/.test(before);
    const inserted = `${needsLeadingSpace ? ' ' : ''}${snippet}`;
    const nextValue = `${before}${inserted}${after}`;
    setDraft(nextValue);
    window.requestAnimationFrame(() => {
      el.focus();
      const nextPos = start + inserted.length;
      el.setSelectionRange(nextPos, nextPos);
    });
  };

  const handleEvaluate = () => {
    const evaluation = evaluateA2GuidedWriting(task, draft);
    setResult(evaluation);
    if (evaluation.wordCount === 0) {
      setLastXpAwarded(0);
      return;
    }
    const xp = recordA2WritingAnswer(
      task.id,
      scenarioId,
      'message',
      task.titleTr,
      evaluation.passed
    );
    setLastXpAwarded(xp);
  };

  const handleReset = () => {
    setDraft('');
    setResult(null);
    setLastXpAwarded(0);
    textareaRef.current?.focus();
  };

  const handleStopModelAudio = () => {
    speechRequestRef.current += 1;
    stopGermanSpeech();
    setAudioStatus('idle');
    setAudioFailureReason(null);
  };

  const handlePlayModelAudio = (rateMode: 'normal' | 'slow') => {
    if (!isSpeechSynthesisSupported()) {
      setAudioStatus('idle');
      setAudioFailureReason('unsupported');
      return;
    }
    if (audioStatus !== 'idle' && audioRateMode === rateMode) {
      handleStopModelAudio();
      return;
    }

    const reqId = ++speechRequestRef.current;
    setAudioRateMode(rateMode);
    setAudioStatus('starting');
    setAudioFailureReason(null);

    const outcome = speakGermanText(task.modelAnswerDe, rateMode, {
      onStart: () => {
        if (!isMountedRef.current || speechRequestRef.current !== reqId) return;
        setAudioStatus('playing');
      },
      onEnd: () => {
        if (!isMountedRef.current || speechRequestRef.current !== reqId) return;
        setAudioStatus('idle');
      },
      onError: (reason?: SpeechFailureReason) => {
        if (!isMountedRef.current || speechRequestRef.current !== reqId) return;
        setAudioStatus('idle');
        setAudioFailureReason(reason ?? 'error');
      },
    });

    if (!outcome.queued) {
      setAudioStatus('idle');
      setAudioFailureReason(outcome.reason === 'unsupported' ? 'unsupported' : 'not-queued');
    }
  };

  const audioFeedbackMessage =
    audioFailureReason === 'timeout'
      ? tx({
          tr: '1800 ms onstart bekçisi zaman aşımına uğradı. Tarayıcı ses motoru yanıt vermedi; örnek yanıtı metinden okuyabilirsiniz.',
          en: 'The 1800 ms onstart watchdog timed out. The browser speech engine did not respond; you can read the model answer as text.',
        })
      : audioFailureReason === 'unsupported'
      ? tx({
          tr: 'Bu tarayıcıda Web Speech (de-DE) seslendirmesi desteklenmiyor; örnek yanıtı metinden okuyabilirsiniz.',
          en: 'Web Speech (de-DE) synthesis is not supported in this browser; you can read the model answer as text.',
        })
      : audioFailureReason === 'not-queued'
      ? tx({
          tr: 'Ses kuyruğa alınamadı; örnek yanıtı metinden okuyabilirsiniz.',
          en: 'Speech could not be queued; you can read the model answer as text.',
        })
      : audioFailureReason
      ? tx({
          tr: 'Almanca seslendirme başlatılamadı. Sistem ses ayarlarını kontrol edin veya metinden inceleyin.',
          en: 'German speech playback could not start. Check system audio settings or review the text directly.',
        })
      : null;

  const voiceLabel = !voiceInfo.supported
    ? tx({
        tr: 'Tarayıcı ses sentezi desteklenmiyor',
        en: 'Browser speech synthesis is not supported',
      })
    : voiceInfo.voiceName
      ? tx(
          {
            tr: '{{name}} ({{count}} de-DE sesi)',
            en: '{{name}} ({{count}} de-DE voices)',
          },
          { name: voiceInfo.voiceName, count: voiceInfo.germanVoiceCount }
        )
      : tx({
          tr: 'Sistem varsayılan sentezleyicisi (özel de-DE sesi listelenmedi)',
          en: 'System default synthesizer (no dedicated de-DE voice listed)',
        });

  return (
    <div className="space-y-6">
      {/* Task Prompt & Non-Scored Controls */}
      <section className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              <span className="font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                {task.formatLabelTr}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{task.formatLabelDe}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                {task.registerLabelTr}
              </span>
              {isMastered && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {locale.common.completed}
                  </span>
                </>
              )}
            </div>
            <h3 className="font-display text-xl font-semibold text-[#111113] dark:text-[#F4F4F5] sm:text-2xl">
              {task.titleTr}
            </h3>
            <p className="text-sm text-[#52525B] dark:text-[#A1A1AA]" lang="de">
              {task.titleDe}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPromptTr((v) => !v)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
            >
              <Languages className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B]" />
              {showPromptTr
                ? tx({ tr: 'Türkçe Yönergeyi Gizle', en: 'Hide Turkish Prompt' })
                : tx({ tr: 'Türkçe Yönerge', en: 'Turkish Prompt' })}
            </button>
            <button
              type="button"
              onClick={() => setShowScaffold((v) => !v)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
            >
              <Lightbulb className="h-3.5 w-3.5 text-[#9A6B16] dark:text-[#D9A13B]" />
              {showScaffold
                ? tx({ tr: 'Taslak & Kalıpları Gizle', en: 'Hide Outline & Phrases' })
                : tx({ tr: 'Taslak Planı & Redemittel', en: 'Draft Outline & Redemittel' })}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <p className="text-sm leading-relaxed text-[#111113] dark:text-[#F4F4F5] sm:text-base" lang="de">
            {task.promptDe}
          </p>
          {showPromptTr && (
            <p className="rounded-lg border border-[#ECECE8] bg-[#F6F6F4] px-3.5 py-2.5 text-sm leading-relaxed text-[#52525B] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#A1A1AA]">
              {task.promptTr}
            </p>
          )}
        </div>

        {/* 3 Required A2 Leitpunkte */}
        <div className="mt-5">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Zorunlu 3 A2 Görev Maddesi (Leitpunkte)',
                en: '3 Required A2 Task Points (Leitpunkte)',
              })}
            </h4>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {tx(
                {
                  tr: 'En az {{words}} kelime · {{sentences}}+ cümle · {{register}}',
                  en: 'At least {{words}} words · {{sentences}}+ sentences · {{register}}',
                },
                {
                  words: task.minWords,
                  sentences: task.minSentences,
                  register: task.registerLabelTr,
                }
              )}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {task.bullets.map((bullet) => {
              const evalBullet = result?.bulletResults.find((b) => b.id === bullet.id);
              const boxClass = evalBullet
                ? evalBullet.covered
                  ? 'border-[#15803D]/40 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#0D2315]'
                  : 'border-[#B91C1C]/40 bg-[#FEF2F2] dark:border-[#EF4444]/35 dark:bg-[#2A1013]'
                : 'border-[#ECECE8] bg-[#F6F6F4] dark:border-[#24242C] dark:bg-[#111113]';

              return (
                <div key={bullet.id} className={`rounded-xl border p-3.5 transition-colors ${boxClass}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]" lang="de">
                      {bullet.labelDe}
                    </p>
                    {evalBullet &&
                      (evalBullet.covered ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-[#B91C1C] dark:text-[#F87171]" />
                      ))}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                    {bullet.labelTr}
                  </p>

                  {evalBullet && (
                    <ul className="mt-2.5 space-y-1.5 border-t border-[#D9D9D3]/60 pt-2 dark:border-[#282830]">
                      {evalBullet.subConditionResults.map((sub) => (
                        <li key={sub.id} className="flex items-start gap-1.5 text-[11px]">
                          {sub.passed ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
                          ) : (
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B91C1C] dark:text-[#F87171]" />
                          )}
                          <span
                            className={
                              sub.passed
                                ? 'text-[#166534] dark:text-[#86EFAC]'
                                : 'text-[#991B1B] dark:text-[#FCA5A5]'
                            }
                          >
                            <span className="font-semibold">{sub.labelTr}</span>
                            {!sub.passed && (
                              <span className="mt-0.5 block opacity-90">{sub.missingHintTr}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Non-Scored Drafting Scaffold & Redemittel */}
        {showScaffold && (
          <div className="mt-5 grid gap-4 rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-4 dark:border-[#282830] dark:bg-[#111113] lg:grid-cols-2">
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Adım Adım A2 Taslak Planı (Puanı Etkilemez)',
                  en: 'Step-by-Step A2 Draft Outline (Unscored)',
                })}
              </h5>
              <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                {task.draftingStepsTr.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Tıklayıp Ekleyebileceğiniz A2 Kalıpları (Redemittel)',
                  en: 'Click-to-Insert A2 Phrases (Redemittel)',
                })}
              </h5>
              <div className="mt-2 space-y-2">
                {task.phrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => insertAtCursor(phrase.german)}
                    className="w-full rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-2 text-left transition-colors hover:border-[#7C1D2E] dark:border-[#282830] dark:bg-[#16161A] dark:hover:border-[#D9A13B]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-medium text-[#111113] dark:text-[#F4F4F5]"
                        lang="de"
                      >
                        {phrase.german}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] font-semibold text-[#9A6B16] dark:text-[#D9A13B]">
                        {phrase.categoryTr}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                      {phrase.turkish}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Writing Editor */}
      <section className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <GermanCharBar onInsert={insertAtCursor} />
          <div className="flex items-center gap-3 text-xs font-medium">
            <span
              className={
                liveWordCount >= task.minWords
                  ? 'font-semibold text-[#15803D] dark:text-[#4ADE80]'
                  : 'text-[#52525B] dark:text-[#A1A1AA]'
              }
            >
              {tx({ tr: 'Kelime:', en: 'Words:' })}{' '}
              <strong className="font-mono tabular-nums">{liveWordCount}</strong> /{' '}
              {task.minWords}+
            </span>
          </div>
        </div>

        <label htmlFor={`a2-writing-editor-${task.id}`} className="sr-only">
          {tx({ tr: 'Almanca A2 metin alanı', en: 'German A2 writing editor' })}
        </label>
        <textarea
          id={`a2-writing-editor-${task.id}`}
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          lang="de"
          placeholder={
            task.register === 'Sie' ? 'Sehr geehrte Frau ...,\n\n...' : 'Hallo ...,\n\n...'
          }
          className="w-full rounded-xl border border-[#D9D9D3] bg-[#F6F6F4] p-4 font-sans text-sm leading-relaxed text-[#111113] placeholder:text-[#71717A] focus:border-[#7C1D2E] focus:bg-[#FFFFFF] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:placeholder:text-[#71717A] dark:focus:border-[#D9A13B] sm:text-base"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={liveWordCount === 0}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#641624] disabled:cursor-not-allowed disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452]"
            >
              <FileCheck2 className="h-4 w-4" />
              {tx({
                tr: 'Yerel Kural Motoruyla Kontrol Et',
                en: 'Check with Local Rule Engine',
              })}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={draft.length === 0 && !result}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-4 text-sm font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
            >
              <RotateCcw className="h-4 w-4" />
              {tx({ tr: 'Temizle', en: 'Clear' })}
            </button>
          </div>

          <button
            type="button"
            onClick={() => canViewModel && setShowModel((v) => !v)}
            disabled={!canViewModel}
            title={
              canViewModel
                ? tx({
                    tr: 'Örnek A2 yanıtını aç/kapat (puanı etkilemez)',
                    en: 'Toggle A2 model answer (unscored)',
                  })
                : tx({
                    tr: 'Örnek A2 yanıtını görmek için önce en az bir kez kendi taslağınızı kontrol edin',
                    en: 'Check your own draft at least once to view the A2 model answer',
                  })
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
          >
            {showModel ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showModel
              ? tx({ tr: 'Örnek A2 Yanıtını Gizle', en: 'Hide A2 Model Answer' })
              : tx({ tr: 'Örnek A2 Yanıtını Gör', en: 'View A2 Model Answer' })}
          </button>
        </div>
      </section>

      {/* Transparent Local Rule-Based Evaluation Report */}
      {result && (
        <section
          aria-live="polite"
          className={`rounded-2xl border p-5 sm:p-6 ${
            result.passed
              ? 'border-[#15803D]/40 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#0D2315]'
              : 'border-[#9A6B16]/45 bg-[#FFFFFF] dark:border-[#D9A13B]/45 dark:bg-[#16161A]'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ECECE8] pb-4 dark:border-[#24242C]">
            <div className="flex items-start gap-3">
              {result.passed ? (
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-[#9A6B16] dark:text-[#D9A13B]" />
              )}
              <div>
                <h4 className="font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {result.passed
                    ? tx({ tr: 'A2 Yazma Kontrolü Geçti', en: 'A2 Writing Check Passed' })
                    : tx({
                        tr: 'Düzeltme Gereken A2 Kriterleri Var',
                        en: 'Some A2 Criteria Need Revision',
                      })}
                </h4>
                <p className="mt-1 text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  {result.summaryTr}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3 py-1.5 text-right dark:border-[#282830] dark:bg-[#111113]">
                <div className="text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                  {tx({ tr: 'Kriter Skoru', en: 'Criteria Score' })}
                </div>
                <div className="font-mono text-base font-bold tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                  {tx({ tr: '%{{n}}', en: '{{n}}%' }, { n: result.scorePercent })}
                </div>
              </div>
              {lastXpAwarded > 0 && (
                <div className="rounded-lg border border-[#15803D]/40 bg-[#15803D] px-3 py-2 font-mono text-xs font-bold text-white dark:bg-[#4ADE80] dark:text-[#0B0B0D]">
                  +{lastXpAwarded} A2 XP
                </div>
              )}
            </div>
          </div>

          {/* Core Criteria Matrix */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-3.5 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Kelime & Çeşitlilik', en: 'Words & Diversity' })}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                <span className="font-mono tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                  {tx(
                    {
                      tr: '{{words}} kelime ({{unique}} farklı)',
                      en: '{{words}} words ({{unique}} unique)',
                    },
                    { words: result.wordCount, unique: result.uniqueWordCount }
                  )}
                </span>
                {result.meetsWordCount && result.meetsUniqueDiversity ? (
                  <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171]" />
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {tx(
                  {
                    tr: 'En az {{minWords}} kelime ve {{minUnique}} farklı sözcük',
                    en: 'At least {{minWords}} words and {{minUnique}} unique words',
                  },
                  { minWords: result.minWords, minUnique: result.minUniqueWords }
                )}
              </p>
            </div>

            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-3.5 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Cümle & Fiil Yapısı', en: 'Sentence & Verb Structure' })}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                <span className="font-mono tabular-nums text-[#111113] dark:text-[#F4F4F5]">
                  {tx(
                    {
                      tr: '{{sentences}} cümle · {{verbs}} fiil',
                      en: '{{sentences}} sentences · {{verbs}} verbs',
                    },
                    { sentences: result.sentenceCount, verbs: result.detectedVerbCount }
                  )}
                </span>
                {result.meetsSentenceCount && result.hasVerbStructure ? (
                  <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171]" />
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {tx(
                  {
                    tr: 'En az {{minSentences}} tam cümle ve 3+ çekimli/Perfekt fiil',
                    en: 'At least {{minSentences}} full sentences and 3+ conjugated/Perfekt verbs',
                  },
                  { minSentences: result.minSentences }
                )}
              </p>
            </div>

            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-3.5 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                {tx(
                  { tr: 'Hitap Düzeyi ({{register}})', en: 'Register ({{register}})' },
                  { register: task.register }
                )}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                <span className="text-[#111113] dark:text-[#F4F4F5]">
                  {result.registerCheck.passed
                    ? tx({ tr: 'Uyumlu', en: 'Consistent' })
                    : tx({ tr: 'Uyumsuz / Eksik', en: 'Inconsistent / Missing' })}
                </span>
                {result.registerCheck.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171]" />
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {result.registerCheck.feedbackTr}
              </p>
            </div>

            <div className="rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-3.5 dark:border-[#24242C] dark:bg-[#111113]">
              <div className="text-[11px] font-medium text-[#52525B] dark:text-[#A1A1AA]">
                {tx({ tr: 'Yazım & Noktalama', en: 'Spelling & Punctuation' })}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                <span className="text-[#111113] dark:text-[#F4F4F5]">
                  {result.hasSentencePunctuation &&
                  result.hasSentenceStartCapitalization &&
                  result.nounCapitalizationWarnings.length === 0
                    ? tx({ tr: 'Temiz', en: 'Clean' })
                    : tx({ tr: 'Uyarı Var', en: 'Warnings Found' })}
                </span>
                {result.hasSentencePunctuation &&
                result.hasSentenceStartCapitalization &&
                result.nounCapitalizationWarnings.length === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-[#15803D] dark:text-[#4ADE80]" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#B91C1C] dark:text-[#F87171]" />
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
                {!result.hasSentencePunctuation
                  ? tx({
                      tr: 'Cümle sonu noktalama (. ! ?) eksik.',
                      en: 'End-of-sentence punctuation (. ! ?) is missing.',
                    })
                  : !result.hasSentenceStartCapitalization
                    ? tx({
                        tr: 'Cümle başı büyük harf kuralını kontrol edin.',
                        en: 'Check sentence-initial capitalization.',
                      })
                    : result.nounCapitalizationWarnings.length > 0
                      ? tx(
                          {
                            tr: '{{count}} isim küçük harfle yazılmış.',
                            en: '{{count}} noun(s) written in lowercase.',
                          },
                          { count: result.nounCapitalizationWarnings.length }
                        )
                      : tx({
                          tr: 'Noktalama ve büyük harf kontrolleri geçti.',
                          en: 'Punctuation and capitalization checks passed.',
                        })}
              </p>
            </div>
          </div>

          {/* A2 Structure Requirements */}
          <div className="mt-4 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 dark:border-[#24242C] dark:bg-[#111113]">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">
              {tx({
                tr: 'Hedef A2 Dilbilgisi & Bağlaç Kontrolü',
                en: 'Target A2 Grammar & Connector Check',
              })}
            </h5>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
              {result.structureResults.map((st) => (
                <div
                  key={st.id}
                  className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${
                    st.passed
                      ? 'border-[#15803D]/35 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#0D2315]'
                      : 'border-[#B91C1C]/35 bg-[#FEF2F2] dark:border-[#EF4444]/35 dark:bg-[#2A1013]'
                  }`}
                >
                  {st.passed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D] dark:text-[#4ADE80]" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C] dark:text-[#F87171]" />
                  )}
                  <div>
                    <p className="font-semibold text-[#111113] dark:text-[#F4F4F5]">{st.labelTr}</p>
                    <p className="mt-0.5 text-[#52525B] dark:text-[#A1A1AA]">
                      {st.passed
                        ? tx(
                            { tr: 'Örnek kalıp: {{example}}', en: 'Example pattern: {{example}}' },
                            { example: st.exampleDe }
                          )
                        : st.missingHintTr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capitalization & A2 Pitfall Warnings */}
          {(result.nounCapitalizationWarnings.length > 0 || result.pitfallWarnings.length > 0) && (
            <div className="mt-4 space-y-2 rounded-xl border border-[#B91C1C]/35 bg-[#FEF2F2] p-4 dark:border-[#EF4444]/35 dark:bg-[#2A1013]">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#991B1B] dark:text-[#FCA5A5]">
                {tx({
                  tr: 'Tespit Edilen Yazım ve A2 Dilbilgisi Uyarıları',
                  en: 'Detected Spelling & A2 Grammar Warnings',
                })}
              </h5>
              <ul className="space-y-1.5 text-xs text-[#7F1D1D] dark:text-[#FECACA]">
                {result.pitfallWarnings.map((warn) => (
                  <li key={warn} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{warn}</span>
                  </li>
                ))}
                {result.nounCapitalizationWarnings.map((warn) => (
                  <li key={warn} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explicit Honest Evaluation Scope Note */}
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 py-2.5 text-xs text-[#52525B] dark:border-[#282830] dark:bg-[#111113] dark:text-[#A1A1AA]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6B16] dark:text-[#D9A13B]" />
            <p>{result.honestNoticeTr}</p>
          </div>
        </section>
      )}

      {/* Optional Model A2 Response with Verified speech.ts Audio Preview */}
      {showModel && canViewModel && (
        <section className="rounded-2xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#282830] dark:bg-[#16161A]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECECE8] pb-3.5 dark:border-[#24242C]">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#9A6B16] dark:text-[#D9A13B]" />
              <h4 className="font-display text-base font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'Örnek CEFR A2 Yanıtı (İnceleme Amaçlı · Puanlanmaz)',
                  en: 'Sample CEFR A2 Response (For Review · Unscored)',
                })}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handlePlayModelAudio('slow')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                  audioStatus !== 'idle' && audioRateMode === 'slow'
                    ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                {audioStatus !== 'idle' && audioRateMode === 'slow' ? (
                  <Square className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                {audioStatus === 'starting' && audioRateMode === 'slow'
                  ? locale.audio.starting
                  : audioStatus === 'playing' && audioRateMode === 'slow'
                    ? tx({ tr: 'Durdur (Yavaş)', en: 'Stop (Slow)' })
                    : tx({ tr: 'Yavaş Dinle', en: 'Listen Slowly' })}
              </button>

              <button
                type="button"
                onClick={() => handlePlayModelAudio('normal')}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                  audioStatus !== 'idle' && audioRateMode === 'normal'
                    ? 'border-[#7C1D2E] bg-[#7C1D2E] text-white dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                    : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
                }`}
              >
                {audioStatus !== 'idle' && audioRateMode === 'normal' ? (
                  <Square className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                {audioStatus === 'starting' && audioRateMode === 'normal'
                  ? locale.audio.starting
                  : audioStatus === 'playing' && audioRateMode === 'normal'
                    ? tx({ tr: 'Durdur (Normal)', en: 'Stop (Normal)' })
                    : tx({ tr: 'Normal Dinle', en: 'Listen Normal' })}
              </button>

              <button
                type="button"
                onClick={() => setShowModelTr((v) => !v)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]"
              >
                <Languages className="h-3.5 w-3.5" />
                {showModelTr
                  ? tx({ tr: 'Çeviriyi Gizle', en: 'Hide Translation' })
                  : tx({ tr: 'Türkçe Çeviri', en: 'Turkish Translation' })}
              </button>
            </div>
          </div>

          <pre
            className="mt-4 whitespace-pre-wrap rounded-xl border border-[#ECECE8] bg-[#F6F6F4] p-4 font-sans text-sm leading-relaxed text-[#111113] dark:border-[#24242C] dark:bg-[#111113] dark:text-[#F4F4F5]"
            lang="de"
          >
            {task.modelAnswerDe}
          </pre>

          {showModelTr && (
            <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-[#ECECE8] bg-[#F6F6F4]/70 p-4 font-sans text-xs leading-relaxed text-[#52525B] dark:border-[#24242C] dark:bg-[#111113]/70 dark:text-[#A1A1AA]">
              {task.modelAnswerTr}
            </pre>
          )}

          {audioFeedbackMessage && (
            <p
              role="status"
              className="mt-3 rounded-lg border border-[#9A6B16]/45 bg-[#FEF9EB] px-3.5 py-2 text-xs text-[#78350F] dark:border-[#D9A13B]/45 dark:bg-[#231D11] dark:text-[#F6D693]"
            >
              {audioFeedbackMessage}
            </p>
          )}

          <p className="mt-2.5 text-[11px] text-[#52525B] dark:text-[#A1A1AA]">
            {tx(
              {
                tr: 'Ses kaynağı: {{voice}} (speech.ts · queued + 1800 ms onstart doğrulamalı)',
                en: 'Audio source: {{voice}} (speech.ts · queued + 1800 ms onstart verified)',
              },
              { voice: voiceLabel }
            )}
          </p>
        </section>
      )}
    </div>
  );
};
