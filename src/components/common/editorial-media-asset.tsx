/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { getPrismicMediaKind } from "@/lib/prismic-media";

type EditorialMediaAssetProps = {
  image?: prismic.ImageField | null;
  media?: prismic.LinkToMediaField | null;
};

export function EditorialMediaAsset({
  image,
  media,
}: EditorialMediaAssetProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (prismic.isFilled.linkToMedia(media)) {
    const mediaKind = getPrismicMediaKind(media);

    if (mediaKind === "image") {
      return (
        <img
          alt={media.text || ""}
          className="absolute inset-0 h-full w-full object-cover"
          height={media.height ? Number(media.height) : undefined}
          src={media.url}
          width={media.width ? Number(media.width) : undefined}
        />
      );
    }

    if (mediaKind === "video") {
      if (!isMounted) {
        return <div className="absolute inset-0 bg-night/8" />;
      }

      return (
        <video
          className="mobile-video-clean absolute inset-0 h-full w-full object-cover"
          controls
          playsInline
          preload="metadata"
        >
          <source src={media.url} />
        </video>
      );
    }
  }

  if (prismic.isFilled.image(image)) {
    return (
      <PrismicNextImage
        field={image}
        fill
        imgixParams={{ fit: "crop" }}
        className="object-cover"
      />
    );
  }

  return <div className="absolute inset-0 bg-night/8" />;
}
