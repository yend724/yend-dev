import { Link } from "@/components/link";
import Image from "next/image";
import { PLATFORM_ICON_MAP } from "../../constants";
import type { Article as ArticleInterface } from "../../types";

type Props = {
  article: ArticleInterface;
};
export const Article: React.FC<Props> = ({ article }) => {
  return (
    <article key={article.id}>
      <Link href={article.link} className="group grid w-fit gap-2">
        <time
          className="flex items-center gap-1 text-sm opacity-80"
          dateTime={article.isoDate}
        >
          <span>
            {new Date(article.isoDate).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              timeZone: "Asia/Tokyo",
            })}
          </span>
          <span>に公開</span>
        </time>
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
