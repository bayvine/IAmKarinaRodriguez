/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import * as prismic from "@prismicio/client";

import { cn } from "@/lib/utils";
import { getPrismicMediaAlt, getPrismicMediaKind } from "@/lib/prismic-media";

type MediaFillProps = {
  media: prismic.LinkToMediaField;
  className?: string;
};

export function MediaFill({ media, className }: MediaFillProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!prismic.isFilled.linkToMedia(media)) {
    return null;
  }

  const mediaKind = getPrismicMediaKind(media);

  if (mediaKind === "video") {
    if (!isMounted) {
      return <div aria-hidden="true" className={cn("h-full w-full", className)} />;
    }

    return (
      <video
        autoPlay
        className={cn("mobile-video-clean h-full w-full object-cover", className)}
        loop
        muted
        playsInline
        preload="metadata"
        suppressHydrationWarning
      >
        <source src={media.url} />
      </video>
    );
  }

  if (mediaKind === "image") {
    return (
      <img
        alt={getPrismicMediaAlt(media)}
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
