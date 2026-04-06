/* eslint-disable @next/next/no-img-element */
import * as prismic from "@prismicio/client";

import { getPrismicMediaKind } from "@/lib/prismic-media";

type ServiceDetailMediaProps = {
  media: prismic.LinkToMediaField;
};

export function ServiceDetailMedia({ media }: ServiceDetailMediaProps) {
  if (!prismic.isFilled.linkToMedia(media)) {
    return null;
  }

  const mediaKind = getPrismicMediaKind(media);

  if (mediaKind === "image") {
    return (
      <div className="relative aspect-[16/11.5] overflow-hidden bg-night sm:aspect-[16/9.5] lg:aspect-[16/7.6]">
        <img
          alt={media.text || ""}
          className="h-full w-full object-cover"
          height={media.height ? Number(media.height) : undefined}
          src={media.url}
          width={media.width ? Number(media.width) : undefined}
        />
      </div>
    );
  }

  if (mediaKind === "video") {
    return (
      <div className="relative aspect-[16/11.5] overflow-hidden bg-night sm:aspect-[16/9.5] lg:aspect-[16/7.6]">
        <video
          className="mobile-video-clean h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
        >
          <source src={media.url} />
        </video>
      </div>
    );
  }

  return null;
}
