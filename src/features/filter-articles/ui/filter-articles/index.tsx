"use client";
import { useFilterArticles } from "./hooks/useFilterArticles";

import {
  ArticlePreview,
  type ArticlePreviewInterface,
} from "@/entities/article";
// import { SearchIcon } from "lucide-react";

const FILTER_LABEL_MAP = {
  zenn: "Zenn",
  qiita: "Qiita",
  yend: "YEND.DEV",
};

type Props = {
  articles: ArticlePreviewInterface[];
};
export const FilterArticles: React.FC<Props> = ({ articles }) => {
  const { filters, filteredArticles, handleFilterChange } =
    useFilterArticles(articles);

  const filterKeys = Object.keys(filters) as (keyof typeof filters)[];

  return (
    <div className="space-y-8">
      <div className="grid gap-y-4">
        <fieldset className="flex flex-wrap gap-4">
          {filterKeys.map((filter) => (
            <label
              key={filter}
              className="flex cursor-pointer items-center gap-x-2"
            >
              <input
                type="checkbox"
                checked={filters[filter]}
                onChange={() => handleFilterChange(filter, !filters[filter])}
              />
              <span>{FILTER_LABEL_MAP[filter]}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="grid gap-y-4">
        {filteredArticles.map((article) => (
          <ArticlePreview key={article.id} article={article} />
        ))}
        {filteredArticles.length === 0 && (
          <p>検索条件に一致する記事が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};
