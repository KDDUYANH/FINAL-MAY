import { AspectRatio, BoundingBox, NormalizedVisualLayout, VisualTemplate } from '../types/studio';

export class VisualLayoutEngine {
  /**
   * Computes layout element positions ensuring typography does NOT overlap the product.
   */
  public static computeLayout(
    template: VisualTemplate,
    aspectRatio: AspectRatio,
    productBox: BoundingBox = { x: 0.25, y: 0.15, width: 0.50, height: 0.70 }
  ): NormalizedVisualLayout {
    switch (template) {
      case 'poster':
        return this.computePosterLayout(aspectRatio, productBox);
      case 'highlight':
        return this.computeHighlightLayout(aspectRatio, productBox);
      case 'benefit':
        return this.computeBenefitLayout(aspectRatio, productBox);
      case 'promo':
        return this.computePromoLayout(aspectRatio, productBox);
      case 'quote':
        return this.computeQuoteLayout(aspectRatio, productBox);
      case 'hero':
      default:
        return this.computeHeroLayout(aspectRatio, productBox);
    }
  }

  private static computeHeroLayout(ratio: AspectRatio, box: BoundingBox): NormalizedVisualLayout {
    // If vertical ratio (4:5 or 9:16), headline goes on top or bottom negative space
    const isTall = ratio === '4:5' || ratio === '9:16';
    const topSpaceAvailable = box.y > 0.22;

    if (isTall && topSpaceAvailable) {
      return {
        template: 'hero',
        aspectRatio: ratio,
        headline: { x: 0.08, y: 0.08, width: 0.84, align: 'center', fontSizeRatio: ratio === '9:16' ? 0.075 : 0.065 },
        subheadline: { x: 0.12, y: ratio === '9:16' ? 0.16 : 0.15, width: 0.76, align: 'center', fontSizeRatio: 0.035 },
        badge: { x: 0.5, y: 0.04, width: 0.4, align: 'center', fontSizeRatio: 0.028 },
        ctaButton: { x: 0.5, y: 0.90, width: 0.5, align: 'center', fontSizeRatio: 0.032 },
        productScale: 1.0
      };
    }

    // Default bottom anchor for wide/square or tight top space
    return {
      template: 'hero',
      aspectRatio: ratio,
      headline: { x: 0.08, y: 0.76, width: 0.84, align: 'center', fontSizeRatio: 0.06 },
      subheadline: { x: 0.10, y: 0.84, width: 0.80, align: 'center', fontSizeRatio: 0.032 },
      badge: { x: 0.5, y: 0.71, width: 0.35, align: 'center', fontSizeRatio: 0.026 },
      ctaButton: { x: 0.5, y: 0.91, width: 0.45, align: 'center', fontSizeRatio: 0.03 },
      productScale: 0.92
    };
  }

  private static computePosterLayout(ratio: AspectRatio, _box: BoundingBox): NormalizedVisualLayout {
    return {
      template: 'poster',
      aspectRatio: ratio,
      headline: { x: 0.06, y: 0.72, width: 0.88, align: 'center', fontSizeRatio: ratio === '9:16' ? 0.08 : 0.068 },
      subheadline: { x: 0.10, y: 0.80, width: 0.80, align: 'center', fontSizeRatio: 0.034 },
      badge: { x: 0.5, y: 0.67, width: 0.45, align: 'center', fontSizeRatio: 0.028 },
      ctaButton: { x: 0.5, y: 0.88, width: 0.5, align: 'center', fontSizeRatio: 0.032 },
      productScale: 0.88
    };
  }

  private static computeHighlightLayout(ratio: AspectRatio, _box: BoundingBox): NormalizedVisualLayout {
    return {
      template: 'highlight',
      aspectRatio: ratio,
      headline: { x: 0.08, y: 0.08, width: 0.84, align: 'left', fontSizeRatio: 0.06 },
      subheadline: { x: 0.08, y: 0.16, width: 0.65, align: 'left', fontSizeRatio: 0.032 },
      badge: { x: 0.08, y: 0.04, width: 0.35, align: 'left', fontSizeRatio: 0.026 },
      ctaButton: { x: 0.08, y: 0.88, width: 0.4, align: 'left', fontSizeRatio: 0.03 },
      productScale: 0.95
    };
  }

  private static computeBenefitLayout(ratio: AspectRatio, _box: BoundingBox): NormalizedVisualLayout {
    return {
      template: 'benefit',
      aspectRatio: ratio,
      headline: { x: 0.08, y: 0.09, width: 0.84, align: 'center', fontSizeRatio: 0.062 },
      subheadline: { x: 0.12, y: 0.17, width: 0.76, align: 'center', fontSizeRatio: 0.034 },
      badge: { x: 0.5, y: 0.05, width: 0.4, align: 'center', fontSizeRatio: 0.026 },
      ctaButton: { x: 0.5, y: 0.89, width: 0.48, align: 'center', fontSizeRatio: 0.032 },
      productScale: 0.9
    };
  }

  private static computePromoLayout(ratio: AspectRatio, _box: BoundingBox): NormalizedVisualLayout {
    return {
      template: 'promo',
      aspectRatio: ratio,
      headline: { x: 0.06, y: 0.74, width: 0.88, align: 'center', fontSizeRatio: 0.072 },
      subheadline: { x: 0.10, y: 0.83, width: 0.80, align: 'center', fontSizeRatio: 0.036 },
      badge: { x: 0.5, y: 0.68, width: 0.42, align: 'center', fontSizeRatio: 0.03 },
      ctaButton: { x: 0.5, y: 0.90, width: 0.52, align: 'center', fontSizeRatio: 0.034 },
      productScale: 0.88
    };
  }

  private static computeQuoteLayout(ratio: AspectRatio, _box: BoundingBox): NormalizedVisualLayout {
    return {
      template: 'quote',
      aspectRatio: ratio,
      headline: { x: 0.10, y: 0.10, width: 0.80, align: 'center', fontSizeRatio: 0.055 },
      subheadline: { x: 0.15, y: 0.20, width: 0.70, align: 'center', fontSizeRatio: 0.032 },
      badge: { x: 0.5, y: 0.05, width: 0.35, align: 'center', fontSizeRatio: 0.024 },
      ctaButton: { x: 0.5, y: 0.88, width: 0.44, align: 'center', fontSizeRatio: 0.03 },
      productScale: 0.92
    };
  }
}
