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
    <div className="flex w-full flex-col items-center text-rose-white text-center lg:ml-auto lg:max-w-[220px] lg:items-end lg:text-right">
      <StackedAvatarList
        className="w-fit self-center lg:self-end"
        images={avatars}
      />

      {hasText ? (
        <div className="mt-4 flex w-full flex-col items-center gap-1 text-center lg:items-end lg:text-right">
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
                <p className="font-sans text-base text-rose-white">
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
