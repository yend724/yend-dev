export const getBooks = async () => {
  const books = await import("@/resources/books/books.json");
  return books;
};
export const getBooksV2 = async () => {
  const books = await import("@/resources/books/books.v2.json");
  return books;
};
