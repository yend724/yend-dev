import { Link } from "@/shared/ui/link";

import type { Heading } from "@/entities/post";

type Props = {
  headings: Heading[];
};
export const TableOfContents: React.FC<Props> = ({ headings }) => {
  if (headings.length === 0) return null;

  return (
    <details className="bg-gray-3 cursor-pointer rounded-sm">
      <summary className="p-3 font-semibold">目次</summary>
      <div className="px-3 pt-1 pb-2">
        <nav>
          <ol className="[counter-reset:count]">
            {headings.map((heading) => (
              <li key={heading.id} className="[counter-increment:count_1]">
                <Link
                  href={`#${heading.id}`}
                  className="relative flex w-full items-start gap-x-1 rounded-sm px-4 py-1 before:content-[counter(count)_'.'] hover:after:absolute hover:after:top-1/2 hover:after:left-0 hover:after:-translate-y-1/2 hover:after:font-mono hover:after:font-semibold hover:after:content-['▶︎']"
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </details>
  );
};
