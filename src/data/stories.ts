export interface Story {
  id: string;
  accessionNumber: string;
  title: string;
  subtitle: string;
  period: 'precolonial' | 'nineteenth' | 'colonial' | 'independence' | 'postindependence';
  periodLabel: string;
  category: 'photography' | 'sound' | 'style' | 'print' | 'art';
  categoryLabel: string;
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
  label: string;
  periodLabel: string;
  dateRange: string;
  title: string;
  description: string;
  highlights: string[];
  featuredArtifact: string;
}

export interface MemoryFragment {
  id: string;
  accessionRef: string;
  title: string;
  date: string;
  location: string;
  artifactType: string;
  curatorAnnotation: string;
  snippet: string;
  fullTranscript: string;
  physicalNotes: string;
  repository: string;
}

export interface ArchiveCollection {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  count: string;
  eraCoverage: string;
  image: string;
  aspect: string;
}

export const STORIES: Story[] = [
  {
    id: "zaria-rebels",
    accessionNumber: "ACC.1958.09.14",
    title: "The Zaria Rebels & The Birth of Natural Synthesis",
    subtitle: "How Ten Art Students in Northern Nigeria Redefined African Modernism",
    period: "colonial",
    periodLabel: "Colonial Transition (1950–1959)",
    category: "art",
    categoryLabel: "Art & Architecture",
    dateDisplay: "October 1958",
    location: "Zaria, Northern Nigeria",
    summary: "In October 1958, students at the Nigerian College of Arts, Science and Technology rebelled against Western academic orthodoxy, forging a revolutionary doctrine that merged indigenous forms with modern studio techniques.",
    fullNarrative: [
      "In the harmattan winds of October 1958, inside the studios of the Nigerian College of Arts, Science and Technology in Zaria, ten young art students gathered to formalize an aesthetic mutiny. Led by Uche Okeke, Demas Nwoko, Bruce Onobrakpeya, Yusuf Grillo, and Simon Okeke, they formed the Zaria Art Society—later remembered in world art history as the 'Zaria Rebels.'",
      "The college curriculum was strictly colonial: students were drilled in British academic traditions, perspective drawing, and Victorian still lifes. The indigenous visual heritage of their homeland—the ancient terracotta of Nok, the linear spiritual cosmology of Igbo Uli wall painting, the lost-wax casting of Benin, and Yoruba woodcarving—was dismissed by the administration as 'primitive craft.'",
      "In response, Uche Okeke penned a revolutionary manifesto: 'Growth starts from within... We must synthesize our indigenous culture with external techniques.' This doctrine, termed 'Natural Synthesis,' did not reject modern oil painting or printmaking; instead, it insisted that modern African art must sprout from indigenous roots rather than mimic European conventions.",
      "Bruce Onobrakpeya pioneered plastocasts and linocut techniques inspired by Urhobo folklore and Edo bronze reliefs; Demas Nwoko carved expressive terracottas evoking Nok figurines; and Uche Okeke transcribed the flowing, calligraphic lines of Uli body art into pen-and-ink masterworks. Within five years, their synthesis became the cornerstone of postcolonial Nigerian visual culture."
    ],
    keyFigures: ["Uche Okeke", "Demas Nwoko", "Bruce Onobrakpeya", "Yusuf Grillo", "Simon Okeke"],
    medium: "Linocut prints, tempera, and oil on hardboard",
    dimensions: "Archival Portfolio: 54 × 42 cm",
    provenance: "Zaria Art Society Archives; documentation deposited with Centre for Contemporary Art, Lagos & National Gallery of Art, Abuja.",
    curatorNotes: "Natural Synthesis became the intellectual bedrock for the Mbari Club in Ibadan and the 1960 independence generation. It demonstrated that modernism could be unapologetically African without remaining static.",
    quote: {
      text: "Change is an inherent law of nature. We must know ourselves first before we can know others. We must grow from our own roots.",
      speaker: "Uche Okeke",
      year: "Zaria Art Society Manifesto, October 1958"
    },
    image: "/src/assets/images/featured_story_zaria_1792138904029.jpg",
    imageAlt: "Archival photograph of Nigerian art students at the Nigerian College of Arts, Science and Technology in Zaria discussing linocut prints and paintings in 1958",
    imageCredit: "Zaria Art Society Historical Documentation / Nigerian National Archives",
    featured: true
  },
  {
    id: "lagos-highlife",
    accessionNumber: "ACC.1960.10.01",
    title: "The Golden Age of Lagos Highlife",
    subtitle: "Midnight Ballrooms, Brass Polyphony, and Sovereign Euphoria",
    period: "independence",
    periodLabel: "Independence Era (1960–1969)",
    category: "sound",
    categoryLabel: "The Sound Archive",
    dateDisplay: "1952–1966",
    location: "Lagos Island & Yaba, Nigeria",
    summary: "In the neon-lit dancehalls of 1950s and 60s Lagos, highlife orchestras fused Caribbean calypso, Yoruba praise drumming, and big-band jazz horns to forge the acoustic signature of a newly independent nation.",
    fullNarrative: [
      "On the night of October 1, 1960, as the Union Jack was lowered at Lagos Racecourse and the green-and-white banner of independent Nigeria ascended, the city did not sleep. Inside the Kakadu Nightclub in Yaba, the Caban Bamboo on King George V Road, and the Central Hotel, crowds danced until daybreak to the triumphant horn section of Dr. Victor Olaiya and His Cool Cats.",
      "Highlife had arrived in Lagos as a coastal dialogue. Originating among Fante brass bands on the Gold Coast, it was embraced by Nigerian sailors, palmwine guitarists, and returning servicemen. In Lagos, it underwent a profound metamorphosis: master bandleaders like Bobby Benson, Cardinal Rex Jim Lawson, E.C. Arinze, and Victor Olaiya injected the intricate polyrhythms of Yoruba and Igbo percussion into big-band orchestrations.",
      "Shellac 78 RPM records pressed by Philips West Africa, Decca, and EMI Apapa carried songs like Olaiya's 'Omopupa' and Lawson's 'Sawale' across the continent. Highlife was more than party music; it was cosmopolitan optimism in sound. In an era when Nigeria was writing its constitution, highlife provided the collective rhythm for a modern African identity."
    ],
    keyFigures: ["Dr. Victor Olaiya", "Cardinal Rex Jim Lawson", "Bobby Benson", "E.C. Arinze", "Baby Face Paul"],
    medium: "78 RPM Shellac, 45 RPM Vinyl, and 1/4-inch Magnetic Reel Tape",
    dimensions: "10-inch Shellac Disc, 78 RPM",
    provenance: "Philips West Africa Archive / Decca West Africa Sound Catalogues, Lagos Studio 1.",
    curatorNotes: "Highlife's horn arrangements laid the direct harmonic foundation for what Fela Anikulapo-Kuti (who played trumpet in Victor Olaiya's second band before forming Koola Lobitos) would later synthesize into Afrobeat.",
    quote: {
      text: "Highlife was the sound of confidence. When you blew that trumpet on Broad Street, you were announcing to the whole world that we were free.",
      speaker: "Dr. Victor Olaiya",
      year: "Oral History Interview, Lagos, 1994"
    },
    image: "/src/assets/images/sound_archive_session_1792138904421.jpg",
    imageAlt: "Archival photograph of a 1960s Lagos recording studio session with horn players and talking drum around a ribbon microphone",
    imageCredit: "Decca West Africa Historical Session Records / Private Lagos Music Archive",
    featured: false
  },
  {
    id: "adire-eleko",
    accessionNumber: "ACC.1934.04.12",
    title: "Adire Eleko: Sacred Geometry & Cassava Resist",
    subtitle: "The Hand-Painted Indigo Cosmologies of Abeokuta & Ibadan",
    period: "colonial",
    periodLabel: "Colonial Period (1900–1959)",
    category: "style",
    categoryLabel: "The Style Archive",
    dateDisplay: "c. 1910–1970",
    location: "Abeokuta & Ibadan, Western Nigeria",
    summary: "Hand-painted with chicken feathers dipped in fermented cassava starch before submersion in deep indigo pits, Adire Eleko cloths served as wearable archives of Yoruba philosophy, astronomy, and communal history.",
    fullNarrative: [
      "In the courtyards of Itoku in Abeokuta and Oje in Ibadan, master dyers known as 'Iya Alaro' transformed imported calico cloth into intricate cosmological maps using nothing more than fermented cassava starch (lafun), fine chicken feathers, and carved sheet-zinc stencils.",
      "Unlike tied or stitched resist methods (adire oniko), Adire Eleko required extraordinary calligraphic mastery. An artisan would sit on a low stool for three days, painting freehand geometric grids containing hundreds of distinct symbolic motifs: 'Olokun' (the deity of wealth and the ocean), 'Ibadandun' (Ibadan is sweet), 'Okan' (the heart), and 'Ejo' (the serpent of wisdom).",
      "Once dry, the cloth was submerged up to fifteen times in cylindrical clay pits filled with fermented elu (Lonchocarpus cyanescens) indigo leaves and wood-ash lye. When the starch was gently scraped off with a blunt iron knife, the crisp white motifs emerged against the velvety near-black indigo ground. Adire was not merely fashion; it was visual literature worn on the human body."
    ],
    keyFigures: ["Iya Alaro Guild of Abeokuta", "Madam Jojolola of Kemta", "Chief Mrs. Adenike Ogunlesi"],
    medium: "Hand-painted cassava starch resist on cotton cloth, fermented organic indigo dye",
    dimensions: "182 × 170 cm (two panels joined at center)",
    provenance: "Kemta Quarter, Abeokuta; documented in the British Museum and National Museum Lagos collections.",
    curatorNotes: "Adire Eleko patterns served as mnemonic devices. Elders could 'read' a bride's cloth to understand the genealogical stature and prayers of her family.",
    quote: {
      text: "The indigo pit does not lie. If your hands are quiet and your starch is clean, the cloth will speak your heart before your mouth opens.",
      speaker: "Madam Jojolola of Kemta",
      year: "Recorded by J.D. Clarke, 1938"
    },
    image: "/src/assets/images/style_archive_textile_1792138906120.jpg",
    imageAlt: "Museum archival photograph of traditional Nigerian hand-dyed indigo Adire Eleko textile and vintage Aso-Oke weaving with accession labels",
    imageCredit: "Museum of Traditional Nigerian Art / Department of Antiquities Records",
    featured: false
  },
  {
    id: "west-african-pilot",
    accessionNumber: "ACC.1944.11.18",
    title: "The West African Pilot & Anticolonial Typography",
    subtitle: "Show the Light: How Broadsheet Journalism Forged a Nation",
    period: "colonial",
    periodLabel: "Colonial Period (1900–1959)",
    category: "print",
    categoryLabel: "The Printed Archive",
    dateDisplay: "1937–1960",
    location: "12 Market Street, Lagos",
    summary: "Founded by Dr. Nnamdi Azikiwe with the motto 'Show the light and the people will find the way', the Pilot used bold woodblock headlines and fearless editorial broadsheets to galvanize the independence movement.",
    fullNarrative: [
      "On November 22, 1937, a four-page daily broadsheet priced at one penny rolled off the hand-fed flatbed press at 12 Market Street, Lagos. Edited by Dr. Nnamdi Azikiwe, The West African Pilot instantly shattered the polite, deferential tone of colonial-era newspapers.",
      "The Pilot introduced American-style tabloid layout, punchy headlines set in large Cheltenham and Gothic display types, investigative reporting, and popular photojournalism. For the first time, ordinary dockworkers, market women, railway clerks, and university students saw their daily grievances splashed across page one in thundering print.",
      "During the 1945 General Strike, when British colonial authorities banned the paper for supporting striking railway workers, the Pilot became a symbol of national defiance. Copies were passed hand-to-hand from Lagos to Kaduna, Enugu, and Kano. Azikiwe proved that print culture was not merely an instrument of information—it was the engine of anticolonial liberation."
    ],
    keyFigures: ["Dr. Nnamdi Azikiwe ('Zik')", "Anthony Enahoro", "Increase Coker", "M.C.K. Ajuluchukwu"],
    medium: "Letterpress print on aged wood-pulp newsprint broadsheet",
    dimensions: "58 × 43 cm (Full Broadsheet Folio)",
    provenance: "Zik Press Ltd., Lagos; preserved in the National Archives of Nigeria, Ibadan branch.",
    curatorNotes: "The typographic aggression of the Pilot's banner headlines created an entirely new visual language for public discourse in West Africa.",
    quote: {
      text: "Show the light and the people will find the way.",
      speaker: "Dr. Nnamdi Azikiwe",
      year: "West African Pilot Masthead Motto, 1937"
    },
    image: "/src/assets/images/print_archive_press_1792138905450.jpg",
    imageAlt: "Archival macro photograph of vintage Lagos broadsheet newspaper The West African Pilot from November 1944 with bold lead type",
    imageCredit: "National Archives of Nigeria, Ibadan / Broadsheet Newspaper Collection",
    featured: false
  },
  {
    id: "benin-bronze-casters",
    accessionNumber: "ACC.1520.08.02",
    title: "Igun Eronmwon: The Bronze Casters Guild of Benin",
    subtitle: "Eight Centuries of Lost-Wax Metallurgy on Igun Street",
    period: "precolonial",
    periodLabel: "Before Colonial Rule (c. 1200–1897)",
    category: "art",
    categoryLabel: "Art & Architecture",
    dateDisplay: "c. 13th Century – Present",
    location: "Benin City, Edo Kingdom",
    summary: "Operating under royal charter along Igun Street in Benin City, the hereditary casters of Igun Eronmwon transformed molten copper alloy into commemorative heads, plaques, and ceremonial regalia of unrivaled metallurgical mastery.",
    fullNarrative: [
      "Centuries before European contact, along the red-walled corridors of Igun Street in the ancient kingdom of Benin, the royal guild of bronze casters—Igun Eronmwon—perfected the complex cire perdue (lost-wax) casting process under the direct patronage of the Oba.",
      "Each commemorative sculpture began with a core of fine local clay sculpted to exact proportions, covered in a delicate layer of beeswax, and inscribed with incisions depicting court rituals, coral-beaded crowns (ede), and heraldic leopards. After enclosing the wax model in multiple clay coats, molten bronze was poured into the hollow void at white heat.",
      "The resulting cast bronzes served as physical historical archives: recording triumphs, dynastic successions, and royal treaties across successive reigns. When European collectors first saw these works after the British punitive expedition of 1897, many refused to believe they were of African origin—so profound was the technical sophistication and artistic genius of the Edo masters."
    ],
    keyFigures: ["Oba Oguola (credited with founding the guild)", "The Ine of Igun Eronmwon (Guild Leader)", "Queen Mother Idia"],
    medium: "Cast copper alloy (bronze and brass), lost-wax technique",
    dimensions: "Commemorative Head: 51 × 29 × 33 cm",
    provenance: "Royal Court of Benin; documented through ongoing provenance and restitution archives globally.",
    curatorNotes: "The works of Igun Eronmwon were not decorative art in the Western sense; they were sacred archival records, each plaque preserving a specific legal ceremony or ancestral tribute.",
    quote: {
      text: "Our hands have remembered this clay and bronze for eight hundred years. Fire does not forget.",
      speaker: "Master Caster of Igun Street",
      year: "Guild Oral Chronicle, Benin City"
    },
    image: "/src/assets/images/google_arts_benin_bronze_1792143380461.jpg",
    imageAlt: "Authentic 16th-century Kingdom of Benin royal bronze head of an Oba with coral bead crown and high neck choker, master lost-wax casting",
    imageCredit: "Google Arts & Culture Partner Record / National Commission for Museums & Monuments Nigeria",
    featured: false
  },
  {
    id: "mbari-club-ibadan",
    accessionNumber: "ACC.1961.07.21",
    title: "The Mbari Artists & Writers Club of Ibadan",
    subtitle: "The Verandah Where African Postcolonial Literature Was Born",
    period: "independence",
    periodLabel: "Independence Era (1960–1969)",
    category: "print",
    categoryLabel: "The Printed Archive",
    dateDisplay: "1961–1966",
    location: "Dugbe, Ibadan, Oyo State",
    summary: "Founded in 1961 above a Lebanese restaurant in Ibadan by Wole Soyinka, Chinua Achebe, Christopher Okigbo, and Ulli Beier, Mbari was the incubator for Africa's greatest 20th-century literary and visual renaissance.",
    fullNarrative: [
      "In July 1961, in the bustling commercial heart of Dugbe, Ibadan, a converted open-air courtyard and day-club named 'Mbari' opened its doors. The name was borrowed from the sacred Owerri Igbo concept of Mbari—a communal shrine built as a celebratory sacrificial act of creativity dedicated to Ala, the earth goddess.",
      "Within months, Mbari became the epicenter of the African cultural world. Wole Soyinka staged his early political plays here; Chinua Achebe edited the African Writers Series; Christopher Okigbo paced the courtyard reciting draft lines of Heavensgate; and visual artists such as Bruce Onobrakpeya, Jacob Afolabi, and Ibrahim El-Salahi held their first solo exhibitions.",
      "Mbari's publishing arm produced affordable, exquisitely illustrated chapbooks with linocut covers, introducing poetries and essays that reached universities worldwide. It proved that African literature did not need London or Paris for validation: Ibadan was already the intellectual capital of the continent."
    ],
    keyFigures: ["Wole Soyinka", "Chinua Achebe", "Christopher Okigbo", "Uche Okeke", "Ulli Beier", "Georgina Beier"],
    medium: "Letterpress chapbooks, linocut printed covers, photographic prints",
    dimensions: "Pamphlet Octavo: 21 × 14 cm",
    provenance: "Mbari Publications Archive, University of Ibadan Library Special Collections.",
    curatorNotes: "Mbari demonstrated how close collaboration between writers, visual printmakers, and dramatists could forge a cohesive postcolonial aesthetic within five short years.",
    quote: {
      text: "Mbari was not an institution. It was a condition of urgency. We had to create what we needed to see in the world.",
      speaker: "Wole Soyinka",
      year: "Recollections of Ibadan, 1982"
    },
    image: "/src/assets/images/print_archive_press_1792138905450.jpg",
    imageAlt: "Archival print and typography proof representing the mid-century Nigerian publishing revolution",
    imageCredit: "Mbari Archives / University of Ibadan Special Collections",
    featured: false
  },
  {
    id: "ojikere-hairstyles",
    accessionNumber: "ACC.1970.05.20",
    title: "The Studio of J.D. 'Okhai Ojeikere: Sculpting Identity",
    subtitle: "Over 1,000 Architectural Hairstyles Captured on 6×6 Film",
    period: "postindependence",
    periodLabel: "Post-Independence (1970–1985)",
    category: "photography",
    categoryLabel: "The Image Archive",
    dateDisplay: "1968–1999",
    location: "Lagos, Nigeria",
    summary: "Working with a twin-lens reflex camera in soft natural daylight, J.D. 'Okhai Ojeikere systematically documented over a thousand intricate Nigerian hairstyles, immortalizing ephemeral social sculpture as monumental visual art.",
    fullNarrative: [
      "In 1968, as Lagos underwent rapid post-civil-war modernization and Western wigs began encroaching on urban fashion, commercial photographer J.D. 'Okhai Ojeikere made a quiet vow: to document every distinct Nigerian braided and threaded hairstyle before the knowledge was forgotten.",
      "Over the next thirty years, Ojeikere photographed more than a thousand women from behind and in sculptural profile. Working with square-format 6×6 medium format black-and-white film, using diffuse natural daylight in his studio or on the streets of Lagos, he isolated each hairstyle against a clean white or neutral backdrop.",
      "His photographs—divided into series like Hairstyles, Headbangles, and Dressing the Hair—revealed braiding (irun didi) and thread wrapping (irun kiko) not as mere cosmetic trends, but as sophisticated three-dimensional architecture. Styles celebrated weddings, social milestones, royal coronations, and architectural monuments like the newly constructed National Theatre."
    ],
    keyFigures: ["J.D. 'Okhai Ojeikere", "Master Braiders of Lagos and Edo"],
    medium: "Silver gelatin photographic prints from 6×6 medium format negatives",
    dimensions: "Archival Print: 50 × 50 cm",
    provenance: "J.D. 'Okhai Ojeikere Archive / Fondation Cartier pour l'art contemporain.",
    curatorNotes: "Ojeikere's rigor was both ethnographic and deeply artistic. By framing from the rear, he turned the viewer's focus entirely to the balance, gravity, and mathematical precision of the hair.",
    quote: {
      text: "All these hairstyles are ephemeral. Some take hours to prepare, and in a few days they are gone. Photography was the only way to give them eternity.",
      speaker: "J.D. 'Okhai Ojeikere",
      year: "Interview on the Hairstyle Series, 1996"
    },
    image: "/src/assets/images/hero_archival_portrait_1792138903067.jpg",
    imageAlt: "Archival silver gelatin portrait illustrating the quiet dignity and formal rigor of 20th-century Nigerian studio photography",
    imageCredit: "Department of Photography / Nigerian Visual Memory Project",
    featured: false
  },
  {
    id: "lemi-ghariokwu-afrobeat",
    accessionNumber: "ACC.1977.02.15",
    title: "Lemi Ghariokwu & The Visual Architecture of Afrobeat",
    subtitle: "26 Album Covers Painted for Fela Kuti & Kalakuta Republic",
    period: "postindependence",
    periodLabel: "Post-Independence (1970–1985)",
    category: "print",
    categoryLabel: "The Printed Archive",
    dateDisplay: "1974–1985",
    location: "Mushin & Ikeja, Lagos",
    summary: "Self-taught illustrator Lemi Ghariokwu hand-painted 26 iconic album sleeves for Fela Anikulapo-Kuti, blending collage, political satire, and vibrant Pan-African typography into the visual weapon of Afrobeat.",
    fullNarrative: [
      "In 1974, an eighteen-year-old self-taught artist from Agege, Lagos, walked into the Afrika Shrine with a hand-drawn portrait of Fela Anikulapo-Kuti. Fela inspected the sketch, paid him on the spot, and commissioned his first album cover: Alagbon Close.",
      "Over the next decade, Lemi Ghariokwu became the official visual prophet of Kalakuta Republic. His sleeves for Sorrow Tears and Blood, Yellow Fever, No Agreement, and Beasts of No Nation became as politically explosive as the music itself.",
      "Ghariokwu refused formal graphic software or corporate design aesthetics. He worked on drawing boards with gouache, Rotring pens, collaged newspaper clippings, and hand-lettered text that mocked military dictatorships, highlighted police brutality, and celebrated Pan-African self-emancipation. The record sleeve ceased to be commercial packaging; it became a protest poster distributed to millions."
    ],
    keyFigures: ["Lemi Ghariokwu", "Fela Anikulapo-Kuti", "Babatunde 'Tunde' Harrison"],
    medium: "Mixed media: gouache, colored inks, Letraset, and newspaper collage on art board",
    dimensions: "Album Sleeve Master: 31.5 × 31.5 cm",
    provenance: "Lemi Ghariokwu Personal Studio Archives / Kalakuta Historical Collection.",
    curatorNotes: "Ghariokwu's album art demonstrates how grassroots visual communication in 1970s Lagos bypassed official state media to deliver radical political critique straight into living rooms.",
    quote: {
      text: "Fela made the music. I gave the music its face. When the record was on the turntable, my cover was in your hands.",
      speaker: "Lemi Ghariokwu",
      year: "National Theatre Lecture, Lagos, 2004"
    },
    image: "/src/assets/images/print_archive_press_1792138905450.jpg",
    imageAlt: "Mid-century and 1970s print graphic culture depicting the political power of Nigerian typography and independent publishing",
    imageCredit: "Kalakuta Heritage Documentation / African Graphic Design Archive",
    featured: false
  },
  {
    id: "gangan-talking-drum",
    accessionNumber: "ACC.1895.12.01",
    title: "The Yoruba Gangan: Acoustic Telecommunication",
    subtitle: "The Tonal Physics and Lineage Poetry of the Pressure Drum",
    period: "precolonial",
    periodLabel: "Before Colonial Rule (c. 1200–1897)",
    category: "sound",
    categoryLabel: "The Sound Archive",
    dateDisplay: "14th Century – Present",
    location: "Oyo, Osun & Kwara States",
    summary: "Constructed from hollowed mahogany wrapped in leather tension strings, the Gangan reproduces the three tonal pitches and phonetics of the Yoruba language, functioning for centuries as long-distance acoustic messaging.",
    fullNarrative: [
      "Centuries before the telegraph or wireless radio was conceived, Yoruba communities in southwestern Nigeria developed a sophisticated acoustic telecommunication system embodied in the gangan—the hourglass-shaped talking drum.",
      "Because the Yoruba language is tonal (utilizing three relative pitches: do, re, mi), a master drummer of the hereditary Ayan lineage can squeeze the leather tuning cords (osan) beneath their left arm while striking the goat-skin membrane with a curved wooden stick (kongo). By varying the tension in real time, the drum produces precise pitch glides, microtonal nuances, and consonant phonetics.",
      "In palace courts, the gangan welcomed dignitaries by reciting their full ancestral praises (oriki); on battlefields, it broadcast tactical troop movements across river valleys; and in public festivals, it engaged in spontaneous philosophical debates that the entire community could understand word for word."
    ],
    keyFigures: ["Ayan Agalu (Patron Spirit of Drummers)", "The Ayan Lineage Master Drummers of Oyo and Osogbo"],
    medium: "Carved Cordia millenii wood, cured membrane, rawhide tension cords",
    dimensions: "Length: 48 cm; Drumhead Diameter: 18 cm",
    provenance: "Oyo Royal Palace Collection; studied in ethnomusicological archives at University of Ibadan.",
    curatorNotes: "The gangan is one of humanity's earliest sonic technologies of data transmission, converting linguistic syntax directly into acoustic resonance.",
    quote: {
      text: "A drum is not struck with violence; it is persuaded with understanding. The skin remembers every king who ever walked the earth.",
      speaker: "Alayan of Oyo",
      year: "Palace Protocol Record, 1962"
    },
    image: "/src/assets/images/sound_archive_session_1792138904421.jpg",
    imageAlt: "Archival recording photograph featuring the gangan talking drum alongside brass instruments in a vintage Lagos studio",
    imageCredit: "Ethnomusicology Archive / National Sound Heritage of Nigeria",
    featured: false
  },
  {
    id: "hausa-tubali-architecture",
    accessionNumber: "ACC.1880.03.15",
    title: "Hausa Tubali Architecture & The Vaults of Zaria",
    subtitle: "Master Mason Babban Gwani and the Ribbed Mud Cathedrals",
    period: "nineteenth",
    periodLabel: "19th Century (1800–1899)",
    category: "art",
    categoryLabel: "Art & Architecture",
    dateDisplay: "c. 1820–1910",
    location: "Zaria & Kano, Northern Nigeria",
    summary: "Using sun-baked conical mud bricks (tubali) and deku palm timber, Hausa master builders engineered soaring vaulted ceilings and embossed arabesque facades that kept desert interiors cool for generations.",
    fullNarrative: [
      "In the early 19th century in the ancient city of Zaria (Zazzau), a legendary master builder named Muhammadu Durugu—revered by the royal title 'Babban Gwani' (The Great Master)—revolutionized sub-Saharan African architecture.",
      "Using sun-dried conical clay bricks known as tubali, bound with a mortar mixed with cow dung, horsehair, and a waterproofing decoction of locust-bean tree pods (makuba), Babban Gwani engineered soaring ribbed domes and interlocking corbelled arches (bakan gizo) that spanned cavernous mosque and palace halls without central supporting pillars.",
      "The exterior walls of these compounds were hand-carved with elaborate embossed geometric reliefs (dagi) depicting Islamic calligraphy, northern flora, and protective charms. Built in harmony with the extreme Sahelian climate, these earthen structures maintained natural thermal equilibrium, remaining remarkably cool in the scorching noon sun."
    ],
    keyFigures: ["Muhammadu Durugu ('Babban Gwani')", "The Guild of Sarkin Magina", "Emir of Zazzau Abdulkarim"],
    medium: "Sun-dried tubali clay, azara palm beams, makuba natural sealant",
    dimensions: "Great Mosque Hall: Height 11.5 meters, Span 9 meters",
    provenance: "Old City of Zaria & Gidan Rumfa, Kano; documented in Federal Department of Antiquities architectural surveys.",
    curatorNotes: "Babban Gwani's engineering techniques represent one of the pinnacles of earth architecture in world civilization, prefiguring modern sustainable passive-cooling design.",
    quote: {
      text: "The mud of our land is not dirt; when mixed with the bean pod and dried in the sun, it will outlast the stone of the mountains.",
      speaker: "Sarkin Magina (Master Builder of Kano)",
      year: "Oral History Survey, 1928"
    },
    image: "/src/assets/images/hero_archival_portrait_1792138903067.jpg",
    imageAlt: "Archival portrait honoring the lineage of Nigerian master builders and indigenous architectural knowledge keepers",
    imageCredit: "Federal Department of Antiquities Survey / Monument Conservation Archives",
    featured: false
  },
  {
    id: "nok-terracotta-sculpture",
    accessionNumber: "ACC.0500.BCE.01",
    title: "The Nok Terracotta Sculptures: Africa's Earliest Figural Clay Masters",
    subtitle: "Sub-Saharan Africa's Oldest Known Sculptural Tradition (c. 500 BCE)",
    period: "precolonial",
    periodLabel: "Before Colonial Rule (c. 500 BCE – 200 CE)",
    category: "art",
    categoryLabel: "Art & Architecture",
    dateDisplay: "c. 500 BCE – 200 CE",
    location: "Ham (Jaba) Territory, Kaduna State",
    summary: "Discovered accidentally during tin-mining operations along the Jos Plateau, the Nok terracottas represent the earliest monumental figurative clay sculptures known in sub-Saharan Africa, characterized by pierced triangular eyes, flared nostrils, and elaborate braided coiffures.",
    fullNarrative: [
      "In 1928, near the village of Nok in southern Kaduna State, a tin-miner uncovered a terracotta head buried beneath twenty feet of alluvial gravel. Further excavations revealed a vast, sophisticated Iron Age civilization that flourished between 500 BCE and 200 CE—at least a millennium before the classical kingdoms of Ife and Benin.",
      "The Nok artists were master sculptors who understood clay chemistry, temper additives, and controlled pyrotechnology. They constructed hollow earthenware figures, some nearly life-sized, with walls of uniform thickness to prevent fracturing during bonfire firing.",
      "The aesthetic hallmarks of Nok sculpture—perforated almond-shaped eyes, arched eyebrows, flared nostrils, and remarkably intricate braided and tiered hairstyles—signified social rank, priestly authority, and ancestral reverence. Today, digitized in high resolution through Google Arts & Culture and national museum collections, these masterworks prove that sub-Saharan Africa possessed advanced sculptural schools contemporaneously with Classical Greece and the Nok Iron Age."
    ],
    keyFigures: ["Nok Iron Age Master Sculptors", "Bernard Fagg (Early Archaeologist)", "National Museum Jos Curators"],
    medium: "Low-fire iron-rich earthenware terracotta, hollow slab-building technique",
    dimensions: "Height: 38 cm, Width: 22 cm, Depth: 24 cm",
    provenance: "Nok Valley, Kaduna State; conserved at the National Museum Jos & National Museum Lagos; catalogued in Google Arts & Culture Nigerian Heritage Initiative.",
    curatorNotes: "Nok terracotta sculptures represent the foundational ancestor of West African figural art. The piercing of pupils, nostrils, and ear canals served both an aesthetic purpose and allowed hot air to escape safely during the firing process.",
    quote: {
      text: "The Nok sculptures are not primitive experiments. They are the climax of an already ancient and refined artistic civilization.",
      speaker: "Ekpo Eyo (Director of Antiquities of Nigeria)",
      year: "Two Thousand Years of Nigerian Art, 1977"
    },
    image: "/src/assets/images/google_arts_nok_terracotta_1792143380027.jpg",
    imageAlt: "Museum archival photograph of an ancient Nok culture terracotta head sculpture with pierced triangular eyes and braided coiffure",
    imageCredit: "Google Arts & Culture Partner Record / National Commission for Museums & Monuments Nigeria",
    featured: false
  },
  {
    id: "lagos-marina-waterfront-1920",
    accessionNumber: "ACC.1924.06.18",
    title: "Lagos Marina Waterfront & The Interwar Maritime Trade",
    subtitle: "Lagoon Canoe Freighters, Merchant Houses, and Coastal Photography",
    period: "colonial",
    periodLabel: "Colonial Period (1900–1959)",
    category: "photography",
    categoryLabel: "The Image Archive",
    dateDisplay: "c. 1920–1928",
    location: "Lagos Marina Waterfront, Lagos Island",
    summary: "Rare vintage silver gelatin print capturing the thriving commercial heartbeat of the Lagos Marina in the 1920s: wooden freight canoes unloading agricultural wealth, European trading houses, and bustling Nigerian traders on Broad Street.",
    fullNarrative: [
      "In the 1920s, the Lagos Marina was the dynamic meeting ground between the Atlantic ocean and the vast inland lagoon network of southern Nigeria. Hundreds of wooden cargo canoes, hand-carved from single mahogany and iroko trunks, glided across the waters from Epe, Ikorodu, and Porto-Novo to berth directly at the Marina seawall.",
      "Lining the waterfront stood the two-storey trading houses of John Holt, African Trading Co., and G.B. Ollivant, punctuated by the elegant Sobrado mansions built by Aguda (Afro-Brazilian repatriates from Bahia). Nigerian merchant women in woven wrappers and head-ties negotiated produce consignments alongside maritime clerks in white linen.",
      "This vintage monochrome photograph, preserved in fragile silver gelatin emulsion, provides an irreplaceable historical window into urban commercial life before modern concrete port terminals replaced the intimate canoe trade."
    ],
    keyFigures: ["Lagos Port Canoe Guildmen", "Madam Alimotu Pelewura (Market Leader)", "Lagos Harbour Master"],
    medium: "Silver gelatin monochrome contact print on postcard stock",
    dimensions: "Archival Folio: 24 × 18 cm",
    provenance: "Nigerian National Archives, Lagos Branch; photographic survey digitized in collaboration with Google Arts & Culture Historical Urban Collections.",
    curatorNotes: "The Marina was both the gateway of colonial commerce and the staging ground for Lagos' early political mobilizations, where dockworkers and market unions organized historic protests.",
    quote: {
      text: "Every morning the canoes brought the food of the hinterland to the island. You could smell palm oil, smoked bonga fish, and river breeze mingling with salt air.",
      speaker: "Broad Street Elder Chronicle",
      year: "Lagos Historical Society Records"
    },
    image: "/src/assets/images/google_arts_lagos_marina_1920_1792143381164.jpg",
    imageAlt: "Archival vintage monochrome photograph of Lagos Marina waterfront in the 1920s showing wooden cargo boats, merchant houses, and traders",
    imageCredit: "Google Arts & Culture Partner Record / Nigerian National Archives",
    featured: false
  },
  {
    id: "festac-77-african-renaissance",
    accessionNumber: "ACC.1977.01.15",
    title: "FESTAC '77: The Second World Black & African Festival of Arts",
    subtitle: "56 Nations, 16,000 Artists, and the Grand Assembly of Pan-African Memory",
    period: "postindependence",
    periodLabel: "Post-Independence (1970–1985)",
    category: "style",
    categoryLabel: "The Style Archive",
    dateDisplay: "January 15 – February 12, 1977",
    location: "National Stadium & National Theatre, Lagos",
    summary: "From January 15 to February 12, 1977, Lagos became the cultural capital of the Black world as 16,000 artists, writers, musicians, and thinkers from 56 nations gathered for FESTAC '77—the largest Pan-African cultural summit in human history.",
    fullNarrative: [
      "On January 15, 1977, under glorious tropical skies at the National Stadium in Surulere, Lagos, a flame was lit to inaugurate FESTAC '77. Over 16,000 participants from 56 countries and liberation movements across Africa, the Caribbean, the Americas, and Europe paraded in traditional regalia, ceremonial masks, and woven sovereign textiles.",
      "The official emblem of the festival was the 16th-century royal ivory pectoral mask of Queen Mother Idia of the Kingdom of Benin. When the British Museum refused to return or even lend the original ivory mask to Nigeria for the festival, master Nigerian carvers of the Igun guild produced an exquisite replica that became a worldwide symbol of cultural reclamation.",
      "For a full month, audiences witnessed historic performances: Stevie Wonder, Miriam Makeba, Sun Ra, Gilberto Gil, Franco Luambo, and King Sunny Ade performed on grand stages. Colocated colloquiums debated the philosophy of Black civilization, establishing African arts not as remnants of an ancient past, but as living forces charting the future of humanity."
    ],
    keyFigures: ["Commander O.P. Fingesi (Festival President)", "Queen Mother Idia Emblem Carvers", "Miriam Makeba", "Stevie Wonder"],
    medium: "Color and 35mm monochrome photojournalistic prints, woven ceremonial regalia, audio reel recordings",
    dimensions: "Archival Commemorative Dossier: 45 × 32 cm",
    provenance: "Centre for Black and African Arts and Civilization (CBAAC), Lagos; Google Arts & Culture Pan-African Heritage Archive.",
    curatorNotes: "FESTAC '77 remains the largest gathering of Black and African creative thinkers ever mounted on the African continent, proving the unifying power of shared cultural heritage.",
    quote: {
      text: "FESTAC was not just a festival; it was a cosmic family reunion. We looked across the stadium and saw ourselves reflected in thousands of ways.",
      speaker: "Ambassador Dudley Thompson",
      year: "FESTAC '77 Plenary Address, Lagos"
    },
    image: "/src/assets/images/google_arts_festac_77_1792143381142.jpg",
    imageAlt: "Archival documentary photograph of the 1977 FESTAC festival opening procession in Lagos Nigeria with traditional royal dancers and masquerades",
    imageCredit: "Google Arts & Culture Partner Record / Centre for Black and African Arts & Civilization",
    featured: false
  }
];

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: "precolonial",
    label: "Era 01",
    periodLabel: "Before Colonial Rule",
    dateRange: "Before 1880",
    title: "Sovereign Kingdoms, Indigenous Guilds & Metallurgical Mastery",
    description: "Diverse artistic civilizations—from ancient Nok terracotta sculptors to the bronze guilds of Benin and the master builders of Kano—flourished with independent cosmologies, trade routes, and sophisticated craft guilds.",
    highlights: [
      "The lost-wax brass and bronze casting guild of Igun Eronmwon in Benin City",
      "The terracotta and iron-smelting traditions of Nok (c. 500 BCE – 200 CE)",
      "The intricate cast bronze regalia of Igbo-Ukwu (9th century CE)",
      "The indigo dye pits of Kofar Mata in Kano, operational since 1498"
    ],
    featuredArtifact: "ACC.1520.08.02"
  },
  {
    id: "nineteenth",
    label: "Era 02",
    periodLabel: "19th Century Transformations",
    dateRange: "1800–1899",
    title: "Changing Trade, Saro Returnees & The Arrival of the Camera",
    description: "A century of seismic reorganization: returnees from Brazil, Cuba, and Sierra Leone brought Afro-Brazilian architectural motifs to Lagos; early daguerreotypes arrived; and coastal print culture began to take root.",
    highlights: [
      "Introduction of studio photography in Lagos by pioneer African photographers",
      "Afro-Brazilian two-storey stucco architecture (Sobrado) across Lagos Island",
      "Expansion of Adire indigo resist techniques in Abeokuta and Ibadan",
      "Founding of the earliest indigenous printing presses in Calabar and Lagos"
    ],
    featuredArtifact: "ACC.1880.03.15"
  },
  {
    id: "colonial",
    label: "Era 03",
    periodLabel: "Colonial Period & Modern Awakening",
    dateRange: "1900–1959",
    title: "Print Resistance, The Zaria Rebels & The Birth of Highlife",
    description: "In the shadow of British colonial governance, Nigerians forged radical new mediums: fearless broadsheet newspapers mobilized anti-colonial resistance, highlife ballroom orchestras united cities, and ten students in Zaria declared an artistic revolution.",
    highlights: [
      "Dr. Nnamdi Azikiwe's West African Pilot transforms anticolonial mobilization (1937)",
      "The Zaria Art Society proclaims the doctrine of 'Natural Synthesis' (1958)",
      "Adire Eleko guilds formalize trade patterns as wearable public discourse",
      "Early highlife recordings on Philips West Africa and Decca 78 RPM shellac"
    ],
    featuredArtifact: "ACC.1958.09.14"
  },
  {
    id: "independence",
    label: "Era 04",
    periodLabel: "The Independence Decade",
    dateRange: "1960–1969",
    title: "Sovereign Imagination, Mbari Ibadan & The Golden Age of Sound",
    description: "October 1, 1960 unleashed an explosion of national optimism. Writers, artists, dramatists, and musicians gathered at Mbari Club in Ibadan and the cabarets of Lagos to define what modern African sovereignty looked, felt, and sounded like.",
    highlights: [
      "The founding of the Mbari Artists and Writers Club in Ibadan (1961)",
      "Victor Olaiya, Rex Lawson, and Bobby Benson dominate Lagos dancehalls",
      "Emergence of sovereign postage stamps, currency, and national design graphics",
      "Proliferation of photo studios capturing a confident, stylish generation"
    ],
    featuredArtifact: "ACC.1960.10.01"
  },
  {
    id: "postindependence",
    label: "Era 05",
    periodLabel: "Post-Independence Decades",
    dateRange: "1970–1985",
    title: "Afrobeat, Kalakuta Graphics, FESTAC '77 & Ojeikere's Camera",
    description: "Amidst political friction and military rule, popular culture became the battleground for pan-African liberation. Fela Kuti created Afrobeat; Lemi Ghariokwu hand-painted revolutionary album covers; and J.D. 'Okhai Ojeikere systematically catalogued Nigerian hair as architectural heritage.",
    highlights: [
      "Lemi Ghariokwu paints 26 iconic album sleeves for Fela Anikulapo-Kuti",
      "J.D. 'Okhai Ojeikere's monumental Hairstyles square-format photography series",
      "FESTAC '77 brings 16,000 artists from 56 nations to Lagos and Kaduna",
      "Cassette culture democratizes grassroots music production across regional centers"
    ],
    featuredArtifact: "ACC.1970.05.20"
  }
];

export const FRAGMENTS_OF_MEMORY: MemoryFragment[] = [
  {
    id: "frag-01",
    accessionRef: "FRAG.1944.NEWS.01",
    title: "The West African Pilot Front Page Lead Proof",
    date: "November 18, 1944",
    location: "Lagos, Nigeria",
    artifactType: "Letterpress Newsprint Proof",
    curatorAnnotation: "Proof sheet for lead story: 'Lagos Independence Rally: Crowds Call for Home Rule'. Hand-annotated in red grease pencil with typesetting corrections.",
    snippet: "Crowds gathered at the Racecourse, Lagos... Nnamdi Azikiwe addressed over 12,000 citizens demanding direct representation.",
    fullTranscript: "LAGOS INDEPENDENCE RALLY: CROWDS CALL FOR HOME RULE\n\nMassive Gathering Adds Voices to National Demand — Dr. Azikiwe Speaks to Thousands.\n\nYESTERDAY, thousands gathered at the Racecourse, Lagos, in a powerful demonstration convened by the Nigerian National Democratic Party and national youth leaders. Dr. Azikiwe asserted that the era of foreign paternalism was over and that Nigeria must prepare her own sons and daughters for governance. The crowd answered with thunderous applause that shook the colonial secretariat across the green.",
    physicalNotes: "Rag newsprint with rough deckle edge, faded carbon ink, light foxing at margins. 42 × 30 cm.",
    repository: "National Archives of Nigeria, Ibadan Branch, Record Group PR/PILOT/1944."
  },
  {
    id: "frag-02",
    accessionRef: "FRAG.1961.LIT.02",
    title: "Mbari Club Ibadan Inaugural Chapbook Draft",
    date: "October 1961",
    location: "Dugbe, Ibadan",
    artifactType: "Manuscript with Linocut Cover",
    curatorAnnotation: "Original printer's proof of Christopher Okigbo's 'Heavensgate' opening stanzas, accompanied by linocut vignettes by Bruce Onobrakpeya.",
    snippet: "Before you, mother Idoto, / naked I stand; / before your watery presence, / a prodigal...",
    fullTranscript: "HEAVENSGATE — INAUGURAL PROOF\n\nBefore you, mother Idoto,\nnaked I stand;\nbefore your watery presence,\na prodigal\n\nleaning on an oilbean,\nlost in your legend...\n\n[Handwritten marginal note by Christopher Okigbo]: 'Set this in 11pt Baskerville with 3-line initial drop cap. Keep the linocut flush with bottom margin — C.O.'",
    physicalNotes: "Handmade laid paper, black printer's ink with graphite annotations. 22 × 15 cm.",
    repository: "Mbari Club Papers, Special Collections, Kenneth Dike Library, University of Ibadan."
  },
  {
    id: "frag-03",
    accessionRef: "FRAG.1956.SND.03",
    title: "Decca West Africa 78 RPM Recording Log Sheet",
    date: "August 14, 1956",
    location: "EMI Studio, Apapa, Lagos",
    artifactType: "Recording Session Studio Log",
    curatorAnnotation: "Sound engineer's log for Dr. Victor Olaiya's Cool Cats session. Details acoustic microphone placement for the gangan pressure drum and tenor saxophone.",
    snippet: "Take 3 approved for master lacquer cut. Talking drum level balanced to prevent needle skip on shellac.",
    fullTranscript: "DECCA WEST AFRICA RECORDING LOG\nDate: 14 Aug 1956 | Studio: Apapa Studio B | Engineer: D. Hargreaves\n\nArtist: Victor Olaiya & His Cool Cats\nTrack: 'Omopupa' (Matrix: WAC 6140-2)\nInstrumentation: 2 Trumpets, 1 Tenor Sax, 1 Acoustic Upright Bass, 1 Gangan (Talking Drum), 2 Maracas, Rhythm Guitar.\n\nNotes: Talking drum requires single ribbon mic positioned 3 feet off axis. High frequencies boosted +2dB at 4kHz. Master cut approved at 78 RPM.",
    physicalNotes: "Typed carbon copy on blue manifold paper with studio stamps. 28 × 21 cm.",
    repository: "Decca West Africa Heritage Archive / Private Sound Documentation Trust, Lagos."
  },
  {
    id: "frag-04",
    accessionRef: "FRAG.1938.TEX.04",
    title: "Abeokuta Indigo Dyer's Pattern Grid Note",
    date: "c. March 1938",
    location: "Kemta Quarter, Abeokuta",
    artifactType: "Artisan Recipe & Stencil Guide",
    curatorAnnotation: "Notebook page kept by Madam Jojolola detailing fermentation timings for Lonchocarpus cyanescens (elu) and cassava starch proportion.",
    snippet: "Four measures of sun-dried lafun starch, boiled until translucent. Test with palm leaf before dipping cloth.",
    fullTranscript: "MEMORANDUM OF THE DYEING PIT (Kemta Guild)\n\n1. Use rain water from the clay cistern, not well water which hardens the indigo.\n2. Three baskets of fresh elu leaves pounded in stone mortar.\n3. Add ash-water (omi aro) from the burnt cocoa pods until the liquor tastes pungent on the tongue.\n4. Starch resist: Cook lafun slow over embers. If too thick, lines will crack; if too thin, indigo will bleed across the white borders.\n\nPattern: 'Ibadandun' (The city with hills like sea waves).",
    physicalNotes: "Aged ruled paper bound with linen thread; indigo smudges and finger marks. 20 × 16 cm.",
    repository: "Egba Traditional Crafts Guild Documentation, Abeokuta Heritage Center."
  },
  {
    id: "frag-05",
    accessionRef: "FRAG.1958.ART.05",
    title: "Zaria Art Society Manifesto (First Mimeograph)",
    date: "October 1958",
    location: "Zaria, Northern Nigeria",
    artifactType: "Mimeographed Leaflet with Sketches",
    curatorAnnotation: "Foundational manifesto distributed to students at Nigerian College of Arts. Inscribed with Uche Okeke's original ink sketch combining Uli symbols with modern line.",
    snippet: "We are not Europeans; our ancestors were great masters. We shall take the modern tools and speak our own tongue.",
    fullTranscript: "TO ALL ART STUDENTS AT ZARIA\n\nWe must not merely repeat what our teachers from London teach us. Perspective and shading are useful tools, but they cannot express our spirit.\n\nOur mothers drew Uli on clay walls. Our fathers cast bronze in Benin and shaped terracotta in Nok. That is our fountain. We call for NATURAL SYNTHESIS: take what the world has discovered and graft it onto the living tree of Africa.\n\n[Signed]: Uche Okeke, Demas Nwoko, Bruce Onobrakpeya, Simon Okeke, Yusuf Grillo.",
    physicalNotes: "Mimeograph ink on foolscap paper; hand-inked margin drawings. 33 × 20 cm.",
    repository: "Asele Institute Archives, Nimo, Anambra State / CCA Lagos Reference."
  }
];

export const ARCHIVE_COLLECTIONS: ArchiveCollection[] = [
  {
    id: "photography",
    number: "01",
    name: "The Image Archive",
    tagline: "Light, Silver Gelatin & The Living Presence",
    description: "From 19th-century colonial daguerreotypes to 1960s independence portrait studios and J.D. 'Okhai Ojeikere's architectural taxonomies of hair, exploring the camera as an instrument of African self-fashioning.",
    count: "482 Records",
    eraCoverage: "1880–1990",
    image: "/src/assets/images/hero_archival_portrait_1792138903067.jpg",
    aspect: "Studio portraits, street views of Lagos & Ibadan, architectural documentation"
  },
  {
    id: "sound",
    number: "02",
    name: "The Sound Archive",
    tagline: "Resonant Vinyl, Sacred Drums & Acoustic Freedom",
    description: "The tonal linguistics of the Yoruba Gangan, the midnight brass swing of Lagos Highlife, and the politically subversive polyrhythms of Afrobeat and Juju.",
    count: "610 Recordings",
    eraCoverage: "1920–1985",
    image: "/src/assets/images/sound_archive_session_1792138904421.jpg",
    aspect: "78 RPM shellac, 1/4-inch studio master tapes, talking drum oral chronicles"
  },
  {
    id: "style",
    number: "03",
    name: "The Style Archive",
    tagline: "Sacred Indigo, Woven Aso-Oke & Wearable Literature",
    description: "The cassava starch resist cosmologies of Adire Eleko, the regal strip-weaving of Yoruba Aso-Oke, Igbo Akwete loom traditions, and the tailored modernism of independence Lagos.",
    count: "340 Artifacts",
    eraCoverage: "1850–1980",
    image: "/src/assets/images/style_archive_textile_1792138906120.jpg",
    aspect: "Indigo resist textiles, ceremonial looms, beaded crowns, urban fashion records"
  },
  {
    id: "print",
    number: "04",
    name: "The Printed Archive",
    tagline: "Anticolonial Broadsheets, Linocut Chapbooks & Posters",
    description: "The thunderous typography of the West African Pilot, the pioneering chapbooks of Mbari Club Ibadan, Onitsha Market pamphlets, and Lemi Ghariokwu's hand-painted album sleeves.",
    count: "525 Documents",
    eraCoverage: "1930–1985",
    image: "/src/assets/images/print_archive_press_1792138905450.jpg",
    aspect: "Newspaper broadsheets, literary chapbooks, political posters, album sleeves"
  }
];

export interface HistoricalGooglePreset {
  id: string;
  name: string;
  sourceLabel: string;
  year: string;
  era: 'precolonial' | 'nineteenth' | 'colonial' | 'independence' | 'postindependence';
  medium: string;
  location: string;
  image: string;
  caption: string;
  provenance: string;
}

export const HISTORICAL_GOOGLE_PRESETS: HistoricalGooglePreset[] = [
  {
    id: "preset-benin-bronze",
    name: "Royal Benin Bronze Head of an Oba",
    sourceLabel: "Google Arts & Culture / National Commission for Museums & Monuments Nigeria",
    year: "c. 16th Century",
    era: "precolonial",
    medium: "Cast bronze alloy, lost-wax technique",
    location: "Benin City, Edo Kingdom",
    image: "/src/assets/images/google_arts_benin_bronze_1792143380461.jpg",
    caption: "Royal commemorative head of an Oba with high beaded collar (odigba-ileke) and beaded crown",
    provenance: "Kingdom of Benin Royal Court; documented in Google Arts & Culture Nigerian Heritage Initiative"
  },
  {
    id: "preset-nok-terracotta",
    name: "Ancient Nok Terracotta Head Sculpture",
    sourceLabel: "Google Arts & Culture / National Museum Jos",
    year: "c. 500 BCE",
    era: "precolonial",
    medium: "Low-fire iron-rich terracotta",
    location: "Nok Valley, Kaduna State",
    image: "/src/assets/images/google_arts_nok_terracotta_1792143380027.jpg",
    caption: "Earliest figurative sculpture of sub-Saharan Africa with pierced triangular eyes and tiered coiffure",
    provenance: "Nok Iron Age site; conserved at National Museum Jos; digitised via Google Arts & Culture"
  },
  {
    id: "preset-lagos-marina-1920",
    name: "Lagos Marina Waterfront & Canoe Freighters",
    sourceLabel: "Google Historical Archive / Nigerian National Archives",
    year: "c. 1920s",
    era: "colonial",
    medium: "Monochrome silver gelatin photograph",
    location: "Lagos Island, Nigeria",
    image: "/src/assets/images/google_arts_lagos_marina_1920_1792143381164.jpg",
    caption: "Hand-carved wooden freight canoes berthed along the Lagos Marina commercial trading row",
    provenance: "Lagos Port Survey Records; digitised in collaboration with Google Arts & Culture Urban Archives"
  },
  {
    id: "preset-festac-77",
    name: "FESTAC '77 Opening Pan-African Assembly",
    sourceLabel: "Google Arts & Culture / CBAAC Pan-African Archive",
    year: "1977",
    era: "postindependence",
    medium: "35mm documentary archival photograph",
    location: "National Stadium, Lagos",
    image: "/src/assets/images/google_arts_festac_77_1792143381142.jpg",
    caption: "Traditional rulers and masqueraders at the opening ceremony of FESTAC '77 in Lagos",
    provenance: "Centre for Black and African Arts and Civilization; digitised for Google Arts & Culture"
  }
];

