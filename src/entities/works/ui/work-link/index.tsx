import { Link } from "@/shared/ui/link";

export type WorkLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};
export const WorkLink = ({ href, icon, label }: WorkLinkProps) => (
  <Link href={href} className="flex items-center gap-2 hover:underline">
    {icon} {label}
  </Link>
);
