/**
 * ARCHIVE — The Past Is Still Speaking
 * Core Application Controller, Interactive Museum Timeline,
 * Curatorial Explorer & Web Audio Ambient Soundscape
 */

import { STORIES, TIMELINE_ERAS, FRAGMENTS_OF_MEMORY, ARCHIVE_COLLECTIONS } from './stories.js';

// State management
const state = {
  activeCategory: 'all',
  activePeriod: 'all',
  searchQuery: '',
  activeEraIndex: 0,
  soundscapeActive: false,
  activeModalRecord: null,
  activeModalType: null // 'story' | 'fragment'
};

/* ==========================================================================
   Web Audio API Ambient Soundscape Engine
   Simulates authentic 1950s/60s warm shellac vinyl texture & quiet pentatonic warmth
   ========================================================================== */
class AmbientSoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.vinylNode = null;
    this.melodyTimer = null;
    this.isPlaying = false;
    // Pentatonic scale frequencies (West African acoustic tuning in G: G3, A3, C4, D4, E4, G4)
    this.scale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
    this.noteSequence = [0, 2, 4, 3, 1, 3, 2, 5, 4, 2, 1, 0];
    this.sequenceIndex = 0;
  }

  init() {
    if (this.audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.audioCtx = new AudioContextClass();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);
  }

  // Create authentic vinyl surface hiss and gentle micro-pops
  createVinylTexture() {
    if (!this.audioCtx) return;

    const bufferSize = this.audioCtx.sampleRate * 3;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Gentle brown/pink noise baseline
      let white = Math.random() * 2 - 1;
      let sample = white * 0.015;

      // Occasional micro-pop / dust crackle
      if (Math.random() < 0.0003) {
        sample += (Math.random() > 0.5 ? 1 : -1) * (0.08 + Math.random() * 0.12);
      }
      output[i] = sample;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm bandpass (~800Hz - 2400Hz vintage shellac characteristics)
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    const vinylGain = this.audioCtx.createGain();
    vinylGain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(vinylGain);
    vinylGain.connect(this.masterGain);

    whiteNoise.start();
    this.vinylNode = whiteNoise;
  }

  // Plays a single warm, gentle resonant note like an acoustic thumb-piano or wooden marimba
  playGentleTone(freq) {
    if (!this.audioCtx || !this.isPlaying) return;

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    // Soft attack and natural acoustic exponential decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 3.0);
  }

  start() {
    this.init();
    if (!this.audioCtx) return false;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = true;
    this.createVinylTexture();

    // Master fade-in
    const now = this.audioCtx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(0.85, now + 1.2);

    // Slow meditative melodic progression every 2.4 - 3.2 seconds
    const scheduleNext = () => {
      if (!this.isPlaying) return;
      const noteFreq = this.scale[this.noteSequence[this.sequenceIndex % this.noteSequence.length]];
      this.sequenceIndex++;
      this.playGentleTone(noteFreq);

      const delay = 2400 + Math.random() * 800;
      this.melodyTimer = setTimeout(scheduleNext, delay);
    };

    scheduleNext();
    return true;
  }

  stop() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }

    if (this.audioCtx && this.masterGain) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        if (this.vinylNode) {
          try { this.vinylNode.stop(); } catch (e) { /* ignore */ }
          this.vinylNode.disconnect();
          this.vinylNode = null;
        }
      }, 900);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }
}

const soundEngine = new AmbientSoundscapeEngine();

/* ==========================================================================
   DOM Renderers & Controller
   ========================================================================== */

function initTimeline() {
  const navContainer = document.getElementById('timeline-eras-nav');
  const stageContainer = document.getElementById('timeline-stage');

  if (!navContainer || !stageContainer) return;

  // Render navigation buttons
  navContainer.innerHTML = TIMELINE_ERAS.map((era, index) => `
    <button class="era-tab-btn ${index === state.activeEraIndex ? 'active' : ''}" data-era-index="${index}" aria-label="View ${era.periodLabel}">
      <span class="era-index">${era.label} · ${era.dateRange}</span>
      <span class="era-label">${era.periodLabel}</span>
    </button>
  `).join('');

  // Add click listeners to tabs
  navContainer.querySelectorAll('.era-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetIndex = parseInt(btn.getAttribute('data-era-index'), 10);
      renderTimelineStage(targetIndex);
    });
  });

  renderTimelineStage(state.activeEraIndex);
}

function renderTimelineStage(index) {
  state.activeEraIndex = index;
  const era = TIMELINE_ERAS[index];
  const stageContainer = document.getElementById('timeline-stage');
  const navContainer = document.getElementById('timeline-eras-nav');

  if (!stageContainer || !era) return;

  // Update active state in nav
  if (navContainer) {
    navContainer.querySelectorAll('.era-tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  // Find featured story for this era
  const relatedStory = STORIES.find(s => s.period === era.id) || STORIES[0];

  stageContainer.innerHTML = `
    <div class="timeline-stage-card">
      <div class="timeline-stage-info">
        <div class="timeline-era-meta">
          <span>${era.label}</span>
          <span aria-hidden="true">·</span>
          <span>${era.dateRange}</span>
          <span aria-hidden="true">·</span>
          <span>${era.periodLabel}</span>
        </div>
        <h3 class="timeline-stage-title font-serif">${era.title}</h3>
        <p class="timeline-stage-desc">${era.description}</p>
        
        <h4 class="spec-label" style="margin-bottom: 0.5rem;">Documented Historical Developments:</h4>
        <ul class="timeline-highlights-list">
          ${era.highlights.map(item => `<li>${item}</li>`).join('')}
        </ul>

        <div style="display: flex; gap: 0.85rem; align-items: center; margin-top: 1.5rem; flex-wrap: wrap;">
          <button class="btn-primary btn-inspect-story" data-story-id="${relatedStory.id}">
            Read Curatorial Dossier (${relatedStory.accessionNumber})
          </button>
          <button class="btn-secondary btn-filter-era" data-era-id="${era.id}">
            Filter All Records from this Era
          </button>
        </div>
      </div>

      <div class="timeline-stage-artifact">
        <div class="artifact-thumb">
          <img src="${relatedStory.image}" alt="${relatedStory.imageAlt}" loading="lazy" onerror="this.onerror=null; this.src='/src/assets/images/hero_archival_portrait_1792138903067.jpg';">
        </div>
        <div class="timeline-stage-artifact-caption">
          <span style="font-weight: 600; color: var(--color-ink);">${relatedStory.title}</span>
          <span style="color: var(--color-oxide-red);">${relatedStory.accessionNumber}</span>
        </div>
        <div style="font-size: 0.72rem; color: var(--color-archival-grey); margin-top: 0.35rem; font-family: var(--font-mono);">
          Location: ${relatedStory.location} · Date: ${relatedStory.dateDisplay}
        </div>
      </div>
    </div>
  `;

  // Wire buttons inside timeline stage
  const inspectBtn = stageContainer.querySelector('.btn-inspect-story');
  if (inspectBtn) {
    inspectBtn.addEventListener('click', () => {
      openStoryModal(relatedStory.id);
    });
  }

  const filterBtn = stageContainer.querySelector('.btn-filter-era');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      state.activePeriod = era.id;
      state.activeCategory = 'all';
      updateFilterButtonsUI();
      renderStoriesGrid();
      const explorerSection = document.getElementById('explorer');
      if (explorerSection) {
        explorerSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function renderCollections() {
  const container = document.getElementById('collections-grid');
  if (!container) return;

  container.innerHTML = ARCHIVE_COLLECTIONS.map(col => `
    <article class="collection-card" data-category="${col.id}" tabindex="0" role="button" aria-label="Explore collection: ${col.name}">
      <div>
        <div class="collection-card-header">
          <span class="col-num">${col.number}</span>
          <span>${col.count}</span>
          <span>${col.eraCoverage}</span>
        </div>
        <div class="collection-media">
          <img src="${col.image}" alt="${col.name} archival collection" loading="lazy" onerror="this.onerror=null; this.src='/src/assets/images/hero_archival_portrait_1792138903067.jpg';">
        </div>
        <h3 class="collection-card-title">${col.name}</h3>
        <p class="collection-card-tagline">${col.tagline}</p>
        <p class="collection-card-desc">${col.description}</p>
      </div>
      <div class="collection-card-footer">
        <span>Curatorial Focus: ${col.aspect}</span>
        <span style="color: var(--color-oxide-red); font-weight: 600;">Explore &rarr;</span>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.collection-card').forEach(card => {
    const handleSelect = () => {
      const cat = card.getAttribute('data-category');
      state.activeCategory = cat;
      state.activePeriod = 'all';
      updateFilterButtonsUI();
      renderStoriesGrid();
      const explorer = document.getElementById('explorer');
      if (explorer) explorer.scrollIntoView({ behavior: 'smooth' });
    };

    card.addEventListener('click', handleSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    });
  });
}

function renderStoriesGrid() {
  const container = document.getElementById('stories-grid');
  const countEl = document.getElementById('explorer-count');
  if (!container) return;

  // Filter logic
  let filtered = [...STORIES];

  if (state.activeCategory !== 'all') {
    filtered = filtered.filter(s => s.category.toLowerCase() === state.activeCategory.toLowerCase());
  }

  if (state.activePeriod !== 'all') {
    filtered = filtered.filter(s => s.period.toLowerCase() === state.activePeriod.toLowerCase());
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(s => {
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.accessionNumber.toLowerCase().includes(q) ||
        s.keyFigures.some(f => f.toLowerCase().includes(q))
      );
    });
  }

  // Update count
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${STORIES.length} Curated Archival Records`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="explorer-empty-state" style="grid-column: 1 / -1;">
        <h4 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 0.5rem;">No archival records found</h4>
        <p style="color: var(--color-archival-grey); margin-bottom: 1.25rem;">
          No items match your active search "${state.searchQuery}" or selected category filter.
        </p>
        <button class="btn-secondary" id="btn-reset-filters">
          Reset Search & Show All Records
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.activePeriod = 'all';
        state.searchQuery = '';
        const searchInput = document.getElementById('explorer-search-input');
        if (searchInput) searchInput.value = '';
        updateFilterButtonsUI();
        renderStoriesGrid();
      });
    }
    return;
  }

  container.innerHTML = filtered.map(story => `
    <article class="story-card" data-story-id="${story.id}" tabindex="0" role="button" aria-label="Open record: ${story.title}">
      <div>
        <div class="story-card-meta">
          <span class="acc">${story.accessionNumber}</span>
          <span aria-hidden="true">·</span>
          <span>${story.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>${story.dateDisplay}</span>
        </div>
        <div class="story-card-media">
          <img src="${story.image}" alt="${story.imageAlt}" loading="lazy" onerror="this.onerror=null; this.src='/src/assets/images/hero_archival_portrait_1792138903067.jpg';">
        </div>
        <h3 class="story-card-title font-serif">${story.title}</h3>
        <p class="story-card-subtitle">${story.subtitle}</p>
        <p class="story-card-summary">${story.summary}</p>
      </div>
      <div class="story-card-footer">
        <span>Location: ${story.location}</span>
        <span class="cta-link">Inspect Record &rarr;</span>
      </div>
    </article>
  `).join('');

  // Wire card click listeners
  container.querySelectorAll('.story-card').forEach(card => {
    const handleOpen = () => {
      const id = card.getAttribute('data-story-id');
      openStoryModal(id);
    };

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

function updateFilterButtonsUI() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    const cat = btn.getAttribute('data-filter');
    btn.classList.toggle('active', cat === state.activeCategory);
  });
}

function renderFragments() {
  const container = document.getElementById('fragments-grid');
  if (!container) return;

  container.innerHTML = FRAGMENTS_OF_MEMORY.map(frag => `
    <article class="fragment-item-card" data-frag-id="${frag.id}" tabindex="0" role="button" aria-label="Inspect fragment: ${frag.title}">
      <div class="fragment-ref">${frag.accessionRef}</div>
      <h3 class="fragment-title font-serif">${frag.title}</h3>
      <div class="fragment-date">${frag.date} · ${frag.location}</div>
      <div class="fragment-snippet">"${frag.snippet}"</div>
      <div class="fragment-notes">${frag.curatorAnnotation}</div>
      <div style="margin-top: 1rem; border-top: 1px solid var(--color-border-subtle); padding-top: 0.5rem; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.68rem; color: var(--color-oxide-red); font-weight: 600;">
        <span>Format: ${frag.artifactType}</span>
        <span>Inspect Transcript &rarr;</span>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.fragment-item-card').forEach(card => {
    const handleOpen = () => {
      const id = card.getAttribute('data-frag-id');
      openFragmentModal(id);
    };

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

/* ==========================================================================
   Accessible Modal System
   ========================================================================== */
function openStoryModal(storyId) {
  const story = STORIES.find(s => s.id === storyId);
  if (!story) return;

  state.activeModalRecord = story;
  state.activeModalType = 'story';

  const backdrop = document.getElementById('modal-backdrop');
  const dialog = document.getElementById('modal-dialog');
  if (!backdrop || !dialog) return;

  dialog.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close archival record">
      <span aria-hidden="true">&times;</span> Close Record [ESC]
    </button>

    <div class="modal-meta-strip">
      <span class="acc-pill">${story.accessionNumber}</span>
      <span aria-hidden="true">·</span>
      <span>${story.categoryLabel}</span>
      <span aria-hidden="true">·</span>
      <span>${story.periodLabel}</span>
      <span aria-hidden="true">·</span>
      <span>${story.dateDisplay}</span>
      <span aria-hidden="true">·</span>
      <span>${story.location}</span>
    </div>

    <h2 class="modal-title font-serif">${story.title}</h2>
    <p class="modal-subtitle">${story.subtitle}</p>

    <div class="modal-image-box">
      <img src="${story.image}" alt="${story.imageAlt}" onerror="this.onerror=null; this.src='/src/assets/images/hero_archival_portrait_1792138903067.jpg';">
    </div>
    <div class="modal-image-caption">
      <span>${story.imageAlt}</span>
      <span style="color: var(--color-oxide-red);">${story.imageCredit}</span>
    </div>

    ${story.quote ? `
      <div class="featured-quote-box" style="margin-bottom: 2rem;">
        <p class="featured-quote-text">"${story.quote.text}"</p>
        <p class="featured-quote-author">— ${story.quote.speaker}, ${story.quote.year}</p>
      </div>
    ` : ''}

    <div class="modal-narrative-prose">
      ${story.fullNarrative.map((para, i) => `
        <p class="${i === 0 ? 'drop-cap' : ''}">${para}</p>
      `).join('')}
    </div>

    <div class="modal-spec-grid">
      <div class="spec-item">
        <span class="spec-label">Key Creators & Figures</span>
        <span class="spec-val">${story.keyFigures.join(', ')}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Medium & Physical Form</span>
        <span class="spec-val">${story.medium}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Archival Dimensions</span>
        <span class="spec-val">${story.dimensions || 'Archival folio standard'}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Provenance & Repository</span>
        <span class="spec-val">${story.provenance}</span>
      </div>
    </div>

    <div style="padding: 1.25rem; border: 1px solid var(--color-border); background-color: var(--color-paper);">
      <span class="spec-label" style="display: block; margin-bottom: 0.35rem; color: var(--color-oxide-red);">Curatorial Annotation:</span>
      <p style="font-size: 0.94rem; color: var(--color-charcoal); line-height: 1.65;">
        ${story.curatorNotes}
      </p>
    </div>
  `;

  backdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.focus();
    closeBtn.addEventListener('click', closeModal);
  }
}

function openFragmentModal(fragId) {
  const frag = FRAGMENTS_OF_MEMORY.find(f => f.id === fragId);
  if (!frag) return;

  state.activeModalRecord = frag;
  state.activeModalType = 'fragment';

  const backdrop = document.getElementById('modal-backdrop');
  const dialog = document.getElementById('modal-dialog');
  if (!backdrop || !dialog) return;

  dialog.innerHTML = `
    <button class="modal-close-btn" id="modal-close-btn" aria-label="Close inspection">
      <span aria-hidden="true">&times;</span> Close Inspection [ESC]
    </button>

    <div class="modal-meta-strip">
      <span class="acc-pill">${frag.accessionRef}</span>
      <span aria-hidden="true">·</span>
      <span>${frag.artifactType}</span>
      <span aria-hidden="true">·</span>
      <span>${frag.date}</span>
      <span aria-hidden="true">·</span>
      <span>${frag.location}</span>
    </div>

    <h2 class="modal-title font-serif">${frag.title}</h2>
    <p class="modal-subtitle">Curatorial Examination & Verified Text Transcription</p>

    <div style="margin: 1.5rem 0; padding: 1.75rem; background-color: var(--color-paper); border: 1px solid var(--color-border); font-family: var(--font-mono); font-size: 0.92rem; line-height: 1.75; white-space: pre-wrap; color: var(--color-ink);">
${frag.fullTranscript}
    </div>

    <div class="modal-spec-grid">
      <div class="spec-item">
        <span class="spec-label">Physical Artifact Notes</span>
        <span class="spec-val">${frag.physicalNotes}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Repository & Reference Group</span>
        <span class="spec-val">${frag.repository}</span>
      </div>
    </div>

    <div style="padding: 1.25rem; border: 1px solid var(--color-border); background-color: var(--color-paper-light);">
      <span class="spec-label" style="display: block; margin-bottom: 0.35rem; color: var(--color-oxide-red);">Curator's Observation:</span>
      <p style="font-size: 0.94rem; color: var(--color-charcoal); line-height: 1.65;">
        ${frag.curatorAnnotation}
      </p>
    </div>
  `;

  backdrop.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.focus();
    closeBtn.addEventListener('click', closeModal);
  }
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;

  backdrop.classList.remove('is-open');
  document.body.style.overflow = '';
  state.activeModalRecord = null;
  state.activeModalType = null;
}

// Global keyboard and backdrop listener for modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.activeModalRecord) {
    closeModal();
  }
});

const modalBackdrop = document.getElementById('modal-backdrop');
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Soundscape Controls Integration
   ========================================================================== */
function setupSoundscapeControls() {
  const topbarBtn = document.getElementById('btn-soundscape-toggle');
  const soundLabel = document.getElementById('soundscape-btn-label');

  const updateSoundUI = (isPlaying) => {
    state.soundscapeActive = isPlaying;
    if (topbarBtn) {
      topbarBtn.classList.toggle('is-playing', isPlaying);
      topbarBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
    if (soundLabel) {
      soundLabel.textContent = isPlaying ? 'Soundscape: Playing' : 'Soundscape: Off';
    }
  };

  if (topbarBtn) {
    topbarBtn.addEventListener('click', () => {
      const isNowPlaying = soundEngine.toggle();
      updateSoundUI(isNowPlaying);
    });
  }

  // Also wire soundscape toggle button if present in Sound Archive card
  const inlineSoundBtn = document.getElementById('btn-soundscape-inline');
  if (inlineSoundBtn) {
    inlineSoundBtn.addEventListener('click', () => {
      const isNowPlaying = soundEngine.toggle();
      updateSoundUI(isNowPlaying);
    });
  }
}

/* ==========================================================================
   Search & Filter Wiring
   ========================================================================== */
function setupExplorerControls() {
  const searchInput = document.getElementById('explorer-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderStoriesGrid();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.getAttribute('data-filter') || 'all';
      updateFilterButtonsUI();
      renderStoriesGrid();
    });
  });
}

/* ==========================================================================
   Mobile Nav & Back to Top
   ========================================================================== */
function setupNavigation() {
  const mobileMenuBtn = document.getElementById('btn-menu-mobile');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNavDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Featured story read button
  const featuredStoryBtn = document.getElementById('btn-read-featured');
  if (featuredStoryBtn) {
    featuredStoryBtn.addEventListener('click', () => {
      openStoryModal('zaria-rebels');
    });
  }
}

/* ==========================================================================
   Application Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  renderCollections();
  renderStoriesGrid();
  renderFragments();
  setupSoundscapeControls();
  setupExplorerControls();
  setupNavigation();
});
