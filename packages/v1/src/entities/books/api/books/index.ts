export type { Book } from "@yend.dev/resources/books";

export const getBooks = async () => {
  const { books } = await import("@yend.dev/resources/books");
  return books;
};
