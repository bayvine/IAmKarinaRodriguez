import type { CSSProperties } from "react";

type DisplayPreset = {
  className: string;
  style: CSSProperties;
};

type DisplayContext = "hero" | "section";
type DisplayLevel = "heading1" | "heading2" | "heading3" | "heading4" | "paragraph";

const DISPLAY_PRESETS = {
  heroXL: {
    className: "font-display text-5xl sm:text-6xl lg:text-7xl",
    style: { lineHeight: 0.88 },
  },
  heroLG: {
    className: "font-display text-4xl sm:text-5xl lg:text-6xl",
    style: { lineHeight: 0.9 },
  },
  sectionLG: {
    className: "font-display text-4xl sm:text-5xl lg:text-6xl",
    style: { lineHeight: 0.92 },
  },
  sectionMD: {
    className: "font-display text-3xl sm:text-4xl lg:text-5xl",
    style: { lineHeight: 0.94 },
  },
  sectionSM: {
    className: "font-display text-2xl sm:text-3xl lg:text-4xl",
    style: { lineHeight: 0.96 },
  },
} satisfies Record<string, DisplayPreset>;

const DISPLAY_SCALE: Record<DisplayContext, Record<DisplayLevel, DisplayPreset>> = {
  hero: {
    heading1: DISPLAY_PRESETS.heroXL,
    heading2: DISPLAY_PRESETS.heroLG,
    heading3: DISPLAY_PRESETS.sectionLG,
    heading4: DISPLAY_PRESETS.sectionMD,
    paragraph: DISPLAY_PRESETS.sectionSM,
  },
  section: {
    heading1: DISPLAY_PRESETS.sectionLG,
    heading2: DISPLAY_PRESETS.sectionLG,
    heading3: DISPLAY_PRESETS.sectionMD,
    heading4: DISPLAY_PRESETS.sectionSM,
    paragraph: DISPLAY_PRESETS.sectionSM,
  },
};

export function getDisplayTextProps(context: DisplayContext, level: DisplayLevel) {
  return DISPLAY_SCALE[context][level];
}
