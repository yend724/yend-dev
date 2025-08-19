import fs from "node:fs";

import { getPostsData } from "./utils/get-posts-data";

import { generateRSS } from "@/entities/rss";
import { env } from "@/shared/config/env";

const generateRSSFeed = async () => {
  const isFiltering = env().isProd;
  const posts = getPostsData();

  const filteredPosts = posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({
      title: post.frontmatter.title,
      slug: post.slug,
      date: post.frontmatter.date,
    }));

  const { rss } = generateRSS(filteredPosts);

  const outputPath = "public/rss.xml";
  fs.writeFileSync(outputPath, rss);
};

generateRSSFeed().catch((error) => {
  console.error("RSSフィードの生成中にエラーが発生しました:", error);
  process.exit(1);
});
