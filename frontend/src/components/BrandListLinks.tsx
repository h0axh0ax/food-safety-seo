import Link from "next/link";

import type { BrandListItem } from "@/lib/brand-sort";

interface BrandListLinksProps {
  items: BrandListItem[];
  countLabel?: (count: number) => string;
  hrefForSlug: (slug: string) => string;
  variant?: "default" | "soft";
  hideCount?: boolean;
}

export function BrandListLinks({
  items,
  countLabel,
  hrefForSlug,
  variant = "default",
  hideCount = false,
}: BrandListLinksProps) {
  const isSoft = variant === "soft";

  return (
    <ul
      className={
        isSoft
          ? "divide-y divide-stone-200/70 overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90"
          : "divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
      }
    >
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={hrefForSlug(item.slug)}
            className={
              isSoft
                ? "flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[#faf7f2] sm:px-8 sm:py-5"
                : "flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50"
            }
          >
            <span
              className={
                isSoft
                  ? "font-medium tracking-tight text-zinc-900"
                  : "font-medium text-zinc-900"
              }
            >
              {item.name}
            </span>
            <span className="shrink-0 text-sm text-zinc-500">
              {hideCount ? "View →" : `${countLabel?.(item.count) ?? item.count} →`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
