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

type MediaGallerySlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"light" | "dark">;
    layout?: prismic.SelectField<"auto" | "single" | "two-up">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
  };
  items: Array<{
    image: prismic.ImageField;
    media: prismic.LinkToMediaField;
    caption: prismic.RichTextField;
  }>;
  slice_label: string | null;
  slice_type: "media_gallery";
  variation: "default";
  version: string;
};

export type MediaGalleryProps = SliceComponentProps<MediaGallerySlice>;

const MediaGallery: FC<MediaGalleryProps> = ({ slice }) => {
  const theme = slice.primary.theme === "dark" ? "dark" : "light";
  const tone = theme === "dark" ? "dark" : "light";
  const accent = theme === "dark" ? "bg-accent-blue-linen" : "bg-accent-bordeaux";
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const hasLabel = prismic.isFilled.keyText(slice.primary.label);
  const hasTitle = prismic.isFilled.richText(slice.primary.title);
  const hasBody = prismic.isFilled.richText(slice.primary.body);
  const mediaItems = slice.items
    .filter(
      (item) =>
        prismic.isFilled.image(item.image) || prismic.isFilled.linkToMedia(item.media),
    )
    .map((item) => ({
      image: item.image,
      media: item.media,
      caption: item.caption,
    }));
  const layout = slice.primary.layout === "single"
    ? "single"
    : slice.primary.layout === "two-up"
      ? "two-up"
      : "auto";

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
                className={cn("h-2 w-2 rounded-full", accent)}
              />
              {slice.primary.label}
            </Reveal>
          ) : null}

          {hasTitle ? (
            <div className={cn("max-w-3xl", hasLabel ? "mt-3 sm:mt-4" : undefined)}>
              {renderSectionTitle(slice.primary.title)}
            </div>
          ) : null}

          {hasBody ? (
            <Reveal
              className={cn(
                "max-w-4xl space-y-5",
                hasTitle || hasLabel ? "mt-6 sm:mt-7" : undefined,
              )}
              delay={0.26}
              transition={{
                duration: 0.76,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={18}
            >
              {renderLongFormRichText(slice.primary.body, { tone })}
            </Reveal>
          ) : null}

          {mediaItems.length ? (
            <div className={cn(hasBody || hasTitle || hasLabel ? "mt-8 sm:mt-10" : undefined)}>
              <EditorialMediaGrid
                items={mediaItems}
                layout={layout}
                tone={tone}
              />
            </div>
          ) : null}
        </div>
      </Section>
    </section>
  );
};

export default MediaGallery;
