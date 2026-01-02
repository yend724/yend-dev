import { Articles } from "../articles";
import { Person } from "../person";
import { Section } from "../section";
import { SocialLinks } from "../social-links";

import { Books } from "../../../../entities/books";
import { getBooks } from "../../../../entities/books/api/books";
import { Certifications } from "../../../../entities/certification";
import { Projects } from "../../../../entities/project";
import { LinkText } from "../../../../shared/ui/link-text";

const { default: books } = await getBooks();

export const Home: React.FC = async () => {
  return (
    <div className="grid gap-16">
      <div className="grid gap-8">
        <Person />
        <SocialLinks />
      </div>
      <Section
        title="書いたやつ"
        more={<LinkText href="/posts/">→ すべての記事はこちら</LinkText>}
      >
        <Articles />
      </Section>
      <Section title="作ったもの">
        <Projects />
      </Section>
      <Section title="取得した資格">
        <Certifications />
      </Section>
      <Section
        title="読んだ書籍"
        more={
          <LinkText href="/reading-records/">
            → すべての読んだ書籍はこちら
          </LinkText>
        }
      >
        <Books books={books.slice(0, 6)} />
      </Section>
    </div>
  );
};
