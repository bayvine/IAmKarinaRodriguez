import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getGlobalNavSeoData } from "@/lib/global-nav";
import { buildOrganizationJsonLd, buildRootMetadata } from "@/lib/seo";
import { repositoryName } from "@/prismicio";

import { gambarino, inter } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getGlobalNavSeoData();

  return buildRootMetadata({
    siteName: seoData.siteName,
    description: seoData.description,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoData = await getGlobalNavSeoData();
  const organizationJsonLd = buildOrganizationJsonLd({
    siteName: seoData.siteName,
    description: seoData.description,
  });

  return (
    <html
      className={`${inter.variable} ${gambarino.variable} scroll-smooth`}
      lang="en"
    >
      <body className="flex min-h-screen flex-col bg-rose-white font-sans text-night antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
          type="application/ld+json"
        />
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
