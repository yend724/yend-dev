import { JsonLdScript } from "../../../entities/json-ld";
import { generateSharedMeta } from "../../../entities/ogp";
import { getPost, getPosts } from "../../../entities/post";
import { getAdjacentPosts } from "../../../entities/post/lib/get-adjacent-posts";
import { getRelativePosts } from "../../../entities/post/lib/get-relative-posts";
import { env } from "../../../shared/config/env";
import { EXTENSION } from "../../../shared/config/extension";
import { SITE_METADATA } from "../../../shared/config/site";
import { Posts } from "../../../views/posts/[slug]";

import type { Article, BreadcrumbList, WithContext } from "schema-dts";

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

  // 同じタグの記事を取得
  const relativePosts = getRelativePosts(posts, slug, frontmatter);

  const postUrl = `${SITE_METADATA.url}/posts/${slug}/`;

  const blogPostingJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: new Date(frontmatter.date).toISOString(),
    url: postUrl,
    image: `${postUrl}opengraph-image.png`,
    author: {
      "@type": "Person",
      name: SITE_METADATA.author,
      url: SITE_METADATA.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE_METADATA.author,
      url: SITE_METADATA.url,
    },
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_METADATA.title,
        item: SITE_METADATA.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "記事一覧",
        item: `${SITE_METADATA.url}/posts/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <JsonLdScript data={blogPostingJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <Posts
        frontmatter={frontmatter}
        slug={slug}
        prevPost={adjacentPosts.prev}
        nextPost={adjacentPosts.next}
        relativePosts={relativePosts.slice(0, 3)}
      >
        <Component />
      </Posts>
    </>
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

  return generateSharedMeta({
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: `${SITE_METADATA.url}/posts/${slug}/`,
    },
    openGraph: {
      url: `${SITE_METADATA.url}/posts/${slug}/`,
      type: "article",
      publishedTime: publishedDateTime,
      images: [
        {
          url: `${SITE_METADATA.url}/posts/${slug}/opengraph-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  });
};
