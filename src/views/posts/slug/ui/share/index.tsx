import { SITE_METADATA } from "@/shared/config/site";
import { ShareButton } from "@/shared/ui/share-button";
import { XShareButton } from "@/shared/ui/x-share-button";

type Props = {
  slug: string;
  title: string;
};
export const Share: React.FC<Props> = ({ slug, title }) => {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <ShareButton
        shareData={{
          title: `${title} | ${SITE_METADATA.author}`,
          url: `${SITE_METADATA.url}/posts/${slug}/`,
        }}
      />
      <XShareButton
        shareData={{
          text: `${title} | ${SITE_METADATA.author}`,
          url: `${SITE_METADATA.url}/posts/${slug}/`,
        }}
      />
    </div>
  );
};
