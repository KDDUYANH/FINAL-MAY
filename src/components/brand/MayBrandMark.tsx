import React, { useId } from 'react';
import { Phone } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand.config';

interface MayBrandMarkProps {
  className?: string;
  variant?: 'rose-gold' | 'gold' | 'silver' | 'dark' | 'white';
  showWordmark?: boolean;
  showSlogan?: boolean;
  showPhone?: boolean;
  customTagline?: string;
  phoneText?: string;
  assetId?: string;
}

export const MayBrandMark: React.FC<MayBrandMarkProps> = ({
  className = "w-10 h-10",
  variant = "rose-gold",
  showWordmark = true,
  showSlogan = false,
  showPhone = false,
  customTagline = BRAND_CONFIG.slogan,
  phoneText = BRAND_CONFIG.phone,
  assetId = 'vector_metallic'
}) => {
  const uniqueId = useId();
  const gradientId = `may-grad-${variant}-${uniqueId.replace(/:/g, '')}`;

  // If specific image asset is selected, render high-res image
  const matchedLogo = BRAND_CONFIG.logos.find((l) => l.id === assetId);
  if (matchedLogo && matchedLogo.type === 'image' && matchedLogo.path) {
    return (
      <div className={`flex flex-col items-center select-none text-center ${className}`}>
        <img 
          src={matchedLogo.path} 
          alt={matchedLogo.label} 
          className="w-full h-auto object-contain drop-shadow-sm" 
        />
        {showWordmark && !matchedLogo.id.includes('full') && (
          <div className="mt-1">
            <span className="text-sm font-serif tracking-[0.24em] font-bold text-[#B76E79]">
              {BRAND_CONFIG.name}
            </span>
          </div>
        )}
      </div>
    );
  }

  const getGradient = () => {
    switch (variant) {
      case 'gold':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996E14" />
          </linearGradient>
        );
      case 'silver':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        );
      case 'dark':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#523D35" />
            <stop offset="100%" stopColor="#22140E" />
          </linearGradient>
        );
      case 'white':
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1E7E5" />
          </linearGradient>
        );
      case 'rose-gold':
      default:
        return (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE3E5" />
            <stop offset="35%" stopColor="#E09F9C" />
            <stop offset="70%" stopColor="#B76E79" />
            <stop offset="100%" stopColor="#7B3A44" />
          </linearGradient>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      <svg viewBox="0 0 300 240" className="w-full h-auto overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>{getGradient()}</defs>

        {/* Cloud Contour */}
        <path
          d="M 60,130 C 35,130 20,105 30,75 C 40,40 85,35 105,50 C 120,20 170,15 195,45 C 220,25 260,40 265,75 C 275,110 245,135 220,135"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mountain Silhouette */}
        <path
          d="M 95,95 L 125,55 L 150,90 M 145,75 L 165,48 L 195,95"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Profile of Serene Maiden */}
        <path
          d="M 125,75 C 150,75 185,90 195,115 C 202,128 200,140 185,148 C 175,153 170,165 178,172 C 172,175 160,172 155,162 C 145,145 130,130 100,128 C 70,126 50,145 40,165"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Closed Eye & Gentle Lips */}
        <path d="M 164,108 C 170,104 178,105 184,109" stroke={`url(#${gradientId})`} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 168,118 C 174,121 179,121 183,118" stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" />
        <path d="M 188,118 L 193,127 L 186,131 C 188,135 189,139 183,141" stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" />

        {/* Dynamic Ocean Wave Curve */}
        <path
          d="M 60,185 C 90,185 110,150 130,150 C 142,150 148,162 138,172 C 128,182 110,182 115,195 C 120,205 145,200 170,180 C 190,165 215,155 245,165"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Makeup Brush Detail */}
        <g transform="translate(195, 145) rotate(-22)">
          <path d="M 0,20 L 55,5" stroke={`url(#${gradientId})`} strokeWidth="3.8" strokeLinecap="round" />
          <path d="M 55,5 L 68,2" stroke={`url(#${gradientId})`} strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 68,2 C 78,-2 92,2 96,10 C 92,16 78,14 68,6 Z" fill={`url(#${gradientId})`} />
        </g>
      </svg>

      {showWordmark && (
        <div className="mt-1">
          <div 
            className="text-2xl font-serif tracking-[0.24em] font-bold bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: variant === 'gold' 
                ? 'linear-gradient(135deg, #E5C158, #996E14)'
                : variant === 'silver'
                ? 'linear-gradient(135deg, #FFFFFF, #64748B)'
                : variant === 'dark'
                ? 'linear-gradient(135deg, #442F27, #1A0D08)'
                : variant === 'white'
                ? 'linear-gradient(135deg, #FFFFFF, #F1E5E3)'
                : 'linear-gradient(135deg, #D48C95, #B76E79, #7E3F49)'
            }}
          >
            MÂY
          </div>

          {showSlogan && (
            <div className="text-[9px] uppercase tracking-[0.26em] text-[#8C6B70] font-serif font-medium mt-0.5 whitespace-nowrap opacity-90">
              {customTagline}
            </div>
          )}

          {showPhone && (
            <div className="text-[10px] tracking-wider text-[#A37B82] flex items-center justify-center gap-1 mt-0.5 font-sans font-medium">
              <Phone className="w-2.5 h-2.5" /> {phoneText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
