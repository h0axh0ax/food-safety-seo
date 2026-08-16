import type { ProductCategory } from "@/lib/types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  infant_child: "Infant & Child Food",
  supplements: "Supplements",
  dairy: "Dairy",
  meat_seafood: "Meat & Seafood",
  produce: "Produce",
  beverages: "Beverages",
  snacks_bakery: "Snacks & Bakery",
  grains_prepared: "Grains & Prepared Foods",
  frozen_prepared: "Frozen & Prepared Meals",
  other: "Other",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "infant_child",
  "dairy",
  "produce",
  "meat_seafood",
  "snacks_bakery",
  "beverages",
  "grains_prepared",
  "supplements",
  "frozen_prepared",
  "other",
];

export function isProductCategory(value: string | undefined): value is ProductCategory {
  return value !== undefined && value in CATEGORY_LABELS;
}
