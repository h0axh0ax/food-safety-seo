import Link from "next/link";

import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";
import type { ProductCategory } from "@/lib/types";

type CategoryFilterProps = {
  active: ProductCategory | "all";
};

function chipClass(isActive: boolean): string {
  return isActive
    ? "border-red-700 bg-red-700 text-white"
    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50";
}

export function CategoryFilter({ active }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Browse by Product Type
      </p>
      <nav className="flex flex-wrap gap-2" aria-label="Product categories">
        <Link
          href="/"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${chipClass(active === "all")}`}
        >
          All Brands
        </Link>
        {CATEGORY_ORDER.map((slug) => (
          <Link
            key={slug}
            href={`/?category=${slug}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${chipClass(active === slug)}`}
          >
            {CATEGORY_LABELS[slug]}
          </Link>
        ))}
      </nav>
    </div>
  );
}
