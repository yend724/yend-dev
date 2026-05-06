import { Link } from "@/shared/ui/link";

type LinkItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};
type Props = {
  linkList: LinkItem[];
};
export const LinkList: React.FC<Props> = ({ linkList }) => (
  <ul className="flex items-center gap-4">
    {linkList.map((link, i) => (
      <li key={i}>
        <Link href={link.href} className="group flex items-center gap-2">
          <span>{link.icon}</span>
          <span className="text-sky-11 group-hover:underline">
            {link.label}
          </span>
        </Link>
      </li>
    ))}
  </ul>
);
