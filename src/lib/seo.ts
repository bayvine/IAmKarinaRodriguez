import type { Metadata } from "next";
import * as prismic from "@prismicio/client";

import { siteConfig } from "@/lib/site-config";

type BuildPageMetadataOptions = {
  title?: string | null;
  description?: string | null;
  path?: string;
  image?: prismic.ImageField | null;
  noIndex?: boolean;
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function getSiteUrl() {
  return trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      "http://localhost:3000",
  );
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}

function getCanonicalPath(path = "/") {
  if (!path || path === "/") {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function getSocialImages(image?: prismic.ImageField | null) {
  if (!image || !prismic.isFilled.image(image) || !image.url) {
    return undefined;
  }

  return [
    {
      url: image.url,
      width: image.dimensions?.width,
      height: image.dimensions?.height,
      alt: image.alt || siteConfig.name,
    },
  ];
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const resolvedTitle = title?.trim() || siteConfig.name;
  const resolvedDescription = description?.trim() || siteConfig.description;
  const canonicalPath = getCanonicalPath(path);
  const socialImages = getSocialImages(image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      url: canonicalPath,
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: siteConfig.name,
      locale: "en_US",
      images: socialImages,
    },
    twitter: {
      card: socialImages?.length ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description: resolvedDescription,
      images: socialImages?.map((item) => item.url),
    },
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: getMetadataBase(),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: "/",
    },
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
      shortcut: ["/favicon.ico"],
    },
    manifest: "/site.webmanifest",
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        }
      : undefined,
    ...buildPageMetadata({}),
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Karina Rodriguez",
        url: siteUrl,
        jobTitle: "Coach",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#business`,
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
      },
    ],
  };
}

type SliceWithItems = {
  slice_type?: string;
  items?: Array<Record<string, unknown>>;
};

export function buildFaqJsonLdFromSlices(slices: SliceWithItems[]) {
  const entries = slices
    .filter((slice) => slice.slice_type === "faq")
    .flatMap((slice) => slice.items ?? [])
    .map((item) => {
      const question =
        typeof item.question === "string" ? item.question.trim() : "";
      const answer = Array.isArray(item.answer)
        ? prismic.asText(item.answer as prismic.RichTextField).trim()
        : typeof item.answer === "string"
          ? item.answer.trim()
          : "";

      if (!question || !answer) {
        return null;
      }

      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      };
    })
    .filter(Boolean);

  if (!entries.length) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries,
  };
}
