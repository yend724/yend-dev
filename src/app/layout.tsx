import "@/assets/styles/globals.css";
import FaviconIcon from "@/assets/images/favicon.ico";
import { generateSharedMeta } from "@/entities/ogp";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-schema" content="dark" />
        <link rel="icon" href={FaviconIcon.src} sizes="any" />
      </head>
      <body className="bg-neutral-800 font-sans text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata = generateSharedMeta({
  openGraph: {
    type: "website",
  },
});
