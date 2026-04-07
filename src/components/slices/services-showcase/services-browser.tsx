"use client";

import { memo, useState } from "react";
import * as prismic from "@prismicio/client";
import { AnimatePresence } from "framer-motion";

import { SectionIntro } from "@/components/common/section-intro";
import { Reveal } from "@/components/motion/reveal";
import { ServiceDetailPanel } from "@/components/slices/services-showcase/service-detail-panel";
import { ServiceSelectorButton } from "@/components/slices/services-showcase/service-selector-button";
import {
  renderSectionSubtext,
  renderSectionTitle,
} from "@/lib/prismic-rich-text";

type ServiceItem = {
  service_title: prismic.KeyTextField;
  service_text: prismic.RichTextField;
  service_media: prismic.LinkToMediaField;
  button_label: prismic.KeyTextField;
  button_link: prismic.LinkField;
};

type ServicesBrowserProps = {
  label: prismic.KeyTextField;
  title: prismic.RichTextField;
  subtext: prismic.RichTextField;
  services: ServiceItem[];
};

const ServicesIntro = memo(function ServicesIntro({
  label,
  title,
  subtext,
}: {
  label: prismic.KeyTextField;
  title: prismic.RichTextField;
  subtext: prismic.RichTextField;
}) {
  return (
    <SectionIntro
      accent="accent-blue-linen"
      body={
        prismic.isFilled.richText(subtext) ? (
          <Reveal
            transition={{
              duration: 0.72,
              delay: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            y={0}
          >
            {renderSectionSubtext(subtext, { tone: "dark" })}
          </Reveal>
        ) : null
      }
      label={
        prismic.isFilled.keyText(label) ? (
          <Reveal
            className="inline-block"
            transition={{
              duration: 0.64,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            y={0}
          >
            {label}
          </Reveal>
        ) : null
      }
      layout="stacked"
      title={
        prismic.isFilled.richText(title)
          ? renderSectionTitle(title)
          : null
      }
      tone="dark"
    />
  );
});

function getServiceId(label: string, index: number) {
  return `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
}

export function ServicesBrowser({
  label,
  title,
  subtext,
  services,
}: ServicesBrowserProps) {
  const filledServices = services.filter((service) =>
    prismic.isFilled.keyText(service.service_title),
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!filledServices.length) {
    return null;
  }

  const activeIndex = Math.min(selectedIndex, filledServices.length - 1);
  const activeService = filledServices[activeIndex];
  const activeServiceId = getServiceId(activeService.service_title ?? "service", activeIndex);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)] lg:gap-14 xl:gap-16">
      <div className="lg:pt-1">
        <ServicesIntro label={label} subtext={subtext} title={title} />

        <div
          aria-label="Services"
          className="mt-6 sm:mt-8 lg:mt-16"
          role="tablist"
        >
          <div className="overflow-x-auto no-scrollbar pb-1 sm:pb-3 lg:overflow-visible lg:pb-0">
            <div className="flex min-w-max gap-4 pr-4 lg:min-w-0 lg:flex-col lg:gap-0 lg:pr-0">
            {filledServices.map((service, index) => {
              const id = getServiceId(service.service_title ?? "service", index);

              return (
                <ServiceSelectorButton
                  active={index === activeIndex}
                  id={id}
                  index={index}
                  key={id}
                  label={service.service_title ?? "Service"}
                  onSelect={setSelectedIndex}
                />
              );
            })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 lg:mt-0 lg:pt-4">
        <AnimatePresence mode="wait">
          <ServiceDetailPanel
            buttonLabel={activeService.button_label}
            buttonLink={activeService.button_link}
            id={activeServiceId}
            key={activeServiceId}
            media={activeService.service_media}
            text={activeService.service_text}
            title={activeService.service_title}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
