import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { MediaFill } from "@/components/common/media-fill";
import { Section } from "@/components/layout/section";
import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import { HeroActions } from "@/components/slices/hero/hero-actions";
import { HeroProofStack } from "@/components/slices/hero/hero-proof-stack";
import { getDisplayTextProps } from "@/lib/typography";
import { getSectionAnchorId } from "@/lib/utils";
import {
  HeroFadeReveal,
  HeroRaiseReveal,
} from "@/components/slices/hero/hero-reveal";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const avatars = slice.items.map((item) => item.avatar_image);
  const sectionId = getSectionAnchorId(
    (slice.primary as { section_id?: prismic.KeyTextField }).section_id,
  );
  const heroHeading1 = getDisplayTextProps("hero", "heading1");
  const heroHeading2 = getDisplayTextProps("hero", "heading2");
  const heroHeading3 = getDisplayTextProps("hero", "heading3");
  const heroHeading4 = getDisplayTextProps("hero", "heading4");

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-night text-rose-white scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <div className="absolute inset-0 -z-30 bg-night" />

      <div className="absolute inset-0 -z-20">
        <MediaFill media={slice.primary.background_media} />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-white/8 via-night/12 to-night/78" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[52%] bg-gradient-to-t from-night via-night/44 to-transparent" />

      <Section className="flex min-h-[100svh] flex-col justify-end pb-10 pt-36 sm:pb-12 sm:pt-40 lg:pb-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-8">
          <div className="mx-auto max-w-3xl lg:mx-0">
            {prismic.isFilled.richText(slice.primary.title) ? (
              <div className="max-w-full sm:max-w-4xl lg:text-left">
                <PrismicRichText
                  components={{
                    heading1: ({ children }) => (
                      <StaggeredTextReveal
                        as="h1"
                        className={heroHeading1.className}
                        delay={0.28}
                        style={heroHeading1.style}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                    heading2: ({ children }) => (
                      <StaggeredTextReveal
                        as="h2"
                        className={heroHeading2.className}
                        delay={0.28}
                        style={heroHeading2.style}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                    heading3: ({ children }) => (
                      <StaggeredTextReveal
                        as="h3"
                        className={heroHeading3.className}
                        delay={0.28}
                        style={heroHeading3.style}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                    heading4: ({ children }) => (
                      <StaggeredTextReveal
                        as="h4"
                        className={heroHeading4.className}
                        delay={0.28}
                        style={heroHeading4.style}
                      >
                        {children}
                      </StaggeredTextReveal>
                    ),
                  }}
                  field={slice.primary.title}
                />
              </div>
            ) : null}

            {prismic.isFilled.richText(slice.primary.subtitle) ? (
              <HeroRaiseReveal
                className="mx-auto mt-5 max-w-2xl border-t border-rose-white/14 pt-5 text-center font-sans text-base text-rose-white/78 sm:mt-6 sm:pt-6 sm:text-lg lg:mx-0 lg:border-t-0 lg:pt-0 lg:text-left"
                delay={0.76}
              >
                <PrismicRichText
                  components={{
                    paragraph: ({ children }) => <p>{children}</p>,
                  }}
                  field={slice.primary.subtitle}
                />
              </HeroRaiseReveal>
            ) : null}

            <div className="mt-8 flex justify-center sm:mt-10 lg:block">
              <HeroActions
                ctaLabel={slice.primary.cta_label}
                ctaLink={slice.primary.cta_link}
                secondaryLabel={slice.primary.secondary_label}
                secondaryLink={slice.primary.secondary_link}
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroFadeReveal delay={1.34}>
              <HeroProofStack
                avatars={avatars}
                text={slice.primary.proof_text}
              />
            </HeroFadeReveal>
          </div>
        </div>
      </Section>
    </section>
  );
};

export default Hero;
