import { OGP_IMAGE, OGP_X } from "@/shared/config/ogp";
import { SITE_META } from "@/shared/config/site";
import type { Metadata } from "next";

type SharedMeta = Partial<Pick<Metadata, "title" | "openGraph" | "twitter">>;
export const generateSharedMeta = (metadata: SharedMeta = {}): Metadata => {
  const { openGraph, twitter, ...rest } = metadata;
  return {
    title: {
      template: `%s | ${SITE_META.title}`,
      default: `${SITE_META.title}`,
    },
    description: SITE_META.description,
    creator: SITE_META.creator,
    authors: [
      {
        name: SITE_META.author,
      },
    ],
    alternates: {
      types: {
        "application/rss+xml": SITE_META.rss,
      },
    },
    ...rest,
    openGraph: {
      locale: SITE_META.locale,
      url: SITE_META.url,
      siteName: SITE_META.title,
      images: [
        {
          url: OGP_IMAGE.url,
          width: OGP_IMAGE.width,
          height: OGP_IMAGE.height,
        },
      ],
      ...openGraph,
    },
    twitter: {
      ...OGP_X,
      ...twitter,
    },
  };
};
