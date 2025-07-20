import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
} from "@/entities/article/server";
import { FilterArticles } from "@/features/filter-articles";
import { sortArticlesByIsoDate } from "@/entities/article/lib/articles";

const zennArticles = await getZennArticles();
const qiitaArticles = await getQiitaArticles();
const myArticles = await getMyArticles();

const articles = [...zennArticles, ...qiitaArticles, ...myArticles];

export const metadata = {
  title: "書いた記事",
};

const Page: React.FC = () => {
  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-semibold">書いたやつ</h1>
      <FilterArticles articles={sortArticlesByIsoDate(articles)} />
    </div>
  );
};

export default Page;
