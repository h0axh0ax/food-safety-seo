import Link from "next/link";

import {
  BRAND_SORT_OPTIONS,
  type BrandSortMode,
} from "@/lib/brand-sort";
import { browseSortHref } from "@/lib/browse-href";

type BrandSortControlProps = {
  category: string;
  active: BrandSortMode;
  query?: string;
};

export function BrandSortControl({
  category,
  active,
  query,
}: BrandSortControlProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Sort
      </p>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Sort brands"
      >
        {BRAND_SORT_OPTIONS.map((option) => {
          const isActive = option.id === active;
          return (
            <Link
              key={option.id}
              href={browseSortHref({
                category,
                sort: option.id,
                query,
              })}
              title={option.description}
              className={
                isActive
                  ? "rounded-full border border-red-700 bg-red-700 px-3 py-1.5 text-sm font-medium text-white"
                  : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
