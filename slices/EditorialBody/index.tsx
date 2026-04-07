import { FC } from "react";
import * as prismic from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { EditorialMediaGrid } from "@/components/common/editorial-media-grid";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  renderLongFormRichText,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn, getSectionAnchorId } from "@/lib/utils";

type EditorialBodySlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"light" | "dark">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    intro_body: prismic.RichTextField;
    bottom_body: prismic.RichTextField;
  };
  items: Array<{
    media_image: prismic.ImageField;
    media_caption: prismic.RichTextField;
  }>;
  slice_label: string | null;
  slice_type: "editorial_body";
  variation: "default";
  version: string;
};

export type EditorialBodyProps = SliceComponentProps<EditorialBodySlice>;

const EditorialBody: FC<EditorialBodyProps> = ({ slice }) => {
  const theme = slice.primary.theme === "dark" ? "dark" : "light";
  const tone = theme === "dark" ? "dark" : "light";
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const hasLabel = prismic.isFilled.keyText(slice.primary.label);
  const hasTitle = prismic.isFilled.richText(slice.primary.title);
  const hasIntroBody = prismic.isFilled.richText(slice.primary.intro_body);
  const hasBottomBody = prismic.isFilled.richText(slice.primary.bottom_body);
  const mediaItems = slice.items
    .filter((item) => prismic.isFilled.image(item.media_image))
    .map((item) => ({
      image: item.media_image,
      caption: item.media_caption,
    }));

  return (
    <section
      className={cn(
        "py-16 scroll-mt-24 sm:scroll-mt-28 sm:py-20 lg:scroll-mt-32 lg:py-24",
        theme === "dark" ? "bg-night text-rose-white" : "bg-pure-white text-night",
      )}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <div>
          {hasLabel ? (
            <Reveal
              className={cn(
                "inline-flex items-center gap-1.5 font-sans text-xs uppercase",
                theme === "dark" ? "text-rose-white/76" : "text-night/60",
              )}
              transition={{
                duration: 0.64,
                delay: 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={0}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2 w-2 rounded-full",
                  theme === "dark" ? "bg-accent-blue-linen" : "bg-accent-bordeaux",
                )}
              />
              {slice.primary.label}
            </Reveal>
          ) : null}

          {hasTitle ? (
            <div className={cn("max-w-3xl", hasLabel ? "mt-3 sm:mt-4" : undefined)}>
              {renderSectionTitle(slice.primary.title)}
            </div>
          ) : null}

          {hasIntroBody ? (
            <Reveal
              className={cn(
                "max-w-5xl space-y-5",
                hasTitle || hasLabel ? "mt-6 sm:mt-7" : undefined,
              )}
              delay={0.26}
              transition={{
                duration: 0.76,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={18}
            >
              {renderLongFormRichText(slice.primary.intro_body, { tone })}
            </Reveal>
          ) : null}

          {mediaItems.length ? (
            <div className={cn(hasIntroBody || hasTitle || hasLabel ? "mt-8 sm:mt-10" : undefined)}>
              <EditorialMediaGrid
                items={mediaItems}
                layout={mediaItems.length > 1 ? "two-up" : "single"}
                tone={tone}
              />
            </div>
          ) : null}

          {hasBottomBody ? (
            <Reveal
              className={cn(
                "max-w-5xl space-y-5",
                mediaItems.length || hasIntroBody || hasTitle || hasLabel ? "mt-6 sm:mt-8" : undefined,
              )}
              delay={mediaItems.length ? 0.34 : 0.26}
              transition={{
                duration: 0.76,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={18}
            >
              {renderLongFormRichText(slice.primary.bottom_body, { tone })}
            </Reveal>
          ) : null}
        </div>
      </Section>
    </section>
  );
};

export default EditorialBody;
