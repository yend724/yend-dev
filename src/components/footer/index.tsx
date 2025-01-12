import { Link } from "@/components/link";
import { SOCIAL_LINKS } from "@/constants";

export const Footer = () => {
  return (
    <footer className="grid gap-4 border-neutral-200/20 border-t p-4 pt-6 text-start">
      <ul className="flex flex-wrap gap-2 text-sm">
        {SOCIAL_LINKS.map((link) => {
          return (
            <li key={link.href}>
              <Link href={link.href} className="underline hover:no-underline">
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <small className="text-xs">All rights reserved 2024, YEND.</small>
    </footer>
  );
};
