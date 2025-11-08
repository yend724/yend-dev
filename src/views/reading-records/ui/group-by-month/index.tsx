import { convertGroupBooksByMonth } from "./utils";

import { type Book } from "@/entities/books/api/books";

type Props = {
  books: Book[];
  renderGroupBooksByMonth: (books: Book[]) => React.ReactNode;
};
export const GroupByMonth: React.FC<Props> = ({
  books,
  renderGroupBooksByMonth,
}) => {
  const groupedBooks = convertGroupBooksByMonth(books);
  return (
    <div className="grid gap-8">
      {groupedBooks.map((group) => {
        return (
          <div key={`${group.year}-${group.month}`} className="grid gap-4">
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <h2 className="grid">
                <span className="text-lg font-bold">{group.month}月</span>
                <span className="text-sm">{group.year}年</span>
              </h2>
              <hr className="border-neutral-200/20"></hr>
            </div>
            {renderGroupBooksByMonth(group.books)}
          </div>
        );
      })}
    </div>
  );
};
