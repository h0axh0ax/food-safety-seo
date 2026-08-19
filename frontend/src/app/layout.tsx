import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "CheckMyFood — Food Recall Lookup",
    template: "%s | CheckMyFood",
  },
  description:
    "Look up official food recall records by brand and product type.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#fafaf8]">{children}</body>
    </html>
  );
}
