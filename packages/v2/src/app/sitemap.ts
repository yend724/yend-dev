import type { MetadataRoute } from "next";

import { SITE_METADATA } from "@/shared/config/site";

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: SITE_METADATA.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
};

export default sitemap;

export const dynamic = "force-static";
