export const SITE_META = {
  title: "YEND.DEV",
  description: "YENDの実験場",
  url: "https://yend.dev",
  locale: "ja_JP",
  colorScheme: "dark",
  creator: "YEND",
  author: "YEND",
  rss: "https://yend.dev/rss.xml",
} as const;

export const OGP_IMAGE = {
  url: "https://yend.dev/assets/images/ogp.png",
  width: 1200,
  height: 630,
} as const;

export const OGP_X = {
  card: "summary_large_image",
} as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/yend724" },
  { label: "Zenn", href: "https://zenn.dev/yend724" },
  { label: "Qiita", href: "https://qiita.com/yend724" },
  { label: "X(旧Twitter)", href: "https://x.com/yend724" },
  { label: "mixi2", href: "https://mixi.social/@yend724" },
  { label: "CodePen", href: "https://codepen.io/yend24" },
] as const;
