import { CodeBlock } from "@/shared/ui/code-block";
import { Link } from "@/shared/ui/link";
import { MarkdownHeading } from "@/shared/ui/markdown-heading";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <MarkdownHeading level="1">{children}</MarkdownHeading>
    ),
    h2: ({ children }) => (
      <MarkdownHeading level="2">{children}</MarkdownHeading>
    ),
    h3: ({ children }) => (
      <MarkdownHeading level="3">{children}</MarkdownHeading>
    ),
    h4: ({ children }) => (
      <MarkdownHeading level="4">{children}</MarkdownHeading>
    ),
    h5: ({ children }) => (
      <MarkdownHeading level="5">{children}</MarkdownHeading>
    ),
    h6: ({ children }) => (
      <MarkdownHeading level="6">{children}</MarkdownHeading>
    ),
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
