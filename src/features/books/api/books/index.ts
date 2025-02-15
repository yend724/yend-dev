export const getBooks = async () => {
  const books = await import("@/resources/books/books.json");
  return books;
};
