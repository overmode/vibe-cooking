import { type MetadataRoute } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations("metadata");
  const lang = await getLocale();

  return {
    name: "Vibe Cooking",
    short_name: "Vibe",
    description: t("description"),
    lang,
    start_url: "/",
    display: "standalone",
    background_color: "#FCEAD0",
    theme_color: "#402A12",
    icons: [
      // Scalable vector source: Chromium renders this crisply at any install
      // surface size. PNGs below are fallbacks for engines that ignore SVG
      // manifest icons (e.g. iOS uses the apple-touch-icon instead).
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
