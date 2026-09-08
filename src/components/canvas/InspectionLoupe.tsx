import React from 'react';

interface InspectionLoupeProps {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  imgUrl: string;
}

export const InspectionLoupe: React.FC<InspectionLoupeProps> = React.memo(({ x, y, imgUrl }) => {
  return (
    <div
      className="absolute z-40 w-44 h-44 rounded-full border-2 border-white/90 shadow-[0_12px_36px_rgba(0,0,0,0.45)] overflow-hidden pointer-events-none bg-white ring-2 ring-black/20"
      style={{
        top: `${y}%`,
        left: `${x}%`,
        transform: 'translate3d(-50%, -50%, 0)',
        willChange: 'top, left',
      }}
    >
      {/* 200% Zoomed Image layer */}
      <div
        className="w-[300%] h-[300%]"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: `${x}% ${y}%`,
          imageRendering: 'crisp-edges',
        }}
      />

      {/* Subtle Crosshair Target */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="w-6 h-0.5 bg-white shadow-sm" />
        <div className="h-6 w-0.5 bg-white shadow-sm absolute" />
      </div>

      {/* Quiet Status Pill */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/85 text-white text-[8px] font-mono tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 whitespace-nowrap shadow-md">
        200% DETAIL LOUPE
      </div>
    </div>
  );
});
