import * as prismic from "@prismicio/client";

import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/prismicio";

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "x";

type GlobalNavSocialLinkItem = {
  platform?: prismic.SelectField<SocialPlatform>;
  link?: prismic.LinkField;
};

type GlobalNavLinkGroupItem = {
  label?: prismic.KeyTextField;
  link?: prismic.LinkField;
};

type GlobalNavDocumentLike = {
  data?: {
    header_logo?: prismic.ImageField;
    header_brand_name?: prismic.KeyTextField;
    navigation_links?: GlobalNavLinkGroupItem[];
    primary_cta_label?: prismic.KeyTextField;
    primary_cta_link?: prismic.LinkField;
    social_links?: GlobalNavSocialLinkItem[];
    instagram_link?: prismic.LinkField;
    linkedin_link?: prismic.LinkField;
    tiktok_link?: prismic.LinkField;
    youtube_link?: prismic.LinkField;
    facebook_link?: prismic.LinkField;
    x_link?: prismic.LinkField;
  };
};

export function normalizePrismicLink(
  link: prismic.LinkField | undefined,
): prismic.LinkField | null {
  if (!link) {
    return null;
  }

  if (prismic.isFilled.link(link)) {
    return link;
  }

  if (link.link_type === "Any" && typeof link.text === "string" && link.text) {
    return {
      link_type: "Web",
      url: link.text,
    } as prismic.LinkField;
  }

  return null;
}

export function normalizeLinkGroupItems(items: GlobalNavLinkGroupItem[] | undefined) {
  return (items ?? []).flatMap((item) => {
    if (!prismic.isFilled.keyText(item.label)) {
      return [];
    }

    const normalizedLink = normalizePrismicLink(item.link);

    if (!normalizedLink) {
      return [];
    }

    return [
      {
        label: item.label,
        link: normalizedLink,
      },
    ];
  });
}

async function getGlobalNavDocument() {
  const client = createClient({
    fetchOptions: {
      cache: "no-store",
    },
  });

  return (await client
    .getSingle("global_nav")
    .catch(() => null)) as GlobalNavDocumentLike | null;
}

function getSocialLinksFromDocument(document: GlobalNavDocumentLike | null) {
  const socialLinks = document?.data?.social_links ?? [];
  const groupedLinks = socialLinks.flatMap((item) => {
    if (!item.platform) {
      return [];
    }

    const normalizedLink = normalizePrismicLink(item.link);

    if (!normalizedLink) {
      return [];
    }

    return [
      {
        platform: item.platform,
        link: normalizedLink,
      },
    ];
  });

  if (groupedLinks.length) {
    return groupedLinks;
  }

  const directFieldMap: Array<[SocialPlatform, prismic.LinkField | undefined]> = [
    ["instagram", document?.data?.instagram_link],
    ["linkedin", document?.data?.linkedin_link],
    ["tiktok", document?.data?.tiktok_link],
    ["youtube", document?.data?.youtube_link],
    ["facebook", document?.data?.facebook_link],
    ["x", document?.data?.x_link],
  ];

  const fallbackLinks: Array<{
    platform: SocialPlatform;
    link: prismic.LinkField;
  }> = [];

  for (const [platform, link] of directFieldMap) {
    const normalizedLink = normalizePrismicLink(link);

    if (normalizedLink) {
      fallbackLinks.push({ platform, link: normalizedLink });
    }
  }

  return fallbackLinks;
}

export async function getGlobalNavSocialLinks() {
  const document = await getGlobalNavDocument();

  return getSocialLinksFromDocument(document);
}

export async function getGlobalNavHeaderData() {
  const document = await getGlobalNavDocument();
  const navigationLinks = normalizeLinkGroupItems(document?.data?.navigation_links);

  return {
    logo: document?.data?.header_logo,
    brandName: prismic.isFilled.keyText(document?.data?.header_brand_name)
      ? document.data.header_brand_name
      : "Karina Rodriguez",
    navigationLinks: navigationLinks.length
      ? navigationLinks
      : siteConfig.nav.map((item) => ({
          label: item.label,
          link: {
            link_type: "Web",
            url: item.href,
          } as prismic.LinkField,
        })),
    ctaLabel: prismic.isFilled.keyText(document?.data?.primary_cta_label)
      ? document.data.primary_cta_label
      : siteConfig.primaryCta.label,
    ctaLink:
      normalizePrismicLink(document?.data?.primary_cta_link) ??
      ({
        link_type: "Web",
        url: siteConfig.primaryCta.href,
      } as prismic.LinkField),
  };
}
