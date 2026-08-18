const DATA_NOTICE = {
  title: "About these records",
  points: [
    "Recall information is sourced from official public enforcement and alert databases.",
    "Product descriptions, reasons, classifications, and other fields are shown as published—we do not rewrite or summarize official text.",
    "List views show a summary first. Use “View full record” to see every field supplied in the source data.",
    "A recall listed under a brand name reflects how the recalling firm appears in official records; it does not mean every product from that brand is affected.",
    "Data is refreshed every 6 hours from official public sources, with a full history refresh once a week. Status and new records can still lag behind the original agency. Check the primary source when timing matters.",
    "CheckMyFood is not affiliated with any government agency and does not provide medical, legal, or safety advice.",
  ],
} as const;

interface DataDisplayNoticeProps {
  className?: string;
  id?: string;
  showTitle?: boolean;
}

export function DataDisplayNotice({
  className = "",
  id,
  showTitle = true,
}: DataDisplayNoticeProps) {
  return (
    <aside
      {...(id ? { id } : {})}
      className={`rounded-2xl border border-stone-200/80 bg-gradient-to-br from-[#faf7f2]/90 to-white/80 px-5 py-4 text-sm leading-relaxed text-zinc-600 sm:px-6 sm:py-5 ${className}`}
    >
      {showTitle ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
          {DATA_NOTICE.title}
        </p>
      ) : null}
      <ul className={`list-disc space-y-2 pl-5 ${showTitle ? "mt-3" : ""}`}>
        {DATA_NOTICE.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-zinc-500">
        <a
          href="/about#data-display"
          className="font-medium text-red-800 hover:underline"
        >
          Data sources & display policy
        </a>
        {" · "}
        <a href="/disclaimer" className="font-medium text-red-800 hover:underline">
          Disclaimer
        </a>
      </p>
    </aside>
  );
}

export function DataDisplayNoticeCompact({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-zinc-500 ${className}`}>
      Records are shown verbatim from official public sources. This list is
      refreshed every 6 hours. Summaries on this page; expand each item for the
      full record.{" "}
      <a href="/about#data-display" className="font-medium text-red-800 hover:underline">
        Data sources
      </a>
    </p>
  );
}
