import type { AdjacentPosts } from "@/entities/post";
import { Link } from "@/shared/ui/link";

type Props = {
  prevPost: AdjacentPosts["prev"];
  nextPost: AdjacentPosts["next"];
};

type NavigationItemProps = {
  post: NonNullable<AdjacentPosts["prev"] | AdjacentPosts["next"]>;
  dir: "prev" | "next";
};

const NavigationItem = ({ post, dir }: NavigationItemProps) => (
  <li>
    <Link
      className="underline hover:no-underline"
      href={`/posts/${post.slug}`}
    >
      {dir === "prev" && "←"}{post.title}{dir === "next" && "→"}
    </Link>
  </li>
);

export const PostNavigation: React.FC<Props> = ({ prevPost, nextPost }) => {
  if (!prevPost && !nextPost) return null;

  return (
    <ul className="flex flex-wrap justify-between gap-4">
      {prevPost && <NavigationItem post={prevPost} dir="prev" />}
      {nextPost && <NavigationItem post={nextPost} dir="next" />}
    </ul>
  );
};
