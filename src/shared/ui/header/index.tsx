import { RssButton } from "@/entities/rss";
import { SITE_METADATA } from "@/shared/config/site";
import { Link } from "@/shared/ui/link";

type Props = {
  renderTitle?: (text: string) => React.ReactNode;
};
export const Header: React.FC<Props> = ({
  renderTitle = (title) => <>{title}</>,
}) => {
  return (
    <header className="mx-auto grid w-full max-w-5xl grid-cols-[auto_auto] items-center justify-between p-4">
      <Link href="/" className="font-bold">
        {renderTitle(SITE_METADATA.title)}
      </Link>
      <RssButton />
    </header>
  );
};
