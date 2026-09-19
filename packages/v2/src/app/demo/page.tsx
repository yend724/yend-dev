import type { Metadata } from "next";

import OceanExperience from "@/features/ocean-demo/components/ocean-experience";
import "@/shared/assets/css/demo.css";

export const metadata: Metadata = {
  title: "DEMO",
  robots: { index: false, follow: false },
};

const Page: React.FC = () => {
  return <OceanExperience />;
};

export default Page;
