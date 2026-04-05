import * as prismic from "@prismicio/client";

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
    <div className="flex flex-col gap-3 sm:flex-row">
      <HeroCtaButton field={ctaLink} label={ctaLabel} />
      <HeroSecondaryButton field={secondaryLink} label={secondaryLabel} />
    </div>
  );
}
