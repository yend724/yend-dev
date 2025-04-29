import type { AdjacentPosts, Post } from "../model/post";

/**
 * 前後の記事を取得する
 */
export const getAdjacentPosts = (
  posts: Post[],
  currentSlug: string,
): AdjacentPosts => {
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );

  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === currentSlug,
  );

  const prev = sortedPosts[currentIndex + 1]
    ? {
        title: sortedPosts[currentIndex + 1].frontmatter.title,
        slug: sortedPosts[currentIndex + 1].slug,
        date: sortedPosts[currentIndex + 1].frontmatter.date,
      }
    : null;

  const next = sortedPosts[currentIndex - 1]
    ? {
        title: sortedPosts[currentIndex - 1].frontmatter.title,
        slug: sortedPosts[currentIndex - 1].slug,
        date: sortedPosts[currentIndex - 1].frontmatter.date,
      }
    : null;

  return { prev, next };
};
