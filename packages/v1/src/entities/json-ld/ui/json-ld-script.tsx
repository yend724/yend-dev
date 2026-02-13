import type { WithContext, Thing } from "schema-dts";

export const JsonLdScript = <T extends Thing>({
  data,
}: {
  data: WithContext<T>;
}) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
};
