import "@/assets/styles/markdown.css";

import { Footer } from "@/shared/ui/footer";
import { Header } from "@/shared/ui/header";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr] gap-8">
      <Header renderTitle={(title) => <h1>{title}</h1>} />
      <main className="mx-auto w-full max-w-5xl overflow-hidden px-4 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
