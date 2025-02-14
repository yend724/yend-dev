import { Link } from "@/components/link";
import { SOCIAL_LINKS } from "@/shared/config/social";

export const Footer = () => {
  return (
    <footer className="border-neutral-200/20 border-t">
      <div className="mx-auto grid w-full max-w-5xl gap-4 p-4 pt-6 text-start">
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
      </div>
    </footer>
  );
};
