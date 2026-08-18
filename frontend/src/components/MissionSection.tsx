const MISSION = {
  eyebrow: "Why this matters",
  title: "Food safety is personal",
  lead:
    "A recall in the news can stay with you long after the segment ends—especially when you think about what is already in your pantry or what your kids ate yesterday. CheckMyFood exists for those quiet moments of worry: a place to look up a brand, breathe, and decide what to do next.",
  pillars: [
    {
      title: "For the people you care about",
      description:
        "Most of us are not food scientists. We are parents packing lunches, caregivers checking labels, and neighbors sharing what they heard. This site is built for everyday people who just want a straight answer.",
    },
    {
      title: "Clarity when news feels loud",
      description:
        "Headlines move fast; your kitchen does not. We organize recall information so you can move from “Did I buy that?” to “What should I do?” without feeling lost in the noise.",
    },
    {
      title: "Small checks, real peace of mind",
      description:
        "You should not need a long afternoon to feel reassured. A quick search before dinner, after grocery shopping, or when a friend texts you a link—that is enough. We hope CheckMyFood earns a place in those small, caring routines.",
    },
  ],
} as const;

export function MissionSection() {
  return (
    <section
      aria-labelledby="mission-heading"
      className="relative overflow-hidden border-y border-stone-300/60 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-[#f0e8de]"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-700/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-amber-900/8 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
              {MISSION.eyebrow}
            </p>
            <h2
              id="mission-heading"
              className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem]"
            >
              {MISSION.title}
            </h2>
          </div>

          <blockquote className="relative lg:col-span-7 lg:pt-2 xl:col-span-8">
            <span
              className="absolute -left-1 top-0 font-serif text-6xl leading-none text-red-800/15 sm:-left-2 sm:text-7xl lg:text-8xl"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="relative pl-8 text-lg leading-relaxed text-zinc-700 sm:pl-10 sm:text-xl sm:leading-relaxed lg:max-w-3xl">
              {MISSION.lead}
            </p>
          </blockquote>
        </div>

        <ul className="mt-12 grid gap-10 border-t border-stone-300/60 pt-12 sm:grid-cols-3 sm:gap-8 lg:mt-14 lg:pt-14 lg:gap-10">
          {MISSION.pillars.map((pillar) => (
            <li key={pillar.title} className="group">
              <div className="mb-4 h-0.5 w-10 bg-red-800/45 transition-all group-hover:w-14" />
              <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem] sm:leading-relaxed">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
