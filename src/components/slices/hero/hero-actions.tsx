"use client";

import * as prismic from "@prismicio/client";

import {
  HeroActionReveal,
  HeroActionRevealItem,
} from "@/components/slices/hero/hero-action-reveal";
import {
  HeroCtaButton,
  HeroSecondaryButton,
} from "@/components/slices/hero/hero-action-link";

type HeroActionsProps = {
  ctaLabel: prismic.KeyTextField;
  ctaLink: prismic.LinkField;
  secondaryLabel: prismic.KeyTextField;
  secondaryLink: prismic.LinkField;
};

export function HeroActions({
  ctaLabel,
  ctaLink,
  secondaryLabel,
  secondaryLink,
}: HeroActionsProps) {
  const hasPrimary =
    prismic.isFilled.keyText(ctaLabel) && prismic.isFilled.link(ctaLink);
  const hasSecondary =
    prismic.isFilled.keyText(secondaryLabel) &&
    prismic.isFilled.link(secondaryLink);

  if (!hasPrimary && !hasSecondary) {
    return null;
  }

  return (
    <HeroActionReveal>
      <HeroActionRevealItem>
        <HeroCtaButton field={ctaLink} label={ctaLabel} />
      </HeroActionRevealItem>
      <HeroActionRevealItem>
        <HeroSecondaryButton field={secondaryLink} label={secondaryLabel} />
      </HeroActionRevealItem>
    </HeroActionReveal>
  );
}
