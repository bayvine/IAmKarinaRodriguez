import type { Metadata } from "next";
import * as prismic from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { notFound } from "next/navigation";

import { getGlobalNavSeoData } from "@/lib/global-nav";
import { createClient } from "@/prismicio";
import { buildFaqJsonLdFromSlices, buildPageMetadata } from "@/lib/seo";
import { components } from "@/slices";

type PageRouteProps = {
  params: Promise<{
    uid: string;
  }>;
};

export const dynamicParams = true;

type GenericPageDocument = prismic.PrismicDocument<
  {
    page_title: prismic.KeyTextField;
    meta_title: prismic.KeyTextField;
    meta_description: prismic.KeyTextField;
    meta_image: prismic.ImageField;
    slices: prismic.SliceZone;
  },
  "page"
>;

async function getPage(uid: string) {
  const client = await createClient();

  const page = (await client
    .getByUID("page" as never, uid)
    .catch((error: unknown) => {
      if (error instanceof prismic.NotFoundError) {
        return null;
      }

      throw error;
    })) as GenericPageDocument | null;

  return page;
}

export async function generateStaticParams() {
  const client = await createClient();
  const pages = ((await client.getAllByType("page" as never).catch(() => [])) ??
    []) as GenericPageDocument[];

  return pages
    .filter((page) => !!page.uid)
    .map((page) => ({
      uid: page.uid,
    }));
}

export async function generateMetadata({
  params,
}: PageRouteProps): Promise<Metadata> {
  const { uid } = await params;
  const [page, seoData] = await Promise.all([
    getPage(uid),
    getGlobalNavSeoData(),
  ]);

  if (!page) {
    return buildPageMetadata({
      title: seoData.siteName,
      path: `/${uid}`,
      noIndex: true,
      siteName: seoData.siteName,
      fallbackTitle: seoData.siteName,
      fallbackDescription: seoData.description,
    });
  }

  return buildPageMetadata({
    title:
      page.data.meta_title ||
      page.data.page_title ||
      seoData.siteName,
    description: page.data.meta_description,
    image: page.data.meta_image ?? seoData.image,
    path: `/${uid}`,
    siteName: seoData.siteName,
    fallbackTitle: seoData.siteName,
    fallbackDescription: seoData.description,
  });
}

export default async function GenericPage({
  params,
}: PageRouteProps) {
  const { uid } = await params;
  const page = await getPage(uid);

  if (!page) {
    notFound();
  }

  const faqJsonLd = buildFaqJsonLdFromSlices(page.data.slices);

  return (
    <>
      {faqJsonLd ? (
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
          type="application/ld+json"
        />
      ) : null}
      <SliceZone components={components} slices={page.data.slices} />
    </>
  );
}
