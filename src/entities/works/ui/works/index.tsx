import { LIBRARIES, WEB_APPS } from "@/shared/config/works";
import { GitHubIcon, LinkIcon, PackageIcon } from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";
import Image from "next/image";

export const Works = () => {
  return (
    <div className="grid gap-y-8">
      <div className="grid gap-y-6">
        <h3 className="font-semibold text-lg">🧩 ライブラリ</h3>
        {LIBRARIES.map((work, index) => (
          <article key={index} className="grid gap-2">
            <h4 className="font-semibold text-lg">{work.title}</h4>
            <p>{work.description}</p>
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  href={work.npm}
                  className="flex items-center gap-2 hover:underline"
                >
                  <PackageIcon width={20} height={20} /> npm
                </Link>
              </li>
              <li>
                <Link
                  href={work.github}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Image src={GitHubIcon} alt="GitHub" width={16} height={16} />{" "}
                  GitHub
                </Link>
              </li>
            </ul>
          </article>
        ))}
      </div>
      <div className="grid gap-y-6">
        <h3 className="font-semibold text-lg">💻 Webアプリ</h3>
        {WEB_APPS.map((work, index) => (
          <article key={index} className="grid gap-2">
            <h4 className="font-semibold text-lg">{work.title}</h4>
            <p>{work.description}</p>
            <ul className="flex items-center gap-4">
              <li>
                <Link
                  href={work.app}
                  className="flex items-center gap-2 hover:underline"
                >
                  <LinkIcon width={18} height={18} /> URL
                </Link>
              </li>
              <li>
                <Link
                  href={work.github}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Image src={GitHubIcon} alt="GitHub" width={16} height={16} />{" "}
                  GitHub
                </Link>
              </li>
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
};
