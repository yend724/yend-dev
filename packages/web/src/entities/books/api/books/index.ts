export const getBooks = async () => {
  const books = await import("@/resources/books/books.json");
  return books;
};

export type Book = {
  title: string;
  link: string;
  completedAt: string; // ISO date string
};
