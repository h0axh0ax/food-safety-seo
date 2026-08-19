import Link from "next/link";

import { SiteLogo } from "@/components/SiteLogo";

const browseLinks = [
  { href: "/", label: "Directory" },
  { href: "/latest", label: "Latest" },
  { href: "/guides", label: "Guides" },
  { href: "/library", label: "Library" },
] as const;

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
            <SiteLogo />
            <p className="mt-4">
              <a
                href="mailto:contact@checkmyfood.net"
                className="text-sm font-medium text-zinc-700 transition-colors hover:text-red-800"
              >
                contact@checkmyfood.net
              </a>
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <FooterLinkList title="Browse" links={browseLinks} />
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList title="Legal" links={legalLinks} />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center sm:px-6">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} CheckMyFood. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Not affiliated with any government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
