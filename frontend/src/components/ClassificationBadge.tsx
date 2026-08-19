import Link from "next/link";

import { classificationTone } from "@/lib/format";

const toneStyles = {
  critical: "bg-red-50 text-red-800 ring-red-200",
  moderate: "bg-amber-50 text-amber-900 ring-amber-200",
  low: "bg-sky-50 text-sky-900 ring-sky-200",
  unknown: "bg-zinc-100 text-zinc-700 ring-zinc-200",
} as const;

interface ClassificationBadgeProps {
  classification: string | null;
  /** When true, badge links to the class definitions guide. */
  linkToGuide?: boolean;
}

export function ClassificationBadge({
  classification,
  linkToGuide = true,
}: ClassificationBadgeProps) {
  const tone = classificationTone(classification);
  const label = classification ?? "Unclassified";
  const className = `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneStyles[tone]}`;

  if (!linkToGuide) {
    return <span className={className}>{label}</span>;
  }

  return (
    <Link
      href="/guides#classification"
      className={`${className} transition-opacity hover:opacity-90`}
      title="What do Class I / II / III mean?"
    >
      {label}
    </Link>
  );
}
