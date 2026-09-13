import type { Metadata } from "next";

import OceanExperience from "@/features/ocean/components/ocean-experience";
import "@/shared/assets/css/example.css";

export const metadata: Metadata = {
  title: "Example | YEND.DEV",
  robots: { index: false, follow: false },
};

const Page: React.FC = () => {
  return <OceanExperience />;
};

export default Page;
