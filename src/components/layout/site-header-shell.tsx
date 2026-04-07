"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as prismic from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Section } from "@/components/layout/section";
import { HeroCtaButton } from "@/components/slices/hero/hero-action-link";
import { cn } from "@/lib/utils";

type HeaderLinkItem = {
  label: string;
  link: prismic.LinkField;
};

type SiteHeaderShellProps = {
  logo?: prismic.ImageField;
  brandName: string;
  navigationLinks: HeaderLinkItem[];
  ctaLabel: prismic.KeyTextField;
  ctaLink: prismic.LinkField;
};

function BrandLockup({
  brandName,
  logo,
}: {
  brandName: string;
  logo?: prismic.ImageField;
}) {
  if (prismic.isFilled.image(logo)) {
    return (
      <div className="relative h-10 w-10 ">
        <PrismicNextImage
          field={logo}
          fill
          className="object-contain object-left"
        />
      </div>
    );
  }

  const words = brandName.trim().split(/\s+/);
  const midpoint = words.length > 2 ? Math.ceil(words.length / 2) : 1;
  const firstLine = words.slice(0, midpoint).join(" ");
  const secondLine = words.slice(midpoint).join(" ");

  return (
    <div className="font-display text-[1.7rem] text-rose-white sm:text-[1.95rem]">
      <span className="block" style={{ lineHeight: 0.8 }}>
        {firstLine}
      </span>
      {secondLine ? (
        <span className="block" style={{ lineHeight: 0.8 }}>
          {secondLine}
        </span>
      ) : null}
    </div>
  );
}

export function SiteHeaderShell({
  logo,
  brandName,
  navigationLinks,
  ctaLabel,
  ctaLink,
}: SiteHeaderShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frame = 0;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      setHasScrolled(currentScrollY > 12);

      if (currentScrollY <= 12) {
        setIsVisible(true);
      } else if (delta > 4) {
        setIsVisible(true);
      } else if (delta < -4) {
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
      frame = 0;
    };

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(updateHeader);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const shouldShowHeader = isOpen || isVisible;

  return (
    <>
      <motion.header
        animate={{ opacity: shouldShowHeader ? 1 : 0, y: shouldShowHeader ? 0 : -110 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
        initial={false}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        <Section className="py-4 sm:py-5 lg:py-6">
          <div
            className={cn(
              "pointer-events-auto relative flex items-center gap-4 transition-[background-color,box-shadow,padding] duration-300",
              hasScrolled
                ? " bg-night/70 -mt-4 px-6 py-3 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:px-5"
                : "px-0 py-1",
            )}
          >
            <Link
              aria-label={brandName}
              className="relative z-10"
              href="/"
            >
              <BrandLockup brandName={brandName} logo={logo} />
            </Link>

            <nav className="pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-6 lg:flex">
              {navigationLinks.map((item, index) => (
                <PrismicNextLink
                  className="relative inline-flex py-1 font-sans text-sm text-rose-white transition duration-200 hover:text-pure-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-rose-white after:transition after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:text-pure-white focus-visible:after:scale-x-100"
                  field={item.link}
                  key={`${item.label}-${index}`}
                >
                  {item.label}
                </PrismicNextLink>
              ))}
            </nav>

            <div className="relative z-10 ml-auto flex items-center justify-end gap-3">
              <div className="hidden lg:block">
                <HeroCtaButton
                  className="min-h-12 w-auto px-5"
                  field={ctaLink}
                  label={ctaLabel}
                />
              </div>

              <button
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-night text-rose-white backdrop-blur-md transition duration-200 hover:bg-night/26 lg:hidden"
                onClick={() => setIsOpen(true)}
                type="button"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Section>
      </motion.header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-100 lg:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.button
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-night backdrop-blur-md"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              type="button"
            />

            <motion.div
              animate={{ x: 0 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-night px-6 pb-8 pt-5 text-rose-white"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Link
                  aria-label={brandName}
                  href="/"
                  onClick={() => setIsOpen(false)}
                >
                  <BrandLockup brandName={brandName} logo={logo} />
                </Link>

                <button
                  aria-label="Close menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border cursor-pointer border-rose-white bg-night text-rose-white transition duration-200 hover:bg-rose-white/14"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-12 flex flex-col gap-5">
                {navigationLinks.map((item, index) => (
                  <PrismicNextLink
                    className="font-sans text-lg text-rose-white hover:underline"
                    field={item.link}
                    key={`${item.label}-${index}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </PrismicNextLink>
                ))}
              </nav>

              <div className=" pt-10">
                <HeroCtaButton
                  className="w-full"
                  field={ctaLink}
                  label={ctaLabel}
                />
               
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
