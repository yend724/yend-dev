import fs from "node:fs";
import { getPosts } from "@/entities/post";
import { generateRSS } from "@/entities/rss";
import { runInProduction } from "@/shared/lib/env";
import { Main } from "@/views/home";

const posts = await getPosts();
const filteredPosts = posts
  .filter((post) => !post.frontmatter.draft)
  .map((post) => ({
    title: post.frontmatter.title,
    slug: post.slug,
    date: post.frontmatter.date,
  }));

runInProduction(async () => {
  const { rss } = generateRSS(filteredPosts);
  fs.writeFileSync("public/rss.xml", rss);
});

const Page = () => {
  return <Main />;
};

export default Page;
