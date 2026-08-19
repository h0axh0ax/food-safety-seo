"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { SiteLogo } from "@/components/SiteLogo";
import { SiteSearch } from "@/components/SiteSearch";

const navLinks = [
  {
    href: "/",
    label: "Directory",
    isActive: (pathname: string) =>
      pathname === "/" ||
      pathname.startsWith("/browse") ||
      pathname.startsWith("/recalls/") ||
      pathname.startsWith("/search"),
  },
  {
    href: "/latest",
    label: "Latest",
    isActive: (pathname: string) => pathname.startsWith("/latest"),
  },
  {
    href: "/guides",
    label: "Guides",
    isActive: (pathname: string) => pathname.startsWith("/guides"),
  },
  {
    href: "/library",
    label: "Library",
    isActive: (pathname: string) => pathname.startsWith("/library"),
  },
  {
    href: "/about",
    label: "About",
    isActive: (pathname: string) => pathname.startsWith("/about"),
  },
] as const;

function navLinkClass(isActive: boolean) {
  return isActive
    ? "text-red-800 font-semibold"
    : "text-zinc-600 hover:text-zinc-900";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-6">
          <SiteLogo />

          <nav
            className="flex items-center gap-4 sm:gap-5"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${navLinkClass(link.isActive(pathname))}`}
                aria-current={link.isActive(pathname) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Suspense fallback={null}>
          <SiteSearch />
        </Suspense>
      </div>
    </header>
  );
}
