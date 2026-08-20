import type { ProductCategory } from "@/lib/types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  infant_child: "Infant & Child Food",
  pet_food: "Pet Food",
  supplements: "Supplements",
  dairy: "Dairy",
  meat_seafood: "Meat & Seafood",
  produce: "Produce",
  beverages: "Beverages",
  snacks_bakery: "Snacks & Bakery",
  grains_prepared: "Grains & Prepared Foods",
  frozen_prepared: "Frozen & Prepared Meals",
  condiments: "Condiments & Seasonings",
  other: "Other",
};

export const CATEGORY_SUBTITLES: Record<ProductCategory, string> = {
  infant_child:
    "Baby food, formula, and other products made for infants and kids.",
  pet_food:
    "Dog food, cat food, pet treats, and other animal food recall records.",
  dairy: "Milk, cheese, yogurt, butter, ice cream, and other dairy foods.",
  produce: "Fresh fruits, vegetables, salads, and other produce.",
  meat_seafood: "Chicken, beef, pork, fish, shrimp, and other meat or seafood.",
  snacks_bakery: "Cookies, chips, candy, bread, and other snacks or bakery items.",
  beverages: "Juice, coffee, tea, soda, water, and other drinks.",
  grains_prepared: "Cereal, rice, pasta, oats, flour, and other grain foods.",
  supplements: "Vitamins, protein powders, probiotics, and other supplements.",
  frozen_prepared: "Frozen meals, pizza, ready-to-eat dishes, and similar foods.",
  condiments: "Sauces, oils, spices, dressings, and other seasonings.",
  other: "Records that don't fit a single product type—nuts, eggs, honey, and more.",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "infant_child",
  "pet_food",
  "dairy",
  "produce",
  "meat_seafood",
  "snacks_bakery",
  "beverages",
  "grains_prepared",
  "supplements",
  "frozen_prepared",
  "condiments",
  "other",
];

export function isProductCategory(value: string | undefined): value is ProductCategory {
  return value !== undefined && value in CATEGORY_LABELS;
}
