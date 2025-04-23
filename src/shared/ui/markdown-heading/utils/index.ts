import { integer, minValue, number, pipe, safeParse } from "valibot";

export const nonNegativeIntegerSchema = pipe(number(), integer(), minValue(0));
export const createHeadingComponentsByLevel = (params: { level: number }) => {
  const parsed = safeParse(nonNegativeIntegerSchema, params.level);

  if (!parsed.success) {
    throw new Error("Invalid level");
  }

  if (parsed.output > 6) {
    return {
      tag: "div" as React.ElementType,
      props: {
        "aria-level": parsed.output,
      },
    };
  }

  return {
    tag: `h${parsed.output}` as React.ElementType,
    props: {},
  };
};
