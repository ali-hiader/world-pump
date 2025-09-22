// Fallback category mapping in case of database issues
export const categoryIdToSlugMap: Record<number, string> = {
  1: "centrifugal-pumps",
  2: "circulating-pumps",
  3: "solar-pumps",
  4: "pressure-pumps",
  5: "submersible-pumps",
  6: "vacuum-pumps",
  7: "sump-pumps",
  8: "jet-pumps",
  9: "booster-pumps",
};

export function getCategorySlugById(categoryId: number): string | null {
  return categoryIdToSlugMap[categoryId] || null;
}

// Product URL generation utility
export function generateProductUrl(product: {
  slug: string;
  categorySlug?: string | null;
  categoryId?: number;
}): string {
  let categorySlug = product.categorySlug;

  // If no categorySlug, try to get it from categoryId
  if (!categorySlug && product.categoryId) {
    categorySlug = getCategorySlugById(product.categoryId);
  }

  // Final fallback to a default category
  if (!categorySlug) {
    categorySlug = "centrifugal-pumps";
  }

  return `/pumps/${categorySlug}/${product.slug}`;
}
