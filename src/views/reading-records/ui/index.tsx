import { BookItem } from "./book-Item";

import { type Book } from "@/app/reading-records/page";

type Props = {
  books: Book[];
};
export const ReadingRecords: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid gap-8">
      <h1 className="text-xl font-semibold text-white">読んだ本一覧</h1>
      <ul className="grid gap-6">
        {books.map((book) => (
          <li key={book.isbn13}>
            <BookItem book={book} />
          </li>
        ))}
      </ul>
    </div>
  );
};
