import { Person } from "../person";
import { Section } from "../section";
import { SocialLinks } from "../social-links";

import { Certifications } from "@/entities/certification";
import { Projects } from "@/entities/project";

export const Home: React.FC = () => {
  return (
    <div className="grid gap-16">
      <div className="grid gap-8">
        <Person />
        <SocialLinks />
      </div>
      <Section title="作ったもの">
        <Projects />
      </Section>
      <Section title="取得した資格">
        <Certifications />
      </Section>
    </div>
  );
};
