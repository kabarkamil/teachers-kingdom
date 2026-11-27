import React from 'react';

export const BRAND_LOGO_URL = '/assets/logo.png';

interface BrandMarkProps {
  className?: string;
  /**
   * 'crest' is tailored for the wide centered top-bar emblem container;
   * 'square' fits compact drawer/modal icon slots without clipping the wings.
   */
  variant?: 'square' | 'crest';
  decorative?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  className = 'h-8 w-8',
  variant = 'square',
  decorative = true,
}) => {
  const imageScaleClass = variant === 'crest' ? 'scale-[1.42]' : 'scale-[1.16]';

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#FFFFFF] ring-1 ring-[#D9D9D3] shadow-[0_1px_2px_rgba(17,17,19,0.06)] dark:bg-[#F6F6F4] dark:ring-[#D9A13B]/55 ${className}`}
    >
      <img
        src={BRAND_LOGO_URL}
        alt={decorative ? '' : 'Teachers Kingdom amblemi'}
        aria-hidden={decorative ? true : undefined}
        decoding="async"
        className={`h-full w-full object-contain ${imageScaleClass} select-none pointer-events-none`}
      />
    </span>
  );
};
