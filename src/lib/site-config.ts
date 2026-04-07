export const siteConfig = {
  name: "I Am Karina Rodriguez",
  description:
    "Editorial Next.js foundation with Tailwind, Prismic, Radix primitives, and motion-ready UI.",
  nav: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Workshops", href: "#workshops" },
    { label: "Testimonials", href: "#testimonials" },
  ],
  primaryCta: {
    label: "Free Discovery Call",
    href: "#contact",
  },
  stack: [
    "Next.js 16 App Router",
    "Tailwind CSS v4",
    "Prismic + Slice Machine",
    "Radix dropdown primitives",
    "Framer Motion reveals",
  ],
} as const;
