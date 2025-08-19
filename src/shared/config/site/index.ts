export const SITE_METADATA = {
  title: "YEND.DEV",
  description: "YENDの実験場",
  url: "https://yend.dev",
  locale: "ja_JP",
  colorScheme: "dark",
  creator: "YEND",
  mentionId: "@yend724",
  author: "YEND",
  rss: "https://yend.dev/rss.xml",
  domain: "yend.dev",
};

export const OGP_IMAGE = {
  url: "https://yend.dev/assets/images/ogp.png",
  width: 1200,
  height: 630,
} as const;
export const OGP_X = {
  card: "summary_large_image",
} as const;
export const OGP_ASSETS_DIR = "_assets/images/posts";
export const OGP_DIR = `public/${OGP_ASSETS_DIR}`;
