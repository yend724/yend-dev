import { getBooksV2 } from "@/entities/books/api/books";
import { ReadingRecords } from "@/views/reading-records";

const { default: booksJsonV2 } = await getBooksV2();

const books = booksJsonV2.filter((book) => book.isbn13);

const Page = () => {
  return <ReadingRecords books={books} />;
};

export default Page;
export type Book = (typeof books)[number];
