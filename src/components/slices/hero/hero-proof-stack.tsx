import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import { StackedAvatarList } from "@/components/common/stacked-avatar-list";

type HeroProofStackProps = {
  avatars: prismic.ImageField[];
  text: prismic.RichTextField;
};

export function HeroProofStack({ avatars, text }: HeroProofStackProps) {
  const hasAvatars = avatars.some((avatar) => prismic.isFilled.image(avatar));
  const hasText = prismic.isFilled.richText(text);

  if (!hasAvatars && !hasText) {
    return null;
  }

  return (
    <div className="w-full max-w-xs text-rose-white sm:max-w-sm lg:text-right">
      <StackedAvatarList
        className="justify-start lg:justify-end"
        images={avatars}
      />

      {hasText ? (
        <div className="mt-4 space-y-1">
          <PrismicRichText
            components={{
              heading3: ({ children }) => (
                <h3
                  className="font-display text-4xl sm:text-5xl"
                  style={{ lineHeight: 0.9 }}
                >
                  {children}
                </h3>
              ),
              paragraph: ({ children }) => (
                <p className="font-sans text-sm text-rose-white/80">
                  {children}
                </p>
              ),
            }}
            field={text}
          />
        </div>
      ) : null}
    </div>
  );
}
