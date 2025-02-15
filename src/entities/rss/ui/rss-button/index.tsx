import { PATHS } from "@/shared/config/path";
import { Link } from "@/shared/ui/link";
import { Rss as RssIcon } from "lucide-react";

export const RssButton = () => {
  return (
    <Link className="rounded-full p-2 hover:bg-neutral-700" href={PATHS.RSS}>
      <RssIcon size={18} aria-label="RSSを購読する" />
    </Link>
  );
};
