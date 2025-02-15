import type {
  Article,
  QiitaRSSFeed,
  QiitaRSSFeedItem,
  ZennRSSFeedItem,
} from "@/entities/rss-feed";
import { env } from "@/shared/config/env";
import { getPosts } from "@/utils/posts";
import Parser from "rss-parser";

const parser = new Parser();

export const normalizeZennArticle = (article: ZennRSSFeedItem) => {
  return {
    id: article.guid,
    title: article.title,
    link: article.link,
    isoDate: article.isoDate,
    source: "zenn" as const,
  };
};
export const normalizeQiitaArticle = (article: QiitaRSSFeedItem) => {
  return {
    id: article.id,
    title: article.title,
    link: article.link,
    isoDate: article.isoDate,
    source: "qiita" as const,
  };
};

export const normalizeMyArticles = (article: {
  title: string;
  date: string;
  slug: string;
}) => {
  return {
    id: article.slug,
    title: article.title,
    link: `/posts/${article.slug}`,
    isoDate: new Date(article.date).toISOString(),
    source: "yend" as const,
  };
};

export const getZennArticles = async () => {
  const feed = await parser.parseURL("https://zenn.dev/yend724/feed?all=1");
  const articles = feed.items.map((item) => {
    return item as ZennRSSFeedItem;
  });
  return articles;
};
export const getQiitaArticles = async () => {
  const feed = (await parser.parseURL(
    "https://qiita.com/yend724/feed",
  )) as QiitaRSSFeed;
  const articles = feed.items.map((item) => {
    return item as QiitaRSSFeedItem;
  });
  return articles;
};
export const getMyArticles = async () => {
  const isFiltering = env().isProd;
  const posts = await getPosts();
  const articles = posts
    .map((post) => {
      return {
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        draft: post.frontmatter.draft,
        slug: post.slug,
      };
    })
    .filter((post) => (isFiltering ? !post.draft : true));

  return articles;
};

export const sortArticlesByIsoDate = (articles: Article[]) => {
  return articles.sort((a, b) => {
    return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
  });
};
