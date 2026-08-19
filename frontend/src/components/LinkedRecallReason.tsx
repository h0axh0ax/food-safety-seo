import Link from "next/link";

import { linkifyHazardReason } from "@/lib/hazard-linkify";

const linkClassName =
  "font-medium text-red-800 underline decoration-red-800/30 underline-offset-2 hover:decoration-red-800";

/**
 * Renders official reason_for_recall text unchanged, with in-place links
 * to matching /library/[slug] encyclopedia pages.
 */
export function LinkedRecallReason({
  reason,
  className,
}: {
  reason: string;
  className?: string;
}) {
  const parts = linkifyHazardReason(reason);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.type === "link" ? (
          <Link
            key={`${part.slug}-${index}-${part.value}`}
            href={`/library/${part.slug}`}
            className={linkClassName}
            title={`Learn about ${part.value}`}
          >
            {part.value}
          </Link>
        ) : (
          <span key={`t-${index}`}>{part.value}</span>
        ),
      )}
    </span>
  );
}
