import * as prismic from "@prismicio/client";

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

type GlobalNavDocumentLike = {
  data?: {
    social_links?: GlobalNavSocialLinkItem[];
    instagram_link?: prismic.LinkField;
    linkedin_link?: prismic.LinkField;
    tiktok_link?: prismic.LinkField;
    youtube_link?: prismic.LinkField;
    facebook_link?: prismic.LinkField;
    x_link?: prismic.LinkField;
  };
};

function normalizeSocialLink(
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

export async function getGlobalNavSocialLinks() {
  const client = createClient({
    fetchOptions: {
      cache: "no-store",
    },
  });
  const document = (await client
    .getSingle("global_nav")
    .catch(() => null)) as GlobalNavDocumentLike | null;

  const socialLinks = document?.data?.social_links ?? [];
  const groupedLinks = socialLinks.flatMap((item) => {
    if (!item.platform) {
      return [];
    }

    const normalizedLink = normalizeSocialLink(item.link);

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
    const normalizedLink = normalizeSocialLink(link);

    if (normalizedLink) {
      fallbackLinks.push({ platform, link: normalizedLink });
    }
  }

  return fallbackLinks;
}
