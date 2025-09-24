// Fallback category mapping in case of database issues
export const categoryIdToSlugMap: Record<number, string> = {
  1: "centrifugal-pumps",
  2: "circulating-pumps",
  3: "pressure-pumps",
  4: "submersible-pumps-and-motors",
  5: "submersible-sewage-pumps",
  6: "high-pressure-washers",
  7: "swimming-pool-pumps",
  8: "chemical-dosing-pumps",
  9: "fountain-pumps",
  10: "self-priming-pumps",
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
