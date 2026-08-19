import type { Metadata } from "next";
import Link from "next/link";

import {
  getHazardsByCategory,
  HAZARDS,
} from "@/lib/hazards";

export const metadata: Metadata = {
  title: "Food Safety Library — Germs, Allergens & Contaminants",
  description:
    "Short encyclopedia-style explainers for germs, food allergens, foreign materials, and chemicals, written for the public with links to CDC and FDA consumer pages.",
};

export default function LibraryIndexPage() {
  const groups = getHazardsByCategory();

  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            Library
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            Food safety library
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Short, plain-language explainers for germs, allergens, foreign
            materials, and chemicals discussed in food safety. Written like a
            brief encyclopedia for the public. Each page links to consumer
            materials from CDC, FoodSafety.gov (FDA/USDA/CDC), MedlinePlus
            (NIH), or EPA—open those links to verify details.
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            {HAZARDS.length} topics
            {" · "}
            <Link href="/guides" className="font-medium text-red-800 hover:underline">
              How to read recall records
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-12 px-4 py-10 sm:px-6 sm:py-12">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
              {group.label}
            </h2>
            <ul className="mt-4 divide-y divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
              {group.items.map((hazard) => (
                <li key={hazard.slug}>
                  <Link
                    href={`/library/${hazard.slug}`}
                    className="block px-5 py-4 transition-colors hover:bg-stone-50 sm:px-6"
                  >
                    <p className="font-semibold text-zinc-900">{hazard.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                      {hazard.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-sm leading-relaxed text-zinc-500">
          These pages are for general education only—not medical advice.
          When a recall reason mentions one of these topics, the matching
          words on recall pages link here. Prefer the linked official pages
          for the fullest wording.
        </p>
      </main>
    </div>
  );
}
