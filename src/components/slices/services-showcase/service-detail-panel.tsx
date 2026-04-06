"use client";

import * as prismic from "@prismicio/client";
import { motion } from "framer-motion";

import { HeroCtaButton } from "@/components/slices/hero/hero-action-link";
import { ServiceDetailMedia } from "@/components/slices/services-showcase/service-detail-media";
import { renderSectionSubtext } from "@/lib/prismic-rich-text";
import { getDisplayTextProps } from "@/lib/typography";

type ServiceDetailPanelProps = {
  id: string;
  title: prismic.KeyTextField;
  text: prismic.RichTextField;
  media: prismic.LinkToMediaField;
  buttonLabel: prismic.KeyTextField;
  buttonLink: prismic.LinkField;
};

const detailHeading = getDisplayTextProps("section", "heading4");

export function ServiceDetailPanel({
  id,
  title,
  text,
  media,
  buttonLabel,
  buttonLink,
}: ServiceDetailPanelProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 sm:space-y-6"
      exit={{ opacity: 0, y: 18 }}
      id={`service-panel-${id}`}
      initial={{ opacity: 0, y: 18 }}
      role="tabpanel"
      transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
    >
      <ServiceDetailMedia media={media} />

      <div className="space-y-3 sm:space-y-4">
        {prismic.isFilled.keyText(title) ? (
          <h3 className={detailHeading.className} style={detailHeading.style}>
            {title}
          </h3>
        ) : null}

        {prismic.isFilled.richText(text) ? (
          <div className="max-w-2xl text-rose-white">
            {renderSectionSubtext(text, { tone: "dark" })}
          </div>
        ) : null}

        {prismic.isFilled.link(buttonLink) &&
        prismic.isFilled.keyText(buttonLabel) ? (
          <div className="pt-3 sm:pt-4">
            <HeroCtaButton field={buttonLink} label={buttonLabel} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
