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
      <body className="min-h-screen bg-rose-white font-sans text-night antialiased">
        {children}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
