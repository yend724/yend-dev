import fs from "node:fs";
import { Link } from "@/components/link";
import { Rss } from "@/components/rss";
import { ShareButton } from "@/components/share-button";
import { Toc } from "@/components/toc";
import { XShareButton } from "@/components/x-share-button";
import { generateSharedMeta } from "@/features/opg/utils/generate-meta";
import { generateOgpImage } from "@/features/opg/utils/generate-ogp-image";
import { OGP_IMAGE } from "@/shared/config/ogp";
import { SITE_META } from "@/shared/config/site";
import { isProd } from "@/utils/env";
import { getPost, getPosts } from "@/utils/posts";
import { ArrowLeft } from "lucide-react";

const MDX_EXTENSION = ".mdx";
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  const { default: Component, frontmatter } = await getPost(
    `${slug}${MDX_EXTENSION}`,
  );

  return (
    <div className="w-full space-y-12 pb-12">
      <div className="flex">
        <Link href="/#書いたやつ" className="flex items-center gap-x-2">
          <ArrowLeft size={14} />
          記事一覧へ戻る
        </Link>
      </div>
      <div className="grid gap-y-2">
        <time
          dateTime={new Date(frontmatter.date).toISOString()}
          className="flex gap-x-1 text-sm opacity-80"
        >
          <span>
            {new Date(frontmatter.date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              timeZone: "Asia/Tokyo",
            })}
          </span>
          <span>に公開</span>
        </time>
        <h1 className="font-bold text-3xl">{frontmatter.title}</h1>
        {frontmatter.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {frontmatter.tags.sort().map((tag) => (
              <li key={tag} className="rounded bg-sky-700 px-1 text-sm">
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <ShareButton
            shareData={{
              title: `${frontmatter.title} | ${SITE_META.author}`,
              url: `${SITE_META.url}/posts/${slug}/`,
            }}
          />
          <XShareButton
            shareData={{
              text: `${frontmatter.title} | ${SITE_META.author}`,
              url: `${SITE_META.url}/posts/${slug}/`,
            }}
          />
          <Rss />
        </div>
      </div>
      <div>
        <Toc />
      </div>
      <div className="markdown-body">
        <Component />
      </div>
    </div>
  );
};

const OGP_ASSETS_DIR = "_assets/images/posts";
const OGP_DIR = `public/${OGP_ASSETS_DIR}`;
const makeDirRecursive = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export default Page;

export const generateStaticParams = async () => {
  const isFiltering = isProd();
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
      url: `${SITE_META.url}/posts/${slug}/`,
      type: "article",
      publishedTime,
      images: [
        {
          url: `${SITE_META.url}/${OGP_ASSETS_DIR}/${slug}.png`,
          width: OGP_IMAGE.width,
          height: OGP_IMAGE.height,
        },
      ],
    },
  });
};
