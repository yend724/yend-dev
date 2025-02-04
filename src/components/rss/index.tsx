import { Link } from "@/components/link";
import { Rss as RssIcon } from "lucide-react";

const RSS_URL = "/rss.xml";

export const Rss = () => {
  return (
    <Link className="rounded-full p-2 hover:bg-neutral-700" href={RSS_URL}>
      <RssIcon size={18} aria-label="RSSを購読する" />
    </Link>
  );
};
