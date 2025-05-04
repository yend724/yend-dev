type Props<T> = {
  title: string;
  items: T[];
  renderItems: (item: T) => React.ReactNode;
};
export const Section = <T extends { title: string; description: string }>({
  title,
  items,
  renderItems,
}: Props<T>) => (
  <div className="grid gap-y-6">
    <h3 className="font-semibold text-lg">{title}</h3>
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => renderItems(item))}
    </div>
  </div>
);
