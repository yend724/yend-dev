import type { Book } from "../../api/books";
import type { YearMonth } from "../../types";
import { yearMonthToKey } from "../../types";
import { BookCard } from "../book-card";

type Props = {
  yearMonth: YearMonth;
  books: Book[];
};

export const BooksByMonth: React.FC<Props> = ({ yearMonth, books }) => {
  const yearMonthKey = yearMonthToKey(yearMonth);

  return (
    <section className="grid gap-4">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
        <h2 className="grid" id={yearMonthKey}>
          <span className="text-lg font-bold">{yearMonth.month}月</span>
          <span className="text-sm">{yearMonth.year}年</span>
        </h2>
        <hr className="border-neutral-200/20" />
      </div>
      <div className="relative grid gap-4">
        {books.map((book) => (
          <BookCard key={book.link} book={book} />
        ))}
      </div>
    </section>
  );
};
