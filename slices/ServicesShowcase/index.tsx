import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/layout/section";
import { ServicesBrowser } from "@/components/slices/services-showcase/services-browser";
import { getSectionAnchorId } from "@/lib/utils";

export type ServicesShowcaseProps =
  SliceComponentProps<Content.ServicesShowcaseSlice>;

const ServicesShowcase: FC<ServicesShowcaseProps> = ({ slice }) => {
  const sectionId = getSectionAnchorId(
    (slice.primary as { section_id?: string | null }).section_id,
  );

  return (
    <section
      className="bg-night py-16 text-rose-white scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      <Section>
        <ServicesBrowser
          label={slice.primary.label}
          services={slice.items}
          subtext={slice.primary.subtext}
          title={slice.primary.title}
        />
      </Section>
    </section>
  );
};

export default ServicesShowcase;
