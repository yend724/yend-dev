import type { Heading } from "../lib/extract-headings";
import type { Frontmatter } from "./frontmatter";

export type Post = {
  component: React.FC;
  frontmatter: Frontmatter;
  slug: string;
  headings: Heading[];
};

export type AdjacentPost = {
  title: string;
  slug: string;
  date: string;
};

export type AdjacentPosts = {
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
};
