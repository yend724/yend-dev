import { useCallback, useMemo, useState } from "react";

import type { ArticlePreviewInterface } from "@/entities/article";

const FILTER = {
  zenn: true,
  qiita: true,
  yend: true,
};

export const useFilterArticles = (articles: ArticlePreviewInterface[]) => {
  const [filters, setFilters] = useState<typeof FILTER>(FILTER);

  const handleFilterChange = useCallback(
    (key: keyof typeof FILTER, value: boolean) => {
      setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    },
    []
  );

  const filteredArticles = useMemo(() => {
    return articles.filter(
      (article) => filters[article.platform as keyof typeof FILTER]
    );
  }, [articles, filters]);

  return {
    filters,
    filteredArticles,
    handleFilterChange,
  };
};
