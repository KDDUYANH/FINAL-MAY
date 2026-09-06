export type ViewMode = "home" | "studio";

export type WorkflowStep = "UPLOAD" | "ENHANCE" | "PROTECT" | "EXPORT";

export type ActiveTool =
  | "UPLOAD"
  | "ENHANCE"
  | "EDIT"
  | "BACKGROUND"
  | "LOGO"
  | "PROTECT"
  | "WATERMARK"
  | "EXPORT";

export type InteractionMode = "pan" | "transform" | "logo-drag" | "watermark-drag";

export type EnhancementPreset =
  | "Clean Luxury"
  | "Soft Pink"
  | "Marble Studio"
  | "Editorial"
  | "Natural"
  | "Custom";

export type EnhancementMode = "AUTO" | "BALANCED" | "PREMIUM";

export type BackgroundPreset =
  | "Original"
  | "Clean Studio"
  | "Soft Silk"
  | "Marble"
  | "Floral";

export type LightingPreset = "Natural" | "Soft Luxury" | "Warm Studio";

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

export type QAStatus = "RAW" | "PROCESSING" | "READY" | "REVIEW" | "PROTECTED" | "FAILED";

export interface LogoSettings {
  enabled: boolean;
  url: string;
  anchorPosition: LogoAnchorPosition;
  scale: number; // percentage 10% to 100%
  opacity: number; // 0 to 1
  rotation: number; // degrees -180 to 180
  margin: number; // percentage offset from edges 1% to 20%
  smartPlacement: boolean;
  isManualPosition: boolean;
  normalizedX: number; // 0..1
  normalizedY: number; // 0..1
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
  textOverride?: string;
}

export interface ImageTransform {
  normalizedX: number; // 0.5 = center
  normalizedY: number; // 0.5 = center
  widthPx: number;
  heightPx: number;
  lockAspectRatio: boolean;
  rotation: number;
}

export interface EditAdjustments {
  exposure: number; // -100 to 100
  contrast: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  saturation: number; // -100 to 100
  sharpness: number; // 0 to 100
  noiseReduction: number; // 0 to 100
  clarity: number; // 0 to 100
  colorIntensity: number; // 0 to 100
  rotation: number; // 0, 90, 180, 270
  cropRatio: "Original" | "1:1" | "4:5" | "9:16" | "16:9" | "Free";
}

export interface AnalysisRecommendation {
  action: ActiveTool;
  title: string;
  reason: string;
  confidence: number;
}

export interface EditOperation {
  id: string;
  type: "enhance" | "edit" | "background" | "lighting" | "logo" | "watermark" | "transform";
  description: string;
  params: Record<string, unknown>;
  timestamp: number;
}

export interface AssetItem {
  id: string;
  name: string;
  originalUrl: string; // Source truth
  committedUrl: string; // Committed applied result
  previewUrl: string; // Live transient preview
  hasUncommittedPreview: boolean;
  isGeneratingPreview: boolean;
  previewRequestId: number;
  
  width: number;
  height: number;
  status: QAStatus;
  qaMessage?: string;
  hasProtectedProduct: boolean;
  
  // Enhancement & Controls
  enhancementMode: EnhancementMode;
  enhancementPreset: EnhancementPreset;
  backgroundPreset: BackgroundPreset;
  lightingPreset: LightingPreset;
  
  // Image Transform & Edit
  imageTransform: ImageTransform;
  editAdjustments: EditAdjustments;
  
  // Overlays
  logo: LogoSettings;
  watermark: WatermarkSettings;
  
  // Recommendation & History
  recommendation?: AnalysisRecommendation;
  history: EditOperation[];
  historyIndex: number;
  createdAt: number;
}

export type ZoomLevel = "FIT" | 0.25 | 0.5 | 1.0;

export interface PreflightQA {
  productProtected: boolean;
  logoValid: boolean;
  watermarkSafe: boolean;
  formatValid: boolean;
  estimatedSizeMB: string;
  outputWidth: number;
  outputHeight: number;
}
