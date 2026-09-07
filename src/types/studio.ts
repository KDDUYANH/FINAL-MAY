export type Stage = 'create' | 'edit' | 'brand' | 'content' | 'batch' | 'export';

export type VisualTemplate = 'hero' | 'poster' | 'highlight' | 'benefit' | 'promo' | 'quote';

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'threads' | 'zalo' | 'marketplace';

export type ContentGoal = 'sales' | 'awareness' | 'engagement' | 'educational' | 'launch';

export type ContentTone = 'clean_luxury' | 'dermatological' | 'warm_elegant' | 'minimal_modern';

export interface ContentBrief {
  title: string;
  message: string;
  goal: ContentGoal;
  tone: ContentTone;
  audience?: string;
  customCta?: string;
  enableResearch: boolean;
}

export interface ProductTruth {
  productName: string;
  brandName: string;
  ingredients: string[];
  productType: string;
  benefits: string[];
  usage: string;
  size: string;
  verifiedClaims: string[];
  needsConfirmationClaims: string[];
  brandVoice: string;
}

export interface SocialPost {
  platform: SocialPlatform;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  shortVersion: string;
}

export interface VisualLayoutElement {
  x: number;      // 0 to 1 normalized
  y: number;      // 0 to 1 normalized
  width: number;  // 0 to 1 normalized
  align: 'left' | 'center' | 'right';
  fontSizeRatio: number; // proportional to canvas width
}

export interface NormalizedVisualLayout {
  template: VisualTemplate;
  aspectRatio: AspectRatio;
  headline: VisualLayoutElement;
  subheadline: VisualLayoutElement;
  badge?: VisualLayoutElement;
  ctaButton?: VisualLayoutElement;
  productScale: number;
}

export interface ContentPack {
  id: string;
  productId: string;
  productName: string;
  heroVisualUrl: string;
  highlightVisualUrl: string;
  posterVisualUrl: string;
  posts: Record<SocialPlatform, SocialPost>;
  createdAt: string;
}

export type EditTool = 'clean' | 'light' | 'scene' | 'beautify' | 'frame' | 'enhance';

export type ViewMode = 'split' | 'before' | 'after' | 'compare';

export type AspectRatio = '1:1' | '4:5' | '3:4' | '9:16' | '16:9';

export type CleanIntensity = 'low' | 'balanced' | 'strong';

export type LightingPreset = 
  | 'auto' 
  | 'soft_studio' 
  | 'clean_commercial' 
  | 'editorial' 
  | 'luxury' 
  | 'warm_beauty';

export type ScenePreset = 
  | 'pure_white' 
  | 'soft_studio' 
  | 'warm_neutral' 
  | 'marble' 
  | 'silk' 
  | 'editorial' 
  | 'minimal_luxury';

export type BeautifyPreset = 
  | 'natural' 
  | 'clean' 
  | 'soft_beauty' 
  | 'luxury' 
  | 'editorial';

export type FramePlacement = 
  | 'center' 
  | 'top_space' 
  | 'bottom_space' 
  | 'left_space' 
  | 'right_space';

export type EnhancePreset = 
  | 'auto' 
  | 'detail' 
  | 'sharpen' 
  | '2k' 
  | '4k';

export type WatermarkMode = 'logo' | 'subtle' | 'security' | 'custom';

export type WatermarkPosition = 
  | 'auto' 
  | 'bottom_right' 
  | 'bottom_left' 
  | 'top_right' 
  | 'top_left' 
  | 'center';

export type AIJobState = 
  | 'idle' 
  | 'queued' 
  | 'analyzing' 
  | 'protecting' 
  | 'processing' 
  | 'qa' 
  | 'completed' 
  | 'warning' 
  | 'failed';

export interface BoundingBox {
  x: number;      // Normalized 0 to 1
  y: number;      // Normalized 0 to 1
  width: number;  // Normalized 0 to 1
  height: number; // Normalized 0 to 1
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

export interface EditRecipe {
  // Clean Tool
  cleanAuto: boolean;
  cleanIntensity: CleanIntensity;
  preservePackagingTexture: boolean;
  manualBlemishCount?: number;

  // Light Tool
  lightingPreset: LightingPreset;
  exposure: number;       // -100 to 100, default 0
  contrast: number;       // -100 to 100, default 0
  highlights: number;     // -100 to 100, default 0
  shadows: number;        // -100 to 100, default 0
  temperature: number;    // -100 to 100, default 0
  productSeparation: number; // 0 to 100, default 30
  shadowStrength: number;    // 0 to 100, default 40

  // Scene Tool
  scenePreset: ScenePreset;
  surfaceOpacity: number;
  depthOfField: number;
  reflectionStrength: number;

  // Beautify Tool
  beautifyPreset: BeautifyPreset;
  skinSurfaceSmooth: number;
  reflectionPolish: number;

  // Frame Tool
  aspectRatio: AspectRatio;
  framePlacement: FramePlacement;
  autoFrame: boolean;
  safeAreaMargin: number; // in percentage (e.g. 10%)

  // Enhance Tool
  enhancePreset: EnhancePreset;
  outputResolution: 'original' | '2k' | '4k';
  preserveGeometry: boolean;
  protectLabels: boolean;
}

export interface BrandRecipe {
  logoEnabled: boolean;
  logoAsset: string;
  logoSize: number;       // 10 to 60 percentage
  logoOpacity: number;    // 10 to 100 percentage
  logoPosition: WatermarkPosition;
  logoSafeMargin: number; // 5 to 25 percentage
  smartPlacementAvoidProduct: boolean;

  watermarkEnabled: boolean;
  watermarkMode: WatermarkMode;
  watermarkOpacity: number;    // 5 to 60 percentage
  watermarkScale: number;      // 10 to 100 percentage
  watermarkRotation: number;   // 0 to 360 deg
  watermarkPosition: WatermarkPosition;
  protectProductArea: boolean; // default ON
  applyToAllBatch: boolean;
}

export interface BatchException {
  code: 'EDGE_PROXIMITY' | 'LOGO_OVERLAP' | 'LOW_RESOLUTION' | 'LOW_CONFIDENCE' | 'COMPOSITION_MISMATCH';
  severity: 'warning' | 'error';
  message: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  maskImg?: string;
  width: number;
  height: number;
  isMaster: boolean;
  isSelected: boolean;
  status: 'Master' | 'Ready' | 'Processing' | 'Review' | 'Done' | 'Failed';
  integrityScore: number;
  protectedRegions: string[];
  analysis?: SmartAnalysis;
  recipe: EditRecipe;
  brand: BrandRecipe;
  overrideActive: boolean;
  exceptions: BatchException[];
}

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

export interface QACheckItem {
  id: string;
  label: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  detail: string;
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  resolution: '2k' | '4k' | 'original';
  format: 'jpg' | 'png' | 'webp';
  quality: 'standard' | 'high' | 'max';
}
