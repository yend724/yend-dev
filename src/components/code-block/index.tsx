import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

type Props = {
  children: string;
  lang: BundledLanguage;
};
export const CodeBlock: React.FC<Props> = async (props) => {
  const code = await codeToHtml(props.children, {
    lang: props.lang,
    theme: "github-dark-default",
  });

  return (
    <div className="relative">
      <span className="absolute top-2 right-2 opacity-80">{props.lang}</span>
      {/*  biome-ignore lint: */}
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};
