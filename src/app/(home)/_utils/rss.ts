import { OGP_IMAGE, SITE_META } from "@/constants";

import { Feed } from "feed";

export const createFeed = () => {
  return new Feed({
    title: SITE_META.title,
    description: SITE_META.description,
    id: SITE_META.url,
    link: SITE_META.url,
    language: "ja",
    copyright: `All rights reserved 2024, ${SITE_META.creator}.`,
    image: OGP_IMAGE.url,
    author: {
      name: SITE_META.author,
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
    id: `${SITE_META.url}/posts/${post.slug}/`,
    link: `${SITE_META.url}/posts/${post.slug}/`,
    date: new Date(post.date),
    author: [
      {
        name: SITE_META.author,
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
