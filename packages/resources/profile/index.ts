import ProfileIcon from "../images/profile/profile-icon.png";

export type Certification = {
  name: string;
  date: string;
};
export type SocialId =
  | "github"
  | "zenn"
  | "qiita"
  | "x"
  | "mixi2"
  | "codepen"
  | "booklog";
export type Social = {
  id: SocialId;
  label: string;
  href: string;
};

export const PROFILE_ICON = ProfileIcon;

export const CERTIFICATIONS: Certification[] = [
  {
    name: "応用情報技術者試験",
    date: "2024/07",
  },
  {
    name: "情報処理安全確保支援士試験合格（未登録）",
    date: "2024/12",
  },
];

export const SOCIALS: Social[] = [
  { id: "github", label: "GitHub", href: "https://github.com/yend724" },
  { id: "zenn", label: "Zenn", href: "https://zenn.dev/yend724" },
  { id: "qiita", label: "Qiita", href: "https://qiita.com/yend724" },
  { id: "x", label: "X", href: "https://x.com/yend724" },
  { id: "mixi2", label: "mixi2", href: "https://mixi.social/@yend724" },
  { id: "codepen", label: "CodePen", href: "https://codepen.io/yend24" },
  { id: "booklog", label: "ブクログ", href: "https://booklog.jp/users/yend" },
];
