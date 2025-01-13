import { Link } from "@/components/link";

type Props = {
  level: "1" | "2" | "3" | "4" | "5" | "6";
  children: React.ReactNode;
};
export const MarkdownHeading: React.FC<Props> = ({ level, children }) => {
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
