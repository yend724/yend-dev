import type { WebSite, WithContext } from "schema-dts";
import OceanExperience from "@/features/ocean/components/ocean-experience";
import { JsonLdScript } from "@/shared/components/json-ld-script";
import { SITE_METADATA } from "@/shared/config/site";

const webSiteJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_METADATA.title,
  description: SITE_METADATA.description,
  url: SITE_METADATA.url,
};

const Page = () => {
  return (
    <>
      <JsonLdScript data={webSiteJsonLd} />
      <OceanExperience />
    </>
  );
};

export default Page;
