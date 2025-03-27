import { Link } from "@/shared/ui/link";

export type WorkLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};
export const WorkLink = ({ href, icon, label }: WorkLinkProps) => (
  <Link href={href} className="group flex items-center gap-2">
    <span>{icon}</span>
    <span className="text-sky-400 group-hover:underline">{label}</span>
  </Link>
);
