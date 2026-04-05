/* eslint-disable @next/next/no-img-element */
import * as prismic from "@prismicio/client";

import { cn } from "@/lib/utils";

type MediaFillProps = {
  media: prismic.LinkToMediaField;
  className?: string;
};

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)$/i;
const IMAGE_EXTENSIONS = /\.(avif|gif|heic|jpeg|jpg|png|svg|webp)$/i;

function getMediaKind(field: prismic.FilledLinkToMediaField) {
  const value = `${field.kind} ${field.name} ${field.url}`.toLowerCase();

  if (value.includes("video") || VIDEO_EXTENSIONS.test(value)) {
    return "video";
  }

  if (value.includes("image") || IMAGE_EXTENSIONS.test(value)) {
    return "image";
  }

  return "unknown";
}

export function MediaFill({ media, className }: MediaFillProps) {
  if (!prismic.isFilled.linkToMedia(media)) {
    return null;
  }

  const mediaKind = getMediaKind(media);

  if (mediaKind === "video") {
    return (
      <video
        autoPlay
        className={cn("h-full w-full object-cover", className)}
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={media.url} />
      </video>
    );
  }

  if (mediaKind === "image") {
    return (
      <img
        alt={media.text || ""}
        className={cn("h-full w-full object-cover", className)}
        fetchPriority="high"
        height={media.height ? Number(media.height) : undefined}
        loading="eager"
        src={media.url}
        width={media.width ? Number(media.width) : undefined}
      />
    );
  }

  return null;
}
