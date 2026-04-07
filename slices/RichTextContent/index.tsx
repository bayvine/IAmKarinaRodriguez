import { FC } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  renderLongFormRichText,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn, getSectionAnchorId } from "@/lib/utils";

type RichTextContentSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"light" | "dark">;
    image_position?: prismic.SelectField<"left" | "right">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
    image: prismic.ImageField;
  };
  items: [];
  slice_label: string | null;
  slice_type: "rich_text_content";
  variation: "default";
  version: string;
};

export type RichTextContentProps = SliceComponentProps<RichTextContentSlice>;

const RichTextContent: FC<RichTextContentProps> = ({ slice }) => {
  const theme = slice.primary.theme === "dark" ? "dark" : "light";
  const tone = theme === "dark" ? "dark" : "light";
  const accent = theme === "dark" ? "bg-accent-blue-linen" : "bg-accent-bordeaux";
  const imagePosition = slice.primary.image_position === "left" ? "left" : "right";
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const hasImage = prismic.isFilled.image(slice.primary.image);

  return (
    <section
      className={cn(
        "py-16 scroll-mt-24 sm:scroll-mt-28 sm:py-20 lg:scroll-mt-32 lg:py-24",
        theme === "dark" ? "bg-night text-rose-white" : "bg-rose-white text-night",
      )}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <div
          className={cn(
            hasImage
              ? "grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start xl:gap-14"
              : "mx-auto max-w-4xl",
          )}
        >
          <div
            className={cn(
              "min-w-0",
              hasImage
                ? imagePosition === "left"
                  ? "order-1 xl:order-2"
                  : "order-1 xl:order-1"
                : undefined,
            )}
          >
            {prismic.isFilled.keyText(slice.primary.label) ? (
              <Reveal
                className="inline-flex items-center gap-1.5 font-sans text-xs uppercase"
                transition={{
                  duration: 0.64,
                  delay: 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                <span
                  aria-hidden="true"
                  className={cn("h-2 w-2 rounded-full", accent)}
                />
                {slice.primary.label}
              </Reveal>
            ) : null}

            {prismic.isFilled.richText(slice.primary.title) ? (
              <div className={cn(prismic.isFilled.keyText(slice.primary.label) ? "mt-3 sm:mt-4" : undefined)}>
                {renderSectionTitle(slice.primary.title)}
              </div>
            ) : null}

            {prismic.isFilled.richText(slice.primary.body) ? (
              <Reveal
                className={cn(
                  "space-y-5",
                  hasImage ? "mt-6 max-w-2xl" : "mt-6 max-w-3xl",
                )}
                delay={0.28}
                transition={{
                  duration: 0.76,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={18}
              >
                {renderLongFormRichText(slice.primary.body, { tone })}
              </Reveal>
            ) : null}
          </div>

          {hasImage ? (
            <Reveal
              className={cn(
                "order-2 overflow-hidden",
                imagePosition === "left" ? "xl:order-1" : "xl:order-2",
              )}
              delay={0.22}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={0}
            >
              <div className="relative min-h-[22rem] sm:min-h-[26rem] xl:min-h-[34rem]">
                <PrismicNextImage
                  field={slice.primary.image}
                  fill
                  imgixParams={{ fit: "crop" }}
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </Section>
    </section>
  );
};

export default RichTextContent;
