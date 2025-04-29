import type { AdjacentPosts, Frontmatter } from '@/entities/post';
import { FormattedDate } from '@/shared/ui/date-time';
import { CalendarIcon } from '@/shared/ui/icons';
import { Link } from '@/shared/ui/link';
import { ArrowLeft } from 'lucide-react';
import { Share } from '../share';
import { Tags } from '../tags';
import { Toc } from '../toc';

export const Main = async ({
  frontmatter,
  children,
  slug,
  prevPost,
  nextPost,
}: {
  frontmatter: Frontmatter;
  slug: string;
  children: React.ReactNode;
  prevPost: AdjacentPosts['prev'];
  nextPost: AdjacentPosts['next'];
}) => {
  return (
    <div className="w-full space-y-12 pb-12">
      <div className="flex">
        <Link href="/#書いたやつ" className="flex items-center gap-x-2">
          <ArrowLeft size={14} />
          記事一覧へ戻る
        </Link>
      </div>
      <div className="grid gap-y-4">
        <div className="flex items-center gap-x-1 text-sm opacity-80">
          <CalendarIcon className="size-3.5" />
          <FormattedDate date={frontmatter.date} />
        </div>
        <h1 className="font-bold text-3xl">{frontmatter.title}</h1>
        {frontmatter.tags.length && <Tags tags={frontmatter.tags} />}
        <Share slug={slug} title={frontmatter.title} />
      </div>
      <Toc />
      <div className="markdown-body">{children}</div>
      <div className="mt-20 space-y-2 rounded-md border border-neutral-200/20 bg-neutral-900 p-4 ">
        {prevPost && (
          <div>
            <Link
              className="underline hover:no-underline"
              href={`/posts/${prevPost.slug}`}
            >
              <span>【前の記事】</span>
              <span>{prevPost.title}</span>
            </Link>
          </div>
        )}
        {nextPost && (
          <div>
            <Link
              className="underline hover:no-underline"
              href={`/posts/${nextPost.slug}`}
            >
              <span>【次の記事】</span>
              <span>{nextPost.title}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
