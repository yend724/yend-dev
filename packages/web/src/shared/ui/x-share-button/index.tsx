import { generateXUrl } from "./utils";

import XLogo from "@/assets/images/common/x-logo.svg";
import { Link } from "../link";

type Props = {
  shareData: {
    url: string;
    text: string;
  };
};
export const XShareButton: React.FC<Props> = ({ shareData }) => {
  const href = generateXUrl(shareData.url, shareData.text);
  return (
    <Link className="hover:bg-gray-4 rounded-full p-2" href={href}>
      <img src={XLogo.src} alt="Xで共有する" width={16} height={16} />
    </Link>
  );
};
