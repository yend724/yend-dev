import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getPost, getPosts } from "../../../../entities/post";
import { env } from "../../../../shared/config/env";
import { EXTENSION } from "../../../../shared/config/extension";
import { SITE_METADATA } from "../../../../shared/config/site";

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

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 64,
        backgroundColor: "#262626",
        fontWeight: 400,
      }}
    >
      <div style={{ color: "#F5F5F5", fontSize: 64, fontWeight: 600 }}>
        {frontmatter.title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#F5F5F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src="https://avatars.githubusercontent.com/u/65233817"
            alt=""
            width={80}
            height={80}
            style={{
              display: "flex",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          />
          <div style={{ fontSize: 48, lineHeight: 1 }}>
            {SITE_METADATA.creator}
          </div>
        </div>
        <div style={{ fontSize: 48, lineHeight: 1, opacity: 0.8 }}>
          {SITE_METADATA.domain}
        </div>
      </div>
    </div>,
    {
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
    }
  );
};

export const generateStaticParams = async () => {
  const isFiltering = env().isProd;
  const posts = await getPosts();
  return posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({ slug: post.slug }));
};

export const dynamic = "force-static";
