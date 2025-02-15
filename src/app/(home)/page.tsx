import { Main } from "@/views/home";

import fs from "node:fs";
import { getPosts } from "@/entities/posts";
import { generateRSS } from "@/entities/rss";

const posts = await getPosts();
const filteredPosts = posts
  .filter((post) => !post.frontmatter.draft)
  .map((post) => ({
    title: post.frontmatter.title,
    slug: post.slug,
    date: post.frontmatter.date,
  }));
const { rss } = generateRSS(filteredPosts);
fs.writeFileSync("public/rss.xml", rss);

const Page = () => {
  return <Main />;
};

export default Page;
