import React from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Sun, 
  Maximize2, 
  Crop, 
  Shield, 
  SlidersHorizontal 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { EditTool } from '../../types/studio';

export const ToolsRail: React.FC = () => {
  const { activeEditTool, setActiveEditTool, themeMode } = useStudioStore();
  const isDark = themeMode === 'quiet-luxury';

  const primaryTools: { id: EditTool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'enhance', label: 'Tối ưu', icon: Sparkles },
    { id: 'background', label: 'Hậu cảnh', icon: ImageIcon },
    { id: 'lighting', label: 'Ánh sáng', icon: Sun },
    { id: 'resize', label: 'Tỷ lệ', icon: Maximize2 },
  ];

  const secondaryTools: { id: EditTool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'crop', label: 'Cắt góc', icon: Crop },
    { id: 'watermark', label: 'Logo', icon: Shield },
    { id: 'advanced', label: 'Nâng cao', icon: SlidersHorizontal },
  ];

  const renderToolButton = (tool: { id: EditTool; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = tool.icon;
    const isActive = activeEditTool === tool.id;

    return (
      <button
        key={tool.id}
        onClick={() => setActiveEditTool(tool.id)}
        className={`w-full flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all duration-200 group cursor-pointer ${
          isActive
            ? 'bg-gradient-to-b from-[#B76E79] to-[#8C4752] text-white shadow-md font-bold'
            : isDark
            ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
            : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
        }`}
        title={tool.label}
      >
        <Icon className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
        <span className="text-[10px] tracking-tight">{tool.label}</span>
      </button>
    );
  };

  return (
    <nav
      className={`w-20 border-r flex flex-col items-center py-4 px-2 shrink-0 z-20 transition-colors duration-200 ${
        isDark ? 'bg-[#181214]/95 border-[#302225]' : 'bg-white/95 border-[#EFE4DE]'
      }`}
    >
      {/* Primary Tools */}
      <div className="w-full space-y-1.5">
        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#B76E79] block text-center mb-1">
          Chính
        </span>
        {primaryTools.map(renderToolButton)}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-inherit my-3" />

      {/* Secondary Tools */}
      <div className="w-full space-y-1.5">
        <span className="text-[8.5px] font-bold uppercase tracking-wider opacity-50 block text-center mb-1">
          Phụ
        </span>
        {secondaryTools.map(renderToolButton)}
      </div>
    </nav>
  );
};
