import { getPosts } from "../../entities/post";
import { generateRSS } from "../../entities/rss";
import { env } from "../../shared/config/env";

export const GET = async () => {
  const isFiltering = env().isProd;
  const posts = await getPosts();

  const filteredPosts = posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({
      title: post.frontmatter.title,
      slug: post.slug,
      date: post.frontmatter.date,
    }));

  const { rss } = generateRSS(filteredPosts);

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};

export const dynamic = "force-static";
