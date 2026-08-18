import { ClassificationBadge } from "@/components/ClassificationBadge";
import { formatReportDate } from "@/lib/format";
import type { Recall } from "@/lib/types";
import Link from "next/link";

export type RecallCardVariant = "brand" | "compact";

interface RecallCardProps {
  recall: Recall;
  brandName?: string | null;
  variant?: RecallCardVariant;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  if (!value?.trim()) return null;

  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status?.trim()) return null;

  const normalized = status.toLowerCase();
  const isOngoing = normalized.includes("ongoing");

  return (
    <span
      className={
        isOngoing
          ? "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-inset ring-amber-200"
          : "inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200"
      }
    >
      {status}
    </span>
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

function MetaSeparator() {
  return (
    <span className="hidden text-zinc-300 sm:inline" aria-hidden>
      ·
    </span>
  );
}

export function RecallCard({
  recall,
  brandName,
  variant = "brand",
}: RecallCardProps) {
  const firmLocation = formatFirmLocation(recall);
  const isCompact = variant === "compact";
  const reportDate = formatReportDate(recall.report_date);

  return (
    <article
      id={`recall-${recall.event_id}`}
      className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-sm transition-colors hover:border-stone-300/80"
    >
      <div
        className="absolute inset-y-0 left-0 w-1 bg-red-800/35"
        aria-hidden
      />

      <div className={`relative ${isCompact ? "px-5 py-4 sm:px-6 sm:py-5" : "px-6 py-5 sm:px-7 sm:py-6"}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <ClassificationBadge classification={recall.classification} />
          <StatusBadge status={recall.status} />
          <MetaSeparator />
          <time
            dateTime={recall.report_date ?? undefined}
            className="text-sm text-zinc-600"
          >
            {reportDate}
          </time>
          {recall.recall_number ? (
            <>
              <MetaSeparator />
              <span className="text-xs text-zinc-500">
                Recall {recall.recall_number}
              </span>
            </>
          ) : null}
          {isCompact && brandName ? (
            <>
              <MetaSeparator />
              <Link
                href={`/recalls/${recall.brand_slug}`}
                className="text-sm font-semibold text-red-800 hover:underline"
              >
                {brandName}
              </Link>
            </>
          ) : null}
        </div>

        <div className={isCompact ? "mt-3 space-y-2" : "mt-4 space-y-3"}>
          <div>
            <p className="text-xs font-medium text-zinc-500">
              Product description
            </p>
            <p
              className={`mt-1 leading-relaxed text-zinc-900 ${
                isCompact
                  ? "line-clamp-2 text-sm"
                  : "text-base font-medium sm:text-[1.05rem]"
              }`}
            >
              {recall.product_description?.trim() || "—"}
            </p>
          </div>

          {recall.reason_for_recall?.trim() ? (
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Reason for recall
              </p>
              <p
                className={`mt-1 leading-relaxed text-zinc-700 ${
                  isCompact ? "line-clamp-2 text-sm" : "text-sm sm:text-base"
                }`}
              >
                {recall.reason_for_recall}
              </p>
            </div>
          ) : null}
        </div>

        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-red-800 transition-colors hover:text-red-900 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5">
              View full record
              <span
                className="text-xs text-zinc-400 transition-transform group-open:rotate-180"
                aria-hidden
              >
                ▾
              </span>
            </span>
          </summary>
          <dl className="mt-4 space-y-4 border-t border-stone-200/70 pt-4">
            <DetailRow label="Event ID" value={recall.event_id} />
            <DetailRow label="Code info" value={recall.code_info} />
            <DetailRow label="More code info" value={recall.more_code_info} />
            <DetailRow
              label="Product quantity"
              value={recall.product_quantity}
            />
            <DetailRow
              label="Distribution pattern"
              value={recall.distribution_pattern}
            />
            <DetailRow
              label="Voluntary / mandated"
              value={recall.voluntary_mandated}
            />
            <DetailRow
              label="Initial firm notification"
              value={recall.initial_firm_notification}
            />
            <DetailRow label="Product type" value={recall.product_type} />
            <DetailRow
              label="Recalling firm location"
              value={firmLocation}
            />
            <DetailRow
              label="Recall initiation date"
              value={
                recall.recall_initiation_date
                  ? formatReportDate(recall.recall_initiation_date)
                  : null
              }
            />
            <DetailRow
              label="Center classification date"
              value={
                recall.center_classification_date
                  ? formatReportDate(recall.center_classification_date)
                  : null
              }
            />
            <DetailRow
              label="Termination date"
              value={
                recall.termination_date
                  ? formatReportDate(recall.termination_date)
                  : null
              }
            />
          </dl>
        </details>
      </div>
    </article>
  );
}
