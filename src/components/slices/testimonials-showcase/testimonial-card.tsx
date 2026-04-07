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
}: TestimonialCardProps) {
  const identityLabel = getIdentityLabel(name, role);

  return (
    <article
      className={cn(
        "relative isolate flex aspect-[4/5.2] min-h-[25rem] flex-col justify-end overflow-hidden bg-night sm:min-h-[27rem] lg:min-h-[28rem]",
        className,
      )}
    >
      <TestimonialCardMedia media={media} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/10 via-night/18 to-night/78" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-night/90 via-night/54 to-transparent" />

      {identityLabel ? (
        <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 font-sans text-xs text-night shadow-[0_20px_42px_-28px_rgba(0,0,0,0.45)]">
            <UserRound className="h-3 w-3" />
            <span>{identityLabel}</span>
          </span>
        </div>
      ) : null}

      {prismic.isFilled.richText(text) ? (
        <div className="relative z-10 p-4 sm:p-5">
          <PrismicRichText
            components={{
              paragraph: ({ children }) => (
                <p className="font-sans text-sm text-rose-white sm:text-base">
                  {children}
                </p>
              ),
              hyperlink: ({ children, node }) => (
                <a
                  className="underline decoration-rose-white/30 underline-offset-4"
                  href={node.data.url}
                >
                  {children}
                </a>
              ),
            }}
            field={text}
          />
        </div>
      ) : null}
    </article>
  );
}
