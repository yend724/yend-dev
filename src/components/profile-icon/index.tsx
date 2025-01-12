import ProfileIconImage from "@/assets/images/profile-icon.png";
import Image from "next/image";

export const ProfileIcon = () => {
  return (
    <div className="aspect-square size-full overflow-hidden rounded-full">
      <Image
        src={ProfileIconImage}
        width={512}
        height={512}
        alt="YENDのプロフィールアイコン。スナメリのイラスト。"
        loading="eager"
        className="size-full"
      />
    </div>
  );
};
