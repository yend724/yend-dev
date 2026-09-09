import { AppCard } from "../app-card";
import { LibraryCard } from "../library-card";
import { Section } from "../section";

import { LIBRARIES, PLAYGROUNDS, WEB_APPS } from "@/shared/config/project";

export const Projects = () => {
  return (
    <div className="grid gap-y-8">
      <Section
        icon="🛠️"
        title="ライブラリ"
        items={LIBRARIES}
        renderItems={(item) => (
          <LibraryCard
            key={item.title}
            title={item.title}
            description={item.description}
            npm={item.npm}
            github={item.github}
          />
        )}
      />
      <Section
        icon="💻"
        title="Webアプリ・サイト"
        items={WEB_APPS}
        renderItems={(item) => (
          <AppCard
            key={item.title}
            title={item.title}
            description={item.description}
            app={item.app}
            github={item.github}
            thumbnail={item.thumbnail}
          />
        )}
      />
      <Section
        icon="🎮"
        title="プレイグラウンド"
        items={PLAYGROUNDS}
        renderItems={(item) => (
          <AppCard
            key={item.title}
            title={item.title}
            description={item.description}
            app={item.url}
            github={item.github}
            thumbnail={item.thumbnail}
          />
        )}
      />
    </div>
  );
};
