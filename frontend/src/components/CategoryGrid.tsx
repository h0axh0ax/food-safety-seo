import Link from "next/link";

import { SectionIntro } from "@/components/SectionIntro";
import { CATEGORY_HERO_IMAGES, CATEGORY_HERO_POSITION } from "@/lib/category-assets";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/categories";

export function CategoryGrid() {
  return (
    <section aria-labelledby="categories-heading">
      <SectionIntro
        id="categories-heading"
        eyebrow="Start here"
        title="What are you looking up?"
        description="Pick a category to see brands with recall records."
        action={
          <Link
            href="/browse"
            className="text-sm font-medium text-red-800 transition-colors hover:text-red-900 hover:underline"
          >
            View all brands →
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map((slug) => {
          const image = CATEGORY_HERO_IMAGES[slug];
          const position = CATEGORY_HERO_POSITION[slug] ?? "center";

          return (
            <Link
              key={slug}
              href={`/browse?category=${slug}`}
              className="group relative overflow-hidden rounded-2xl border border-stone-200/70 bg-zinc-800 shadow-sm transition duration-300 hover:border-stone-300/80 hover:shadow-md"
            >
              {image ? (
                <div
                  className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: position,
                  }}
                  aria-hidden
                />
              ) : null}
              <div
                className={`absolute inset-0 ${image ? "bg-gradient-to-t from-black/80 via-black/40 to-black/20" : "bg-gradient-to-br from-zinc-700 to-zinc-900"}`}
                aria-hidden
              />
              <div className="relative flex min-h-[132px] items-end p-5 sm:min-h-[148px]">
                <span className="text-base font-medium tracking-tight text-white sm:text-lg">
                  {CATEGORY_LABELS[slug]}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
