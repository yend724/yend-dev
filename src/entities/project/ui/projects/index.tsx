import { LIBRARIES, WEB_APPS } from '@/shared/config/project';
import { Card } from '@/shared/ui/card';
import { GitHubIcon, LinkIcon, PackageIcon } from '@/shared/ui/icons';
import Image from 'next/image';
import { LinkList } from '../project-link-list';
import { Section } from '../section';

export const Projects = () => {
  return (
    <div className="grid gap-y-8">
      <Section
        title="🧩 ライブラリ"
        items={LIBRARIES}
        renderItems={item => (
          <Card as="article" key={item.title}>
            <div className="grid gap-2">
              <h4 className="font-semibold text-lg">{item.title}</h4>
              <p>{item.description}</p>
              <LinkList
                linkList={[
                  {
                    href: item.npm,
                    icon: <PackageIcon width={20} height={20} />,
                    label: 'npm',
                  },
                  {
                    href: item.github,
                    icon: (
                      <Image
                        src={GitHubIcon}
                        alt="GitHub"
                        width={16}
                        height={16}
                      />
                    ),
                    label: 'GitHub',
                  },
                ]}
              />
            </div>
          </Card>
        )}
      />
      <Section
        title="💻 Webアプリ"
        items={WEB_APPS}
        renderItems={item => (
          <Card as="article" key={item.title}>
            <div className="grid gap-2">
              <h4 className="font-semibold text-lg">{item.title}</h4>
              <div className="relative grid aspect-video place-items-center overflow-hidden rounded-md">
                {item.thumbnail && (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover opacity-85"
                  />
                )}
                {!item.thumbnail && (
                  <p className="italic opacity-85">No Image</p>
                )}
              </div>
              <p>{item.description}</p>
              <LinkList
                linkList={[
                  {
                    href: item.app,
                    icon: <LinkIcon width={18} height={20} />,
                    label: 'URL',
                  },
                  {
                    href: item.github,
                    icon: (
                      <Image
                        src={GitHubIcon}
                        alt="GitHub"
                        width={16}
                        height={16}
                      />
                    ),
                    label: 'GitHub',
                  },
                ]}
              />
            </div>
          </Card>
        )}
      />
    </div>
  );
};
