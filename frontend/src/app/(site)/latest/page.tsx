import type { Metadata } from "next";
import Link from "next/link";

import { DataDisplayNoticeCompact } from "@/components/DataDisplayNotice";
import { LatestRecallLog } from "@/components/LatestRecallLog";
import { isClassI } from "@/lib/format";
import { getLatestRecalls } from "@/lib/latest-recalls";

export const metadata: Metadata = {
  title: "Newest Recall Records — 50 Most Recently Reported",
  description:
    "The 50 most recently reported food recall records, sorted by official report date.",
};

export default async function LatestRecallsPage() {
  const recalls = await getLatestRecalls(50);
  const classICount = recalls.filter((recall) =>
    isClassI(recall.classification),
  ).length;
  const ongoingCount = recalls.filter((recall) =>
    recall.status?.toLowerCase().includes("ongoing"),
  ).length;

  return (
    <div className="min-h-full bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            Recent window
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Newest 50 records
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            A short list of the most recently reported recalls, by official
            report date. This is not the full directory. Records here are
            refreshed every 6 hours.
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            <Link
              href="/browse"
              className="font-medium text-red-800 hover:underline"
            >
              Browse all brands
            </Link>
            {" · "}
            {recalls.length} in this window
            {classICount > 0 ? ` · ${classICount} Class I` : ""}
            {ongoingCount > 0 ? ` · ${ongoingCount} ongoing` : ""}
          </p>
          <DataDisplayNoticeCompact className="mt-4 max-w-2xl" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {recalls.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            No recall records yet.
          </p>
        ) : (
          <LatestRecallLog recalls={recalls} />
        )}
      </main>
    </div>
  );
}
