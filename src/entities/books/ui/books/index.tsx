import { LinkText } from "@/shared/ui/link-text";
import { getBooks } from "../../api/books";

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
                  <LinkText href={book.link}>{book.title}</LinkText>
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
