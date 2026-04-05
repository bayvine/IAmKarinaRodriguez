"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({
  className,
  delay = 0,
  y = 28,
  once = true,
  transition,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1],
        ...transition,
      }}
      viewport={{ once, amount: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      {...props}
    />
  );
}
