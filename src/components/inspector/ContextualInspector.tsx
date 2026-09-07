import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  Image as ImageIcon, 
  Heart, 
  Crop, 
  Maximize2, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { 
  EditTool, 
  CleanIntensity, 
  LightingPreset, 
  ScenePreset, 
  BeautifyPreset, 
  AspectRatio, 
  FramePlacement, 
  EnhancePreset 
} from '../../types/studio';

export const ContextualInspector: React.FC = () => {
  const {
    activeEditTool,
    setActiveEditTool,
    assets,
    selectedAssetId,
    updateActiveRecipe,
    themeMode,
    makeProfessional,
    jobState
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const recipe = activeAsset?.recipe;

  // Collapsible "Fine Tune" section state
  const [showFineTune, setShowFineTune] = useState(false);

  if (!activeAsset || !recipe) return null;

  const tools: { id: EditTool; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'clean', label: 'Clean', icon: Sparkles },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'scene', label: 'Scene', icon: ImageIcon },
    { id: 'beautify', label: 'Beautify', icon: Heart },
    { id: 'frame', label: 'Frame', icon: Crop },
    { id: 'enhance', label: 'Enhance', icon: Maximize2 },
  ];

  // Tool 1: CLEAN
  const renderCleanControls = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold">Auto Clean Bề Mặt</label>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            Bảo vệ vân bao bì
          </span>
        </div>
        <p className="text-[11px] opacity-75 leading-relaxed">
          Tự động loại bỏ bụi bẩn, vết xước micro và hạt nhiễu trên phông nền trong khi giữ nguyên viền và nhãn in.
        </p>
      </div>

      {/* Intensity Selector: Low / Balanced / Strong */}
      <div>
        <label className="text-xs font-bold block mb-2">Mức độ làm sạch (Intensity)</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'balanced', 'strong'] as CleanIntensity[]).map((level) => (
            <button
              key={level}
              onClick={() => updateActiveRecipe({ cleanIntensity: level })}
              className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                recipe.cleanIntensity === level
                  ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                  : isDark ? 'bg-[#22181B] border-[#3D292D] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
              }`}
            >
              {level === 'low' ? 'Nhẹ' : level === 'balanced' ? 'Cân bằng' : 'Mạnh'}
            </button>
          ))}
        </div>
      </div>

      {/* Progressive Disclosure: Fine Tune */}
      <div className="pt-2">
        <button
          onClick={() => setShowFineTune(!showFineTune)}
          className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Fine tune nâng cao
          </span>
          {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFineTune && (
          <div className="p-3 mt-2 rounded-2xl border space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
            <div className="flex items-center justify-between">
              <span>Bảo toàn kết cấu vật liệu:</span>
              <input
                type="checkbox"
                checked={recipe.preservePackagingTexture}
                onChange={(e) => updateActiveRecipe({ preservePackagingTexture: e.target.checked })}
                className="accent-[#B76E79]"
              />
            </div>
            <p className="text-[10px] opacity-70">
              Ngăn ngừa hiện tượng bệt màu hoặc xóa mất độ mờ nhám của thủy tinh cao cấp.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Tool 2: LIGHT
  const renderLightControls = () => {
    const lightPresets: { id: LightingPreset; label: string; desc: string }[] = [
      { id: 'auto', label: 'Tự động (Auto)', desc: 'Phân tích & bù sáng cân bằng' },
      { id: 'soft_studio', label: 'Soft Studio', desc: 'Ánh sáng tản mềm dịu mắt' },
      { id: 'clean_commercial', label: 'Clean Commercial', desc: 'Sáng trong chuẩn sàn thương mại' },
      { id: 'editorial', label: 'Editorial', desc: 'Độ tương phản tạp chí cao cấp' },
      { id: 'luxury', label: 'Luxury Gold', desc: 'Tôn vinh kim loại mạ vàng' },
      { id: 'warm_beauty', label: 'Warm Beauty', desc: 'Tone ấm tự nhiên dịu dàng' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold block mb-2">Preset Ánh Sáng Thương Mại</label>
          <div className="grid grid-cols-2 gap-2">
            {lightPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateActiveRecipe({ lightingPreset: preset.id })}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  recipe.lightingPreset === preset.id
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] hover:bg-[#2A1E22]' : 'bg-[#FAF5F2] border-[#ECDAD2] hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold">{preset.label}</div>
                <div className={`text-[10px] truncate mt-0.5 ${recipe.lightingPreset === preset.id ? 'text-white/80' : 'opacity-70'}`}>
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fine Tune */}
        <div className="pt-2">
          <button
            onClick={() => setShowFineTune(!showFineTune)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Fine tune thông số
            </span>
            {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFineTune && (
            <div className="p-3.5 mt-2 rounded-2xl border space-y-3.5 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Phơi sáng (Exposure):</span>
                  <span className="font-mono">{recipe.exposure > 0 ? `+${recipe.exposure}` : recipe.exposure}</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={recipe.exposure}
                  onChange={(e) => updateActiveRecipe({ exposure: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Tách nền sản phẩm (Separation):</span>
                  <span className="font-mono">{recipe.productSeparation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recipe.productSeparation}
                  onChange={(e) => updateActiveRecipe({ productSeparation: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Độ đậm bóng đổ (Shadows):</span>
                  <span className="font-mono">{recipe.shadowStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
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
  };

  // Tool 3: SCENE
  const renderSceneControls = () => {
    const scenes: { id: ScenePreset; label: string; desc: string }[] = [
      { id: 'pure_white', label: 'Pure White', desc: 'Trắng tinh khiết chuẩn Ecommerce' },
      { id: 'soft_studio', label: 'Soft Studio', desc: 'Studio xám ấm nhẹ nhàng' },
      { id: 'warm_neutral', label: 'Warm Neutral', desc: 'Tone be thanh lịch' },
      { id: 'marble', label: 'Marble Pedestal', desc: 'Bục đá cẩm thạch sang trọng' },
      { id: 'silk', label: 'Silk Draping', desc: 'Lụa satin rủ bồng bềnh' },
      { id: 'editorial', label: 'Editorial Minimal', desc: 'Khối hình học kiến trúc' },
      { id: 'minimal_luxury', label: 'Minimal Luxury', desc: 'Tối giản đẳng cấp quốc tế' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold block mb-2">Bối Cảnh Sản Phẩm (Scene)</label>
          <div className="grid grid-cols-2 gap-2">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => updateActiveRecipe({ scenePreset: scene.id })}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  recipe.scenePreset === scene.id
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] hover:bg-[#2A1E22]' : 'bg-[#FAF5F2] border-[#ECDAD2] hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold">{scene.label}</div>
                <div className={`text-[10px] truncate mt-0.5 ${recipe.scenePreset === scene.id ? 'text-white/80' : 'opacity-70'}`}>
                  {scene.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fine Tune */}
        <div className="pt-2">
          <button
            onClick={() => setShowFineTune(!showFineTune)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Fine tune bề mặt & chiều sâu
            </span>
            {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFineTune && (
            <div className="p-3.5 mt-2 rounded-2xl border space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Độ sâu trường ảnh (Depth of field):</span>
                  <span className="font-mono">{recipe.depthOfField}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recipe.depthOfField}
                  onChange={(e) => updateActiveRecipe({ depthOfField: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Phản xạ đáy (Reflection):</span>
                  <span className="font-mono">{recipe.reflectionStrength}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recipe.reflectionStrength}
                  onChange={(e) => updateActiveRecipe({ reflectionStrength: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tool 4: BEAUTIFY
  const renderBeautifyControls = () => {
    const beautifyPresets: { id: BeautifyPreset; label: string; desc: string }[] = [
      { id: 'natural', label: 'Tự Nhiên (Natural)', desc: 'Bảo toàn tối đa đặc tính gốc' },
      { id: 'clean', label: 'Clean Luminous', desc: 'Trong trẻo, mịn màng dịu mắt' },
      { id: 'soft_beauty', label: 'Soft Beauty', desc: 'Ánh sáng mịn chuẩn spa cao cấp' },
      { id: 'luxury', label: 'Luxury Polished', desc: 'Bóng bẩy ánh kim sang trọng' },
      { id: 'editorial', label: 'Editorial Gloss', desc: 'Độ phản quang bắt mắt' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold block mb-2">Chế Độ Hoàn Thiện Mỹ Phẩm</label>
          <div className="space-y-2">
            {beautifyPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateActiveRecipe({ beautifyPreset: preset.id })}
                className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                  recipe.beautifyPreset === preset.id
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] hover:bg-[#2A1E22]' : 'bg-[#FAF5F2] border-[#ECDAD2] hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className={`text-[10px] mt-0.5 ${recipe.beautifyPreset === preset.id ? 'text-white/80' : 'opacity-70'}`}>
                    {preset.desc}
                  </div>
                </div>
                {recipe.beautifyPreset === preset.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Fine Tune */}
        <div className="pt-2">
          <button
            onClick={() => setShowFineTune(!showFineTune)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Fine tune độ mịn & bóng
            </span>
            {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFineTune && (
            <div className="p-3.5 mt-2 rounded-2xl border space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Mịn bề mặt (Smooth):</span>
                  <span className="font-mono">{recipe.skinSurfaceSmooth}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recipe.skinSurfaceSmooth}
                  onChange={(e) => updateActiveRecipe({ skinSurfaceSmooth: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Độ bóng viền (Polish):</span>
                  <span className="font-mono">{recipe.reflectionPolish}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recipe.reflectionPolish}
                  onChange={(e) => updateActiveRecipe({ reflectionPolish: Number(e.target.value) })}
                  className="w-full accent-[#B76E79]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tool 5: FRAME / COMPOSITION
  const renderFrameControls = () => {
    const ratios: AspectRatio[] = ['1:1', '4:5', '3:4', '9:16', '16:9'];
    const placements: { id: FramePlacement; label: string }[] = [
      { id: 'center', label: 'Chính giữa' },
      { id: 'top_space', label: 'Thở trên (Top Space)' },
      { id: 'bottom_space', label: 'Thở dưới (Bottom Space)' },
      { id: 'left_space', label: 'Thở trái' },
      { id: 'right_space', label: 'Thở phải' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold block mb-2">Tỷ Lệ Khung Hình (Aspect Ratio)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {ratios.map((r) => (
              <button
                key={r}
                onClick={() => updateActiveRecipe({ aspectRatio: r })}
                className={`py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  recipe.aspectRatio === r
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold block mb-2">Bố Cục Sản Phẩm (Placement)</label>
          <div className="grid grid-cols-2 gap-2">
            {placements.map((p) => (
              <button
                key={p.id}
                onClick={() => updateActiveRecipe({ framePlacement: p.id })}
                className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                  recipe.framePlacement === p.id
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs font-bold'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fine Tune */}
        <div className="pt-2">
          <button
            onClick={() => setShowFineTune(!showFineTune)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Lề an toàn (Safe Margin)
            </span>
            {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFineTune && (
            <div className="p-3.5 mt-2 rounded-2xl border space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Khoảng đệm an toàn viền ảnh:</span>
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
          )}
        </div>
      </div>
    );
  };

  // Tool 6: ENHANCE
  const renderEnhanceControls = () => {
    const enhancePresets: { id: EnhancePreset; label: string; desc: string }[] = [
      { id: 'auto', label: 'Auto Balanced', desc: 'Tự động nâng nét viền & nhãn in' },
      { id: 'detail', label: 'Detail Boost', desc: 'Tăng cường chi tiết bề mặt' },
      { id: 'sharpen', label: 'Crisp Sharpen', desc: 'Độ sắc cạnh tối đa' },
      { id: '2k', label: '2K QHD', desc: '2048 x 2560px Thương Mại' },
      { id: '4k', label: '4K Ultra HD', desc: '3840 x 4800px In Ấn / Poster' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold block mb-2">Độ Phân Giải & Tinh Chỉnh AI</label>
          <div className="space-y-2">
            {enhancePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateActiveRecipe({ enhancePreset: preset.id })}
                className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                  recipe.enhancePreset === preset.id
                    ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#3D292D] hover:bg-[#2A1E22]' : 'bg-[#FAF5F2] border-[#ECDAD2] hover:bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className={`text-[10px] mt-0.5 ${recipe.enhancePreset === preset.id ? 'text-white/80' : 'opacity-70'}`}>
                    {preset.desc}
                  </div>
                </div>
                {recipe.enhancePreset === preset.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Details Card */}
        <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
          isDark ? 'bg-[#201719] border-[#382629]' : 'bg-[#FFF9F6] border-[#ECDAD1]'
        }`}>
          <div className="flex justify-between items-center text-[11px]">
            <span className="opacity-75">Độ phân giải nguồn:</span>
            <span className="font-mono font-bold">{activeAsset.width} x {activeAsset.height} px</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="opacity-75">Độ phân giải xuất:</span>
            <span className="font-mono font-bold text-[#B76E79]">
              {recipe.enhancePreset === '4k' ? '3840 x 4800 px (4K)' : '2048 x 2560 px (2K)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold pt-1 border-t border-dashed border-[#ECDAD1]">
            <ShieldCheck className="w-3 h-3" />
            <span>Không tự ý sinh họa tiết giả (Anti-Hallucination)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className={`w-80 border-l flex flex-col justify-between shrink-0 overflow-y-auto transition-colors duration-200 select-none ${
      isDark ? 'bg-[#181315] border-[#2E2023]' : 'bg-white border-[#EFE4DE]'
    }`}>
      <div className="p-5 space-y-5">
        {/* Header with Protected Asset Context */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-[#B76E79] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> {activeAsset.name}
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Protected ✓
            </span>
          </div>
          <p className="text-[10px] opacity-70">
            {activeAsset.overrideActive ? 'Đang chỉnh thông số riêng cho ảnh này' : 'Đồng bộ theo Master Recipe'}
          </p>
        </div>

        {/* Intent-first Tool Selector (Horizontal Pills) */}
        <div>
          <label className="text-[11px] font-bold block mb-2 opacity-80">Công cụ biên tập (Intent)</label>
          <div className="grid grid-cols-3 gap-1.5">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeEditTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveEditTool(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white border-[#8C4752] shadow-xs'
                      : isDark
                      ? 'bg-[#22181B] border-[#3A262A] text-neutral-300 hover:bg-[#2A1E22]'
                      : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700 hover:bg-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contextual Active Tool Controls */}
        <div className="pt-2 border-t border-[#EFE4DE]">
          {activeEditTool === 'clean' && renderCleanControls()}
          {activeEditTool === 'light' && renderLightControls()}
          {activeEditTool === 'scene' && renderSceneControls()}
          {activeEditTool === 'beautify' && renderBeautifyControls()}
          {activeEditTool === 'frame' && renderFrameControls()}
          {activeEditTool === 'enhance' && renderEnhanceControls()}
        </div>
      </div>

      {/* Dominant Bottom Action in Inspector */}
      <div className="p-4 border-t border-[#EFE4DE]">
        <button
          onClick={() => makeProfessional()}
          disabled={jobState === 'processing'}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${jobState === 'processing' ? 'animate-spin' : ''}`} />
          <span>{jobState === 'processing' ? 'Đang hoàn thiện...' : 'Make Professional'}</span>
        </button>
      </div>
    </aside>
  );
};
