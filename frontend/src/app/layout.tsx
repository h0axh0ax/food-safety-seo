import type { Metadata } from "next";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#fafaf8]">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
