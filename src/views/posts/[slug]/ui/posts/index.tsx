import { ArrowLeft } from "lucide-react";

import { PostNavigation } from "../post-navigation";
import { Share } from "../share";
import { Tags } from "../tags";
import { Toc } from "../toc";

import type { AdjacentPosts, Frontmatter, Post } from "@/entities/post";

import { FormattedDate } from "@/shared/ui/date-time";
import { CalendarIcon } from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";
import { LinkText } from "@/shared/ui/link-text";

export const Posts = async ({
  frontmatter,
  children,
  slug,
  prevPost,
  nextPost,
  relativePosts,
}: {
  frontmatter: Frontmatter;
  slug: string;
  children: React.ReactNode;
  prevPost: AdjacentPosts["prev"];
  nextPost: AdjacentPosts["next"];
  relativePosts: Post[];
}) => {
  return (
    <div className="w-full space-y-12 pb-4">
      <div className="flex">
        <Link href="/posts/" className="flex items-center gap-x-2">
          <ArrowLeft size={14} />
          記事一覧へ戻る
        </Link>
      </div>
      <div className="grid gap-y-4">
        <div className="flex items-center gap-x-1 text-sm opacity-80">
          <CalendarIcon className="size-3.5" />
          <FormattedDate date={frontmatter.date} />
        </div>
        <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
        {frontmatter.tags.length && <Tags tags={frontmatter.tags} />}
        <Share slug={slug} title={frontmatter.title} />
      </div>
      <Toc />
      <div className="grid gap-y-16">
        <div className="markdown-body">{children}</div>
        {relativePosts.length > 0 && (
          <aside className="grid gap-y-4">
            <h2 className="text-2xl font-semibold">次に読む</h2>
            <ul className="list-inside list-disc space-y-2">
              {relativePosts.map((post) => (
                <li key={post.slug}>
                  <LinkText href={`/posts/${post.slug}`}>
                    {post.frontmatter.title}
                  </LinkText>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <PostNavigation prevPost={prevPost} nextPost={nextPost} />
      </div>
    </div>
  );
};
