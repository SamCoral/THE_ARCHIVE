import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampZoom,
  zoomIn,
  zoomOut,
  calculatePanBounds,
  MIN_ZOOM,
  MAX_ZOOM
} from './lightboxMath.ts';

test('clampZoom constrains values between MIN_ZOOM and MAX_ZOOM', () => {
  assert.equal(clampZoom(0.5), MIN_ZOOM);
  assert.equal(clampZoom(5.5), MAX_ZOOM);
  assert.equal(clampZoom(2.5), 2.5);
});

test('zoomIn increases zoom by step up to MAX_ZOOM', () => {
  const next = zoomIn(1.0);
  assert.ok(next > 1.0);
  assert.equal(zoomIn(MAX_ZOOM), MAX_ZOOM);
});

test('zoomOut decreases zoom by step down to MIN_ZOOM', () => {
  const prev = zoomOut(2.0);
  assert.ok(prev < 2.0);
  assert.equal(zoomOut(MIN_ZOOM), MIN_ZOOM);
});

test('calculatePanBounds resets pan to (0,0) when zoom is 1.0', () => {
  const result = calculatePanBounds({ x: 50, y: -50 }, 1.0, 1000, 800);
  assert.deepEqual(result, { x: 0, y: 0 });
});

test('calculatePanBounds clamps pan values when zoomed in', () => {
  // Zoom 2.0 on 1000x800 container allows maxPanX = 500, maxPanY = 400
  const resultWithin = calculatePanBounds({ x: 200, y: -150 }, 2.0, 1000, 800);
  assert.deepEqual(resultWithin, { x: 200, y: -150 });

  const resultExceeded = calculatePanBounds({ x: 900, y: -900 }, 2.0, 1000, 800);
  assert.deepEqual(resultExceeded, { x: 500, y: -400 });
});
