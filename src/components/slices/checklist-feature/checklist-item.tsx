import * as prismic from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

type ChecklistItemProps = {
  text: prismic.RichTextField;
  delay?: number;
};

export function ChecklistItem({ text, delay = 0 }: ChecklistItemProps) {
  if (!prismic.isFilled.richText(text)) {
    return null;
  }

  return (
    <Reveal
      delay={delay}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      y={28}
    >
      <div className="w-full space-y-5 ">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night text-rose-white">
          <Check className="h-5 w-5" strokeWidth={1.8} />
        </span>

        <div className="md:max-w-65 xl:max-w-55 text-night">
          <PrismicRichText
            components={{
              paragraph: ({ children }) => (
                <p className="font-sans text-base">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-night">{children}</strong>
              ),
              em: ({ children }) => <em>{children}</em>,
              hyperlink: ({ children, node }) => (
                <a
                  className="underline decoration-night/24 underline-offset-4 transition duration-300 hover:text-night"
                  href={node.data.url}
                >
                  {children}
                </a>
              ),
            }}
            field={text}
          />
        </div>
      </div>
    </Reveal>
  );
}
