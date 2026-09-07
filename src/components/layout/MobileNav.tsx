import React from 'react';
import { 
  Upload, 
  Wand2, 
  Palette, 
  FileText,
  Layers, 
  Download
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Stage } from '../../types/studio';

export const MobileNav: React.FC = () => {
  const { stage, setStage, themeMode } = useStudioStore();
  const isDark = themeMode === 'quiet-luxury';

  const stages: { id: Stage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'create', label: 'Create', icon: Upload },
    { id: 'edit', label: 'Edit', icon: Wand2 },
    { id: 'brand', label: 'Brand', icon: Palette },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'batch', label: 'Batch', icon: Layers },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className={`md:hidden h-16 border-t px-4 flex items-center justify-around z-30 shrink-0 select-none ${
      isDark ? 'bg-[#1C1618] border-[#322427]' : 'bg-white border-[#EFE4DE]'
    }`}>
      {stages.map((st) => {
        const Icon = st.icon;
        const isCurrent = stage === st.id;

        return (
          <button
            key={st.id}
            onClick={() => setStage(st.id)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer ${
              isCurrent ? 'text-[#B76E79] font-bold scale-105' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{st.label}</span>
          </button>
        );
      })}
    </div>
  );
};
