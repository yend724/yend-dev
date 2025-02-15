type Props = {
  title: string;
  children: React.ReactNode;
};
export const Section: React.FC<Props> = ({ title, children }) => {
  return (
    <section className="grid gap-8">
      <h2 id={title} className="font-semibold text-white text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
};
