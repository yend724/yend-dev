import fs from "node:fs";
import { generateSharedMeta } from "@/features/opg/utils/generate-meta";
import { generateOgpImage } from "@/features/opg/utils/generate-ogp-image";
import { env } from "@/shared/config/env";
import { OGP_IMAGE } from "@/shared/config/ogp";
import { SITE_METADATA } from "@/shared/config/site";
import { getPost, getPosts } from "@/utils/posts";
import { PostsPage } from "@/views/posts/slug";

const MDX_EXTENSION = ".mdx";
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const { default: Component, frontmatter } = await getPost(
    `${slug}${MDX_EXTENSION}`,
  );
  return (
    <PostsPage frontmatter={frontmatter} component={Component} slug={slug} />
  );
};

export default Page;

const OGP_ASSETS_DIR = "_assets/images/posts";
const OGP_DIR = `public/${OGP_ASSETS_DIR}`;
const makeDirRecursive = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const generateStaticParams = async () => {
  const isFiltering = env().isProd;
  const posts = await getPosts();
  const slugs = posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({
      slug: post.slug,
    }));

  return slugs;
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { frontmatter } = await getPost(`${slug}${MDX_EXTENSION}`);
  const publishedTime = new Date(frontmatter.date).toISOString();

  // OGP画像を生成して保存する
  makeDirRecursive(OGP_DIR);
  const img = await generateOgpImage(frontmatter.title);
  fs.writeFileSync(`${OGP_DIR}/${slug}.png`, img);

  return generateSharedMeta({
    title: frontmatter.title,
    openGraph: {
      url: `${SITE_METADATA.url}/posts/${slug}/`,
      type: "article",
      publishedTime,
      images: [
        {
          url: `${SITE_METADATA.url}/${OGP_ASSETS_DIR}/${slug}.png`,
          width: OGP_IMAGE.width,
          height: OGP_IMAGE.height,
        },
      ],
    },
  });
};
