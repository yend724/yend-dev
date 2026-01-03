import { SOCIALS } from "../../config/social";
import { Link } from "../link";

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-200/20">
      <div className="mx-auto grid w-full max-w-5xl gap-4 p-4 pt-6 text-start">
        <ul className="flex flex-wrap gap-2 text-sm">
          {SOCIALS.map((link) => {
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
