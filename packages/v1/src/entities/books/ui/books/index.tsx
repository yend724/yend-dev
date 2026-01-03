import { BookCard } from "../book-card";

import type { Book } from "../../api/books";

type Props = {
  books: Book[];
};

export const Books: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid gap-4">
      {books.map((book) => (
        <BookCard key={book.link} book={book} />
      ))}
    </div>
  );
};
