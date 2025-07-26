import { Post } from "../model/post";

export const getRelativePosts = (
  posts: Post[],
  slug: string,
  frontmatter: Post["frontmatter"]
) => {
  const sameTagPosts = posts
    .filter((post) =>
      post.frontmatter.tags.some((tag) => frontmatter.tags.includes(tag))
    )
    .filter((post) => post.slug !== slug);

  const sortedPosts = [...sameTagPosts].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return sortedPosts;
};
