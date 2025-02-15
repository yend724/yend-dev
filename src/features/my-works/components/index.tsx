import { Link } from "@/shared/ui/link";
import { MY_WORKS } from "../constants";

export const MyWorks = () => {
  return (
    <div className="grid gap-y-8">
      {MY_WORKS.map((work, index) => (
        <article key={index}>
          <Link href={work.url} className="group grid w-fit gap-2">
            <h3 className="font-semibold text-lg group-hover:underline">
              {work.title}
            </h3>
            <p>{work.description}</p>
          </Link>
        </article>
      ))}
    </div>
  );
};
