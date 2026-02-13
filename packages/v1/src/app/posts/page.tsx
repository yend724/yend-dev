import { sortArticlesByIsoDate } from "../../entities/article/lib/articles";
import {
  getMyArticles,
  getQiitaArticles,
  getZennArticles,
} from "../../entities/article/server";
import { generateSharedMeta } from "../../entities/ogp";
import { SITE_METADATA } from "../../shared/config/site";
import { Posts } from "../../views/posts";

const zennArticles = await getZennArticles();
const qiitaArticles = await getQiitaArticles();
const myArticles = await getMyArticles();
const articles = [...zennArticles, ...qiitaArticles, ...myArticles];

const Page: React.FC = () => {
  return <Posts articles={sortArticlesByIsoDate(articles)} />;
};

export default Page;

export const metadata = generateSharedMeta({
  title: "書いた記事一覧",
  description: "YENDが書いた技術記事の一覧ページ",
  alternates: {
    canonical: `${SITE_METADATA.url}/posts/`,
  },
});
