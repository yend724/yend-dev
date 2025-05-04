import type { BundledLanguage } from 'shiki';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

type Props = {
  children: string;
  lang: BundledLanguage;
};
export const CodeBlock: React.FC<Props> = async props => {
  const code = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'github-dark-default',
  });

  return (
    <div className="relative">
      <div className="absolute top-1 right-1 flex items-center justify-center gap-2 text-sm opacity-70">
        {props.lang && <span className="text-center">{props.lang}</span>}
        <div className="text-end">
          <CopyButton text={props.children.toString()} />
        </div>
      </div>
      {/*  biome-ignore lint: */}
      <div dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
};
