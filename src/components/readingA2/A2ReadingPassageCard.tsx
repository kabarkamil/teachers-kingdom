import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookMarked,
  FileText,
  Highlighter,
  Languages,
  Mail,
  Map,
  Pin,
  Play,
  Square,
  Volume2,
} from 'lucide-react';
import { ARTICLE_TOKENS } from '../../theme/tokens';
import { useI18n } from '../../hooks/useI18n';
import type { A2ReadingDocumentFormat, A2ReadingScenario } from '../../types';
import {
  getGermanVoiceInfo,
  isSpeechSynthesisSupported,
  speakGermanText,
  stopGermanSpeech,
  type SpeechFailureReason,
} from '../../utils/speech';

interface A2ReadingPassageCardProps {
  scenario: A2ReadingScenario;
}

type ReadAloudStatus = 'idle' | 'starting' | 'playing' | 'ended' | 'unavailable';
type ReadAloudRate = 0.8 | 1.0;
type UnavailableReasonCode = 'unsupported_initial' | 'unsupported' | 'timeout' | 'error';

const FORMAT_ICONS: Record<
  A2ReadingDocumentFormat,
  React.ComponentType<{ className?: string }>
> = {
  email: Mail,
  notice: Pin,
  guide: Map,
  report: FileText,
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderParagraphWithHighlights(
  text: string,
  phrases: string[],
  enabled: boolean
): React.ReactNode {
  if (!enabled || phrases.length === 0) {
    return text;
  }
  const cleanPhrases = phrases.filter((p) => p.trim().length > 0 && !p.includes('...'));
  if (cleanPhrases.length === 0) return text;

  const pattern = new RegExp(
    `(${cleanPhrases
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|')})`,
    'g'
  );
  const parts = text.split(pattern);
  if (parts.length <= 1) return text;

  const phraseSet = new Set(cleanPhrases);
  return parts.map((segment, idx) =>
    phraseSet.has(segment) ? (
      <mark
        key={idx}
        className="rounded-sm bg-[#D9A13B]/22 px-1 py-0.5 font-medium text-[#111113] dark:bg-[#D9A13B]/25 dark:text-[#FDE68A]"
      >
        {segment}
      </mark>
    ) : (
      <React.Fragment key={idx}>{segment}</React.Fragment>
    )
  );
}

export const A2ReadingPassageCard: React.FC<A2ReadingPassageCardProps> = ({ scenario }) => {
  const { locale, tx } = useI18n();
  const [speechSupported] = useState<boolean>(() => isSpeechSynthesisSupported());
  const [voiceName, setVoiceName] = useState<string | null>(() => getGermanVoiceInfo().voiceName);
  const [readStatus, setReadStatus] = useState<ReadAloudStatus>(() =>
    isSpeechSynthesisSupported() ? 'idle' : 'unavailable'
  );
  const [unavailableReasonCode, setUnavailableReasonCode] =
    useState<UnavailableReasonCode | null>(() =>
      isSpeechSynthesisSupported() ? null : 'unsupported_initial'
    );
  const [rate, setRate] = useState<ReadAloudRate>(1.0);
  const [activeGlossarySpeechId, setActiveGlossarySpeechId] = useState<string | null>(null);
  const [showTurkish, setShowTurkish] = useState<boolean>(false);
  const [showGlossary, setShowGlossary] = useState<boolean>(false);
  const [highlightKeyPhrases, setHighlightKeyPhrases] = useState<boolean>(false);

  // Sync voice info when browser voices load asynchronously
  useEffect(() => {
    if (!speechSupported) return;
    const refresh = () => setVoiceName(getGermanVoiceInfo().voiceName);
    refresh();
    window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', refresh);
    };
  }, [speechSupported]);

  // Reset toggles and stop any active speech when switching A2 reading scenarios
  useEffect(() => {
    stopGermanSpeech();
    setShowTurkish(false);
    setShowGlossary(false);
    setHighlightKeyPhrases(false);
    setActiveGlossarySpeechId(null);
    setReadStatus(speechSupported ? 'idle' : 'unavailable');
    setUnavailableReasonCode(speechSupported ? null : 'unsupported_initial');
  }, [scenario.id, speechSupported]);

  useEffect(() => {
    return () => stopGermanSpeech();
  }, []);

  const handleSpeechFailure = (reason?: SpeechFailureReason) => {
    setActiveGlossarySpeechId(null);
    setReadStatus('unavailable');
    if (reason === 'unsupported') {
      setUnavailableReasonCode('unsupported');
    } else if (reason === 'timeout') {
      setUnavailableReasonCode('timeout');
    } else {
      setUnavailableReasonCode('error');
    }
  };

  const handleReadAloudToggle = () => {
    if (!speechSupported) {
      handleSpeechFailure('unsupported');
      return;
    }

    if (readStatus === 'playing' || readStatus === 'starting') {
      stopGermanSpeech();
      setActiveGlossarySpeechId(null);
      setReadStatus('idle');
      return;
    }

    setActiveGlossarySpeechId(null);
    setUnavailableReasonCode(null);
    setReadStatus('starting');

    const res = speakGermanText(
      scenario.document.readAloudDe,
      rate === 0.8 ? 'slow' : 'normal',
      {
        onStart: () => setReadStatus('playing'),
        onEnd: () => setReadStatus('ended'),
        onError: handleSpeechFailure,
      },
      rate
    );

    if (!res.queued) {
      handleSpeechFailure(res.reason ?? 'error');
    }
  };

  const handleSpeedChange = (nextRate: ReadAloudRate) => {
    setRate(nextRate);
    if (readStatus === 'playing') {
      setReadStatus('starting');
      const res = speakGermanText(
        scenario.document.readAloudDe,
        nextRate === 0.8 ? 'slow' : 'normal',
        {
          onStart: () => setReadStatus('playing'),
          onEnd: () => setReadStatus('ended'),
          onError: handleSpeechFailure,
        },
        nextRate
      );
      if (!res.queued) {
        handleSpeechFailure(res.reason ?? 'error');
      }
    }
  };

  const handleSpeakGlossaryWord = (itemId: string, textDe: string) => {
    if (!speechSupported) {
      handleSpeechFailure('unsupported');
      return;
    }
    setUnavailableReasonCode(null);
    setReadStatus('idle');
    setActiveGlossarySpeechId(itemId);

    const res = speakGermanText(
      textDe,
      rate === 0.8 ? 'slow' : 'normal',
      {
        onStart: () => setActiveGlossarySpeechId(itemId),
        onEnd: () => setActiveGlossarySpeechId(null),
        onError: handleSpeechFailure,
      },
      rate
    );

    if (!res.queued) {
      handleSpeechFailure(res.reason ?? 'error');
    }
  };

  const FormatIcon = FORMAT_ICONS[scenario.format];
  const { document: doc } = scenario;

  const readStatusLabel = (() => {
    switch (readStatus) {
      case 'starting':
        return tx({ tr: 'Ses motoru başlatılıyor…', en: 'Starting speech engine…' });
      case 'playing':
        return tx({
          tr: 'A2 Almanca metin seslendiriliyor',
          en: 'Reading A2 German passage aloud',
        });
      case 'ended':
        return tx({ tr: 'Sesli okuma tamamlandı', en: 'Read-aloud completed' });
      case 'unavailable':
        return tx({ tr: 'Sesli okuma kullanılamıyor', en: 'Read-aloud unavailable' });
      default:
        return voiceName
          ? tx(
              { tr: 'İsteğe bağlı sesli okuma ({voice})', en: 'Optional read-aloud ({voice})' },
              { voice: voiceName }
            )
          : tx({ tr: 'İsteğe bağlı sesli okuma (de-DE)', en: 'Optional read-aloud (de-DE)' });
    }
  })();

  const unavailableMessage = (() => {
    switch (unavailableReasonCode) {
      case 'unsupported_initial':
        return tx({
          tr: 'Bu tarayıcıda Web Speech API seslendirmesi desteklenmiyor; metni sessiz okuma ile çalışabilirsiniz.',
          en: 'Web Speech API speech synthesis is not supported in this browser; you can study the passage by reading silently.',
        });
      case 'unsupported':
        return tx({
          tr: 'Bu tarayıcıda Almanca (de-DE) seslendirme desteklenmiyor. Sahte oynatma yapılmaz; metni doğrudan okuyarak devam edebilirsiniz.',
          en: 'German (de-DE) speech synthesis is not supported in this browser. No simulated playback is used; you can continue reading the text directly.',
        });
      case 'timeout':
        return tx({
          tr: 'Tarayıcı ses motoru (de-DE) bu ortamda ses oynatmayı başlatamadı. Sahte oynatma yapılmaz; metin ve sözlük desteğiyle çalışabilirsiniz.',
          en: 'The browser speech engine (de-DE) could not start playback here. No simulated playback is used; you can study with the passage and glossary.',
        });
      case 'error':
        return tx({
          tr: 'Tarayıcı ses sentezleyicisi metni okurken bir hata döndürdü. Cihazınızın ses ayarlarını kontrol edebilir veya okumaya devam edebilirsiniz.',
          en: 'The browser speech synthesizer returned an error while reading the passage. Check your device audio settings or continue reading.',
        });
      default:
        return tx({
          tr: 'Bu tarayıcıda Almanca (de-DE) seslendirme kullanılamıyor. Sahte oynatma yapılmaz; metni doğrudan okuyarak devam edebilirsiniz.',
          en: 'German (de-DE) speech synthesis is unavailable in this browser. No simulated playback is used; you can continue reading directly.',
        });
    }
  })();

  return (
    <div className="rounded-xl border border-[#D9D9D3] bg-[#FFFFFF] p-5 sm:p-7 dark:border-[#282830] dark:bg-[#16161A]">
      {/* Top Bar: Context, Document Format & Reading Support Controls */}
      <div className="flex flex-col gap-4 border-b border-[#ECECE8] pb-5 lg:flex-row lg:items-start lg:justify-between dark:border-[#24242C]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#52525B] dark:text-[#A1A1AA]">
            <FormatIcon className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <span>{doc.formatLabelTr}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              CEFR A2 · {scenario.titleDe}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {tx(
                { tr: '~{min} dk okuma', en: '~{min} min read' },
                { min: scenario.estimatedMinutes }
              )}
            </span>
          </div>
          <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-semibold text-[#111113] dark:text-[#F4F4F5]">
            {scenario.titleTr}
          </h2>
          <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#111113] dark:text-[#F4F4F5]">
              {tx({ tr: 'A2 Odak:', en: 'A2 Focus:' })}
            </span>{' '}
            {scenario.cefrFocusTr}
          </p>
        </div>

        {/* Reading Support Action Controls (Non-scored aids — never inflate accuracy) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setHighlightKeyPhrases((prev) => !prev)}
            aria-pressed={highlightKeyPhrases}
            className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
              highlightKeyPhrases
                ? 'border-[#9A6B16] bg-[#9A6B16]/12 text-[#713F12] dark:border-[#D9A13B] dark:bg-[#D9A13B]/18 dark:text-[#FDE68A]'
                : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
            }`}
          >
            <Highlighter className="h-3.5 w-3.5 shrink-0" />
            <span>
              {highlightKeyPhrases
                ? tx({ tr: 'Vurguyu Kapat', en: 'Clear Highlights' })
                : tx({ tr: 'İfadeleri Vurgula', en: 'Highlight Phrases' })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowGlossary((prev) => !prev)}
            aria-expanded={showGlossary}
            className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
              showGlossary
                ? 'border-[#111113] bg-[#111113] text-[#F6F6F4] dark:border-[#D9A13B] dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'border-[#D9D9D3] bg-[#F6F6F4] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5 shrink-0" />
            <span>
              {showGlossary
                ? tx({ tr: 'Sözlüğü Gizle', en: 'Hide Glossary' })
                : tx({ tr: 'A2 Sözlük', en: 'A2 Glossary' })}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowTurkish((prev) => !prev)}
            aria-expanded={showTurkish}
            className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap ${
              showTurkish
                ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#111113] hover:bg-[#ECECE8] dark:border-[#282830] dark:bg-[#111113] dark:text-[#F4F4F5] dark:hover:bg-[#1E1E24]'
            }`}
          >
            <Languages className="h-3.5 w-3.5 shrink-0" />
            <span>
              {showTurkish
                ? locale.common.hideTurkish
                : tx({ tr: 'Türkçe Çeviri', en: 'Turkish Gloss' })}
            </span>
          </button>
        </div>
      </div>

      {/* Optional Verified Read-Aloud Strip (delegates 100% to src/utils/speech.ts) */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#ECECE8] bg-[#F6F6F4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#24242C] dark:bg-[#111113]">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <button
            type="button"
            disabled={!speechSupported}
            onClick={handleReadAloudToggle}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#7C1D2E] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#641624] disabled:opacity-45 dark:bg-[#D9A13B] dark:text-[#111113] dark:hover:bg-[#E6B452] whitespace-nowrap shrink-0"
          >
            {readStatus === 'playing' || readStatus === 'starting' ? (
              <>
                <Square className="h-3.5 w-3.5" />
                <span>{locale.audio.stop}</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>{tx({ tr: 'Metni Sesli Dinle', en: 'Listen to Passage' })}</span>
              </>
            )}
          </button>

          <span className="flex items-center gap-1.5 text-xs text-[#52525B] dark:text-[#A1A1AA] min-w-0">
            <Volume2 className="h-3.5 w-3.5 text-[#7C1D2E] dark:text-[#D9A13B] shrink-0" />
            <span className="truncate">{readStatusLabel}</span>
          </span>
        </div>

        <div
          role="group"
          aria-label={tx({ tr: 'Sesli okuma hızı', en: 'Read-aloud speed' })}
          className="flex items-center self-start sm:self-auto rounded-lg border border-[#D9D9D3] bg-[#FFFFFF] p-0.5 dark:border-[#282830] dark:bg-[#16161A] shrink-0"
        >
          <button
            type="button"
            disabled={!speechSupported}
            onClick={() => handleSpeedChange(0.8)}
            aria-pressed={rate === 0.8}
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
              rate === 0.8
                ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            0.8×
          </button>
          <button
            type="button"
            disabled={!speechSupported}
            onClick={() => handleSpeedChange(1.0)}
            aria-pressed={rate === 1.0}
            className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors whitespace-nowrap ${
              rate === 1.0
                ? 'bg-[#111113] text-white dark:bg-[#D9A13B] dark:text-[#111113]'
                : 'text-[#52525B] hover:text-[#111113] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
            }`}
          >
            1.0×
          </button>
        </div>
      </div>

      {/* Honest TTS Unavailable / Watchdog Timeout Notice */}
      {(readStatus === 'unavailable' || unavailableReasonCode) && (
        <div
          role="status"
          className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#9A6B16]/40 bg-[#FEF9EB] px-4 py-3 text-xs leading-relaxed text-[#713F12] dark:border-[#D9A13B]/40 dark:bg-[#231D11] dark:text-[#FDE68A]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{unavailableMessage}</p>
        </div>
      )}

      {/* Authentic Everyday A2 Document Surface */}
      <article
        aria-label={scenario.titleDe}
        className="mt-6 rounded-xl border border-[#D9D9D3] bg-[#FAFAF8] p-5 sm:p-7 dark:border-[#282830] dark:bg-[#111113]"
      >
        {/* Document Header Block */}
        <div className="border-b border-[#E5E5DF] pb-4 dark:border-[#24242C]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[#7C1D2E] dark:text-[#D9A13B]">
              {doc.formatLabelDe}
            </span>
            <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {scenario.contextLabelTr}
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
            {doc.metaRows.map((row) => (
              <div key={row.labelDe} className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <dt className="font-semibold text-[#52525B] dark:text-[#A1A1AA] shrink-0">
                    {row.labelDe}
                  </dt>
                  <dd className="text-[#111113] dark:text-[#F4F4F5] break-words">
                    {row.valueDe}
                  </dd>
                </div>
                {showTurkish && (
                  <p className="mt-0.5 text-xs text-[#71717A] dark:text-[#8E8E98]">
                    {row.valueTr}
                  </p>
                )}
              </div>
            ))}
          </dl>
        </div>

        {/* Document Body Paragraphs */}
        <div className="mt-5 space-y-4">
          {doc.paragraphsDe.map((paraDe, idx) => (
            <div key={idx} className="space-y-1.5">
              <p
                className={`text-[15px] sm:text-base leading-relaxed text-[#111113] dark:text-[#F4F4F5] ${
                  idx === 0 && (scenario.format === 'email' || scenario.format === 'notice')
                    ? 'font-medium'
                    : ''
                }`}
              >
                {renderParagraphWithHighlights(
                  paraDe,
                  scenario.highlightPhrasesDe,
                  highlightKeyPhrases
                )}
              </p>
              {showTurkish && doc.paragraphsTr[idx] && (
                <p className="text-xs sm:text-sm leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                  {doc.paragraphsTr[idx]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Document Footer / Sign-Off / Tip */}
        {doc.footerNoteDe && (
          <div className="mt-5 border-t border-[#E5E5DF] pt-4 dark:border-[#24242C]">
            <p className="text-sm font-medium text-[#111113] dark:text-[#E4E4E7]">
              {renderParagraphWithHighlights(
                doc.footerNoteDe,
                scenario.highlightPhrasesDe,
                highlightKeyPhrases
              )}
            </p>
            {showTurkish && doc.footerNoteTr && (
              <p className="mt-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {doc.footerNoteTr}
              </p>
            )}
          </div>
        )}
      </article>

      {/* Optional Key A2 Vocabulary & Phrases Helper */}
      {showGlossary && (
        <div className="mt-6 border-t border-[#ECECE8] pt-5 dark:border-[#24242C]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-[#111113] dark:text-[#F4F4F5]">
                {tx({
                  tr: 'Metindeki Anahtar A2 Sözcük ve Kalıplar',
                  en: 'Key A2 Words & Phrases in This Passage',
                })}
              </h3>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
                {tx({
                  tr: 'Telaffuzu dinlemek için ses simgesine tıklayabilirsiniz; sözlük incelemesi doğruluk puanını değiştirmez.',
                  en: 'Click the speaker icon to hear pronunciation; using the glossary does not affect accuracy.',
                })}
              </p>
            </div>
            <span className="font-mono text-xs text-[#52525B] dark:text-[#A1A1AA] tabular-nums">
              {tx(
                { tr: '{count} ifade', en: '{count} expressions' },
                { count: scenario.glossary.length }
              )}
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenario.glossary.map((item) => {
              const articleToken = item.article ? ARTICLE_TOKENS[item.article] : null;
              const speakText = item.article ? `${item.article} ${item.german}` : item.german;
              const isSpeakingItem = activeGlossarySpeechId === item.id;

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-2.5 rounded-lg border border-[#D9D9D3] bg-[#F6F6F4] p-3.5 dark:border-[#282830] dark:bg-[#111113]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111113] dark:text-[#F4F4F5]">
                      {item.article && articleToken && (
                        <span className={`${articleToken.textClass} mr-1`}>{item.article}</span>
                      )}
                      <span>{item.german}</span>
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-[#7C1D2E] dark:text-[#D9A13B]">
                      {item.turkish}
                    </p>
                    {item.noteTr && (
                      <p className="mt-1 text-[11px] leading-relaxed text-[#52525B] dark:text-[#A1A1AA]">
                        {item.noteTr}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!speechSupported}
                    onClick={() => handleSpeakGlossaryWord(item.id, speakText)}
                    aria-label={tx(
                      {
                        tr: '{word} telaffuzunu dinle',
                        en: 'Listen to pronunciation of {word}',
                      },
                      { word: speakText }
                    )}
                    title={tx({ tr: 'Telaffuzu dinle', en: 'Listen to pronunciation' })}
                    className={`inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-40 shrink-0 ${
                      isSpeakingItem
                        ? 'border-[#7C1D2E] bg-[#FDF2F4] text-[#7C1D2E] dark:border-[#D9A13B] dark:bg-[#231D11] dark:text-[#D9A13B]'
                        : 'border-[#D9D9D3] bg-[#FFFFFF] text-[#52525B] hover:bg-[#ECECE8] hover:text-[#111113] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24]'
                    }`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
