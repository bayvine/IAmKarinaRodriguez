import { FC } from "react";
import * as prismic from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import {
  HeroCtaButton,
  HeroDarkButton,
  HeroOutlineDarkButton,
  HeroSecondaryButton,
} from "@/components/slices/hero/hero-action-link";
import { StaggeredTextReveal } from "@/components/motion/staggered-text-reveal";
import { cn, getSectionAnchorId } from "@/lib/utils";

type CenteredStatementSlice = {
  id: string;
  primary: {
    section_id: prismic.KeyTextField;
    theme?: prismic.SelectField<"dark" | "light">;
    label: prismic.KeyTextField;
    title: prismic.RichTextField;
    body: prismic.RichTextField;
    background_image: prismic.ImageField;
    primary_button_label: prismic.KeyTextField;
    primary_button_link: prismic.LinkField;
    secondary_button_label: prismic.KeyTextField;
    secondary_button_link: prismic.LinkField;
  };
  items: [];
  slice_label: string | null;
  slice_type: "centered_statement";
  variation: "default";
  version: string;
};

export type CenteredStatementProps =
  SliceComponentProps<CenteredStatementSlice>;

function renderCenteredTitle(field: prismic.RichTextField, tone: "light" | "dark") {
  const textClassName =
    tone === "dark"
      ? "font-display text-5xl text-rose-white sm:text-6xl lg:text-7xl"
      : "font-display text-5xl text-night sm:text-6xl lg:text-7xl";
  const headingClassName = "mx-auto max-w-[30ch] text-center";
  const compactHeadingClassName = "mx-auto max-w-[16ch] text-center";
  const headingStyle = { lineHeight: 0.94, textWrap: "balance" as const };

  return (
    <PrismicRichText
      components={{
        heading1: ({ children }) => (
          <StaggeredTextReveal
            amount={0.45}
            as="h1"
            className={cn(headingClassName, textClassName)}
            delay={0.16}
            revealMode="inView"
            style={headingStyle}
          >
            {children}
          </StaggeredTextReveal>
        ),
        heading2: ({ children }) => (
          <StaggeredTextReveal
            amount={0.45}
            as="h2"
            className={cn(headingClassName, textClassName)}
            delay={0.16}
            revealMode="inView"
            style={headingStyle}
          >
            {children}
          </StaggeredTextReveal>
        ),
        heading3: ({ children }) => (
          <StaggeredTextReveal
            amount={0.45}
            as="h3"
            className={cn(compactHeadingClassName, textClassName)}
            delay={0.16}
            revealMode="inView"
            style={headingStyle}
          >
            {children}
          </StaggeredTextReveal>
        ),
        heading4: ({ children }) => (
          <StaggeredTextReveal
            amount={0.45}
            as="h4"
            className={cn(compactHeadingClassName, textClassName)}
            delay={0.16}
            revealMode="inView"
            style={headingStyle}
          >
            {children}
          </StaggeredTextReveal>
        ),
      }}
      field={field}
    />
  );
}

function renderCenteredBody(field: prismic.RichTextField, tone: "light" | "dark") {
  const textClassName =
    tone === "dark" ? "text-rose-white/78" : "text-night/74";
  const linkClassName =
    tone === "dark"
      ? "underline decoration-rose-white/24 underline-offset-4 transition duration-300 hover:text-pure-white"
      : "underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night";

  return (
    <PrismicRichText
      components={{
        paragraph: ({ children }) => (
          <p className={cn("font-sans text-base sm:text-lg", textClassName)}>
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
          <ul className={cn("space-y-2 pl-5 text-left font-sans text-base sm:text-lg", textClassName)}>
            {children}
          </ul>
        ),
        oList: ({ children }) => (
          <ol className={cn("space-y-2 pl-5 text-left font-sans text-base sm:text-lg", textClassName)}>
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

const CenteredStatement: FC<CenteredStatementProps> = ({ slice }) => {
  const theme = slice.primary.theme === "light" ? "light" : "dark";
  const hasBackgroundImage = prismic.isFilled.image(slice.primary.background_image);
  const tone = hasBackgroundImage ? "dark" : theme;
  const sectionId = getSectionAnchorId(slice.primary.section_id);
  const hasLabel = prismic.isFilled.keyText(slice.primary.label);
  const hasTitle = prismic.isFilled.richText(slice.primary.title);
  const hasBody = prismic.isFilled.richText(slice.primary.body);
  const hasPrimaryAction =
    prismic.isFilled.keyText(slice.primary.primary_button_label) &&
    prismic.isFilled.link(slice.primary.primary_button_link);
  const hasSecondaryAction =
    prismic.isFilled.keyText(slice.primary.secondary_button_label) &&
    prismic.isFilled.link(slice.primary.secondary_button_link);
  const hasActions = hasPrimaryAction || hasSecondaryAction;
  const PrimaryButton = tone === "dark" ? HeroCtaButton : HeroDarkButton;
  const SecondaryButton =
    tone === "dark" ? HeroSecondaryButton : HeroOutlineDarkButton;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 scroll-mt-24 sm:scroll-mt-28 sm:py-24 lg:scroll-mt-32 lg:py-32",
        hasBackgroundImage
          ? "bg-night"
          : theme === "light"
            ? "bg-pure-white text-night"
            : "bg-night text-rose-white",
      )}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={sectionId}
    >
      {hasBackgroundImage ? (
        <>
          <PrismicNextImage
            alt=""
            field={slice.primary.background_image}
            fill
            imgixParams={{ fit: "crop" }}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-night/48" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/18 via-night/34 to-night/62" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night/70 to-transparent" />
        </>
      ) : null}

      <Section className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {hasLabel ? (
            <Reveal
              className={cn(
                "inline-flex items-center gap-1.5 font-sans text-xs uppercase",
                tone === "dark" ? "text-rose-white/76" : "text-night/60",
              )}
              transition={{
                duration: 0.64,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={0}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent-blue-linen"
              />
              {slice.primary.label}
            </Reveal>
          ) : null}

          {hasTitle ? (
            <div className={cn(hasLabel ? "mt-3 sm:mt-4" : undefined)}>
              {renderCenteredTitle(slice.primary.title, tone)}
            </div>
          ) : null}

          {hasBody ? (
            <Reveal
              className={cn(
                "mx-auto max-w-2xl space-y-6",
                hasTitle || hasLabel ? "mt-6 sm:mt-7" : undefined,
              )}
              delay={0.28}
              transition={{
                duration: 0.76,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={18}
            >
              {renderCenteredBody(slice.primary.body, tone)}
            </Reveal>
          ) : null}

          {hasActions ? (
            <Reveal
              className={cn(
                "flex flex-wrap justify-center gap-3",
                hasBody || hasTitle || hasLabel ? "mt-8 sm:mt-10" : undefined,
              )}
              delay={0.36}
              transition={{
                duration: 0.72,
                ease: [0.22, 1, 0.36, 1],
              }}
              y={16}
            >
              {hasPrimaryAction ? (
                <PrimaryButton
                  field={slice.primary.primary_button_link}
                  label={slice.primary.primary_button_label}
                />
              ) : null}
              {hasSecondaryAction ? (
                <SecondaryButton
                  field={slice.primary.secondary_button_link}
                  label={slice.primary.secondary_button_label}
                />
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </Section>
    </section>
  );
};

export default CenteredStatement;
