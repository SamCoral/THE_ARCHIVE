import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextZoomIn,
  getNextZoomOut,
  getStoryShareUrl,
  TIMELINE_ZOOM_CONFIGS
} from './timelineZoom.ts';

test('getNextZoomIn increments through compact -> standard -> expanded', () => {
  assert.equal(getNextZoomIn('compact'), 'standard');
  assert.equal(getNextZoomIn('standard'), 'expanded');
  assert.equal(getNextZoomIn('expanded'), 'expanded'); // clamped
});

test('getNextZoomOut decrements through expanded -> standard -> compact', () => {
  assert.equal(getNextZoomOut('expanded'), 'standard');
  assert.equal(getNextZoomOut('standard'), 'compact');
  assert.equal(getNextZoomOut('compact'), 'compact'); // clamped
});

test('getStoryShareUrl formats clean deep link hash', () => {
  const url = getStoryShareUrl('zaria-rebels', 'https://archive.museum');
  assert.equal(url, 'https://archive.museum#story=zaria-rebels');
});

test('TIMELINE_ZOOM_CONFIGS has valid minWidth values', () => {
  assert.ok(TIMELINE_ZOOM_CONFIGS.compact.minWidth < TIMELINE_ZOOM_CONFIGS.standard.minWidth);
  assert.ok(TIMELINE_ZOOM_CONFIGS.standard.minWidth < TIMELINE_ZOOM_CONFIGS.expanded.minWidth);
});
