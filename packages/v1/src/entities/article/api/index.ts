import Parser from "rss-parser";

import { env } from "../../../shared/config/env";
import { getPosts } from "../../post";

import type { ArticlePreviewInterface } from "../model/article";
import type {
  QiitaRSSFeed,
  QiitaRSSFeedItem,
  ZennRSSFeed,
  ZennRSSFeedItem,
} from "../model/feed";

const parser = new Parser();

const normalizeZennArticle = (
  article: ZennRSSFeedItem
): ArticlePreviewInterface => {
  return {
    id: article.guid,
    title: article.title,
    link: article.link,
    isoDate: article.isoDate,
    platform: "zenn" as const,
  };
};
export const getZennArticles = async () => {
  const feed = (await parser.parseURL(
    "https://zenn.dev/yend724/feed?all=1"
  )) as ZennRSSFeed;
  const articles = feed.items.map(normalizeZennArticle);
  return articles;
};

const normalizeQiitaArticle = (
  article: QiitaRSSFeedItem
): ArticlePreviewInterface => {
  return {
    id: article.id,
    title: article.title,
    link: article.link,
    isoDate: article.isoDate,
    platform: "qiita" as const,
  };
};
export const getQiitaArticles = async () => {
  const feed = (await parser.parseURL(
    "https://qiita.com/yend724/feed"
  )) as QiitaRSSFeed;
  const articles = feed.items.map(normalizeQiitaArticle);
  return articles;
};

const normalizeMyArticles = (article: {
  title: string;
  date: string;
  slug: string;
}): ArticlePreviewInterface => {
  return {
    id: article.slug,
    title: article.title,
    link: `/posts/${article.slug}`,
    isoDate: new Date(article.date).toISOString(),
    platform: "yend" as const,
  };
};
export const getMyArticles = async () => {
  const isProduction = env().isProd;
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
    .filter((article) => {
      if (isProduction) {
        return !article.draft;
      }
      return true;
    })
    .map(normalizeMyArticles);

  return articles;
};
