import { getPosts } from "../entities/post";
import { env } from "../shared/config/env";
import { SITE_METADATA } from "../shared/config/site";

import type { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const isFiltering = env().isProd;
  const posts = await getPosts();

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({
      url: `${SITE_METADATA.url}/posts/${post.slug}/`,
      lastModified: new Date(post.frontmatter.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: SITE_METADATA.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_METADATA.url}/posts/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
};

export default sitemap;

export const dynamic = "force-static";
