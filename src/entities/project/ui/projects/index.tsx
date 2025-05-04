import { LIBRARIES, WEB_APPS } from "@/shared/config/project";
import { AppCard } from "../app-card";
import { LibraryCard } from "../library-card";
import { Section } from "../section";

export const Projects = () => {
  return (
    <div className="grid gap-y-8">
      <Section
        title="🧩 ライブラリ"
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
        title="💻 Webアプリ"
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
    </div>
  );
};
