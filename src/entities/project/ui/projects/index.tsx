import { LIBRARIES, WEB_APPS } from "@/shared/config/project";
import { GitHubIcon, LinkIcon, PackageIcon } from "@/shared/ui/icons";
import Image from "next/image";
import { Section } from "../section";

export const Projects = () => {
  const githubIcon = (
    <Image src={GitHubIcon} alt="GitHub" width={16} height={16} />
  );

  return (
    <div className="grid gap-y-8">
      <Section
        title="🧩 ライブラリ"
        items={LIBRARIES}
        getLinks={({ npm, github }) => [
          {
            href: npm,
            icon: <PackageIcon width={20} height={20} />,
            label: "npm",
          },
          {
            href: github,
            icon: githubIcon,
            label: "GitHub",
          },
        ]}
      />
      <Section
        title="💻 Webアプリ"
        items={WEB_APPS}
        getLinks={({ app, github }) => [
          {
            href: app,
            icon: <LinkIcon width={18} height={18} />,
            label: "URL",
          },
          {
            href: github,
            icon: githubIcon,
            label: "GitHub",
          },
        ]}
        renderThumbnail={({ thumbnail, title }) =>
          thumbnail && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={thumbnail}
                alt={`${title}のサムネイル`}
                fill
                className="object-cover opacity-85"
              />
            </div>
          )
        }
      />
    </div>
  );
};
