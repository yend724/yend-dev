import "@/assets/styles/globals.css";
import FaviconIcon from "@/assets/images/common/favicon.ico";
import { generateSharedMeta } from "@/entities/ogp";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-schema" content="dark" />
        <link rel="icon" href={FaviconIcon.src} sizes="any" />
      </head>
      <body className="bg-gray-1 text-gray-12 font-sans antialiased">
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
