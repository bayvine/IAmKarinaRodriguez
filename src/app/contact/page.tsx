import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { notFound } from "next/navigation";

import { SocialLinks } from "@/components/common/social-links";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactShowcase } from "@/components/contact/contact-showcase";
import { FooterTextLink, footerLinkItemClassName } from "@/components/layout/footer-link-column";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import {
  getGlobalNavContactDetails,
  getGlobalNavHeaderData,
  getGlobalNavSocialLinks,
} from "@/lib/global-nav";
import { buildContactPageJsonLd, buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { createClient } from "@/prismicio";

type ContactPageDocument = {
  data?: {
    page_title?: prismic.KeyTextField;
    label?: prismic.KeyTextField;
    title?: prismic.RichTextField;
    intro?: prismic.RichTextField;
    submit_button_label?: prismic.KeyTextField;
    success_message?: prismic.KeyTextField;
    book_call_label?: prismic.KeyTextField;
    book_call_link?: prismic.LinkField;
    email_address?: prismic.KeyTextField;
    phone_number?: prismic.KeyTextField;
    meta_title?: prismic.KeyTextField;
    meta_description?: prismic.KeyTextField;
    meta_image?: prismic.ImageField;
    testimonials?: Array<{
      media?: prismic.LinkToMediaField;
      quote?: prismic.RichTextField;
      person_name?: prismic.KeyTextField;
      person_role?: prismic.KeyTextField;
    }>;
  };
};

async function getContactPage() {
  const client = await createClient();
  const unsafeClient = client as typeof client & {
    getSingle: (type: string) => Promise<unknown>;
  };

  return (await unsafeClient
    .getSingle("contact_page")
    .catch((error: unknown) => {
      if (error instanceof prismic.NotFoundError) {
        return null;
      }

      throw error;
    })) as ContactPageDocument | null;
}

export async function generateMetadata() {
  const page = await getContactPage();

  return buildPageMetadata({
    title:
      page?.data?.meta_title ||
      page?.data?.page_title ||
      "Contact Karina Rodriguez",
    description: page?.data?.meta_description,
    image: page?.data?.meta_image,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [page, socialLinks, headerData, globalContact] = await Promise.all([
    getContactPage(),
    getGlobalNavSocialLinks(),
    getGlobalNavHeaderData(),
    getGlobalNavContactDetails(),
  ]);

  if (!page?.data) {
    notFound();
  }

  const hasLabel = prismic.isFilled.keyText(page.data.label);
  const hasTitle = prismic.isFilled.richText(page.data.title);
  const hasIntro = prismic.isFilled.richText(page.data.intro);
  const titleText = hasTitle ? prismic.asText(page.data.title ?? []).trim() : "";
  const emailAddress = prismic.isFilled.keyText(page.data.email_address)
    ? page.data.email_address.trim()
    : globalContact.email;
  const phoneNumber = prismic.isFilled.keyText(page.data.phone_number)
    ? page.data.phone_number.trim()
    : globalContact.phone;
  const emailLink: prismic.LinkField | null =
    emailAddress === globalContact.email && globalContact.emailLink
      ? globalContact.emailLink
      : emailAddress
        ? {
            link_type: "Web",
            url: `mailto:${emailAddress}`,
          }
        : null;
  const phoneLink: prismic.LinkField | null =
    phoneNumber === globalContact.phone && globalContact.phoneLink
      ? globalContact.phoneLink
      : phoneNumber
        ? {
            link_type: "Web",
            url: `tel:${phoneNumber.replace(/[^\d+]/g, "")}`,
          }
        : null;
  const bookCallLink = prismic.isFilled.link(page.data.book_call_link)
    ? page.data.book_call_link
    : headerData.ctaLink;
  const bookCallLabel = prismic.isFilled.keyText(page.data.book_call_label)
    ? page.data.book_call_label
    : headerData.ctaLabel;
  const contactLinks = [
    prismic.isFilled.link(bookCallLink) && prismic.isFilled.keyText(bookCallLabel)
      ? { label: bookCallLabel, link: bookCallLink }
      : null,
    emailLink
      ? { label: emailAddress ?? "Email", link: emailLink }
      : null,
    phoneLink
      ? { label: phoneNumber ?? "Phone", link: phoneLink }
      : null,
  ].filter((item): item is { label: string; link: prismic.LinkField } => item !== null);
  const showcaseItems = (page.data.testimonials ?? []).map((item) => ({
    media: item.media ?? null,
    quote: item.quote ?? [],
    name: item.person_name ?? null,
    role: item.person_role ?? null,
  }));
  const contactLinkClassName = cn(
    footerLinkItemClassName,
    "text-rose-white after:bg-rose-white hover:text-pure-white focus-visible:text-pure-white",
  );
  const infoLabelClassName =
    "font-sans text-xs text-rose-white/54";

  return (
    <main className="bg-night pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-40">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildContactPageJsonLd()),
        }}
        type="application/ld+json"
      />

      <Section>
        <div className="overflow-hidden bg-pure-white lg:grid lg:auto-rows-fr lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div className="p-8 sm:p-10 lg:p-12 xl:px-14 xl:pb-14 xl:pt-16">
            {hasLabel ? (
              <Reveal
                className="inline-flex items-center gap-1.5 font-sans text-xs uppercase text-night/62"
                transition={{
                  duration: 0.64,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent-bordeaux"
                />
                {page.data.label}
              </Reveal>
            ) : null}

            {titleText ? (
              <div className={cn("max-w-md", hasLabel ? "mt-4" : undefined)}>
                <StaggeredTextReveal
                  amount={0.45}
                  as="h1"
                  className="font-display text-5xl text-night sm:text-6xl"
                  delay={0.16}
                  revealMode="inView"
                  style={{ lineHeight: 0.92 }}
                >
                  {titleText}
                </StaggeredTextReveal>
              </div>
            ) : null}

            {hasIntro ? (
              <Reveal
                className={cn("max-w-xl space-y-5", hasTitle || hasLabel ? "mt-5 sm:mt-6" : undefined)}
                delay={0.24}
                transition={{
                  duration: 0.76,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={18}
              >
                <PrismicRichText
                  components={{
                    paragraph: ({ children }) => (
                      <p className="font-sans text-base text-night/72 sm:text-lg">
                        {children}
                      </p>
                    ),
                    hyperlink: ({ children, node }) => (
                      <a
                        className="underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night"
                        href={node.data.url}
                      >
                        {children}
                      </a>
                    ),
                  }}
                  field={page.data.intro}
                />
              </Reveal>
            ) : null}

            <ContactForm
              submitLabel={page.data.submit_button_label}
              successMessage={page.data.success_message}
            />
          </div>

          <div className="bg-night text-rose-white lg:h-full">
            <ContactShowcase
              footer={
                contactLinks.length || socialLinks.length ? (
                  <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8">
                    {contactLinks.length ? (
                      <div>
                        <p className={infoLabelClassName}>Other Contact Options</p>
                        <ul className="mt-3 flex flex-col items-start gap-2.5">
                          {contactLinks.map((item) => (
                            <li key={`${item.label}-${item.link.link_type}`}>
                              <FooterTextLink
                                className={contactLinkClassName}
                                item={item}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {socialLinks.length ? (
                      <div>
                        <p className={infoLabelClassName}>My Socials</p>
                        <div className="mt-4">
                          <SocialLinks links={socialLinks} tone="dark" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null
              }
              items={showcaseItems}
            />
          </div>
        </div>
      </Section>
    </main>
  );
}
