import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionIntroTone = "light" | "dark";
type SectionIntroAccent = "night" | "accent-bordeaux" | "accent-blue-linen";

type SectionIntroProps = {
  label?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  tone?: SectionIntroTone;
  accent?: SectionIntroAccent;
  layout?: "split" | "stacked";
  bodyPosition?: "start" | "end";
  className?: string;
  titleClassName?: string;
  labelClassName?: string;
  bodyClassName?: string;
};

const toneStyles: Record<
  SectionIntroTone,
  {
    title: string;
    label: string;
    body: string;
    divider: string;
  }
> = {
  light: {
    title: "text-night",
    label: "text-night",
    body: "text-night",
    divider: "border-night/10",
  },
  dark: {
    title: "text-rose-white",
    label: "text-rose-white",
    body: "text-rose-white",
    divider: "border-rose-white/14",
  },
};

const accentStyles: Record<SectionIntroAccent, string> = {
  night: "bg-night",
  "accent-bordeaux": "bg-accent-bordeaux",
  "accent-blue-linen": "bg-accent-blue-linen",
};

export function SectionIntro({
  label,
  title,
  body,
  tone = "light",
  accent = "night",
  layout = "split",
  bodyPosition = "end",
  className,
  titleClassName,
  labelClassName,
  bodyClassName,
}: SectionIntroProps) {
  const palette = toneStyles[tone];

  if (layout === "stacked") {
    return (
      <div className={cn("max-w-3xl", className)}>
        {label ? (
          <div
            className={cn(
              "mb-3 inline-flex items-center gap-1.5 font-sans text-xs uppercase sm:mb-4",
              palette.label,
              labelClassName,
            )}
          >
            <span
              aria-hidden="true"
              className={cn("h-2 w-2 rounded-full", accentStyles[accent])}
            />
            {label}
          </div>
        ) : null}

        <div className={cn(palette.title, titleClassName)}>
          {title}
        </div>

        {body ? (
          <div
            className={cn(
              "mt-5 space-y-4 border-t pt-5 sm:mt-4 sm:border-t-0 sm:pt-0",
              palette.body,
              palette.divider,
              bodyClassName,
            )}
          >
            {body}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(18rem,33rem)] lg:items-end lg:gap-12",
        className,
      )}
    >
      <div className="max-w-4xl">
        {label ? (
          <div
            className={cn(
              "mb-3 inline-flex items-center gap-1.5 font-sans text-xs uppercase sm:mb-4",
              palette.label,
              labelClassName,
            )}
          >
            <span
              aria-hidden="true"
              className={cn("h-2 w-2 rounded-full", accentStyles[accent])}
            />
            {label}
          </div>
        ) : null}

        <div className={cn(palette.title, titleClassName)}>
          {title}
        </div>
      </div>

      <div
        className={cn(
          "max-w-2xl lg:self-end",
          bodyPosition === "start" ? "lg:justify-self-start" : "lg:justify-self-end",
          body && "border-t pt-5 sm:pt-6 lg:border-t-0 lg:pt-0",
          body && palette.divider,
        )}
      >
        {body ? (
          <div className={cn("space-y-4", palette.body, bodyClassName)}>
            {body}
          </div>
        ) : null}
      </div>
    </div>
  );
}
  