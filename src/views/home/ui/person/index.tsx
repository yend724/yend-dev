import Image from "next/image";

import ProfileIconImage from "@/assets/images/common/profile-icon.png";
import { SITE_METADATA } from "@/shared/config/site";

export const Person: React.FC = () => {
  return (
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
        <h1 className="text-left text-2xl leading-none font-semibold text-wrap">
          {SITE_METADATA.creator}
        </h1>
        <p className="text-gray-11 text-base">{SITE_METADATA.mentionId}</p>
      </hgroup>
    </div>
  );
};
