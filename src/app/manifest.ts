import type { MetadataRoute } from "next";

import { getGlobalNavSeoData } from "@/lib/global-nav";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const seoData = await getGlobalNavSeoData();

  return {
    name: seoData.siteName,
    short_name: seoData.siteName,
    description: seoData.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1A1818",
    theme_color: "#1A1818",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
