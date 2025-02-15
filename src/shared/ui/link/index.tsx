import { isAbsolutePath } from "@/shared/lib/path";
import NextLink from "next/link";

type NextLinkProps = Parameters<typeof NextLink>;
type Props = NextLinkProps[0] & { children: React.ReactNode };
export const Link: React.FC<Props> = (props) => {
  const isAbsolute = isAbsolutePath(props.href);
  return (
    <NextLink
      target={isAbsolute ? "_blank" : undefined}
      rel={isAbsolute ? "noopener noreferrer" : undefined}
      {...props}
    />
  );
};
