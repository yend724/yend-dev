export const sortArticlesByIsoDate = <T extends { isoDate: string }>(
  articles: T[]
) => {
  return articles.sort((a, b) => {
    return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
  });
};
