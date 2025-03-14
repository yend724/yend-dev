type Work = {
  title: string;
  description: string;
  url: string;
};
export const MY_WORKS: Work[] = [
  {
    title: "LeanMD",
    description: "シンプルなMarkdown Parser",
    url: "https://www.npmjs.com/package/leanmd",
  },
  {
    title: "CSV 2 Markdown Table",
    description: "CSVをMarkdownの表形式に変換するウェブアプリ",
    url: "https://csv-2-markdown-table.yend.dev",
  },
  {
    title: "Shake Snap",
    description: "手ブレ写真が撮れるウェブアプリ",
    url: "https://github.com/yend724/shake-snap",
  },
  {
    title: "GitHub Actions Cron Expression Builder",
    description: "GitHub ActionsのCron式を簡単に作成するツール",
    url: "https://cron-expression-builder.yend.dev",
  },
  {
    title: "Vite Plugin Ssinc",
    description: "ViteでSSIライクな`#include`をするためのプラグイン",
    url: "https://www.npmjs.com/package/vite-plugin-ssinc",
  },
];
