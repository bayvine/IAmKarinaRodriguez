"use client";

import { useState } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type HeroActionVariant = "primary" | "secondary" | "dark" | "outline-dark";

type HeroActionLinkProps = {
  field: prismic.LinkField;
  label: prismic.KeyTextField;
  className?: string;
  variant?: HeroActionVariant;
};

type HeroActionButtonProps = {
  label: string;
  className?: string;
  variant?: HeroActionVariant;
  disabled?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  type?: "button" | "submit";
};

const textRailTransition = {
  duration: 0.72,
  ease: [0.19, 1, 0.22, 1],
} as const;

const iconRailTransition = {
  duration: 0.76,
  ease: [0.19, 1, 0.22, 1],
} as const;

function getHeroActionClasses(variant: HeroActionVariant, className?: string) {
  return cn(
    "flex min-h-13 w-full items-center justify-center rounded-full px-6 py-3 font-sans text-sm font-medium transition duration-200 sm:inline-flex sm:w-auto",
    variant === "primary" &&
      "bg-rose-white text-night shadow-[0_28px_80px_-36px_rgba(0,0,0,0.85)] hover:bg-pure-white",
    variant === "secondary" &&
      "border border-rose-white bg-transparent text-rose-white hover:border-pure-white hover:text-pure-white",
    variant === "dark" &&
      "bg-night text-rose-white shadow-[0_28px_80px_-36px_rgba(26,24,24,0.48)] hover:bg-accent-bordeaux",
    variant === "outline-dark" &&
      "border border-night/18 bg-transparent text-night hover:bg-night/4 hover:border-night/30",
    className,
  );
}

function HeroActionCarousel({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const textShift = prefersReducedMotion ? 0 : active ? -20 : 0;
  const iconShift = prefersReducedMotion ? 0 : active ? -16 : 0;

  return (
    <>
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="flex items-center gap-2 overflow-hidden"
      >
        <span className="relative h-[20px] overflow-hidden">
          <motion.span
            animate={{ y: textShift }}
            className="flex flex-col"
            initial={false}
            transition={textRailTransition}
          >
            <span
              className="flex h-[20px] items-center"
              style={{ lineHeight: 1 }}
            >
              {label}
            </span>
            <span
              className="flex h-[20px] items-center"
              style={{ lineHeight: 1 }}
            >
              {label}
            </span>
          </motion.span>
        </span>
        <span className="relative flex h-4 w-4 overflow-hidden">
          <motion.span
            animate={{ y: iconShift }}
            className="flex flex-col"
            initial={false}
            transition={iconRailTransition}
          >
            <span className="flex h-4 w-4 items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <span className="flex h-4 w-4 items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </motion.span>
        </span>
      </span>
    </>
  );
}

function HeroActionLink({
  field,
  label,
  className,
  variant = "primary",
}: HeroActionLinkProps) {
  const [isActive, setIsActive] = useState(false);

  if (!prismic.isFilled.link(field) || !prismic.isFilled.keyText(label)) {
    return null;
  }

  return (
    <PrismicNextLink
      className={getHeroActionClasses(variant, className)}
      field={field}
      onBlur={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <HeroActionCarousel active={isActive} label={label} />
    </PrismicNextLink>
  );
}

function HeroActionButton({
  label,
  className,
  variant = "primary",
  disabled = false,
  isLoading = false,
  loadingLabel = "Loading...",
  type = "button",
}: HeroActionButtonProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={cn(
        getHeroActionClasses(variant, className),
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-70",
      )}
      disabled={disabled}
      onBlur={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      type={type}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        <HeroActionCarousel active={isActive} label={label} />
      )}
    </button>
  );
}

type HeroButtonProps = Omit<HeroActionLinkProps, "variant">;
type HeroSubmitButtonProps = Omit<HeroActionButtonProps, "variant" | "type">;

export function HeroCtaButton(props: HeroButtonProps) {
  return <HeroActionLink variant="primary" {...props} />;
}

export function HeroSecondaryButton(props: HeroButtonProps) {
  return <HeroActionLink variant="secondary" {...props} />;
}

export function HeroDarkButton(props: HeroButtonProps) {
  return <HeroActionLink variant="dark" {...props} />;
}

export function HeroOutlineDarkButton(props: HeroButtonProps) {
  return <HeroActionLink variant="outline-dark" {...props} />;
}

export function HeroDarkSubmitButton(props: HeroSubmitButtonProps) {
  return <HeroActionButton type="submit" variant="dark" {...props} />;
}
