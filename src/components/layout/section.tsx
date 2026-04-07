import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Section<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: SectionProps<T>) {
  const Comp = as ?? "div";

  return (
    <Comp
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 min-[1980px]:max-w-[110rem] min-[1980px]:px-12",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
