import { ClassificationBadge } from "@/components/ClassificationBadge";
import { formatReportDate } from "@/lib/format";
import type { Recall } from "@/lib/types";
import Link from "next/link";

interface RecallCardProps {
  recall: Recall;
  brandName?: string | null;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value?.trim()) return null;

  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-zinc-900">{value}</dd>
    </div>
  );
}

function formatFirmLocation(recall: Recall): string | null {
  const parts = [
    recall.address_1,
    recall.address_2,
    recall.city,
    recall.state,
    recall.country,
  ].filter((part) => part?.trim());

  return parts.length ? parts.join(", ") : null;
}

export function RecallCard({ recall, brandName }: RecallCardProps) {
  const firmLocation = formatFirmLocation(recall);

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ClassificationBadge classification={recall.classification} />
        {brandName && (
          <Link
            href={`/recalls/${recall.brand_slug}`}
            className="text-sm font-semibold text-red-800 hover:underline"
          >
            {brandName}
          </Link>
        )}
        {recall.recall_number && (
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Recall {recall.recall_number}
          </span>
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Event {recall.event_id}
        </span>
        {recall.status && (
          <span className="text-xs text-zinc-500">Status: {recall.status}</span>
        )}
      </div>

      <dl className="space-y-4">
        <DetailRow label="Product Description" value={recall.product_description} />
        <DetailRow label="Code Info" value={recall.code_info} />
        <DetailRow label="More Code Info" value={recall.more_code_info} />
        <DetailRow label="Reason for Recall" value={recall.reason_for_recall} />
        <DetailRow label="Product Quantity" value={recall.product_quantity} />
        <DetailRow label="Distribution Pattern" value={recall.distribution_pattern} />
        <DetailRow label="Voluntary / Mandated" value={recall.voluntary_mandated} />
        <DetailRow
          label="Initial Firm Notification"
          value={recall.initial_firm_notification}
        />
        <DetailRow label="Product Type" value={recall.product_type} />
        <DetailRow label="Recalling Firm Location" value={firmLocation} />

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Report Date
          </dt>
          <dd className="mt-1 text-sm text-zinc-900">
            {formatReportDate(recall.report_date)}
          </dd>
        </div>

        <DetailRow
          label="Recall Initiation Date"
          value={
            recall.recall_initiation_date
              ? formatReportDate(recall.recall_initiation_date)
              : null
          }
        />
        <DetailRow
          label="Center Classification Date"
          value={
            recall.center_classification_date
              ? formatReportDate(recall.center_classification_date)
              : null
          }
        />
        <DetailRow
          label="Termination Date"
          value={
            recall.termination_date
              ? formatReportDate(recall.termination_date)
              : null
          }
        />
      </dl>
    </article>
  );
}
