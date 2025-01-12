import fs from "node:fs";
import { LinkTag } from "@/components/link-tag";
import { PageTitle } from "@/components/page-title";
import { SITE_META, SOCIAL_LINKS } from "@/constants";
import { Articles } from "@/features/articles/components";
import { MyWorks } from "@/features/my-works/components";
import { ReadingLog } from "@/features/readding-log/components";
import { isProd } from "@/utils/env";
import { getPosts } from "@/utils/posts";
import { generateRSS } from "./_utils/rss";

const Home: React.FC = async () => {
  if (isProd()) {
    const posts = await getPosts();
    const filteredPosts = posts
      .filter((post) => !post.meta.draft)
      .map((post) => ({
        title: post.meta.title,
        slug: post.slug,
        date: post.meta.date,
      }));
    const { rss } = generateRSS(filteredPosts);
    fs.writeFileSync("public/rss.xml", rss);
  }

  return (
    <div className="grid gap-16">
      <div className="grid gap-4">
        <PageTitle
          title={SITE_META.creator}
          description="プログラムを書く砂滑"
        />
        <div className="flex flex-wrap gap-4">
          {SOCIAL_LINKS.map((link) => (
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
        <ReadingLog />
      </Section>
    </div>
  );
};

export default Home;

type SectionProps = {
  title: string;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="grid gap-8">
      <h2 id={title} className="font-semibold text-white text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
};
