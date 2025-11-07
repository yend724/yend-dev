import { yearMonthToKey } from "../../types";
import { groupBooksByMonth, sortBooksByYearMonthDescending } from "../../utils";
import { BooksByMonth } from "../books-by-month";

import type { Book } from "../../api/books";

type Props = {
  books: Book[];
};

export const Books: React.FC<Props> = ({ books }) => {
  const bookGroups = groupBooksByMonth(books);
  const sortedBookGroups = sortBooksByYearMonthDescending(bookGroups);

  return (
    <div className="grid gap-8">
      {sortedBookGroups.map((group) => (
        <BooksByMonth
          key={yearMonthToKey(group.yearMonth)}
          yearMonth={group.yearMonth}
          books={group.books}
        />
      ))}
    </div>
  );
};
