import * as v from "valibot";

export const componentSchema = v.function();

export const frontmatterSchema = v.object({
  title: v.string(),
  date: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)),
  draft: v.boolean(),
  tags: v.undefinedable(v.array(v.string()), () => []),
});
