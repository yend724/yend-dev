import { JsonLdScript } from "../../entities/json-ld";
import { SITE_METADATA } from "../../shared/config/site";
import { Home } from "../../views/home";

import type { WebSite, WithContext } from "schema-dts";

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
      <Home />
    </>
  );
};

export default Page;
