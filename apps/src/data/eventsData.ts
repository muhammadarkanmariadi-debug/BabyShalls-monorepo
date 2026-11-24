export interface MockEvent {
  id: string;
  title: string;
  category: 'Workshop' | 'Story Time' | 'Market Day' | 'Live Sale';
  age: string;
  date: string;
  time: string;
  location: string;
  companion: string;
  image: string;
  price: number; // 0 for FREE, > 0 for PAID
  priceLabel: string; // 'FREE' or 'Rp75,000'
  isFree: boolean;
  quotaTotal: number;
  quotaFilled: number;
  seatsLeft: number;
  status: 'Available' | 'Limited Seats' | 'Sold Out' | 'Tersedia' | 'Sisa Sedikit' | 'Penuh';
  description: string;
  agenda: { time: string; label: string }[];
  itemsToBring: string[];
  learnings: string[];
  facilities: string[];
}

export const ALL_EVENTS: MockEvent[] = [
  {
    id: 'nature-craft',
    title: 'Little Explorers: Nature Craft Workshop',
    category: 'Workshop',
    age: '3–6 years',
    date: 'Saturday, Dec 6, 2026',
    time: '10:00–12:00 WIB',
    location: 'BabyShalls Boutique, Citraland Puncak Tidar HH-26, Malang',
    companion: 'Must be accompanied by 1 parent',
    image: '/images/events/event-workshop-alam.png',
    price: 75000,
    priceLabel: 'Rp75,000',
    isFree: false,
    quotaTotal: 20,
    quotaFilled: 14,
    seatsLeft: 6,
    status: 'Limited Seats',
    description:
      'Children create botanical collages from dried leaves and blossoms while listening to woodland tales. All craft supplies and equipment are provided by BabyShalls.',
    agenda: [
      { time: '10:00', label: 'Registration & QR e-ticket check-in' },
      { time: '10:15', label: 'Story time: Little Explorer in the Forest' },
      { time: '10:45', label: 'Botanical collage making & natural clay craft' },
      { time: '11:45', label: 'Group photo session & take-home creations' },
    ],
    itemsToBring: ['QR E-Ticket (on smartphone)', 'Play apron / spare clothes', 'Water bottle'],
    learnings: [
      'Strengthen fine motor coordination and finger grip through natural clay sculpting',
      'Discover textures, aromas, and botanical pigments from local Malang flora',
      'Build creative confidence and self-expression in a warm setting',
      'Foster interactive parent-child bonding through shared making',
    ],
    facilities: [
      'Complete workshop materials (natural clay, wooden canvas, child-safe glue)',
      'Healthy wholesome snacks & fresh fruit juice for child and parent',
      'Official BabyShalls Little Explorer Certificate of Participation',
      'Rp 25,000 children’s book shopping voucher',
    ],
  },
  {
    id: 'story-time-dongeng',
    title: 'Weekend Story Time: Adventures of the Clever Deer & Enchanted Forest',
    category: 'Story Time',
    age: '2–6 years',
    date: 'Sunday, Nov 29, 2026',
    time: '15:30–17:00 WIB',
    location: 'Boutique Story Rug Area, BabyShalls Malang',
    companion: 'Must be accompanied by 1 parent',
    image: '/images/events/event-story-time.png',
    price: 0,
    priceLabel: 'FREE',
    isFree: true,
    quotaTotal: 20,
    quotaFilled: 12,
    seatsLeft: 8,
    status: 'Available',
    description:
      'A complimentary interactive storytelling session with hand puppets by Kak Nisa, followed by giant pop-up book reading and sing-alongs on the boutique’s plush story rug.',
    agenda: [
      { time: '15:30', label: 'Check-in & cheerful welcome' },
      { time: '15:45', label: 'Interactive puppet storytelling by Kak Nisa' },
      { time: '16:20', label: 'Parent-child picture book exploration' },
      { time: '16:45', label: 'Fun Q&A and character sticker giveaway' },
    ],
    itemsToBring: ['QR E-Ticket (on smartphone)', 'Clean socks for the story rug area'],
    learnings: [
      'Cultivate a lifelong love for books and imagination from an early age',
      'Explore values of kindness, honesty, and empathy through story characters',
      'Expand active vocabulary and listening attention span',
    ],
    facilities: [
      'Free access to boutique reading corner & thousands of curated display books',
      'Collectible story character stickers for all participants',
      'Bottled water & healthy organic toddler biscuits',
    ],
  },
  {
    id: 'market-day-cilik',
    title: 'Kids Market Day: Little Cashiers & Book Sharing',
    category: 'Market Day',
    age: '4–9 years',
    date: 'Saturday, Dec 12, 2026',
    time: '10:00–13:00 WIB',
    location: 'BabyShalls Boutique Courtyard, Citraland Malang',
    companion: 'Must be accompanied by 1 parent',
    image: '/images/events/event-market-day.png',
    price: 0,
    priceLabel: 'FREE',
    isFree: true,
    quotaTotal: 25,
    quotaFilled: 19,
    seatsLeft: 6,
    status: 'Available',
    description:
      'An exciting hands-on roleplay event where kids practice being junior cashiers, trade favorite preloved storybooks, and explore fundamental math and financial literacy.',
    agenda: [
      { time: '10:00', label: 'Stall registration & mini-briefing' },
      { time: '10:30', label: 'Pretend shopping simulation & book exchange' },
      { time: '12:00', label: 'Star coin tally & achievement appreciation' },
      { time: '12:45', label: 'Closing ceremony & group photo' },
    ],
    itemsToBring: ['QR E-Ticket', '1–3 preloved children’s books in good condition to trade'],
    learnings: [
      'Understand currency concepts and simple addition through roleplay cashier games',
      'Practice polite communication, bargaining, and social etiquette',
      'Learn the mindful joy of sharing and recycling cherished books',
    ],
    facilities: [
      'Mini wooden market stall & playful price tags',
      'Little cashier toy star coins',
      'BabyShalls Little Entrepreneur Certificate',
    ],
  },
  {
    id: 'sensory-clay-art',
    title: 'Sensory Modeling Clay: Sculpting Favorite Story Characters',
    category: 'Workshop',
    age: '3–8 years',
    date: 'Saturday, Dec 19, 2026',
    time: '09:30–11:30 WIB',
    location: 'Workshop Corner, BabyShalls Citraland Malang',
    companion: 'Must be accompanied by 1 parent',
    image: '/images/events/event-workshop-alam.png',
    price: 50000,
    priceLabel: 'Rp50,000',
    isFree: false,
    quotaTotal: 15,
    quotaFilled: 15,
    seatsLeft: 0,
    status: 'Sold Out',
    description:
      'Sculpt woodland animals and the very hungry caterpillar using food-grade, certified non-toxic organic wheat dough safe for young children.',
    agenda: [
      { time: '09:30', label: 'Ticket check-in & clay kit distribution' },
      { time: '09:45', label: 'Basic rolling, pinching, and modeling techniques' },
      { time: '10:15', label: 'Sculpting beloved fairytale characters' },
      { time: '11:15', label: 'Packaging finished sculptures into keepsake boxes' },
    ],
    itemsToBring: ['QR E-Ticket', 'Casual clothing / play apron'],
    learnings: [
      '3-dimensional sensory exploration and tactile muscle strengthening',
      'Discover primary color mixing principles using dough',
      'Develop patience and perseverance in completing creative projects',
    ],
    facilities: [
      '1 set of colorful organic food-grade modeling clay (take home)',
      'Child-safe wooden modeling tools & cutters',
      'Keepsake display packaging box',
      'Fresh orange juice & healthy snacks',
    ],
  },
  {
    id: 'live-sale-akhirtahun',
    title: 'Year-End Live Showcase: Curated Imported Books & Special Perks',
    category: 'Live Sale',
    age: 'All Ages',
    date: 'Friday, Dec 18, 2026',
    time: '19:00–21:00 WIB',
    location: 'Online via Instagram Live @babyshalls',
    companion: 'Online / Anywhere',
    image: '/images/events/event-story-time.png',
    price: 0,
    priceLabel: 'FREE',
    isFree: true,
    quotaTotal: 100,
    quotaFilled: 45,
    seatsLeft: 55,
    status: 'Available',
    description:
      'An interactive virtual live session reviewing 30+ top imported board books and picture books for the holiday season with flash perks of up to 40% off.',
    agenda: [
      { time: '19:00', label: 'Live opening & first book giveaway' },
      { time: '19:15', label: 'Deep dive into 15 board book titles for ages 0–3' },
      { time: '20:00', label: 'Exclusive 15-minute holiday flash perks' },
      { time: '20:30', label: 'Interactive science & encyclopedia book showcase' },
    ],
    itemsToBring: ['Instagram app on your smartphone or browser'],
    learnings: [
      'Choose the right books aligned with your child’s milestone development',
      'Understand interactive book features (lift-the-flap, touch-and-feel, sound books)',
    ],
    facilities: [
      'Rp 15,000 courier shipping subsidy voucher during the live session',
      'Chance to win 5 free children’s storybooks in live giveaways',
    ],
  },
  {
    id: 'holiday-book-camp',
    title: 'Holiday Book Camp: 2-Day Story Exploration & Canvas Painting',
    category: 'Workshop',
    age: '5–10 years',
    date: 'Saturday – Sunday, Dec 26–27, 2026',
    time: '09:00–12:00 WIB',
    location: 'BabyShalls Boutique, Citraland Puncak Tidar HH-26, Malang',
    companion: 'Must be accompanied by 1 parent',
    image: '/images/events/event-market-day.png',
    price: 125000,
    priceLabel: 'Rp125,000',
    isFree: false,
    quotaTotal: 15,
    quotaFilled: 12,
    seatsLeft: 3,
    status: 'Limited Seats',
    description:
      'An intensive 2-day holiday creativity camp! Day 1 covers classic story structure and illustration styles; Day 2 features adventure canvas painting with non-toxic acrylics.',
    agenda: [
      { time: '09:00', label: 'Ice breaking & new friends introduction' },
      { time: '09:30', label: 'Story sketching on canvas' },
      { time: '10:30', label: 'Canvas painting with brushes and natural sponges' },
      { time: '11:30', label: 'Mini art exhibition & certificate presentation' },
    ],
    itemsToBring: ['QR E-Ticket', 'Spare clothes / painting apron'],
    learnings: [
      'Translate narrative ideas and feelings into visual canvas art',
      'Build confidence, presentation skills, and positive peer interaction',
    ],
    facilities: [
      '30x40 cm stretched canvas + child-safe acrylic paint set (take home)',
      'Mini wooden tabletop easel',
      'Wholesome bento lunch box & organic date milk for both days',
      'Official BabyShalls Holiday Camp Certificate',
    ],
  },
];

export const PAST_EVENTS = [
  {
    id: 'past-1',
    title: 'Sensory Water Play & Giant Bubbles',
    date: 'October 12, 2026',
    image: '/images/events/event-workshop-alam.png',
    description: 'Giant soap bubble sensory exploration and natural watercolor play in our boutique garden.',
  },
  {
    id: 'past-2',
    title: 'Meet & Greet Children’s Book Author',
    date: 'September 28, 2026',
    image: '/images/events/event-story-time.png',
    description: 'An inspiring parenting discussion on reading aloud and raising curious readers.',
  },
  {
    id: 'past-3',
    title: 'Preloved Book Exchange & Literacy Drive',
    date: 'September 14, 2026',
    image: '/images/events/event-market-day.png',
    description: 'Collected 200+ quality children’s books donated to local community libraries in East Java.',
  },
];

export function getEventById(id: string): MockEvent {
  const found = ALL_EVENTS.find((e) => e.id === id);
  if (found) return found;
  return ALL_EVENTS[0];
}
