import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit plain static files to `out/` on `next build`.
  output: "export",
  // Write `out/<route>/index.html` instead of `out/<route>.html` so any static server serves `/<route>/`.
  trailingSlash: true,
  // Static export has no image optimizer; next/image renders the source URL as-is.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.glsl": {
        loaders: ["./loaders/glsl-loader.cjs"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
