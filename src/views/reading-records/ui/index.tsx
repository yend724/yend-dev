import { Books } from "@/entities/books";
import { type Book } from "@/entities/books/api/books";

type Props = {
  books: Book[];
};
export const ReadingRecords: React.FC<Props> = ({ books }) => {
  return (
    <div className="grid gap-8">
      <h1 className="text-xl font-semibold text-white">読んだ書籍一覧</h1>
      <Books books={books} />
    </div>
  );
};
