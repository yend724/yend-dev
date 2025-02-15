import { getBooks } from "@/features/books/api/books";

import { Link } from "@/shared/ui/link";

export const Books: React.FC = async () => {
  const { default: books } = await getBooks();
  return (
    <div className="markdown-body">
      <table>
        <thead>
          <tr>
            <th>書籍名</th>
            <th>読了年月</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <tr key={book.link}>
                <td>
                  <Link href={book.link}>{book.title}</Link>
                </td>
                <td className="whitespace-nowrap">{book.completedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
