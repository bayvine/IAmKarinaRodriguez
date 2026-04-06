import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { SectionIntro } from "@/components/common/section-intro";
import { Reveal } from "@/components/motion/reveal";
import { ChecklistItem } from "@/components/slices/checklist-feature/checklist-item";
import { renderSectionTitle } from "@/lib/prismic-rich-text";

export type ChecklistFeatureProps =
  SliceComponentProps<Content.ChecklistFeatureSlice>;

const ChecklistFeature: FC<ChecklistFeatureProps> = ({ slice }) => {
  const filledItems = slice.items.filter((item) =>
    prismic.isFilled.richText(item.item_text),
  );

  return (
    <section
      className="bg-rose-white py-16 text-night sm:py-24 lg:py-28"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="section-left-shell mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col xl:flex-row justify-between gap-5">
          <div className="">
            <SectionIntro
              accent="accent-bordeaux"
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
              titleClassName="max-w-none"
            />

            {filledItems.length ? (
              <div className="mt-10 flex flex-col gap-5 md:flex-row">
                {filledItems.map((item, index) => (
                  <ChecklistItem
                    delay={0.28 + index * 0.12}
                    key={`${index}-${prismic.asText(item.item_text)}`}
                    text={item.item_text}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {prismic.isFilled.image(slice.primary.image) ? (
            <Reveal
              className=" bg-night xl:aspect-none bleed-right-desktop"
              delay={0.28}
              transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
              y={0}
            >
              <div className="relative w-full h-100 xl:w-175 xl:h-[500] overflow-hidden">
                <PrismicNextImage
                  field={slice.primary.image}
                  fill
                  imgixParams={{ fit: "crop" }}
                  className="object-cover w-full "
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ChecklistFeature;
