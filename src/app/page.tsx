import Link from "next/link";
import {
  ArrowRight,
  LayoutTemplate,
  MousePointerClick,
  ScrollText,
  Sparkles,
  Type,
} from "lucide-react";

import { repositoryName } from "@/prismicio";
import { SiteHeader } from "@/components/layout/site-header";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    icon: LayoutTemplate,
    title: "Primitives first",
    copy:
      "Radix dropdown primitives are wired in already, so you can keep building buttons, menus, dialogs, and future nav patterns from a clean base.",
  },
  {
    icon: Sparkles,
    title: "Motion ready",
    copy:
      "Framer Motion is installed with a reusable reveal wrapper for scroll entrances, section choreography, and polished page transitions.",
  },
  {
    icon: ScrollText,
    title: "Prismic aligned",
    copy:
      "Slice Machine is initialized for iamkarinarodriguez, with preview routes and a Slice Simulator page ready for your content model work.",
  },
] as const;

const stackList = [
  "Next.js 16 App Router",
  "Tailwind CSS v4 tokens",
  "clsx + tailwind-merge via `cn()`",
  "Prismic Slice Machine",
  "Radix dropdown starter",
  "Framer Motion reveal component",
] as const;

const setupSteps = [
  "Add your actual Inter and Gambarino files under /public/fonts.",
  "Log into Prismic and create your custom types and slices.",
  "Replace the sample route resolver comments in /prismicio.ts with your final paths.",
  "Start building sections in /slices and map them in /slices/index.ts.",
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-24 pt-6 sm:px-8 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <Reveal className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-foreground/55 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Foundation for {repositoryName}
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl font-display text-6xl leading-none tracking-tight sm:text-7xl lg:text-[5.4rem]">
                Bold, content-first scaffolding for a modern editorial brand.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-foreground/70 sm:text-xl">
                This starter is already shaped around the stack you described:
                Next.js, Tailwind, Radix primitives, Prismic, custom font slots,
                class composition helpers, and motion for reveal, scroll, and
                entry transitions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/slice-simulator">
                  Open Slice Simulator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://prismic.io/dashboard"
                  rel="noreferrer"
                  target="_blank"
                >
                  Log Into Prismic
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal className="relative lg:pl-6" delay={0.12}>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white/75 p-6 shadow-[0_40px_120px_-60px_rgba(28,20,13,0.55)] backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground/55">
                  Included now
                </p>
                <MousePointerClick className="h-4 w-4 text-accent" />
              </div>

              <div className="mt-6 space-y-3">
                {stackList.map((item) => (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/75 px-4 py-3"
                    key={item}
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-sm text-foreground/75">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Reveal
                className="rounded-[2rem] border border-border bg-surface/80 p-6 shadow-[0_24px_80px_-50px_rgba(28,20,13,0.5)]"
                delay={0.06 * index}
                key={card.title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-display text-3xl tracking-tight">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-foreground/68">
                  {card.copy}
                </p>
              </Reveal>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Reveal className="rounded-[2rem] border border-border bg-[#f1e2d2]/90 p-7 shadow-[0_24px_80px_-50px_rgba(28,20,13,0.5)]">
            <div className="flex items-center gap-3 text-accent">
              <Type className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">
                Font slots
              </p>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-none tracking-tight">
              Inter for rhythm. Gambarino for attitude.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-foreground/68">
              The app already references your font files, so once you drop the
              real assets into these paths the whole system will pick them up.
            </p>
            <div className="mt-6 space-y-3 font-mono text-xs text-foreground/70">
              <div className="rounded-2xl border border-border/80 bg-white/70 px-4 py-3">
                /public/fonts/inter/Inter-Variable.ttf
              </div>
              <div className="rounded-2xl border border-border/80 bg-white/70 px-4 py-3">
                /public/fonts/gambarino/Gambarino-Regular.woff2
              </div>
            </div>
          </Reveal>

          <Reveal
            className="rounded-[2rem] border border-border bg-white/75 p-7 shadow-[0_24px_80px_-50px_rgba(28,20,13,0.5)]"
            delay={0.1}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-foreground/55">
              Next steps
            </p>
            <h2 className="mt-5 font-display text-4xl leading-none tracking-tight">
              What to do from here.
            </h2>
            <div className="mt-6 space-y-4">
              {setupSteps.map((step, index) => (
                <div
                  className="flex gap-4 rounded-2xl border border-border/80 bg-background/75 px-4 py-4"
                  key={step}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-7 text-foreground/72">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
