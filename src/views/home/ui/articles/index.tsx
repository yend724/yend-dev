import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
} from "@/entities/article/server";
import { sortArticlesByIsoDate } from "../../lib/articles";

import { FilterArticles } from "@/features/filter-articles";

export const Articles = async () => {
  const zennArticles = await getZennArticles();
  const qiitaArticles = await getQiitaArticles();
  const myArticles = await getMyArticles();

  const articles = [...zennArticles, ...qiitaArticles, ...myArticles];
  const sortedArticles = sortArticlesByIsoDate(articles);

  return <FilterArticles articles={sortedArticles} />;
};
