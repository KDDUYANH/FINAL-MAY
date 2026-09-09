import React, { useRef } from 'react';
import { 
  CheckSquare, 
  Square, 
  Star, 
  AlertTriangle, 
  RefreshCw, 
  Plus,
  Trash2 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { getOptimizedThumbnail, createManagedObjectURL } from '../../utils/imageOptimizer';

export const BatchFilmstrip: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    selectAsset,
    deleteAsset,
    toggleAssetSelected,
    toggleSelectAllAssets,
    setMasterAsset,
    applyMasterToBatch,
    addUploadedAssets,
    jobState,
    jobProgress,
    themeMode,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = themeMode === 'quiet-luxury';
  const selectedCount = assets.filter((a) => a.isSelected).length;
  const exceptionCount = assets.reduce((sum, a) => sum + (a.exceptions?.length || 0), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file) => {
      const url = createManagedObjectURL(file);
      return {
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Mỹ phẩm',
        beforeImg: url,
        afterImg: url,
        width: 1200,
        height: 1500,
      };
    });

    addUploadedAssets(newAssets);
  };

  const getStatusBadge = (status: string, exceptionLen: number) => {
    if (exceptionLen > 0) {
      return (
        <div className="absolute top-1 right-8 bg-amber-500 text-black text-[8px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>Lưu ý</span>
        </div>
      );
    }
    switch (status) {
      case 'Master':
        return (
          <div className="absolute bottom-1.5 left-1.5 bg-amber-500/95 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
            MASTER
          </div>
        );
      case 'Ready':
        return (
          <div className="absolute bottom-1.5 left-1.5 bg-emerald-600/90 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
            READY
          </div>
        );
      case 'Review':
        return (
          <div className="absolute bottom-1.5 left-1.5 bg-amber-500/90 text-black text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
            REVIEW
          </div>
        );
      default:
        return null;
    }
  };

  if (assets.length === 0) {
    return (
      <div
        className={`h-16 border-t px-6 flex items-center justify-between shrink-0 z-20 transition-colors duration-200 ${
          isDark ? 'bg-[#181214]/95 border-[#302225]' : 'bg-white/95 border-[#EFE4DE]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex items-center gap-2.5 text-xs opacity-60">
          <span className="w-2 h-2 rounded-full bg-[#B76E79]/60 animate-pulse" />
          <span>Danh sách làm việc trống. Tải thêm ảnh để kích hoạt chế độ xử lý hàng loạt.</span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B76E79]/10 text-[#B76E79] hover:bg-[#B76E79] hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm ảnh mới</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`h-28 border-t px-6 py-2.5 flex items-center justify-between shrink-0 z-20 transition-colors duration-200 ${
        isDark ? 'bg-[#181214]/95 border-[#302225]' : 'bg-white/95 border-[#EFE4DE]'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Filmstrip Thumbnails List */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-[calc(100%-360px)] select-none">
        {assets.map((item) => {
          const isSelectedCurrent = item.id === selectedAssetId;
          const exceptionLen = item.exceptions?.length || 0;

          return (
            <div
              key={item.id}
              onClick={() => selectAsset(item.id)}
              className={`relative flex-shrink-0 w-22 h-22 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all p-0.5 group ${
                isSelectedCurrent
                  ? 'border-[#B76E79] shadow-md scale-102 ring-2 ring-[#B76E79]/20'
                  : isDark
                  ? 'border-[#332427] opacity-75 hover:opacity-100 hover:border-neutral-500'
                  : 'border-[#E5D7D0] opacity-85 hover:opacity-100 hover:border-neutral-400'
              }`}
            >
              <img
                src={getOptimizedThumbnail(item.afterImg || item.beforeImg, 200)}
                alt={item.name}
                className="w-full h-full object-cover rounded-xl select-none"
                loading="lazy"
                decoding="async"
              />

              {/* Multi-select Checkbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAssetSelected(item.id);
                }}
                className="absolute top-1 left-1 z-10 p-0.5 rounded bg-black/60 text-white hover:bg-[#B76E79] transition-colors"
                title={item.isSelected ? 'Bỏ chọn' : 'Chọn ảnh'}
              >
                {item.isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#FDE2E4]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-white/70" />
                )}
              </button>

              {/* Master Asset Star Badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMasterAsset(item.id);
                }}
                title={item.isMaster ? 'Ảnh Mẫu (Master Asset)' : 'Nhấn để đặt làm Ảnh Mẫu'}
                className={`absolute top-1 right-1 z-10 p-0.5 rounded-full transition-all ${
                  item.isMaster
                    ? 'bg-amber-500 text-white shadow-md scale-110'
                    : 'bg-black/40 text-white/50 hover:text-amber-300 hover:bg-black/70'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Status Badge */}
              {getStatusBadge(item.status, exceptionLen)}

              {/* Override Tag */}
              {item.overrideActive && !item.isMaster && (
                <div className="absolute bottom-1 right-1 bg-purple-600 text-white text-[7.5px] px-1 rounded font-bold">
                  CUSTOM
                </div>
              )}

              {/* Quick Delete Hover Button */}
              {assets.length > 1 && !item.isMaster && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAsset(item.id);
                  }}
                  className="absolute bottom-1 left-1 z-10 p-1 rounded bg-black/70 text-white/75 hover:text-rose-400 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa ảnh này khỏi danh sách"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Quick Add Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex-shrink-0 w-22 h-22 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
            isDark
              ? 'border-[#443034] text-[#D89CA5] hover:bg-[#251A1D]'
              : 'border-[#E8CAD1] text-[#9E5862] hover:bg-[#FFF5F6]'
          }`}
          title="Tải thêm ảnh vào studio"
        >
          <Plus className="w-5 h-5 text-[#B76E79]" />
          <span>Thêm ảnh</span>
        </button>
      </div>

      {/* Batch Summary & Controls */}
      <div className="pl-5 border-l border-[#EFE4DE] flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-2">
          {exceptionCount > 0 && (
            <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{exceptionCount} lưu ý</span>
            </span>
          )}
          <button
            onClick={toggleSelectAllAssets}
            className="text-xs text-[#B76E79] font-bold hover:underline cursor-pointer"
          >
            {assets.every((a) => a.isSelected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>
          <span className="text-xs font-semibold opacity-75">
            ({selectedCount}/{assets.length})
          </span>
        </div>

        <button
          onClick={applyMasterToBatch}
          disabled={jobState === 'processing'}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${jobState === 'processing' ? 'animate-spin' : ''}`} />
          <span>
            {jobState === 'processing'
              ? `Đang đồng bộ ${jobProgress}%...`
              : `Đồng bộ Master cho ${selectedCount} ảnh`}
          </span>
        </button>
      </div>
    </div>
  );
};
