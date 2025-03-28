import { Card } from "@/shared/ui/card";
import { LinkList } from "../project-link-list";

type LinkItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};
type SectionProps<T> = {
  title: string;
  items: T[];
  getLinks: (item: T) => LinkItem[];
  renderThumbnail?: (item: T) => React.ReactNode;
};

export const Section = <T extends { title: string; description: string }>({
  title,
  items,
  getLinks,
  renderThumbnail,
}: SectionProps<T>) => (
  <div className="grid gap-y-6">
    <h3 className="font-semibold text-lg">{title}</h3>
    <div className="grid gap-y-4">
      {items.map((item) => (
        <Card as="article" key={item.title}>
          <div className="grid gap-2">
            <h4 className="font-semibold text-lg">{item.title}</h4>
            {renderThumbnail?.(item)}
            <p>{item.description}</p>
            <LinkList linkList={getLinks(item)} />
          </div>
        </Card>
      ))}
    </div>
  </div>
);
