"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function HeroRaiseReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      transition={{
        duration: 1.05,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroFadeReveal({
  children,
  className,
  delay = 0,
}: HeroRevealProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(className)}
      initial={{ opacity: 0 }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
