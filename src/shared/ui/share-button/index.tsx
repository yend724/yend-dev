"use client";
import { Share2 } from "lucide-react";

import { share } from "./utils";

type Props = {
  shareData: {
    title: string;
    url: string;
  };
};
export const ShareButton: React.FC<Props> = ({ shareData }) => {
  return (
    <button
      type="button"
      className="rounded-full p-2 hover:bg-neutral-700"
      onClick={() => {
        share(shareData.title, shareData.url);
      }}
    >
      <Share2 size={16} aria-label="共有する" />
    </button>
  );
};
