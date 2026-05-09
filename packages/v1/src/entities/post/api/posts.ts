import fs from "node:fs";
import path from "node:path";

import { postsDir } from "@resources/paths";

import { extractHeadings } from "../lib/extract-headings";
import { validateComponent, validateFrontmatter } from "../model/validation";

import { EXTENSION } from "@/shared/config/extension";

export const getPost = async (fileName: string) => {
  const post = await import(`@resources/posts/${fileName}`);
  const component = validateComponent(post);
  const frontmatter = validateFrontmatter(post);
  frontmatter.date = new Date(`${frontmatter.date}+09:00`).toISOString();
  const slug = fileName.replace(EXTENSION.mdx, "");

  const raw = fs.readFileSync(path.join(postsDir, fileName), "utf-8");
  const headings = extractHeadings(raw);

  return { component, frontmatter, slug, headings };
};

export const getPosts = async () => {
  const fileNames = fs
    .readdirSync(postsDir)
    .filter((fileName) => fileName.endsWith(EXTENSION.mdx));
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName))
  );
  return files;
};
