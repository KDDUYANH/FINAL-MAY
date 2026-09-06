export type MainModule = "CREATE" | "EDIT" | "CONTENT" | "BATCH" | "LIBRARY";

export type JobStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "protecting"
  | "processing"
  | "qa"
  | "ready"
  | "review"
  | "failed";

export type HeroEditAction =
  | "BEAUTIFY" // ✨ Làm đẹp
  | "CLEAN" // 🧹 Làm sạch
  | "LIGHTING" // ☀ Ánh sáng
  | "SCENE" // ◈ Bối cảnh
  | "ALIGN" // ↔ Căn ảnh
  | "UPSCALE"; // ↑ Nâng chất lượng

export type CanvasHistoryStage = "Original" | "Clean" | "Scene" | "Brand" | "Final";

export type EnhancementPreset =
  | "Auto"
  | "Natural"
  | "Clean Luxury"
  | "Soft Beauty"
  | "Custom";

export type CleanPreset = "Original" | "Cleaned" | "Spotless";

export type LightingPreset = "Natural" | "Soft Studio" | "Editorial" | "Warm";

export type ScenePreset =
  | "Original"
  | "Clean Studio"
  | "Soft Silk"
  | "Marble"
  | "Editorial";

export type AlignPreset = "Fit" | "1:1" | "4:5" | "9:16" | "16:9" | "Center";

export type QualityPreset = "Standard" | "2K" | "4K";

export type WatermarkPreset = "MÂY Logo" | "Security Grid" | "Diagonal Security";

export type LogoAnchorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ProtectionDetails {
  productDetected: boolean;
  labelProtected: boolean;
  logoProtected: boolean;
  textProtected: boolean;
  geometryChecked: boolean;
  status: "Protected" | "Review required" | "Failed";
  boundingBox: { x: number; y: number; width: number; height: number };
  showProtectedArea: boolean;
}

export interface WatermarkSettings {
  enabled: boolean;
  preset: WatermarkPreset;
  opacity: number; // 0 to 1
  scale: number; // 0.1 to 2.0
  rotation: number; // degrees -180 to 180
  spacing: number; // grid gap in px
  smartPlacement: boolean;
  isManualPosition: boolean;
  normalizedX: number; // 0..1
  normalizedY: number; // 0..1
}

export interface EditAdjustments {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
  saturation: number;
  sharpness: number;
  noiseReduction: number;
}

export interface EditOperation {
  id: string;
  type: "beautify" | "clean" | "lighting" | "scene" | "align" | "upscale" | "watermark";
  description: string;
  params: Record<string, unknown>;
  timestamp: number;
}

export interface AssetItem {
  id: string;
  name: string;
  originalUrl: string; // Immutable source truth
  committedUrl: string; // Committed edit result
  previewUrl: string; // Live canvas render
  hasUncommittedPreview: boolean;
  
  width: number;
  height: number;
  jobStatus: JobStatus;
  qaMessage?: string;
  
  // Protection architecture
  protection: ProtectionDetails;
  
  // 6 Hero Edit settings
  beautifyPreset: EnhancementPreset;
  cleanPreset: CleanPreset;
  lightingPreset: LightingPreset;
  scenePreset: ScenePreset;
  alignPreset: AlignPreset;
  qualityPreset: QualityPreset;
  
  // Fine Adjustments
  adjustments: EditAdjustments;
  
  // Watermark
  watermark: WatermarkSettings;
  
  // Active Stage in History
  historyStage: CanvasHistoryStage;
  history: EditOperation[];
  historyIndex: number;
  createdAt: number;
}

export interface ContentPackVisual {
  id: string;
  label: string;
  ratio: "16:9" | "1:1" | "4:5" | "9:16";
  dimensions: string;
  desc: string;
  previewFilter: string;
}

export interface ContentPackCopy {
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
}
