import { SITE_METADATA } from "@/shared/config/site";

import { Link } from "../link";

type Props = {
  renderTitle?: (text: string) => React.ReactNode;
  actions?: React.ReactNode;
};
export const Header: React.FC<Props> = ({
  renderTitle = (title) => <>{title}</>,
  actions,
}) => {
  return (
    <header className="mx-auto grid w-full max-w-5xl grid-cols-[auto_auto] items-center justify-between p-4">
      <Link href="/" className="font-bold">
        {renderTitle(SITE_METADATA.title)}
      </Link>
      {actions}
    </header>
  );
};
