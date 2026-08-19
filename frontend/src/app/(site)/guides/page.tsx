import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "How to Read Recall Records — Classes, Status & Fields",
  description:
    "Plain-language guides to FDA recall classes, status values, and openFDA food enforcement fields, with links to official definitions.",
};

const FDA_RECALL_DEFINITIONS =
  "https://www.fda.gov/safety/industry-guidance-recalls/recalls-background-and-definitions";
const CFR_RECALL_CLASS =
  "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-7/subpart-A/section-7.3";
const OPENFDA_FOOD_ENFORCEMENT =
  "https://open.fda.gov/apis/food/enforcement/";
const OPENFDA_FIELDS =
  "https://open.fda.gov/apis/food/enforcement/searchable-fields/";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-red-800 underline decoration-red-800/30 underline-offset-2 hover:decoration-red-800"
    >
      {children}
    </a>
  );
}

function SourceBox({ children }: { children: ReactNode }) {
  return (
    <aside className="mt-4 rounded-xl border border-stone-200/90 bg-white px-4 py-3 text-sm leading-relaxed text-zinc-600">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Official sources
      </p>
      <div className="mt-2 space-y-1">{children}</div>
    </aside>
  );
}

function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-3 border-l-2 border-red-800/30 pl-4 text-sm leading-relaxed text-zinc-800 sm:text-[0.95rem]">
      {children}
    </blockquote>
  );
}

const TOC = [
  { id: "classification", label: "Recall classes (I / II / III)" },
  { id: "status", label: "Status values" },
  { id: "fields", label: "Record fields" },
  { id: "ids", label: "Recall number & event ID" },
  { id: "how-to-check", label: "How to check a product" },
] as const;

const FIELD_ROWS: Array<{
  field: string;
  meaning: string;
}> = [
  {
    field: "classification",
    meaning:
      "FDA health-hazard class for the recall (Class I, Class II, or Class III).",
  },
  {
    field: "status",
    meaning:
      "Whether the enforcement record is still open or has been closed in the published dataset (for example Ongoing, Completed, or Terminated).",
  },
  {
    field: "product_description",
    meaning:
      "Official description of the recalled product, as published in the enforcement record.",
  },
  {
    field: "reason_for_recall",
    meaning:
      "Official reason the product was recalled, shown exactly as published.",
  },
  {
    field: "code_info",
    meaning:
      "Lot, batch, UPC, or other identifying codes listed on the record.",
  },
  {
    field: "more_code_info",
    meaning: "Additional code or lot detail when the source record includes it.",
  },
  {
    field: "distribution_pattern",
    meaning:
      "Where the product was distributed, as stated in the enforcement record (states, regions, or nationwide).",
  },
  {
    field: "product_quantity",
    meaning: "Quantity of product involved, when provided by the source.",
  },
  {
    field: "voluntary_mandated",
    meaning:
      "Whether the recall was firm-initiated or FDA-mandated, per the published field.",
  },
  {
    field: "recalling_firm",
    meaning: "Name of the firm associated with the recall in the source record.",
  },
  {
    field: "report_date",
    meaning: "Date the enforcement report was published in the dataset.",
  },
  {
    field: "recall_initiation_date",
    meaning: "Date the firm initiated the recall, when present.",
  },
  {
    field: "termination_date",
    meaning: "Date the recall was terminated, when present on the record.",
  },
  {
    field: "center_classification_date",
    meaning:
      "Date related to FDA center classification activity, when present.",
  },
  {
    field: "initial_firm_notification",
    meaning:
      "How the firm first notified the public or trade, when listed (for example press release or letter).",
  },
];

export default function GuidesPage() {
  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            Guides
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            How to read a recall record
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Short explanations of FDA recall classes, common status values, and
            the fields you see on CheckMyFood. Definitions below follow public
            FDA and openFDA materials. We link those sources so you can verify
            them.
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            Looking up a brand?{" "}
            <Link href="/browse" className="font-medium text-red-800 hover:underline">
              Open the directory
            </Link>
            {" · "}
            <Link href="/latest" className="font-medium text-red-800 hover:underline">
              Latest recalls
            </Link>
            {" · "}
            <Link href="/library" className="font-medium text-red-800 hover:underline">
              Food safety library
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <nav
          aria-label="On this page"
          className="rounded-2xl border border-stone-200/90 bg-white px-5 py-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            On this page
          </p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {TOC.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm font-medium text-zinc-800 hover:text-red-800"
                >
                  <span className="mr-2 text-zinc-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="classification" className="scroll-mt-24 mt-12">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
            Recall classes (I / II / III)
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            FDA assigns a recall classification to indicate the relative degree
            of health hazard presented by the product being recalled. On this
            site, that value appears in the{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-zinc-800">
              classification
            </code>{" "}
            field (for example “Class I”).
          </p>

          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-red-200/80 bg-red-50/40 px-5 py-4">
              <h3 className="text-base font-semibold text-red-950">Class I</h3>
              <Quote>
                “a situation in which there is a reasonable probability that the
                use of or exposure to a violative product will cause serious
                adverse health consequences or death.”
              </Quote>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 px-5 py-4">
              <h3 className="text-base font-semibold text-amber-950">Class II</h3>
              <Quote>
                “a situation in which use of or exposure to a violative product
                may cause temporary or medically reversible adverse health
                consequences or where the probability of serious adverse health
                consequences is remote.”
              </Quote>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/40 px-5 py-4">
              <h3 className="text-base font-semibold text-sky-950">Class III</h3>
              <Quote>
                “a situation in which use of or exposure to a violative product
                is not likely to cause adverse health consequences.”
              </Quote>
            </div>
          </div>

          <SourceBox>
            <p>
              <ExternalLink href={FDA_RECALL_DEFINITIONS}>
                FDA — Recalls Background and Definitions
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href={CFR_RECALL_CLASS}>
                21 CFR § 7.3 — Definitions (recall classification)
              </ExternalLink>
            </p>
          </SourceBox>
        </section>

        <section id="status" className="scroll-mt-24 mt-14">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
            Status values
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Each enforcement record includes a{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-zinc-800">
              status
            </code>{" "}
            field from openFDA food enforcement data. Common published values
            include:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-zinc-700">
            <li>
              <span className="font-medium text-zinc-900">Ongoing</span> — the
              published record still lists the recall as open / in progress.
            </li>
            <li>
              <span className="font-medium text-zinc-900">Completed</span> or{" "}
              <span className="font-medium text-zinc-900">Terminated</span> — the
              published record indicates the recall action has been closed in
              the dataset. A{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                termination_date
              </code>{" "}
              may also appear when provided.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-zinc-600">
            Status on this site is shown exactly as stored from openFDA. It can
            still lag behind the latest agency updates.
          </p>
          <SourceBox>
            <p>
              <ExternalLink href={OPENFDA_FIELDS}>
                openFDA — Food Enforcement searchable fields (`status`,
                `termination_date`)
              </ExternalLink>
            </p>
            <p>
              <ExternalLink href={OPENFDA_FOOD_ENFORCEMENT}>
                openFDA — Food Enforcement API overview
              </ExternalLink>
            </p>
          </SourceBox>
        </section>

        <section id="fields" className="scroll-mt-24 mt-14">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
            Record fields
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            CheckMyFood displays fields from the openFDA Food Enforcement
            dataset. Product descriptions and recall reasons are shown verbatim
            from the source record—we do not rewrite them. Field names below
            match the openFDA reference.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Field</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">
                    What you are reading
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {FIELD_ROWS.map((row) => (
                  <tr key={row.field}>
                    <td className="px-4 py-3 align-top font-mono text-xs text-zinc-800 sm:px-5 sm:text-sm">
                      {row.field}
                    </td>
                    <td className="px-4 py-3 align-top leading-relaxed text-zinc-600 sm:px-5">
                      {row.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SourceBox>
            <p>
              <ExternalLink href={OPENFDA_FIELDS}>
                openFDA — complete Food Enforcement field reference
              </ExternalLink>
            </p>
          </SourceBox>
        </section>

        <section id="ids" className="scroll-mt-24 mt-14">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
            Recall number & event ID
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-zinc-600">
            <p>
              <span className="font-medium text-zinc-900">recall_number</span> —
              the published identifier for a specific enforcement product line
              in openFDA (often looks like{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                F-####-YYYY
              </code>{" "}
              or{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                H-####-YYYY
              </code>
              ). CheckMyFood uses this as the unique key for each stored row when
              available.
            </p>
            <p>
              <span className="font-medium text-zinc-900">event_id</span> — an
              identifier for the broader recall event. One event can include
              more than one product line (and therefore more than one recall
              number).
            </p>
          </div>
          <SourceBox>
            <p>
              <ExternalLink href={OPENFDA_FIELDS}>
                openFDA fields — `recall_number`, `event_id`
              </ExternalLink>
            </p>
          </SourceBox>
        </section>

        <section id="how-to-check" className="scroll-mt-24 mt-14">
          <h2 className="font-serif text-2xl tracking-tight text-zinc-900">
            How to check a product
          </h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            This is a reading checklist only. It is not medical, legal, or safety
            advice. Always rely on the official record text and current agency
            notices.
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-zinc-700">
            <li>
              Find the brand on the{" "}
              <Link href="/browse" className="font-medium text-red-800 hover:underline">
                directory
              </Link>{" "}
              or open{" "}
              <Link href="/latest" className="font-medium text-red-800 hover:underline">
                Latest
              </Link>
              .
            </li>
            <li>
              Read{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                product_description
              </code>{" "}
              and{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                code_info
              </code>{" "}
              on the record and compare them to the package label (product name,
              lot, UPC).
            </li>
            <li>
              Note{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                classification
              </code>{" "}
              and{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                status
              </code>{" "}
              using the definitions above.
            </li>
            <li>
              Read{" "}
              <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">
                distribution_pattern
              </code>{" "}
              if you need to see where the record says the product was
              distributed.
            </li>
            <li>
              For the authoritative dataset, use{" "}
              <ExternalLink href={OPENFDA_FOOD_ENFORCEMENT}>
                openFDA Food Enforcement
              </ExternalLink>{" "}
              or other official FDA recall channels.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
