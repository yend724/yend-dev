import { generateOgpImage, generateSharedMeta } from "@/entities/ogp";
import { getPost, getPosts } from "@/entities/post";
import { env } from "@/shared/config/env";
import { EXTENSION } from "@/shared/config/extension";
import { OGP_ASSETS_DIR, OGP_DIR, OGP_IMAGE } from "@/shared/config/site";
import { SITE_METADATA } from "@/shared/config/site";
import { makeDirRecursive, writeFile } from "@/shared/lib/file-system";
import { Main } from "@/views/posts/slug";

type Params = {
  params: Promise<{ slug: string }>;
};
type Props = Params;
const Page: React.FC<Props> = async ({ params }) => {
  const slug = (await params).slug;
  const { component: Component, frontmatter } = await getPost(
    `${slug}${EXTENSION.mdx}`,
  );

  return (
    <Main frontmatter={frontmatter} slug={slug}>
      <Component />
    </Main>
  );
};

export default Page;

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

export const generateMetadata = async ({ params }: Params) => {
  const { slug } = await params;
  const { frontmatter } = await getPost(`${slug}${EXTENSION.mdx}`);
  const publishedDateTime = new Date(frontmatter.date).toISOString();

  // OGP画像を生成して保存する
  makeDirRecursive(OGP_DIR);
  writeFile(
    `${OGP_DIR}/${slug}.png`,
    await generateOgpImage(frontmatter.title),
  );

  return generateSharedMeta({
    title: frontmatter.title,
    openGraph: {
      url: `${SITE_METADATA.url}/posts/${slug}/`,
      type: "article",
      publishedTime: publishedDateTime,
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
