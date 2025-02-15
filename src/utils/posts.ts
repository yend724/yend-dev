import fs from "node:fs";
import { getProjectRoot } from "@/shared/lib/endpoint";
import type { FC } from "react";
import * as v from "valibot";

// Define the schema
const FrontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  draft: v.boolean(),
  tags: v.undefinedable(v.array(v.string()), () => []),
});
const validatePost = (post: unknown) => {
  if (typeof post !== "object" || post === null) {
    throw new Error("Invalid post format");
  }

  const { frontmatter, default: Component } = post as {
    frontmatter: unknown;
    default: FC;
  };

  const validatedFrontmatter = v.parse(FrontmatterSchema, frontmatter);

  return {
    frontmatter: validatedFrontmatter,
    default: Component,
  };
};

export const getPost = async (slug: string) => {
  const post = await import(`@/resources/posts/${slug}`);
  const validatedPost = validatePost(post);
  return { ...validatedPost, slug: slug.replace(/\.mdx$/, "") };
};

export const getPosts = async () => {
  const postsRootEndpoint = `${getProjectRoot()}/src/resources/posts`;
  const fileNames = fs.readdirSync(postsRootEndpoint);
  const files = await Promise.all(
    fileNames.map(async (fileName) => getPost(fileName)),
  );
  return files;
};
