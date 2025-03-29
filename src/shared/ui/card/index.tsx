import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
};
export const Card: React.FC<Props> = ({
  children,
  as: Component = "div",
  className = "",
}) => {
  return (
    <Component
      className={twMerge(
        "grid gap-4 rounded-lg border border-neutral-200/20 bg-neutral-900 p-4",
        className,
      )}
    >
      {children}
    </Component>
  );
};
