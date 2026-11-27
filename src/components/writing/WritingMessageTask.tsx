import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  Mail,
  Play,
  RotateCcw,
  Square,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import type { WritingMessageTaskData } from '../../types';
import {
  getGermanVoiceInfo,
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type SpeechFailureReason,
} from '../../utils/speech';
import {
  evaluateGuidedMessage,
  type MessageEvaluationResult,
} from '../../utils/writingEvaluator';
import { GermanCharBar } from './GermanCharBar';

interface WritingMessageTaskProps {
  scenarioId: string;
  task: WritingMessageTaskData;
}

type ModelSpeechStatus = 'idle' | 'starting' | 'playing' | 'ended' | 'unavailable';
type ReadAloudRate = 0.8 | 1.0;

export const WritingMessageTask: React.FC<WritingMessageTaskProps> = ({ scenarioId, task }) => {
  const { progress, recordWritingAnswer } = useAppState();
  const [draft, setDraft] = useState('');
  const [evaluation, setEvaluation] = useState<MessageEvaluationResult | null>(null);
  const [hasAttemptedCheck, setHasAttemptedCheck] = useState(false);
  const [lastXpAwarded, setLastXpAwarded] = useState<number | null>(null);
  const [showTurkish, setShowTurkish] = useState(false);
  const [showRedemittel, setShowRedemittel] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const [speechSupported] = useState<boolean>(() => isSpeechSynthesisSupported());
  const [voiceName, setVoiceName] = useState<string | null>(() => getGermanVoiceInfo().voiceName);
  const [speechStatus, setSpeechStatus] = useState<ModelSpeechStatus>(() =>
    isSpeechSynthesisSupported() ? 'idle' : 'unavailable'
  );
  const [speechUnavailableReason, setSpeechUnavailableReason] = useState<string | null>(() =>
    isSpeechSynthesisSupported()
      ? null
      : 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor; örnek metni okuyarak inceleyebilirsiniz.'
  );
  const [rate, setRate] = useState<ReadAloudRate>(1.0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isMastered = progress.writingMasteredIds.includes(task.id);

  // Sync voice info if browser loads voices asynchronously
  useEffect(() => {
    if (!speechSupported) return;
    const refresh = () => setVoiceName(getGermanVoiceInfo().voiceName);
    refresh();
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refresh);
    };
  }, [speechSupported]);

  // Reset state & stop speech when scenario changes
  useEffect(() => {
    stopGermanSpeech();
    setDraft('');
    setEvaluation(null);
    setHasAttemptedCheck(false);
    setLastXpAwarded(null);
    setShowTurkish(false);
    setShowRedemittel(false);
    setShowModelAnswer(false);
    setSpeechStatus(speechSupported ? 'idle' : 'unavailable');
    setSpeechUnavailableReason(
      speechSupported
        ? null
        : 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor; örnek metni okuyarak inceleyebilirsiniz.'
    );
  }, [task.id, speechSupported]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const liveWordCount = draft.trim()
    ? draft
        .trim()
        .split(/\s+/)
        .filter((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').length > 0).length
    : 0;

  const handleInsertChar = (ch: string) => {
    const el = textareaRef.current;
    if (el && typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = `${draft.slice(0, start)}${ch}${draft.slice(end)}`;
      setDraft(next);
      window.requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + ch.length, start + ch.length);
      });
    } else {
      setDraft((prev) => `${prev}${ch}`);
    }
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluateGuidedMessage(task, draft);
    setEvaluation(res);
    setHasAttemptedCheck(true);

    if (res.wordCount > 0) {
      const earned = recordWritingAnswer(task.id, scenarioId, 'message', task.titleTr, res.passed);
      setLastXpAwarded(earned);
    } else {
      setLastXpAwarded(null);
    }
  };

  const handleClear = () => {
    setDraft('');
    setEvaluation(null);
    setLastXpAwarded(null);
  };

  const handleSpeechFailure = (reason?: SpeechFailureReason) => {
    setSpeechStatus('unavailable');
    if (reason === 'unsupported') {
      setSpeechUnavailableReason(
        'Bu tarayıcıda Almanca (de-DE) seslendirme desteklenmiyor. Sahte oynatma yapılmaz; örnek cevabı doğrudan okuyabilirsiniz.'
      );
    } else if (reason === 'timeout') {
      setSpeechUnavailableReason(
        'Tarayıcı ses motoru (de-DE) bu ortamda ses oynatmayı başlatamadı. Sahte oynatma yapılmaz; örnek metni okuyarak çalışabilirsiniz.'
      );
    } else {
      setSpeechUnavailableReason(
        'Tarayıcı ses sentezleyicisi örnek metni okurken bir hata döndürdü. Örnek metni sessiz olarak inceleyebilirsiniz.'
      );
    }
  };

  const handleToggleModelSpeech = () => {
    if (!speechSupported) {
      handleSpeechFailure('unsupported');
      return;
    }

    if (speechStatus === 'playing' || speechStatus === 'starting') {
      stopGermanSpeech();
      setSpeechStatus('idle');
      return;
    }

    setSpeechUnavailableReason(null);
    setSpeechStatus('starting');

    const res = speakGermanText(
      task.modelAnswerDe,
      rate === 0.8 ? 'slow' : 'normal',
      {
        onStart: () => setSpeechStatus('playing'),
        onEnd: () => setSpeechStatus('ended'),
        onError: handleSpeechFailure,
      },
      rate
    );

    if (!res.queued) {
      handleSpeechFailure(res.reason ?? 'error');
    }
  };

  const handleRateChange = (nextRate: ReadAloudRate) => {
    setRate(nextRate);
    if (speechStatus === 'playing') {
      setSpeechStatus('starting');
      const res = speakGermanText(
        task.modelAnswerDe,
        nextRate === 0.8 ? 'slow' : 'normal',
        {
          onStart: () => setSpeechStatus('playing'),
          onEnd: () => setSpeechStatus('ended'),
          onError: handleSpeechFailure,
        },
        nextRate
      );
      if (!res.queued) {
        handleSpeechFailure(res.reason ?? 'error');
      }
    }
  };

  const canRevealModel = hasAttemptedCheck || isMastered;

  return (
    <div className="space-y-6">
      {/* Task Prompt & Support Controls */}
      <div className="rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 dark:border-[#282830] dark:bg-[#111113]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
              <Mail className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
              <span>{task.formatLabelTr}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#7C1D2E] dark:text-[#D9A13B]">
                {task.formatLabelDe}
              </span>
              {isMastered && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tamamlandı
                  </span>
                </>
              )}
            </div>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {task.titleTr}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRedemittel((prev) => !prev)}
              aria-expanded={showRedemittel}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                showRedemittel
                  ? 'border-[#111113] bg-[#111113] text-[#F6F6F4] dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              <BookMarked className="h-3.5 w-3.5 shrink-0" />
              <span>
                {showRedemittel ? 'Redemittel İpuçlarını Gizle' : 'İpuçları / Redemittel'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowTurkish((prev) => !prev)}
              aria-expanded={showTurkish}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                showTurkish
                  ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                  : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
              }`}
            >
              <Languages className="h-3.5 w-3.5 shrink-0" />
              <span>{showTurkish ? 'Türkçe Yönergeyi Gizle' : 'Türkçe Yönerge / Çeviri'}</span>
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#111113] dark:text-[#F4F4F5]">
          {task.promptDe}
        </p>

        {showTurkish && (
          <p className="mt-2.5 border-t border-[#E5E5DF] pt-2.5 text-xs sm:text-sm leading-relaxed text-[#52525B] dark:border-[#24242C] dark:text-[#A1A1AA]">
            {task.promptTr}
          </p>
        )}

        {/* 4 Required A1 Leitpunkte */}
        <div className="mt-4 border-t border-[#E5E5DF] pt-4 dark:border-[#24242C]">
          <p className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
            Yazınızda Bulunması Gereken 4 A1 Nokta (Leitpunkte)
          </p>
          <ul className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {task.bullets.map((bullet, idx) => {
              const evalBullet = evaluation?.bulletResults.find((b) => b.id === bullet.id);
              return (
                <li
                  key={bullet.id}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs ${
                    evalBullet
                      ? evalBullet.covered
                        ? 'border-[#15803D]/40 bg-[#F0FDF4] text-[#14532D] dark:border-[#4ADE80]/30 dark:bg-[#102418] dark:text-[#BBF7D0]'
                        : 'border-[#B91C1C]/40 bg-[#FEF2F2] text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#2A1215] dark:text-[#FECACA]'
                      : 'border-[#E5E5DF] bg-[#FFFFFF] text-[#111113] dark:border-[#24242C] dark:bg-[#16161A] dark:text-[#E4E4E7]'
                  }`}
                >
                  {evalBullet ? (
                    evalBullet.covered ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-3.5 w-3.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                    )
                  ) : (
                    <span className="font-mono font-semibold text-[#9A6B16] dark:text-[#D9A13B] shrink-0">
                      0{idx + 1}.
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium leading-snug">{bullet.labelDe}</p>
                    {showTurkish && (
                      <p className="mt-0.5 opacity-80">{bullet.labelTr}</p>
                    )}
                    {evalBullet && evalBullet.subConditionResults.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {evalBullet.subConditionResults.map((sub) => (
                          <li
                            key={sub.id}
                            className="flex items-start gap-1.5 text-[11px] leading-snug"
                          >
                            {sub.passed ? (
                              <CheckCircle2 className="mt-0.5 h-3 w-3 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                            ) : (
                              <XCircle className="mt-0.5 h-3 w-3 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
                            )}
                            <span>
                              <strong className="font-semibold">{sub.labelTr}:</strong>{' '}
                              {sub.passed ? 'Karşılandı' : sub.missingHintTr}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Optional Redemittel / A1 Phrase Reference (strictly study aid, no auto-fill) */}
      {showRedemittel && (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 dark:border-[#282830] dark:bg-[#111113]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                Yardımcı A1 Kalıpları (Redemittel)
              </h4>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Kendi cümlelerinizi kurarken bu kalıplardan ilham alabilirsiniz; metni kendiniz yazın.
              </p>
            </div>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {task.phrases.length} ifade
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {task.phrases.map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-lg border border-[#ECECE8] bg-[#FAFAF8] p-3 dark:border-[#24242C] dark:bg-[#16161A]"
              >
                <p className="text-[11px] font-medium text-[#9A6B16] dark:text-[#D9A13B]">
                  {phrase.categoryTr}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  {phrase.german}
                </p>
                <p className="mt-0.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                  {phrase.turkish}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learner Writing Editor */}
      <form onSubmit={handleEvaluate} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GermanCharBar onInsert={handleInsertChar} />
          <span
            className={`font-mono text-xs font-medium tabular-nums ${
              liveWordCount >= task.minWords
                ? 'text-[#15803D] dark:text-[#4ADE80]'
                : 'text-[#52525B] dark:text-[#A1A1AA]'
            }`}
          >
            {liveWordCount} / {task.minWords}+ sözcük
          </span>
        </div>

        <div>
          <label
            htmlFor={`msg-editor-${task.id}`}
            className="sr-only"
          >
            Almanca kısa mesaj yazma alanı
          </label>
          <textarea
            ref={textareaRef}
            id={`msg-editor-${task.id}`}
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Almanca mesajınızı buraya yazın… (Örn. selamlama, temel bilgi, gün/saat ve kapanış)"
            className="w-full rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-4 text-sm sm:text-[15px] leading-relaxed text-[#111113] placeholder:text-[#71717A] focus:border-[#7C1D2E] focus:outline-none dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:focus:border-[#D9A13B]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7C1D2E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#641624] dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
            >
              <span>Yazıyı Kontrol Et</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Temizle</span>
            </button>
          </div>

          <button
            type="button"
            disabled={!canRevealModel}
            onClick={() => setShowModelAnswer((prev) => !prev)}
            title={
              canRevealModel
                ? 'Örnek A1 cevabını göster veya gizle'
                : 'Örnek cevabı görmek için önce kendi yazınızı kontrol edin'
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] px-3.5 text-xs font-medium text-[#111113] transition-colors hover:bg-[#ECECE8] disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24] whitespace-nowrap"
          >
            {showModelAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>
              {showModelAnswer
                ? 'Örnek A1 Cevabı Gizle'
                : canRevealModel
                ? 'Örnek A1 Cevabı Gör'
                : 'Örnek Cevap (Önce Kontrol Edin)'}
            </span>
          </button>
        </div>
      </form>

      {/* Transparent Local Rule-Based Check Report */}
      {evaluation && (
        <div
          role="status"
          className={`rounded-xl border p-5 space-y-4 ${
            evaluation.passed
              ? 'border-[#15803D]/40 bg-[#F0FDF4] dark:border-[#4ADE80]/30 dark:bg-[#102418]'
              : 'border-[#9A6B16]/40 bg-[#FEF9EB] dark:border-[#D9A13B]/35 dark:bg-[#231D11]'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              {evaluation.passed ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 text-[#9A6B16] dark:text-[#D9A13B] shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                  Yerel Kural Tabanlı A1 Kontrol Sonucu
                  {evaluation.passed && lastXpAwarded && lastXpAwarded > 0
                    ? ` · +${lastXpAwarded} XP`
                    : evaluation.passed && isMastered
                    ? ' · Tamamlandı'
                    : ''}
                </p>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#27272A] dark:text-[#E4E4E7]">
                  {evaluation.summaryTr}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-semibold text-[#52525B] dark:text-[#D4D4D8] tabular-nums">
              Noktalar: {evaluation.coveredBulletsCount}/{evaluation.totalBullets}
            </span>
          </div>

          {/* Detailed Structural Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-[#FFFFFF]/80 px-3 py-2 text-[#111113] dark:bg-[#111113]/60 dark:text-[#E4E4E7]">
              {evaluation.meetsWordCount && evaluation.meetsWordDiversity ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
              )}
              <span className="tabular-nums">
                Sözcük: {evaluation.wordCount}/{evaluation.minWords}+ ({evaluation.uniqueWordCount} farklı)
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#FFFFFF]/80 px-3 py-2 text-[#111113] dark:bg-[#111113]/60 dark:text-[#E4E4E7]">
              {evaluation.hasGermanClauseStructure ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
              )}
              <span>
                Temel A1 fiil yapısı: {evaluation.hasGermanClauseStructure ? 'Uygun' : 'Yetersiz'}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#FFFFFF]/80 px-3 py-2 text-[#111113] dark:bg-[#111113]/60 dark:text-[#E4E4E7]">
              {evaluation.hasPunctuation ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
              )}
              <span>
                Noktalama (. ! ?): {evaluation.hasPunctuation ? 'Mevcut' : 'Eksik'}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#FFFFFF]/80 px-3 py-2 text-[#111113] dark:bg-[#111113]/60 dark:text-[#E4E4E7]">
              {evaluation.hasSentenceStartCapitalization ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-[#B91C1C] dark:text-[#F87171] shrink-0" />
              )}
              <span>
                Cümle başı büyük harf:{' '}
                {evaluation.hasSentenceStartCapitalization ? 'Uygun' : 'Kontrol edin'}
              </span>
            </div>
          </div>

          {/* Structural Warnings (word diversity / verbless fragment guard) */}
          {evaluation.structuralWarnings.length > 0 && (
            <div className="rounded-lg border border-[#B91C1C]/30 bg-[#FFFFFF]/90 p-3 text-xs text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#16161A] dark:text-[#FECACA]">
              <p className="font-semibold">Cümle Yapısı Uyarısı:</p>
              <ul className="mt-1 space-y-1">
                {evaluation.structuralWarnings.map((msg, i) => (
                  <li key={i}>• {msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Noun Capitalization Warnings */}
          {evaluation.nounCapitalizationWarnings.length > 0 && (
            <div className="rounded-lg border border-[#B91C1C]/30 bg-[#FFFFFF]/90 p-3 text-xs text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#16161A] dark:text-[#FECACA]">
              <p className="font-semibold">Almanca İsim Büyük Harf Uyarısı:</p>
              <ul className="mt-1 space-y-1">
                {evaluation.nounCapitalizationWarnings.map((w) => (
                  <li key={w.expected}>
                    • Almancada tüm isimler büyük harfle başlar:{' '}
                    <span className="font-mono line-through">{w.found}</span> →{' '}
                    <strong className="font-mono">{w.expected}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Targeted A1 Case / Article / Preposition Pitfalls */}
          {evaluation.pitfallWarnings.length > 0 && (
            <div className="rounded-lg border border-[#B91C1C]/30 bg-[#FFFFFF]/90 p-3 text-xs text-[#7F1D1D] dark:border-[#F87171]/30 dark:bg-[#16161A] dark:text-[#FECACA]">
              <p className="font-semibold">Hedef A1 Dilbilgisi / Artikel Uyarısı:</p>
              <ul className="mt-1 space-y-1">
                {evaluation.pitfallWarnings.map((msg, i) => (
                  <li key={i}>• {msg}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
            Yerel kural tabanlı A1 kontrolüdür; harici yapay zekâ notlandırması değildir. Örnek A1 yanıtla da karşılaştırabilirsiniz.
          </p>
        </div>
      )}

      {/* Optional Model A1 Response with Verified de-DE Read-Aloud */}
      {showModelAnswer && (
        <div className="rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 space-y-4 dark:border-[#282830] dark:bg-[#111113]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E5DF] pb-3.5 dark:border-[#24242C]">
            <div>
              <p className="text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
                Örnek A1 Cevabı (Musterlösung)
              </p>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                Kendi yazdığınız metinle cümle düzeni ve selamlama yapısını karşılaştırabilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={!speechSupported}
                onClick={handleToggleModelSpeech}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#111113] px-3 text-xs font-medium text-[#F6F6F4] transition-colors hover:bg-[#27272A] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap"
              >
                {speechStatus === 'playing' || speechStatus === 'starting' ? (
                  <>
                    <Square className="h-3.5 w-3.5" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Örneği Dinle</span>
                  </>
                )}
              </button>

              <div
                role="group"
                aria-label="Örnek seslendirme hızı"
                className="flex items-center rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] p-0.5 dark:border-[#282830] dark:bg-[#16161A]"
              >
                <button
                  type="button"
                  disabled={!speechSupported}
                  onClick={() => handleRateChange(0.8)}
                  className={`rounded-md px-2 py-1 font-mono text-xs font-medium ${
                    rate === 0.8
                      ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  0.8×
                </button>
                <button
                  type="button"
                  disabled={!speechSupported}
                  onClick={() => handleRateChange(1.0)}
                  className={`rounded-md px-2 py-1 font-mono text-xs font-medium ${
                    rate === 1.0
                      ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                      : 'text-[#52525B] dark:text-[#A1A1AA]'
                  }`}
                >
                  1.0×
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm sm:text-[15px] leading-relaxed font-medium text-[#111113] dark:text-[#F4F4F5]">
              {task.modelAnswerDe}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
              {task.modelAnswerTr}
            </p>
          </div>

          {/* Honest TTS status line */}
          <div className="flex items-center gap-1.5 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <span>
              {speechStatus === 'starting'
                ? 'Ses motoru başlatılıyor…'
                : speechStatus === 'playing'
                ? 'Örnek Almanca cevap seslendiriliyor'
                : speechStatus === 'ended'
                ? 'Sesli okuma tamamlandı'
                : speechStatus === 'unavailable'
                ? 'Sesli okuma kullanılamıyor'
                : voiceName
                ? `İsteğe bağlı de-DE seslendirme (${voiceName})`
                : 'İsteğe bağlı de-DE seslendirme'}
            </span>
          </div>

          {(speechStatus === 'unavailable' || speechUnavailableReason) && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-[#9A6B16]/40 bg-[#FEF9EB] px-3.5 py-2.5 text-xs leading-relaxed text-[#713F12] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#FDE68A]"
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>{speechUnavailableReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
