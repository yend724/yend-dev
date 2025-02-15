import fs from "node:fs";
import ProfileIconImage from "@/assets/images/profile-icon.png";
import { Articles } from "@/features/articles/components";
import { Books } from "@/features/books/ui";
import { MyWorks } from "@/features/my-works/components";
import { SITE_METADATA } from "@/shared/config/site";
import { SOCIALS } from "@/shared/config/social";
import { LinkTag } from "@/shared/ui/link-tag";
import { getPosts } from "@/utils/posts";
import Image from "next/image";
import { generateRSS } from "../../lib/rss";
import { Section } from "../section";

const posts = await getPosts();
const filteredPosts = posts
  .filter((post) => !post.frontmatter.draft)
  .map((post) => ({
    title: post.frontmatter.title,
    slug: post.slug,
    date: post.frontmatter.date,
  }));
const { rss } = generateRSS(filteredPosts);
fs.writeFileSync("public/rss.xml", rss);

export const Main: React.FC = async () => {
  return (
    <div className="grid gap-16">
      <div className="grid gap-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12">
              <div className="aspect-square size-full overflow-hidden rounded-full">
                <Image
                  src={ProfileIconImage}
                  width={512}
                  height={512}
                  alt="YENDのプロフィールアイコン。スナメリのイラスト。"
                  loading="eager"
                  className="size-full"
                />
              </div>
            </div>
            <h1 className="text-wrap text-left font-semibold text-3xl text-white">
              {SITE_METADATA.creator}
            </h1>
          </div>
          <p className="text-base">プログラムを書く砂滑</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {SOCIALS.map((link) => (
            <LinkTag key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
      </div>
      <Section title="書いたやつ">
        <Articles />
      </Section>
      <Section title="作ったもの">
        <MyWorks />
      </Section>
      <Section title="読んだ書籍">
        <Books />
      </Section>
    </div>
  );
};
