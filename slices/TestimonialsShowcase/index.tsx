import { FC } from "react";
import * as prismic from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MoveRight } from "lucide-react";

import { SectionIntro } from "@/components/common/section-intro";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { TestimonialCard } from "@/components/slices/testimonials-showcase/testimonial-card";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn, getSectionAnchorId } from "@/lib/utils";

type TestimonialsShowcaseSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    subtext: prismic.RichTextField;
  };
  items: Array<{
    person_name: prismic.KeyTextField;
    person_title: prismic.KeyTextField;
    testimonial_text: prismic.RichTextField;
    media: prismic.LinkToMediaField;
  }>;
  slice_label: string | null;
  slice_type: "testimonials_showcase";
  variation: "default";
  version: string;
};

export type TestimonialsShowcaseProps =
  SliceComponentProps<TestimonialsShowcaseSlice>;

const TestimonialsShowcase: FC<TestimonialsShowcaseProps> = ({ slice }) => {
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const testimonials = slice.items.filter(
    (item) =>
      prismic.isFilled.linkToMedia(item.media) ||
      prismic.isFilled.keyText(item.person_name) ||
      prismic.isFilled.keyText(item.person_title) ||
      prismic.isFilled.richText(item.testimonial_text),
  );
  const hasRailLayout = testimonials.length > 2;
  const hasSingleTestimonial = testimonials.length === 1;

  return (
    <section
      className="bg-rose-white py-16 text-night scroll-mt-24 sm:scroll-mt-28 sm:py-20 lg:scroll-mt-32 lg:py-24"
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

        {testimonials.length ? (
          <div className="mt-10 sm:mt-12 lg:mt-16">
            {hasRailLayout ? (
              <Reveal
                className="mb-4 flex items-center justify-between lg:hidden"
                delay={0.24}
                transition={{
                  duration: 0.64,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={10}
              >
                <p className="font-sans text-xs uppercase text-night">
                  Swipe through stories
                </p>
                <span className="flex items-center gap-2 text-night">
                 
                  <MoveRight className="h-3.5 w-3.5" />
                </span>
              </Reveal>
            ) : null}

            <div className="relative overflow-hidden">
              {hasRailLayout ? (
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-rose-white/50 via-rose-white/20 to-transparent lg:hidden" />
              ) : null}

              <div
                className={cn(
                  "grid gap-4 pb-1 lg:pb-0 xl:gap-7",
                  hasRailLayout
                    ? "auto-cols-[84vw] grid-flow-col overflow-x-auto overflow-y-hidden no-scrollbar overscroll-x-contain overscroll-y-none pr-10 snap-x snap-mandatory touch-pan-x sm:auto-cols-[22rem] sm:gap-5"
                    : hasSingleTestimonial
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2 lg:gap-6",
                  hasRailLayout &&
                    "lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pr-0 lg:snap-none",
                )}
              >
                {testimonials.map((testimonial, index) => {
                  const key =
                    testimonial.person_name ??
                    testimonial.person_title ??
                    `testimonial-${index}`;

                  return (
                    <Reveal
                      className={cn(
                        "w-full overflow-hidden",
                        hasRailLayout && "snap-start",
                      )}
                      delay={0.18 + index * 0.08}
                      key={`${key}-${index}`}
                      transition={{
                        duration: 0.76,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      y={24}
                    >
                      <TestimonialCard
                        className={
                          hasSingleTestimonial ? "mx-auto w-full" : undefined
                        }
                        media={testimonial.media}
                        name={testimonial.person_name}
                        role={testimonial.person_title}
                        text={testimonial.testimonial_text}
                        variant={hasSingleTestimonial ? "featured" : "default"}
                      />
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Section>
    </section>
  );
};

export default TestimonialsShowcase;
