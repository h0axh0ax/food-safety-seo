import { ClassificationBadge } from "@/components/ClassificationBadge";
import { formatReportDate } from "@/lib/format";
import type { Recall } from "@/lib/types";

interface RecallCardProps {
  recall: Recall;
}

export function RecallCard({ recall }: RecallCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ClassificationBadge classification={recall.classification} />
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Event {recall.event_id}
        </span>
        {recall.status && (
          <span className="text-xs text-zinc-500">Status: {recall.status}</span>
        )}
      </div>

      <dl className="space-y-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Product Description
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-zinc-900">
            {recall.product_description ?? "—"}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Reason for Recall
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-zinc-900">
            {recall.reason_for_recall ?? "—"}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Report Date
          </dt>
          <dd className="mt-1 text-sm text-zinc-900">
            {formatReportDate(recall.report_date)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
