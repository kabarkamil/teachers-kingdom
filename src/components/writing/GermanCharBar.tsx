import React from 'react';
import { useI18n } from '../../hooks/useI18n';

const GERMAN_SPECIAL_CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'] as const;

interface GermanCharBarProps {
  onInsert: (char: string) => void;
  compact?: boolean;
}

export const GermanCharBar: React.FC<GermanCharBarProps> = ({ onInsert, compact = false }) => {
  const { tx } = useI18n();

  return (
    <div
      role="group"
      aria-label={tx({
        tr: 'Almanca özel karakter ekleme çubuğu',
        en: 'German special character bar',
      })}
      className="flex flex-wrap items-center gap-1.5"
    >
      {!compact && (
        <span className="mr-1 text-xs text-[#52525B] dark:text-[#A1A1AA]">
          {tx({ tr: 'Özel karakterler:', en: 'Special characters:' })}
        </span>
      )}
      {GERMAN_SPECIAL_CHARS.map((ch) => (
        <button
          key={ch}
          type="button"
          onMouseDown={(e) => {
            // Keep focus in the active input/textarea when clicking with mouse
            e.preventDefault();
          }}
          onClick={() => onInsert(ch)}
          aria-label={tx(
            { tr: '"{{ch}}" karakterini ekle', en: 'Insert "{{ch}}" character' },
            { ch }
          )}
          className="inline-flex h-10 min-w-10 sm:h-9 sm:min-w-9 items-center justify-center rounded-md border border-[#D9D9D3] bg-[#FFFFFF] px-2 font-mono text-xs font-semibold text-[#111113] transition-colors hover:border-[#7C1D2E] hover:bg-[#FDF2F4] hover:text-[#7C1D2E] dark:border-[#282830] dark:bg-[#16161A] dark:text-[#F4F4F5] dark:hover:border-[#D9A13B] dark:hover:bg-[#231D11] dark:hover:text-[#D9A13B]"
        >
          {ch}
        </button>
      ))}
    </div>
  );
};
