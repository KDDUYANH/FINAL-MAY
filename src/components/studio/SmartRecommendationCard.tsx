import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, Download, Wand2 } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

interface SmartRecommendationCardProps {
  onApplyRecommendation?: () => void;
  onExploreTools?: () => void;
  className?: string;
}

export const SmartRecommendationCard: React.FC<SmartRecommendationCardProps> = ({
  onApplyRecommendation,
  onExploreTools,
  className = '',
}) => {
  const {
    assets,
    selectedAssetId,
    applyRecommendation,
    openExport,
    jobState,
    themeMode,
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const rec = activeAsset?.recommendation;

  if (!rec) return null;

  const handleAction = () => {
    if (rec.isAlreadyGood) {
      openExport();
    } else {
      if (onApplyRecommendation) {
        onApplyRecommendation();
      } else {
        applyRecommendation(activeAsset.id);
      }
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-[#241B1E] to-[#1C1518] border-[#3E2B30] text-[#F5ECE8]'
          : 'bg-gradient-to-br from-[#FFF8F7] to-[#FAF2EE] border-[#ECD8D3] text-[#2D1D1F]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center shrink-0">
            {rec.isAlreadyGood ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-70">
              {rec.isAlreadyGood ? 'Trạng thái hình ảnh' : 'Khuyến nghị AI (Best Next Action)'}
            </span>
            <h4 className="text-xs font-bold font-serif text-[#B76E79]">
              {rec.action}
            </h4>
          </div>
        </div>
      </div>

      <p className="text-[11px] opacity-80 leading-relaxed mb-3 pl-8">
        {rec.reason}
      </p>

      <div className="flex items-center gap-2 pl-8">
        <button
          onClick={handleAction}
          disabled={jobState === 'processing'}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
            rec.isAlreadyGood
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white hover:opacity-95 active:scale-95'
          }`}
        >
          {rec.isAlreadyGood ? (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Xuất ngay</span>
            </>
          ) : (
            <>
              <Wand2 className={`w-3.5 h-3.5 ${jobState === 'processing' ? 'animate-spin' : ''}`} />
              <span>{jobState === 'processing' ? 'Đang nâng cấp...' : 'Áp dụng đề xuất'}</span>
            </>
          )}
        </button>

        {onExploreTools && !rec.isAlreadyGood && (
          <button
            onClick={onExploreTools}
            className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                : 'border-neutral-200 text-neutral-600 hover:bg-white'
            }`}
          >
            <span>Tự chỉnh sửa</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
