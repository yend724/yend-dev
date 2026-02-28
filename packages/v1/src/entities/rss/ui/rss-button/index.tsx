import { Rss as RssIcon } from "lucide-react";

import { SITE_METADATA } from "../../../../shared/config/site";

export const RssButton = () => {
  return (
    <a
      className="hover:bg-gray-4 rounded-full p-2"
      href={SITE_METADATA.rss}
      target="_blank"
      rel="noopener"
    >
      <RssIcon size={18} aria-label="RSSを購読する" />
    </a>
  );
};
