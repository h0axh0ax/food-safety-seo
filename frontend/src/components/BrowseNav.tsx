import Link from "next/link";

export function BrowseNav({ active }: { active: "directory" | "latest" }) {
  const linkClass = (isActive: boolean) =>
    isActive
      ? "border-red-700 bg-red-700 text-white"
      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50";

  return (
    <nav
      className="mb-6 flex flex-wrap gap-2"
      aria-label="Browse sections"
    >
      <Link
        href="/"
        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${linkClass(active === "directory")}`}
      >
        Brand Directory
      </Link>
      <Link
        href="/latest"
        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${linkClass(active === "latest")}`}
      >
        Latest Updates
      </Link>
    </nav>
  );
}
