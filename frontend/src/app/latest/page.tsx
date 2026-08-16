import type { Metadata } from "next";
import Link from "next/link";

import { BrowseNav } from "@/components/BrowseNav";
import { Disclaimer } from "@/components/Disclaimer";
import { RecallCard } from "@/components/RecallCard";
import { getLatestRecalls } from "@/lib/latest-recalls";

export const metadata: Metadata = {
  title: "Latest FDA Food Recalls — 50 Most Recent Updates",
  description:
    "The 50 most recently reported FDA food recall records from OpenFDA, sorted by report date.",
};

export default async function LatestRecallsPage() {
  const recalls = await getLatestRecalls(50);

  return (
    <div className="min-h-full bg-[#fafaf8]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
            Food Safety Lookup
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Latest FDA Recalls
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            The 50 most recently reported food recall records from OpenFDA,
            sorted by official report date.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <BrowseNav active="latest" />

        <p className="mb-6 text-sm text-zinc-600">
          {recalls.length} recent recall record{recalls.length === 1 ? "" : "s"}
        </p>

        {recalls.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            No recall records yet. Run the sync script to populate data.
          </p>
        ) : (
          <div className="space-y-5">
            {recalls.map((recall) => (
              <RecallCard
                key={recall.recall_number ?? recall.id}
                recall={recall}
                brandName={recall.brand_name}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-red-800 hover:underline"
          >
            Browse all brands →
          </Link>
        </p>

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
