import type { Url } from "next/dist/shared/lib/router/router";

type AbsolutePath = Url & {
  _brand: "absolutePath";
};

export const isAbsolutePath = (path: Url): path is AbsolutePath => {
  if (typeof path === "string") {
    return path.startsWith("http");
  }
  return path.href?.startsWith("http") ?? false;
};
