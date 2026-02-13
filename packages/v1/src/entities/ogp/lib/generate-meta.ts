import { OGP_IMAGE, OGP_X, SITE_METADATA } from "../../../shared/config/site";

import type { Metadata } from "next";

type SharedMeta = Partial<
  Pick<
    Metadata,
    "title" | "description" | "openGraph" | "twitter" | "alternates"
  >
>;
export const generateSharedMeta = (metadata: SharedMeta = {}): Metadata => {
  const { title, description, openGraph, twitter, alternates } = metadata;
  return {
    title: title ?? {
      template: `%s | ${SITE_METADATA.title}`,
      default: `${SITE_METADATA.title}`,
    },
    description: description ?? SITE_METADATA.description,
    creator: SITE_METADATA.creator,
    authors: [
      {
        name: SITE_METADATA.author,
      },
    ],
    alternates: {
      canonical: alternates?.canonical ?? SITE_METADATA.url,
      types: {
        "application/rss+xml": SITE_METADATA.rss,
      },
    },
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
