import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SITE_METADATA } from "@/shared/config/site";
import { generateSharedMeta } from "@/shared/lib/generate-meta";

export const metadata: Metadata = {
  ...generateSharedMeta({
    openGraph: {
      type: "website",
    },
  }),
  icons: {
    icon: [{ url: SITE_METADATA.favicon, sizes: "any" }],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
