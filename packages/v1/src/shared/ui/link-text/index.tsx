import { twMerge } from "tailwind-merge";

import { Link } from "../link";

type Props = Parameters<typeof Link>[0];
export const LinkText: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Link
      className={twMerge("text-sky-11 underline hover:no-underline", className)}
      {...props}
    />
  );
};
