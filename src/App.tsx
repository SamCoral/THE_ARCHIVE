/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Share2,
  Check,
  ZoomIn,
  ZoomOut,
  Calendar,
  Send,
  HelpCircle,
  Image as ImageIcon,
  Upload,
  Globe,
  Link2,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';
import { 
  STORIES, 
  TIMELINE_ERAS, 
  FRAGMENTS_OF_MEMORY, 
  ARCHIVE_COLLECTIONS,
  HISTORICAL_GOOGLE_PRESETS,
  Story, 
  MemoryFragment,
  HistoricalGooglePreset
} from './data/stories';
import { useSoundscape } from './utils/useSoundscape';
import { ArchivalLightbox, LightboxPhoto } from './components/ArchivalLightbox';
import { 
  TimelineZoomLevel, 
  TIMELINE_ZOOM_CONFIGS, 
  getNextZoomIn, 
  getNextZoomOut, 
  getStoryShareUrl 
} from './utils/timelineZoom';
import { 
  createHistoricalRecord, 
  HistoricalContributionRecord 
} from './utils/archiveLogic';

export default function App() {
  const { isPlaying: soundActive, toggleSoundscape } = useSoundscape();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStoryModal, setActiveStoryModal] = useState<Story | null>(null);
  const [activeFragmentModal, setActiveFragmentModal] = useState<MemoryFragment | null>(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<LightboxPhoto | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // New Timeline Zoom state: 'compact' | 'standard' | 'expanded'
  const [timelineZoom, setTimelineZoom] = useState<TimelineZoomLevel>('standard');

  // Share feedback state
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Historical Contribution Inquiry Form Modal state
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionSubmitted, setContributionSubmitted] = useState<string | null>(null);
  const [pictureSourceTab, setPictureSourceTab] = useState<'presets' | 'google' | 'upload'>('presets');
  const [customGoogleUrl, setCustomGoogleUrl] = useState('');
  const [isGoogleArtsFilterActive, setIsGoogleArtsFilterActive] = useState(false);

  const [formFields, setFormFields] = useState({
    contributorName: '',
    email: '',
    artifactType: 'photograph',
    historicalFromEra: 'colonial',
    location: '',
    narrative: '',
    pictureUrl: HISTORICAL_GOOGLE_PRESETS[0].image,
    pictureCaption: HISTORICAL_GOOGLE_PRESETS[0].caption,
    pictureSource: HISTORICAL_GOOGLE_PRESETS[0].sourceLabel
  });

  const [communityRecords, setCommunityRecords] = useState<HistoricalContributionRecord[]>([
    {
      id: 'contrib-seed-01',
      receiptNumber: 'INQ-2026-8812',
      accessionRef: 'ACC.COMMUNITY.2026.8812',
      contributorName: 'Chief Adebayo Alabi',
      email: 'a.alabi@lagosheritage.org',
      artifactType: 'photograph',
      historicalFromEra: 'colonial',
      eraLabel: 'Colonial Period (1900–1959)',
      location: 'Lagos Marina, Lagos Island',
      narrative: 'Archival silver gelatin photograph preserved in our family cedar chest, depicting freight canoes and merchant trading stores along the Marina waterfront circa 1924.',
      pictureUrl: '/src/assets/images/google_arts_lagos_marina_1920_1792143381164.jpg',
      pictureCaption: 'Lagos Marina Canoe Freighters & Maritime Trading Houses c. 1924',
      pictureSource: 'Google Arts & Culture / Nigerian National Archives Partner Digitisation',
      submittedAt: '2026-10-15T14:22:00Z',
      status: 'curatorial_review'
    }
  ]);
  const [latestSubmittedRecord, setLatestSubmittedRecord] = useState<HistoricalContributionRecord | null>(null);

  // Ref for the horizontal timeline era nav container
  const timelineNavRef = useRef<HTMLDivElement>(null);

  // Deep linking: check URL hash on mount (#story=zaria-rebels)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('#story=')) {
      const storyId = hash.replace('#story=', '');
      const match = STORIES.find(s => s.id === storyId);
      if (match) {
        setActiveStoryModal(match);
      }
    }
  }, []);

  // Mouse-wheel horizontal scroll effect for the timeline
  useEffect(() => {
    const navEl = timelineNavRef.current;
    if (!navEl) return;

    const handleTimelineWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        navEl.scrollBy({
          left: e.deltaY * 1.6,
          behavior: 'smooth'
        });
      }
    };

    navEl.addEventListener('wheel', handleTimelineWheel, { passive: false });
    return () => navEl.removeEventListener('wheel', handleTimelineWheel);
  }, []);

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveStoryModal(null);
        setActiveFragmentModal(null);
        setActiveLightboxPhoto(null);
        setShowContributionModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when any modal or lightbox is active
  useEffect(() => {
    if (activeStoryModal || activeFragmentModal || activeLightboxPhoto || showContributionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeStoryModal, activeFragmentModal, activeLightboxPhoto, showContributionModal]);

  const activeEra = TIMELINE_ERAS[activeEraIndex];
  const relatedEraStory = useMemo(() => {
    return STORIES.find(s => s.period === activeEra.id) || STORIES[0];
  }, [activeEra]);

  // Filtered stories calculation (with Historical From Period & Google Arts & Culture filter)
  const filteredStories = useMemo(() => {
    return STORIES.filter(story => {
      const matchCategory = selectedCategory === 'all' || story.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchPeriod = selectedPeriod === 'all' || story.period.toLowerCase() === selectedPeriod.toLowerCase();
      const matchGoogleArts = !isGoogleArtsFilterActive || story.imageCredit.toLowerCase().includes('google arts');
      
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (
        story.title.toLowerCase().includes(q) ||
        story.subtitle.toLowerCase().includes(q) ||
        story.summary.toLowerCase().includes(q) ||
        story.location.toLowerCase().includes(q) ||
        story.accessionNumber.toLowerCase().includes(q) ||
        story.imageCredit.toLowerCase().includes(q) ||
        story.keyFigures.some(f => f.toLowerCase().includes(q))
      );

      return matchCategory && matchPeriod && matchGoogleArts && matchSearch;
    });
  }, [selectedCategory, selectedPeriod, isGoogleArtsFilterActive, searchQuery]);

  const handleCollectionSelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedPeriod('all');
    setIsGoogleArtsFilterActive(false);
    const explorerEl = document.getElementById('explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleEraFilter = useCallback((eraId: string) => {
    setSelectedPeriod(eraId);
    setSelectedCategory('all');
    setIsGoogleArtsFilterActive(false);
    const explorerEl = document.getElementById('explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineNavRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      timelineNavRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Share this story handler
  const handleShareStory = async (story: Story) => {
    const origin = window.location.href.split('#')[0];
    const shareUrl = getStoryShareUrl(story.id, origin);
    const shareData = {
      title: `${story.title} — ARCHIVE`,
      text: `${story.title} (${story.accessionNumber}) from the Nigerian Creative Memory Archive.`,
      url: shareUrl
    };

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        setShareFeedback('Shared successfully');
        setTimeout(() => setShareFeedback(null), 2500);
        return;
      } catch (err) {
        // Fallback to clipboard if share sheet cancelled or fails
      }
    }

    // Clipboard copy fallback
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback('Archival Link Copied to Clipboard ✓');
      setTimeout(() => setShareFeedback(null), 2500);
    } catch (err) {
      setShareFeedback('Link: ' + shareUrl);
      setTimeout(() => setShareFeedback(null), 3500);
    }
  };

  // Picture selection handlers for the Historical Form
  const handleSelectGooglePreset = (preset: HistoricalGooglePreset) => {
    setFormFields(prev => ({
      ...prev,
      pictureUrl: preset.image,
      pictureCaption: preset.caption,
      pictureSource: preset.sourceLabel,
      historicalFromEra: preset.era,
      location: preset.location,
      artifactType: preset.medium.toLowerCase().includes('photograph') ? 'photograph' : 'print'
    }));
  };

  const handleApplyCustomUrl = () => {
    if (customGoogleUrl.trim()) {
      setFormFields(prev => ({
        ...prev,
        pictureUrl: customGoogleUrl.trim(),
        pictureCaption: prev.pictureCaption || 'Historical photograph / document reference from Google',
        pictureSource: 'Google Arts & Culture / Web Archival Reference'
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormFields(prev => ({
          ...prev,
          pictureUrl: result,
          pictureCaption: prev.pictureCaption || file.name.replace(/\.[^/.]+$/, ""),
          pictureSource: 'Private Family Collection / Contributed Archival Scan'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPicture = () => {
    setFormFields(prev => ({
      ...prev,
      pictureUrl: '',
      pictureCaption: '',
      pictureSource: ''
    }));
    setCustomGoogleUrl('');
  };

  const handleContributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.contributorName || !formFields.email || !formFields.narrative) {
      alert('Please fill out all required fields.');
      return;
    }
    const newRecord = createHistoricalRecord({
      contributorName: formFields.contributorName,
      email: formFields.email,
      artifactType: formFields.artifactType,
      historicalFromEra: formFields.historicalFromEra,
      location: formFields.location,
      narrative: formFields.narrative,
      pictureUrl: formFields.pictureUrl,
      pictureCaption: formFields.pictureCaption,
      pictureSource: formFields.pictureSource
    });
    setCommunityRecords(prev => [newRecord, ...prev]);
    setLatestSubmittedRecord(newRecord);
    setContributionSubmitted(newRecord.receiptNumber);
  };

  const activeZoomConfig = TIMELINE_ZOOM_CONFIGS[timelineZoom];

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#292723] font-sans selection:bg-[#873E32] selection:text-[#F7F4EC]">
      
      {/* =====================================================================
          1. RESPONSIVE HEADER NAVIGATION COMPONENT
          Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Soundscape / Mobile CTA)
          ===================================================================== */}
      <header className="site-header sticky top-0 z-50 bg-[#F7F4EC]/95 backdrop-blur-md border-b border-[#292723]/15">
        <div className="site-container">
          
          {/* Archival Serial Ribbon */}
          <div className="masthead-strip flex justify-between items-center py-1.5 border-b border-[#292723]/10 font-mono text-xs tracking-wider uppercase text-[#77756F]">
            <div>
              <span className="text-[#873E32] font-semibold">ISSUE NO. 01</span>
              <span> / HISTORICAL COLLECTION RECORD</span>
            </div>
            <div className="hidden md:inline">
              FEDERAL REPUBLIC OF NIGERIA · CULTURAL MEMORY COMMISSION
            </div>
            <div>LAGOS &amp; IBADAN ARCHIVES</div>
          </div>

          {/* Main Navigation Bar */}
          <div className="header-main flex items-center justify-between gap-8 py-3.5">
            
            {/* Zone 1: Brand Wordmark in Playfair Display */}
            <a 
              href="#hero" 
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
              className="brand-wordmark font-serif text-2xl font-bold tracking-tight text-[#292723] hover:text-[#873E32] transition-colors whitespace-nowrap shrink-0"
              aria-label="ARCHIVE: The Past Is Still Speaking"
            >
              ARCHIVE
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="header-nav hidden md:flex items-center gap-7 text-sm font-medium text-[#46443F]" aria-label="Primary Navigation">
              <button 
                onClick={() => scrollToSection('timeline')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Timeline
              </button>
              <button 
                onClick={() => scrollToSection('featured-story')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Featured Story
              </button>
              <button 
                onClick={() => scrollToSection('collections')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Collections
              </button>
              <button 
                onClick={() => scrollToSection('explorer')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                The Archive
              </button>
              <button 
                onClick={() => scrollToSection('fragments')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Fragments
              </button>
              <button 
                onClick={() => scrollToSection('colophon')} 
                className="nav-link hover:text-[#292723] cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Colophon
              </button>
            </nav>

            {/* Zone 3: Primary Action (Soundscape Engine & Mobile Menu Trigger) */}
            <div className="header-actions flex items-center gap-3 shrink-0">
              <button 
                onClick={toggleSoundscape}
                className={`btn-soundscape inline-flex items-center gap-2 px-3.5 py-1.5 border rounded text-xs font-mono transition-all cursor-pointer ${
                  soundActive 
                    ? 'bg-[#292723] text-[#F7F4EC] border-[#292723]' 
                    : 'bg-transparent text-[#292723] border-[#292723]/30 hover:bg-[#E8E1D2]'
                }`}
                aria-pressed={soundActive}
                title="Toggle authentic 1950s/60s shellac ambient vinyl texture & pentatonic warmth"
              >
                <span className="sound-bars inline-flex items-end gap-0.5 h-3">
                  <span className={`w-0.5 bg-current ${soundActive ? 'animate-bounce h-2.5' : 'h-1'}`}></span>
                  <span className={`w-0.5 bg-current ${soundActive ? 'animate-pulse h-3' : 'h-1.5'}`}></span>
                  <span className={`w-0.5 bg-current ${soundActive ? 'animate-bounce h-2' : 'h-1'}`}></span>
                </span>
                <span>{soundActive ? 'Soundscape: Playing' : 'Soundscape: Off'}</span>
              </button>

              {/* Mobile menu trigger */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 border border-[#292723]/25 rounded text-[#292723] hover:bg-[#E8E1D2] transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="mobile-nav-drawer open md:hidden bg-[#F7F4EC] border-t border-[#292723]/15 px-6 py-4 flex flex-col gap-3 font-sans text-base shadow-lg animate-fadeIn">
            <button 
              onClick={() => scrollToSection('timeline')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              Timeline: Historical Epochs
            </button>
            <button 
              onClick={() => scrollToSection('featured-story')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              Featured Story: The Zaria Rebels
            </button>
            <button 
              onClick={() => scrollToSection('collections')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              The Creative Collections
            </button>
            <button 
              onClick={() => scrollToSection('explorer')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              The Archival Catalog
            </button>
            <button 
              onClick={() => scrollToSection('fragments')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              Fragments of Memory
            </button>
            <button 
              onClick={() => scrollToSection('preservation')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              Preservation &amp; Contribution
            </button>
            <button 
              onClick={() => scrollToSection('colophon')} 
              className="text-left py-1 text-[#292723] font-medium"
            >
              Colophon &amp; Sources
            </button>
          </nav>
        )}
      </header>

      {/* =====================================================================
          2. HIGH-IMPACT HERO COMPONENT
          Reflects 'ARCHIVE' brand identity, 'Playfair Display' font, CTA for collections
          ===================================================================== */}
      <section className="hero-section py-12 md:py-20" id="hero" aria-labelledby="hero-main-title">
        <div className="site-container">
          <div className="hero-editorial-grid grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16 items-center">
            
            {/* Editorial Text Block */}
            <div className="hero-text-content">
              <div className="hero-meta-kicker flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-[#77756F] mb-4">
                <span>Record Ref: NG-1960-01</span>
                <span className="text-[#873E32]" aria-hidden="true">·</span>
                <span>The Sovereign Collection</span>
                <span className="text-[#873E32]" aria-hidden="true">·</span>
                <span>Est. 2026</span>
              </div>

              {/* Title in 'Playfair Display' Font */}
              <h1 
                id="hero-main-title" 
                className="hero-title font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292723] leading-[1.12] mb-6 text-balance"
              >
                The Past Is Still Speaking.
              </h1>

              <p className="hero-lead-text text-lg sm:text-xl text-[#46443F] leading-relaxed mb-8 max-w-[62ch]">
                Before the stories became history, they lived in photographs, songs, patterns, ink, and memory. Enter an archive of Nigeria's creative past.
              </p>

              {/* Primary Call to Action for Exploring Collections & Discovering Stories */}
              <div className="hero-actions flex flex-wrap items-center gap-4 mb-10">
                <button 
                  onClick={() => scrollToSection('collections')} 
                  className="btn-primary inline-flex items-center justify-center gap-2.5 bg-[#292723] text-[#F7F4EC] hover:bg-[#171513] px-6 py-3.5 rounded font-sans text-sm font-semibold tracking-wide transition-all shadow-sm hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore the Collections</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <button 
                  onClick={() => scrollToSection('featured-story')} 
                  className="btn-secondary inline-flex items-center justify-center gap-2 bg-transparent text-[#292723] border border-[#292723]/40 hover:bg-[#E8E1D2] px-6 py-3.5 rounded font-sans text-sm font-semibold tracking-wide transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Discover the Stories</span>
                </button>
              </div>

              {/* Subtle Scroll Cue */}
              <button 
                onClick={() => scrollToSection('archivist-note')}
                className="hero-scroll-cue inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#77756F] hover:text-[#873E32] transition-colors cursor-pointer"
              >
                <ArrowDown size={14} className="animate-bounce" aria-hidden="true" />
                <span>Descend into the Annals</span>
              </button>
            </div>

            {/* High-Impact Archival Photography Anchor Frame with Lightbox Zoom Trigger */}
            <div className="hero-visual-frame group relative border border-[#292723]/20 p-3 bg-[#E8E1D2] shadow-sm">
              <div 
                className="image-wrapper relative w-full aspect-[4/3] overflow-hidden bg-[#DDD4C3] cursor-zoom-in"
                onClick={() => setActiveLightboxPhoto({
                  src: "/src/assets/images/hero_archival_portrait_1792138903067.jpg",
                  alt: "Silver gelatin documentary archival portrait of an elder Nigerian scholar and artisan in traditional woven adire attire in Lagos during the 1960 independence era",
                  title: "Master Scholar & Elder Artisan in Woven Adire",
                  accession: "PLATE NO. 01 / ACC.1960.01.01",
                  credit: "Department of Antiquities Heritage Documentation Project",
                  location: "Broad Street, Lagos, Nigeria",
                  date: "c. October 1960"
                })}
                title="Click to expand high-resolution photograph in Lightbox viewer"
              >
                <img 
                  src="/src/assets/images/hero_archival_portrait_1792138903067.jpg" 
                  alt="Silver gelatin archival documentary portrait of a Nigerian artist and scholar in traditional adire attire in Lagos during the 1960 independence era"
                  className="w-full h-full object-cover grayscale-[20%] contrast-105 group-hover:scale-103 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#292723]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-[#292723]/90 text-[#F7F4EC] px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <Maximize2 size={13} className="text-[#873E32]" />
                    <span>Expand Full-Screen Lightbox</span>
                  </span>
                </div>
              </div>

              <div className="hero-visual-caption flex justify-between items-baseline pt-3 font-mono text-xs text-[#77756F]">
                <span className="text-[#873E32] font-semibold">PLATE NO. 01 / ACC.1960.01.01</span>
                <span>Documentary Silver Gelatin Negative · Lagos, c. 1960</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          3. NOTE FROM THE ARCHIVIST
          ===================================================================== */}
      <section className="archivist-section py-16 bg-[#E8E1D2] border-y border-[#292723]/15" id="archivist-note">
        <div className="site-container">
          <article className="archivist-wrapper max-w-3xl mx-auto p-6 md:p-12 border border-[#292723]/20 bg-[#F7F4EC]">
            <div className="archivist-header-meta flex justify-between items-center font-mono text-xs uppercase tracking-wider text-[#77756F] border-b border-[#292723]/10 pb-3 mb-6">
              <span>Curatorial Letter · Dossier Series A</span>
              <span className="text-[#873E32] font-semibold">Manuscript Annotation</span>
              <span>October Collection</span>
            </div>
            
            <h2 className="archivist-title font-serif text-2xl md:text-3xl font-bold mb-6 text-[#292723]">
              Why the Archive Exists
            </h2>

            <div className="archivist-prose text-base md:text-lg leading-relaxed text-[#46443F]">
              <p className="drop-cap">
                Every generation leaves traces. A face captured on film. A headline printed in ink. A rhythm carried through the night. A pattern repeated by hand. Some stories survive in museums. Others remain in family albums, forgotten buildings, old recordings, and the memories of ordinary people.
              </p>
              <p className="mt-4">
                ARCHIVE brings these fragments together—not to freeze the past, but to understand how it continues to shape us. History in Nigeria is not an inert monument of dates; it is an ongoing dialogue between our ancestors' creative decisions and the identities we construct today.
              </p>
            </div>

            <div className="archivist-signoff mt-8 pt-4 border-t border-[#292723]/10 flex flex-wrap justify-between items-end gap-4">
              <div className="signature-block">
                <span className="font-serif italic text-lg text-[#292723]">The Curatorial Directorate</span>
                <div className="text-xs font-sans text-[#77756F] mt-1">
                  Department of Cultural Preservation &amp; Memory
                </div>
              </div>
              <div className="signoff-meta font-mono text-xs text-[#77756F] text-right">
                <div>Broad Street Repository, Lagos</div>
                <div>Recorded for the next generation</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================================
          4. ENHANCED HISTORICAL TIMELINE
          With Zoom-In/Zoom-Out controls for decade visibility & mouse-wheel horizontal scroll
          ===================================================================== */}
      <section className="timeline-section py-16 md:py-24" id="timeline">
        <div className="site-container">
          
          <div className="section-head mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-2">
                Section 03 / Chronology &amp; Eras
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#292723]">
                Enter a Different Time
              </h2>
              <p className="section-desc text-lg text-[#46443F] mt-2 max-w-2xl">
                Trace the creative epochs of Nigerian history. Select a period to discover how artists, craft guilds, musicians, and writers shaped sovereign imagination across centuries.
              </p>
            </div>

            {/* Timeline Controls: Zoom In / Zoom Out for decade visibility & scroll aids */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#77756F]">
              
              {/* Zoom-In / Zoom-Out Rail Scale Controls */}
              <div className="flex items-center gap-1.5 bg-[#E8E1D2] border border-[#292723]/15 rounded p-1">
                <span className="px-2 text-[11px] font-semibold text-[#292723] hidden sm:inline">
                  Decade Scale: <span className="text-[#873E32]">{activeZoomConfig.label}</span>
                </span>
                
                <button 
                  onClick={() => setTimelineZoom(prev => getNextZoomOut(prev))}
                  disabled={timelineZoom === 'compact'}
                  className="p-1.5 rounded hover:bg-[#DDD4C3] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Zoom Out: Show more decades / compact view"
                  aria-label="Timeline Zoom Out"
                >
                  <ZoomOut size={15} />
                </button>

                <button 
                  onClick={() => setTimelineZoom(prev => getNextZoomIn(prev))}
                  disabled={timelineZoom === 'expanded'}
                  className="p-1.5 rounded hover:bg-[#DDD4C3] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Zoom In: Show fewer decades with deep era detail"
                  aria-label="Timeline Zoom In"
                >
                  <ZoomIn size={15} />
                </button>
              </div>

              {/* Lateral chevron buttons */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => scrollTimeline('left')}
                  className="p-1.5 border border-[#292723]/20 rounded hover:bg-[#E8E1D2] transition-colors cursor-pointer"
                  aria-label="Scroll timeline left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scrollTimeline('right')}
                  className="p-1.5 border border-[#292723]/20 rounded hover:bg-[#E8E1D2] transition-colors cursor-pointer"
                  aria-label="Scroll timeline right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Scroll cue hint */}
              <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#77756F] pl-1">
                <MoveHorizontal size={13} className="text-[#873E32]" />
                <span>Mouse Wheel Horizontal</span>
              </div>
            </div>
          </div>

          {/* Timeline Eras Navigation Rail with Zoomable Min-Width & Hover Scaling */}
          <div 
            ref={timelineNavRef}
            className="timeline-eras-nav flex overflow-x-auto gap-3.5 pb-4 mb-8 border-b border-[#292723]/15 scrollbar-thin scroll-smooth cursor-ew-resize select-none"
            aria-label="Historical Eras Navigation"
          >
            {TIMELINE_ERAS.map((era, index) => {
              const isActive = index === activeEraIndex;
              return (
                <button 
                  key={era.id}
                  onClick={() => setActiveEraIndex(index)}
                  style={{ minWidth: `${activeZoomConfig.minWidth}px` }}
                  className={`era-tab-btn flex-shrink-0 p-4 rounded border font-mono text-xs text-left cursor-pointer transition-all duration-300 ease-out ${
                    isActive 
                      ? 'bg-[#292723] text-[#F7F4EC] border-[#292723] shadow-lg scale-[1.02] ring-1 ring-[#873E32]' 
                      : 'bg-[#E8E1D2]/80 text-[#46443F] border-[#292723]/20 hover:bg-[#E8E1D2] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-md hover:border-[#292723]/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-[#873E32]">
                      {era.label}
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">{era.dateRange}</span>
                  </div>
                  <div className="font-sans font-bold text-sm mb-1.5 text-inherit truncate">{era.periodLabel}</div>
                  
                  {/* Additional context visible depending on zoom level */}
                  <div className={`text-[11px] opacity-80 font-sans leading-relaxed ${timelineZoom === 'compact' ? 'line-clamp-1' : 'line-clamp-2'}`}>
                    {era.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Timeline Stage Active View */}
          <div className="timeline-stage-card border border-[#292723]/20 bg-[#E8E1D2] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
            <div className="timeline-stage-info">
              <div className="timeline-era-meta flex items-center gap-2 font-mono text-xs font-semibold text-[#873E32] mb-3">
                <span>{activeEra.label}</span>
                <span aria-hidden="true">·</span>
                <span>{activeEra.dateRange}</span>
                <span aria-hidden="true">·</span>
                <span>{activeEra.periodLabel}</span>
              </div>

              <h3 className="timeline-stage-title font-serif text-2xl md:text-3xl font-bold mb-4 text-[#292723]">
                {activeEra.title}
              </h3>

              <p className="timeline-stage-desc text-base text-[#46443F] leading-relaxed mb-6">
                {activeEra.description}
              </p>

              <h4 className="font-mono text-xs uppercase tracking-wider text-[#77756F] font-semibold mb-2">
                Documented Historical Developments:
              </h4>
              <ul className="timeline-highlights-list flex flex-col gap-2 mb-6">
                {activeEra.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-[#292723] flex items-baseline gap-2">
                    <span className="text-[#873E32] font-mono">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 items-center pt-2">
                <button 
                  onClick={() => setActiveStoryModal(relatedEraStory)}
                  className="btn-primary inline-flex items-center gap-2 bg-[#292723] text-[#F7F4EC] hover:bg-[#171513] px-4 py-2.5 rounded text-xs font-sans font-semibold cursor-pointer"
                >
                  <span>Read Curatorial Dossier ({relatedEraStory.accessionNumber})</span>
                  <ArrowRight size={14} />
                </button>
                <button 
                  onClick={() => handleEraFilter(activeEra.id)}
                  className="btn-secondary inline-flex items-center gap-2 bg-transparent text-[#292723] border border-[#292723]/30 hover:bg-[#DDD4C3] px-4 py-2.5 rounded text-xs font-sans font-semibold cursor-pointer"
                >
                  <span>Filter All Records from this Era</span>
                </button>
              </div>
            </div>

            {/* Timeline Related Artifact with Lightbox Expansion */}
            <div className="timeline-stage-artifact border border-[#292723]/20 bg-[#F7F4EC] p-4 group">
              <div 
                className="artifact-thumb relative w-full aspect-[4/3] overflow-hidden bg-[#DDD4C3] mb-3 cursor-zoom-in"
                onClick={() => setActiveLightboxPhoto({
                  src: relatedEraStory.image,
                  alt: relatedEraStory.imageAlt,
                  title: relatedEraStory.title,
                  accession: relatedEraStory.accessionNumber,
                  credit: relatedEraStory.imageCredit,
                  location: relatedEraStory.location,
                  date: relatedEraStory.dateDisplay
                })}
                title="Expand artifact in full-screen Lightbox"
              >
                <img 
                  src={relatedEraStory.image} 
                  alt={relatedEraStory.imageAlt} 
                  className="w-full h-full object-cover contrast-105 group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#292723]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#292723]/90 text-white px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1 shadow">
                    <Maximize2 size={12} className="text-[#873E32]" />
                    <span>Expand</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs text-[#77756F]">
                <span className="font-semibold text-[#292723]">{relatedEraStory.title}</span>
                <span className="text-[#873E32]">{relatedEraStory.accessionNumber}</span>
              </div>
              <div className="text-[11px] text-[#77756F] font-mono mt-1">
                Location: {relatedEraStory.location} · Date: {relatedEraStory.dateDisplay}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. FEATURED STORY DEEP DIVE (With Lightbox Expansion)
          ===================================================================== */}
      <section className="featured-section py-16 md:py-24 bg-[#E8E1D2] border-y border-[#292723]/15" id="featured-story">
        <div className="site-container">
          <div className="section-head mb-8">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-2">
              Section 04 / Curatorial Deep Dive
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#292723]">
              The Zaria Rebels &amp; Natural Synthesis
            </h2>
            <p className="section-desc text-lg text-[#46443F] mt-2 max-w-2xl">
              An in-depth study of the 1958 artistic rebellion in Northern Nigeria that liberated African modernism from colonial mimicry.
            </p>
          </div>

          <div className="featured-layout-card border border-[#292723]/20 bg-[#F7F4EC] p-6 md:p-12">
            <div className="featured-marquee-grid mb-8 group">
              <div 
                className="featured-image-lead relative w-full aspect-video border border-[#292723]/20 overflow-hidden bg-[#DDD4C3] cursor-zoom-in"
                onClick={() => setActiveLightboxPhoto({
                  src: "/src/assets/images/featured_story_zaria_1792138904029.jpg",
                  alt: "Archival black and white documentary photograph of a 1958 Nigerian art studio in Zaria with artists discussing linocuts and Uli-inspired paintings",
                  title: "The Zaria Art Society Studio (1958)",
                  accession: "ACC.1958.09.14",
                  credit: "Zaria Art Society Historical Documentation / Nigerian National Archives",
                  location: "Zaria, Northern Nigeria",
                  date: "October 1958"
                })}
                title="Click to expand high-resolution photograph in Lightbox viewer"
              >
                <img 
                  src="/src/assets/images/featured_story_zaria_1792138904029.jpg" 
                  alt="Archival black and white documentary photograph of a 1958 Nigerian art studio in Zaria with artists discussing linocuts and Uli-inspired paintings"
                  className="w-full h-full object-cover contrast-105 group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#292723]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-[#292723]/90 text-[#F7F4EC] px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <Maximize2 size={14} className="text-[#873E32]" />
                    <span>Expand Full-Screen Lightbox (Zoom &amp; Pan)</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-baseline pt-2 font-mono text-xs text-[#77756F]">
                <span>Zaria Art Society Studio Session · Department of Fine Arts, NCAST</span>
                <span className="text-[#873E32] font-semibold">ACC.1958.09.14</span>
              </div>
            </div>

            <div className="featured-content-split grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 pt-6 border-t border-[#292723]/15">
              <div className="featured-essay">
                <h3 className="featured-headline font-serif text-2xl md:text-3xl font-bold mb-2 text-[#292723]">
                  A Mutiny Against the London Curriculum
                </h3>
                <p className="featured-subtitle text-base md:text-lg text-[#873E32] font-medium mb-6">
                  How Ten Art Students Redefined Modern African Aesthetics in October 1958
                </p>

                <p className="featured-body-lead drop-cap text-base md:text-lg text-[#46443F] leading-relaxed mb-6">
                  In October 1958, inside the studios of the Nigerian College of Arts, Science and Technology in Zaria, ten young art students gathered to formalize an aesthetic mutiny. Led by Uche Okeke, Demas Nwoko, Bruce Onobrakpeya, Yusuf Grillo, and Simon Okeke, they formed the Zaria Art Society—later known across world art history as the "Zaria Rebels."
                </p>

                <p className="text-base text-[#46443F] leading-relaxed mb-6">
                  The curriculum was strictly colonial: students were drilled in British academic perspective and Victorian still lifes. The indigenous visual heritage of Nigeria—the ancient terracotta of Nok, the spiritual cosmology of Igbo Uli wall painting, the lost-wax casting of Benin—was dismissed by colonial faculty as "primitive craft."
                </p>

                <div className="featured-quote-box my-6 p-5 border-y border-[#292723]/20 bg-[#E8E1D2]">
                  <p className="featured-quote-text font-serif italic text-lg md:text-xl text-[#292723] mb-2">
                    "Change is an inherent law of nature. We must know ourselves first before we can know others. We must grow from our own roots."
                  </p>
                  <p className="featured-quote-author font-mono text-xs uppercase text-[#873E32]">
                    — Uche Okeke, The Zaria Manifesto, October 1958
                  </p>
                </div>

                <p className="text-base text-[#46443F] leading-relaxed mb-8">
                  In response, Okeke formulated the doctrine of <em>Natural Synthesis</em>: merging modern studio techniques (linocut, oil painting, plastocast) with indigenous conceptual cosmologies. Within five years, their synthesis became the visual foundation for the sovereign 1960 generation.
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <button 
                    onClick={() => setActiveStoryModal(STORIES[0])}
                    className="btn-primary inline-flex items-center gap-2.5 bg-[#292723] text-[#F7F4EC] hover:bg-[#171513] px-6 py-3 rounded font-sans text-sm font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    <span>Read Full Curatorial Dossier</span>
                    <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveLightboxPhoto({
                      src: "/src/assets/images/featured_story_zaria_1792138904029.jpg",
                      alt: "Archival black and white documentary photograph of a 1958 Nigerian art studio in Zaria with artists discussing linocuts and Uli-inspired paintings",
                      title: "The Zaria Art Society Studio (1958)",
                      accession: "ACC.1958.09.14",
                      credit: "Zaria Art Society Historical Documentation / Nigerian National Archives",
                      location: "Zaria, Northern Nigeria",
                      date: "October 1958"
                    })}
                    className="btn-secondary inline-flex items-center gap-2 bg-transparent text-[#292723] border border-[#292723]/30 hover:bg-[#DDD4C3] px-4 py-3 rounded font-sans text-sm font-semibold transition-all cursor-pointer"
                  >
                    <Maximize2 size={14} />
                    <span>Expand Archival Frame</span>
                  </button>
                </div>
              </div>

              {/* Spec Rail */}
              <aside className="curatorial-spec-rail border-t lg:border-t-0 lg:border-l border-[#292723]/20 pt-6 lg:pt-0 lg:pl-10 flex flex-col gap-5">
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Accession Identifier
                  </span>
                  <span className="spec-val font-mono text-sm font-semibold text-[#873E32]">
                    ACC.1958.09.14
                  </span>
                </div>
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Key Protagonists
                  </span>
                  <span className="spec-val text-sm font-medium text-[#292723]">
                    Uche Okeke, Demas Nwoko, Bruce Onobrakpeya, Yusuf Grillo, Simon Okeke
                  </span>
                </div>
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Location &amp; Epoch
                  </span>
                  <span className="spec-val text-sm font-medium text-[#292723]">
                    Zaria, Northern Nigeria · October 1958
                  </span>
                </div>
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Medium &amp; Techniques
                  </span>
                  <span className="spec-val text-sm font-medium text-[#292723]">
                    Linocut prints, ink on paper, oil on hardboard
                  </span>
                </div>
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Archival Provenance
                  </span>
                  <span className="spec-val text-sm font-medium text-[#292723]">
                    Zaria Art Society Archives; National Gallery of Art; Centre for Contemporary Art, Lagos
                  </span>
                </div>
                <div>
                  <span className="spec-label block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Historical Significance
                  </span>
                  <span className="spec-val text-sm font-medium text-[#292723]">
                    Established autonomous modern African art history independent of European patronage.
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. THE CREATIVE COLLECTIONS (4 WORLDS)
          ===================================================================== */}
      <section className="collections-section py-16 md:py-24" id="collections">
        <div className="site-container">
          <div className="section-head mb-8">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-2">
              Section 05 / Curatorial Categories
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#292723]">
              The Creative Collections
            </h2>
            <p className="section-desc text-lg text-[#46443F] mt-2 max-w-2xl">
              Four curated spheres of Nigerian cultural memory. Each collection holds thousands of stories, recordings, patterns, and printed pages.
            </p>
          </div>

          <div className="collections-editorial-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {ARCHIVE_COLLECTIONS.map(col => (
              <article 
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className="collection-card group border border-[#292723]/20 bg-[#E8E1D2] p-6 lg:p-8 flex flex-col justify-between hover:border-[#292723] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCollectionSelect(col.id); }}
                aria-label={`Explore collection: ${col.name}`}
              >
                <div>
                  <div className="collection-card-header flex justify-between items-baseline font-mono text-xs text-[#77756F] border-b border-[#292723]/10 pb-2 mb-4">
                    <span className="col-num text-sm font-bold text-[#873E32]">{col.number}</span>
                    <span>{col.count}</span>
                    <span>{col.eraCoverage}</span>
                  </div>

                  <div 
                    className="collection-media relative w-full aspect-[4/3] overflow-hidden bg-[#DDD4C3] mb-4 border border-[#292723]/10 cursor-zoom-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLightboxPhoto({
                        src: col.image,
                        alt: `${col.name} archival documentation`,
                        title: col.name,
                        accession: `COLLECTION ${col.number}`,
                        credit: "Nigerian Heritage Conservation Documentation Project",
                        location: "Nigeria",
                        date: col.eraCoverage
                      });
                    }}
                    title="Click image to inspect in full-screen Lightbox"
                  >
                    <img 
                      src={col.image} 
                      alt={`${col.name} archival documentation`} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#292723]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#292723]/90 text-white px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1 shadow">
                        <Maximize2 size={12} className="text-[#873E32]" />
                        <span>Inspect High-Res Negative</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="collection-card-title font-serif text-2xl font-bold mb-1 text-[#292723]">
                    {col.name}
                  </h3>
                  <p className="collection-card-tagline text-sm font-medium text-[#873E32] mb-3">
                    {col.tagline}
                  </p>
                  <p className="collection-card-desc text-sm text-[#46443F] leading-relaxed mb-6">
                    {col.description}
                  </p>
                </div>

                <div className="collection-card-footer flex justify-between items-center font-mono text-xs text-[#77756F] border-t border-[#292723]/10 pt-3">
                  <span>Curatorial Focus: {col.aspect}</span>
                  <span className="text-[#873E32] font-semibold flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. THE ARCHIVAL CATALOG EXPLORER (SEARCH & HISTORICAL FROM/ERA FILTER)
          ===================================================================== */}
      <section className="explorer-section py-16 md:py-24 bg-[#E8E1D2] border-y border-[#292723]/15" id="explorer">
        <div className="site-container">
          <div className="section-head mb-8">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-2">
              Section 06 / Curated Catalog
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#292723]">
              The Archival Catalog
            </h2>
            <p className="section-desc text-lg text-[#46443F] mt-2 max-w-2xl">
              Search and filter across verified historical records, creator biographies, accession numbers, and historical eras.
            </p>
          </div>

          {/* Search Bar, Category Tabs & Historical From Era Filter */}
          <div className="explorer-controls-wrapper mb-8 flex flex-col gap-4">
            <div className="explorer-search-bar flex items-center gap-3 bg-[#F7F4EC] border border-[#292723]/30 rounded px-4 py-3">
              <Search size={18} className="text-[#77756F] shrink-0" aria-hidden="true" />
              <input 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, creator, location, or accession number (e.g., Zaria, Highlife, Adire, Azikiwe)..."
                className="w-full bg-transparent border-none text-base text-[#292723] placeholder-[#77756F] outline-none font-sans"
                aria-label="Search archival records"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#77756F] hover:text-[#292723] font-mono uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Historical From Period Filter Row */}
            <div className="flex flex-wrap items-center gap-3 bg-[#F7F4EC]/60 border border-[#292723]/15 p-2.5 rounded">
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#77756F] pr-2 border-r border-[#292723]/15">
                <Calendar size={14} className="text-[#873E32]" />
                <span className="font-semibold text-[#292723]">Historical From:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Eras' },
                  { id: 'precolonial', label: 'Before 1880' },
                  { id: 'nineteenth', label: '19th Century' },
                  { id: 'colonial', label: '1900–1959' },
                  { id: 'independence', label: '1960s' },
                  { id: 'postindependence', label: '1970–1985' },
                ].map(period => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-2.5 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
                      selectedPeriod === period.id
                        ? 'bg-[#873E32] text-white font-semibold'
                        : 'text-[#46443F] hover:bg-[#E8E1D2]'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}

                <div className="hidden sm:inline-block w-px h-4 bg-[#292723]/15 mx-1" />

                <button
                  onClick={() => setIsGoogleArtsFilterActive(!isGoogleArtsFilterActive)}
                  className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isGoogleArtsFilterActive
                      ? 'bg-[#873E32] text-[#F7F4EC] font-semibold shadow-sm'
                      : 'bg-[#E8E1D2] text-[#46443F] hover:bg-[#DDD4C3] border border-[#292723]/15'
                  }`}
                  title="Filter exclusively for authentic Google Arts & Culture / National Museum partner records"
                  aria-pressed={isGoogleArtsFilterActive}
                >
                  <Sparkles size={12} className={isGoogleArtsFilterActive ? 'text-[#F7F4EC]' : 'text-[#873E32]'} />
                  <span>Google Arts &amp; Culture Pictures</span>
                  {isGoogleArtsFilterActive && <Check size={12} />}
                </button>
              </div>
            </div>

            {/* Filter Buttons (Zero-Pill: functional segmented controls) */}
            <div className="explorer-filter-tabs flex flex-wrap gap-2" role="group" aria-label="Filter records by category">
              {[
                { id: 'all', label: 'All Mediums' },
                { id: 'photography', label: '01 Image Archive' },
                { id: 'sound', label: '02 Sound Archive' },
                { id: 'style', label: '03 Style Archive' },
                { id: 'print', label: '04 Printed Archive' },
                { id: 'art', label: 'Art & Architecture' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`filter-btn px-3.5 py-1.5 rounded border font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === tab.id 
                      ? 'bg-[#292723] text-[#F7F4EC] border-[#292723]' 
                      : 'bg-transparent text-[#46443F] border-[#292723]/20 hover:bg-[#DDD4C3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Indicator */}
          <div className="explorer-results-count font-mono text-xs uppercase tracking-wider text-[#77756F] mb-6 flex justify-between items-center" aria-live="polite">
            <span>Showing {filteredStories.length} of {STORIES.length} Curated Archival Records</span>
            {(selectedCategory !== 'all' || selectedPeriod !== 'all' || isGoogleArtsFilterActive || searchQuery) && (
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedPeriod('all'); setIsGoogleArtsFilterActive(false); setSearchQuery(''); }}
                className="text-[#873E32] hover:underline cursor-pointer lowercase"
              >
                (reset all filters)
              </button>
            )}
          </div>

          {/* Stories Grid with Lightbox Zoom Trigger on Images */}
          {filteredStories.length === 0 ? (
            <div className="explorer-empty-state text-center py-16 px-6 border border-dashed border-[#292723]/25 bg-[#F7F4EC] rounded">
              <h4 className="font-serif text-xl font-bold mb-2 text-[#292723]">No archival records found</h4>
              <p className="text-sm text-[#77756F] mb-4">
                No items match your active search "{searchQuery}" or selected historical period/medium filters.
              </p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedPeriod('all'); setIsGoogleArtsFilterActive(false); setSearchQuery(''); }}
                className="btn-secondary inline-flex items-center gap-2 bg-transparent text-[#292723] border border-[#292723]/40 hover:bg-[#E8E1D2] px-4 py-2 rounded text-xs font-semibold cursor-pointer"
              >
                Reset Search &amp; Show All Records
              </button>
            </div>
          ) : (
            <div className="stories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map(story => (
                <article 
                  key={story.id}
                  onClick={() => setActiveStoryModal(story)}
                  className="story-card group border border-[#292723]/20 bg-[#F7F4EC] p-5 flex flex-col justify-between hover:border-[#292723] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveStoryModal(story); }}
                  aria-label={`Open record: ${story.title}`}
                >
                  <div>
                    <div className="story-card-meta flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-[#77756F] mb-2">
                      <span className="text-[#873E32] font-semibold">{story.accessionNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.dateDisplay}</span>
                    </div>

                    {story.imageCredit.includes('Google Arts') && (
                      <div className="mb-2.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-[#E8E1D2] border border-[#873E32]/30 text-[#873E32] px-2 py-0.5 rounded font-medium">
                          <Sparkles size={10} />
                          <span>Google Arts &amp; Culture Partner Picture</span>
                        </span>
                      </div>
                    )}

                    <div 
                      className="story-card-media relative w-full aspect-[16/10] overflow-hidden bg-[#DDD4C3] mb-3 border border-[#292723]/10 cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightboxPhoto({
                          src: story.image,
                          alt: story.imageAlt,
                          title: story.title,
                          accession: story.accessionNumber,
                          credit: story.imageCredit,
                          location: story.location,
                          date: story.dateDisplay
                        });
                      }}
                      title="Inspect high-res image in Lightbox"
                    >
                      <img 
                        src={story.image} 
                        alt={story.imageAlt} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-400"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#292723]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#292723]/90 text-white px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1 shadow">
                          <Maximize2 size={12} className="text-[#873E32]" />
                          <span>Expand</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="story-card-title font-serif text-xl font-bold mb-1 text-[#292723] leading-snug">
                      {story.title}
                    </h3>
                    <p className="story-card-subtitle text-xs text-[#873E32] font-medium mb-3">
                      {story.subtitle}
                    </p>
                    <p className="story-card-summary text-sm text-[#46443F] leading-relaxed mb-4 line-clamp-3">
                      {story.summary}
                    </p>
                  </div>

                  <div className="story-card-footer flex justify-between items-center border-t border-[#292723]/10 pt-3 font-mono text-xs text-[#77756F]">
                    <span>Location: {story.location}</span>
                    <span className="text-[#292723] font-semibold underline underline-offset-4">
                      Inspect Record &rarr;
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          8. FRAGMENTS OF MEMORY (MUSEUM EXAMINATION TABLE)
          ===================================================================== */}
      <section className="fragments-section py-16 md:py-24" id="fragments">
        <div className="site-container">
          <div className="section-head mb-8">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-2">
              Section 07 / Ephemera Table
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#292723]">
              Fragments of Memory
            </h2>
            <p className="section-desc text-lg text-[#46443F] mt-2 max-w-2xl">
              History is preserved in fragile ephemera: printer's proofs, studio log sheets, handwritten manuscripts, and artisan recipes. Inspect each fragment below.
            </p>
          </div>

          <div className="fragments-curatorial-table bg-[#E8E1D2] border border-[#292723]/20 p-6 md:p-10 shadow-inner">
            <div className="fragments-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FRAGMENTS_OF_MEMORY.map(frag => (
                <article 
                  key={frag.id}
                  onClick={() => setActiveFragmentModal(frag)}
                  className="fragment-item-card bg-[#F7F4EC] border border-[#292723]/20 p-5 relative hover:-translate-y-1 hover:border-[#292723] hover:shadow-md transition-all cursor-pointer"
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveFragmentModal(frag); }}
                  aria-label={`Inspect fragment: ${frag.title}`}
                >
                  <div className="h-1.5 w-12 bg-[#873E32]/40 mx-auto -mt-5 mb-4"></div>
                  <div className="fragment-ref font-mono text-[11px] uppercase tracking-wider text-[#873E32] mb-2 font-semibold">
                    {frag.accessionRef}
                  </div>
                  <h3 className="fragment-title font-serif text-lg font-bold text-[#292723] mb-1">
                    {frag.title}
                  </h3>
                  <div className="fragment-date font-mono text-xs text-[#77756F] mb-3">
                    {frag.date} · {frag.location}
                  </div>
                  <div className="fragment-snippet font-serif italic text-sm text-[#46443F] border-l-2 border-[#873E32] pl-2.5 mb-3 leading-relaxed">
                    "{frag.snippet}"
                  </div>
                  <div className="fragment-notes text-xs text-[#77756F] leading-normal mb-3">
                    {frag.curatorAnnotation}
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#292723]/10 flex justify-between font-mono text-[11px] text-[#873E32] font-semibold">
                    <span>Format: {frag.artifactType}</span>
                    <span>Inspect Transcript &rarr;</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. PRESERVATION MANIFESTO & HISTORICAL CONTRIBUTION FORM ENTRY
          ===================================================================== */}
      <section className="preservation-section py-20 bg-[#292723] text-[#F7F4EC]" id="preservation">
        <div className="site-container">
          <div className="preservation-wrapper max-w-3xl mx-auto text-center">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#E8E1D2]/70 font-semibold block mb-2">
              Section 08 / Stewardship &amp; Living Memory
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#F7F4EC] mb-6">
              History survives when we choose to remember.
            </h2>
            <p className="preservation-prose text-lg md:text-xl leading-relaxed text-[#E8E1D2]/90 mb-10">
              Cultural memory is not an accidental inheritance; it is an active discipline. Every photograph preserved in an attic, every master tape digitised from magnetic decay, and every oral chronicle recorded from an elder strengthens our collective compass. ARCHIVE is dedicated to safeguarding these memories for generations yet unborn.
            </p>
            <div className="preservation-actions flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setShowContributionModal(true)}
                className="btn-primary inline-flex items-center gap-2 bg-[#873E32] text-[#F7F4EC] hover:bg-[#6e3025] px-6 py-3.5 rounded font-sans text-sm font-semibold tracking-wide transition-all cursor-pointer shadow"
              >
                <Send size={15} />
                <span>Submit Historical Artifact / Inquiry</span>
              </button>
              <button 
                onClick={() => scrollToSection('collections')}
                className="btn-secondary inline-flex items-center gap-2 bg-transparent text-[#F7F4EC] border border-[#E8E1D2]/40 hover:bg-[#E8E1D2]/10 px-6 py-3.5 rounded font-sans text-sm font-semibold tracking-wide transition-all cursor-pointer"
              >
                <span>Explore the Collections</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="mt-10 font-mono text-xs uppercase tracking-wider text-[#E8E1D2]/60">
              Community Archival Submissions &amp; Family Record Consultation Portal
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. COLOPHON, SOURCES & METHODOLOGY
          ===================================================================== */}
      <footer className="colophon-section py-16 bg-[#DDD4C3] border-t border-[#292723]/20 text-[#46443F]" id="colophon">
        <div className="site-container">
          <div className="section-head mb-8">
            <span className="section-kicker font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold block mb-1">
              Section 09 / Colophon
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#292723]">
              Sources, Methodology &amp; Citations
            </h3>
          </div>

          <div className="colophon-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-sm">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold mb-3">
                Project Statement
              </h4>
              <p className="mb-3 leading-relaxed">
                <strong className="text-[#292723]">ARCHIVE</strong> is a curatorial digital museum honoring the creative history of Nigeria. Designed with historical authenticity, rigorous academic sourcing, and editorial restraint.
              </p>
              <p className="text-xs text-[#77756F] leading-relaxed">
                Built with React, TypeScript, Tailwind CSS, and HTML5 Web Audio API. Zero external trackers. All ambient soundscapes are synthesized directly in the client.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold mb-3">
                Primary Historical Repositories
              </h4>
              <ul className="flex flex-col gap-1.5 font-mono text-xs">
                <li>National Archives of Nigeria (Ibadan Branch)</li>
                <li>Kenneth Dike Library, University of Ibadan</li>
                <li>Centre for Black Culture &amp; International Understanding (Osogbo)</li>
                <li>Asele Institute Documentation Trust (Nimo)</li>
                <li>Department of Antiquities Survey Records (Lagos)</li>
                <li>Decca &amp; Philips West Africa Studio Logs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold mb-3">
                Typography &amp; Palette Spec
              </h4>
              <ul className="flex flex-col gap-1.5 font-mono text-xs">
                <li>Display: Playfair Display &amp; Libre Baskerville</li>
                <li>Prose: Source Sans 3 (Regular &amp; SemiBold)</li>
                <li>Data: JetBrains Mono (Tabular Figures)</li>
                <li>Canvas: Aged Paper (#E8E1D2 / #F7F4EC)</li>
                <li>Pigment: Deep Ink (#292723) &amp; Oxide Red (#873E32)</li>
              </ul>
            </div>
          </div>

          <div className="colophon-bottom-strip flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-[#292723]/15 font-mono text-xs text-[#77756F]">
            <span>&copy; 2026 ARCHIVE: The Past Is Still Speaking. Non-commercial cultural preservation initiative.</span>
            <span>All historical attributions verified through scholarly archives.</span>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          11. ACCESSIBLE STORY MODAL DRAWER WITH 'SHARE THIS STORY' BUTTON
          ===================================================================== */}
      {activeStoryModal && (
        <div 
          className="fixed inset-0 z-[100] bg-[#292723]/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveStoryModal(null)}
        >
          <div 
            className="modal-dialog bg-[#F7F4EC] border border-[#292723]/25 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-10 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar: Close and Share */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => handleShareStory(activeStoryModal)}
                className="border border-[#292723]/20 rounded px-2.5 py-1 text-xs font-mono text-[#292723] hover:bg-[#E8E1D2] transition-colors cursor-pointer flex items-center gap-1.5"
                title="Share this archival story or copy link"
                aria-label="Share this story"
              >
                {shareFeedback ? (
                  <>
                    <Check size={13} className="text-emerald-700" />
                    <span className="text-emerald-800 font-semibold">{shareFeedback}</span>
                  </>
                ) : (
                  <>
                    <Share2 size={13} className="text-[#873E32]" />
                    <span>Share Record</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setActiveStoryModal(null)}
                className="border border-[#292723]/20 rounded px-2.5 py-1 text-xs font-mono text-[#292723] hover:bg-[#E8E1D2] transition-colors cursor-pointer"
                aria-label="Close archival record"
              >
                &times; Close [ESC]
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase text-[#77756F] mb-3 pt-6 sm:pt-0">
              <span className="text-[#873E32] font-bold">{activeStoryModal.accessionNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{activeStoryModal.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activeStoryModal.periodLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{activeStoryModal.dateDisplay}</span>
              <span aria-hidden="true">·</span>
              <span>{activeStoryModal.location}</span>
            </div>

            <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#292723] mb-1">
              {activeStoryModal.title}
            </h2>
            <p className="text-base text-[#873E32] font-medium mb-6">
              {activeStoryModal.subtitle}
            </p>

            {/* Clickable Image inside Modal to view full resolution Lightbox */}
            <div 
              className="relative w-full aspect-video bg-[#DDD4C3] border border-[#292723]/20 overflow-hidden mb-2 cursor-zoom-in group"
              onClick={() => setActiveLightboxPhoto({
                src: activeStoryModal.image,
                alt: activeStoryModal.imageAlt,
                title: activeStoryModal.title,
                accession: activeStoryModal.accessionNumber,
                credit: activeStoryModal.imageCredit,
                location: activeStoryModal.location,
                date: activeStoryModal.dateDisplay
              })}
              title="Click to view full-resolution in Lightbox viewer"
            >
              <img 
                src={activeStoryModal.image} 
                alt={activeStoryModal.imageAlt} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-400"
              />
              <div className="absolute inset-0 bg-[#292723]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-[#292723]/90 text-white px-3 py-1.5 rounded font-mono text-xs flex items-center gap-1.5 shadow">
                  <Maximize2 size={13} className="text-[#873E32]" />
                  <span>Open Fullscreen Lightbox</span>
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline font-mono text-xs text-[#77756F] mb-6">
              <span>{activeStoryModal.imageAlt}</span>
              <span className="text-[#873E32]">{activeStoryModal.imageCredit}</span>
            </div>

            {activeStoryModal.quote && (
              <div className="my-6 p-5 border-y border-[#292723]/20 bg-[#E8E1D2]">
                <p className="font-serif italic text-lg text-[#292723] mb-1">
                  "{activeStoryModal.quote.text}"
                </p>
                <p className="font-mono text-xs uppercase text-[#873E32]">
                  — {activeStoryModal.quote.speaker}, {activeStoryModal.quote.year}
                </p>
              </div>
            )}

            <div className="modal-narrative-prose text-base md:text-lg leading-relaxed text-[#46443F] flex flex-col gap-4">
              {activeStoryModal.fullNarrative.map((para, i) => (
                <p key={i} className={i === 0 ? 'drop-cap' : ''}>
                  {para}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#E8E1D2] border border-[#292723]/20 my-8">
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Key Creators &amp; Figures</span>
                <span className="text-sm font-medium text-[#292723]">{activeStoryModal.keyFigures.join(', ')}</span>
              </div>
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Medium &amp; Physical Form</span>
                <span className="text-sm font-medium text-[#292723]">{activeStoryModal.medium}</span>
              </div>
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Archival Dimensions</span>
                <span className="text-sm font-medium text-[#292723]">{activeStoryModal.dimensions || 'Archival folio standard'}</span>
              </div>
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Provenance &amp; Repository</span>
                <span className="text-sm font-medium text-[#292723]">{activeStoryModal.provenance}</span>
              </div>
            </div>

            <div className="p-4 border border-[#292723]/20 bg-[#F7F4EC] flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold mb-1">
                  Curatorial Annotation:
                </span>
                <p className="text-sm text-[#46443F] leading-relaxed max-w-xl">
                  {activeStoryModal.curatorNotes}
                </p>
              </div>

              <button 
                onClick={() => handleShareStory(activeStoryModal)}
                className="btn-primary inline-flex items-center gap-2 bg-[#292723] text-[#F7F4EC] px-4 py-2 rounded font-sans text-xs font-semibold cursor-pointer"
              >
                <Share2 size={13} />
                <span>Share this Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          12. ACCESSIBLE FRAGMENT INSPECTION MODAL
          ===================================================================== */}
      {activeFragmentModal && (
        <div 
          className="fixed inset-0 z-[100] bg-[#292723]/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveFragmentModal(null)}
        >
          <div 
            className="modal-dialog bg-[#F7F4EC] border border-[#292723]/25 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-10 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveFragmentModal(null)}
              className="absolute top-4 right-4 border border-[#292723]/20 rounded px-2.5 py-1 text-xs font-mono text-[#292723] hover:bg-[#E8E1D2] transition-colors cursor-pointer"
              aria-label="Close inspection"
            >
              &times; Close Inspection [ESC]
            </button>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase text-[#77756F] mb-3">
              <span className="text-[#873E32] font-bold">{activeFragmentModal.accessionRef}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFragmentModal.artifactType}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFragmentModal.date}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFragmentModal.location}</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#292723] mb-1">
              {activeFragmentModal.title}
            </h2>
            <p className="text-sm text-[#873E32] font-medium mb-6">
              Curatorial Examination &amp; Verified Text Transcription
            </p>

            <div className="my-6 p-6 bg-[#E8E1D2] border border-[#292723]/20 font-mono text-sm leading-relaxed whitespace-pre-wrap text-[#292723]">
              {activeFragmentModal.fullTranscript}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F7F4EC] border border-[#292723]/20 mb-6">
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Physical Artifact Notes</span>
                <span className="text-xs font-medium text-[#292723]">{activeFragmentModal.physicalNotes}</span>
              </div>
              <div>
                <span className="block font-mono text-xs uppercase tracking-wider text-[#77756F]">Repository Reference</span>
                <span className="text-xs font-medium text-[#292723]">{activeFragmentModal.repository}</span>
              </div>
            </div>

            <div className="p-4 border border-[#292723]/20 bg-[#E8E1D2]">
              <span className="block font-mono text-xs uppercase tracking-wider text-[#873E32] font-semibold mb-1">
                Curator's Observation:
              </span>
              <p className="text-sm text-[#46443F] leading-relaxed">
                {activeFragmentModal.curatorAnnotation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          13. ARCHIVAL LIGHTBOX FULLSCREEN GALLERY VIEWER (ZOOM & PAN)
          ===================================================================== */}
      <ArchivalLightbox 
        photo={activeLightboxPhoto} 
        onClose={() => setActiveLightboxPhoto(null)} 
      />

      {/* =====================================================================
          14. HISTORICAL ARTIFACT INQUIRY & CONSULTATION MODAL
          ===================================================================== */}
      {showContributionModal && (
        <div 
          className="fixed inset-0 z-[100] bg-[#292723]/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowContributionModal(false)}
        >
          <div 
            className="modal-dialog bg-[#F7F4EC] border border-[#292723]/25 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-10 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowContributionModal(false)}
              className="absolute top-4 right-4 border border-[#292723]/20 rounded px-2.5 py-1 text-xs font-mono text-[#292723] hover:bg-[#E8E1D2] transition-colors cursor-pointer"
              aria-label="Close form"
            >
              &times; Close [ESC]
            </button>

            <div className="font-mono text-xs uppercase text-[#873E32] font-semibold mb-2">
              Community Cultural Stewardship
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#292723] mb-2">
              Archival Record Consultation Form
            </h2>

            <p className="text-sm text-[#46443F] mb-6 leading-relaxed">
              Do you possess historical family photographs, recordings, letters, or textiles related to Nigeria's creative past? Submit an inquiry for curatorial review and preservation.
            </p>

            {contributionSubmitted ? (
              <div className="p-6 bg-[#E8E1D2] border border-[#292723]/20 rounded text-center">
                <div className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#292723] mb-2">
                  Inquiry Received &amp; Logged
                </h3>
                <p className="text-sm text-[#46443F] mb-3">
                  Your archival inquiry has been registered under Curatorial Reference:
                </p>
                <div className="font-mono text-base font-bold text-[#873E32] mb-4 bg-white/70 py-1.5 px-3 rounded inline-block">
                  {contributionSubmitted}
                </div>
                <p className="text-xs text-[#77756F] leading-normal mb-6">
                  Our archival team in Lagos &amp; Ibadan will review your provenance details within 5 business days. A confirmation receipt has been scheduled for {formFields.email}.
                </p>
                <button 
                  onClick={() => {
                    setContributionSubmitted(null);
                    setShowContributionModal(false);
                  }}
                  className="btn-primary inline-flex items-center gap-2 bg-[#292723] text-[#F7F4EC] px-5 py-2.5 rounded font-sans text-xs font-semibold cursor-pointer"
                >
                  Return to Archive
                </button>
              </div>
            ) : (
              <form onSubmit={handleContributionSubmit} className="flex flex-col gap-4 text-sm">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Your Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formFields.contributorName}
                    onChange={(e) => setFormFields({ ...formFields, contributorName: e.target.value })}
                    placeholder="e.g. Dr. Amina Adeleke"
                    className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formFields.email}
                      onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                      Historical From Era *
                    </label>
                    <select 
                      value={formFields.historicalFromEra}
                      onChange={(e) => setFormFields({ ...formFields, historicalFromEra: e.target.value })}
                      className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                    >
                      <option value="precolonial">Before Colonial Rule (Pre-1880)</option>
                      <option value="nineteenth">19th Century (1800–1899)</option>
                      <option value="colonial">Colonial Period (1900–1959)</option>
                      <option value="independence">Independence Era (1960–1969)</option>
                      <option value="postindependence">Post-Independence (1970–1985)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                      Artifact Medium / Form *
                    </label>
                    <select 
                      value={formFields.artifactType}
                      onChange={(e) => setFormFields({ ...formFields, artifactType: e.target.value })}
                      className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                    >
                      <option value="photograph">Photograph / Negative</option>
                      <option value="audio">Vinyl / Magnetic Tape Audio</option>
                      <option value="textile">Textile / Woven Adire</option>
                      <option value="print">Newspaper / Letterpress Print</option>
                      <option value="manuscript">Handwritten Letter / Manuscript</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                      Geographical Origin
                    </label>
                    <input 
                      type="text" 
                      value={formFields.location}
                      onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
                      placeholder="e.g. Abeokuta, Kano, Lagos Island"
                      className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-[#77756F] mb-1">
                    Historical Story &amp; Provenance Details *
                  </label>
                  <textarea 
                    rows={4}
                    required
                    value={formFields.narrative}
                    onChange={(e) => setFormFields({ ...formFields, narrative: e.target.value })}
                    placeholder="Describe how your family or institution came into custody of this record, who is depicted, and any known dates or names..."
                    className="w-full bg-[#E8E1D2]/60 border border-[#292723]/20 rounded p-2.5 font-sans outline-none focus:border-[#292723]"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowContributionModal(false)}
                    className="btn-secondary px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary inline-flex items-center gap-2 bg-[#292723] text-[#F7F4EC] px-6 py-2.5 rounded font-sans text-xs font-semibold cursor-pointer hover:bg-black"
                  >
                    <Send size={13} />
                    <span>Submit for Curatorial Assessment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-[#292723] text-[#F7F4EC] hover:bg-[#171513] p-3 rounded shadow-lg font-mono text-xs flex items-center gap-1.5 z-40 transition-all cursor-pointer"
          aria-label="Return to top of page"
        >
          <ArrowUp size={14} />
          <span>Top</span>
        </button>
      )}

    </div>
  );
}
