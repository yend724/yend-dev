import { sortArticlesByIsoDate } from "../../entities/article/lib/articles";
import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
} from "../../entities/article/server";
import { Posts } from "../../views/posts";

const zennArticles = await getZennArticles();
const qiitaArticles = await getQiitaArticles();
const myArticles = await getMyArticles();
const articles = [...zennArticles, ...qiitaArticles, ...myArticles];

const Page: React.FC = () => {
  return <Posts articles={sortArticlesByIsoDate(articles)} />;
};

export default Page;

export const metadata = {
  title: "書いた記事一覧",
};
