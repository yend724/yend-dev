import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const postsDir = path.join(__dirname, "posts");
export const booksDir = path.join(__dirname, "books");
