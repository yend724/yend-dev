import fs from "node:fs";

export const makeDirRecursive = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const writeFile = (
  path: string,
  data: string | NodeJS.ArrayBufferView
) => {
  fs.writeFileSync(path, data);
};
