import ProfileIconImage from "@/assets/images/common/profile-icon.png";
import { Books } from "@/entities/books";
import { Works } from "@/entities/works";
import { SITE_METADATA } from "@/shared/config/site";
import { SOCIALS } from "@/shared/config/social";
import { LinkTag } from "@/shared/ui/link-tag";
import Image from "next/image";
import { Articles } from "../articles";
import { Section } from "../section";

export const Main: React.FC = async () => {
  return (
    <div className="grid gap-16">
      <div className="grid gap-8">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <div className="aspect-square size-16 overflow-hidden rounded-full">
              <Image
                src={ProfileIconImage}
                width={512}
                height={512}
                alt="YENDのプロフィールアイコン。スナメリのイラスト。"
                loading="eager"
                className="size-full"
              />
            </div>
            <hgroup>
              <h1 className="text-wrap text-left font-semibold text-2xl text-white">
                {SITE_METADATA.creator}
              </h1>
              <p className="text-base">プログラムを書く砂滑</p>
            </hgroup>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {SOCIALS.map((link) => (
            <LinkTag key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
      </div>
      <Section title="書いたやつ">
        <Articles />
      </Section>
      <Section title="作ったもの">
        <Works />
      </Section>
      <Section title="読んだ書籍">
        <Books />
      </Section>
    </div>
  );
};
