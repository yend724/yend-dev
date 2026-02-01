import fs from "node:fs";

import { postsDir } from "@resources/paths";

import { EXTENSION } from "../../../shared/config/extension";
import { validateComponent, validateFrontmatter } from "../model/validation";

export const getPost = async (fileName: string) => {
  const post = await import(`@resources/posts/${fileName}`);
  const component = validateComponent(post);
  const frontmatter = validateFrontmatter(post);
  frontmatter.date = new Date(`${frontmatter.date}+09:00`).toISOString();
  const slug = fileName.replace(EXTENSION.mdx, "");
  return { component, frontmatter, slug };
};

export const getPosts = async () => {
  const fileNames = fs.readdirSync(postsDir);
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName))
  );
  return files;
};
