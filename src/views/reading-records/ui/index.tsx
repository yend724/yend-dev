import { Books } from "@/entities/books";
import { type Book } from "@/entities/books/api/books";
import { GroupByMonth } from "./group-by-month";

type Props = {
  books: Book[];
};
export const ReadingRecords: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid gap-8">
      <h1 className="text-xl font-semibold text-white">読んだ書籍一覧</h1>
      <GroupByMonth
        books={books}
        renderGroupBooksByMonth={(books) => <Books books={books} />}
      />
    </div>
  );
};
