import { FC } from "react";
import * as prismic from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { SectionIntro } from "@/components/common/section-intro";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn, getSectionAnchorId } from "@/lib/utils";

type ProcessStepsSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"light" | "dark">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
  };
  items: Array<{
    step_title: prismic.KeyTextField;
    step_text: prismic.RichTextField;
  }>;
  slice_label: string | null;
  slice_type: "process_steps";
  variation: "default";
  version: string;
};

export type ProcessStepsProps = SliceComponentProps<ProcessStepsSlice>;

const ProcessSteps: FC<ProcessStepsProps> = ({ slice }) => {
  const theme = slice.primary.theme === "dark" ? "dark" : "light";
  const tone = theme === "dark" ? "dark" : "light";
  const accent = theme === "dark" ? "accent-blue-linen" : "accent-bordeaux";
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const steps = slice.items.filter(
    (item) =>
      prismic.isFilled.keyText(item.step_title) ||
      prismic.isFilled.richText(item.step_text),
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
        <SectionIntro
          accent={accent}
          body={
            prismic.isFilled.richText(slice.primary.body)
              ? (
                <Reveal
                  delay={0.28}
                  transition={{
                    duration: 0.72,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  y={0}
                >
                  {renderSectionSubtext(slice.primary.body, { tone })}
                </Reveal>
              )
              : null
          }
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
          title={
            prismic.isFilled.richText(slice.primary.title)
              ? renderSectionTitle(slice.primary.title)
              : null
          }
          tone={tone}
        />

        {steps.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                className={cn(
                  "border p-6 sm:p-7",
                  theme === "dark" ? "border-rose-white/16" : "border-night/10",
                )}
                delay={0.22 + index * 0.08}
                key={`${step.step_title ?? "step"}-${index}`}
                transition={{
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={18}
              >
                <div className="inline-flex items-center gap-1.5">
                  {/* <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rounded-full",
                      theme === "dark" ? "bg-accent-blue-linen" : "bg-accent-bordeaux",
                    )}
                  /> */}
                  <span
                    className={cn(
                      "font-sans text-sm font-semibold",
                      theme === "dark" ? "text-rose-white/82" : "text-night/70",
                    )}
                  >
                   (  {index + 1} )
                  </span>
                </div>

                {prismic.isFilled.keyText(step.step_title) ? (
                  <h3
                    className={cn(
                      "mt-5 font-sans text-2xl font-semibold sm:text-3xl",
                      theme === "dark" ? "text-rose-white" : "text-night",
                    )}
                  >
                    {step.step_title}
                  </h3>
                ) : null}

                {prismic.isFilled.richText(step.step_text) ? (
                  <div className="mt-4">
                    {renderSectionSubtext(step.step_text, { tone })}
                  </div>
                ) : null}
              </Reveal>
            ))}
          </div>
        ) : null}
      </Section>
    </section>
  );
};

export default ProcessSteps;
