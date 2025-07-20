import { getBooks } from "@/entities/books/api/books";
import { ReadingRecords } from "@/views/reading-records";

const { default: books } = await getBooks();

export const metadata = {
  title: "読んだ書籍一覧",
};

const Page = () => {
  return <ReadingRecords books={books} />;
};

export default Page;
