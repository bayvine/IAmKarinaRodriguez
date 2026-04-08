import * as prismic from "@prismicio/client";

import { siteConfig } from "@/lib/site-config";
import { createClient, linkResolver } from "@/prismicio";

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
    seo_site_name?: prismic.KeyTextField;
    seo_default_description?: prismic.KeyTextField;
    seo_default_image?: prismic.ImageField;
    navigation_links?: GlobalNavLinkGroupItem[];
    primary_cta_label?: prismic.KeyTextField;
    primary_cta_link?: prismic.LinkField;
    contact_email?: prismic.KeyTextField;
    contact_phone?: prismic.KeyTextField;
    social_links?: GlobalNavSocialLinkItem[];
    instagram_link?: prismic.LinkField;
    linkedin_link?: prismic.LinkField;
    tiktok_link?: prismic.LinkField;
    youtube_link?: prismic.LinkField;
    facebook_link?: prismic.LinkField;
    x_link?: prismic.LinkField;
  };
};

const FALLBACK_NAVIGATION_LINKS = [
  {
    label: "About",
    link: {
      link_type: "Web",
      url: "#about",
    } as prismic.LinkField,
  },
  {
    label: "Services",
    link: {
      link_type: "Web",
      url: "#services",
    } as prismic.LinkField,
  },
  {
    label: "Workshops",
    link: {
      link_type: "Web",
      url: "#workshops",
    } as prismic.LinkField,
  },
  {
    label: "Testimonials",
    link: {
      link_type: "Web",
      url: "#testimonials",
    } as prismic.LinkField,
  },
] as const;

const FALLBACK_PRIMARY_CTA = {
  label: "Free Discovery Call",
  link: {
    link_type: "Web",
    url: "#contact",
  } as prismic.LinkField,
} as const;

function getTrimmedKeyText(value: prismic.KeyTextField | undefined) {
  if (!prismic.isFilled.keyText(value)) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

export function buildEmailLink(email: string): prismic.LinkField {
  return {
    link_type: "Web",
    url: `mailto:${email}`,
  } as prismic.LinkField;
}

export function buildPhoneLink(phone: string): prismic.LinkField {
  return {
    link_type: "Web",
    url: `tel:${phone.replace(/[^\d+]/g, "")}`,
  } as prismic.LinkField;
}

export function normalizePrismicLink(
  link: prismic.LinkField | undefined,
): prismic.LinkField | null {
  if (!link) {
    return null;
  }

  if (prismic.isFilled.link(link)) {
    return link;
  }

  const resolvedUrl = prismic.asLink(link, { linkResolver });

  if (resolvedUrl) {
    return {
      link_type: "Web",
      url: resolvedUrl,
    } as prismic.LinkField;
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
  const client = await createClient({
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
      : [...FALLBACK_NAVIGATION_LINKS],
    ctaLabel: prismic.isFilled.keyText(document?.data?.primary_cta_label)
      ? document.data.primary_cta_label
      : FALLBACK_PRIMARY_CTA.label,
    ctaLink:
      normalizePrismicLink(document?.data?.primary_cta_link) ??
      FALLBACK_PRIMARY_CTA.link,
  };
}

export async function getGlobalNavSeoData() {
  const document = await getGlobalNavDocument();
  const siteName =
    getTrimmedKeyText(document?.data?.seo_site_name) ??
    getTrimmedKeyText(document?.data?.header_brand_name) ??
    siteConfig.name;
  const description =
    getTrimmedKeyText(document?.data?.seo_default_description) ??
    siteConfig.description;
  const image = prismic.isFilled.image(document?.data?.seo_default_image)
    ? document.data.seo_default_image
    : null;

  return {
    siteName,
    description,
    image,
  };
}

export async function getGlobalNavContactDetails() {
  const document = await getGlobalNavDocument();
  const email = getTrimmedKeyText(document?.data?.contact_email);
  const phone = getTrimmedKeyText(document?.data?.contact_phone);

  return {
    email,
    phone,
    emailLink: email ? buildEmailLink(email) : null,
    phoneLink: phone ? buildPhoneLink(phone) : null,
  };
}
