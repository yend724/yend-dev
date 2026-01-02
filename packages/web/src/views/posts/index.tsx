import { ArticlePreviewInterface } from "../../entities/article";
import { FilterArticles } from "../../features/filter-articles";

type Props = {
  articles: ArticlePreviewInterface[];
};
export const Posts: React.FC<Props> = ({ articles }) => {
  return (
    <div className="grid gap-8">
      <h1 className="text-xl font-semibold">書いたやつ一覧</h1>
      <FilterArticles articles={articles} />
    </div>
  );
};
