import * as v from "valibot";

export const componentSchema = v.function();

export const frontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  draft: v.boolean(),
  tags: v.undefinedable(v.array(v.string()), () => []),
});
