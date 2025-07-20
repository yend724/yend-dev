import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  more?: React.ReactNode;
};
export const Section: React.FC<Props> = ({ title, children, more }) => {
  return (
    <section className="grid gap-8">
      <h2 id={title} className="text-xl font-semibold text-white">
        {title}
      </h2>
      {children}
      {more ? <div>{more}</div> : null}
    </section>
  );
};
