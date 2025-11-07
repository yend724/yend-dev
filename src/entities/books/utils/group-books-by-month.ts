import type { Book } from "../api/books";
import type { YearMonth } from "../types";
import { yearMonthToKey } from "../types";

type BooksByYearMonth = {
  yearMonth: YearMonth;
  books: Book[];
};

export const groupBooksByMonth = (books: Book[]): BooksByYearMonth[] => {
  const grouped = books.reduce<Record<string, { yearMonth: YearMonth; books: Book[] }>>((acc, book) => {
    const date = new Date(book.completedAt);
    const yearMonth: YearMonth = {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    };
    const key = yearMonthToKey(yearMonth);

    if (!acc[key]) {
      acc[key] = { yearMonth, books: [] };
    }
    acc[key].books.push(book);

    return acc;
  }, {});

  return Object.values(grouped);
};

export const sortBooksByYearMonthDescending = (bookGroups: BooksByYearMonth[]): BooksByYearMonth[] => {
  return bookGroups.sort((a, b) => {
    if (a.yearMonth.year !== b.yearMonth.year) {
      return b.yearMonth.year - a.yearMonth.year;
    }
    return b.yearMonth.month - a.yearMonth.month;
  });
};