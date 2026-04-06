"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HeroActionRevealProps = {
  children: ReactNode;
};

export function HeroActionReveal({ children }: HeroActionRevealProps) {
  return (
    <motion.div
      animate="visible"
      className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.82,
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroActionRevealItem({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      className="w-full sm:w-auto"
      variants={{
        hidden: {
          opacity: 0,
          y: 14,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.95,
            ease: [0.19, 1, 0.22, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
