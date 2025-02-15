"use client";
import type { Article as ArticleInterface } from "@/entities/rss-feed";
import { useState } from "react";
import { Article } from "../article";
import { FILTER, FILTER_KEYS, FILTER_MAP } from "../constants";

type Props = {
  articles: ArticleInterface[];
};
export const ArticlesPresentation: React.FC<Props> = ({ articles }) => {
  const [filters, setFilters] = useState<typeof FILTER>(FILTER);
  const filteredArticles = articles.filter(
    (article) => filters[article.source],
  );

  return (
    <div className="space-y-8">
      <fieldset className="flex flex-wrap gap-4">
        {FILTER_KEYS.map((filter) => (
          <label
            key={filter}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <input
              type="checkbox"
              checked={filters[filter]}
              onChange={() => {
                setFilters({
                  ...filters,
                  [filter]: !filters[filter],
                });
              }}
            />
            <span>{FILTER_MAP[filter]}</span>
          </label>
        ))}
      </fieldset>
      <div className="grid gap-y-8">
        {filteredArticles.map((article) => (
          <Article key={article.id} article={article} />
        ))}
        {filteredArticles.length === 0 && <p>記事が見つかりませんでした。</p>}
      </div>
    </div>
  );
};
