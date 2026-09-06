import { ImageAIProvider, AnalysisResult, CompositingResult, EnhancementParams } from "./types";

export class DemoAIProvider implements ImageAIProvider {
  name = "Demo Mode (Local Canvas Protection)";
  isConfigured = false;

  async analyzeProduct(imageUrl: string): Promise<AnalysisResult> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      hasProduct: true,
      confidence: 1.0,
      isDemo: true,
      imageQuality: "Good",
      backgroundStatus: "Needs refinement",
      productBoundingBox: { x: 0.25, y: 0.15, width: 0.5, height: 0.7 },
      detectedLabels: ["MÂY Cosmetics (Physical Packaging)"],
      protectedRegionsCount: 1,
      recommendation: {
        action: "ENHANCE",
        title: "Local Demo Enhancement",
        reason:
          "Demo Mode: Cloud AI provider not configured. Product packaging and label text remain 100% untouched using local canvas protection.",
        confidence: 1.0,
      },
    };
  }

  async enhanceProduct(imageUrl: string, params: EnhancementParams): Promise<CompositingResult> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      enhancedImageUrl: imageUrl,
      isDemo: true,
      integrityConfidence: 1.0,
      qaPassed: true,
      qaMessage: "Demo Mode: Original product packaging and label text preserved with local protection filter.",
    };
  }
}

export function getAIProvider(): ImageAIProvider {
  return new DemoAIProvider();
}
