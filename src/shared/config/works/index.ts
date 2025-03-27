type Work = {
  title: string;
  description: string;
};
type Library = Work & {
  npm: string;
  github: string;
};
type WebApp = Work & {
  app: string;
  github: string;
  thumbnail?: string;
};

export const LIBRARIES: Library[] = [
  {
    title: "LeanMD",
    description: "シンプルなMarkdown Parser",
    npm: "https://www.npmjs.com/package/leanmd",
    github: "https://github.com/yend724/leanmd",
  },
  {
    title: "Vite Plugin Ssinc",
    description: "ViteでSSIライクな`#include`をするためのプラグイン",
    npm: "https://www.npmjs.com/package/vite-plugin-ssinc",
    github: "https://github.com/yend724/vite-plugin-ssinc",
  },
];
export const WEB_APPS: WebApp[] = [
  {
    title: "CSV 2 Markdown Table",
    description: "CSVをMarkdownの表形式に変換するウェブアプリ",
    app: "https://csv-2-markdown-table.yend.dev",
    github: "https://github.com/yend724/csv-2-markdown-table",
  },
  {
    title: "Shake Snap",
    description: "手ブレ写真が撮れるウェブアプリ",
    app: "https://shake-snap.yend.dev/",
    github: "https://github.com/yend724/shake-snap",
  },
  {
    title: "GitHub Actions Cron Expression Builder",
    description: "GitHub ActionsのCron式を簡単に作成するツール",
    app: "https://cron-expression-builder.yend.dev",
    github: "https://github.com/yend724/cron-expression-builder",
  },
];
