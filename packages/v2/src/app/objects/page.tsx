import type { Metadata } from "next";

import { ObjectCatalogPage } from "@/features/ocean/components/object-catalog";

export const metadata: Metadata = {
  title: "オブジェクト一覧 | YEND.DEV",
  robots: { index: false, follow: false },
};

const Page = () => <ObjectCatalogPage />;
export default Page;
