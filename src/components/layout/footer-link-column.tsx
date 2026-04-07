import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

type FooterLinkColumnItem = {
  label: string;
  link: prismic.LinkField;
};

type FooterLinkColumnProps = {
  title: string;
  items: FooterLinkColumnItem[];
};

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
            <PrismicNextLink
              className="relative inline-flex py-1 font-sans text-sm text-rose-white/72 transition duration-200 hover:text-rose-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-rose-white after:transition after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:text-rose-white focus-visible:after:scale-x-100"
              field={item.link}
            >
              {item.label}
            </PrismicNextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
