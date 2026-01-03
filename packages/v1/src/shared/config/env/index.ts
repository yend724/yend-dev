const isProd = () => process.env.NODE_ENV === "production";
const isDev = () => process.env.NODE_ENV === "development";

export const env = () => {
  return {
    isProd: isProd(),
    isDev: isDev(),
  };
};
