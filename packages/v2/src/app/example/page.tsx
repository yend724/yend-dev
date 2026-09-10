import type { Metadata } from "next";
import OceanExperience from "@/features/ocean/components/ocean-experience";

export const metadata: Metadata = {
  title: "Example | YEND.DEV",
  robots: { index: false, follow: false },
};

const Page: React.FC = () => <OceanExperience />;
export default Page;
