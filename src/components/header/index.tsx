import { Link } from "@/components/link";
import { SITE_META } from "@/constants";

type Props = {
  title?: (text: string) => React.ReactNode;
};
export const Header: React.FC<Props> = ({
  title = (title) => <>{title}</>,
}) => {
  return (
    <header className="mx-auto flex w-full p-4">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {title(SITE_META.title)}
      </Link>
    </header>
  );
};
