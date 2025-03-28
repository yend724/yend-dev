type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
};
export const Card: React.FC<Props> = ({ children, as: Component = "div" }) => {
  return (
    <Component className="grid gap-4 rounded-lg border border-neutral-200/20 bg-neutral-900 p-4">
      {children}
    </Component>
  );
};
