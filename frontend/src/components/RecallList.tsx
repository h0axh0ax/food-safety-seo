import { RecallCard, type RecallCardVariant } from "@/components/RecallCard";
import { groupRecallsByYear } from "@/lib/recall-filter";
import type { Recall } from "@/lib/types";

type RecallListProps = {
  recalls: Recall[];
  groupByYear: boolean;
  variant?: RecallCardVariant;
};

const emptyStateClassName =
  "rounded-2xl border border-stone-200/80 bg-white/90 px-6 py-10 text-center text-zinc-500";

export function RecallList({
  recalls,
  groupByYear,
  variant = "brand",
}: RecallListProps) {
  if (recalls.length === 0) {
    return (
      <p className={emptyStateClassName}>
        No recall records match your search.
      </p>
    );
  }

  if (!groupByYear) {
    return (
      <div className="space-y-4">
        {recalls.map((recall) => (
          <RecallCard
            key={recall.recall_number ?? recall.id}
            recall={recall}
            variant={variant}
          />
        ))}
      </div>
    );
  }

  const groups = groupRecallsByYear(recalls);

  return (
    <div className="space-y-12">
      {groups.map(({ year, recalls: yearRecalls }) => (
        <section key={year}>
          <div className="mb-5 flex items-baseline gap-3 border-b border-stone-200/70 pb-3">
            <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
              {year}
            </h2>
            <p className="text-sm text-zinc-500">
              {yearRecalls.length} record
              {yearRecalls.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="space-y-4">
            {yearRecalls.map((recall) => (
              <RecallCard
                key={recall.recall_number ?? recall.id}
                recall={recall}
                variant={variant}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
