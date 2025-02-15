import { SITE_METADATA } from "@/shared/config/site";
import { Link } from "@/shared/ui/link";

type Props = {
  renderTitle?: (text: string) => React.ReactNode;
};
export const Header: React.FC<Props> = ({
  renderTitle = (title) => <>{title}</>,
}) => {
  return (
    <header className="mx-auto flex w-full max-w-5xl p-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {renderTitle(SITE_METADATA.title)}
      </Link>
    </header>
  );
};
