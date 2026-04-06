import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { ServicesBrowser } from "@/components/slices/services-showcase/services-browser";

export type ServicesShowcaseProps =
  SliceComponentProps<Content.ServicesShowcaseSlice>;

const ServicesShowcase: FC<ServicesShowcaseProps> = ({ slice }) => {
  return (
    <section
      className="bg-night py-16 text-rose-white"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <ServicesBrowser
          label={slice.primary.label}
          services={slice.items}
          subtext={slice.primary.subtext}
          title={slice.primary.title}
        />
      </div>
    </section>
  );
};

export default ServicesShowcase;
