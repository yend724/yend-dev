import { type Book } from "../../../../../entities/books/api/books";

type GroupedBooksByMonth = {
  year: string;
  month: string;
  books: Book[];
};
export const convertGroupBooksByMonth = (
  books: Book[]
): GroupedBooksByMonth[] => {
  const groupedBooks: GroupedBooksByMonth[] = books.reduce<
    GroupedBooksByMonth[]
  >((acc, book) => {
    const [year, month] = book.completedAt.split(" ")[0].split("-");

    // すでに同じ年月のグループがあるかを確認
    const index = acc.findIndex(
      (group) => group.year === year && group.month === month
    );

    if (index === -1) {
      // グループが存在しない場合：新しい配列を返す
      return [
        ...acc,
        {
          year,
          month,
          books: [book],
        },
      ];
    }

    // グループが存在する場合：対象だけ差し替える新しい配列を返す
    return acc.map((group, i) =>
      i === index ? { ...group, books: [...group.books, book] } : group
    );
  }, []);

  return groupedBooks;
};
