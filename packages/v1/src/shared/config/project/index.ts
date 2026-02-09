import GitHubActionsCronExpressionBuilder from "@/assets/images/works/cron-expression-builder-thumbnail.png";
import CSV2MarkdownTable from "@/assets/images/works/csv-2-markdown-table-thumbnail.png";
import BoidsSimulation from "@/assets/images/works/playground-boids-simulation-thumbnail.png";

type Projects = {
  title: string;
  description: string;
};
export type Library = Projects & {
  npm: string;
  github: string;
};
export type WebApp = Projects & {
  app: string;
  github: string;
  thumbnail?: string;
};
export type Playground = Projects & {
  url: string;
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
    thumbnail: CSV2MarkdownTable.src,
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
    thumbnail: GitHubActionsCronExpressionBuilder.src,
  },
  {
    title: "ガゾウツナゲール",
    description: "複数の画像を1つにつなげる無料オンラインツール",
    app: "https://gazoutsunage-ru.yend.dev",
    github: "https://github.com/yend724/gazoutsunage-ru",
    thumbnail: "https://gazoutsunage-ru.yend.dev/img/ogp.png",
  },
  {
    title: "Typography Playground",
    description:
      "CSS タイポグラフィプロパティをリアルタイムプレビューで確認できるブラウザベースツール",
    app: "https://yend724.github.io/typography-playground/",
    github: "https://github.com/yend724/typography-playground",
    thumbnail: "https://yend724.github.io/typography-playground/ogp.png",
  },
];

export const PLAYGROUNDS: Playground[] = [
  {
    title: "Boids Simulation",
    description: "Boidsアルゴリズムを用いた簡易シミュレーション",
    url: "https://playground.yend.dev/boids-simulation/",
    github:
      "https://github.com/yend724/yend-playground/tree/main/src/boids-simulation",
    thumbnail: BoidsSimulation.src,
  },
];
