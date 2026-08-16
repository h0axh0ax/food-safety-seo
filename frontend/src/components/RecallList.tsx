import { RecallCard } from "@/components/RecallCard";
import { groupRecallsByYear } from "@/lib/recall-filter";
import type { Recall } from "@/lib/types";

type RecallListProps = {
  recalls: Recall[];
  groupByYear: boolean;
};

export function RecallList({ recalls, groupByYear }: RecallListProps) {
  if (recalls.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
        No recall records match your search.
      </p>
    );
  }

  if (!groupByYear) {
    return (
      <div className="space-y-5">
        {recalls.map((recall) => (
          <RecallCard key={recall.recall_number ?? recall.id} recall={recall} />
        ))}
      </div>
    );
  }

  const groups = groupRecallsByYear(recalls);

  return (
    <div className="space-y-10">
      {groups.map(({ year, recalls: yearRecalls }) => (
        <section key={year}>
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
            {year}{" "}
            <span className="font-normal normal-case tracking-normal text-zinc-400">
              ({yearRecalls.length} record
              {yearRecalls.length === 1 ? "" : "s"})
            </span>
          </h2>
          <div className="space-y-5">
            {yearRecalls.map((recall) => (
              <RecallCard
                key={recall.recall_number ?? recall.id}
                recall={recall}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
