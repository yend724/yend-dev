import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
};

export const Card = forwardRef<HTMLElement, Props>(
  ({ children, as: Component = "div", className = "" }, ref) => {
    return (
      <Component
        ref={ref}
        className={twMerge(
          "bg-gray-3 border-gray-6 grid gap-4 rounded-lg border p-4",
          className
        )}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
