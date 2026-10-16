# ARCHIVE — The Past Is Still Speaking

> A curatorial digital museum preserving and presenting Nigeria's creative memory through historical photography, sound, style, print culture, architecture, and art.

[![Live Web Application](https://img.shields.io/badge/status-active-success.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/framework-vanilla--js%20%2F%20html5%20%2F%20css3-blue)](#)
[![Web Audio API](https://img.shields.io/badge/soundscape-web--audio--api-orange)](#)

---

## 1. Project Overview & Concept

**ARCHIVE** was conceived as an award-grade, emotionally resonant editorial exhibition. The project answers three fundamental questions:
1. *What did people create and experience before us?*
2. *How did their creativity shape the Nigeria we know today?*
3. *What stories must we preserve for the next generation?*

History is not merely dates in school textbooks; it lives in silver gelatin photographs, broadsheet headlines printed on letterpresses, cassava-starch resist patterns dyed in indigo, highlife shellac discs pressed in Apapa, and mud cathedrals engineered in Zaria.

---

## 2. Art Direction & Visual Identity

The visual language blends historical authenticity, minimalist editorial design, vintage archival materials, and contemporary digital storytelling:

- **Color Palette:**
  - **Aged Paper:** `#E8E1D2` & `#F7F4EC` (soft, tactile document reading ground)
  - **Deep Ink:** `#292723` (rich carbon ink contrast for titles and typography)
  - **Charcoal:** `#46443F` (editorial prose color preventing eye fatigue)
  - **Muted Archival Grey:** `#77756F` (subtle accession metadata, dates, and borders)
  - **Faded Oxide Red:** `#873E32` (reserved for rubric markers, accession tags, and active states)
- **Typographic System:**
  - **Headings & Masthead:** *Playfair Display* & *Libre Baskerville* (high-contrast editorial serifs reminiscent of mid-century catalogues and broadsheets)
  - **Body Prose:** *Source Sans 3* (neutral, highly readable contemporary sans-serif with 65–75 character measure and drop caps)
  - **Accession & Data:** *JetBrains Mono* (strictly tabular figures for accession numbers, coordinates, and dates)
- **Zero-Pill Discipline:**
  - Static metadata (dates, categories, locations) is rendered cleanly as unboxed prose with typographic separators (`·`, `/`).
  - Interactive filter controls are styled as clean, functional segmented buttons.
- **Top Bar Contract:**
  - Strictly 3 zones: Brand Wordmark (`ARCHIVE`) — Nav Links — Primary Action (`[Soundscape: Off/On]`).

---

## 3. Architecture & Key Features

### Section Breakdown
1. **The Archive Opens (Hero):**
   - Newspaper masthead, issue number (`ISSUE NO. 01`), striking silver gelatin anchor photograph, clear call to actions, and scroll affordance.
2. **A Note from the Archivist:**
   - Curator's letter with initial drop cap explaining the philosophy of living cultural memory.
3. **Interactive Historical Timeline (5 Epochs):**
   - *Era 01:* Before Colonial Rule (Nok, Ife, Benin Guild of Igun Eronmwon, Kano indigo pits)
   - *Era 02:* 19th Century Transformations (Saro returnees, Sobrado architecture, arrival of photography)
   - *Era 03:* Colonial Awakening & Modern Movements (Anticolonial broadsheets, early highlife, Zaria Rebels)
   - *Era 04:* The Independence Decade (Mbari Club Ibadan, sovereign highlife, national photography)
   - *Era 05:* Post-Independence Decades (Afrobeat, Kalakuta Republic graphics, Ojeikere's hairstyle taxonomy)
4. **The Featured Story (Deep Dive):**
   - *The Zaria Rebels & The Birth of Natural Synthesis (October 1958)* with full curatorial spec rail, historical quote, and deep reading drawer.
5. **The Creative Collections (The 4 Worlds):**
   - 01 The Image Archive
   - 02 The Sound Archive
   - 03 The Style Archive
   - 04 The Printed Archive
6. **Curated Catalog Explorer:**
   - Real-time search across titles, creators, locations, and accession numbers.
   - Dynamic category filters (`All`, `Photography`, `Sound`, `Style`, `Print`, `Art & Architecture`).
7. **Fragments of Memory (Museum Examination Table):**
   - 5 tangible historical ephemera items with tactile cards and verifiable transcripts.
8. **Preservation Manifesto:**
   - Call to action on intergenerational cultural stewardship.
9. **The Colophon:**
   - Archival repositories, typography specifications, and research credits.

### Real-Time Ambient Soundscape (Web Audio API)
- Pure client-side synthesis without third-party audio files:
  - Bandpass-filtered vintage shellac surface noise with randomized micro-crackle.
  - Meditative pentatonic resonances based on traditional West African intervals (G3, A3, C4, D4, E4).
  - Polite, off by default with an interactive toggle in the masthead.

---

## 4. File Structure

```
├── index.html                # Semantic HTML5 entry point & publication layout
├── css/
│   └── style.css             # Editorial museum stylesheet & design system
├── js/
│   ├── app.js                # Core controller, soundscape engine & modal logic
│   └── stories.js            # Curated historical story database & timeline data
├── src/
│   ├── assets/images/        # High-fidelity archival plates & photographs
│   └── utils/
│       ├── archiveLogic.ts   # Pure decoupled logic for filtering & search
│       └── archiveLogic.test.ts # Unit tests verified with node:test
├── README.md                 # Design & architecture documentation
├── asset-credits.md          # Archival sources, repositories & image credits
├── package.json              # Build scripts and tooling
└── tsconfig.json             # TypeScript configuration
```

---

## 5. Technical Verification & Performance

- **Unit Testing:** Decoupled pure logic verified using Node.js native test runner:
  ```bash
  node --test src/utils/archiveLogic.test.ts
  ```
- **Zero Broken Images:** All media elements include explicit dimensions, `referrerPolicy="no-referrer"`, and a styled CSS fallback container.
- **Accessibility:** WCAG AA compliant contrast ratios, visible focus outlines, full keyboard navigation (`Tab`, `Enter`, `Escape` to dismiss modal), and semantic ARIA labeling.

---

## 6. Limitations & Future Roadmap

- **Community Archival Portal:** A public submission interface for family photo digitisation is currently presented as a design concept with verified accession schemas. Future versions will integrate persistent cloud submission workflows.
- **Audio Archives:** Full multi-track highlife recordings are currently simulated through authentic algorithmic acoustic synthesis; direct integration with university sound archives (such as Kenneth Dike Library archives) will be expanded in future versions.
