import { classificationTone } from "@/lib/format";

const toneStyles = {
  critical: "bg-red-50 text-red-800 ring-red-200",
  moderate: "bg-amber-50 text-amber-900 ring-amber-200",
  low: "bg-sky-50 text-sky-900 ring-sky-200",
  unknown: "bg-zinc-100 text-zinc-700 ring-zinc-200",
} as const;

interface ClassificationBadgeProps {
  classification: string | null;
}

export function ClassificationBadge({ classification }: ClassificationBadgeProps) {
  const tone = classificationTone(classification);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneStyles[tone]}`}
    >
      {classification ?? "Unclassified"}
    </span>
  );
}
