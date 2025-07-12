import type { MDXComponents } from "mdx/types";
import { twMerge } from "tailwind-merge";

import { CodeBlock } from "@/shared/ui/code-block";
import { EmbedTweet } from "@/shared/ui/embed-tweet";
import { Image } from "@/shared/ui/image";
import { LinkText } from "@/shared/ui/link-text";
import { MarkdownHeading } from "@/shared/ui/markdown-heading";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  // ヘッディングコンポーネントの生成を効率化
  const headingComponents: MDXComponents = {};
  for (let i = 1; i <= 6; i++) {
    headingComponents[`h${i}`] = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <MarkdownHeading level={i}>{children}</MarkdownHeading>;
  }

  return {
    ...components,
    ...headingComponents,
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
    a: (props) => <LinkText {...props} />,
    // Tweetコンポーネントを登録
    EmbedTweet,
    Image: ({ className, ...props }) => (
      <Image {...props} className={twMerge(className, "mx-auto")} />
    ),
  };
}
