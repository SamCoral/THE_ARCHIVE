/**
 * Math utilities for the museum archival lightbox viewer:
 * Zoom clamping, pan bounding, and coordinate transforms.
 */

export interface Point {
  x: number;
  y: number;
}

export const MIN_ZOOM = 1.0;
export const MAX_ZOOM = 4.0;
export const ZOOM_STEP = 0.35;

export function clampZoom(zoom: number, min = MIN_ZOOM, max = MAX_ZOOM): number {
  return Math.min(Math.max(zoom, min), max);
}

export function zoomIn(currentZoom: number): number {
  return clampZoom(Math.round((currentZoom + ZOOM_STEP) * 100) / 100);
}

export function zoomOut(currentZoom: number): number {
  return clampZoom(Math.round((currentZoom - ZOOM_STEP) * 100) / 100);
}

export function calculatePanBounds(
  pan: Point,
  zoom: number,
  containerWidth: number,
  containerHeight: number
): Point {
  if (zoom <= 1.0) {
    return { x: 0, y: 0 };
  }

  // Max allowed translation so image doesn't drift into infinity
  const maxPanX = (containerWidth * (zoom - 1)) / 2;
  const maxPanY = (containerHeight * (zoom - 1)) / 2;

  const clampedX = Math.min(Math.max(pan.x, -maxPanX), maxPanX);
  const clampedY = Math.min(Math.max(pan.y, -maxPanY), maxPanY);

  return { x: clampedX, y: clampedY };
}
