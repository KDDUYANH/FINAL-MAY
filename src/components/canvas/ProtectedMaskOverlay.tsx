import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Asset } from '../../types/studio';

interface ProtectedMaskOverlayProps {
  asset: Asset;
}

export const ProtectedMaskOverlay: React.FC<ProtectedMaskOverlayProps> = ({ asset }) => {
  const box = asset.analysis?.boundingBox || { x: 0.25, y: 0.15, width: 0.50, height: 0.70 };

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden select-none animate-fadeIn">
      {/* Dimmed background around product */}
      <div 
        className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]"
        style={{
          clipPath: `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%,
            0% 0%,
            ${box.x * 100}% ${box.y * 100}%,
            ${box.x * 100}% ${(box.y + box.height) * 100}%,
            ${(box.x + box.width) * 100}% ${(box.y + box.height) * 100}%,
            ${(box.x + box.width) * 100}% ${box.y * 100}%,
            ${box.x * 100}% ${box.y * 100}%
          )`
        }}
      />

      {/* Product Protected Bounding Box */}
      <div
        className="absolute border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)]"
        style={{
          left: `${box.x * 100}%`,
          top: `${box.y * 100}%`,
          width: `${box.width * 100}%`,
          height: `${box.height * 100}%`
        }}
      >
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white rounded-tl" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white rounded-tr" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white rounded-bl" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white rounded-br" />

        {/* Protection Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/85 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 backdrop-blur-md shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Product protected ✓</span>
        </div>

        {/* Protected items listing badge */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 p-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[9px] text-white/90">
          <div className="flex items-center gap-1 text-amber-300 font-semibold px-1">
            <Lock className="w-2.5 h-2.5" /> Khóa nguyên bản:
          </div>
          {asset.protectedRegions.slice(0, 3).map((region, idx) => (
            <span key={idx} className="bg-white/10 px-1.5 py-0.5 rounded text-[8.5px] truncate max-w-[140px]">
              {region}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
