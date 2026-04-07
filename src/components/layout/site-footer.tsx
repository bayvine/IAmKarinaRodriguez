import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import { MediaFill } from "@/components/common/media-fill";
import { SocialLinks } from "@/components/common/social-links";
import { FooterLinkColumn } from "@/components/layout/footer-link-column";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import { HeroCtaButton } from "@/components/slices/hero/hero-action-link";
import { getGlobalFooterData } from "@/lib/global-footer";
import { getGlobalNavContactDetails, getGlobalNavSocialLinks } from "@/lib/global-nav";
import { siteConfig } from "@/lib/site-config";

function FooterLogo({ logo }: { logo: prismic.ImageField | undefined }) {
  if (prismic.isFilled.image(logo)) {
    return (
      <div className="relative h-12 w-[9.5rem] ">
        <PrismicNextImage
          field={logo}
          fill
          className="object-contain object-left"
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
  const [footer, socialLinks, globalContact] = await Promise.all([
    getGlobalFooterData(),
    getGlobalNavSocialLinks(),
    getGlobalNavContactDetails(),
  ]);
  const currentYear = new Date().getFullYear();
  const contactItems = [...footer.contactItems];
  const emailUrl =
    globalContact.emailLink && "url" in globalContact.emailLink
      ? globalContact.emailLink.url
      : null;
  const phoneUrl =
    globalContact.phoneLink && "url" in globalContact.phoneLink
      ? globalContact.phoneLink.url
      : null;

  if (
    globalContact.email &&
    emailUrl &&
    !contactItems.some(
      (item) =>
        prismic.isFilled.link(item.link) &&
        item.link.link_type === "Web" &&
        "url" in item.link &&
        item.link.url === emailUrl,
    )
  ) {
    contactItems.push({
      label: globalContact.email,
      link: globalContact.emailLink as prismic.LinkField,
    });
  }

  if (
    globalContact.phone &&
    phoneUrl &&
    !contactItems.some(
      (item) =>
        prismic.isFilled.link(item.link) &&
        item.link.link_type === "Web" &&
        "url" in item.link &&
        item.link.url === phoneUrl,
    )
  ) {
    contactItems.push({
      label: globalContact.phone,
      link: globalContact.phoneLink as prismic.LinkField,
    });
  }

  const hasContactItems = contactItems.length > 0;
  const hasQuickLinks = footer.quickLinks.length > 0;
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

          <Section className="relative z-10 flex min-h-[18rem] items-center justify-center py-16 text-center sm:min-h-[21rem] lg:min-h-[40rem]">
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

      <Section className="pb-8 pt-10 sm:pb-10  lg:pb-12">
        {hasContactItems || hasQuickLinks ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] max-w-fit lg:gap-16">
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
          </div>
        ) : null}

        <Reveal
          className="mt-10 border-t border-rose-white/10 pt-6 sm:mt-12 sm:pt-7"
          delay={0.22}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          y={16}
        >
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end lg:gap-8">
            <div className="order-1 lg:order-3 lg:justify-self-end">
              <SocialLinks
                className="justify-start"
                links={socialLinks}
                tone="dark"
              />
            </div>

            <div className="order-2 lg:order-1">
              <FooterLogo logo={footer.logo} />
            </div>

            <p className="order-3 font-sans text-sm text-rose-white/54 lg:order-2 lg:text-center">
              {copyrightText}
            </p>
          </div>
        </Reveal>
      </Section>
    </footer>
  );
}
