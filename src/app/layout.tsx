import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
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
      <body className="flex min-h-screen flex-col bg-rose-white font-sans text-night antialiased">
        <SiteHeader />
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
