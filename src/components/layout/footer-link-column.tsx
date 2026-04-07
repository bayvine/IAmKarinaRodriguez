import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { ArrowUpRight } from "lucide-react";

export const footerLinkItemClassName =
  "relative inline-flex cursor-pointer items-center gap-1.5 py-1 font-sans text-sm text-rose-white/72 transition duration-200 hover:text-rose-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-rose-white after:transition after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:text-rose-white focus-visible:after:scale-x-100";

type FooterLinkColumnItem = {
  label: string;
  link: prismic.LinkField;
};

type FooterLinkColumnProps = {
  title: string;
  items: FooterLinkColumnItem[];
};

export function FooterTextLink({
  item,
  className,
}: {
  item: FooterLinkColumnItem;
  className?: string;
}) {
  return (
    <PrismicNextLink
      className={className ?? footerLinkItemClassName}
      field={item.link}
    >
      <span>{item.label}</span>
      <ArrowUpRight className="h-3.5 w-3.5" />
    </PrismicNextLink>
  );
}

export function FooterLinkColumn({
  title,
  items,
}: FooterLinkColumnProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div>
      <h3 className="font-sans text-sm text-rose-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <FooterTextLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
