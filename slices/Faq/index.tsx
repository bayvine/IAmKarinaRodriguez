import { FC } from "react";
import * as prismic from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { SectionIntro } from "@/components/common/section-intro";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { FaqItem } from "@/components/slices/faq/faq-item";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn, getSectionAnchorId } from "@/lib/utils";

type FaqSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"light" | "dark">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    intro: prismic.RichTextField;
  };
  items: Array<{
    question: prismic.KeyTextField;
    answer: prismic.RichTextField;
  }>;
  slice_label: string | null;
  slice_type: "faq";
  variation: "default";
  version: string;
};

export type FaqProps = SliceComponentProps<FaqSlice>;

const Faq: FC<FaqProps> = ({ slice }) => {
  const theme = slice.primary.theme === "dark" ? "dark" : "light";
  const tone = theme === "dark" ? "dark" : "light";
  const accent = theme === "dark" ? "accent-blue-linen" : "accent-bordeaux";
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const items = slice.items.filter(
    (item) =>
      prismic.isFilled.keyText(item.question) &&
      prismic.isFilled.richText(item.answer),
  );

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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="min-w-0">
            <SectionIntro
              accent={accent}
              className="max-w-none"
              label={
                prismic.isFilled.keyText(slice.primary.label) ? (
                  <Reveal
                    className="inline-block"
                    transition={{
                      duration: 0.64,
                      delay: 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    y={0}
                  >
                    {slice.primary.label}
                  </Reveal>
                ) : null
              }
              layout="stacked"
              title={
                prismic.isFilled.richText(slice.primary.title)
                  ? renderSectionTitle(slice.primary.title)
                  : null
              }
              tone={tone}
              body={
                prismic.isFilled.richText(slice.primary.intro)
                  ? (
                    <Reveal
                      delay={0.28}
                      transition={{
                        duration: 0.72,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      y={0}
                    >
                      {renderSectionSubtext(slice.primary.intro, { tone })}
                    </Reveal>
                  )
                  : null
              }
            />
          </div>

          {items.length ? (
            <div className={cn("border-t", theme === "dark" ? "border-rose-white/16" : "border-night/10", "lg:border-t-0")}>
              {items.map((item, index) => (
                <Reveal
                  delay={0.2 + index * 0.08}
                  key={`${item.question ?? "faq"}-${index}`}
                  transition={{
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  y={18}
                >
                  <FaqItem
                    answer={renderSectionSubtext(item.answer, { tone })}
                    question={item.question ?? ""}
                    theme={theme}
                  />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </Section>
    </section>
  );
};

export default Faq;
