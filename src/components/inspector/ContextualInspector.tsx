import React, { useState } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Check 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { 
  EditTool, 
  EnhancePreset, 
  ScenePreset, 
  LightingPreset, 
  AspectRatio, 
  WatermarkPosition 
} from '../../types/studio';
import { BrandLogo } from '../brand/BrandLogo';

export const ContextualInspector: React.FC = () => {
  const {
    activeEditTool,
    assets,
    selectedAssetId,
    updateActiveRecipe,
    updateActiveBrand,
    themeMode,
  } = useStudioStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const recipe = activeAsset?.recipe;
  const brand = activeAsset?.brand;

  if (!activeAsset || !recipe) {
    return (
      <aside
        className={`w-80 border-l flex flex-col items-center justify-center p-6 text-center select-none shrink-0 transition-colors duration-200 ${
          isDark ? 'bg-[#181214]/95 border-[#302225] text-neutral-400' : 'bg-white/95 border-[#EFE4DE] text-neutral-500'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#B76E79]/10 text-[#B76E79] flex items-center justify-center mb-3">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-[#FAF5F2] mb-1">
          Bảng Điều Khiển
        </h4>
        <p className="text-xs opacity-70 leading-relaxed font-sans max-w-[200px]">
          Chưa chọn ảnh sản phẩm. Hãy tải ảnh để bắt đầu tinh chỉnh chi tiết.
        </p>
      </aside>
    );
  }

  // 1. TOOL: ENHANCE
  const renderEnhance = () => (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-bold text-[#B76E79] uppercase tracking-wider block mb-1">
          Khuyến nghị (Recommended)
        </span>
        <button
          onClick={() => updateActiveRecipe({ enhancePreset: 'clean_luxury', cleanIntensity: 'balanced' })}
          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            recipe.enhancePreset === 'clean_luxury'
              ? 'border-[#B76E79] bg-[#B76E79]/10 ring-1 ring-[#B76E79]'
              : isDark
              ? 'border-[#332428] bg-[#22181B] hover:border-neutral-600'
              : 'border-[#EADAD2] bg-white hover:border-neutral-400'
          }`}
        >
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Clean Luxury (Đặc trưng MÂY)</span>
            </div>
            <div className="text-[10.5px] opacity-70 mt-0.5">
              Khử bụi bề mặt, tăng vi tương phản, bảo toàn 100% nhãn in
            </div>
          </div>
          {recipe.enhancePreset === 'clean_luxury' && <Check className="w-4 h-4 text-[#B76E79] shrink-0" />}
        </button>
      </div>

      <div>
        <label className="text-xs font-bold block mb-2">Các tùy chọn phong cách khác</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'auto', label: 'Quick Auto', desc: 'Cân bằng tức thì' },
            { id: 'soft_beauty', label: 'Soft Beauty', desc: 'Dịu nhẹ, sáng da' },
            { id: 'editorial', label: 'Editorial', desc: 'Tạp chí thời trang' },
            { id: 'sharpen', label: 'Chuyên sâu nét', desc: 'Tăng chi tiết viền' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => updateActiveRecipe({ enhancePreset: preset.id as EnhancePreset })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                recipe.enhancePreset === preset.id
                  ? 'border-[#B76E79] bg-[#B76E79]/10 font-bold'
                  : isDark
                  ? 'border-[#332428] bg-[#22181B] text-neutral-300'
                  : 'border-[#EADAD2] bg-white text-neutral-700'
              }`}
            >
              <div className="text-xs font-semibold">{preset.label}</div>
              <div className="text-[10px] opacity-65 truncate mt-0.5">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Advanced controls */}
      <div className="pt-2 border-t border-inherit">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tùy chỉnh nâng cao</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs">Bảo vệ kết cấu bao bì</span>
              <input
                type="checkbox"
                checked={recipe.preservePackagingTexture}
                onChange={(e) => updateActiveRecipe({ preservePackagingTexture: e.target.checked })}
                className="accent-[#B76E79] w-4 h-4 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Cường độ làm sạch vi hạt</span>
                <span className="font-mono">{recipe.cleanIntensity}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'balanced', 'strong'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateActiveRecipe({ cleanIntensity: level })}
                    className={`py-1 text-[11px] rounded-lg border text-center capitalize ${
                      recipe.cleanIntensity === level
                        ? 'bg-[#B76E79] text-white border-[#8C4752]'
                        : 'border-inherit opacity-75 hover:opacity-100'
                    }`}
                  >
                    {level === 'low' ? 'Nhẹ' : level === 'balanced' ? 'Vừa' : 'Mạnh'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 2. TOOL: BACKGROUND
  const renderBackground = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold block mb-2">Bối cảnh sản phẩm (Scene Presets)</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'silk', label: 'Lụa Satin MÂY', desc: 'Mềm mại cao cấp' },
            { id: 'soft_studio', label: 'Soft Studio', desc: 'Studio trung tính' },
            { id: 'pure_white', label: 'Trắng Thương Mại', desc: 'Sàn TMĐT chuẩn' },
            { id: 'marble', label: 'Đá Marble Trắng', desc: 'Sang trọng mát mắt' },
            { id: 'warm_neutral', label: 'Ấm Tự Nhiên', desc: 'Tone be thanh lịch' },
            { id: 'original', label: 'Nền Gốc (Giữ nguyên)', desc: 'Không đổi phông' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => updateActiveRecipe({ scenePreset: sc.id as ScenePreset })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                recipe.scenePreset === sc.id
                  ? 'border-[#B76E79] bg-[#B76E79]/10 font-bold ring-1 ring-[#B76E79]'
                  : isDark
                  ? 'border-[#332428] bg-[#22181B] text-neutral-300'
                  : 'border-[#EADAD2] bg-white text-neutral-700'
              }`}
            >
              <div className="text-xs font-semibold">{sc.label}</div>
              <div className="text-[10px] opacity-65 truncate mt-0.5">{sc.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-inherit">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Độ sâu & Phản xạ nền</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Độ mờ hậu cảnh (DoF)</span>
                <span className="font-mono">{recipe.depthOfField}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={recipe.depthOfField}
                onChange={(e) => updateActiveRecipe({ depthOfField: Number(e.target.value) })}
                className="w-full accent-[#B76E79]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Bóng đổ chân thực</span>
                <span className="font-mono">{recipe.shadowStrength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={recipe.shadowStrength}
                onChange={(e) => updateActiveRecipe({ shadowStrength: Number(e.target.value) })}
                className="w-full accent-[#B76E79]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 3. TOOL: LIGHTING
  const renderLighting = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold block mb-2">Preset Ánh Sáng Studio</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'soft_studio', label: 'Soft Studio Light', desc: 'Dịu mắt, không lóa' },
            { id: 'clean_commercial', label: 'Commercial White', desc: 'Sáng bừng chi tiết' },
            { id: 'luxury', label: 'Luxury Highlight', desc: 'Điểm sáng kim loại' },
            { id: 'warm_beauty', label: 'Warm Glow', desc: 'Ấm áp tự nhiên' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => updateActiveRecipe({ lightingPreset: l.id as LightingPreset })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                recipe.lightingPreset === l.id
                  ? 'border-[#B76E79] bg-[#B76E79]/10 font-bold ring-1 ring-[#B76E79]'
                  : isDark
                  ? 'border-[#332428] bg-[#22181B] text-neutral-300'
                  : 'border-[#EADAD2] bg-white text-neutral-700'
              }`}
            >
              <div className="text-xs font-semibold">{l.label}</div>
              <div className="text-[10px] opacity-65 truncate mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-inherit">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Tinh chỉnh phơi sáng & tương phản</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Phơi sáng (Exposure)</span>
                <span className="font-mono">{recipe.exposure > 0 ? `+${recipe.exposure}` : recipe.exposure}</span>
              </div>
              <input
                type="range"
                min="-20"
                max="25"
                value={recipe.exposure}
                onChange={(e) => updateActiveRecipe({ exposure: Number(e.target.value) })}
                className="w-full accent-[#B76E79]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Độ tương phản (Contrast)</span>
                <span className="font-mono">{recipe.contrast > 0 ? `+${recipe.contrast}` : recipe.contrast}</span>
              </div>
              <input
                type="range"
                min="-15"
                max="25"
                value={recipe.contrast}
                onChange={(e) => updateActiveRecipe({ contrast: Number(e.target.value) })}
                className="w-full accent-[#B76E79]"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Vùng sáng (Highlights)</span>
                <span className="font-mono">{recipe.highlights}</span>
              </div>
              <input
                type="range"
                min="-30"
                max="20"
                value={recipe.highlights}
                onChange={(e) => updateActiveRecipe({ highlights: Number(e.target.value) })}
                className="w-full accent-[#B76E79]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 4. TOOL: RESIZE & FRAME
  const renderResize = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold block mb-2">Tỷ lệ khung hình chuẩn</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'original', label: 'Gốc', desc: 'Giữ nguyên' },
            { id: '1:1', label: '1:1', desc: 'Vuông TMĐT' },
            { id: '4:5', label: '4:5', desc: 'Instagram' },
            { id: '3:4', label: '3:4', desc: 'Chuẩn dọc' },
            { id: '9:16', label: '9:16', desc: 'Story/Reels' },
            { id: '16:9', label: '16:9', desc: 'Ngang' },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => updateActiveRecipe({ aspectRatio: ratio.id as AspectRatio })}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                recipe.aspectRatio === ratio.id
                  ? 'border-[#B76E79] bg-[#B76E79]/10 font-bold ring-1 ring-[#B76E79]'
                  : isDark
                  ? 'border-[#332428] bg-[#22181B] text-neutral-300'
                  : 'border-[#EADAD2] bg-white text-neutral-700'
              }`}
            >
              <div className="text-xs font-bold">{ratio.label}</div>
              <div className="text-[9.5px] opacity-65">{ratio.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-inherit">
        <label className="text-xs font-bold block mb-2">Lề an toàn & Căn giữa</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs">Tự động căn giữa sản phẩm</span>
            <input
              type="checkbox"
              checked={recipe.autoFrame}
              onChange={(e) => updateActiveRecipe({ autoFrame: e.target.checked })}
              className="accent-[#B76E79] w-4 h-4 cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Lề an toàn viền (Safe Margin)</span>
              <span className="font-mono">{recipe.safeAreaMargin}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={recipe.safeAreaMargin}
              onChange={(e) => updateActiveRecipe({ safeAreaMargin: Number(e.target.value) })}
              className="w-full accent-[#B76E79]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // 5. TOOL: CROP
  const renderCrop = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold block mb-1.5">Góc xoay & Cắt khung</label>
        <p className="text-[11px] opacity-75 mb-3 leading-relaxed">
          Căn chỉnh đường chân trời và góc thẳng đứng của chai/lọ mỹ phẩm.
        </p>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span>Xoay góc sản phẩm</span>
            <span className="font-mono">{recipe.cropRotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-45"
            max="45"
            value={recipe.cropRotation || 0}
            onChange={(e) => updateActiveRecipe({ cropRotation: Number(e.target.value) })}
            className="w-full accent-[#B76E79]"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-inherit">
        <button
          onClick={() => updateActiveRecipe({ cropRotation: 0, cropZoom: 1 })}
          className="w-full py-2 rounded-xl border border-dashed text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity"
        >
          Đặt lại góc cắt ban đầu
        </button>
      </div>
    </div>
  );

  // 6. TOOL: WATERMARK
  const renderWatermark = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl border border-inherit">
        <div>
          <div className="text-xs font-bold">Thêm dấu ấn thương hiệu MÂY</div>
          <div className="text-[10.5px] opacity-70">Logo chính hãng hoặc tem chìm bảo vệ</div>
        </div>
        <input
          type="checkbox"
          checked={brand?.watermarkEnabled || false}
          onChange={(e) => updateActiveBrand({ watermarkEnabled: e.target.checked })}
          className="accent-[#B76E79] w-4 h-4 cursor-pointer"
        />
      </div>

      {brand?.watermarkEnabled && (
        <>
          {/* Real Brand Logo Preview */}
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
            <BrandLogo variant="mark" className="h-10 w-auto" />
          </div>

          <div>
            <label className="text-xs font-bold block mb-2">Vị trí đóng dấu (Position)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'top_left', label: 'Góc trên trái' },
                { id: 'top_right', label: 'Góc trên phải' },
                { id: 'center', label: 'Chính giữa' },
                { id: 'bottom_left', label: 'Góc dưới trái' },
                { id: 'bottom_right', label: 'Góc dưới phải' },
                { id: 'auto', label: 'AI gợi ý vị trí' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => updateActiveBrand({ watermarkPosition: pos.id as WatermarkPosition })}
                  className={`py-2 px-1 text-[11px] rounded-lg border text-center transition-all cursor-pointer truncate ${
                    brand.watermarkPosition === pos.id
                      ? 'border-[#B76E79] bg-[#B76E79]/15 font-bold'
                      : 'border-inherit opacity-75 hover:opacity-100'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Độ mờ (Opacity)</span>
              <span className="font-mono">{brand.watermarkOpacity}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              value={brand.watermarkOpacity}
              onChange={(e) => updateActiveBrand({ watermarkOpacity: Number(e.target.value) })}
              className="w-full accent-[#B76E79]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span>Kích thước logo (Scale)</span>
              <span className="font-mono">{brand.watermarkScale}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              value={brand.watermarkScale}
              onChange={(e) => updateActiveBrand({ watermarkScale: Number(e.target.value) })}
              className="w-full accent-[#B76E79]"
            />
          </div>
        </>
      )}
    </div>
  );

  // 7. TOOL: ADVANCED
  const renderAdvanced = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold block mb-1.5">Tính toàn vẹn thương hiệu (Integrity QA)</label>
        <p className="text-[11px] opacity-75 mb-3 leading-relaxed">
          Đảm bảo chữ in hoạt chất (ví dụ: 25% Mandelic Acid) và hình dạng vật lý không bao giờ bị AI làm biến dạng.
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Khóa hình dạng bao bì vật lý</span>
            <input
              type="checkbox"
              checked={recipe.preserveGeometry}
              onChange={(e) => updateActiveRecipe({ preserveGeometry: e.target.checked })}
              className="accent-[#B76E79] w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Bảo vệ nhãn in & typography</span>
            <input
              type="checkbox"
              checked={recipe.protectLabels}
              onChange={(e) => updateActiveRecipe({ protectLabels: e.target.checked })}
              className="accent-[#B76E79] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-inherit">
        <label className="text-xs font-bold block mb-2">Độ phân giải xuất mặc định</label>
        <div className="grid grid-cols-3 gap-2">
          {(['original', '2k', '4k'] as const).map((res) => (
            <button
              key={res}
              onClick={() => updateActiveRecipe({ outputResolution: res })}
              className={`py-2 rounded-xl border text-xs font-bold uppercase transition-all ${
                recipe.outputResolution === res
                  ? 'bg-[#B76E79] text-white border-[#8C4752]'
                  : 'border-inherit opacity-75 hover:opacity-100'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const toolTitles: Record<EditTool, { title: string; subtitle: string }> = {
    enhance: { title: 'Tối ưu hình ảnh (Enhance)', subtitle: 'Cải thiện bề mặt & độ sắc nét bao bì' },
    background: { title: 'Hậu cảnh & Phông nền (Background)', subtitle: 'Thay đổi bối cảnh studio chuyên nghiệp' },
    lighting: { title: 'Ánh sáng Studio (Lighting)', subtitle: 'Tái tạo ánh sáng thương mại dịu mắt' },
    resize: { title: 'Kích thước & Tỷ lệ (Resize)', subtitle: 'Cắt chuẩn tỷ lệ các nền tảng' },
    crop: { title: 'Cắt góc & Xoay (Crop)', subtitle: 'Căn chỉnh góc đứng của sản phẩm' },
    watermark: { title: 'Dấu ấn thương hiệu (Watermark)', subtitle: 'Đóng dấu logo MÂY chính hãng' },
    advanced: { title: 'Cài đặt chuyên sâu (Advanced)', subtitle: 'Bảo vệ nhãn in & độ phân giải xuất' },
  };

  return (
    <aside
      className={`w-80 h-full border-l flex flex-col shrink-0 z-20 transition-colors duration-200 ${
        isDark ? 'bg-[#1A1416]/95 border-[#302225]' : 'bg-white/95 border-[#EFE4DE]'
      }`}
    >
      {/* Header of Active Tool */}
      <div className="px-5 py-4 border-b border-inherit shrink-0">
        <span className="text-[10px] font-bold text-[#B76E79] uppercase tracking-wider block">
          Công cụ đang chọn
        </span>
        <h3 className="text-sm font-bold font-serif">{toolTitles[activeEditTool]?.title}</h3>
        <p className="text-[10.5px] opacity-70 mt-0.5">{toolTitles[activeEditTool]?.subtitle}</p>
      </div>

      {/* Main Controls scroll area */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeEditTool === 'enhance' && renderEnhance()}
        {activeEditTool === 'background' && renderBackground()}
        {activeEditTool === 'lighting' && renderLighting()}
        {activeEditTool === 'resize' && renderResize()}
        {activeEditTool === 'crop' && renderCrop()}
        {activeEditTool === 'watermark' && renderWatermark()}
        {activeEditTool === 'advanced' && renderAdvanced()}
      </div>
    </aside>
  );
};
