import { SITE_METADATA } from "@/shared/config/site";
import { formatDate } from "@/shared/lib/date-formatter";
import { Link } from "@/shared/ui/link";
import { Rss } from "@/shared/ui/rss";
import { ShareButton } from "@/shared/ui/share-button";
import { Toc } from "@/shared/ui/toc";
import { XShareButton } from "@/shared/ui/x-share-button";
import { ArrowLeft } from "lucide-react";
export const PostsPage = async ({
  frontmatter,
  component,
  slug,
}: {
  frontmatter: {
    tags: string[];
    title: string;
    date: string;
    draft: boolean;
  };
  component: React.FC;
  slug: string;
}) => {
  const Component = component;
  return (
    <div className="w-full space-y-12 pb-12">
      <div className="flex">
        <Link href="/#書いたやつ" className="flex items-center gap-x-2">
          <ArrowLeft size={14} />
          記事一覧へ戻る
        </Link>
      </div>
      <div className="grid gap-y-2">
        <time
          dateTime={new Date(frontmatter.date).toISOString()}
          className="flex gap-x-1 text-sm opacity-80"
        >
          <span>{formatDate(frontmatter.date)}</span>
          <span>に公開</span>
        </time>
        <h1 className="font-bold text-3xl">{frontmatter.title}</h1>
        {frontmatter.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {frontmatter.tags.sort().map((tag) => (
              <li key={tag} className="rounded bg-sky-700 px-1 text-sm">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <ShareButton
            shareData={{
              title: `${frontmatter.title} | ${SITE_METADATA.author}`,
              url: `${SITE_METADATA.url}/posts/${slug}/`,
            }}
          />
          <XShareButton
            shareData={{
              text: `${frontmatter.title} | ${SITE_METADATA.author}`,
              url: `${SITE_METADATA.url}/posts/${slug}/`,
            }}
          />
          <Rss />
        </div>
      </div>
      <div>
        <Toc />
      </div>
      <div className="markdown-body">
        <Component />
      </div>
    </div>
  );
};
