import { Link } from "../link";

type Props = {
  label: string;
  href: string;
};
export const LinkTag: React.FC<Props> = ({ label, href }) => {
  return (
    <Link
      className="text-sky-11 border-sky-6 bg-sky-3 hover:bg-sky-4 rounded-full border px-4 py-2 text-sm"
      href={href}
    >
      {label}
    </Link>
  );
};
