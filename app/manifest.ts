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
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
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
