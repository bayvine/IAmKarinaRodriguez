"use client";

import {
  createElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { stagger, useAnimate, useInView, useReducedMotion } from "framer-motion";
import SplitType from "split-type";

import { cn } from "@/lib/utils";

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenText(node.props.children);
  }

  return "";
}

const LINE_MASK_PADDING = "0.12em";
const LINE_MASK_OFFSET = "-0.12em";
const LINE_MASK_INLINE_PADDING = "0.045em";
const LINE_MASK_INLINE_OFFSET = "-0.045em";

type StaggeredTextRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  revealMode?: "immediate" | "inView";
  amount?: number;
  once?: boolean;
  style?: CSSProperties;
};

export function StaggeredTextReveal({
  as = "div",
  children,
  className,
  delay = 0,
  revealMode = "immediate",
  amount = 0.4,
  once = true,
  style,
}: StaggeredTextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLElement>();
  const isInView = useInView(scope, { amount, once });
  const animateRef = useRef(animate);
  const splitRef = useRef<SplitType | null>(null);
  const readyRef = useRef(false);
  const animatedRef = useRef(false);
  const text = flattenText(children).trim();

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    if (prefersReducedMotion || !text || !scope.current) {
      if (prefersReducedMotion && scope.current) {
        void animateRef.current(
          scope.current,
          { opacity: 1 },
          { duration: 0.001 },
        );
      }

      return;
    }

    const element = scope.current;
    let cancelled = false;

    readyRef.current = false;
    animatedRef.current = false;

    const setup = async () => {
      try {
        await document.fonts?.ready;
      } catch {}

      if (cancelled || !element.isConnected) {
        return;
      }

      splitRef.current?.revert();
      splitRef.current = new SplitType(element, {
        types: "lines",
        tagName: "span",
      });

      const lines = Array.from(element.querySelectorAll<HTMLElement>(".line"));

      lines.forEach((line) => {
        line.style.display = "block";
        line.style.overflow = "hidden";
        line.style.lineHeight = "inherit";
        line.style.paddingBottom = LINE_MASK_PADDING;
        line.style.marginBottom = LINE_MASK_OFFSET;
        line.style.paddingLeft = LINE_MASK_INLINE_PADDING;
        line.style.paddingRight = LINE_MASK_INLINE_PADDING;
        line.style.marginLeft = LINE_MASK_INLINE_OFFSET;
        line.style.marginRight = LINE_MASK_INLINE_OFFSET;

        const inner = document.createElement("span");
        inner.dataset.lineInner = "true";
        inner.style.display = "block";
        inner.style.lineHeight = "inherit";
        inner.style.willChange = "transform, opacity";
        inner.style.transform = "translateY(104%)";
        inner.style.opacity = "0";

        while (line.firstChild) {
          inner.appendChild(line.firstChild);
        }

        line.appendChild(inner);
      });

      readyRef.current = true;

      if (revealMode === "immediate") {
        animatedRef.current = true;

        await animateRef.current(
          element,
          { opacity: 1 },
          { duration: 0.001 },
        );

        await animateRef.current(
          "[data-line-inner='true']",
          { y: ["104%", "0%"], opacity: [0, 1] },
          {
            duration: 1.15,
            ease: [0.19, 1, 0.22, 1],
            delay: stagger(0.14, { startDelay: delay }),
          },
        );
      }
    };

    setup();

    return () => {
      cancelled = true;
      splitRef.current?.revert();
      splitRef.current = null;
      readyRef.current = false;
      animatedRef.current = false;
    };
  }, [delay, prefersReducedMotion, revealMode, scope, text]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      revealMode !== "inView" ||
      !scope.current ||
      !readyRef.current ||
      !isInView ||
      animatedRef.current
    ) {
      return;
    }

    const element = scope.current;
    animatedRef.current = true;

    void animateRef.current(
      element,
      { opacity: 1 },
      { duration: 0.001 },
    );

    void animateRef.current(
      "[data-line-inner='true']",
      { y: ["104%", "0%"], opacity: [0, 1] },
      {
        duration: 1.15,
        ease: [0.19, 1, 0.22, 1],
        delay: stagger(0.14, { startDelay: delay }),
      },
    );
  }, [delay, isInView, prefersReducedMotion, revealMode, scope]);

  return createElement(
    as,
    {
      ref: scope,
      className: cn("opacity-0", className),
      style,
    },
    children,
  );
}
