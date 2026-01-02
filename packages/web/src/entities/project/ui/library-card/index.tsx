import Image from "next/image";

import { Card } from "../../../../shared/ui/card";
import { GitHubIcon, PackageIcon } from "../../../../shared/ui/icons";
import { LinkList } from "../project-link-list";

import type { Library } from "../../../../shared/config/project";

type Props = Library;
export const LibraryCard: React.FC<Props> = ({
  title,
  description,
  npm,
  github,
}) => {
  return (
    <Card as="article" key={title}>
      <div className="grid gap-2">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p>{description}</p>
        <LinkList
          linkList={[
            {
              href: npm,
              icon: <PackageIcon width={20} height={20} />,
              label: "npm",
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
