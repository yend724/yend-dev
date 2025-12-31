import NextLink from "next/link";
import { twMerge } from "tailwind-merge";

import { isAbsolutePath } from "@/shared/lib/path";

type NextLinkProps = Parameters<typeof NextLink>;
type Props = NextLinkProps[0] & { children: React.ReactNode };
export const LinkText: React.FC<Props> = ({ className, ...props }) => {
  const isAbsolute = isAbsolutePath(props.href);
  return (
    <NextLink
      target={isAbsolute ? "_blank" : undefined}
      rel={isAbsolute ? "noopener noreferrer" : undefined}
      className={twMerge("text-sky-11 underline hover:no-underline", className)}
      {...props}
    />
  );
};
