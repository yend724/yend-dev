import XLogo from "@/assets/images/x-logo.svg";
import { Link } from "@/components/link";
import { generateXUrl } from "./utils";

type Props = {
  shareData: {
    url: string;
    text: string;
  };
};
export const XShareButton: React.FC<Props> = ({ shareData }) => {
  const href = generateXUrl(shareData.url, shareData.text);
  return (
    <Link className="rounded-full p-2 hover:bg-neutral-700" href={href}>
      <img src={XLogo.src} alt="Xで共有する" width={16} height={16} />
    </Link>
  );
};
