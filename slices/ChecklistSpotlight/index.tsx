import { FC } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { SectionIntro } from "@/components/common/section-intro";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { ChecklistSpotlightActions } from "@/components/slices/checklist-spotlight/checklist-spotlight-actions";
import { ChecklistSpotlightCard } from "@/components/slices/checklist-spotlight/checklist-spotlight-card";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";
import { cn } from "@/lib/utils";

type ChecklistSpotlightSlice = {
  id: string;
  primary: {
    theme?: prismic.SelectField<"dark" | "light">;
    image_position?: prismic.SelectField<"right" | "left">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
    image: prismic.ImageField;
    primary_button_label: prismic.KeyTextField;
    primary_button_link: prismic.LinkField;
    secondary_button_label: prismic.KeyTextField;
    secondary_button_link: prismic.LinkField;
  };
  items: Array<{
    item_title: prismic.KeyTextField;
    item_text: prismic.KeyTextField;
  }>;
  slice_label: string | null;
  slice_type: "checklist_spotlight";
  variation: "default";
  version: string;
};

export type ChecklistSpotlightProps =
  SliceComponentProps<ChecklistSpotlightSlice>;

const ChecklistSpotlight: FC<ChecklistSpotlightProps> = ({ slice }) => {
  const theme = slice.primary.theme === "light" ? "light" : "dark";
  const imagePosition = slice.primary.image_position === "left" ? "left" : "right";
  const tone = theme === "dark" ? "dark" : "light";
  const accent = theme === "dark" ? "accent-blue-linen" : "accent-bordeaux";

  const filledItems = slice.items.filter(
    (item) =>
      prismic.isFilled.keyText(item.item_title) ||
      prismic.isFilled.keyText(item.item_text),
  );

  return (
    <section
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        theme === "dark" ? "bg-night text-rose-white" : "bg-rose-white text-night",
      )}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Section>
        <div className={cn("grid gap-10  lg:items-start lg:gap-15", imagePosition === 'right' ? "xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" : "xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]")}>
          <div
            className={cn(
              "min-w-0",
              imagePosition === "left" ? "lg:order-2" : "lg:order-1",
            )}
          >
            <SectionIntro
              accent={accent}
              className="max-w-none"
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
              layout="stacked"
              title={
                prismic.isFilled.richText(slice.primary.title)
                  ? renderSectionTitle(slice.primary.title)
                  : null
              }
              tone={tone}
            />

            {prismic.isFilled.richText(slice.primary.body) ? (
              <Reveal
                className={cn(
                  "mt-4 max-w-xl",
                  theme === "dark" ? "text-rose-white" : "text-night",
                )}
                transition={{
                  duration: 0.72,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                y={0}
              >
                {renderSectionSubtext(slice.primary.body, { tone })}
              </Reveal>
            ) : null}

            {filledItems.length ? (
              <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                {filledItems.map((item, index) => (
                  <ChecklistSpotlightCard
                    delay={0.38 + index * 0.1}
                    key={`${index}-${item.item_title ?? item.item_text ?? "item"}`}
                    text={item.item_text}
                    theme={theme}
                    title={item.item_title}
                  />
                ))}
              </div>
            ) : null}

            <ChecklistSpotlightActions
              primaryLabel={slice.primary.primary_button_label}
              primaryLink={slice.primary.primary_button_link}
              secondaryLabel={slice.primary.secondary_button_label}
              secondaryLink={slice.primary.secondary_button_link}
              theme={theme}
            />
          </div>

          {prismic.isFilled.image(slice.primary.image) ? (
            <Reveal
              className={cn(
                "overflow-hidden",
                imagePosition === "left" ? "lg:order-1" : "lg:order-2",
              )}
              delay={0.26}
              transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
              y={0}
            >
              <div className="relative aspect-[16/12] overflow-hidden sm:aspect-1">
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

export default ChecklistSpotlight;
