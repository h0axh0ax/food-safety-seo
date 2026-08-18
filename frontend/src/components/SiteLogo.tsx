import Link from "next/link";

interface SiteLogoProps {
  className?: string;
}

export function SiteLogo({ className = "text-lg" }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-block font-bold tracking-tight text-zinc-900 ${className}`}
    >
      Check<span className="text-red-700">My</span>Food
    </Link>
  );
}
