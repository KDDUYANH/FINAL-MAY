import React from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Sun, 
  Maximize2, 
  Crop, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { EditTool } from '../../types/studio';

interface ToolCategory {
  title: string;
  tools: {
    id: EditTool;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const ToolsRail: React.FC = () => {
  const { activeEditTool, setActiveEditTool, themeMode } = useStudioStore();
  const isDark = themeMode === 'quiet-luxury';

  const toolCategories: ToolCategory[] = [
    {
      title: 'Improve',
      tools: [{ id: 'enhance', label: 'Tối ưu', icon: Sparkles }],
    },
    {
      title: 'Scene',
      tools: [
        { id: 'background', label: 'Hậu cảnh', icon: ImageIcon },
        { id: 'lighting', label: 'Ánh sáng', icon: Sun },
      ],
    },
    {
      title: 'Format',
      tools: [
        { id: 'resize', label: 'Kích thước', icon: Maximize2 },
        { id: 'crop', label: 'Cắt góc', icon: Crop },
      ],
    },
    {
      title: 'Brand',
      tools: [{ id: 'watermark', label: 'Logo', icon: ShieldCheck }],
    },
    {
      title: 'Advanced',
      tools: [{ id: 'advanced', label: 'Chi tiết', icon: SlidersHorizontal }],
    },
  ];

  return (
    <nav
      className={`w-21 border-r flex flex-col items-center py-4 px-2 shrink-0 z-20 overflow-y-auto transition-colors duration-200 select-none ${
        isDark ? 'bg-[#181214]/95 border-[#302225]' : 'bg-white/95 border-[#EFE4DE]'
      }`}
    >
      <div className="w-full space-y-4">
        {toolCategories.map((cat, idx) => (
          <div key={cat.title} className="w-full">
            <span className="text-[8px] font-bold uppercase tracking-widest text-[#B76E79] block text-center mb-1.5 opacity-90">
              {cat.title}
            </span>
            <div className="space-y-1">
              {cat.tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeEditTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveEditTool(tool.id)}
                    className={`w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-b from-[#B76E79] to-[#8C4752] text-white shadow-md font-bold'
                        : isDark
                        ? 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
                    }`}
                    title={tool.label}
                  >
                    <Icon className={`w-4.5 h-4.5 mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                    <span className="text-[9.5px] tracking-tight">{tool.label}</span>
                  </button>
                );
              })}
            </div>
            {idx < toolCategories.length - 1 && (
              <div className="w-6 h-px bg-inherit mx-auto mt-3 opacity-60" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
