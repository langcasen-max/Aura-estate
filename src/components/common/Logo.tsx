import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  showTagline = true,
  className = '',
}) => {
  const markSizeMap = {
    sm: 34,
    md: 44,
    lg: 58,
    xl: 76,
  };

  const markPx = markSizeMap[size];
  const isLight = theme === 'light';

  // Contrast-safe colors with subtle shadow for perfect legibility over imagery
  const textColor = isLight ? 'text-stone-900' : 'text-stone-50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]';
  const subtextColor = isLight ? 'text-amber-900 font-semibold' : 'text-amber-300/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]';
  const hoverText = isLight ? 'group-hover:text-amber-800' : 'group-hover:text-amber-200';

  const titleSizeMap = {
    sm: 'text-base tracking-[0.22em] font-serif',
    md: 'text-xl tracking-[0.24em] font-serif',
    lg: 'text-2xl tracking-[0.26em] font-serif',
    xl: 'text-3xl tracking-[0.28em] font-serif',
  };

  const taglineSizeMap = {
    sm: 'text-[8px] tracking-[0.28em]',
    md: 'text-[9.5px] tracking-[0.3em]',
    lg: 'text-[11px] tracking-[0.32em]',
    xl: 'text-[13px] tracking-[0.34em]',
  };

  const gradientId = React.useId().replace(/:/g, '');

  const EmblemSVG = (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${
        isLight
          ? 'drop-shadow-[0_2px_8px_rgba(180,130,40,0.25)]'
          : 'drop-shadow-[0_2px_14px_rgba(234,179,8,0.35)]'
      }`}
      style={{ width: markPx, height: markPx }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Rich 24K Polished Gold Gradient */}
          <linearGradient
            id={`goldGrad-${gradientId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFF3D4" />
            <stop offset="20%" stopColor="#F5D061" />
            <stop offset="45%" stopColor="#D4A017" />
            <stop offset="70%" stopColor="#ECC250" />
            <stop offset="100%" stopColor="#9E7318" />
          </linearGradient>

          {/* Champagne Highlight Sheen */}
          <linearGradient
            id={`sheenGrad-${gradientId}`}
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
          >
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E5B942" />
          </linearGradient>

          {/* Deep Obsidian Radial Background */}
          <radialGradient
            id={`emblemBg-${gradientId}`}
            cx="50%"
            cy="45%"
            r="65%"
          >
            <stop offset="0%" stopColor={isLight ? '#FFFFFF' : '#2A241E'} />
            <stop offset="65%" stopColor={isLight ? '#F5EFE6' : '#171411'} />
            <stop offset="100%" stopColor={isLight ? '#E5DDD0' : '#0B0A09'} />
          </radialGradient>

          {/* Soft Glow */}
          <filter id={`goldGlow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Stately Cartouche (Soft octagonal squircle) */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill={`url(#emblemBg-${gradientId})`}
          stroke={`url(#goldGrad-${gradientId})`}
          strokeWidth="2"
        />

        {/* Inner Guilloché-Inspired Geometric Frame */}
        <rect
          x="8.5"
          y="8.5"
          width="83"
          height="83"
          rx="17"
          fill="none"
          stroke={`url(#goldGrad-${gradientId})`}
          strokeWidth="0.8"
          strokeDasharray="4 2"
          opacity="0.8"
        />

        {/* 4 Cardinal Diamond Accents */}
        <path d="M50 5.5 L52 8 L50 10.5 L48 8 Z" fill={`url(#sheenGrad-${gradientId})`} />
        <path d="M50 89.5 L52 92 L50 94.5 L48 92 Z" fill={`url(#sheenGrad-${gradientId})`} />
        <path d="M5.5 50 L8 52 L10.5 50 L8 48 Z" fill={`url(#sheenGrad-${gradientId})`} />
        <path d="M89.5 50 L92 52 L94.5 50 L92 48 Z" fill={`url(#sheenGrad-${gradientId})`} />

        {/* Architectural Vault Lines */}
        <path
          d="M26 78 C26 50 74 50 74 78"
          stroke={`url(#goldGrad-${gradientId})`}
          strokeWidth="1.2"
          strokeDasharray="1.5 3"
          opacity="0.5"
          fill="none"
        />

        {/* Classical Grand Arch Motif */}
        <path
          d="M36 78 V 64 C 36 53 64 53 64 64 V 78"
          stroke={`url(#sheenGrad-${gradientId})`}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* The Sculpted Monogram 'A' */}
        {/* Outer Triangular Gable / Legs */}
        <polygon
          points="50,17 21,78 30,78 40.5,56 59.5,56 70,78 79,78"
          fill={`url(#goldGrad-${gradientId})`}
        />

        {/* Inner Pediment Void */}
        <polygon
          points="50,29 42,50 58,50"
          fill={isLight ? '#F5EFE6' : '#171411'}
        />

        {/* Architectural Pediment Keystone / Crown Star */}
        <polygon
          points="50,13 52.5,17 56,17.5 53,20 54,23.5 50,21.5 46,23.5 47,20 44,17.5 47.5,17"
          fill={`url(#sheenGrad-${gradientId})`}
        />

        {/* Center Radiant Aura Diamond inside the Gable */}
        <polygon
          points="50,33 52.5,39 57.5,41.5 52.5,44 50,50 47.5,44 42.5,41.5 47.5,39"
          fill={`url(#sheenGrad-${gradientId})`}
        />

        {/* Plinth Base Serifs */}
        <rect x="19" y="76.5" width="13" height="2" rx="0.5" fill={`url(#goldGrad-${gradientId})`} />
        <rect x="68" y="76.5" width="13" height="2" rx="0.5" fill={`url(#goldGrad-${gradientId})`} />
        <line x1="32" y1="77.5" x2="68" y2="77.5" stroke={`url(#goldGrad-${gradientId})`} strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center ${className}`}>{EmblemSVG}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
        {EmblemSVG}
        <div className="mt-3">
          <span
            className={`${titleSizeMap[size]} uppercase block leading-none ${textColor} ${hoverText} transition-colors`}
          >
            SADIQABAD ESTATES
          </span>
          {showTagline && (
            <span
              className={`${taglineSizeMap[size]} uppercase ${subtextColor} block mt-1.5 font-medium tracking-[0.32em]`}
            >
              Sadiqabad City Properties
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default 'horizontal' & 'full'
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer text-left ${className}`}>
      {EmblemSVG}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif ${titleSizeMap[size]} text-lg sm:text-xl md:text-2xl uppercase block leading-none ${textColor} ${hoverText} transition-colors font-semibold`}
        >
          SADIQABAD ESTATES
        </span>
        {showTagline && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
            <span
              className={`${taglineSizeMap[size]} text-[8px] sm:text-[9.5px] uppercase ${subtextColor} block tracking-[0.24em] sm:tracking-[0.28em]`}
            >
              Sadiqabad City Properties
            </span>
            <span className="w-1 h-1 rounded-full bg-amber-400 hidden md:inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <span className="text-[8px] tracking-[0.22em] uppercase text-stone-300 font-mono hidden md:inline-block opacity-75">
              Verified Properties
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
