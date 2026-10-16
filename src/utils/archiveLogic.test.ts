import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterStoriesByCategory,
  filterStoriesByPeriod,
  searchStories,
  getStoryById,
  getFeaturedStory,
  getCategoryLabel,
  createHistoricalRecord
} from './archiveLogic.ts';
import type { Story } from './archiveLogic.ts';

const mockStories: Story[] = [
  {
    id: 'zaria-rebels',
    accessionNumber: 'ACC.1958.09.14',
    title: 'The Zaria Rebels & Natural Synthesis',
    subtitle: 'The 1958 Revolution in Nigerian Modernism',
    period: 'colonial',
    category: 'art',
    dateDisplay: 'October 1958',
    location: 'Zaria, Northern Nigeria',
    summary: 'Students at the Nigerian College of Arts challenged Western academic art by embracing indigenous Uli motifs.',
    fullNarrative: ['In 1958, young artists broke away...'],
    keyFigures: ['Uche Okeke', 'Demas Nwoko', 'Bruce Onobrakpeya'],
    medium: 'Archival linocuts and oil on board',
    provenance: 'Zaria Art Society Archives',
    curatorNotes: 'Crucial turning point in postcolonial African aesthetics.',
    image: '/assets/zaria.jpg',
    imageAlt: 'Zaria studio photograph',
    imageCredit: 'Archival Collection',
    featured: true
  },
  {
    id: 'lagos-highlife',
    accessionNumber: 'ACC.1960.10.01',
    title: 'The Golden Age of Lagos Highlife',
    subtitle: 'Caban Bamboo, Victor Olaiya & Midnight Polyphony',
    period: 'independence',
    category: 'sound',
    dateDisplay: '1952–1966',
    location: 'Lagos Island, Nigeria',
    summary: 'The brass and talking drum pulse of midnight Lagos in the sovereign independence decade.',
    fullNarrative: ['Highlife bridged traditional rhythms and cosmopolitan jazz...'],
    keyFigures: ['Victor Olaiya', 'Rex Jim Lawson', 'Bobby Benson'],
    medium: '78 RPM Vinyl Shellac and Magnetic Tape',
    provenance: 'Decca West Africa & Philips Records',
    curatorNotes: 'Defines the euphoric soundscape of 1960 independence.',
    image: '/assets/highlife.jpg',
    imageAlt: 'Lagos highlife band',
    imageCredit: 'National Sound Archive',
    featured: false
  },
  {
    id: 'adire-eleko',
    accessionNumber: 'ACC.1934.04.12',
    title: 'Adire Eleko: Sacred Geometry in Indigo',
    subtitle: 'The Cassava Starch Resist Weavers of Abeokuta',
    period: 'nineteenth',
    category: 'style',
    dateDisplay: 'c. 1910–1970',
    location: 'Abeokuta, Ogun State',
    summary: 'Hand-drawn geometric resist indigo cloth embodying Yoruba proverbs and lineage.',
    fullNarrative: ['Women dyers of Abeokuta perfected starch resist techniques...'],
    keyFigures: ['Iya Alaro Guild'],
    medium: 'Indigo-dyed hand-painted cotton',
    provenance: 'Egba Women Weavers Collective',
    curatorNotes: 'Textile as a living library of communal philosophy.',
    image: '/assets/adire.jpg',
    imageAlt: 'Indigo Adire cloth detail',
    imageCredit: 'Museum of Traditional Nigerian Art',
    featured: false
  }
];

test('filterStoriesByCategory returns all stories when filter is "all"', () => {
  const result = filterStoriesByCategory(mockStories, 'all');
  assert.equal(result.length, 3);
});

test('filterStoriesByCategory filters stories by exact category', () => {
  const soundStories = filterStoriesByCategory(mockStories, 'sound');
  assert.equal(soundStories.length, 1);
  assert.equal(soundStories[0].id, 'lagos-highlife');

  const artStories = filterStoriesByCategory(mockStories, 'art');
  assert.equal(artStories.length, 1);
  assert.equal(artStories[0].id, 'zaria-rebels');
});

test('filterStoriesByPeriod filters correctly by historical era', () => {
  const independenceStories = filterStoriesByPeriod(mockStories, 'independence');
  assert.equal(independenceStories.length, 1);
  assert.equal(independenceStories[0].id, 'lagos-highlife');

  const nineteenthStories = filterStoriesByPeriod(mockStories, 'nineteenth');
  assert.equal(nineteenthStories.length, 1);
  assert.equal(nineteenthStories[0].id, 'adire-eleko');
});

test('searchStories finds matches in title, key figures, and accession numbers', () => {
  // Title match
  const titleSearch = searchStories(mockStories, 'Highlife');
  assert.equal(titleSearch.length, 1);
  assert.equal(titleSearch[0].id, 'lagos-highlife');

  // Key figure match
  const figureSearch = searchStories(mockStories, 'Uche Okeke');
  assert.equal(figureSearch.length, 1);
  assert.equal(figureSearch[0].id, 'zaria-rebels');

  // Accession match
  const accessionSearch = searchStories(mockStories, '1934');
  assert.equal(accessionSearch.length, 1);
  assert.equal(accessionSearch[0].id, 'adire-eleko');

  // Location match
  const locationSearch = searchStories(mockStories, 'Abeokuta');
  assert.equal(locationSearch.length, 1);

  // Empty query returns everything
  const emptySearch = searchStories(mockStories, '');
  assert.equal(emptySearch.length, 3);
});

test('getFeaturedStory returns the story flagged with featured: true', () => {
  const featured = getFeaturedStory(mockStories);
  assert.ok(featured);
  assert.equal(featured?.id, 'zaria-rebels');
});

test('getCategoryLabel maps category keys to editorial display titles', () => {
  assert.equal(getCategoryLabel('photography'), 'The Image Archive');
  assert.equal(getCategoryLabel('sound'), 'The Sound Archive');
  assert.equal(getCategoryLabel('style'), 'The Style Archive');
  assert.equal(getCategoryLabel('print'), 'The Printed Archive');
  assert.equal(getCategoryLabel('art'), 'Art & Architecture');
});

test('createHistoricalRecord generates formatted accession reference and picture metadata', () => {
  const record = createHistoricalRecord({
    contributorName: 'Dr. Amina Adeleke',
    email: 'amina@example.com',
    artifactType: 'photograph',
    historicalFromEra: 'colonial',
    location: 'Lagos Marina',
    narrative: 'Family photo from 1924 showing wooden canoe traders at the Marina.',
    pictureUrl: '/src/assets/images/google_arts_lagos_marina_1920_1792143381164.jpg',
    pictureCaption: 'Lagos Marina 1920s trading canoes',
    pictureSource: 'Google Arts & Culture / Nigerian National Archives'
  }, '4421');

  assert.equal(record.receiptNumber, 'INQ-2026-4421');
  assert.equal(record.accessionRef, 'ACC.COMMUNITY.2026.4421');
  assert.equal(record.contributorName, 'Dr. Amina Adeleke');
  assert.equal(record.historicalFromEra, 'colonial');
  assert.equal(record.eraLabel, 'Colonial Period (1900–1959)');
  assert.equal(record.pictureUrl, '/src/assets/images/google_arts_lagos_marina_1920_1792143381164.jpg');
  assert.equal(record.pictureSource, 'Google Arts & Culture / Nigerian National Archives');
  assert.equal(record.status, 'curatorial_review');
});
