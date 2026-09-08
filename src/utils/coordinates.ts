/**
 * Smart Edit Coordinate Transformation System
 * 
 * Separates coordinate spaces:
 * - SCREEN: Viewport pixel coordinates (mouse, touches, client bounding rect)
 * - CANVAS: Virtual canvas viewport (with pan and zoom applied)
 * - IMAGE: Normalized [0..1] and pixel [0..W, 0..H] source image space
 */

export interface Point {
  x: number;
  y: number;
}

export interface ViewportTransform {
  zoom: number; // e.g. 1.0 = 100%, 2.0 = 200%
  panX: number; // canvas pan offset X
  panY: number; // canvas pan offset Y
  canvasRect: DOMRect; // container DOMRect
}

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Converts screen viewport pixel coordinates to virtual canvas coordinates
 */
export function screenToCanvas(screenPt: Point, transform: ViewportTransform): Point {
  const relX = screenPt.x - transform.canvasRect.left;
  const relY = screenPt.y - transform.canvasRect.top;
  return {
    x: (relX - transform.panX) / transform.zoom,
    y: (relY - transform.panY) / transform.zoom,
  };
}

/**
 * Converts virtual canvas coordinates back to screen viewport pixels
 */
export function canvasToScreen(canvasPt: Point, transform: ViewportTransform): Point {
  return {
    x: canvasPt.x * transform.zoom + transform.panX + transform.canvasRect.left,
    y: canvasPt.y * transform.zoom + transform.panY + transform.canvasRect.top,
  };
}

/**
 * Converts canvas coordinates to normalized image space [0..1]
 */
export function canvasToImage(canvasPt: Point, canvasSize: { width: number; height: number }): Point {
  return {
    x: Math.max(0, Math.min(1, canvasPt.x / canvasSize.width)),
    y: Math.max(0, Math.min(1, canvasPt.y / canvasSize.height)),
  };
}

/**
 * Converts normalized image coordinates [0..1] to canvas coordinates
 */
export function imageToCanvas(normPt: Point, canvasSize: { width: number; height: number }): Point {
  return {
    x: normPt.x * canvasSize.width,
    y: normPt.y * canvasSize.height,
  };
}
