/**
 * Pure archive logic for querying, filtering, and organizing
 * historical artifacts and stories for ARCHIVE.
 */

export interface Story {
  id: string;
  accessionNumber: string;
  title: string;
  subtitle: string;
  period: 'precolonial' | 'nineteenth' | 'colonial' | 'independence' | 'postindependence';
  category: 'photography' | 'sound' | 'style' | 'print' | 'art';
  dateDisplay: string;
  location: string;
  summary: string;
  fullNarrative: string[];
  keyFigures: string[];
  medium: string;
  dimensions?: string;
  provenance: string;
  curatorNotes: string;
  quote?: {
    text: string;
    speaker: string;
    year: string;
  };
  image: string;
  imageAlt: string;
  imageCredit: string;
  featured?: boolean;
}

export interface TimelineEra {
  id: 'precolonial' | 'nineteenth' | 'colonial' | 'independence' | 'postindependence';
  periodLabel: string;
  title: string;
  timeRange: string;
  overview: string;
  culturalSignificance: string;
  storyIds: string[];
}

export function filterStoriesByCategory(stories: Story[], category: string): Story[] {
  if (!category || category === 'all') return stories;
  return stories.filter(story => story.category.toLowerCase() === category.toLowerCase());
}

export function filterStoriesByPeriod(stories: Story[], period: string): Story[] {
  if (!period || period === 'all') return stories;
  return stories.filter(story => story.period.toLowerCase() === period.toLowerCase());
}

export function searchStories(stories: Story[], query: string): Story[] {
  const normalizedQuery = (query || '').trim().toLowerCase();
  if (!normalizedQuery) return stories;

  return stories.filter(story => {
    const titleMatch = story.title.toLowerCase().includes(normalizedQuery);
    const subtitleMatch = story.subtitle.toLowerCase().includes(normalizedQuery);
    const summaryMatch = story.summary.toLowerCase().includes(normalizedQuery);
    const locationMatch = story.location.toLowerCase().includes(normalizedQuery);
    const figureMatch = story.keyFigures.some(figure => figure.toLowerCase().includes(normalizedQuery));
    const accessionMatch = story.accessionNumber.toLowerCase().includes(normalizedQuery);
    const categoryMatch = story.category.toLowerCase().includes(normalizedQuery);

    return titleMatch || subtitleMatch || summaryMatch || locationMatch || figureMatch || accessionMatch || categoryMatch;
  });
}

export function getStoryById(stories: Story[], id: string): Story | undefined {
  return stories.find(story => story.id === id);
}

export function getFeaturedStory(stories: Story[]): Story | undefined {
  return stories.find(story => story.featured) || stories[0];
}

export function getCategoryLabel(category: string): string {
  switch (category.toLowerCase()) {
    case 'photography':
      return 'The Image Archive';
    case 'sound':
      return 'The Sound Archive';
    case 'style':
      return 'The Style Archive';
    case 'print':
      return 'The Printed Archive';
    case 'art':
      return 'Art & Architecture';
    default:
      return 'General Archive';
  }
}

export interface HistoricalContributionInput {
  contributorName: string;
  email: string;
  artifactType: string;
  historicalFromEra: string;
  location: string;
  narrative: string;
  pictureUrl?: string;
  pictureCaption?: string;
  pictureSource?: string;
}

export interface HistoricalContributionRecord {
  id: string;
  receiptNumber: string;
  accessionRef: string;
  contributorName: string;
  email: string;
  artifactType: string;
  historicalFromEra: string;
  eraLabel: string;
  location: string;
  narrative: string;
  pictureUrl: string;
  pictureCaption: string;
  pictureSource: string;
  submittedAt: string;
  status: 'curatorial_review' | 'catalogued';
}

export function createHistoricalRecord(input: HistoricalContributionInput, customId?: string): HistoricalContributionRecord {
  const year = 2026;
  const randomSuffix = customId || String(Math.floor(1000 + Math.random() * 9000));
  const receiptNumber = `INQ-${year}-${randomSuffix}`;
  const accessionRef = `ACC.COMMUNITY.${year}.${randomSuffix}`;
  
  const eraLabels: Record<string, string> = {
    precolonial: 'Before Colonial Rule (Pre-1880)',
    nineteenth: '19th Century (1800–1899)',
    colonial: 'Colonial Period (1900–1959)',
    independence: 'Independence Era (1960–1969)',
    postindependence: 'Post-Independence (1970–1985)'
  };

  return {
    id: `contrib-${randomSuffix}`,
    receiptNumber,
    accessionRef,
    contributorName: input.contributorName.trim(),
    email: input.email.trim(),
    artifactType: input.artifactType || 'photograph',
    historicalFromEra: input.historicalFromEra || 'colonial',
    eraLabel: eraLabels[input.historicalFromEra] || 'Historical Record',
    location: input.location?.trim() || 'Nigeria (Unspecified)',
    narrative: input.narrative.trim(),
    pictureUrl: input.pictureUrl || '',
    pictureCaption: input.pictureCaption || 'Historical document submitted for curatorial preservation',
    pictureSource: input.pictureSource || 'Google Arts & Culture / Archival Contributor',
    submittedAt: new Date().toISOString(),
    status: 'curatorial_review'
  };
}
