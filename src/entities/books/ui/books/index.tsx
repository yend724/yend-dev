import type { Book } from "../../api/books";

import { FormattedDate } from "@/shared/ui/date-time";
import { LinkText } from "@/shared/ui/link-text";

export const Books: React.FC<{ books: Book[] }> = ({ books }) => {
  return (
    <ul className="grid gap-6">
      {books.map((book) => (
        <li
          key={book.link}
          className="grid gap-2 transition-all hover:border-sky-500"
        >
          <LinkText className="text-lg font-semibold" href={book.link}>
            {book.title}
          </LinkText>
          <span className="flex flex-wrap gap-x-1 text-sm">
            <span>読了日:</span>
            <FormattedDate date={book.completedAt} format="YYYY/MM" />
          </span>
        </li>
      ))}
    </ul>
  );
};
