import fs from "node:fs";
import { EXTENSION } from "@/shared/config/extension";
import { getProjectRoot } from "@/shared/lib/endpoint";
import { validateComponent, validateFrontmatter } from "../model/validation";

export const getPost = async (fileName: string) => {
  const post = await import(`@/resources/posts/${fileName}`);
  const component = validateComponent(post);
  const frontmatter = validateFrontmatter(post);
  const slug = fileName.replace(EXTENSION.mdx, "");
  return { component, frontmatter, slug };
};

export const getPosts = async () => {
  const fileNames = fs.readdirSync(`${getProjectRoot()}/src/resources/posts`);
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName)),
  );
  return files;
};
