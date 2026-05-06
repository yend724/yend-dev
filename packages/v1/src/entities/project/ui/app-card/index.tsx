import Image from "next/image";

import { LinkList } from "../project-link-list";

import type { WebApp } from "@/shared/config/project";

import { Card } from "@/shared/ui/card";
import { GitHubIcon, LinkIcon } from "@/shared/ui/icons";

type Props = WebApp;
export const AppCard: React.FC<Props> = ({
  title,
  description,
  app,
  github,
  thumbnail,
}) => {
  return (
    <Card as="article" key={title}>
      <div className="grid gap-2">
        <h4 className="text-lg font-semibold">{title}</h4>
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-sm">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover opacity-85"
            />
          )}
          {!thumbnail && <p className="italic opacity-85">No Image</p>}
        </div>
        <p>{description}</p>
        <LinkList
          linkList={[
            {
              href: app,
              icon: <LinkIcon width={18} height={20} />,
              label: "URL",
            },
            {
              href: github,
              icon: (
                <Image src={GitHubIcon} alt="GitHub" width={16} height={16} />
              ),
              label: "GitHub",
            },
          ]}
        />
      </div>
    </Card>
  );
};
