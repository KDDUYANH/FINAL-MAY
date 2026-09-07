import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  position: number;
  isDark: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  position,
  isDark,
  onMouseDown,
  onTouchStart
}) => {
  return (
    <div
      className="absolute top-0 bottom-0 z-30 cursor-ew-resize flex items-center justify-center select-none"
      style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Divider line */}
      <div 
        className="w-0.5 h-full transition-shadow duration-150"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,1), rgba(255,255,255,0.4))',
          boxShadow: '0 0 10px rgba(0,0,0,0.35)'
        }}
      />

      {/* Center Handle */}
      <div 
        className={`w-9 h-9 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-2 ${
          isDark 
            ? 'bg-[#22181B] border-[#B76E79] text-[#FDE3E5]' 
            : 'bg-white border-[#E09F9C] text-[#8C4752]'
        }`}
        style={{ boxShadow: '0 4px 16px rgba(183, 110, 121, 0.35)' }}
      >
        <div className="flex items-center -space-x-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
