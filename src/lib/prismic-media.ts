import * as prismic from "@prismicio/client";

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)$/i;
const IMAGE_EXTENSIONS = /\.(avif|gif|heic|jpeg|jpg|png|svg|webp)$/i;

export type PrismicMediaKind = "video" | "image" | "unknown";

export function getPrismicMediaKind(
  field: prismic.FilledLinkToMediaField,
): PrismicMediaKind {
  const value = `${field.kind} ${field.name} ${field.url}`.toLowerCase();

  if (value.includes("video") || VIDEO_EXTENSIONS.test(value)) {
    return "video";
  }

  if (value.includes("image") || IMAGE_EXTENSIONS.test(value)) {
    return "image";
  }

  return "unknown";
}
