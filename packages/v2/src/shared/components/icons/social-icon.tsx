import { BookMarked, MessageCircle } from "lucide-react";

import type { SocialId } from "@/shared/config/profile";

import { CodePenIcon } from "./codepen-icon";
import { GitHubIcon } from "./github-icon";
import { QiitaIcon } from "./qiita-icon";
import { XIcon } from "./x-icon";
import { ZennIcon } from "./zenn-icon";

type IconProps = {
  size?: number;
};

/* mixi2 とブクログは公式ロゴのベクターがないので lucide の汎用アイコンで代用する。 */
const ICONS: Record<SocialId, React.FC<IconProps>> = {
  github: GitHubIcon,
  zenn: ZennIcon,
  qiita: QiitaIcon,
  x: XIcon,
  mixi2: MessageCircle,
  codepen: CodePenIcon,
  booklog: BookMarked,
};

type SocialIconProps = IconProps & {
  id: SocialId;
};

export const SocialIcon: React.FC<SocialIconProps> = ({ id, size = 16 }) => {
  const Icon = ICONS[id];
  return <Icon size={size} />;
};
