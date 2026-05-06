import type { MetadataRoute } from "next";

import { SITE_METADATA } from "@/shared/config/site";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_METADATA.url}/sitemap.xml`,
  };
};

export default robots;

export const dynamic = "force-static";
