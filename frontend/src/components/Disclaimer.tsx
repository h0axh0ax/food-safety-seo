interface DisclaimerProps {
  variant?: "inline" | "page";
}

export function Disclaimer({ variant = "inline" }: DisclaimerProps) {
  if (variant === "page") {
    return (
      <article className="space-y-6 text-sm leading-relaxed text-zinc-600 sm:text-base">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">Data source</h2>
          <p className="mt-3">
            Recall information on this site is drawn from official public
            enforcement and alert databases. Fields are displayed verbatim
            without modification. Which agencies and feeds are in use is
            described on our{" "}
            <a
              href="/about#data-display"
              className="font-medium text-red-800 hover:underline"
            >
              About page
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">
            No government affiliation
          </h2>
          <p className="mt-3">
            CheckMyFood is an independent lookup tool. We are not affiliated
            with, endorsed by, or operated on behalf of any government agency or
            data provider.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">
            Not medical, legal, or safety advice
          </h2>
          <p className="mt-3">
            This site is for informational purposes only. It does not provide
            medical, legal, or food safety advice. Do not rely on CheckMyFood
            as your only source when making decisions about food you have
            purchased or consumed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">
            Accuracy and timeliness
          </h2>
          <p className="mt-3">
            We refresh recent records every 6 hours, and run a full history
            refresh once a week. Records may still be incomplete, delayed, or
            superseded by updates at the original publishing agency. Always
            verify critical information with official sources or a qualified
            professional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900">
            Brand listings
          </h2>
          <p className="mt-3">
            A recall listed under a brand or firm name reflects how the recalling
            party appears in official records. It does not mean that every
            product from that brand is affected, nor does it imply wrongdoing
            beyond what is stated in the official record.
          </p>
        </section>
      </article>
    );
  }

  return (
    <aside className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm leading-relaxed text-zinc-600">
      <p className="font-semibold text-zinc-800">Disclaimer</p>
      <p className="mt-2">
        Recall information is drawn from official public sources and displayed
        verbatim. CheckMyFood is not affiliated with any government agency. This
        site does not provide medical, legal, or safety advice.{" "}
        <a href="/disclaimer" className="font-medium text-red-800 hover:underline">
          Full disclaimer
        </a>
      </p>
    </aside>
  );
}
