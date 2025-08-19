import fs from "node:fs";
import path from "node:path";

import { EXTENSION } from "@/shared/config/extension";
import { getProjectRoot } from "@/shared/lib/endpoint";

type Frontmatter = {
  title: string;
  date: string;
  draft?: boolean;
};

export type PostData = {
  slug: string;
  frontmatter: Frontmatter;
};

export const getPostsData = (): PostData[] => {
  const postsDir = path.join(getProjectRoot(), "src/resources/posts");
  const fileNames = fs.readdirSync(postsDir);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(EXTENSION.mdx))
    .map((fileName) => {
      const filePath = path.join(postsDir, fileName);
      const content = fs.readFileSync(filePath, "utf-8");

      // frontmatterを抽出
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        throw new Error(`Frontmatter not found in ${fileName}`);
      }

      const frontmatterLines = frontmatterMatch[1].split("\n");
      const frontmatter: Frontmatter = {
        title: "",
        date: "",
        draft: false,
      };

      // 簡易的なYAMLパース
      frontmatterLines.forEach((line) => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length > 0) {
          const value = valueParts.join(":").trim();
          const cleanValue = value.replace(/^["']|["']$/g, "");

          if (key.trim() === "title") {
            frontmatter.title = cleanValue;
          } else if (key.trim() === "date") {
            frontmatter.date = cleanValue;
          } else if (key.trim() === "draft") {
            frontmatter.draft = cleanValue === "true";
          }
        }
      });

      // 日付をISO形式に変換
      frontmatter.date = new Date(`${frontmatter.date}+09:00`).toISOString();

      const slug = fileName.replace(EXTENSION.mdx, "");

      return {
        slug,
        frontmatter,
      };
    });

  return posts;
};
