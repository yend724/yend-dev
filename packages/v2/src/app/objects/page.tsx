import type { Metadata } from "next";

import { ObjectCatalogPage } from "@/features/ocean-demo/components/object-catalog";

export const metadata: Metadata = {
  title: "オブジェクト一覧",
  robots: { index: false, follow: false },
};

const Page = () => <ObjectCatalogPage />;
export default Page;
