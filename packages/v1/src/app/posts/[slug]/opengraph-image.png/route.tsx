import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { OgpImage } from "@/entities/ogp/ui";
import { getPost, getPosts } from "@/entities/post";
import { isProd } from "@/shared/config/env";
import { EXTENSION } from "@/shared/config/extension";

const WIDTH = 1200;
const HEIGHT = 630;

const fontRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/NotoSansJP-Regular.ttf")
);
const fontSemibold = readFileSync(
  join(process.cwd(), "src/assets/fonts/NotoSansJP-SemiBold.ttf")
);

export const GET = async (
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const { frontmatter } = await getPost(`${slug}${EXTENSION.mdx}`);

  return new ImageResponse(<OgpImage title={frontmatter.title} />, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontRegular,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Noto Sans JP",
        data: fontSemibold,
        weight: 600 as const,
        style: "normal" as const,
      },
    ],
  });
};

export const generateStaticParams = async () => {
  const isFiltering = isProd;
  const posts = await getPosts();
  return posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({ slug: post.slug }));
};

export const dynamic = "force-static";
