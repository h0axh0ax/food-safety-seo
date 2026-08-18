import type { ProductCategory } from "@/lib/types";

import {
  CATEGORY_HERO_IMAGES,
  CATEGORY_HERO_POSITION,
} from "@/lib/category-assets";
import { CATEGORY_LABELS, CATEGORY_SUBTITLES } from "@/lib/categories";

const HERO_HEIGHT =
  "min-h-[320px] sm:min-h-[400px] lg:min-h-[460px]" as const;

const HERO_INNER =
  "relative mx-auto flex max-w-6xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:py-24" as const;

interface PageHeroProps {
  activeCategory: ProductCategory | "all";
  /** Home marketing hero vs directory lookup hero (browse / category pages). */
  variant?: "home" | "directory";
}

function HeroBackground({
  image,
  position = "center",
}: {
  image: string;
  position?: string;
}) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${image})`, backgroundPosition: position }}
      aria-hidden
    />
  );
}

export function PageHero({
  activeCategory,
  variant = activeCategory === "all" ? "home" : "directory",
}: PageHeroProps) {
  if (activeCategory === "all" && variant === "home") {
    return (
      <header
        className={`relative overflow-hidden border-b border-zinc-200 ${HERO_HEIGHT}`}
      >
        <HeroBackground image="/BKG.png" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
          aria-hidden
        />
        <div className={`${HERO_INNER} ${HERO_HEIGHT}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-300">
              For the people you care about
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Eat with peace of mind
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-100 sm:text-lg">
              Browse by product type or search a brand—the calm way to stay
              informed about what&apos;s in your kitchen.
            </p>
          </div>
        </div>
      </header>
    );
  }

  if (activeCategory === "all") {
    return (
      <header
        className={`relative overflow-hidden border-b border-zinc-200 ${HERO_HEIGHT}`}
      >
        <HeroBackground image="/BKG.png" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
          aria-hidden
        />
        <div className={`${HERO_INNER} ${HERO_HEIGHT}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-300">
              Food Safety Lookup
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              All Brands
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-100 sm:text-lg">
              Browse all brands with recall records on file.
            </p>
          </div>
        </div>
      </header>
    );
  }

  const backgroundImage = CATEGORY_HERO_IMAGES[activeCategory];
  const backgroundPosition =
    CATEGORY_HERO_POSITION[activeCategory] ?? "center";
  const label = CATEGORY_LABELS[activeCategory];

  return (
    <header
      className={`relative overflow-hidden border-b border-zinc-200 ${HERO_HEIGHT}`}
    >
      {backgroundImage ? (
        <HeroBackground
          image={backgroundImage}
          position={backgroundPosition}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" aria-hidden />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
        aria-hidden
      />
      <div className={`${HERO_INNER} ${HERO_HEIGHT}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-red-300">
            Food Safety Lookup
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {label}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-100 sm:text-lg">
            {CATEGORY_SUBTITLES[activeCategory]}
          </p>
        </div>
      </div>
    </header>
  );
}
