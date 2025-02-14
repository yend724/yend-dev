import { OGP_IMAGE, OGP_X } from "@/shared/config/ogp";
import { SITE_METADATA } from "@/shared/config/site";
import type { Metadata } from "next";

type SharedMeta = Partial<Pick<Metadata, "title" | "openGraph" | "twitter">>;
export const generateSharedMeta = (metadata: SharedMeta = {}): Metadata => {
  const { openGraph, twitter, ...rest } = metadata;
  return {
    title: {
      template: `%s | ${SITE_METADATA.title}`,
      default: `${SITE_METADATA.title}`,
    },
    description: SITE_METADATA.description,
    creator: SITE_METADATA.creator,
    authors: [
      {
        name: SITE_METADATA.author,
      },
    ],
    alternates: {
      types: {
        "application/rss+xml": SITE_METADATA.rss,
      },
    },
    ...rest,
    openGraph: {
      locale: SITE_METADATA.locale,
      url: SITE_METADATA.url,
      siteName: SITE_METADATA.title,
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
