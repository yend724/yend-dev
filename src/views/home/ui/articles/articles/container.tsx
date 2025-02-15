import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
  normalizeMyArticles,
  normalizeQiitaArticle,
  normalizeZennArticle,
  sortArticlesByIsoDate,
} from "../../../lib/articles";

import { ArticlesPresentation } from "./presentation";

export const ArticlesContainer = async () => {
  const zennArticles = await getZennArticles();
  const qiitaArticles = await getQiitaArticles();
  const myArticles = await getMyArticles();

  const articles = [
    ...zennArticles.map(normalizeZennArticle),
    ...qiitaArticles.map(normalizeQiitaArticle),
    ...myArticles.map(normalizeMyArticles),
  ];

  const sortedArticles = sortArticlesByIsoDate(articles);

  return <ArticlesPresentation articles={sortedArticles} />;
};
