import Link from "next/link";

import { ClassificationBadge } from "@/components/ClassificationBadge";
import { formatReportDateLong, isClassI } from "@/lib/format";
import { groupRecallsByDate } from "@/lib/recall-filter";
import type { Recall } from "@/lib/types";
import type { RecallWithBrand } from "@/lib/latest-recalls";

function isOngoing(status: string | null): boolean {
  return (status ?? "").toLowerCase().includes("ongoing");
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status?.trim()) return null;

  return (
    <span
      className={
        isOngoing(status)
          ? "inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-900 ring-1 ring-inset ring-amber-200"
          : "inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200"
      }
    >
      {status}
    </span>
  );
}

function LatestRow({
  recall,
  brandName,
}: {
  recall: Recall;
  brandName: string;
}) {
  const flagged = isClassI(recall.classification) || isOngoing(recall.status);

  return (
    <li
      className={`border-t border-stone-200/80 px-4 py-4 sm:px-5 ${
        flagged ? "bg-red-50/40" : "bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ClassificationBadge classification={recall.classification} />
        <StatusBadge status={recall.status} />
        <Link
          href={`/recalls/${recall.brand_slug}?from=latest`}
          className="text-sm font-semibold text-zinc-900 hover:text-red-800 hover:underline"
        >
          {brandName}
        </Link>
        {recall.recall_number ? (
          <span className="text-xs text-zinc-400">
            {recall.recall_number}
          </span>
        ) : null}
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-800">
        {recall.product_description?.trim() || "—"}
      </p>
      {recall.reason_for_recall?.trim() ? (
        <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
          {recall.reason_for_recall}
        </p>
      ) : null}

      <Link
        href={`/recalls/${recall.brand_slug}?from=latest`}
        className="mt-2 inline-flex text-sm font-medium text-red-800 hover:underline"
      >
        Open brand record →
      </Link>
    </li>
  );
}

export function LatestRecallLog({ recalls }: { recalls: RecallWithBrand[] }) {
  const groups = groupRecallsByDate(recalls);

  return (
    <div className="space-y-8">
      {groups.map(({ date, recalls: dayRecalls }) => (
        <section key={date}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              {formatReportDateLong(date === "unknown" ? null : date)}
            </h2>
            <p className="text-xs text-zinc-500">
              {dayRecalls.length} record{dayRecalls.length === 1 ? "" : "s"}
            </p>
          </div>
          <ol className="overflow-hidden rounded-xl border border-stone-200/90">
            {dayRecalls.map((recall) => (
              <LatestRow
                key={recall.recall_number ?? recall.id}
                recall={recall}
                brandName={recall.brand_name}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
