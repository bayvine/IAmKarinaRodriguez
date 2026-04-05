import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { MediaFill } from "@/components/common/media-fill";
import { HeroActions } from "@/components/slices/hero/hero-actions";
import { HeroProofStack } from "@/components/slices/hero/hero-proof-stack";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  const avatars = slice.items.map((item) => item.avatar_image);

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-night text-rose-white"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="absolute inset-0 -z-30 bg-night" />

      <div className="absolute inset-0 -z-20">
        <MediaFill media={slice.primary.background_media} />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-white/8 via-night/12 to-night/78" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[52%] bg-gradient-to-t from-night via-night/44 to-transparent" />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-6 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-10 lg:pb-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-8">
          <div className="max-w-3xl">
            {prismic.isFilled.richText(slice.primary.title) ? (
              <div className="max-w-4xl">
                <PrismicRichText
                  components={{
                    heading1: ({ children }) => (
                      <h1
                        className="font-display text-[3.15rem] sm:text-[4.15rem] lg:text-[5.1rem]"
                        style={{ lineHeight: 0.86 }}
                      >
                        {children}
                      </h1>
                    ),
                    heading2: ({ children }) => (
                      <h2
                        className="font-display text-[2.95rem] sm:text-[3.85rem] lg:text-[4.8rem]"
                        style={{ lineHeight: 0.87 }}
                      >
                        {children}
                      </h2>
                    ),
                    heading3: ({ children }) => (
                      <h3
                        className="font-display text-[2.65rem] sm:text-[3.45rem] lg:text-[4.1rem]"
                        style={{ lineHeight: 0.88 }}
                      >
                        {children}
                      </h3>
                    ),
                    heading4: ({ children }) => (
                      <h4
                        className="font-display text-[2.1rem] sm:text-[2.65rem] lg:text-[3.1rem]"
                        style={{ lineHeight: 0.9 }}
                      >
                        {children}
                      </h4>
                    ),
                  }}
                  field={slice.primary.title}
                />
              </div>
            ) : null}

            {prismic.isFilled.richText(slice.primary.subtitle) ? (
              <div className="mt-5 max-w-2xl font-sans text-base text-rose-white/78 sm:mt-6 sm:text-lg">
                <PrismicRichText
                  components={{
                    paragraph: ({ children }) => <p>{children}</p>,
                  }}
                  field={slice.primary.subtitle}
                />
              </div>
            ) : null}

            <div className="mt-8 sm:mt-10">
              <HeroActions
                ctaLabel={slice.primary.cta_label}
                ctaLink={slice.primary.cta_link}
                secondaryLabel={slice.primary.secondary_label}
                secondaryLink={slice.primary.secondary_link}
              />
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <HeroProofStack avatars={avatars} text={slice.primary.proof_text} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
