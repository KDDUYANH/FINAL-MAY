// ─── View / Navigation ──────────────────────────────────────────
export type AppView = 'home' | 'studio';

// ─── Tool Hierarchy (Intent-based) ──────────────────────────────
export type EditTool = 'enhance' | 'background' | 'lighting' | 'resize' | 'crop' | 'watermark' | 'advanced';

export type ViewMode = 'split' | 'before' | 'after' | 'side-by-side';
export type AspectRatio = 'original' | '1:1' | '4:5' | '3:4' | '9:16' | '16:9';

// ─── Presets ────────────────────────────────────────────────────
export type EnhancePreset = 'auto' | 'clean_luxury' | 'soft_beauty' | 'editorial' | 'sharpen';
export type CleanIntensity = 'low' | 'balanced' | 'strong';

export type LightingPreset =
  | 'auto' | 'soft_studio' | 'clean_commercial'
  | 'editorial' | 'luxury' | 'warm_beauty';

export type ScenePreset =
  | 'original' | 'pure_white' | 'soft_studio' | 'warm_neutral'
  | 'marble' | 'silk' | 'editorial' | 'minimal_luxury';

export type FramePlacement =
  | 'center' | 'top_space' | 'bottom_space' | 'left_space' | 'right_space';

export type WatermarkMode = 'logo' | 'subtle' | 'security';
export type WatermarkPosition =
  | 'auto' | 'bottom_right' | 'bottom_left'
  | 'top_right' | 'top_left' | 'center';

// ─── AI Job ─────────────────────────────────────────────────────
export type AIJobState =
  | 'idle' | 'queued' | 'analyzing' | 'protecting'
  | 'processing' | 'qa' | 'completed' | 'warning' | 'failed';

// ─── Smart Analysis ─────────────────────────────────────────────
export interface BoundingBox {
  x: number; y: number; width: number; height: number;
}

export interface SmartAnalysis {
  productDetected: boolean;
  confidence: number;
  boundingBox: BoundingBox;
  orientation: 'portrait' | 'landscape' | 'square';
  imageQualityScore: number;
  backgroundClutterScore: number;
  lightingQuality: 'dim' | 'balanced' | 'harsh' | 'uneven';
  shadowsQuality: 'soft' | 'hard' | 'missing' | 'natural';
  labelRisk: 'safe' | 'low' | 'moderate' | 'high';
  productEdgesIntact: boolean;
  transparencyIssues: boolean;
  recommendedCrop: AspectRatio;
  recommendedEnhancement: EnhancePreset;
  recommendedComposition: FramePlacement;
  summaryRecommendation: string;
}

// ─── Smart Recommendation ───────────────────────────────────────
export interface SmartRecommendation {
  action: string;
  reason: string;
  presetSuggestion?: EnhancePreset;
  backgroundSuggestion?: ScenePreset;
  lightingSuggestion?: LightingPreset;
  isAlreadyGood: boolean;
}

// ─── Edit Recipe (per-asset) ────────────────────────────────────
export interface EditRecipe {
  // Enhance (merged: clean + beautify + sharpen)
  enhancePreset: EnhancePreset;
  cleanIntensity: CleanIntensity;
  preservePackagingTexture: boolean;

  // Lighting
  lightingPreset: LightingPreset;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  temperature: number;
  productSeparation: number;
  shadowStrength: number;

  // Scene / Background
  scenePreset: ScenePreset;
  depthOfField: number;
  reflectionStrength: number;

  // Frame & Crop
  aspectRatio: AspectRatio;
  framePlacement: FramePlacement;
  autoFrame: boolean;
  safeAreaMargin: number;
  cropRotation?: number;
  cropZoom?: number;

  // Output
  outputResolution: 'original' | '2k' | '4k';
  preserveGeometry: boolean;
  protectLabels: boolean;
}

// ─── Brand / Watermark ──────────────────────────────────────────
export interface BrandRecipe {
  watermarkEnabled: boolean;
  watermarkMode: WatermarkMode;
  watermarkOpacity: number;
  watermarkScale: number;
  watermarkRotation: number;
  watermarkPosition: WatermarkPosition;
  protectProductArea: boolean;
  logoAsset: string;
}

// ─── Batch ──────────────────────────────────────────────────────
export interface BatchException {
  code: 'EDGE_PROXIMITY' | 'LOGO_OVERLAP' | 'LOW_RESOLUTION' | 'LOW_CONFIDENCE' | 'COMPOSITION_MISMATCH';
  severity: 'warning' | 'error';
  message: string;
}

// ─── Asset ──────────────────────────────────────────────────────
export interface Asset {
  id: string;
  name: string;
  category: string;
  beforeImg: string;       // original uploaded image
  afterImg: string;        // committed result
  previewImg?: string;     // live preview (uncommitted)
  width: number;
  height: number;
  isMaster: boolean;
  isSelected: boolean;
  status: 'Raw' | 'Master' | 'Ready' | 'Processing' | 'Review' | 'Done' | 'Failed';
  integrityScore: number;
  protectedRegions: string[];
  analysis?: SmartAnalysis;
  recommendation?: SmartRecommendation;
  recipe: EditRecipe;
  brand: BrandRecipe;
  overrideActive: boolean;
  exceptions: BatchException[];
}

// ─── Master Recipe ──────────────────────────────────────────────
export interface MasterRecipe {
  id: string;
  name: string;
  description: string;
  recipe: EditRecipe;
  brand: BrandRecipe;
  exportSettings: {
    format: 'jpg' | 'png' | 'webp';
    quality: 'standard' | 'high' | 'max';
    resolution: 'original' | '2k' | '4k';
  };
}

// ─── Export ─────────────────────────────────────────────────────
export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  resolution: '2k' | '4k' | 'original';
  format: 'jpg' | 'png' | 'webp';
  quality: 'standard' | 'high' | 'max';
}
