import { FormattedDate } from "@/shared/ui/date-time";
import { ProfileIcon, QiitaIcon, ZennIcon } from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";
import Image from "next/image";
import type { ArticlePreviewInterface } from "../../model/article";

const PLATFORM_ICON_MAP = {
  zenn: {
    label: "Zenn",
    icon: ZennIcon,
  },
  qiita: {
    label: "Qiita",
    icon: QiitaIcon,
  },
  yend: {
    label: "YEND.DEV",
    icon: ProfileIcon,
  },
};

type Props = {
  article: ArticlePreviewInterface;
};
export const ArticlePreview: React.FC<Props> = ({ article }) => {
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
            className="size-4"
            src={PLATFORM_ICON_MAP[article.platform].icon}
            alt={article.platform}
            width={16}
            height={16}
          />
          <span className="font-medium text-sm">
            {PLATFORM_ICON_MAP[article.platform].label}
          </span>
        </span>
      </Link>
    </article>
  );
};
