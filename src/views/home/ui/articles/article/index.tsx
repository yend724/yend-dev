import type { Article as ArticleInterface } from "@/entities/rss-feed";
import { FormattedDate } from "@/shared/ui/date-time";
import { Link } from "@/shared/ui/link";
import Image from "next/image";
import { PLATFORM_ICON_MAP } from "../constants";

type Props = {
  article: ArticleInterface;
};
export const Article: React.FC<Props> = ({ article }) => {
  return (
    <article key={article.id}>
      <Link href={article.link} className="group grid w-fit gap-2">
        <div className="text-sm opacity-80">
          <FormattedDate date={article.isoDate} /> に公開
        </div>
        <h3 className="font-semibold text-lg group-hover:underline">
          {article.title}
        </h3>
        <span className="flex items-center gap-x-2">
          <Image
            src={PLATFORM_ICON_MAP[article.source].icon}
            alt={article.source}
            width={16}
            height={16}
            className="size-4"
          />
          <span className="font-medium text-sm">
            {PLATFORM_ICON_MAP[article.source].label}
          </span>
        </span>
      </Link>
    </article>
  );
};
