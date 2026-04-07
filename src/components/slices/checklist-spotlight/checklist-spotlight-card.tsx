import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type ChecklistSpotlightCardProps = {
  title?: string | null;
  text?: string | null;
  theme?: "light" | "dark";
  delay?: number;
};

export function ChecklistSpotlightCard({
  title,
  text,
  theme = "dark",
  delay = 0,
}: ChecklistSpotlightCardProps) {
  if (!title && !text) {
    return null;
  }

  const darkTheme = theme === "dark";

  return (
    <Reveal
      delay={delay}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      y={24}
    >
      <div
        className={cn(
          "flex items-start gap-4 px-5 py-4 max-w-full lg:max-w-full lg:min-w-full",
          darkTheme ? "bg-pure-white text-night" : "bg-night text-rose-white",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            darkTheme ? "bg-night text-rose-white" : "bg-rose-white text-night",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>

        <div className="min-w-0">
          {title ? (
            <p
              className={cn(
                "font-sans text-sm font-medium sm:text-base",
                darkTheme ? "text-night" : "text-rose-white",
              )}
            >
              {title}
            </p>
          ) : null}

          {text ? (
            <p
              className={cn(
                "mt-1.5 max-w-[30rem] font-sans text-xs sm:text-sm",
                darkTheme ? "text-night" : "text-rose-white",
              )}
            >
              {text}
            </p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
