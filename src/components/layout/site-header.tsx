import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
      <Link className="flex items-center gap-3" href="/">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-night/12 bg-pure-white/80 shadow-sm">
          <Sparkles className="h-4 w-4 text-accent-bordeaux" />
        </div>
        <div>
          <p className="font-display text-xl text-night">
            {siteConfig.name}
          </p>
          <p className="mt-1 font-sans text-xs text-night/45">
            editorial foundation
          </p>
        </div>
      </Link>

      <div className="hidden items-center gap-3 md:flex">
        {siteConfig.nav.map((item) => (
          <Link
            className="rounded-full px-4 py-2 font-sans text-sm text-night/65 transition hover:bg-night/5 hover:text-night"
            href={item.href}
            key={item.label}
          >
            {item.label}
          </Link>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="default" variant="outline">
              Stack
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Included</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {siteConfig.stack.map((item) => (
              <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
