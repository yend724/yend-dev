import { Link } from "@/components/link";
import { SITE_METADATA } from "@/shared/config/site";

type Props = {
  title?: (text: string) => React.ReactNode;
};
export const Header: React.FC<Props> = ({
  title = (title) => <>{title}</>,
}) => {
  return (
    <header className="mx-auto flex w-full max-w-5xl p-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {title(SITE_METADATA.title)}
      </Link>
    </header>
  );
};
