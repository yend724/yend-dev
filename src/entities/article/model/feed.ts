type ZennRSSFeedEnclosure = {
  url: string;
  length: string;
  type: string;
};
export type ZennRSSFeedItem = {
  creator: string;
  title: string;
  link: string;
  pubDate: string;
  enclosure?: ZennRSSFeedEnclosure;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
};
export type ZennRSSFeed = {
  items: ZennRSSFeedItem[];
};
export type QiitaRSSFeedItem = {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  id: string;
  isoDate: string;
};
export type QiitaRSSFeed = {
  items: QiitaRSSFeedItem[];
  link: string;
  feedUrl: string;
  title: string;
  lastBuildDate: string;
};
export type Article = {
  id: string;
  title: string;
  link: string;
  isoDate: string;
  source: "zenn" | "qiita" | "yend";
};
