import { Product } from '@/types';

export const MAIN_CATEGORIES = ['Buku', 'Mainan', 'Hampers', 'Preloved'] as const;
export type MainCategory = (typeof MAIN_CATEGORIES)[number];

/**
 * Resolve a product's top-level category into one of the 4 canonical types:
 * Buku, Mainan, Hampers, or Preloved, along with its normalized sub-category.
 */
export function resolveProductTaxonomy(product: Product): {
  mainCategory: MainCategory;
  subCategory: string | undefined;
} {
  const rawCat = (product.category || '').trim();
  const rawSub = (product.subCategory || '').trim();
  const catLower = rawCat.toLowerCase();
  const subLower = rawSub.toLowerCase();
  const titleLower = (product.title || '').toLowerCase();

  // 1. Preloved
  if (
    product.isPreloved ||
    product.condition === 'preloved' ||
    catLower.includes('preloved') ||
    subLower.includes('preloved') ||
    titleLower.includes('[preloved]')
  ) {
    const inferredSub =
      rawSub && !subLower.includes('preloved')
        ? rawSub
        : rawCat && !catLower.includes('preloved')
          ? rawCat
          : undefined;
    return { mainCategory: 'Preloved', subCategory: inferredSub };
  }

  // 2. Hampers
  if (catLower.includes('hamper') || catLower.includes('gift') || catLower.includes('kado')) {
    const inferredSub =
      rawSub || (rawCat && !['hampers', 'hampers & gifts', 'gift hampers'].includes(catLower) ? rawCat : undefined);
    return { mainCategory: 'Hampers', subCategory: inferredSub };
  }

  // 3. Mainan
  if (
    catLower.includes('mainan') ||
    catLower.includes('toy') ||
    catLower.includes('wooden') ||
    catLower.includes('montessori') ||
    catLower.includes('puzzle') ||
    catLower.includes('sensory')
  ) {
    const inferredSub =
      rawSub || (rawCat && !['toys', 'mainan'].includes(catLower) ? rawCat : undefined);
    return { mainCategory: 'Mainan', subCategory: inferredSub };
  }

  // 4. Buku (default for books, board books, picture books, early readers, chapter books, etc.)
  const inferredSub =
    rawSub || (rawCat && !['books', 'buku'].includes(catLower) ? rawCat : undefined);
  return { mainCategory: 'Buku', subCategory: inferredSub };
}

