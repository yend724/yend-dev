"use client";
import {
  ArticlePreview,
  type ArticlePreviewInterface,
} from "@/entities/article";
import { SearchIcon } from "lucide-react";
import { useFilterArticles } from "./hooks/useFilterArticles";

const FILTER_LABEL_MAP = {
  zenn: "Zenn",
  qiita: "Qiita",
  yend: "YEND.DEV",
};

type Props = {
  articles: ArticlePreviewInterface[];
};
export const FilterArticles: React.FC<Props> = ({ articles }) => {
  const {
    filters,
    searchTerm,
    filteredArticles,
    handleFilterChange,
    handleSearchTermChange,
  } = useFilterArticles(articles);

  const filterKeys = Object.keys(filters) as (keyof typeof filters)[];

  return (
    <div className="space-y-8">
      <div className="grid gap-y-4">
        <div className="relative">
          <SearchIcon
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2"
            width={16}
            height={16}
          />
          <input
            className="w-full rounded-sm border border-neutral-200/20 py-1 pr-2 pl-7"
            type="text"
            placeholder="タイトルを検索..."
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
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
      <div className="grid gap-y-8">
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
