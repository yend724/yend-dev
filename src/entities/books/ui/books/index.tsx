import type { Book } from "../../api/books";

import { Card } from "@/shared/ui/card";
import { FormattedDate } from "@/shared/ui/date-time";
import { LinkIcon } from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";

type Props = {
  books: Book[];
};
export const Books: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <Card key={book.link} className="grid gap-2">
          <div className="flex items-center gap-x-1 text-sm opacity-80">
            <span>読了日:</span>
            <FormattedDate date={book.completedAt} format="YYYY/MM" />
          </div>
          <p className="text-lg font-semibold">{book.title}</p>
          <div className="flex">
            <Link className="group flex items-center gap-2" href={book.link}>
              <LinkIcon width={18} height={20} />
              <span className="text-sky-400 group-hover:underline">URL</span>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
