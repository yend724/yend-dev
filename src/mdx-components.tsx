import { CodeBlock } from "@/components/code-block";
import { Link } from "@/components/link";
import type { MDXComponents } from "mdx/types";

type HeadingProps = {
  level: "1" | "2" | "3" | "4" | "5" | "6";
  children: React.ReactNode;
};
const Heading: React.FC<HeadingProps> = ({ level, children }) => {
  const HeadingTag = `h${level}` as React.ElementType;

  const childrenString = `${children}`;
  const encodedChildrenString = encodeURI(childrenString);

  const sharp = Array.from({ length: Number(level) }, () => "#").join("");

  return (
    <HeadingTag id={childrenString}>
      <Link className="flex gap-x-2" href={`#${encodedChildrenString}`}>
        <span className="opacity-80">{sharp}</span>
        <span>{children}</span>
      </Link>
    </HeadingTag>
  );
};
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => <Heading level="1">{children}</Heading>,
    h2: ({ children }) => <Heading level="2">{children}</Heading>,
    h3: ({ children }) => <Heading level="3">{children}</Heading>,
    h4: ({ children }) => <Heading level="4">{children}</Heading>,
    h5: ({ children }) => <Heading level="5">{children}</Heading>,
    h6: ({ children }) => <Heading level="6">{children}</Heading>,
    pre: ({ children }) => {
      const [language] = children.props.className?.split(":") ?? [""];
      const formattedLanguage = language.replace("language-", "");
      return (
        <CodeBlock lang={formattedLanguage}>
          {children.props.children}
        </CodeBlock>
      );
    },
    code: (props) => <code {...props} />,
    a: (props) => <Link {...props} />,
  };
}
