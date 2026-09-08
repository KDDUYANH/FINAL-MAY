import React from 'react';

export type BrandLogoVariant = 'mark' | 'circle' | 'full' | 'badge';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  alt?: string;
}

const LOGO_PATHS: Record<BrandLogoVariant, string> = {
  mark: '/assets/brand/may_logo_mark.png',
  circle: '/assets/brand/may_logo_circle.png',
  full: '/assets/brand/may_logo_full_lockup.png',
  badge: '/assets/brand/may_logo_badge.jpg',
};

/**
 * Real Brand Logo Component
 * Uses official brand assets without text recreation, preserving proportions & resolution.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'mark',
  className = 'h-8 w-auto',
  alt = 'MÂY Image Studio',
}) => {
  return (
    <img
      src={LOGO_PATHS[variant]}
      alt={alt}
      className={`object-contain select-none shrink-0 ${className}`}
      loading="eager"
    />
  );
};
