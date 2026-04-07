import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";

import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import { getDisplayTextProps } from "@/lib/typography";

type SectionSubtextOptions = {
  tone?: "light" | "dark";
};

type LongFormRichTextOptions = {
  tone?: "light" | "dark";
};

export function renderSectionTitle(field: prismic.RichTextField) {
  return (
    <PrismicRichText
      components={{
        heading1: ({ children }) => {
          const title = getDisplayTextProps("section", "heading1");

          return (
            <StaggeredTextReveal
              amount={0.45}
              as="h2"
              className={title.className}
              delay={0.16}
              revealMode="inView"
              style={title.style}
            >
              {children}
            </StaggeredTextReveal>
          );
        },
        heading2: ({ children }) => {
          const title = getDisplayTextProps("section", "heading2");

          return (
            <StaggeredTextReveal
              amount={0.45}
              as="h2"
              className={title.className}
              delay={0.16}
              revealMode="inView"
              style={title.style}
            >
              {children}
            </StaggeredTextReveal>
          );
        },
        heading3: ({ children }) => {
          const title = getDisplayTextProps("section", "heading3");

          return (
            <StaggeredTextReveal
              amount={0.45}
              as="h3"
              className={title.className}
              delay={0.16}
              revealMode="inView"
              style={title.style}
            >
              {children}
            </StaggeredTextReveal>
          );
        },
        heading4: ({ children }) => {
          const title = getDisplayTextProps("section", "heading4");

          return (
            <StaggeredTextReveal
              amount={0.45}
              as="h4"
              className={title.className}
              delay={0.16}
              revealMode="inView"
              style={title.style}
            >
              {children}
            </StaggeredTextReveal>
          );
        },
        paragraph: ({ children }) => {
          const title = getDisplayTextProps("section", "paragraph");

          return (
            <StaggeredTextReveal
              amount={0.45}
              as="p"
              className={title.className}
              delay={0.16}
              revealMode="inView"
              style={title.style}
            >
              {children}
            </StaggeredTextReveal>
          );
        },
      }}
      field={field}
    />
  );
}

export function renderSectionSubtext(
  field: prismic.RichTextField,
  options?: SectionSubtextOptions,
) {
  const tone = options?.tone ?? "light";
  const linkClassName =
    tone === "dark"
      ? "underline decoration-rose-white/24 underline-offset-4 transition duration-300 hover:text-pure-white"
      : "underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night";

  return (
    <PrismicRichText
      components={{
        paragraph: ({ children }) => (
          <p className="font-sans text-base sm:text-lg">{children}</p>
        ),
        hyperlink: ({ children, node }) => (
          <a
            className={linkClassName}
            href={node.data.url}
          >
            {children}
          </a>
        ),
        list: ({ children }) => (
          <ul className="space-y-2 pl-5 font-sans text-base sm:text-lg">
            {children}
          </ul>
        ),
        oList: ({ children }) => (
          <ol className="space-y-2 pl-5 font-sans text-base sm:text-lg">
            {children}
          </ol>
        ),
        listItem: ({ children }) => <li>{children}</li>,
        oListItem: ({ children }) => <li>{children}</li>,
      }}
      field={field}
    />
  );
}

export function renderLongFormRichText(
  field: prismic.RichTextField,
  options?: LongFormRichTextOptions,
) {
  const tone = options?.tone ?? "light";
  const headingClassName =
    tone === "dark" ? "text-rose-white" : "text-night";
  const bodyClassName =
    tone === "dark" ? "text-rose-white" : "text-night";
  const linkClassName =
    tone === "dark"
      ? "underline decoration-rose-white/24 underline-offset-4 transition duration-300 hover:text-pure-white"
      : "underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night";

  return (
    <PrismicRichText
      components={{
        heading2: ({ children }) => (
          <h2
            className={`mt-10 font-display text-3xl ${headingClassName} first:mt-0 sm:text-4xl`}
          >
            {children}
          </h2>
        ),
        heading3: ({ children }) => (
          <h3
            className={`mt-8 font-display text-2xl ${headingClassName} first:mt-0 sm:text-3xl`}
          >
            {children}
          </h3>
        ),
        heading4: ({ children }) => (
          <h4
            className={`mt-7 font-display text-xl ${headingClassName} first:mt-0 sm:text-2xl`}
          >
            {children}
          </h4>
        ),
        paragraph: ({ children }) => (
          <p className={`font-sans text-base ${bodyClassName} sm:text-lg`}>
            {children}
          </p>
        ),
        hyperlink: ({ children, node }) => (
          <a
            className={linkClassName}
            href={node.data.url}
          >
            {children}
          </a>
        ),
        list: ({ children }) => (
          <ul className={`list-disc space-y-3 pl-5 font-sans text-base ${bodyClassName} sm:text-lg`}>
            {children}
          </ul>
        ),
        oList: ({ children }) => (
          <ol className={`list-decimal space-y-3 pl-5 font-sans text-base ${bodyClassName} sm:text-lg`}>
            {children}
          </ol>
        ),
        listItem: ({ children }) => <li className="pl-1">{children}</li>,
        oListItem: ({ children }) => <li className="pl-1">{children}</li>,
      }}
      field={field}
    />
  );
}
