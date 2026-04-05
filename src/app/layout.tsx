import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";

import { repositoryName } from "@/prismicio";
import { siteConfig } from "@/lib/site-config";

import { gambarino, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${gambarino.variable} scroll-smooth`}
      lang="en"
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(182,74,42,0.22),transparent_32%),linear-gradient(180deg,#f7f0e8_0%,#f4ece3_54%,#eee1d3_100%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(28,20,13,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(28,20,13,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
        {children}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
