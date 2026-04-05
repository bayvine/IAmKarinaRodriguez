/* eslint-disable @next/next/no-img-element */
import * as prismic from "@prismicio/client";

import { cn } from "@/lib/utils";

type StackedAvatarListProps = {
  images: prismic.ImageField[];
  className?: string;
};

export function StackedAvatarList({
  images,
  className,
}: StackedAvatarListProps) {
  const filledImages = images.filter((image) => prismic.isFilled.image(image));

  if (filledImages.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center", className)}>
      {filledImages.map((image, index) => (
        <div
          className={cn(
            "relative h-12 w-12 overflow-hidden rounded-full border-2 border-rose-white/90 bg-disabled-rose-white shadow-[0_12px_30px_-18px_rgba(0,0,0,0.65)]",
            index > 0 && "-ml-3",
          )}
          key={`${image.url}-${index}`}
        >
          <img
            alt={image.alt ?? ""}
            className="h-full w-full object-cover"
            height={image.dimensions?.height ?? 96}
            src={image.url}
            width={image.dimensions?.width ?? 96}
          />
        </div>
      ))}
    </div>
  );
}
