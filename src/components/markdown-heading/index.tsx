import { Link } from "@/components/link";

type Props = {
  level: "1" | "2" | "3" | "4" | "5" | "6";
  children: React.ReactNode;
};
export const MarkdownHeading: React.FC<Props> = ({ level, children }) => {
  const HeadingTag = `h${level}` as React.ElementType;

  const childrenString = `${children}`;

  return (
    <HeadingTag id={childrenString}>
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
