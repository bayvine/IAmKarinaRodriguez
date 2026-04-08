import * as prismic from "@prismicio/client";
import Image from "next/image";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import { MediaFill } from "@/components/common/media-fill";
import { FooterLinkColumn } from "@/components/layout/footer-link-column";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import { HeroCtaButton } from "@/components/slices/hero/hero-action-link";
import { getGlobalFooterData } from "@/lib/global-footer";
import {
  getGlobalNavContactDetails,
  getGlobalNavHeaderData,
  getGlobalNavSocialLinks,
} from "@/lib/global-nav";
import { siteConfig } from "@/lib/site-config";

const socialPlatformLabels = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  x: "X",
} as const;

function FooterLogo({ logo }: { logo: prismic.ImageField | undefined }) {
  if (prismic.isFilled.image(logo)) {
    return (
      <div className="relative h-8 w-8 ">
        <Image
          alt={logo.alt ?? siteConfig.name}
          className="object-contain object-left"
          fill
          sizes="32px"
          src={logo.url}
        />
      </div>
    );
  }

  return (
    <div className="font-display text-3xl text-rose-white sm:text-[2.3rem]">
      <span className="block" style={{ lineHeight: 0.86 }}>
        Karina
      </span>
      <span className="block" style={{ lineHeight: 0.86 }}>
        Rodriguez
      </span>
    </div>
  );
}

export async function SiteFooter() {
  const [footer, socialLinks, globalContact, headerData] = await Promise.all([
    getGlobalFooterData(),
    getGlobalNavSocialLinks(),
    getGlobalNavContactDetails(),
    getGlobalNavHeaderData(),
  ]);
  const currentYear = new Date().getFullYear();
  const contactItems: Array<{ label: string; link: prismic.LinkField }> = [];

  if (footer.showContactPage) {
    contactItems.push({
      label: "Contact Me",
      link: {
        link_type: "Web",
        url: "/contact",
      } as prismic.LinkField,
    });
  }

  if (
    footer.showDiscoveryCall &&
    prismic.isFilled.keyText(headerData.ctaLabel) &&
    prismic.isFilled.link(headerData.ctaLink)
  ) {
    contactItems.push({
      label: headerData.ctaLabel,
      link: headerData.ctaLink,
    });
  }

  if (
    footer.showEmail &&
    globalContact.email &&
    globalContact.emailLink &&
    prismic.isFilled.link(globalContact.emailLink)
  ) {
    contactItems.push({
      label: globalContact.email,
      link: globalContact.emailLink,
    });
  }

  if (
    footer.showPhone &&
    globalContact.phone &&
    globalContact.phoneLink &&
    prismic.isFilled.link(globalContact.phoneLink)
  ) {
    contactItems.push({
      label: globalContact.phone,
      link: globalContact.phoneLink,
    });
  }

  for (const item of footer.contactExtraLinks) {
    contactItems.push(item);
  }

  const hasContactItems = contactItems.length > 0;
  const hasQuickLinks = footer.quickLinks.length > 0;
  const socialItems = socialLinks.map((item) => ({
    label: socialPlatformLabels[item.platform],
    link: item.link,
  }));
  const hasSocialItems = socialItems.length > 0;
  const hasCtaTitle = prismic.isFilled.richText(footer.ctaTitle);
  const hasCtaButton =
    prismic.isFilled.keyText(footer.ctaButtonLabel) &&
    prismic.isFilled.link(footer.ctaButtonLink);
  const hasCtaSection = hasCtaTitle || hasCtaButton;
  const ctaButtonLabel = hasCtaButton ? footer.ctaButtonLabel : null;
  const ctaButtonLink = hasCtaButton ? footer.ctaButtonLink : null;

  const copyrightText = prismic.isFilled.keyText(footer.copyrightText)
    ? footer.copyrightText
    : `© ${currentYear} ${siteConfig.name.toUpperCase()} | All rights reserved.`;

  return (
    <footer className="overflow-hidden bg-night text-rose-white">
      {hasCtaSection ? (
        <div className="relative isolate overflow-hidden bg-night">
          {prismic.isFilled.linkToMedia(footer.ctaMedia) ? (
            <MediaFill className="absolute inset-0" media={footer.ctaMedia} />
          ) : prismic.isFilled.image(footer.ctaImage) ? (
            <PrismicNextImage
              alt=""
              field={footer.ctaImage}
              fill
              className="object-cover"
              imgixParams={{ fit: "crop" }}
            />
          ) : null}

          <div className="absolute inset-0 bg-night/38" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/52 via-night/18 to-night/44" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/12 via-night/24 to-night/78" />
          <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-night via-night/96 via-night/76 to-transparent" />

          <Section className="relative z-10 flex min-h-[30rem] items-center justify-center py-10 text-center sm:min-h-[21rem] lg:min-h-[40rem]">
            <div className="max-w-10xl lg:-mt-20">
              {hasCtaTitle ? (
                <PrismicRichText
                  components={{
                    heading1: ({ children }) => (
                      <StaggeredTextReveal
                        amount={0.45}
                        as="h2"
                        className="mx-auto max-w-[25ch] text-5xl font-display text-rose-white"
                        delay={0.16}
                        revealMode="inView"
                        style={{ lineHeight: 0.94 }}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                    heading2: ({ children }) => (
                      <StaggeredTextReveal
                        amount={0.45}
                        as="h2"
                        className="mx-auto max-w-[16ch] font-display text-5xl text-rose-white sm:text-6xl lg:text-7xl"
                        delay={0.16}
                        revealMode="inView"
                        style={{ lineHeight: 0.94 }}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                  }}
                  field={footer.ctaTitle}
                />
              ) : null}

              {ctaButtonLink && ctaButtonLabel ? (
                <Reveal
                  className="mt-6 flex justify-center sm:mt-7"
                  delay={0.28}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  y={18}
                >
                  <HeroCtaButton
                    field={ctaButtonLink}
                    label={ctaButtonLabel}
                  />
                </Reveal>
              ) : null}
            </div>
          </Section>
        </div>
      ) : null}

      <Section className="pb-5 pt-0 lg:pb-6">
        {hasContactItems || hasQuickLinks || hasSocialItems ? (
          <div className="grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-8">
            <Reveal
              className="sm:col-span-2 lg:self-center"
              delay={0.04}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              y={20}
            >
              <FooterLogo logo={footer.logo} />
            </Reveal>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
              {hasContactItems ? (
                <Reveal
                  delay={0.08}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  y={20}
                >
                  <FooterLinkColumn
                    items={contactItems}
                    title={footer.contactHeading || "Contact"}
                  />
                </Reveal>
              ) : null}

              {hasQuickLinks ? (
                <Reveal
                  delay={0.16}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  y={20}
                >
                  <FooterLinkColumn
                    items={footer.quickLinks}
                    title={footer.quickLinksHeading || "Quick Links"}
                  />
                </Reveal>
              ) : null}

              {hasSocialItems ? (
                <Reveal
                  delay={0.28}
                  transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  y={20}
                >
                  <FooterLinkColumn
                    items={socialItems}
                    title="Socials"
                  />
                </Reveal>
              ) : null}
            </div>
          </div>
        ) : null}

        <Reveal
          className="mt-8 border-t border-rose-white/10 pt-5 text-center sm:mt-10 sm:pt-6"
          delay={0.22}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          y={16}
        >
          <p className="font-sans text-xs text-rose-white/60">{copyrightText}</p>
        </Reveal>
      </Section>
    </footer>
  );
}
