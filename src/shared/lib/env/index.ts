import { env } from "@/shared/config/env";

export const runInProduction = <T>(fn: () => T) => {
  if (env().isProd) {
    fn();
  }
};
