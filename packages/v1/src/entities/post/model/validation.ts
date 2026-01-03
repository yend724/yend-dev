import * as v from "valibot";

import { componentSchema, frontmatterSchema } from "./schema";

import type { Frontmatter } from "./frontmatter";

type Component = React.FC;

export const validateComponent = (post: unknown): Component => {
  const { default: component } = post as {
    default: unknown;
  };
  const validatedComponent = v.parse(componentSchema, component) as Component;
  return validatedComponent;
};

export const validateFrontmatter = (post: unknown): Frontmatter => {
  const { frontmatter } = post as {
    frontmatter: unknown;
  };
  const validatedFrontmatter = v.parse(frontmatterSchema, frontmatter);

  return validatedFrontmatter;
};
