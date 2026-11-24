export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badge?: string;
  href: string;
}

export interface NavDropdownGroup {
  id: string;
  label: string;
  href: string;
  viewAllText: string;
  items: CategoryItem[];
}

export const AGE_GROUPS_DROPDOWN: NavDropdownGroup = {
  id: 'age-groups',
  label: 'Shop by Age',
  href: '/catalog?age=all',
  viewAllText: 'View All Age Groups',
  items: [
    {
      id: 'age-newborn',
      name: 'Newborn+ (0–12 Months)',
      slug: 'Newborn+',
      description: 'Sensory play, high-contrast board books & gentle rattles',
      badge: 'Sensory',
      href: '/catalog?age=Newborn%2B',
    },
    {
      id: 'age-1-3',
      name: 'Ages 1–3 (Toddler)',
      slug: 'Ages 1-3',
      description: 'Fine motor skills, rainbow stackers & first picture books',
      badge: 'Motor Skills',
      href: '/catalog?age=Ages%201-3',
    },
    {
      id: 'age-3-plus',
      name: 'Ages 3+ (Preschool)',
      slug: 'Ages 3+',
      description: 'Interactive storybooks, puzzles & Montessori wooden toys',
      badge: 'Story',
      href: '/catalog?age=Ages%203%2B',
    },
    {
      id: 'age-6-plus',
      name: 'Ages 6+ (Early Reader)',
      slug: 'Ages 6+',
      description: 'Chapter books, STEM kits & creative building blocks',
      badge: 'STEM',
      href: '/catalog?age=Ages%206%2B',
    },
  ],
};

export const BOOKS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'books-categories',
  label: 'Books',
  href: '/catalog?category=Books',
  viewAllText: 'View All Children’s Books',
  items: [
    {
      id: 'book-board',
      name: 'Board Books (Thick Pages)',
      slug: 'Board Books',
      description: 'Durable, chew-safe & tear-proof for babies and toddlers',
      badge: 'Best Seller',
      href: '/catalog?category=Books&sub=Board%20Books',
    },
    {
      id: 'book-picture',
      name: 'Picture Books (Illustrated Stories)',
      slug: 'Picture Books',
      description: 'Warm illustrations nurturing empathy & bedtime imagination',
      href: '/catalog?category=Books&sub=Picture%20Books',
    },
    {
      id: 'book-sensory',
      name: 'Touch & Feel / Sound & Sensory',
      slug: 'Sound & Sensory',
      description: 'Tactile textures & interactive sounds for sensory development',
      href: '/catalog?category=Books&sub=Sound%20%26%20Sensory',
    },
    {
      id: 'book-early',
      name: 'Early Readers (Learning to Read)',
      slug: 'Early Readers',
      description: 'Graded phonetic rhymes & simple sentences for early learners',
      href: '/catalog?category=Books&sub=Early%20Readers',
    },
    {
      id: 'book-import',
      name: 'Bilingual & Imported Books',
      slug: 'Buku Impor',
      description: 'Curated English & bilingual international titles',
      badge: 'Imported',
      href: '/catalog?category=Books&sub=Buku%20Impor',
    },
    {
      id: 'book-preloved',
      name: 'Curated Preloved Books',
      slug: 'Preloved',
      description: '95%+ condition, UV-sanitized, eco & budget friendly',
      badge: 'Eco',
      href: '/catalog?category=Preloved&sub=Books',
    },
  ],
};

export const TOYS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'toys-categories',
  label: 'Toys',
  href: '/catalog?category=Wooden%20Toys',
  viewAllText: 'View All Wooden Toys',
  items: [
    {
      id: 'toy-stacker',
      name: 'Wooden Stacking & Rainbows',
      slug: 'Wooden Stacking',
      description: 'Smooth pine stacking blocks with non-toxic water-based paints',
      badge: 'Eco Friendly',
      href: '/catalog?category=Wooden%20Toys&sub=Wooden%20Stacking',
    },
    {
      id: 'toy-sorter',
      name: 'Montessori Shape Sorters',
      slug: 'Shape Sorter',
      description: 'Develops spatial logic and hand-eye coordination for toddlers',
      href: '/catalog?category=Wooden%20Toys&sub=Shape%20Sorter',
    },
    {
      id: 'toy-sensory',
      name: 'Sensory & Motor Wooden Toys',
      slug: 'Sensory Toys',
      description: 'Natural wooden rattles & push cars with rounded safe edges',
      href: '/catalog?category=Wooden%20Toys&sub=Sensory%20Toys',
    },
    {
      id: 'toy-puzzles',
      name: 'Wooden Blocks & Puzzles',
      slug: 'Wooden Puzzles',
      description: 'Chunky wooden puzzles with easy-to-grasp ergonomic knobs',
      href: '/catalog?category=Wooden%20Toys&sub=Wooden%20Puzzles',
    },
    {
      id: 'toy-preloved',
      name: 'Curated Preloved Wooden Toys',
      slug: 'Preloved',
      description: 'Cleaned, sanitized and well-kept Montessori wooden toys',
      badge: 'Eco',
      href: '/catalog?category=Preloved&sub=Wooden',
    },
  ],
};

export const HAMPERS_CATEGORIES_DROPDOWN: NavDropdownGroup = {
  id: 'hampers-categories',
  label: 'Hampers & Gifts',
  href: '/catalog?category=Gift%20Hampers',
  viewAllText: 'Customize Your Gift Hamper',
  items: [
    {
      id: 'hamper-newborn',
      name: 'Newborn Baby Welcome Set',
      slug: 'Newborn Hamper',
      description: 'Curated board book + wooden rattle + custom greeting card',
      badge: 'Popular',
      href: '/catalog?category=Gift%20Hampers&type=Newborn',
    },
    {
      id: 'hamper-birthday',
      name: 'Birthday Milestone Box (Ages 1–5)',
      slug: 'Birthday Hamper',
      description: 'Storybook & educational toy gift package tied with satin ribbon',
      href: '/catalog?category=Gift%20Hampers&type=Birthday',
    },
    {
      id: 'hamper-custom',
      name: 'Bespoke Wooden Gift Box',
      slug: 'Custom Hamper',
      description: 'Handpick your books and toys; complimentary ribbon and calligraphy card',
      badge: 'Free Wrap',
      href: '/catalog?category=Gift%20Hampers&type=Custom',
    },
  ],
};
