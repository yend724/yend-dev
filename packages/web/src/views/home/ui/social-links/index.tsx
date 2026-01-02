import { SOCIALS } from "../../../../shared/config/social";
import { LinkTag } from "../../../../shared/ui/link-tag";

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {SOCIALS.map((link) => (
        <LinkTag key={link.label} label={link.label} href={link.href} />
      ))}
    </div>
  );
};
