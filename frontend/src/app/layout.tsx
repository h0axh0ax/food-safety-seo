import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Food Safety Recalls",
    template: "%s | Food Safety Recalls",
  },
  description:
    "Official FDA food recall lookup powered by OpenFDA enforcement data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
