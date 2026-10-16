/**
 * Timeline zoom level definitions and helper math
 */

export type TimelineZoomLevel = 'compact' | 'standard' | 'expanded';

export interface TimelineZoomConfig {
  level: TimelineZoomLevel;
  minWidth: number;
  label: string;
  decadesVisibleText: string;
}

export const TIMELINE_ZOOM_CONFIGS: Record<TimelineZoomLevel, TimelineZoomConfig> = {
  compact: {
    level: 'compact',
    minWidth: 185,
    label: 'Compact Rail',
    decadesVisibleText: 'All Centuries (Wide View)'
  },
  standard: {
    level: 'standard',
    minWidth: 260,
    label: 'Standard Rail',
    decadesVisibleText: 'Multi-Decade Overview'
  },
  expanded: {
    level: 'expanded',
    minWidth: 360,
    label: 'Expanded Rail',
    decadesVisibleText: 'Deep Decade Detail'
  }
};

const ZOOM_ORDER: TimelineZoomLevel[] = ['compact', 'standard', 'expanded'];

export function getNextZoomIn(current: TimelineZoomLevel): TimelineZoomLevel {
  const currentIndex = ZOOM_ORDER.indexOf(current);
  if (currentIndex < ZOOM_ORDER.length - 1) {
    return ZOOM_ORDER[currentIndex + 1];
  }
  return current;
}

export function getNextZoomOut(current: TimelineZoomLevel): TimelineZoomLevel {
  const currentIndex = ZOOM_ORDER.indexOf(current);
  if (currentIndex > 0) {
    return ZOOM_ORDER[currentIndex - 1];
  }
  return current;
}

export function getStoryShareUrl(storyId: string, origin = 'http://localhost:3000'): string {
  return `${origin}#story=${encodeURIComponent(storyId)}`;
}
