import * as v from "valibot";

type Component = React.FC;
const componentSchema = v.function();

const frontmatterSchema = v.object({
  title: v.string(),
  date: v.string(),
  draft: v.boolean(),
  tags: v.undefinedable(v.array(v.string()), () => []),
});

export const validateComponent = (post: unknown): Component => {
  const { default: component } = post as {
    default: unknown;
  };
  const validatedComponent = v.parse(componentSchema, component) as Component;
  return validatedComponent;
};

export const validateFrontmatter = (post: unknown) => {
  const { frontmatter } = post as {
    frontmatter: unknown;
  };
  const validatedFrontmatter = v.parse(frontmatterSchema, frontmatter);

  return validatedFrontmatter;
};
