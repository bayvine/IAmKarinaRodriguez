"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type ServiceSelectorButtonProps = {
  active: boolean;
  id: string;
  index: number;
  label: string;
  onSelect: (index: number) => void;
};

export function ServiceSelectorButton({
  active,
  id,
  index,
  label,
  onSelect,
}: ServiceSelectorButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <button
      aria-controls={`service-panel-${id}`}
      aria-selected={active}
      className="shrink-0 cursor-pointer px-0 pb-1.5 text-left transition duration-300 sm:pb-2.5 lg:w-full lg:py-4"
      id={`service-tab-${id}`}
      onClick={() => onSelect(index)}
      role="tab"
      type="button"
    >
      <span
        className={cn(
          "block font-sans text-base transition duration-300 sm:text-lg lg:font-display lg:text-2xl xl:text-3xl",
          active
            ? "text-rose-white"
            : "text-disabled-rose-white hover:text-rose-white",
        )}
      >
        {label}
      </span>

      <span
        aria-hidden="true"
        className="relative mt-1.5 lg:mt-4 block h-px w-full overflow-hidden bg-disabled-rose-white"
      >
        <motion.span
          animate={{
            opacity: active ? 1 : 0,
            scaleX: active ? 1 : 0,
          }}
          className="absolute inset-y-0 left-0 w-full origin-left bg-rose-white"
          initial={false}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.52, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </span>
    </button>
  );
}
