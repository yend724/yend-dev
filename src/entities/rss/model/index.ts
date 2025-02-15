import { OGP_IMAGE } from "@/shared/config/ogp";
import { SITE_METADATA } from "@/shared/config/site";

import { Feed } from "feed";

export { Feed } from "feed";

export const createFeed = () => {
  return new Feed({
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    id: SITE_METADATA.url,
    link: SITE_METADATA.url,
    language: "ja",
    copyright: `All rights reserved 2024, ${SITE_METADATA.creator}.`,
    image: OGP_IMAGE.url,
    author: {
      name: SITE_METADATA.author,
    },
  });
};

export const addPostToFeed = (
  feed: Feed,
  post: {
    title: string;
    slug: string;
    date: string;
  },
) => {
  feed.addItem({
    title: post.title,
    id: `${SITE_METADATA.url}/posts/${post.slug}/`,
    link: `${SITE_METADATA.url}/posts/${post.slug}/`,
    date: new Date(post.date),
    author: [
      {
        name: SITE_METADATA.author,
      },
    ],
  });
};

export const generateRSS = (
  posts: {
    title: string;
    slug: string;
    date: string;
  }[],
) => {
  const feed = createFeed();
  for (const post of posts) {
    addPostToFeed(feed, post);
  }

  return {
    rss: feed.rss2(),
  };
};
