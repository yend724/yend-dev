"use client";
import { type Book } from "@/app/reading-records/page";
import { FormattedDate } from "@/shared/ui/date-time";
import { LinkText } from "@/shared/ui/link-text";

const convertIsbn13ToIsbn10 = (isbn13: string): string => {
  const isbn9 = isbn13.slice(3, 12);
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn9[i]) * (10 - i);
  }

  const remainder = sum % 11;
  const checkDigit =
    remainder === 0 ? "0" : remainder === 1 ? "X" : String(11 - remainder);

  return isbn9 + checkDigit;
};

type Props = {
  book: Book;
};
export const BookItem: React.FC<Props> = ({ book }) => {
  const href = `https://www.amazon.co.jp/exec/obidos/ASIN/${convertIsbn13ToIsbn10(book.isbn13)}`;

  return (
    <div
      key={book.isbn13}
      className="grid gap-2 transition-all hover:border-sky-500"
    >
      <LinkText className="text-lg font-semibold" href={href}>
        {book.title}
      </LinkText>
      <span className="text-sm">
        読了日: <FormattedDate date={book.completedAt}></FormattedDate>
      </span>
    </div>
  );
};
