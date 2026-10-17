export type Transmission = "Manual" | "Automatic";
export type Fuel = "Petrol" | "Diesel" | "CNG" | "Electric";
export type BodyStyle = "Sedan" | "Hatchback" | "SUV" | "Coupe" | "Convertible";

export type Bid = { user: string; amount: number; minutesAgo: number };
export type Comment = {
  id: string;
  user: string;
  text: string;
  minutesAgo: number;
  likes: number;
  isSeller?: boolean;
  isQuestion?: boolean;
  reply?: { user: string; text: string };
};

export type Auction = {
  id: string;
  year: number;
  make: string;
  model: string;
  title: string;
  subtitle: string;
  images: string[];
  city: string;
  state: string;
  rto: string;
  kms: number;
  owners: number;
  fuel: Fuel;
  transmission: Transmission;
  drivetrain: string;
  bodyStyle: BodyStyle;
  engine: string;
  exteriorColor: string;
  interiorColor: string;
  insurance: string;
  sellerType: "Private Party" | "Dealer";
  seller: { name: string; username: string; memberSince: string };
  noReserve: boolean;
  inspected: boolean;
  currentBid: number;
  endsInMinutes: number;
  listedDaysAgo: number;
  watchers: number;
  ourTake: string;
  highlights: string[];
  equipment: string[];
  modifications: string[];
  knownFlaws: string[];
  service: string[];
  ownership: string;
  bids: Bid[];
  comments: Comment[];
};

const DAY = 60 * 24;

const bidders = [
  "turbo_tanmay", "evo_kid_blr", "gypsyking_hp", "ambassador_amma", "punefastlane",
  "redline_rohan", "driftnagar", "colaba_classics", "ghatroads", "nandi_runs",
  "manual_or_bust", "petrolhead_priya", "the_vtec_guy", "offroad_ojas", "zoomzoom_zara",
];

/** Generates a plausible descending bid ladder ending at `top`. */
function ladder(top: number, count: number, step: number): Bid[] {
  return Array.from({ length: count }, (_, i) => ({
    user: bidders[(i * 7 + top) % bidders.length],
    amount: top - i * step,
    minutesAgo: Math.round(i * i * 9 + i * 14 + 3),
  }));
}

export const auctions: Auction[] = [
  {
    id: "2008-mitsubishi-lancer-evolution-x",
    year: 2008,
    make: "Mitsubishi",
    model: "Lancer Evolution X",
    title: "2008 Mitsubishi Lancer Evolution X GSR",
    subtitle: "Imported 2015, 2nd owner, 5-speed manual, Recaro seats, Bengaluru registered",
    images: ["/cars/lancer_evo.jpg", "/cars/evo_rear.jpg", "/cars/evo_interior.jpg", "/cars/evo_engine.jpg"],
    city: "Bengaluru",
    state: "Karnataka",
    rto: "KA-03",
    kms: 48_200,
    owners: 2,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "All-Wheel Drive (S-AWC)",
    bodyStyle: "Sedan",
    engine: "2.0L Turbocharged I4 (4B11T)",
    exteriorColor: "Rally Red Metallic",
    interiorColor: "Black Alcantara / Leather",
    insurance: "Comprehensive, valid till Mar 2027",
    sellerType: "Private Party",
    seller: { name: "Karthik R.", username: "evo_kid_blr", memberSince: "2024" },
    noReserve: false,
    inspected: true,
    currentBid: 27_50_000,
    endsInMinutes: 3 * 60 + 12,
    listedDaysAgo: 6,
    watchers: 1_284,
    ourTake:
      "Officially imported Evo Xs are unicorns in India — fewer than a few dozen are thought to be on Indian plates, and the large majority are tuned to within an inch of their lives. This one has stayed refreshingly close to stock, with tasteful bolt-ons, a documented service trail at a known Bengaluru specialist and a clean RTO history. It's a 4B11T with a proper 5-speed manual and S-AWC, which is the configuration enthusiasts actually want. Expect spirited bidding.",
    highlights: [
      "Imported via Chennai port in 2015 with all customs and homologation paperwork included",
      "Second owner since 2019; car has been garaged in Indiranagar throughout",
      "Factory Recaro front buckets with red stitching and Brembo front brakes",
      "Timing belt, water pump and clutch replaced at 44,800 km (2025)",
      "AutoBid 200-point inspection completed — report available below",
      "Clean hypothecation status; NOC-ready for inter-state transfer",
    ],
    equipment: [
      "Super All-Wheel Control (S-AWC) with Active Centre Differential",
      "Brembo 4-piston front / 2-piston rear brakes",
      "18\" Enkei forged wheels",
      "Recaro sports seats",
      "Rockford Fosgate audio",
      "HID headlamps",
      "Keyless entry & push-button start",
    ],
    modifications: [
      "Cobb Accessport with conservative Stage 1 tune (stock map included)",
      "HKS cold-air intake",
      "Invidia catback exhaust (stock exhaust included)",
      "Michelin Pilot Sport 4S tyres (2024)",
    ],
    knownFlaws: [
      "Stone chips on the front bumper and bonnet leading edge",
      "Minor curb rash on the rear-left wheel",
      "Driver seat bolster shows light wear",
      "AC compressor serviced once; blows cold but takes a moment in peak summer",
    ],
    service: [
      "Feb 2025 — Timing belt, water pump, clutch kit, ACD fluid (44,800 km)",
      "Aug 2024 — Engine oil, transfer case & rear diff fluid",
      "Jan 2023 — Front brake pads and rotors",
      "Jun 2021 — Coolant flush, spark plugs",
    ],
    ownership:
      "Imported by the first owner in Chennai (TN-07) in 2015 and transferred to Bengaluru (KA-03) in 2019 when the current seller purchased it. All RC transfers and road-tax receipts included.",
    bids: ladder(27_50_000, 14, 50_000),
    comments: [
      {
        id: "c1",
        user: "the_vtec_guy",
        text: "This might be the cleanest Evo X I've seen on Indian roads. Any compression/leak-down numbers?",
        minutesAgo: 340,
        likes: 42,
        isQuestion: true,
        reply: { user: "evo_kid_blr", text: "Yes — leak-down was done at 44,800 km, all cylinders under 5%. Report is in the inspection PDF." },
      },
      {
        id: "c2",
        user: "redline_rohan",
        text: "Was the Accessport tune done by a dyno shop? Would love to see the sheet.",
        minutesAgo: 210,
        likes: 18,
        isQuestion: true,
        reply: { user: "evo_kid_blr", text: "Dyno-tuned at a Whitefield shop — 318 whp. Uploading the sheet tonight." },
      },
      { id: "c3", user: "ghatroads", text: "Imagine this on the Nandi Hills switchbacks at 6am. Good luck to the bidders!", minutesAgo: 95, likes: 31 },
      { id: "c4", user: "evo_kid_blr", text: "Happy to arrange in-person viewing in Indiranagar this weekend for serious bidders.", minutesAgo: 60, likes: 12, isSeller: true },
      { id: "c5", user: "petrolhead_priya", text: "Stock exhaust included is a big plus for resale. GLWS!", minutesAgo: 22, likes: 7 },
    ],
  },
  {
    id: "2004-bmw-m3-e46",
    year: 2004,
    make: "BMW",
    model: "M3",
    title: "2004 BMW M3 Coupe",
    subtitle: "S54 inline-six, 6-speed manual, Estoril Blue, Goa registered",
    images: ["/cars/bmw_m3.jpg"],
    city: "Panaji",
    state: "Goa",
    rto: "GA-01",
    kms: 72_400,
    owners: 3,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "Rear-Wheel Drive",
    bodyStyle: "Coupe",
    engine: "3.2L I6 (S54)",
    exteriorColor: "Estoril Blue",
    interiorColor: "Black Nappa Leather",
    insurance: "Comprehensive, valid till Nov 2026",
    sellerType: "Private Party",
    seller: { name: "Aaron D.", username: "colaba_classics", memberSince: "2025" },
    noReserve: false,
    inspected: true,
    currentBid: 31_25_000,
    endsInMinutes: 1 * DAY + 5 * 60,
    listedDaysAgo: 5,
    watchers: 2_041,
    ourTake:
      "The E46 M3 is arguably the high point of BMW's naturally-aspirated M cars, and a manual coupé in Estoril Blue is the spec to have. This one has had its rod bearings and VANOS addressed — the two things every E46 M3 buyer should ask about.",
    highlights: [
      "Rod bearings replaced in 2023 with OEM parts",
      "VANOS rattle fix and subframe reinforcement done",
      "Original Estoril Blue paint on roof and boot",
    ],
    equipment: ["SMG-free 6-speed manual", "Harman Kardon audio", "Heated seats", "Xenon headlights", "19\" Style 67 wheels"],
    modifications: ["Eisenmann exhaust", "Bilstein B16 coilovers"],
    knownFlaws: ["Some paint fade on front bumper", "Rear seat leather has a small crease"],
    service: ["2023 — Rod bearings, VANOS seals", "2022 — Subframe reinforcement", "2021 — Clutch and flywheel"],
    ownership: "Originally a Mumbai (MH-02) car, moved to Goa in 2020.",
    bids: ladder(31_25_000, 11, 75_000),
    comments: [
      { id: "m1", user: "manual_or_bust", text: "S54 with fresh rod bearings. This is the one.", minutesAgo: 120, likes: 25 },
    ],
  },
  {
    id: "1998-maruti-gypsy-king",
    year: 1998,
    make: "Maruti Suzuki",
    model: "Gypsy King",
    title: "1998 Maruti Suzuki Gypsy King 4x4",
    subtitle: "Soft-top, ex-Himachal, fresh 1.3L rebuild, winch & roof rack",
    images: ["/cars/gypsy.jpg"],
    city: "Manali",
    state: "Himachal Pradesh",
    rto: "HP-01",
    kms: 1_42_000,
    owners: 4,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "Four-Wheel Drive (Low range)",
    bodyStyle: "SUV",
    engine: "1.3L G13BB I4",
    exteriorColor: "Superior White",
    interiorColor: "Black Vinyl",
    insurance: "Third-party, valid till Jun 2026",
    sellerType: "Private Party",
    seller: { name: "Tenzin N.", username: "gypsyking_hp", memberSince: "2025" },
    noReserve: true,
    inspected: true,
    currentBid: 4_85_000,
    endsInMinutes: 47,
    listedDaysAgo: 7,
    watchers: 3_302,
    ourTake:
      "The Gypsy is India's original cult 4x4 and prices only go one way. This mountain-spec example comes with a freshly rebuilt engine and a sensible set of trail upgrades. No reserve — it's selling.",
    highlights: ["Engine rebuilt in 2025", "Warn winch and steel bumper", "New canvas soft-top"],
    equipment: ["Low-range transfer case", "Manual free-wheeling hubs", "Roof rack"],
    modifications: ["Warn VR8 winch", "LED auxiliary lights", "Raised suspension (+1.5\")"],
    knownFlaws: ["Surface rust on chassis rails (treated)", "Speedometer cable intermittent"],
    service: ["2025 — Engine rebuild, new clutch", "2024 — Leaf springs replaced"],
    ownership: "Spent its whole life in Himachal Pradesh.",
    bids: ladder(4_85_000, 22, 10_000),
    comments: [
      { id: "g1", user: "offroad_ojas", text: "No reserve Gypsy with a fresh rebuild? Someone's getting a deal.", minutesAgo: 40, likes: 51 },
    ],
  },
  {
    id: "1994-hindustan-ambassador-nova",
    year: 1994,
    make: "Hindustan",
    model: "Ambassador Nova",
    title: "1994 Hindustan Ambassador Nova",
    subtitle: "Restored 2023, column shift, bench seats, Kolkata registered",
    images: ["/cars/ambassador.jpg"],
    city: "Kolkata",
    state: "West Bengal",
    rto: "WB-02",
    kms: 88_600,
    owners: 3,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "Rear-Wheel Drive",
    bodyStyle: "Sedan",
    engine: "1.5L I4",
    exteriorColor: "Dove White",
    interiorColor: "Maroon Vinyl",
    insurance: "Comprehensive, valid till Jan 2027",
    sellerType: "Dealer",
    seller: { name: "Calcutta Classic Motors", username: "ambassador_amma", memberSince: "2024" },
    noReserve: true,
    inspected: false,
    currentBid: 3_10_000,
    endsInMinutes: 2 * DAY + 3 * 60,
    listedDaysAgo: 3,
    watchers: 1_876,
    ourTake: "The king of Indian roads, restored the right way — original chrome re-plated, period-correct interior and a meticulously documented rebuild.",
    highlights: ["Nut-and-bolt restoration (2023)", "Original chrome re-plated", "Vintage registration retained"],
    equipment: ["Column-mounted shifter", "Front bench seat", "AM radio (restored)"],
    modifications: ["Electronic ignition", "Upgraded halogen headlamps"],
    knownFlaws: ["Small paint bubble near rear wheel arch"],
    service: ["2023 — Full restoration", "2024 — Carburettor tune"],
    ownership: "Three owners, all in Kolkata.",
    bids: ladder(3_10_000, 9, 10_000),
    comments: [],
  },
  {
    id: "2022-mahindra-thar-lx",
    year: 2022,
    make: "Mahindra",
    model: "Thar LX",
    title: "2022 Mahindra Thar LX 4x4",
    subtitle: "2.2L mHawk diesel, manual, hard top, single owner, Jaipur",
    images: ["/cars/thar.jpg"],
    city: "Jaipur",
    state: "Rajasthan",
    rto: "RJ-14",
    kms: 21_300,
    owners: 1,
    fuel: "Diesel",
    transmission: "Manual",
    drivetrain: "Four-Wheel Drive",
    bodyStyle: "SUV",
    engine: "2.2L Turbo-Diesel I4 (mHawk)",
    exteriorColor: "Galaxy Grey",
    interiorColor: "Black",
    insurance: "Zero-dep, valid till Aug 2026",
    sellerType: "Private Party",
    seller: { name: "Vikram S.", username: "driftnagar", memberSince: "2025" },
    noReserve: false,
    inspected: true,
    currentBid: 13_40_000,
    endsInMinutes: 4 * DAY + 2 * 60,
    listedDaysAgo: 1,
    watchers: 912,
    ourTake: "A lightly used, single-owner Thar with the desirable diesel-manual combo — and none of the waiting period.",
    highlights: ["Single owner", "Manufacturer warranty till 2027", "Never off-roaded beyond light trails"],
    equipment: ["Touchscreen with Android Auto", "Cruise control", "Mechanical locking rear diff"],
    modifications: ["Ceat CZAR all-terrain tyres"],
    knownFlaws: ["Minor scratch on rear bumper"],
    service: ["2025 — 20,000 km service at authorised dealer"],
    ownership: "One owner since new.",
    bids: ladder(13_40_000, 6, 20_000),
    comments: [],
  },
  {
    id: "2021-skoda-octavia-vrs",
    year: 2021,
    make: "Skoda",
    model: "Octavia vRS",
    title: "2021 Skoda Octavia vRS 245",
    subtitle: "Limited allocation, 2.0 TSI, DSG, Mamba Green, Pune",
    images: ["/cars/octavia_vrs.jpg"],
    city: "Pune",
    state: "Maharashtra",
    rto: "MH-12",
    kms: 29_800,
    owners: 1,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "Front-Wheel Drive",
    bodyStyle: "Sedan",
    engine: "2.0L Turbocharged I4 (EA888)",
    exteriorColor: "Mamba Green",
    interiorColor: "Black Alcantara",
    insurance: "Zero-dep, valid till Dec 2026",
    sellerType: "Private Party",
    seller: { name: "Neha K.", username: "punefastlane", memberSince: "2024" },
    noReserve: false,
    inspected: true,
    currentBid: 26_75_000,
    endsInMinutes: 6 * 60 + 40,
    listedDaysAgo: 5,
    watchers: 1_455,
    ourTake: "Only 200 vRS 245s came to India and they sold out in hours. Mamba Green is the colour to have.",
    highlights: ["One of 200 for India", "Stock and unmodified", "Extended warranty till 2026"],
    equipment: ["Virtual cockpit", "Canton audio", "Electronic front differential lock"],
    modifications: [],
    knownFlaws: ["Light swirl marks on paint"],
    service: ["All services at Skoda authorised dealer"],
    ownership: "Single owner since new.",
    bids: ladder(26_75_000, 12, 25_000),
    comments: [],
  },
  {
    id: "2019-volkswagen-polo-gt-tsi",
    year: 2019,
    make: "Volkswagen",
    model: "Polo GT TSI",
    title: "2019 Volkswagen Polo GT TSI",
    subtitle: "1.2 TSI, 7-speed DSG, Candy White, Mumbai",
    images: ["/cars/polo_gt.jpg"],
    city: "Mumbai",
    state: "Maharashtra",
    rto: "MH-02",
    kms: 41_000,
    owners: 1,
    fuel: "Petrol",
    transmission: "Automatic",
    drivetrain: "Front-Wheel Drive",
    bodyStyle: "Hatchback",
    engine: "1.2L Turbocharged I4 (TSI)",
    exteriorColor: "Candy White",
    interiorColor: "Black",
    insurance: "Comprehensive, valid till Apr 2026",
    sellerType: "Private Party",
    seller: { name: "Ishaan M.", username: "zoomzoom_zara", memberSince: "2025" },
    noReserve: true,
    inspected: true,
    currentBid: 5_60_000,
    endsInMinutes: 1 * DAY + 10 * 60,
    listedDaysAgo: 4,
    watchers: 688,
    ourTake: "The hot-hatch that started India's enthusiast scene. Clean, stock and no reserve.",
    highlights: ["DSG mechatronics replaced under warranty", "Stock ECU", "Full VW service history"],
    equipment: ["Cruise control", "Auto climate control", "Black alloys"],
    modifications: [],
    knownFlaws: ["Slight scuff on front lip"],
    service: ["2024 — DSG oil change", "2023 — Brake pads"],
    ownership: "Single owner.",
    bids: ladder(5_60_000, 15, 10_000),
    comments: [],
  },
  {
    id: "2007-honda-civic-1-8v",
    year: 2007,
    make: "Honda",
    model: "Civic",
    title: "2007 Honda Civic 1.8V",
    subtitle: "8th-gen 'spaceship' Civic, 5-speed manual, original paint, Delhi",
    images: ["/cars/civic.jpg"],
    city: "New Delhi",
    state: "Delhi",
    rto: "DL-8C",
    kms: 96_500,
    owners: 2,
    fuel: "Petrol",
    transmission: "Manual",
    drivetrain: "Front-Wheel Drive",
    bodyStyle: "Sedan",
    engine: "1.8L i-VTEC I4 (R18A)",
    exteriorColor: "Alabaster Silver",
    interiorColor: "Beige",
    insurance: "Comprehensive, valid till Sep 2026",
    sellerType: "Private Party",
    seller: { name: "Arjun P.", username: "the_vtec_guy", memberSince: "2024" },
    noReserve: true,
    inspected: false,
    currentBid: 2_15_000,
    endsInMinutes: 3 * DAY + 4 * 60,
    listedDaysAgo: 2,
    watchers: 430,
    ourTake: "The car that made a generation of Indian kids want a Honda. Note: Delhi's 15-year petrol rule — buyer must re-register outside NCR.",
    highlights: ["Original paint", "Timing chain and VTC actuator done", "NOC available for re-registration"],
    equipment: ["Digital two-tier dashboard", "Sunroof", "Alloy wheels"],
    modifications: [],
    knownFlaws: ["Dashboard rattle over bumps", "Rear bumper respray"],
    service: ["2024 — Suspension bushings", "2022 — Clutch"],
    ownership: "Two owners in Delhi.",
    bids: ladder(2_15_000, 8, 5_000),
    comments: [],
  },
  {
    id: "2012-toyota-fortuner-4x4",
    year: 2012,
    make: "Toyota",
    model: "Fortuner",
    title: "2012 Toyota Fortuner 3.0 4x4",
    subtitle: "First-gen, 3.0 D-4D, manual, Punjab registered",
    images: ["/cars/fortuner.jpg"],
    city: "Ludhiana",
    state: "Punjab",
    rto: "PB-10",
    kms: 1_68_000,
    owners: 2,
    fuel: "Diesel",
    transmission: "Manual",
    drivetrain: "Four-Wheel Drive",
    bodyStyle: "SUV",
    engine: "3.0L Turbo-Diesel I4 (1KD-FTV)",
    exteriorColor: "Black Mica",
    interiorColor: "Beige",
    insurance: "Comprehensive, valid till Jul 2026",
    sellerType: "Private Party",
    seller: { name: "Gurpreet S.", username: "nandi_runs", memberSince: "2025" },
    noReserve: false,
    inspected: true,
    currentBid: 9_20_000,
    endsInMinutes: 18 * 60,
    listedDaysAgo: 6,
    watchers: 760,
    ourTake: "The 1KD is famously unkillable. This example has the desirable manual 4x4 and a sensible service trail.",
    highlights: ["Injectors replaced 2024", "Toyota service records", "Original rims"],
    equipment: ["Low-range 4x4", "Rear AC", "7 seats"],
    modifications: ["Aftermarket infotainment"],
    knownFlaws: ["Worn driver seat bolster", "Small dent on tailgate"],
    service: ["2024 — Injectors, timing belt", "2023 — Clutch"],
    ownership: "Two owners, both in Punjab.",
    bids: ladder(9_20_000, 10, 10_000),
    comments: [],
  },
];

export const featuredAuctionId = auctions[0].id;

export function getAuction(id: string) {
  return auctions.find((a) => a.id === id);
}

export type PastResult = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  soldFor: number | null;
  bidTo?: number;
  soldOn: string;
  city: string;
  bids: number;
};

export const pastResults: PastResult[] = [
  { id: "r1", title: "2009 Mitsubishi Lancer Evolution X", subtitle: "Stock, 1 owner, Chennai", image: "/cars/lancer_evo.jpg", soldFor: 25_10_000, soldOn: "12 Oct 2026", city: "Chennai", bids: 41 },
  { id: "r2", title: "2001 Maruti Suzuki Gypsy King", subtitle: "Ex-Army, hard top", image: "/cars/gypsy.jpg", soldFor: 4_40_000, soldOn: "10 Oct 2026", city: "Dehradun", bids: 57 },
  { id: "r3", title: "2005 BMW M3 Coupe", subtitle: "SMG, Laguna Seca Blue", image: "/cars/bmw_m3.jpg", soldFor: null, bidTo: 26_50_000, soldOn: "8 Oct 2026", city: "Hyderabad", bids: 33 },
  { id: "r4", title: "2020 Skoda Octavia vRS", subtitle: "Race Blue, 245 PS", image: "/cars/octavia_vrs.jpg", soldFor: 24_80_000, soldOn: "6 Oct 2026", city: "Bengaluru", bids: 38 },
  { id: "r5", title: "1992 Hindustan Ambassador", subtitle: "Mark 4, original paint", image: "/cars/ambassador.jpg", soldFor: 2_75_000, soldOn: "3 Oct 2026", city: "Kolkata", bids: 29 },
  { id: "r6", title: "2018 Volkswagen Polo GT TSI", subtitle: "Flash Red, stock", image: "/cars/polo_gt.jpg", soldFor: 5_10_000, soldOn: "1 Oct 2026", city: "Pune", bids: 44 },
  { id: "r7", title: "2021 Mahindra Thar LX", subtitle: "Petrol AT, convertible top", image: "/cars/thar.jpg", soldFor: 12_90_000, soldOn: "28 Sep 2026", city: "Gurugram", bids: 26 },
  { id: "r8", title: "2013 Toyota Fortuner 4x4", subtitle: "3.0 D-4D manual", image: "/cars/fortuner.jpg", soldFor: 9_60_000, soldOn: "25 Sep 2026", city: "Chandigarh", bids: 31 },
];

export const states = Array.from(new Set(auctions.map((a) => a.state))).sort();
