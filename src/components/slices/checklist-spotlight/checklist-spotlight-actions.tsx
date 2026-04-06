import * as prismic from "@prismicio/client";

import {
  HeroCtaButton,
  HeroDarkButton,
  HeroOutlineDarkButton,
  HeroSecondaryButton,
} from "@/components/slices/hero/hero-action-link";
import { Reveal } from "@/components/motion/reveal";

type ChecklistSpotlightActionsProps = {
  primaryLabel: prismic.KeyTextField;
  primaryLink: prismic.LinkField;
  secondaryLabel: prismic.KeyTextField;
  secondaryLink: prismic.LinkField;
  theme?: "light" | "dark";
};

export function ChecklistSpotlightActions({
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
  theme = "dark",
}: ChecklistSpotlightActionsProps) {
  const hasPrimary =
    prismic.isFilled.keyText(primaryLabel) && prismic.isFilled.link(primaryLink);
  const hasSecondary =
    prismic.isFilled.keyText(secondaryLabel) &&
    prismic.isFilled.link(secondaryLink);

  if (!hasPrimary && !hasSecondary) {
    return null;
  }

  const PrimaryButton = theme === "dark" ? HeroCtaButton : HeroDarkButton;
  const SecondaryButton =
    theme === "dark" ? HeroSecondaryButton : HeroOutlineDarkButton;

  return (
    <Reveal
      className="mt-6 flex flex-wrap gap-3 lg:mt-8"
      transition={{ duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      y={16}
    >
      {hasPrimary ? (
        <PrimaryButton field={primaryLink} label={primaryLabel} />
      ) : null}
      {hasSecondary ? (
        <SecondaryButton field={secondaryLink} label={secondaryLabel} />
      ) : null}
    </Reveal>
  );
}
