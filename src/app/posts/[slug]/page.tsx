import { generateOgpImage, generateSharedMeta } from "@/entities/ogp";
import { getPost, getPosts } from "@/entities/post";
import { getAdjacentPosts } from "@/entities/post/lib/get-adjacent-posts";
import { env } from "@/shared/config/env";
import { EXTENSION } from "@/shared/config/extension";
import { OGP_ASSETS_DIR, OGP_DIR, OGP_IMAGE } from "@/shared/config/site";
import { SITE_METADATA } from "@/shared/config/site";
import { runInProduction } from "@/shared/lib/env";
import { makeDirRecursive, writeFile } from "@/shared/lib/file-system";
import { Posts } from "@/views/posts/[slug]";

const posts = await getPosts();

type Params = { slug: string };
type Props = {
  params: Promise<Params>;
};
const Page: React.FC<Props> = async ({ params }) => {
  const slug = (await params).slug;
  const { component: Component, frontmatter } = await getPost(
    `${slug}${EXTENSION.mdx}`
  );

  // 前後の記事を取得
  const adjacentPosts = getAdjacentPosts(posts, slug);

  return (
    <Posts
      frontmatter={frontmatter}
      slug={slug}
      prevPost={adjacentPosts.prev}
      nextPost={adjacentPosts.next}
    >
      <Component />
    </Posts>
  );
};

export default Page;

export const generateStaticParams = async (): Promise<Params[]> => {
  const isFiltering = env().isProd;
  const posts = await getPosts();
  const slugs = posts
    .filter((post) => (isFiltering ? !post.frontmatter.draft : true))
    .map((post) => ({
      slug: post.slug,
    }));

  return slugs;
};

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const { frontmatter } = await getPost(`${slug}${EXTENSION.mdx}`);
  const publishedDateTime = new Date(frontmatter.date).toISOString();

  runInProduction(async () => {
    // OGP画像を生成して保存する
    makeDirRecursive(OGP_DIR);
    writeFile(
      `${OGP_DIR}/${slug}.png`,
      await generateOgpImage(frontmatter.title)
    );
  });

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
