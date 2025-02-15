import ProfileIconImage from "@/assets/images/profile-icon.png";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
};
export const PageTitle: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <div className="size-12">
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
        </div>
        <h1 className="text-wrap text-left font-semibold text-3xl text-white">
          {title}
        </h1>
      </div>
      <p className="text-base">{description}</p>
    </div>
  );
};
