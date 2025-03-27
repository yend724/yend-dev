import Image from "next/image";
import { WorkLink } from "../work-link";

export type LinkItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export type WorkSectionProps<T> = {
  title: string;
  items: T[];
  getLinks: (item: T) => LinkItem[];
  renderThumbnail?: (item: T) => React.ReactNode;
};

export const WorkSection = <T extends { title: string; description: string }>({
  title,
  items,
  getLinks,
  renderThumbnail,
}: WorkSectionProps<T>) => (
  <div className="grid gap-y-6">
    <h3 className="font-semibold text-lg">{title}</h3>
    {items.map((item, index) => (
      <article
        key={index}
        className="grid gap-4 rounded-lg border border-neutral-200/20 bg-neutral-900 p-4"
      >
        <div className="grid gap-2">
          <h4 className="font-semibold text-lg">{item.title}</h4>
          {renderThumbnail?.(item)}
          <p>{item.description}</p>
          <ul className="flex items-center gap-4">
            {getLinks(item).map((link, i) => (
              <li key={i}>
                <WorkLink
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                />
              </li>
            ))}
          </ul>
        </div>
      </article>
    ))}
  </div>
);
