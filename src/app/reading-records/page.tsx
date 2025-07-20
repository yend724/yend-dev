import { getBooks } from "@/entities/books/api/books";
import { ReadingRecords } from "@/views/reading-records";

const { default: books } = await getBooks();

const Page = () => {
  return <ReadingRecords books={books} />;
};

export default Page;
