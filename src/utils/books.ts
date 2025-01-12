export const getBooks = async () => {
  const post = (await import("@/contents/reading-log/index.mdx")) as {
    default: React.FC;
  };
  return { ...post };
};
