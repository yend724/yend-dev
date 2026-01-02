import fs from "node:fs";

import React from "react";
import satori from "satori";
import sharp from "sharp";

import { OgpImage } from "../ui";

import { getProjectRoot } from "../../../shared/lib/endpoint";

const fontRegular = fs.readFileSync(
  `${getProjectRoot()}/src/assets/fonts/NotoSansJP-Regular.ttf`
);
const fontSemibold = fs.readFileSync(
  `${getProjectRoot()}/src/assets/fonts/NotoSansJP-SemiBold.ttf`
);

export const generateOgpImage = async (title: string): Promise<Buffer> => {
  const svg = await satori(<OgpImage title={title} />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Noto Sans JP",
        data: fontSemibold,
        style: "normal",
        weight: 600,
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
};
