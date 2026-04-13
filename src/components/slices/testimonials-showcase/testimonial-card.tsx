import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { UserRound } from "lucide-react";

import { TestimonialCardMedia } from "@/components/slices/testimonials-showcase/testimonial-card-media";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  media: prismic.LinkToMediaField;
  name: prismic.KeyTextField;
  role: prismic.KeyTextField;
  text: prismic.RichTextField;
  className?: string;
  variant?: "default" | "featured";
};

function getIdentityLabel(
  name: prismic.KeyTextField,
  role: prismic.KeyTextField,
) {
  if (prismic.isFilled.keyText(name) && prismic.isFilled.keyText(role)) {
    return `${name}, ${role}`;
  }

  if (prismic.isFilled.keyText(name)) {
    return name;
  }

  if (prismic.isFilled.keyText(role)) {
    return role;
  }

  return null;
}

export function TestimonialCard({
  media,
  name,
  role,
  text,
  className,
  variant = "default",
}: TestimonialCardProps) {
  const identityLabel = getIdentityLabel(name, role);
  const isFeatured = variant === "featured";
  const hasName = prismic.isFilled.keyText(name);
  const hasRole = prismic.isFilled.keyText(role);

  return (
    <article
      className={cn(
        "relative isolate flex overflow-hidden bg-night",
        isFeatured
          ? "min-h-[30rem] items-center justify-center px-6 py-10 text-center sm:min-h-[34rem] sm:px-10 sm:py-12 lg:min-h-[38rem] lg:px-16"
          : "aspect-[4/5.2] min-h-[25rem] flex-col justify-end sm:min-h-[27rem] lg:min-h-[28rem]",
        className,
      )}
    >
      <TestimonialCardMedia media={media} />

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isFeatured
            ? "bg-gradient-to-b from-night/34 via-night/58 to-night/88"
            : "bg-gradient-to-b from-night/10 via-night/18 to-night/78",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0",
          isFeatured
            ? "bottom-0 h-full bg-gradient-to-t from-night via-night/82 to-transparent"
            : "bottom-0 h-[60%] bg-gradient-to-t from-night/90 via-night/54 to-transparent",
        )}
      />

      {identityLabel && !isFeatured ? (
        <div
          className={cn(
            "absolute z-10",
            "left-4 top-4 sm:left-5 sm:top-5",
          )}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 font-sans text-xs text-night shadow-[0_20px_42px_-28px_rgba(0,0,0,0.45)]">
            <UserRound className="h-3 w-3" />
            <span>{identityLabel}</span>
          </span>
        </div>
      ) : null}

      {prismic.isFilled.richText(text) ? (
        <div
          className={cn(
            "relative z-10",
            isFeatured ? "mx-auto max-w-4xl" : "p-4 sm:p-5",
          )}
        >
         
          <PrismicRichText
            components={{
              paragraph: ({ children }) => (
                <p
                  className={cn(
                    "text-rose-white",
                    isFeatured
                      ? "font-display text-2xl sm:text-3xl lg:text-4xl"
                      : "text-xl sm:text-lg",
                  )}
                  style={isFeatured ? { lineHeight: 0.94 } : undefined}
                >
                  {children}
                </p>
              ),
              hyperlink: ({ children, node }) => (
                <a
                  className="underline underline-offset-4"
                  href={node.data.url}
                >
                  {children}
                </a>
              ),
            }}
            field={text}
          />
          {isFeatured && (hasName || hasRole) ? (
            <div className="mt-6 space-y-1 sm:mt-7">
              {hasName ? (
                <p className="font-sans text-sm font-semibold uppercase text-rose-white sm:text-base">
                  {name}
                </p>
              ) : null}
              {hasRole ? (
                <p className="font-sans text-sm text-rose-white sm:text-base">
                  {role}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
