"use client";

import { useRef, useState } from "react";
import * as prismic from "@prismicio/client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPrismicMediaKind } from "@/lib/prismic-media";

type ExpandableVideoCardProps = {
  video: prismic.LinkToMediaField;
  className?: string;
};

export function ExpandableVideoCard({
  video,
  className,
}: ExpandableVideoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!prismic.isFilled.linkToMedia(video)) {
    return null;
  }

  if (getPrismicMediaKind(video) !== "video") {
    return null;
  }

  async function handleExpand() {
    const element = videoRef.current;

    setIsExpanded(true);

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
    <motion.div
      layout
      className={cn(
        "relative overflow-hidden bg-night shadow-[0_42px_120px_-70px_rgba(26,24,24,0.65)]",
        isExpanded
          ? "aspect-[16/10.8] sm:aspect-[16/8.7]"
          : "aspect-[16/11.75] sm:aspect-[16/9.7] lg:aspect-[16/8.25]",
        className,
      )}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
    >
      <video
        ref={videoRef}
        className="mobile-video-clean h-full w-full object-cover"
        controls={isExpanded}
        playsInline
        preload="metadata"
      >
        <source src={video.url} />
      </video>

      <motion.div
        animate={{
          opacity: isExpanded ? 0 : 1,
          scale: isExpanded ? 1.03 : 1,
        }}
        className={cn(
          "absolute inset-0",
          isExpanded ? "pointer-events-none" : "pointer-events-auto",
        )}
        transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
      >
        <button
          aria-label={video.text || "Play video"}
          className="group relative flex h-full w-full items-end justify-start p-5 text-left sm:p-7"
          onClick={handleExpand}
          type="button"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-night/76 via-night/26 to-night/8" />
          <div className="relative inline-flex w-full max-w-[18rem] items-center justify-between gap-4 rounded-[1.35rem] border border-rose-white/18 bg-rose-white/12 px-4 py-3 text-rose-white backdrop-blur-sm transition duration-500 group-hover:bg-rose-white/18 sm:w-auto sm:max-w-none sm:justify-start sm:gap-3 sm:rounded-full">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-white text-night">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
            <span className="font-sans text-sm sm:text-base">
              Play video with sound
            </span>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
}
