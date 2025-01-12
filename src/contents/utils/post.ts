import type { Meta } from "../types/post";

type GeneratePostMetaArgs = {
  title: string;
  date: `${number}-${number}-${number}T${number}:${number}:${number}`;
  draft?: boolean;
  tags?: string[];
};
const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
export const generatePostMeta = (args: GeneratePostMetaArgs): Meta => {
  const { title, date, draft = true, tags = [] } = args;
  if (!dateRegex.test(date)) {
    console.error(`Invalid date format: ${date}`);
    throw new Error("Invalid date format");
  }
  return {
    title,
    date: `${date}+09:00`,
    draft,
    tags,
  };
};
