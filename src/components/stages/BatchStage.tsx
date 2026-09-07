import React from 'react';
import { 
  Layers, 
  Star, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const BatchStage: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    selectAsset,
    setMasterAsset,
    applyMasterToBatch,
    masterRecipe,
    jobState,
    jobProgress,
    themeMode,
    setStage
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const masterAsset = assets.find((a) => a.isMaster) || assets[0];
  const exceptionAssets = assets.filter((a) => a.exceptions && a.exceptions.length > 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* 1. MASTER RECIPE STATUS CARD */}
      <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors ${
        isDark ? 'bg-[#1C1518] border-[#342427]' : 'bg-white border-[#EFE4DE]'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md">
            <img src={masterAsset.afterImg || masterAsset.beforeImg} alt="Master" className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-500 text-white">
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#B76E79]">
                {masterRecipe.name}
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Master Recipe
              </span>
            </div>
            <p className="text-xs opacity-75 mt-0.5 max-w-md">
              Ánh sáng: <strong className="capitalize">{masterRecipe.recipe.lightingPreset.replace('_', ' ')}</strong> • 
              Bối cảnh: <strong className="capitalize">{masterRecipe.recipe.scenePreset}</strong> • 
              Khung: <strong>{masterRecipe.recipe.aspectRatio}</strong> • 
              Độ phân giải: <strong>{masterRecipe.recipe.outputResolution.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* Apply Master Dominant Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => applyMasterToBatch()}
            disabled={jobState === 'processing'}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${jobState === 'processing' ? 'animate-spin' : ''}`} />
            <span>{jobState === 'processing' ? `Đang đồng bộ ${jobProgress}%...` : 'Apply Master to Batch'}</span>
          </button>
        </div>
      </div>

      {/* 2. EXCEPTION ALERT BANNER (CRITICAL FEATURE) */}
      {exceptionAssets.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {exceptionAssets.length} hình ảnh cần xem xét (Smart Exception Detection)
              </h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Hệ thống phát hiện một số ảnh có tỷ lệ hoặc viền quá sát. Bạn có thể duyệt riêng mà không ảnh hưởng toàn bộ mẻ sản xuất.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/40 px-3 py-1 rounded-full">
            Non-Blocking
          </span>
        </div>
      )}

      {/* 3. BATCH ASSETS PRODUCTION MATRIX */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-sm text-[#B76E79] flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Danh Sách Tài Sản Sản Xuất ({assets.length} Ảnh)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((item) => {
            const hasExceptions = item.exceptions && item.exceptions.length > 0;
            const isCurrentSelected = item.id === selectedAssetId;

            return (
              <div
                key={item.id}
                onClick={() => selectAsset(item.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                  isCurrentSelected
                    ? 'border-[#B76E79] shadow-md ring-2 ring-[#B76E79]/20'
                    : isDark ? 'bg-[#1C1518] border-[#342427] hover:border-neutral-500' : 'bg-white border-[#EFE4DE] hover:border-neutral-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border shrink-0">
                    <img src={item.afterImg || item.beforeImg} alt={item.name} className="w-full h-full object-cover" />
                    {item.isMaster && (
                      <div className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{item.name}</h4>
                      {item.isMaster ? (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">MASTER</span>
                      ) : (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          hasExceptions ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] opacity-70 mt-0.5 truncate">
                      Khung: {item.recipe.aspectRatio} • {item.recipe.lightingPreset.replace('_', ' ')}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{item.integrityScore}% Protected</span>
                    </div>
                  </div>
                </div>

                {/* Exceptions Alert Box */}
                {hasExceptions && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-900 dark:text-amber-200 space-y-1">
                    {item.exceptions.map((ex, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <span>{ex.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions bottom line */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EFE4DE] text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMasterAsset(item.id);
                    }}
                    className="text-[#B76E79] font-semibold hover:underline text-[11px] cursor-pointer"
                  >
                    {item.isMaster ? '★ Đang là Master' : 'Đặt làm Master'}
                  </button>

                  <button
                    onClick={() => {
                      selectAsset(item.id);
                      setStage('edit');
                    }}
                    className="flex items-center gap-1 text-[11px] opacity-75 hover:opacity-100 cursor-pointer"
                  >
                    <span>Chỉnh sửa</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM WORKFLOW STEPPER */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => setStage('export')}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Tiến Hành Kiểm Duyệt & Xuất Bản (Export)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
