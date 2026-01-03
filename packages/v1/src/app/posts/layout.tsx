import { Footer } from "../../shared/ui/footer";
import { Header } from "../../shared/ui/header";
import "katex/dist/katex.min.css";
import "@/assets/styles/markdown.css";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr_auto] gap-8">
      <Header />
      <main className="mx-auto w-full max-w-5xl overflow-hidden px-4 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
