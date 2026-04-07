"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

type FaqItemProps = {
  question: string;
  answer: ReactNode;
  theme: "light" | "dark";
};

export function FaqItem({
  question,
  answer,
  theme,
}: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const transition = {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.div
      layout
      className={cn(
        "border-b",
        theme === "dark" ? "border-rose-white/16" : "border-night/10",
      )}
      transition={transition}
    >
      <button
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left sm:py-6"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <motion.span
            animate={{ y: isOpen ? -1 : 0 }}
            className={cn(
              "block font-sans text-lg sm:text-xl lg:text-2xl",
              theme === "dark" ? "text-rose-white" : "text-night",
            )}
            transition={transition}
          >
            {question}
          </motion.span>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? -1 : 0 }}
          aria-hidden="true"
          className={cn(
            "mt-0.5 shrink-0 font-sans text-2xl leading-none",
            theme === "dark" ? "text-rose-white" : "text-night",
          )}
          transition={transition}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            layout
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
              className="pb-5 pr-0 sm:pb-6 sm:pr-12"
              exit={{ opacity: 0, y: -10, clipPath: "inset(0% 0% 100% 0%)" }}
              initial={{ opacity: 0, y: 10, clipPath: "inset(0% 0% 100% 0%)" }}
              transition={transition}
            >
              {answer}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
