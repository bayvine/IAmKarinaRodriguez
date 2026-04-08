/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import * as prismic from "@prismicio/client";

import { getPrismicMediaAlt, getPrismicMediaKind } from "@/lib/prismic-media";

type ServiceDetailMediaProps = {
  media: prismic.LinkToMediaField;
};

export function ServiceDetailMedia({ media }: ServiceDetailMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncViewport = () => {
      setIsMobile(mediaQuery.matches);
    };

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  if (!prismic.isFilled.linkToMedia(media)) {
    return null;
  }

  const mediaKind = getPrismicMediaKind(media);

  if (mediaKind === "image") {
    return (
      <div className="relative aspect-[16/11.5] overflow-hidden bg-night sm:aspect-[16/9.5] lg:aspect-[16/7.6]">
        <img
          alt={getPrismicMediaAlt(media)}
          className="h-full w-full object-cover"
          height={media.height ? Number(media.height) : undefined}
          src={media.url}
          width={media.width ? Number(media.width) : undefined}
        />
      </div>
    );
  }

  if (mediaKind === "video") {
    async function handleStart() {
      const element = videoRef.current;

      setHasStarted(true);

      if (!element) {
        return;
      }

      try {
        await element.play();
      } catch {
        element.controls = true;
      }
    }

    return (
      <div className="relative aspect-[16/11.5] overflow-hidden bg-night sm:aspect-[16/9.5] lg:aspect-[16/7.6]">
        <video
          ref={videoRef}
          className="mobile-video-clean h-full w-full object-cover"
          controls={!isMobile || hasStarted}
          playsInline
          preload="metadata"
        >
          <source src={media.url} />
        </video>

        {isMobile && !hasStarted ? (
          <button
            aria-label={getPrismicMediaAlt(media, "Play video")}
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleStart}
            type="button"
          >
            <span className="sr-only">Play video</span>
          </button>
        ) : null}
      </div>
    );
  }

  return null;
}
