export interface AnalysisResult {
  hasProduct: boolean;
  confidence: number;
  isDemo?: boolean;
  imageQuality: "Good" | "Excellent" | "Fair";
  backgroundStatus: "Needs refinement" | "Clean" | "Studio";
  productBoundingBox?: { x: number; y: number; width: number; height: number };
  detectedLabels: string[];
  protectedRegionsCount: number;
}

export interface EnhancementParams {
  preset: string;
  lightingPreset?: string;
  exposure?: number;
  contrast?: number;
  sharpness?: number;
}

export interface CompositingResult {
  enhancedImageUrl: string;
  maskImageUrl?: string;
  isDemo?: boolean;
  integrityConfidence: number;
  qaPassed: boolean;
  qaMessage: string;
}

export interface ImageAIProvider {
  name: string;
  isConfigured: boolean;
  analyzeProduct(imageUrl: string): Promise<AnalysisResult>;
  enhanceProduct(imageUrl: string, params: EnhancementParams): Promise<CompositingResult>;
}
