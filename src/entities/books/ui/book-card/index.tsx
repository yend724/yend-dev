import type { Book } from "../../api/books";

import { Card } from "@/shared/ui/card";
import { FormattedDate } from "@/shared/ui/date-time";
import { LinkIcon } from "@/shared/ui/icons";
import { Link } from "@/shared/ui/link";

type Props = {
  book: Book;
};

export const BookCard: React.FC<Props> = ({ book }) => {
  return (
    <Card className="grid gap-2">
      <div className="flex items-center gap-x-1 text-sm opacity-80">
        <span>読了日: </span>
        <FormattedDate date={book.completedAt} format="YYYY/MM/DD" />
      </div>
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <div className="flex">
        <Link className="group flex items-center gap-2" href={book.link}>
          <LinkIcon width={18} height={20} />
          <span className="text-sky-400 group-hover:underline">URL</span>
        </Link>
      </div>
    </Card>
  );
};
