import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { SectionIntro } from "@/components/common/section-intro";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { ExpandableVideoCard } from "@/components/slices/media-highlight/expandable-video-card";
import { ImageStatisticsCard } from "@/components/slices/media-highlight/image-statistics-card";
import { getSectionAnchorId } from "@/lib/utils";

export type MediaHighlightProps =
  SliceComponentProps<Content.MediaHighlightSlice>;

const MediaHighlight: FC<MediaHighlightProps> = ({ slice }) => {
  const variant = slice.primary.media_variant || "image";
  const sectionId = getSectionAnchorId(
    (slice.primary as { section_id?: prismic.KeyTextField }).section_id,
  );

  return (
    <section
      className="bg-rose-white py-16 text-night scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <SectionIntro
          accent="accent-bordeaux"
          body={
            prismic.isFilled.richText(slice.primary.subtext) ? (
              <Reveal
                transition={{
                  duration: 0.72,
                  delay: 0.34,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                {renderSectionSubtext(slice.primary.subtext)}
              </Reveal>
            ) : null
          }
          label={
            prismic.isFilled.keyText(slice.primary.label) ? (
              <Reveal
                className="inline-block"
                transition={{
                  duration: 0.64,
                  delay: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                {slice.primary.label}
              </Reveal>
            ) : null
          }
          title={
            prismic.isFilled.richText(slice.primary.title)
              ? renderSectionTitle(slice.primary.title)
              : null
          }
        />

        <Reveal
          className="mt-10 sm:mt-14 lg:mt-16"
          delay={0.28}
          transition={{ duration: 0.96, ease: [0.22, 1, 0.36, 1] }}
          y={52}
        >
          {variant === "video" ? (
            <ExpandableVideoCard video={slice.primary.video_media} />
          ) : (
            <ImageStatisticsCard
              image={slice.primary.image}
              statistics={slice.items}
            />
          )}
        </Reveal>
      </Section>
    </section>
  );
};

export default MediaHighlight;
