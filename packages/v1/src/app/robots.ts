import { SITE_METADATA } from "../shared/config/site";

import type { MetadataRoute } from "next";

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
