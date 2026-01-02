import type { Url } from "next/dist/shared/lib/router/router";

// AbsolutePath型を定義
type AbsolutePath = Url & {
  _brand: "absolutePath";
};

// パスが絶対パスかどうかを判定する関数
export const isAbsolutePath = (path: Url): path is AbsolutePath => {
  const isStringPath = typeof path === "string";
  if (isStringPath) {
    return path.startsWith("http");
  }
  return path.href?.startsWith("http") ?? false;
};
