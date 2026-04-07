import * as prismic from "@prismicio/client";

import { normalizeLinkGroupItems, normalizePrismicLink } from "@/lib/global-nav";
import { createClient } from "@/prismicio";

type GlobalFooterLinkGroupItem = {
  label?: prismic.KeyTextField;
  link?: prismic.LinkField;
};

type GlobalFooterFieldsLike = {
  footer_cta_title?: prismic.RichTextField;
  footer_cta_button_label?: prismic.KeyTextField;
  footer_cta_button_link?: prismic.LinkField;
  footer_cta_media?: prismic.LinkToMediaField;
  footer_cta_image?: prismic.ImageField;
  footer_logo?: prismic.ImageField;
  footer_contact_heading?: prismic.KeyTextField;
  footer_quick_links_heading?: prismic.KeyTextField;
  footer_contact_items?: GlobalFooterLinkGroupItem[];
  footer_quick_links?: GlobalFooterLinkGroupItem[];
  footer_copyright_text?: prismic.KeyTextField;
};

type GlobalFooterDocumentLike = {
  data?: GlobalFooterFieldsLike;
};

async function getGlobalFooterDocument() {
  const client = createClient({
    fetchOptions: {
      cache: "no-store",
    },
  });
  const unsafeClient = client as typeof client & {
    getSingle: (type: string) => Promise<unknown>;
  };

  return (await unsafeClient
    .getSingle("global_footer")
    .catch(() => null)) as GlobalFooterDocumentLike | null;
}

async function getLegacyGlobalNavDocument() {
  const client = createClient({
    fetchOptions: {
      cache: "no-store",
    },
  });

  return (await client
    .getSingle("global_nav")
    .catch(() => null)) as GlobalFooterDocumentLike | null;
}

export async function getGlobalFooterData() {
  const [footerDocument, legacyDocument] = await Promise.all([
    getGlobalFooterDocument(),
    getLegacyGlobalNavDocument(),
  ]);

  const footerData = footerDocument?.data;
  const legacyData = legacyDocument?.data;

  return {
    ctaTitle: footerData?.footer_cta_title ?? legacyData?.footer_cta_title ?? [],
    ctaButtonLabel:
      footerData?.footer_cta_button_label ?? legacyData?.footer_cta_button_label ?? null,
    ctaButtonLink:
      normalizePrismicLink(footerData?.footer_cta_button_link) ??
      normalizePrismicLink(legacyData?.footer_cta_button_link) ??
      null,
    ctaMedia: footerData?.footer_cta_media ?? legacyData?.footer_cta_media,
    ctaImage: footerData?.footer_cta_image ?? legacyData?.footer_cta_image,
    logo: footerData?.footer_logo ?? legacyData?.footer_logo,
    contactHeading:
      footerData?.footer_contact_heading ?? legacyData?.footer_contact_heading ?? null,
    quickLinksHeading:
      footerData?.footer_quick_links_heading ??
      legacyData?.footer_quick_links_heading ??
      null,
    contactItems: normalizeLinkGroupItems(
      footerData?.footer_contact_items ?? legacyData?.footer_contact_items,
    ),
    quickLinks: normalizeLinkGroupItems(
      footerData?.footer_quick_links ?? legacyData?.footer_quick_links,
    ),
    copyrightText:
      footerData?.footer_copyright_text ?? legacyData?.footer_copyright_text ?? null,
  };
}
