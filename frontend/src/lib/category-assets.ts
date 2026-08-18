import type { ProductCategory } from "@/lib/types";

export const CATEGORY_HERO_IMAGES: Partial<Record<ProductCategory, string>> = {
  infant_child: "/baby.png",
  dairy: "/dairy.png",
  produce: "/produce.png",
  meat_seafood: "/meat.png",
  snacks_bakery: "/bakery.png",
  beverages: "/beverage.png",
  supplements: "/supplement.png",
  grains_prepared: "/grain.png",
  frozen_prepared: "/frozen.png",
  condiments: "/Seasonings.png",
  other: "/other.png",
};

/** Focal point for bg-cover crops (text sits on the left in heroes). */
export const CATEGORY_HERO_POSITION: Partial<
  Record<ProductCategory, string>
> = {
  infant_child: "72% center",
  dairy: "72% center",
  produce: "72% center",
  meat_seafood: "65% 58%",
  snacks_bakery: "72% center",
  beverages: "72% center",
  supplements: "72% center",
  grains_prepared: "72% center",
  frozen_prepared: "72% center",
  condiments: "72% center",
  other: "72% center",
};
