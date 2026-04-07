import * as prismic from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import type { SocialPlatform } from "@/lib/global-nav";
import { cn } from "@/lib/utils";

type SocialLinkItem = {
  platform: SocialPlatform;
  link: prismic.LinkField;
};

type SocialLinksProps = {
  links: SocialLinkItem[];
  className?: string;
  tone?: "light" | "dark";
};

const iconMap: Record<SocialPlatform, IconType> = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  x: FaXTwitter,
};

const iconColorMap: Record<SocialPlatform, string> = {
  instagram: "text-[#E354B7]",
  linkedin: "text-[#2F66C4]",
  tiktok: "text-night",
  youtube: "text-[#FF2F2F]",
  facebook: "text-[#2563EB]",
  x: "text-night",
};

export function SocialLinks({
  links,
  className,
  tone = "dark",
}: SocialLinksProps) {
  if (!links.length) {
    return null;
  }

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {links.map((item, index) => {
        const Icon = iconMap[item.platform];

        return (
          <li key={`${item.platform}-${index}`}>
            <PrismicNextLink
              aria-label={item.platform}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition duration-200",
                tone === "dark"
                  ? "bg-pure-white hover:bg-rose-white"
                  : "bg-night hover:bg-accent-bordeaux",
              )}
              field={item.link}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center",
                    tone === "dark" ? iconColorMap[item.platform] : "text-rose-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </PrismicNextLink>
            </li>
        );
      })}
    </ul>
  );
}
