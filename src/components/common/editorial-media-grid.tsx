import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import { EditorialMediaAsset } from "@/components/common/editorial-media-asset";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type EditorialMediaGridItem = {
  image?: prismic.ImageField | null;
  media?: prismic.LinkToMediaField | null;
  caption?: prismic.RichTextField | null;
};

type EditorialMediaGridProps = {
  items: EditorialMediaGridItem[];
  tone?: "light" | "dark";
  layout?: "auto" | "single" | "two-up";
  className?: string;
  itemDelayStart?: number;
};

export function EditorialMediaGrid({
  items,
  tone = "light",
  layout = "auto",
  className,
  itemDelayStart = 0.22,
}: EditorialMediaGridProps) {
  const mediaItems = items.filter(
    (item) =>
      prismic.isFilled.image(item.image) || prismic.isFilled.linkToMedia(item.media),
  );

  if (!mediaItems.length) {
    return null;
  }

  const isTwoUp = layout === "two-up" || (layout === "auto" && mediaItems.length > 1);
  const captionTextClassName =
    tone === "dark" ? "text-rose-white/72" : "text-night/72";
  const captionLinkClassName =
    tone === "dark"
      ? "underline decoration-rose-white/24 underline-offset-4 transition duration-300 hover:text-pure-white"
      : "underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night";

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        isTwoUp ? "md:grid-cols-2" : "mx-auto max-w-4xl",
        className,
      )}
    >
      {mediaItems.map((item, index) => (
        <Reveal
          className="min-w-0"
          delay={itemDelayStart + index * 0.08}
          key={`media-${index}`}
          transition={{
            duration: 0.76,
            ease: [0.22, 1, 0.36, 1],
          }}
          y={18}
        >
          <figure className="space-y-3 sm:space-y-4">
            <div className="relative overflow-hidden bg-night/6 aspect-[4/3]">
              <EditorialMediaAsset image={item.image} media={item.media} />
            </div>

            {prismic.isFilled.richText(item.caption) ? (
              <figcaption>
                <PrismicRichText
                  components={{
                    paragraph: ({ children }) => (
                      <p className={cn("font-sans text-sm sm:text-base", captionTextClassName)}>
                        {children}
                      </p>
                    ),
                    hyperlink: ({ children, node }) => (
                      <a
                        className={captionLinkClassName}
                        href={node.data.url}
                      >
                        {children}
                      </a>
                    ),
                    list: ({ children }) => (
                      <ul className={cn("list-disc space-y-2 pl-5 font-sans text-sm sm:text-base", captionTextClassName)}>
                        {children}
                      </ul>
                    ),
                    oList: ({ children }) => (
                      <ol className={cn("list-decimal space-y-2 pl-5 font-sans text-sm sm:text-base", captionTextClassName)}>
                        {children}
                      </ol>
                    ),
                    listItem: ({ children }) => <li className="pl-1">{children}</li>,
                    oListItem: ({ children }) => <li className="pl-1">{children}</li>,
                  }}
                  field={item.caption}
                />
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
