export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform2D {
  x: number; // Normalized 0..1 relative to canvas container
  y: number; // Normalized 0..1 relative to canvas container
  scale: number; // Relative scale (1.0 = fit)
  rotation: number; // degrees 0, 90, 180, 270
}

/**
 * Converts screen pointer coordinates (clientX, clientY) to Canvas container space (px).
 */
export function screenToCanvas(
  screenPoint: Point,
  containerRect: DOMRect
): Point {
  return {
    x: screenPoint.x - containerRect.left,
    y: screenPoint.y - containerRect.top,
  };
}

/**
 * Converts Canvas container coordinates (px) to Normalized 0..1 coordinates.
 */
export function canvasToNormalized(
  canvasPoint: Point,
  containerWidth: number,
  containerHeight: number
): Point {
  return {
    x: Math.max(0, Math.min(1, canvasPoint.x / (containerWidth || 1))),
    y: Math.max(0, Math.min(1, canvasPoint.y / (containerHeight || 1))),
  };
}

/**
 * Converts Normalized 0..1 coordinates back to Canvas container coordinates (px).
 */
export function normalizedToCanvas(
  normalizedPoint: Point,
  containerWidth: number,
  containerHeight: number
): Point {
  return {
    x: normalizedPoint.x * containerWidth,
    y: normalizedPoint.y * containerHeight,
  };
}

/**
 * Calculates high-DPI device pixel ratio scaling factor for crisp Retina canvas rendering.
 */
export function getRetinaScaleFactor(ctx: CanvasRenderingContext2D): number {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return dpr;
}

/**
 * Clamps normalized position (0..1) so image or overlay element stays within safe container bounds.
 */
export function clampNormalizedPosition(
  pos: Point,
  elementWidthRatio: number,
  elementHeightRatio: number
): Point {
  const minX = elementWidthRatio / 2;
  const maxX = 1 - elementWidthRatio / 2;
  const minY = elementHeightRatio / 2;
  const maxY = 1 - elementHeightRatio / 2;

  return {
    x: Math.max(minX, Math.min(maxX, pos.x)),
    y: Math.max(minY, Math.min(maxY, pos.y)),
  };
}
