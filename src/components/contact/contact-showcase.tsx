/* eslint-disable @next/next/no-img-element */
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import * as prismic from "@prismicio/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getPrismicMediaKind } from "@/lib/prismic-media";
import { cn } from "@/lib/utils";

type ContactShowcaseItem = {
  media: prismic.LinkToMediaField | null;
  quote?: prismic.RichTextField;
  name?: prismic.KeyTextField;
  role?: prismic.KeyTextField;
};

type ContactShowcaseProps = {
  items: ContactShowcaseItem[];
  footer?: ReactNode;
};

const SLIDE_DURATION_MS = 5600;
const PROGRESS_RADIUS = 24;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

function ContactShowcaseMedia({
  media,
}: {
  media: prismic.LinkToMediaField | null;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!prismic.isFilled.linkToMedia(media)) {
    return <div className="absolute inset-0 bg-night/84" />;
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
    if (!isMounted) {
      return <div className="absolute inset-0 bg-night/84" />;
    }

    return (
      <video
        autoPlay
        className="mobile-video-clean absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={media.url} />
      </video>
    );
  }

  return <div className="absolute inset-0 bg-night/84" />;
}

export function ContactShowcase({
  items,
  footer,
}: ContactShowcaseProps) {
  const entries = items.filter(
    (item) =>
      prismic.isFilled.linkToMedia(item.media) ||
      prismic.isFilled.richText(item.quote) ||
      prismic.isFilled.keyText(item.name) ||
      prismic.isFilled.keyText(item.role),
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [timerCycle, setTimerCycle] = useState(0);

  useEffect(() => {
    if (entries.length < 2) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % entries.length);
    }, SLIDE_DURATION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, entries.length, timerCycle]);

  if (!entries.length) {
    return (
      <div className="relative flex min-h-[28rem] flex-none items-end overflow-hidden bg-night p-6 text-rose-white sm:min-h-[34rem] sm:p-8 lg:h-full lg:min-h-full lg:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-night via-night/94 to-accent-bordeaux/30" />
        <div className="relative z-10 max-w-md">
          <p className="font-display text-4xl sm:text-5xl" style={{ lineHeight: 0.92 }}>
            Let’s start the conversation.
          </p>
        </div>
      </div>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, entries.length - 1);
  const activeEntry = entries[safeActiveIndex];
  const quote = prismic.isFilled.richText(activeEntry.quote)
    ? prismic.asText(activeEntry.quote).trim()
    : "";

  function handlePrevious() {
    setTimerCycle((current) => current + 1);
    setActiveIndex((current) => (current - 1 + entries.length) % entries.length);
  }

  function handleNext() {
    setTimerCycle((current) => current + 1);
    setActiveIndex((current) => (current + 1) % entries.length);
  }

  return (
    <div className="relative min-h-[30rem] flex-none overflow-hidden bg-night sm:min-h-[36rem] lg:h-full lg:min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0, scale: 1.02 }}
          initial={{ opacity: 0, scale: 0.985 }}
          key={safeActiveIndex}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ContactShowcaseMedia media={activeEntry.media} />
          <div className="absolute inset-0 bg-night/22" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/18 via-night/12 to-night/68" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/48 via-transparent to-night/26" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[30rem] h-full flex-col justify-between p-6 text-rose-white sm:min-h-[36rem] sm:p-8 lg:min-h-full lg:p-10">
        <div className="flex justify-end">
          {entries.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous testimonial"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-rose-white/16 bg-night/24 text-rose-white backdrop-blur-md transition duration-200 hover:bg-rose-white/12"
                onClick={handlePrevious}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next testimonial"
                className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-rose-white/16 bg-night/24 text-rose-white backdrop-blur-md transition duration-200 hover:bg-rose-white/12"
                onClick={handleNext}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5"
                >
                  <svg
                    className="-rotate-90"
                    height="56"
                    viewBox="0 0 56 56"
                    width="56"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      fill="none"
                      r={PROGRESS_RADIUS}
                      stroke="currentColor"
                      strokeOpacity="0.14"
                      strokeWidth="1.5"
                    />
                    <motion.circle
                      animate={{ strokeDashoffset: 0 }}
                      cx="28"
                      cy="28"
                      fill="none"
                      initial={{ strokeDashoffset: PROGRESS_CIRCUMFERENCE }}
                      key={`${safeActiveIndex}-${timerCycle}`}
                      r={PROGRESS_RADIUS}
                      stroke="currentColor"
                      strokeDasharray={PROGRESS_CIRCUMFERENCE}
                      strokeLinecap="round"
                      strokeWidth="1.75"
                      transition={{
                        duration: SLIDE_DURATION_MS / 1000,
                        ease: "linear",
                      }}
                    />
                  </svg>
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-auto">
          <div className="max-w-xl">
          {quote ? (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl"
              initial={{ opacity: 0, y: 20 }}
              key={`quote-${safeActiveIndex}`}
              transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
              style={{ lineHeight: 0.94 }}
            >
              “{quote}”
            </motion.p>
          ) : null}

          {prismic.isFilled.keyText(activeEntry.name) || prismic.isFilled.keyText(activeEntry.role) ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={cn("mt-4 space-y-1", !quote && "mt-0")}
              initial={{ opacity: 0, y: 18 }}
              key={`meta-${safeActiveIndex}`}
              transition={{ duration: 0.64, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {prismic.isFilled.keyText(activeEntry.name) ? (
                <p className="font-sans text-sm font-semibold uppercase text-rose-white">
                  {activeEntry.name}
                </p>
              ) : null}
              {prismic.isFilled.keyText(activeEntry.role) ? (
                <p className="font-sans text-xs text-rose-white">
                  {activeEntry.role}
                </p>
              ) : null}
            </motion.div>
          ) : null}
          </div>

          {footer ? (
            <div className="mt-8 border-t border-rose-white/12 pt-6 sm:mt-10 sm:pt-7">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
