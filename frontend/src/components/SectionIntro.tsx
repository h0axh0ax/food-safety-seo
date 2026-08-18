interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  id,
  action,
  className = "",
}: SectionIntroProps) {
  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className ?? "mb-8 lg:mb-10"}`}
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
