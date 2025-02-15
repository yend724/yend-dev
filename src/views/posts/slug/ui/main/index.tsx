import type { Frontmatter } from "@/entities/post";
import { FormattedDate } from "@/shared/ui/date-time";
import { Link } from "@/shared/ui/link";
import { ArrowLeft } from "lucide-react";
import { Share } from "../share";
import { Tags } from "../tags";
import { Toc } from "../toc";

export const Main = async ({
  frontmatter,
  children,
  slug,
}: {
  frontmatter: Frontmatter;
  slug: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full space-y-12 pb-12">
      <div className="flex">
        <Link href="/#書いたやつ" className="flex items-center gap-x-2">
          <ArrowLeft size={14} />
          記事一覧へ戻る
        </Link>
      </div>
      <div className="grid gap-y-2">
        <div className="text-sm opacity-80">
          <FormattedDate date={frontmatter.date} /> に公開
        </div>
        <h1 className="font-bold text-3xl">{frontmatter.title}</h1>
        {frontmatter.tags.length && <Tags tags={frontmatter.tags} />}
        <Share slug={slug} title={frontmatter.title} />
      </div>
      <Toc />
      <div className="markdown-body">{children}</div>
    </div>
  );
};
