import { AdjacentPosts } from '@/entities/post';
import { Link } from '@/shared/ui/link';

type Props = {
  prevPost: AdjacentPosts['prev'];
  nextPost: AdjacentPosts['next'];
};

type NavigationItemProps = {
  post: NonNullable<AdjacentPosts['prev'] | AdjacentPosts['next']>;
  dir: 'prev' | 'next';
};

const NavigationItem = ({ post, dir }: NavigationItemProps) => (
  <li>
    <Link
      className="underline hover:no-underline flex items-center"
      href={`/posts/${post.slug}`}
    >
      {dir === 'prev' && '←'}
      <span>{post.title}</span>
      {dir === 'next' && '→'}
    </Link>
  </li>
);

export const PostNavigation: React.FC<Props> = ({ prevPost, nextPost }) => {
  if (!prevPost && !nextPost) return null;

  return (
    <ul className="flex justify-between flex-wrap gap-4">
      {prevPost && <NavigationItem post={prevPost} dir="prev" />}
      {nextPost && <NavigationItem post={nextPost} dir="next" />}
    </ul>
  );
};
