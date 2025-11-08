import Image from "next/image";

import { useHandleOpenLink } from "./hooks/useHandleOpenLink";

import type { ArticlePreviewInterface } from "../../model/article";

import { Card } from "@/shared/ui/card";
import { FormattedDate } from "@/shared/ui/date-time";
import {
  CalendarIcon,
  ChevronRightIcon,
  ProfileIcon,
  QiitaIcon,
  ZennIcon,
} from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";

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
  const { anchorRef, clickableRef } = useHandleOpenLink();

  return (
    <Card
      key={article.id}
      as="article"
      className="group cursor-pointer transition-all duration-200 hover:border-sky-500"
      ref={clickableRef}
    >
      <div className="grid gap-2">
        <div className="flex items-center gap-x-1 text-sm opacity-80">
          <CalendarIcon className="size-3.5" />
          <FormattedDate date={article.isoDate} />
        </div>
        <h3 className="text-lg font-semibold">
          <Link ref={anchorRef} href={article.link}>
            {article.title}
          </Link>
        </h3>
        <span className="flex items-center gap-x-2">
          <Image
            className="size-4"
            src={PLATFORM_ICON_MAP[article.platform].icon}
            alt={article.platform}
            width={16}
            height={16}
          />
          <div className="flex w-full items-center justify-between gap-x-1">
            <span className="text-sm font-medium">
              {PLATFORM_ICON_MAP[article.platform].label}
            </span>
            <span className="group-hover:animate-rotate-x transition-all duration-200 group-hover:text-sky-500">
              <ChevronRightIcon width={16} height={16} />
            </span>
          </div>
        </span>
      </div>
    </Card>
  );
};
