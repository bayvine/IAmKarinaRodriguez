import { FC } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { HeroCtaButton } from "@/components/slices/hero/hero-action-link";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { getSectionAnchorId } from "@/lib/utils";

type EventHighlightSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
    background_image: prismic.ImageField;
    button_label: prismic.KeyTextField;
    button_link: prismic.LinkField;
  };
  items: Array<{
    detail_label: prismic.KeyTextField;
    detail_value: prismic.KeyTextField;
  }>;
  slice_label: string | null;
  slice_type: "event_highlight";
  variation: "default";
  version: string;
};

export type EventHighlightProps = SliceComponentProps<EventHighlightSlice>;

const EventHighlight: FC<EventHighlightProps> = ({ slice }) => {
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const details = slice.items.filter(
    (item) =>
      prismic.isFilled.keyText(item.detail_label) ||
      prismic.isFilled.keyText(item.detail_value),
  );

  return (
    <section
      className="bg-pure-white py-16 text-night scroll-mt-24 sm:scroll-mt-28 sm:py-20 lg:scroll-mt-32 lg:py-24"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <div className="relative isolate overflow-hidden bg-night">
          {prismic.isFilled.image(slice.primary.background_image) ? (
            <PrismicNextImage
              field={slice.primary.background_image}
              fill
              imgixParams={{ fit: "crop" }}
              className="object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-night/28" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/76 via-night/48 to-night/24" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/18 via-night/16 to-night/42" />
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-night/76 to-transparent" />

          <div className="relative z-10 flex min-h-[31rem] items-end px-6 py-8 sm:min-h-[34rem] sm:px-8 sm:py-10 lg:min-h-[36rem] lg:px-10 lg:py-12 xl:min-h-[38rem] xl:px-12">
            <div className="max-w-4xl">
              {prismic.isFilled.keyText(slice.primary.label) ? (
                <Reveal
                  className="inline-flex items-center gap-1.5 font-sans text-xs uppercase text-rose-white/76"
                  transition={{
                    duration: 0.64,
                    delay: 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  y={0}
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-accent-blue-linen"
                  />
                  {slice.primary.label}
                </Reveal>
              ) : null}

              <div className="mt-3 max-w-[11ch] text-rose-white sm:mt-4">
                {prismic.isFilled.richText(slice.primary.title)
                  ? renderSectionTitle(slice.primary.title)
                  : null}
              </div>

              {prismic.isFilled.richText(slice.primary.body) ? (
                <Reveal
                  className="mt-5 max-w-xl text-rose-white sm:mt-6"
                  delay={0.3}
                  transition={{
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  y={18}
                >
                  {renderSectionSubtext(slice.primary.body, { tone: "dark" })}
                </Reveal>
              ) : null}

              <div className="mt-8 flex flex-col gap-6 sm:mt-10 lg:flex-row lg:items-end lg:gap-12">
                {prismic.isFilled.keyText(slice.primary.button_label) &&
                prismic.isFilled.link(slice.primary.button_link) ? (
                  <Reveal
                    delay={0.38}
                    transition={{
                      duration: 0.72,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    y={14}
                  >
                    <HeroCtaButton
                      className="w-full sm:w-auto"
                      field={slice.primary.button_link}
                      label={slice.primary.button_label}
                    />
                  </Reveal>
                ) : null}

                {details.length ? (
                  <Reveal
                    className="grid gap-4 text-rose-white sm:grid-cols-2 lg:grid-cols-none lg:grid-flow-col lg:gap-8 xl:gap-12"
                    delay={0.44}
                    transition={{
                      duration: 0.74,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    y={16}
                  >
                    {details.map((detail, index) => (
                      <div
                        className="min-w-0"
                        key={`${detail.detail_label ?? "detail"}-${index}`}
                      >
                        {prismic.isFilled.keyText(detail.detail_label) ? (
                          <p className="font-sans text-xs text-rose-white/68">
                            {detail.detail_label}
                          </p>
                        ) : null}

                        {prismic.isFilled.keyText(detail.detail_value) ? (
                          <p className="mt-0.5 font-sans text-base text-rose-white sm:text-lg">
                            {detail.detail_value}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </Reveal>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </section>
  );
};

export default EventHighlight;
