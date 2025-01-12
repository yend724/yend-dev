import fs from "node:fs";
import type { Meta } from "@/contents/types/post";
import { getProjectRoot } from "@/utils/endpoints";

export const getPost = async (slug: string) => {
  const post = (await import(`@/contents/posts/${slug}`)) as {
    meta: Meta;
    default: React.FC;
  };
  return { ...post, slug: slug.replace(/\.mdx$/, "") };
};

export const getPosts = async () => {
  const postsRootEndpoint = `${getProjectRoot()}/src/contents/posts`;
  const fileNames = fs.readdirSync(postsRootEndpoint);
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName)),
  );
  return files;
};
