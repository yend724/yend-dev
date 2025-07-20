import { getBooks } from "@/entities/books/api/books";
import { ReadingRecords } from "@/views/reading-records";

const { default: books } = await getBooks();

const Page: React.FC = () => {
  return <ReadingRecords books={books} />;
};

export default Page;

export const metadata = {
  title: "読んだ書籍一覧",
};
