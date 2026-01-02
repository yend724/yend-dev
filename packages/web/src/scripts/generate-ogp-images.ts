import { getPostsData } from "./utils/get-posts-data";

import { generateOgpImage } from "../entities/ogp";
import { env } from "../shared/config/env";
import { OGP_DIR } from "../shared/config/site";
import { makeDirRecursive, writeFile } from "../shared/lib/file-system";

const generateOgpImages = async () => {
  const isFiltering = env().isProd;
  const posts = getPostsData();
  const targetPosts = posts.filter((post) =>
    isFiltering ? !post.frontmatter.draft : true
  );

  makeDirRecursive(OGP_DIR);

  for (const post of targetPosts) {
    try {
      const image = await generateOgpImage(post.frontmatter.title);
      writeFile(`${OGP_DIR}/${post.slug}.png`, image);
    } catch (error) {
      console.error(`❌ ${post.slug} の画像生成に失敗しました:`, error);
    }
  }
};

generateOgpImages().catch((error) => {
  console.error("OGP画像の生成中にエラーが発生しました:", error);
  process.exit(1);
});
