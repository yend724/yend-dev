import { createHeadingComponentsByLevel } from "./utils";

import { Link } from "../link";

type Props = {
  level: number;
  children: React.ReactNode;
};
export const MarkdownHeading: React.FC<Props> = ({ level, children }) => {
  const { tag: HeadingTag, props } = createHeadingComponentsByLevel({ level });
  const childrenString = `${children}`;

  return (
    <HeadingTag id={childrenString} {...props}>
      <Link
        className="flex gap-x-2"
        href={`#${childrenString}`}
        data-heading-level={level}
      >
        <span>{children}</span>
      </Link>
    </HeadingTag>
  );
};
