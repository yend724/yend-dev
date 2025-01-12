import { Link } from "@/components/link";

type Props = {
  label: string;
  href: string;
};
export const LinkTag: React.FC<Props> = ({ label, href }) => {
  return (
    <Link
      className="neumorphism-shadow rounded-full px-4 py-2 text-sky-400 text-sm"
      href={href}
    >
      {label}
    </Link>
  );
};
