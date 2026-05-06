import { ArticlePreview, sortArticlesByIsoDate } from "@/entities/article";
import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
} from "@/entities/article/api";

const zennArticles = await getZennArticles();
const qiitaArticles = await getQiitaArticles();
const myArticles = await getMyArticles();

export const Articles = () => {
  const articles = [...zennArticles, ...qiitaArticles, ...myArticles];
  const sortedArticles = sortArticlesByIsoDate(articles).slice(0, 6);

  return (
    <div className="grid gap-4">
      {sortedArticles.map((article) => (
        <ArticlePreview key={article.id} article={article} />
      ))}
    </div>
  );
};
