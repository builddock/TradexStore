/* ==========================================================================
   TradexStore — shared catalogue data
   Content transcribed from the Stitch "IT Hardware E-Commerce Store" screens.
   ========================================================================== */

const IMG = 'assets/img/';

/* --------------------------------------------------------------------------
   Facet vocabularies (labels match the design's filter rail exactly)
   -------------------------------------------------------------------------- */

const FACETS = {
  tier: ['Ready to Dispatch', 'Lab Pre-Order / Batch'],
  acoustics: [
    'Linear (Cyan Lube)',
    'Tactile (Violet Bump)',
    'Silent Obsidian Dampened',
    'Magnetic Hall Effect',
    'Clicky Blue Sonic'
  ],
  form: ['60%', '65%', '75%', 'TKL 80%', '100% Full', 'ISO UK'],
  iface: [
    'Tri-Mode (2.4G / BT5.3 / Type-C)',
    'Low-Latency 2.4GHz Only',
    'Pure Detachable USB-C Wired'
  ],
  brand: [
    'Tradex Apex Lab',
    'Keychron',
    'Wooting',
    'NuPhy Studio',
    'SteelSeries',
    'Glorious PC Gaming'
  ]
};

/* --------------------------------------------------------------------------
   Catalogue — 18 units. Images are the design's own renders (512x279).
   -------------------------------------------------------------------------- */

const CATALOG = [
  {
    sku: 'KB-KCQ1-PRO',
    brand: 'Keychron',
    brandGroup: 'Keychron',
    name: 'Keychron Q1 Pro Wireless CNC',
    blurb: 'Full aluminum body, double-gasket acoustic design, factory-lubed Banana tactile switches with south-facing RGB.',
    price: 199.0,
    compareAt: null,
    img: IMG + 'product-17.png',
    alt: 'Keychron Q1 Pro fully assembled mechanical keyboard with anodized frosted silver aluminum casing.',
    flags: ['QMK/VIA CNC', 'TRI-MODE 2.4G'],
    specs: ['75% Layout', 'Hot-Swap 5-Pin', 'Krytox 205g0'],
    rating: 4.9,
    reviews: 184,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Tactile (Violet Bump)',
    form: '75%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 1
  },
  {
    sku: 'MS-LG-MX3S',
    brand: 'Logitech Workstation',
    brandGroup: 'Other',
    name: 'Logitech MX Master 3S Quiet',
    blurb: 'Electromagnetic MagSpeed wheel, Quiet Click tech, cross-computer Flow control via Logi Bolt & Bluetooth.',
    price: 99.99,
    compareAt: null,
    img: IMG + 'product-18.png',
    alt: 'Logitech MX Master 3S performance wireless mouse in matte graphite black.',
    flags: ['8K DPI SENSOR', 'QUIET CLICK'],
    specs: ['Darkfield Glass Optic', '70-Day Battery'],
    rating: 4.8,
    reviews: 512,
    stock: 'FREE 2-DAY AIR',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: 'Low-Latency 2.4GHz Only',
    weight: 2
  },
  {
    sku: 'KB-WT-60HEP',
    brand: 'Wooting Analog',
    brandGroup: 'Wooting',
    name: 'Wooting 60HE+ Analog Hall Keyboard',
    blurb: 'Lekker Hall Effect switches with adjustable actuation points from 0.1mm to 4.0mm and tachyon hyper-speed mode.',
    price: 174.99,
    compareAt: null,
    img: IMG + 'product-19.png',
    alt: 'Wooting 60HE+ analog rapid trigger esports gaming keyboard with magnetic Lekker switches.',
    flags: ['RAPID TRIGGER', '0.1MM ANALOG'],
    specs: ['60% Layout', 'Magnetic Sensors', '0.1ms Polling'],
    rating: 5.0,
    reviews: 329,
    stock: 'IN STOCK // SHIP TODAY',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Magnetic Hall Effect',
    form: '60%',
    iface: 'Pure Detachable USB-C Wired',
    weight: 3
  },
  {
    sku: 'KB-NP-AIR75V2',
    brand: 'NuPhy Studio',
    brandGroup: 'NuPhy Studio',
    name: 'NuPhy Air75 V2 Wireless Slim',
    blurb: 'Ultra-slim QMK/VIA low-profile mechanical keyboard with Cowberry linear switches and aluminum top case.',
    price: 129.99,
    compareAt: null,
    img: IMG + 'product-20.png',
    alt: 'NuPhy Air75 V2 ultra slim wireless mechanical keyboard in lunar gray.',
    flags: ['1000HZ WIRELESS', 'LOW PROFILE'],
    specs: ['75% Form', 'Tri-Mode', '13.5mm Deck'],
    rating: 4.7,
    reviews: 98,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Linear (Cyan Lube)',
    form: '75%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 4
  },
  {
    sku: 'KB-SS-APEXMINI',
    brand: 'SteelSeries Pro',
    brandGroup: 'SteelSeries',
    name: 'SteelSeries Apex Pro Mini Dual Action',
    blurb: "World's fastest adjustable hyper-magnetic switches with 2-in-1 action key actuation programming.",
    price: 169.99,
    compareAt: 189.99,
    img: IMG + 'product-21.png',
    alt: 'SteelSeries Apex Pro Mini compact keyboard in aircraft grade aluminum chassis.',
    flags: ['SAVE $20.00', 'OMNIPOINT 2.0'],
    specs: ['Series 5000 Metal', 'Quantum 2.0'],
    rating: 4.6,
    reviews: 420,
    stock: 'LIMITED HARDWARE DROP',
    stockKind: 'warn',
    tier: 'Lab Pre-Order / Batch',
    acoustics: 'Magnetic Hall Effect',
    form: '60%',
    iface: 'Pure Detachable USB-C Wired',
    weight: 5
  },
  {
    sku: 'CB-GL-AVIA',
    brand: 'Glorious Guild',
    brandGroup: 'Glorious PC Gaming',
    name: 'Glorious Aviator Coiled Type-C Cable',
    blurb: 'Phantom Black aesthetic with heavy detachable 5-pin aviator connector, double-sleeved braided housing.',
    price: 39.99,
    compareAt: null,
    img: IMG + 'product-22.png',
    alt: 'Glorious custom coiled keyboard cable in phantom matte black with techflex sleeving.',
    flags: ['5-PIN AVIATOR', 'TECHFLEX DOUBLE'],
    specs: ['4.5ft Total', 'Gold-Plated C'],
    rating: 4.9,
    reviews: 86,
    stock: 'IN STOCK',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: 'Pure Detachable USB-C Wired',
    weight: 6
  },
  {
    sku: 'KB-VT75-CYN',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Vortex Titan Pro 75% CNC',
    blurb: 'Gasket mounted custom board with real-time CPU/GPU OLED stats display and CNC multi-media control knob.',
    price: 169.0,
    compareAt: null,
    img: IMG + 'product-23.png',
    alt: 'Vortex Titan Pro custom keyboard with integrated OLED info screen and brushed aluminum rotary knob.',
    flags: ['OLED TELEMETRY', 'ROTARY ENCODER'],
    specs: ['FR4 Plate', 'Poron Dampening', 'RGB Backlight'],
    rating: 4.9,
    reviews: 63,
    stock: 'IN LAB STOCK',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Linear (Cyan Lube)',
    form: '75%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 7
  },
  {
    sku: 'DK-TB4-12X',
    brand: 'Tradex Infra',
    brandGroup: 'Tradex Apex Lab',
    name: 'Titan 12-in-1 Thunderbolt 4 Ultra Dock',
    blurb: 'Dual 4K 144Hz or single 8K support, 2.5GbE Ethernet, UHS-II SD reader, and dedicated 100W laptop pass-through.',
    price: 179.0,
    compareAt: null,
    img: IMG + 'product-24.png',
    alt: 'Thunderbolt 4 metallic desktop docking station with dual 4K outputs.',
    flags: ['100W PD CHARGE', '40GBPS BUS'],
    specs: ['12 Ports Total', 'Heat Fin Enclosure'],
    rating: 4.9,
    reviews: 112,
    stock: 'DISPATCHES TODAY',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: 'Pure Detachable USB-C Wired',
    weight: 8
  },
  {
    sku: 'CB-240W-2M',
    brand: 'Tradex Accessories',
    brandGroup: 'Tradex Apex Lab',
    name: 'Braided 240W USB-C 2m Cable',
    blurb: 'Real-time live digital power meter, EPR 48V/5A 240W fast charge, 40Gbps high-speed data sync capability.',
    price: 24.99,
    compareAt: null,
    img: IMG + 'product-25.png',
    alt: 'High quality braided USB-C power delivery cable with integrated digital wattage readout.',
    flags: ['WATTAGE OLED', 'E-MARKER IC'],
    specs: ['2.0m Armored', 'PD 3.1 Spec'],
    rating: 4.8,
    reviews: 345,
    stock: 'SAME-DAY DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: 'Pure Detachable USB-C Wired',
    weight: 9
  },
  {
    sku: 'KB-VX-PRO75',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Vortex Pro 75% Mechanical',
    blurb: 'Krytox lubed switches, factory acoustic silicon dampener, multi-device 2.4GHz wireless with hot-swap sockets.',
    price: 149.0,
    compareAt: 199.0,
    img: IMG + 'product-08.png',
    alt: 'Compact 75 percent layout custom wireless mechanical keyboard with smoked polycarbonate top case.',
    flags: ['-25%', 'HOT-SWAP'],
    specs: ['Tri-Mode Wireless', 'Hot-Swap', 'ANSI Layout'],
    rating: 4.8,
    reviews: 211,
    stock: 'FLASH DROP',
    stockKind: 'warn',
    tier: 'Ready to Dispatch',
    acoustics: 'Linear (Cyan Lube)',
    form: '75%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 10
  },
  {
    sku: 'KB-TX-TKL80',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Vortex Command TKL 80% ISO',
    blurb: 'Tenkeyless ISO UK layout with dual-layer silicone dampening, brass weight bar, and per-key RGB matrix.',
    price: 209.0,
    compareAt: null,
    img: IMG + 'product-31.png',
    alt: 'Top-down isolated view of a custom mechanical keyboard with a clean, tightly packed key layout on a neutral backdrop.',
    flags: ['ISO UK', 'BRASS WEIGHT'],
    specs: ['TKL 80%', 'Hot-Swap 5-Pin', 'QMK/VIA'],
    rating: 4.7,
    reviews: 74,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Clicky Blue Sonic',
    form: 'TKL 80%',
    iface: 'Pure Detachable USB-C Wired',
    weight: 11
  },
  {
    sku: 'KB-VX-FULL100',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Vortex Terminal 100% Full ISO',
    blurb: 'Full-size ISO layout with dedicated macro column, aluminium top plate and double-shot PBT keycaps.',
    price: 239.0,
    compareAt: 279.0,
    img: IMG + 'product-03.png',
    alt: 'Custom mechanical keyboard with CNC milled aluminum case and dye-sub keycaps.',
    flags: ['-14%', 'ISO UK'],
    specs: ['100% Full', 'Macro Column', 'PBT Keycaps'],
    rating: 4.6,
    reviews: 51,
    stock: 'LAB PRE-ORDER',
    stockKind: 'warn',
    tier: 'Lab Pre-Order / Batch',
    acoustics: 'Clicky Blue Sonic',
    form: '100% Full',
    iface: 'Pure Detachable USB-C Wired',
    weight: 12
  },
  {
    sku: 'KB-NP-65LITE',
    brand: 'NuPhy Studio',
    brandGroup: 'NuPhy Studio',
    name: 'NuPhy Field 65% Low-Profile',
    blurb: 'Low-profile 65% tray with gasket mounting, wireless tri-mode and 4000mAh cell for multi-week runtime.',
    price: 109.0,
    compareAt: null,
    img: IMG + 'product-30.png',
    alt: 'Side profile view of a low-profile mechanical keyboard with CNC chamfered edges and a rotary encoder knob.',
    flags: ['LOW PROFILE', '4000 mAh'],
    specs: ['65% Layout', 'Tri-Mode', 'Gasket Mount'],
    rating: 4.7,
    reviews: 132,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Linear (Cyan Lube)',
    form: '65%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 13
  },
  {
    sku: 'KB-SS-TACT65',
    brand: 'SteelSeries Pro',
    brandGroup: 'SteelSeries',
    name: 'SteelSeries Prime 65 Tactile',
    blurb: 'Hot-swappable 65% board with pre-lubed violet tactile switches and aircraft-grade aluminium frame.',
    price: 139.0,
    compareAt: 159.0,
    img: IMG + 'product-34.png',
    alt: 'Close-up studio shot of a custom mechanical keyboard showing cyan switch backlighting on a brushed aluminum chassis.',
    flags: ['-13%', 'HOT-SWAP'],
    specs: ['65% Layout', 'Tactile Bump', 'Aluminium Frame'],
    rating: 4.5,
    reviews: 187,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Tactile (Violet Bump)',
    form: '65%',
    iface: 'Low-Latency 2.4GHz Only',
    weight: 14
  },
  {
    sku: 'KB-GL-TKLW',
    brand: 'Glorious Guild',
    brandGroup: 'Glorious PC Gaming',
    name: 'Glorious Titan TKL Wireless',
    blurb: 'TKL 80% gasket-mounted wireless board with brass plate option and isolated daughterboard USB-C.',
    price: 159.0,
    compareAt: null,
    img: IMG + 'product-27.png',
    alt: 'Isometric studio capture of an anodized matte aluminum mechanical keyboard with cyan backlit keycaps.',
    flags: ['TKL 80%', 'BRASS PLATE'],
    specs: ['TKL 80%', 'Tri-Mode', 'Gasket Mount'],
    rating: 4.8,
    reviews: 96,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Tactile (Violet Bump)',
    form: 'TKL 80%',
    iface: 'Tri-Mode (2.4G / BT5.3 / Type-C)',
    weight: 15
  },
  {
    sku: 'WR-TT-CNC',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Titan Matched CNC Aluminum Wrist Rest',
    blurb: 'Anodized 6063 aluminum ergonomic rest with a beveled chamfer and anti-slip acoustic silicone base feet.',
    price: 38.0,
    compareAt: null,
    img: IMG + 'product-32.png',
    alt: 'Anodized black solid aluminum ergonomic wrist rest with beveled chamfer and anti-slip acoustic silicone feet.',
    flags: ['CNC 6063', 'ACOUSTIC FEET'],
    specs: ['20mm Deck Height', 'Anti-Slip Base', 'Matched Anodizing'],
    rating: 4.7,
    reviews: 268,
    stock: 'READY TO DISPATCH',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: null,
    weight: 16
  },
  {
    sku: 'SW-LG-62G',
    brand: 'Tradex Apex Lab',
    brandGroup: 'Tradex Apex Lab',
    name: 'Linear Glacier 62g Switches (x90)',
    blurb: 'Precision tuned POM stems, 205g0 lubricant applied, 0 wobble polycarbonate housing.',
    price: 68.0,
    compareAt: null,
    img: IMG + 'product-14.png',
    alt: 'Set of 90 custom mechanical switches featuring smoky cyan nylon housing and POM stems.',
    flags: ['LAB LUBED', 'x90 PACK'],
    specs: ['Linear Cyan', '62g Actuation', '205g0 Lubed'],
    rating: 5.0,
    reviews: 320,
    stock: 'IN STOCK',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Linear (Cyan Lube)',
    form: null,
    iface: null,
    weight: 17
  },
  {
    sku: 'SS-HD-GEN5',
    brand: 'Tradex Infra',
    brandGroup: 'Tradex Apex Lab',
    name: 'HyperDrive Gen5 2TB NVMe SSD',
    blurb: 'Next-gen Phison E26 controller, graphene thermal shield, enterprise endurance rating.',
    price: 229.0,
    compareAt: 289.0,
    img: IMG + 'product-15.png',
    alt: 'M.2 PCIe 5.0 solid state drive with aggressive aluminum fin passive heatsink.',
    flags: ['14,000 MB/s', '-21%'],
    specs: ['2TB Capacity', 'PCIe 5.0 x4', 'Graphene Shield'],
    rating: 4.8,
    reviews: 95,
    stock: 'IN STOCK',
    stockKind: 'ok',
    tier: 'Ready to Dispatch',
    acoustics: 'Silent Obsidian Dampened',
    form: null,
    iface: null,
    weight: 18
  }
];

/* --------------------------------------------------------------------------
   Home page content
   -------------------------------------------------------------------------- */

const HERO = {
  eyebrow: 'LIMITED DROP // 2025 ALLOCATION',
  sysId: 'SYS-ID: GX9-ULTRA-REV4',
  titleLead: 'NEW GEN-X ',
  titleAccent: 'WORKSTATIONS',
  copy:
    'Architectural grade rendering and zero-compromise esports velocity. Engineered with RTX 40-Series Ada Lovelace silicon, factory-calibrated 4K OLED, and 175W Liquid Metal cryogenic vapor-chamber cooling.',
  img: IMG + 'product-01.png',
  alt:
    'Ultra-premium titanium gray high performance laptop workstation angled on an architectural minimalist desk surface.',
  float: 'TDP 175W LIQUID METAL',
  note: '14 Units Staged in Austin Hub',
  specs: [
    { k: 'Display', v: '4K OLED', s: '240Hz / 0.03ms' },
    { k: 'Compute', v: '64GB', s: 'DDR5 6400MT/s' },
    { k: 'Throughput', v: 'PCIe 5.0', s: '14,000 MB/s' }
  ]
};

const CATEGORIES = [
  { name: 'Laptops', count: '28 Configs', img: IMG + 'product-02.png', alt: 'High-end slim gaming and workstation laptop with magnesium alloy chassis.' },
  { name: 'Keyboards', count: '64 Artisan Builds', img: IMG + 'product-03.png', alt: 'Custom mechanical keyboard with CNC milled aluminum case and PBT keycaps.' },
  { name: 'Monitors', count: '19 HDR Displays', img: IMG + 'product-04.png', alt: 'Curved ultrawide OLED gaming monitor with slim bezel.' },
  { name: 'Audio & DAC', count: '32 Hi-Res Nodes', img: IMG + 'product-05.png', alt: 'Studio audiophile DAC amplifier with open-back planar magnetic headphones.' },
  { name: 'PC Components', count: '142 Silicons', img: IMG + 'product-06.png', alt: 'Graphics card GPU cooling assembly and motherboard chipset heatsink.' },
  { name: 'Desk Mats & Acc', count: '51 Accessories', img: IMG + 'product-07.png', alt: 'Heavy felt desk mat with stitched edges beside a CNC aluminum wrist rest.' }
];

const DEALS = [
  {
    sku: 'KB-VX-PRO75',
    img: IMG + 'product-08.png',
    alt: 'Compact 75 percent layout custom wireless mechanical keyboard with smoked polycarbonate top case.',
    discount: '-25%',
    specs: ['Tri-Mode Wireless', 'Hot-Swap'],
    name: 'Vortex Pro 75% Mechanical',
    blurb: 'Krytox lubed switches, factory acoustic silicon dampener, multi-device 2.4GHz.',
    price: 149,
    compareAt: 199
  },
  {
    sku: 'NB-AB-STEALTH16',
    img: IMG + 'product-09.png',
    alt: 'AeroBlade Stealth Pro high performance gaming laptop in thin matte black body.',
    discount: '-35%',
    specs: ['Core i9 14900HX', 'RTX 4080'],
    name: 'AeroBlade Stealth Pro 16"',
    blurb: '32GB DDR5, 1TB Gen4 NVMe, 240Hz QHD+ calibrated gaming and color workhorse.',
    price: 1899,
    compareAt: 2299
  },
  {
    sku: 'DK-TB4-12X',
    img: IMG + 'product-10.png',
    alt: 'Titan 12 in 1 Thunderbolt 4 dock made of extruded matte dark aluminum.',
    discount: '-$40 OFF',
    specs: ['Dual 4K60', '100W PD Output'],
    name: 'Titan 12-in-1 TB4 Dock',
    blurb: 'Single cable hub with 2.5GbE LAN, UHS-II SD reader, and isolated audio pipeline.',
    price: 179,
    compareAt: 219
  },
  {
    sku: 'AU-PL-ANC',
    img: IMG + 'product-11.png',
    alt: 'Pulse ANC Studio over-ear headphones with memory foam cushions on an oak stand.',
    discount: '-$50 OFF',
    specs: ['Hi-Res LDAC', '40h Runtime'],
    name: 'Pulse ANC Studio Headphones',
    blurb: 'Dual 40mm biocellulose drivers, hybrid adaptive noise canceling, low-latency mode.',
    price: 249,
    compareAt: 299
  }
];

const TRENDING_TABS = [
  { id: 'best', label: 'Best Sellers', skus: ['KB-KCQ1-PRO', 'SW-LG-62G', 'SS-HD-GEN5', 'KB-VX-PRO75'] },
  { id: 'new', label: 'New Arrivals', skus: ['CB-240W-2M', 'KB-NP-AIR75V2', 'KB-TX-TKL80', 'KB-GL-TKLW'] },
  { id: 'rated', label: 'Enthusiast Top Rated', skus: ['KB-WT-60HEP', 'KB-VT75-CYN', 'KB-NP-65LITE', 'CB-GL-AVIA'] }
];

const SHOWCASE = {
  img: IMG + 'product-12.png',
  alt:
    'Photorealistic high-end minimal workstation desk setup with ultrawide display, custom mechanical keyboard and studio monitor speakers.',
  hotspots: [
    { x: 44.5, y: 6.5, label: 'HOTSPOT 01', name: 'Apex 38" Nano-IPS Curved', price: '$1,199 • 144Hz G-Sync' },
    { x: 23.5, y: 17.5, label: 'HOTSPOT 02', name: 'TRADEX Heavy-65 Anodized', price: '$389 • Krytox Lubed' },
    { x: 40.5, y: 18.5, label: 'HOTSPOT 03', name: 'Element 3+ Balanced Amp', price: '$449 • USB-C Async' }
  ]
};

const TRUST_STRIP = [
  { icon: 'verified_user', title: '3-Year Factory Warranty', text: 'Complete zero-fault coverage on PCBs, displays, and thermal hardware.' },
  { icon: 'rocket_launch', title: 'Global Dispatch < 24h', text: 'Real-time automated fulfillment from Austin and Frankfurt hubs with tracking.' },
  { icon: 'swap_horizontal_circle', title: '30-Day Zero Friction', text: 'Hassle-free hardware exchanges or full refunds with prepaid return shipping.' }
];

const TRUST_ROW = [
  { icon: 'verified', title: '3-Year Zero-Fault Guarantee', text: 'Full hardware replacement and artisan solder support on custom components.' },
  { icon: 'airplanemode_active', title: 'Free Express Dispatch', text: 'Priority 2-Day domestic shipping with tamper-evident acoustic packaging.' },
  { icon: 'tune', title: 'Lab Calibrated & Tuned', text: 'Every board lubed with Krytox 205g0 and tested for 1000Hz polling latency.' },
  { icon: 'support_agent', title: 'Enthusiast Desk Support', text: 'Direct line to hardware engineers and firmware developers 24/7/365.' }
];

/* --------------------------------------------------------------------------
   Product detail content
   -------------------------------------------------------------------------- */

const PDP = {
  sku: 'VTX-TP75-PRO-GR',
  rev: 'REV 4.2 FACTORY TUNED',
  eyebrow: 'APEX SERIES // PRECISION INPUT',
  flags: ['TRI-MODE V2'],
  stock: 'In Stock • Ships in 24h',
  name: 'Vortex Titan Pro 75%',
  blurb: 'Wireless Tri-Mode • Gasket Mounted CNC Aluminum Chassis with customizable active OLED matrix & FR4 flex plate.',
  rating: 4.92,
  logs: '418 Verified Lab Logs',
  qa: '36 Q&As',
  price: 169.0,
  compareAt: 199.0,
  badge: '-15% LAUNCH DROP',
  installments: 'or 4 payments of $42.25 with',
  gallery: [
    { img: IMG + 'product-26.png', caption: 'Hero ISO', alt: 'Premium 75 percent custom mechanical keyboard machined from anodized slate gray aluminum with cyan backlighting.' },
    { img: IMG + 'product-27.png', caption: 'Switch Micro', alt: 'Isometric studio capture of Vortex Titan Pro mechanical keyboard showing anodized matte aluminum beveled edge.' },
    { img: IMG + 'product-28.png', caption: 'Exploded PCB', alt: 'Macro optical shot of a custom lubed mechanical keyboard switch mechanism disassembled.' },
    { img: IMG + 'product-29.png', caption: 'CNC Profile', alt: 'Exploded architectural diagram render of a gasket mounted keyboard showing aluminium top frame and brass chassis.' },
    { img: IMG + 'product-30.png', caption: 'Desk Angle', alt: 'Side profile aesthetic view showing low-profile CNC chamfered edges and rotary encoder knob.' }
  ],
  stats: [
    { icon: 'graphic_eq', v: '54.2 dB Clack', s: 'Acoustic Damped' },
    { icon: 'speed', v: '0.98 ms', s: '2.4GHz Latency' },
    { icon: 'memory', v: 'ARM Cortex-M4', s: 'QMK/VIA Core' }
  ],
  switches: [
    { id: 'linear', icon: 'water_drop', name: 'Linear Cyan V2', sub: 'Smooth butter glide • Krytox 205g0 • 45g actuation', cost: 0, perk: 'Included', def: true },
    { id: 'tactile', icon: 'radio_button_checked', name: 'Tactile Violet', sub: 'Crisp tactile bump • Deep acoustic thock • 55g actuation', cost: 10, perk: null },
    { id: 'silent', icon: 'volume_off', name: 'Silent Obsidian', sub: 'Stealth office damping • Dual-stage silicone • 40g actuation', cost: 15, perk: null }
  ],
  keycaps: ['ANSI (US Standard)', 'ISO (European Union)'],
  specs: [
    { k: 'INPUT ENGINE', icon: 'cycle', v: '1000 Hz', s: '1ms Real Latency', p: 'Hardware hardware-polled zero-jitter microcontroller architecture in both 2.4GHz RF and USB-C Type mode.' },
    { k: 'POWER DENSITY', icon: 'battery_charging_full', v: '4000 mAh', s: 'Up to 200h Continuous', p: 'High-discharge dual-cell lithium battery with smart auto-sleep telemetry and pass-through fast charging.' },
    { k: 'ACOUSTIC DAMPING', icon: 'layers', v: 'FR4 Flex', s: '16-Point Poron Gasket', p: 'Per-key flex cuts with dual-layer IXPE switch pads and molded bottom silicone chassis inserts.' },
    { k: 'SOLID HEFT', icon: 'fitness_center', v: '1.45 kg', s: '6063 Aluminum CNC', p: 'Anodized electrostatic 150-grit bead blasted finish with custom weighted PVD mirror stainless steel backplate.' }
  ],
  sheet: [
    ['Chassis Material & Milling', 'Unibody 6063 Aerospace Anodized Aluminum with 7.5° typing angle'],
    ['Hot-Swap Sockets', 'Kailh Gen-2 South-facing SMD RGB Sockets (3-pin & 5-pin compatible)'],
    ['Rotary & Display Matrix', '0.96-inch 128x64 White OLED with clickable ALPS mechanical potentiometer'],
    ['Stabilizers & Tuning', 'PCB-Mounted screw-in stabilizers, factory hand-lubricated with XHT-BDZ'],
    ['Connectivity Protocols', 'Bluetooth 5.3 (Up to 3 host profiles), 2.4 GHz Low-Jitter RF, USB-C High-Speed']
  ],
  bundle: [
    { img: IMG + 'product-31.png', label: 'BASE RIG', name: 'Vortex Titan Pro 75%', price: '$169.00', alt: 'Top down isolated view of Vortex Titan Pro 75 mechanical keyboard.' },
    { img: IMG + 'product-32.png', label: '+ ERGONOMIC REST', name: 'Titan Matched CNC Rest', price: '$38.00 (Save $10)', alt: 'Anodized black solid aluminum ergonomic wrist rest with beveled chamfer.' },
    { img: IMG + 'product-33.png', label: '+ INTERCONNECT', name: 'GX16 Coiled Aviator Cable', price: '$40.00 (Save $18)', alt: 'Coiled mechanical keyboard aviator cable with chrome GX16 connector.' }
  ],
  bundleTotal: '$219.00',
  bundleWas: '$247.00',
  reviews: [
    {
      stars: 5,
      when: '3 days ago',
      title: 'Unbelievable sound profile out of the box',
      body: 'Zero stabilizer rattle on the spacebar. The factory Krytox lubing on the Linear Cyan switches feels virtually identical to my custom hand-built boards that cost twice as much.',
      who: 'Devon M. • Senior SWE'
    },
    {
      stars: 5,
      when: '1 week ago',
      title: 'QMK web config works seamlessly on Linux',
      body: 'No proprietary bloatware. Plugged into my Arch Linux rig, opened Chrome, flashed layers and keymaps via VIA in 30 seconds flat. The OLED system telemetry works as advertised.',
      who: 'Kaelen T. • Systems Architect'
    },
    {
      stars: 5,
      when: '2 weeks ago',
      title: 'Heft and machining are pure industrial grade',
      body: 'Weighing at nearly 1.5kg, this unit does not budge an inch during intense code sessions or competitive gaming. Battery life with cyan RGB set at 30% has lasted me two full weeks.',
      who: 'Marcus R. • Game Producer'
    }
  ],
  questions: [
    {
      q: 'Can I hot-swap these switches with 5-pin Cherry profile switches?',
      a: 'Yes. The PCB features Kailh Gen-2 universal hot-swap sockets supporting standard 3-pin and 5-pin MX-style switches without clipping switch legs.'
    },
    {
      q: 'What operating systems are supported by the onboard OLED screen?',
      a: 'The OLED display runs embedded firmware that functions natively across Windows, macOS, Linux, and FreeBSD. Custom GIF/bitmap uploading is supported directly through the web-based Chromium configurator.'
    }
  ]
};

/* --------------------------------------------------------------------------
   Cart content
   -------------------------------------------------------------------------- */

const CART_SEED = [
  {
    sku: 'KB-VT75-CYN',
    img: IMG + 'product-34.png',
    alt: 'Close up studio shot of the Vortex Titan Pro 75 mechanical keyboard showing linear cyan switches.',
    flag: 'IN STOCK',
    flagText: 'Fast Dispatch',
    flagKind: 'ok',
    name: 'Vortex Titan Pro 75% Mechanical Keyboard',
    meta: 'Switch: Linear Cyan (Pre-lubed Krytox 205g0) • ANSI Layout • Anodized Grey',
    serial: 'KB-VT75-CYN',
    serialNote: '1000Hz Polling',
    price: 169.0,
    qty: 1
  },
  {
    sku: 'DK-TB4-12X',
    img: IMG + 'product-35.png',
    alt: 'High performance aluminum Thunderbolt 4 docking hub with multiple ports.',
    flag: 'IN STOCK',
    flagText: 'Only 3 Units Left',
    flagKind: 'warn',
    name: 'Titan 12-in-1 Thunderbolt 4 Dock',
    meta: 'Space Gray • 100W Power Delivery Ultra Hub • Dual 4K@120Hz Output',
    serial: 'DK-TB4-12X',
    serialNote: 'Intel JHL8440 Controller',
    price: 179.0,
    qty: 1
  },
  {
    sku: 'CB-240W-2M-P2',
    img: IMG + 'product-36.png',
    alt: 'Heavy duty obsidian black braided USB-C cable coiled neatly with zinc alloy connectors.',
    flag: 'IN STOCK',
    flagText: '$24.99 each',
    flagKind: 'ok',
    name: 'Braided 240W USB-C 2m Cable (Pack of 2)',
    meta: 'Obsidian Black • 40Gbps Sync • E-Marker 5A Chipset Verified',
    serial: 'CB-240W-2M-BLK',
    serialNote: 'Kevlar Braided Core',
    price: 49.98,
    qty: 2
  }
];

const ADDONS = [
  {
    sku: 'TL-KC-PULL2',
    img: IMG + 'product-37.png',
    alt: 'Titanium CNC machined custom switch and keycap puller.',
    name: 'Precision 2-in-1 Keycap Puller',
    sub: 'CNC aluminum, scratch-guard wire claws',
    price: 14.0
  },
  {
    sku: 'CL-SCR-KIT',
    img: IMG + 'product-38.png',
    alt: 'Professional microfiber optical screen cleaning spray kit.',
    name: 'Screen & Sensor Cleaning Kit',
    sub: 'Anti-static, streak-free formula for displays',
    price: 12.0
  },
  {
    sku: 'MT-DSK-XL',
    img: IMG + 'product-39.png',
    alt: 'Dense 4mm sound dampening desk mat with topographic circuit line pattern.',
    name: 'Sound Dampening Desk Mat (XL)',
    sub: '900x400mm • 4mm acoustic absorbent rubber',
    price: 29.0
  }
];

const CART_STEPS = [
  { id: 'stage', idx: '01 // STAGE', icon: 'shopping_cart_checkout', name: 'Tech Bag', sub: '3 Hardware Lines Active' },
  { id: 'routing', idx: '02 // ROUTING', icon: 'local_shipping', name: 'Shipping Details', sub: 'Express Air Eligible' },
  { id: 'gateway', idx: '03 // GATEWAY', icon: 'shield_person', name: 'Payment & Security', sub: 'Instant 1-Tap Ready' },
  { id: 'dispatch', idx: '04 // DISPATCH', icon: 'task_alt', name: 'Confirmation', sub: 'Telemetry & Tracking' }
];

const ASSURANCES = [
  { icon: 'verified_user', title: '2-Yr Zero-Fault Instant Swap', text: 'Rapid RMA hardware replacement without waiting for return shipment inspection.' },
  { icon: 'published_with_changes', title: '30-Day Hassle-Free Returns', text: 'Test switches and fitment in your setup. 100% refund guarantee with prepaid labels.' },
  { icon: 'lock', title: 'Bank-Grade 256-Bit SSL Encryption', text: 'End-to-end tokenized processing directly authenticated via secure hardware key vaults.' }
];

/* --------------------------------------------------------------------------
   Shared chrome
   -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: 'home.html', label: 'Home' },
  { href: 'catalog.html', label: 'Catalog' },
  { href: 'home.html#deals', label: 'Drops & Deals' },
  { href: 'product.html', label: 'Battlestations' },
  { href: 'index.html', label: 'Support' }
];

const FOOTER_COLS = [
  {
    title: 'Hardware Inventory',
    links: ['Barebones & PCBS', 'Custom Lubed Switches', 'Anodized Aluminum Cases', 'High-Bandwidth PCIe Gen5', 'Acoustic Desk Mats']
  },
  {
    title: 'Technical Support',
    links: ['QMK / VIA Firmware Flasher', 'Warranty Registration', 'Real-Time Order Tracking', 'Acoustic Sound Profiles', 'RMA & Lab Returns']
  },
  {
    title: 'Corporate & Legal',
    links: ['Enterprise B2B Invoicing', 'Supply Chain Transparency', 'Privacy Architecture', 'Terms of Hardware Sale', 'Security Advisory Board']
  }
];

const UTILITY_ITEMS = [
  { icon: 'bolt', lead: 'EXPRESS TECH DISPATCH', text: 'Orders placed before 16:00 EST ship same-day from Austin Hub', hideSm: false },
  { icon: 'local_shipping', lead: 'Free 2-Day Air on Orders Over $150', text: '', hideSm: true },
  { icon: 'lock', lead: 'GLOBAL INVENTORY ONLINE', text: '', hideSm: true }
];

/* Util --------------------------------------------------------------------- */

const PRODUCT_BY_SKU = CATALOG.reduce((acc, p) => {
  acc[p.sku] = p;
  return acc;
}, {});

const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
