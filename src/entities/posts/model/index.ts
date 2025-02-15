import fs from "node:fs";
import { getProjectRoot } from "@/shared/lib/endpoint";
import { validateComponent, validateFrontmatter } from "./schema";

export const validatePost = (post: unknown) => {
  const validatedFrontmatter = validateFrontmatter(post);
  const validatedComponent = validateComponent(post);
  return {
    frontmatter: validatedFrontmatter,
    component: validatedComponent,
  };
};

export const getPost = async (slug: string) => {
  const post = await import(`@/resources/posts/${slug}`);
  const { frontmatter, component } = validatePost(post);

  return {
    slug: slug.replace(/\.mdx$/, ""),
    frontmatter,
    component,
  };
};

export const getPosts = async () => {
  const postsRootEndpoint = `${getProjectRoot()}/src/resources/posts`;
  const fileNames = fs.readdirSync(postsRootEndpoint);
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName)),
  );
  return files;
};
