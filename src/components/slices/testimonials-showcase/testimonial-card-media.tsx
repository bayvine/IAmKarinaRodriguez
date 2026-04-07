/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import * as prismic from "@prismicio/client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

import { getPrismicMediaKind } from "@/lib/prismic-media";

type TestimonialCardMediaProps = {
  media: prismic.LinkToMediaField;
};

export function TestimonialCardMedia({
  media,
}: TestimonialCardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!prismic.isFilled.linkToMedia(media)) {
    return <div className="absolute inset-0 bg-night/80" />;
  }

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
    async function startPlayback() {
      const element = videoRef.current;

      setHasStarted(true);

      if (!element) {
        return;
      }

      try {
        await element.play();
      } catch {}
    }

    async function handleTogglePlayback() {
      const element = videoRef.current;

      if (!element) {
        return;
      }

      if (element.paused) {
        try {
          await element.play();
        } catch {}
        return;
      }

      element.pause();
    }

    function handleToggleMuted() {
      const element = videoRef.current;

      if (!element) {
        return;
      }

      const nextMuted = !element.muted;

      element.muted = nextMuted;
      setIsMuted(nextMuted);
    }

    if (!isMounted) {
      return <div className="absolute inset-0 bg-night/80" />;
    }

    return (
      <>
        <video
          ref={videoRef}
          className="mobile-video-clean absolute inset-0 h-full w-full object-cover"
          muted={isMuted}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          playsInline
          preload="metadata"
        >
          <source src={media.url} />
        </video>

        {!hasStarted ? (
          <button
            aria-label={media.text || "Play testimonial video"}
            className="group absolute inset-0 z-10 flex items-center justify-center"
            onClick={startPlayback}
            type="button"
          >
            <span className="absolute inset-0 bg-night/10 transition duration-500 group-hover:bg-night/18" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pure-white text-night shadow-[0_20px_48px_-26px_rgba(0,0,0,0.6)] transition duration-500 group-hover:scale-105">
              <Play className="ml-1 h-5 w-5 fill-current" />
            </span>
          </button>
        ) : null}

        {hasStarted ? (
          <>
            <button
              aria-label={isPlaying ? "Pause video" : "Play video"}
              aria-pressed={isPlaying}
              className="group absolute inset-0 z-10 flex items-center justify-center"
              onClick={handleTogglePlayback}
              type="button"
            >
              <span
                className={
                  isPlaying
                    ? "absolute inset-0 bg-transparent transition duration-500 group-hover:bg-night/12"
                    : "absolute inset-0 bg-night/16 transition duration-500 group-hover:bg-night/22"
                }
              />
              <span
                className={
                  isPlaying
                    ? "relative flex h-14 w-14 items-center justify-center rounded-full bg-pure-white/18 text-rose-white opacity-0 shadow-[0_20px_48px_-26px_rgba(0,0,0,0.6)] backdrop-blur-md transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                    : "relative flex h-14 w-14 items-center justify-center rounded-full bg-pure-white text-night shadow-[0_20px_48px_-26px_rgba(0,0,0,0.6)] transition duration-500 group-hover:scale-105"
                }
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-1 h-5 w-5 fill-current" />
                )}
              </span>
            </button>

            <div className="absolute right-4 top-4 z-20 sm:right-5 sm:top-5">
              <button
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                aria-pressed={isMuted}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pure-white/18 text-rose-white shadow-[0_20px_42px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-pure-white/24"
                onClick={handleToggleMuted}
                type="button"
              >
                {isMuted ? (
                  <VolumeX className="h-4.5 w-4.5" />
                ) : (
                  <Volume2 className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </>
        ) : null}
      </>
    );
  }

  return <div className="absolute inset-0 bg-night/80" />;
}
